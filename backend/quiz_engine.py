# backend/quiz_engine.py

import pdfplumber
import nltk
import random
import re
from collections import Counter

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    print("Downloading NLTK punkt...")
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    print("Downloading NLTK stopwords...")
    nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize

class QuizEngine:
    def __init__(self, user_id=None, history=None):
        self.user_id = user_id
        self.history = history or []
        self.difficulty = self._initialize_difficulty()

    def _initialize_difficulty(self):
        """Initialize difficulty based on user history"""
        if not self.history:
            return "easy"
        
        # Calculate average score from recent quizzes
        recent = self.history[-5:]  # Last 5 quizzes
        if not recent:
            return "easy"
        
        avg_score = sum(q['score'] / q['total'] for q in recent if q['total'] > 0) / len(recent)
        
        if avg_score >= 0.8:
            return "hard"
        elif avg_score >= 0.6:
            return "medium"
        else:
            return "easy"

    # ---------------------------------
    # ADVANCED TEXT EXTRACTION
    # ---------------------------------
    def extract_text_from_pdf(self, path):
        """Extract and clean text from PDF"""
        text = ""
        
        try:
            with pdfplumber.open(path) as pdf:
                print(f"PDF has {len(pdf.pages)} pages")
                for i, page in enumerate(pdf.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                        print(f"Extracted {len(page_text)} chars from page {i+1}")
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")

        if not text:
            raise Exception("No text could be extracted from PDF")

        # Clean the text
        text = self._clean_text(text)
        print(f"After cleaning: {len(text)} chars")
        return text

    def _clean_text(self, text):
        """Clean extracted PDF text"""
        # Remove page numbers
        text = re.sub(r'Page\s+\d+\s*(of\s+\d+)?', '', text, flags=re.IGNORECASE)
        
        # Remove headers/footers patterns
        text = re.sub(r'\b(Chapter|Section)\s+\d+\b', '', text)
        
        # Remove citations [1], [2], etc.
        text = re.sub(r'\[\d+\]', '', text)
        
        # Remove URLs
        text = re.sub(r'http[s]?://\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Fix multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Remove very short words (likely artifacts) but keep important short words
        words = text.split()
        words = [w for w in words if len(w) > 1 or w.lower() in ['a', 'i']]
        text = ' '.join(words)
        
        return text.strip()

    # ---------------------------------
    # INTELLIGENT QUESTION GENERATION
    # ---------------------------------
    def generate_questions(self, text, quiz_type="mcq", num_questions=10):
        """Generate questions with intelligent sentence selection"""
        print(f"Generating {num_questions} questions of type {quiz_type}")
        
        # Tokenize into sentences
        try:
            sentences = sent_tokenize(text)
            print(f"Found {len(sentences)} sentences")
        except Exception as e:
            print(f"Error tokenizing: {e}")
            sentences = text.split('.')
        
        # Filter sentences
        filtered_sentences = self._filter_sentences(sentences)
        print(f"After filtering: {len(filtered_sentences)} good sentences")
        
        if len(filtered_sentences) < num_questions:
            print(f"Warning: Only {len(filtered_sentences)} good sentences found, reducing question count")
            num_questions = max(len(filtered_sentences), 1)
        
        # Select best sentences for questions
        selected_sentences = self._select_best_sentences(filtered_sentences, num_questions)
        print(f"Selected {len(selected_sentences)} sentences for questions")
        
        questions = []
        for i, sentence in enumerate(selected_sentences):
            try:
                if quiz_type == "mcq":
                    q = self._create_smart_mcq(sentence)
                else:
                    q = self._create_open_question(sentence)
                
                if q:
                    questions.append(q)
                    print(f"Created question {i+1}/{len(selected_sentences)}")
            except Exception as e:
                print(f"Error creating question {i+1}: {e}")
                continue
        
        print(f"Successfully created {len(questions)} questions")
        return questions

    def _filter_sentences(self, sentences):
        """Filter out poor quality sentences"""
        filtered = []
        stop_words = set(stopwords.words('english'))
        
        for s in sentences:
            s = s.strip()
            
            if not s:
                continue
                
            words = s.split()
            
            # Length check - more lenient
            if len(words) < 5 or len(words) > 50:
                continue
            
            # Must have some meaningful words (not all stop words)
            meaningful = [w for w in words if w.lower() not in stop_words and w.isalnum()]
            if len(meaningful) < 2:
                continue
            
            # Skip sentences with too many numbers (likely tables/data)
            numbers = sum(1 for w in words if any(c.isdigit() for c in w))
            if numbers / len(words) > 0.4:
                continue
            
            # Skip questions (we're generating questions)
            if '?' in s:
                continue
                
            # Skip very repetitive sentences
            if len(set(words)) / len(words) < 0.5:
                continue
            
            filtered.append(s)
        
        return filtered

    def _select_best_sentences(self, sentences, n):
        """Select the most information-rich sentences"""
        if len(sentences) <= n:
            return sentences
            
        stop_words = set(stopwords.words('english'))
        
        scored_sentences = []
        for s in sentences:
            words = [w.lower() for w in word_tokenize(s) if w.isalnum()]
            meaningful_words = [w for w in words if w not in stop_words]
            
            if not meaningful_words:
                continue
            
            # Score based on:
            # 1. Number of meaningful words
            # 2. Unique word ratio
            # 3. Average word length
            unique_ratio = len(set(meaningful_words)) / len(meaningful_words)
            avg_length = sum(len(w) for w in meaningful_words) / len(meaningful_words)
            
            score = len(meaningful_words) * 2 + unique_ratio * 10 + avg_length * 1.5
            
            scored_sentences.append((score, s))
        
        # Sort by score and take top n
        scored_sentences.sort(reverse=True, key=lambda x: x[0])
        return [s for _, s in scored_sentences[:n]]

    def _create_smart_mcq(self, sentence):
        """Create intelligent MCQ"""
        words = word_tokenize(sentence)
        stop_words = set(stopwords.words('english'))
        
        # Find the best word to blank out
        candidates = []
        for i, word in enumerate(words):
            # Clean the word
            clean_word = re.sub(r'[^\w]', '', word)
            
            if (len(clean_word) > 3 and 
                clean_word.lower() not in stop_words and
                clean_word.isalpha() and
                not clean_word.isupper()):  # Avoid acronyms
                candidates.append((i, word, clean_word))
        
        if not candidates:
            return None
        
        # Select a random candidate
        idx, original_word, clean_word = random.choice(candidates)
        
        # Create question with blank
        question_words = words.copy()
        question_words[idx] = "_____"
        question_text = " ".join(question_words)
        
        # Generate distractors (wrong options)
        # Get other meaningful words from sentence
        all_meaningful = [w for w in words if len(w) > 3 and w.lower() not in stop_words and w.isalpha()]
        all_meaningful = [re.sub(r'[^\w]', '', w) for w in all_meaningful]
        all_meaningful = [w for w in all_meaningful if w and w != clean_word]
        
        # Create distractors
        distractors = []
        if len(all_meaningful) >= 3:
            distractors = random.sample(all_meaningful, min(3, len(all_meaningful)))
        else:
            # If not enough words, create variations
            distractors = all_meaningful[:3]
            while len(distractors) < 3:
                distractors.append(f"word_{len(distractors) + 1}")
        
        # Ensure distractors are unique and different from correct answer
        distractors = [d for d in distractors if d.lower() != clean_word.lower()]
        distractors = list(set(distractors))[:3]
        
        # Add more distractors if needed
        while len(distractors) < 3:
            distractors.append(f"Option{len(distractors) + 1}")
        
        # Create options list
        options = distractors + [clean_word]
        random.shuffle(options)
        
        return {
            "type": "mcq",
            "question": f"Choose the correct word to complete this statement:\n\n{question_text}",
            "options": options,
            "correct_answer": clean_word,
            "difficulty": self.difficulty
        }

    def _create_open_question(self, sentence):
        """Create open-ended question"""
        # Extract key words for checking later
        words = word_tokenize(sentence)
        stop_words = set(stopwords.words('english'))
        key_words = [w.lower() for w in words if w.lower() not in stop_words and len(w) > 4 and w.isalpha()]
        
        question_templates = [
            f"Explain the concept described in the following statement:\n\n{sentence}",
            f"In your own words, describe what this means:\n\n{sentence}",
            f"What is the main idea of this statement?\n\n{sentence}",
            f"Summarize the key point from this text:\n\n{sentence}"
        ]
        
        return {
            "type": "open",
            "question": random.choice(question_templates),
            "correct_answer": sentence,
            "key_concepts": key_words[:5],  # Store key concepts for checking
            "difficulty": self.difficulty
        }

    # ---------------------------------
    # RL-BASED DIFFICULTY ADAPTATION
    # ---------------------------------
    @staticmethod
    def update_difficulty_rl(current_difficulty, correct, score, question_num):
        """
        Reinforcement Learning-based difficulty adjustment
        Considers: current performance, running score, and progress
        """
        performance_ratio = score / question_num if question_num > 0 else 0
        
        # Easy level
        if current_difficulty == "easy":
            # Move to medium if doing well
            if correct and performance_ratio >= 0.7:
                return "medium"
            return "easy"
        
        # Medium level
        elif current_difficulty == "medium":
            # Move to hard if excelling
            if correct and performance_ratio >= 0.8:
                return "hard"
            # Move to easy if struggling
            elif not correct and performance_ratio < 0.5:
                return "easy"
            return "medium"
        
        # Hard level
        else:  # hard
            # Move to medium if struggling
            if not correct and performance_ratio < 0.6:
                return "medium"
            return "hard"

    @staticmethod
    def check_open_answer(user_answer, correct_answer):
        """Check open-ended answer using keyword matching"""
        if not user_answer or len(user_answer) < 10:
            return False
        
        # Extract key words from both answers
        stop_words = set(stopwords.words('english'))
        
        def extract_keywords(text):
            words = word_tokenize(text.lower())
            return set(w for w in words if w.isalpha() and w not in stop_words and len(w) > 3)
        
        user_keywords = extract_keywords(user_answer)
        correct_keywords = extract_keywords(correct_answer)
        
        if not correct_keywords:
            return len(user_answer) >= 20  # At least reasonable effort
        
        # Calculate overlap
        overlap = len(user_keywords & correct_keywords) / len(correct_keywords)
        
        # Accept if 30% of keywords are present and answer is substantial
        return overlap >= 0.3 and len(user_answer) >= 20