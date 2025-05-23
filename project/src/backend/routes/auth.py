from flask import Blueprint, request, jsonify
from passlib.hash import bcrypt
from models import User
from db import db

auth = Blueprint("auth", __name__)

@auth.route("/signup", methods=["POST"])
def signup():
    data = request.json

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email sudah terdaftar"}), 400

    hashed_pw = bcrypt.hash(data["password"])

    new_user = User(
        name=data["name"],
        email=data["email"],
        password_hash=hashed_pw,
        segment=data["segment"],
        role=data.get("role", "kid"),
        parent_id=data.get("parent_id")
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Berhasil daftar"}), 200

@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not bcrypt.verify(data["password"], user.password_hash):
        return jsonify({"error": "Email atau password salah"}), 401

    return jsonify({
    "message": "Login berhasil",
    "user_id": user.id,
    "name": user.name,
    "segment": user.segment,
    "role": user.role
}), 200

@auth.route("/pendamping/<int:id>/children", methods=["GET"])
def get_children(id):
    users = User.query.filter_by(parent_id=id).all()
    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "segment": u.segment
        } for u in users
    ])
