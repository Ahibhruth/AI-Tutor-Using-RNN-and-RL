# backend/config.py
"""
Configuration settings for AI Quiz Tutor
"""

import os

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Flask settings
SECRET_KEY = 'your-secret-key-change-in-production'
DEBUG = True
HOST = '0.0.0.0'
PORT = 5000

# File upload settings
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB

# Student data
STUDENT_DATA_FOLDER = os.path.join(BASE_DIR, 'student_data')

# Model settings
MODEL_FOLDER = os.path.join(BASE_DIR, 'trained_models')
NUM_SKILLS = 10
NUM_DIFFICULTY_LEVELS = 3

# Quiz settings
DEFAULT_NUM_QUESTIONS = 10
MIN_QUESTIONS = 5
MAX_QUESTIONS = 20

# Create directories if they don't exist
for folder in [UPLOAD_FOLDER, STUDENT_DATA_FOLDER, MODEL_FOLDER]:
    os.makedirs(folder, exist_ok=True)