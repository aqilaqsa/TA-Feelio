from flask import Blueprint, request, jsonify
from db import db
from models import Response, Badge, UserBadge, User
from datetime import datetime
from sqlalchemy import func
from sqlalchemy.orm import joinedload

responses = Blueprint("responses", __name__)

@responses.route("/responses", methods=["POST"])
def save_response():
    data = request.json
    try:
        response = Response(
            user_id=data["user_id"],
            narrative_id=data["narrative_id"],
            user_answer=data["user_answer"],
            predicted_emotion=data["predicted_emotion"],
            is_correct=data["is_correct"],
            score=data.get("score", 0),
            repeatable=False,
            flagged=False,
            feedback=data["feedback"],
            created_at=datetime.utcnow()
        )
        db.session.add(response)

        user = db.session.query(User).filter_by(id=data["user_id"]).first()

        # Only assign score if it's correct and first time this narrative_id is answered correctly
        already_correct = db.session.query(Response).filter_by(
            user_id=data["user_id"],
            narrative_id=data["narrative_id"],
            is_correct=True
        ).first()

        if data["is_correct"] and not already_correct:
            response.score = 10  # or your scoring logic
            award_badges_if_needed(user.id)

        # Recalculate total_score
        if user:
            response_score = db.session.query(func.sum(Response.score))\
                .filter_by(user_id=user.id, is_correct=True).scalar() or 0

            badge_score = db.session.query(func.sum(Badge.points))\
                .join(UserBadge, UserBadge.badge_id == Badge.id)\
                .filter(UserBadge.user_id == user.id).scalar() or 0

            user.total_score = response_score + badge_score
            award_badges_if_needed(user.id)

        db.session.commit()
        return jsonify({"id": response.id, "message": "Response saved"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@responses.route("/user/<int:user_id>/responses", methods=["GET"])
def get_user_responses(user_id):
    try:
        limit = request.args.get("limit", type=int)

        query = db.session.query(Response)\
            .options(joinedload(Response.narrative))\
            .filter_by(user_id=user_id)\
            .order_by(Response.created_at.desc())

        if limit:
            query = query.limit(limit)

        rows = query.all()

        data = []
        for r in rows:
            data.append({
                'id': r.id,
                'narrative_id': r.narrative_id,
                'narrative': {
                    'title': r.narrative.title,
                    'content': r.narrative.content
                },
                'user_answer': r.user_answer,
                'predicted_emotion': r.predicted_emotion,
                'expected_emotions': r.narrative.emotion_labels,
                'narrative_text': r.narrative.content,
                'is_correct': r.is_correct,
                'feedback': r.feedback,
                'score': r.score,
                'repeatable': r.repeatable,
                'response_id': r.id,
                'created_at': r.created_at.isoformat(),
                'flagged': r.flagged
            })

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === BADGE LOGIC ===

def already_has_badge(user_id, badge_id):
    return db.session.query(UserBadge).filter_by(user_id=user_id, badge_id=badge_id).first() is not None

def award_badges_if_needed(user_id):
    def grant(badge_id, badge_point):
        if not already_has_badge(user_id, badge_id):
            db.session.add(UserBadge(user_id=user_id, badge_id=badge_id))
            user = db.session.query(User).filter_by(id=user_id).first()
            if user:
                user.total_score += badge_point

    correct_count = db.session.query(func.count(Response.id))\
        .filter_by(user_id=user_id, is_correct=True).scalar() or 0

    total_score = db.session.query(func.sum(Response.score))\
        .filter_by(user_id=user_id, is_correct=True).scalar() or 0

    emotion_types = db.session.query(func.unnest(Response.predicted_emotion))\
        .filter(Response.user_id == user_id, Response.is_correct == True)\
        .distinct().all()
    emotion_set = set([e[0].lower() for e in emotion_types])

    if correct_count >= 1: grant(1, 10)
    if correct_count >= 5: grant(2, 20)
    if correct_count >= 10: grant(3, 30)
    if correct_count >= 20: grant(4, 40)

    if total_score >= 100: grant(5, 20)
    if total_score >= 200: grant(6, 30)
    if total_score >= 500: grant(7, 50)
    if total_score >= 1000: grant(8, 100)

    if len(emotion_set) >= 3: grant(9, 25)
    if len(emotion_set) == 6: grant(10, 50)

    if "happy" in emotion_set: grant(11, 15)
    if "envy" in emotion_set: grant(12, 15)

# === CORRECTION ROUTES ===

@responses.route("/responses/<int:id>/override-correct", methods=["PATCH"])
def override_correct(id):
    try:
        response = db.session.query(Response).get(id)
        if not response:
            return jsonify({"error": "Response not found"}), 404

        if not response.is_correct:
            response.is_correct = True
            response.score = 10

            user = db.session.query(User).filter_by(id=response.user_id).first()
            if user:
                response_score = db.session.query(func.sum(Response.score))\
                    .filter_by(user_id=user.id, is_correct=True).scalar() or 0
                badge_score = db.session.query(func.sum(Badge.points))\
                    .join(UserBadge, UserBadge.badge_id == Badge.id)\
                    .filter(UserBadge.user_id == user.id).scalar() or 0
                user.total_score = response_score + badge_score
                award_badges_if_needed(user.id)

        db.session.commit()
        return jsonify({"message": "Marked as correct."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@responses.route("/responses/<int:id>/override-incorrect", methods=["PATCH"])
def override_incorrect(id):
    try:
        response = db.session.query(Response).get(id)
        if not response:
            return jsonify({"error": "Response not found"}), 404

        if response.is_correct:
            response.is_correct = False
            response.score = 0

            user = db.session.query(User).filter_by(id=response.user_id).first()
            if user:
                response_score = db.session.query(func.sum(Response.score))\
                    .filter_by(user_id=user.id, is_correct=True).scalar() or 0
                badge_score = db.session.query(func.sum(Badge.points))\
                    .join(UserBadge, UserBadge.badge_id == Badge.id)\
                    .filter(UserBadge.user_id == user.id).scalar() or 0
                user.total_score = response_score + badge_score
                award_badges_if_needed(user.id)

        db.session.commit()
        return jsonify({"message": "Marked as incorrect."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@responses.route("/responses/<int:id>/mark-repeatable", methods=["PATCH"])
def mark_response_repeatable(id):
    try:
        response = db.session.query(Response).get(id)
        if not response:
            return jsonify({"error": "Response not found"}), 404

        response.repeatable = True
        db.session.commit()
        return jsonify({"message": "Response marked as repeatable."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@responses.route("/responses/<int:id>/unmark-repeatable", methods=["PATCH"])
def unmark_response_repeatable(id):
    try:
        response = db.session.query(Response).get(id)
        if not response:
            return jsonify({"error": "Response not found"}), 404

        response.repeatable = False
        db.session.commit()
        return jsonify({"message": "Response unmarked from repeatable."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@responses.route("/responses/flag-latest", methods=["POST"])
def flag_latest_response():
    data = request.json
    user_id = data.get("user_id")
    narrative_id = data.get("narrative_id")

    if not user_id or not narrative_id:
        return jsonify({"error": "Missing user_id or narrative_id"}), 400

    latest_response = db.session.query(Response)\
        .filter_by(user_id=user_id, narrative_id=narrative_id)\
        .order_by(Response.created_at.desc()).first()

    if not latest_response:
        return jsonify({"error": "Response not found"}), 404

    latest_response.flagged = True
    db.session.commit()
    return jsonify({"message": "Response flagged"}), 200

@responses.route("/responses/<int:response_id>/flag", methods=["POST"])
def flag_specific_response(response_id):
    response = db.session.query(Response).get(response_id)
    if not response:
        return jsonify({"error": "Response not found"}), 404
    response.flagged = True
    db.session.commit()
    return jsonify({"message": "Response flagged"}), 200

@responses.route("/responses/<int:id>/unflag", methods=["PATCH"])
def unflag_response(id):
    try:
        response = db.session.query(Response).get(id)
        if not response:
            return jsonify({"error": "Response not found"}), 404

        response.flagged = False
        db.session.commit()
        return jsonify({"message": "Response unflagged."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# In routes/responses.py

@responses.route("/responses/<int:id>/add_followup", methods=["PATCH"])
def add_followup_to_response(id):
    data = request.json
    try:
        response = db.session.query(Response).get(id)
        if not response:
            return jsonify({"error": "Response not found"}), 404

        response.feedback = data.get("feedback", response.feedback)

        # optional: add response.strategy = data.get("strategy") if you support that

        user = db.session.query(User).filter_by(id=response.user_id).first()
        if user:
            response_score = db.session.query(func.sum(Response.score))\
                .filter_by(user_id=user.id, is_correct=True).scalar() or 0
            badge_score = db.session.query(func.sum(Badge.points))\
                .join(UserBadge, UserBadge.badge_id == Badge.id)\
                .filter(UserBadge.user_id == user.id).scalar() or 0
            user.total_score = response_score + badge_score
            award_badges_if_needed(user.id)

        db.session.commit()
        return jsonify({"message": "Follow-up added"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

