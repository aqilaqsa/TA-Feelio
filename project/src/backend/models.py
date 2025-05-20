from db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    segment = db.Column(db.Integer, nullable=False)  # 1 or 2
    role = db.Column(db.String(20), default="kid") # "kid" or "mentor"  
    parent_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    total_score = db.Column(db.Integer, default=0)  

class Narrative(db.Model):
    __tablename__ = 'narratives'

    id = db.Column(db.String(10), primary_key=True)              # character varying(10)
    title = db.Column(db.Text, nullable=False)                   # text
    content = db.Column(db.Text, nullable=False)                 # text
    image_path = db.Column(db.Text, nullable=True)               # text
    emotion_labels = db.Column(db.ARRAY(db.Text), nullable=False)  # text[]
    segment = db.Column(db.Integer, nullable=False)              # integer

    # Relationship to responses
    responses = db.relationship('Response', backref='narrative', lazy=True)

class Response(db.Model):
    __tablename__ = 'responses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    narrative_id = db.Column(db.String(10), db.ForeignKey('narratives.id'), nullable=False)
    user_answer = db.Column(db.Text, nullable=False)
    predicted_emotion = db.Column(db.ARRAY(db.Text), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text)
    repeatable = db.Column(db.Boolean, default=False)  # Revisi
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    flagged = db.Column(db.Boolean, default=False)


class Badge(db.Model):
    __tablename__ = 'badges'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    points = db.Column(db.Integer, default=50)

class UserBadge(db.Model):
    __tablename__ = 'user_badges'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id'), nullable=False)
    date_earned = db.Column(db.DateTime, default=datetime.utcnow)
