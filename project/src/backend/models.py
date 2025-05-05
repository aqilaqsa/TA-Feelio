from db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    segment = db.Column(db.Integer, nullable=False)  # 1 or 2
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
