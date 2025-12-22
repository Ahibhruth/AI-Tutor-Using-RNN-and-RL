# backend/app.py

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import os
import secrets
from datetime import timedelta
from werkzeug.utils import secure_filename
import bcrypt

from quiz_engine import QuizEngine
from database import Database

app = Flask(__name__)

# CORS configuration for session support
CORS(app, supports_credentials=True, origins=["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:5500"])

# Session configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_HTTPONLY'] = True
Session(app)

# Upload configuration
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize database
db = Database()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    return jsonify({
        "status": "AI Tutor Backend Running",
        "version": "2.0",
        "endpoints": ["/api/signup", "/api/login", "/api/upload", "/api/get_question", "/api/submit", "/api/retry", "/api/history"]
    })

# -------------------------
# USER AUTHENTICATION
# -------------------------
@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        username = data.get("username", "").strip()
        password = data.get("password", "")

        if not username or not password:
            return jsonify({"success": False, "error": "Username and password required"}), 400

        if len(password) < 6:
            return jsonify({"success": False, "error": "Password must be at least 6 characters"}), 400

        # Hash password
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user_id = db.create_user(username, hashed.decode('utf-8'))
        
        if user_id:
            session['user_id'] = user_id
            session['username'] = username
            return jsonify({"success": True, "username": username})
        else:
            return jsonify({"success": False, "error": "Username already exists"}), 400

    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        username = data.get("username", "").strip()
        password = data.get("password", "")

        if not username or not password:
            return jsonify({"success": False, "error": "Username and password required"}), 400

        user = db.get_user(username)
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            session['user_id'] = user['id']
            session['username'] = username
            
            # Load user's quiz history for RL
            history = db.get_user_history(user['id'])
            
            return jsonify({
                "success": True,
                "username": username,
                "history_count": len(history)
            })
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})

# -------------------------
# UPLOAD PDF & GENERATE QUIZ
# -------------------------
@app.route("/api/upload", methods=["POST"])
def upload():
    try:
        # Check authentication
        if 'user_id' not in session:
            return jsonify({"success": False, "error": "Not authenticated"}), 401

        # Check file
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file provided"}), 400

        file = request.files['file']
        quiz_type = request.form.get('quiz_type', 'mcq')
        num_questions = int(request.form.get('num_questions', 10))

        print(f"Received upload request: quiz_type={quiz_type}, num_questions={num_questions}")

        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({"success": False, "error": "Only PDF files allowed"}), 400

        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, f"{session['user_id']}_{filename}")
        file.save(filepath)

        print(f"File saved to: {filepath}")

        # Get user's performance history for adaptive difficulty
        user_id = session['user_id']
        history = db.get_user_history(user_id)
        
        # Create new quiz engine with user history
        quiz_engine = QuizEngine(user_id, history)
        
        # Extract text from PDF
        print("Extracting text from PDF...")
        text = quiz_engine.extract_text_from_pdf(filepath)
        print(f"Extracted text length: {len(text)} characters, {len(text.split())} words")
        
        if len(text.split()) < 50:
            os.remove(filepath)
            return jsonify({"success": False, "error": "PDF contains insufficient text (minimum 50 words required)"}), 400

        # Generate questions
        print(f"Generating {num_questions} questions of type {quiz_type}...")
        questions = quiz_engine.generate_questions(text, quiz_type, num_questions)
        
        print(f"Generated {len(questions)} questions")
        
        if not questions or len(questions) == 0:
            os.remove(filepath)
            return jsonify({"success": False, "error": "Could not generate questions from this PDF. Please try a different document."}), 400

        # Store quiz data in session
        session['quiz_data'] = {
            'questions': questions,
            'current_index': 0,
            'score': 0,
            'total': len(questions),
            'quiz_type': quiz_type,
            'difficulty': quiz_engine.difficulty,
            'answers': []
        }
        session.modified = True

        # Clean up file
        os.remove(filepath)

        print(f"Quiz created successfully with {len(questions)} questions")

        return jsonify({
            "success": True,
            "total_questions": len(questions),
            "word_count": len(text.split()),
            "initial_difficulty": quiz_engine.difficulty
        })

    except Exception as e:
        print(f"Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Error processing PDF: {str(e)}"}), 500

