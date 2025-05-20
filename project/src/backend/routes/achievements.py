from flask import Blueprint, jsonify
from db import db
from models import UserBadge, Badge, Response, User
from sqlalchemy import func

achievements_bp = Blueprint("achievements", __name__)


@achievements_bp.route("/user/<int:user_id>/achievements", methods=["GET"])
def get_achievements(user_id):
    try:
        rows = db.session.query(UserBadge, Badge).join(Badge, UserBadge.badge_id == Badge.id)\
            .filter(UserBadge.user_id == user_id).all()

        result = []
        for ub, badge in rows:
            result.append({
                "id": ub.id,
                "userId": ub.user_id,
                "badge": {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "imageSrc": badge.name.lower().replace(" ", "-"),
                    "points": badge.points  # ✅ FIXED: dynamic value
                },
                "points": badge.points,
                "dateEarned": ub.date_earned.isoformat()
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@achievements_bp.route("/user/<int:user_id>/upcoming-badges", methods=["GET"])
def get_upcoming(user_id):
    try:
        earned_ids = db.session.query(UserBadge.badge_id).filter_by(user_id=user_id).subquery()
        upcoming = db.session.query(Badge).filter(~Badge.id.in_(earned_ids)).all()

        result = []
        for b in upcoming:
            result.append({
                "id": b.id,
                "name": b.name,
                "description": b.description,
                "imageSrc": b.name.lower().replace(" ", "-")
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@achievements_bp.route("/user/<int:user_id>/summary", methods=["GET"])
def get_summary(user_id):
    try:
        # ✅ Combine response + badge points
        response_score = db.session.query(func.sum(Response.score))\
            .filter_by(user_id=user_id).scalar() or 0

        badge_score = db.session.query(func.sum(Badge.points))\
            .join(UserBadge, UserBadge.badge_id == Badge.id)\
            .filter(UserBadge.user_id == user_id).scalar() or 0

        total_score = response_score + badge_score

        completed = db.session.query(func.count(Response.id)).filter_by(user_id=user_id).scalar()
        return jsonify({
            "total_score": total_score,         # ✅ Match frontend casing
            "total_responses": completed        # ✅ Match frontend casing
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
