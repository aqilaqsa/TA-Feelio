from flask import Blueprint, request, jsonify
from models import Narrative
from db import db

narratives_bp = Blueprint("narratives", __name__)

@narratives_bp.route("/narratives", methods=["GET"])
def get_narratives():
    try:
        segment = request.args.get("segment", type=int)
        if segment is None:
            return jsonify({"error": "Missing 'segment' parameter"}), 400

        rows = db.session.query(Narrative).filter_by(segment=segment).all()

        results = []
        for row in rows:
            results.append({
                "id": row.id,
                "title": row.title,
                "text": row.content,
                "image_path": row.image_path,
                "expectedEmotions": row.emotion_labels,
                "segment": row.segment,
            })

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
