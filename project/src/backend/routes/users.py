from flask import Blueprint, request, jsonify
from models import User
from db import db
from passlib.hash import bcrypt
from sqlalchemy import func

users = Blueprint("users", __name__)

@users.route('/user/<int:user_id>/verify-password', methods=['POST'])
def verify_password(user_id):
    data = request.json
    user = db.session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not bcrypt.verify(data["password"], user.password_hash):
        return jsonify({"valid": False}), 200

    return jsonify({"valid": True}), 200