# -------------------------
# GET QUESTION
# -------------------------
@app.route("/api/get_question", methods=["GET"])
def get_question():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401

        if 'quiz_data' not in session:
            return jsonify({"error": "No active quiz. Please upload a PDF first."}), 400

        quiz_data = session['quiz_data']
        
        if quiz_data['current_index'] >= quiz_data['total']:
            # Quiz finished
            return jsonify({
                "finished": True,
                "score": quiz_data['score'],
                "total": quiz_data['total'],
                "percentage": round((quiz_data['score'] / quiz_data['total']) * 100, 1),
                "difficulty": quiz_data.get('difficulty', 'medium')
            })

        question = quiz_data['questions'][quiz_data['current_index']]
        
        print(f"Sending question {quiz_data['current_index'] + 1}/{quiz_data['total']}: {question['type']}")
        
        return jsonify({
            "finished": False,
            "question": question['question'],
            "type": question['type'],
            "options": question.get('options', []),
            "difficulty": question['difficulty'],
            "question_number": quiz_data['current_index'] + 1,
            "total_questions": quiz_data['total']
        })

    except Exception as e:
        print(f"Get question error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# -------------------------
# SUBMIT ANSWER
# -------------------------
@app.route("/api/submit", methods=["POST"])
def submit():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401

        if 'quiz_data' not in session:
            return jsonify({"error": "No active quiz"}), 400

        data = request.json
        user_answer = data.get("answer", "").strip()

        quiz_data = session['quiz_data']
        current_q = quiz_data['questions'][quiz_data['current_index']]
        correct_answer = current_q['correct_answer']

        print(f"Checking answer: user='{user_answer}', correct='{correct_answer}', type={current_q['type']}")

        # Check answer
        if current_q['type'] == 'mcq':
            correct = user_answer.lower().strip() == correct_answer.lower().strip()
        else:
            # For open-ended, check if key concepts are present
            correct = QuizEngine.check_open_answer(user_answer, correct_answer)

        print(f"Answer is {'correct' if correct else 'incorrect'}")

        # Update score
        if correct:
            quiz_data['score'] += 1

        # Store answer
        quiz_data['answers'].append({
            'question': current_q['question'],
            'user_answer': user_answer,
            'correct_answer': correct_answer,
            'correct': correct,
            'difficulty': current_q['difficulty']
        })

        # Update difficulty using RL
        new_difficulty = QuizEngine.update_difficulty_rl(
            current_q['difficulty'],
            correct,
            quiz_data['score'],
            quiz_data['current_index'] + 1
        )

        print(f"New difficulty: {new_difficulty}")

        # Move to next question
        quiz_data['current_index'] += 1
        quiz_data['difficulty'] = new_difficulty

        # If quiz finished, save to database
        if quiz_data['current_index'] >= quiz_data['total']:
            db.save_quiz_result(
                session['user_id'],
                quiz_data['score'],
                quiz_data['total'],
                new_difficulty,
                quiz_data['quiz_type']
            )
            print(f"Quiz completed! Score: {quiz_data['score']}/{quiz_data['total']}")

        session.modified = True

        return jsonify({
            "correct": correct,
            "correct_answer": correct_answer,
            "new_difficulty": new_difficulty,
            "score": quiz_data['score'],
            "total": quiz_data['total']
        })

    except Exception as e:
        print(f"Submit error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# -------------------------
# RETRY QUIZ
# -------------------------
@app.route("/api/retry", methods=["POST"])
def retry():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401

        if 'quiz_data' in session:
            quiz_data = session['quiz_data']
            quiz_data['current_index'] = 0
            quiz_data['score'] = 0
            quiz_data['answers'] = []
            session.modified = True
            print("Quiz reset for retry")

        return jsonify({"success": True})

    except Exception as e:
        print(f"Retry error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# -------------------------
# GET USER HISTORY
# -------------------------
@app.route("/api/history", methods=["GET"])
def get_history():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401

        history = db.get_user_history(session['user_id'])
        
        return jsonify({
            "success": True,
            "history": history,
            "total_quizzes": len(history)
        })

    except Exception as e:
        print(f"History error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting AI Tutor Backend...")
    print("Server will run on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)