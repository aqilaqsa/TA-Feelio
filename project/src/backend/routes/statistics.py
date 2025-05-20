from flask import Blueprint, jsonify, request
from db import db
from models import Response, User
from sqlalchemy import func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import joinedload

statistics = Blueprint("statistics", __name__)

@statistics.route("/user/<int:user_id>/stats", methods=["GET"])
def get_user_stats(user_id):
    try:
        total_attempted = db.session.query(func.count(Response.id)).filter_by(user_id=user_id).scalar()
        total_correct = db.session.query(func.count(Response.id)).filter_by(user_id=user_id, is_correct=True).scalar()

        emotion_labels = ['happy', 'sad', 'angry', 'embarrassed', 'fear', 'envy']
        per_emotion = []

        for emotion in emotion_labels:
            total_emotion = db.session.query(Response).filter(
                Response.user_id == user_id,
                Response.predicted_emotion.op("@>")(f'{{"{emotion}"}}')
            ).count()

            correct_emotion = db.session.query(Response).filter(
                Response.user_id == user_id,
                Response.predicted_emotion.op("@>")(f'{{"{emotion}"}}'),
                Response.is_correct == True
            ).count()

            per_emotion.append({
                'emotion': emotion,
                'total': total_emotion,
                'correct': correct_emotion
            })

        # ✅ Moved here
        user = db.session.query(User).filter_by(id=user_id).first()
        total_score = user.total_score if user else 0

        return jsonify({
            'total_attempted': total_attempted,
            'total_correct': total_correct,
            'per_emotion': per_emotion,
            'total_score': total_score
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@statistics.route("/user/<int:user_id>/responses", methods=["GET"])
def get_recent_responses(user_id):
    limit = request.args.get("limit", type=int)  # no default limit here

    try:
        query = db.session.query(Response)\
            .options(joinedload(Response.narrative))\
            .filter_by(user_id=user_id)\
            .order_by(Response.created_at.desc())

        if limit:
            query = query.limit(limit)

        rows = query.all()

        data = []
        for r in rows:
            narrative = getattr(r, "narrative", None)
            data.append({
                'id': r.id,
                'narrative_id': r.narrative_id,
                'narrative': {
                    'title': narrative.title if narrative else "",
                    'content': narrative.content if narrative else ""
                },
                'user_answer': r.user_answer,
                'predicted_emotion': r.predicted_emotion,
                'expected_emotions': narrative.emotion_labels if narrative else [],
                'narrative_text': narrative.content if narrative else "",
                'is_correct': r.is_correct,
                'feedback': r.feedback,
                'created_at': r.created_at.isoformat(),
                'score': r.score,
                'repeatable': r.repeatable,
                'flagged': r.flagged,
            })

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
