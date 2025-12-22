# backend/database.py

import sqlite3
from datetime import datetime
import json

class Database:
    def __init__(self, db_name="ai_tutor.db"):
        self.db_name = db_name
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Initialize database tables"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Check if quiz_history table exists and has correct schema
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='quiz_history'")
        table_exists = cursor.fetchone()

        if table_exists:
            # Check if the table has the 'total' column
            cursor.execute("PRAGMA table_info(quiz_history)")
            columns = [column[1] for column in cursor.fetchall()]
            
            if 'total' not in columns:
                print("Upgrading database schema...")
                # Drop old table and create new one
                cursor.execute("DROP TABLE IF EXISTS quiz_history")
                table_exists = None

        if not table_exists:
            # Create quiz_history table with correct schema
            cursor.execute("""
            CREATE TABLE quiz_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL,
                difficulty TEXT NOT NULL,
                quiz_type TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """)
            print("Created quiz_history table with correct schema")

        conn.commit()
        conn.close()

    def create_user(self, username, hashed_password):
        """Create new user"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, hashed_password)
            )
            conn.commit()
            user_id = cursor.lastrowid
            conn.close()
            return user_id
        except sqlite3.IntegrityError:
            return None

    def get_user(self, username):
        """Get user by username"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None

    def save_quiz_result(self, user_id, score, total, difficulty, quiz_type):
        """Save quiz result"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO quiz_history (user_id, score, total, difficulty, quiz_type)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, score, total, difficulty, quiz_type))
            conn.commit()
            conn.close()
            print(f"Quiz result saved: {score}/{total} - {difficulty}")
        except Exception as e:
            print(f"Error saving quiz result: {e}")

    def get_user_history(self, user_id, limit=10):
        """Get user's quiz history"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT score, total, difficulty, quiz_type, timestamp
                FROM quiz_history
                WHERE user_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
            """, (user_id, limit))
            history = cursor.fetchall()
            conn.close()
            return [dict(row) for row in history]
        except Exception as e:
            print(f"Error getting user history: {e}")
            return []

    def get_user_stats(self, user_id):
        """Get user statistics"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_quizzes,
                    AVG(CAST(score AS FLOAT) / CAST(total AS FLOAT)) as avg_score,
                    MAX(score) as best_score,
                    MAX(total) as best_total
                FROM quiz_history
                WHERE user_id = ?
            """, (user_id,))
            
            stats = cursor.fetchone()
            conn.close()
            return dict(stats) if stats else None
        except Exception as e:
            print(f"Error getting user stats: {e}")
            return None

    def delete_all_quiz_history(self):
        """Delete all quiz history (for testing/reset)"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM quiz_history")
            conn.commit()
            conn.close()
            print("All quiz history deleted")
        except Exception as e:
            print(f"Error deleting quiz history: {e}")

    def reset_database(self):
        """Reset entire database (for testing)"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("DROP TABLE IF EXISTS quiz_history")
            cursor.execute("DROP TABLE IF EXISTS users")
            conn.commit()
            conn.close()
            print("Database reset complete")
            self.init_db()
        except Exception as e:
            print(f"Error resetting database: {e}")