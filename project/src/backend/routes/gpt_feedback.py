from flask import Blueprint, request, jsonify
import openai
import os

gpt = Blueprint("gpt", __name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

@gpt.route("/gpt-feedback", methods=["POST"])
def gpt_feedback():
    data = request.json
    answer = data.get("answer", "")
    expected_emotions = data.get("expected_emotions", [])
    is_correct = data.get("is_correct", False)
    narrative_text = data.get("narrative", "")
    segment = data.get("segment", "7-9")  # default to 7-9 if not provided

    # ⛔️ Don't give GPT feedback early for segment 2
    if segment == "10-12" and not data.get("followup", False):
        return jsonify({"feedback": None})

    prompt = f"""
Kamu adalah mentor untuk anak usia 7–12 tahun. Tugasmu adalah memberikan umpan balik positif dan edukatif agar anak bisa mengenali emosi dengan lebih baik.

Cerita yang dibaca anak adalah:
"{narrative_text}"

Jawaban anak: "{answer}"

Jawaban ini dianggap {'benar' if is_correct else 'belum tepat'} dalam mengenali emosi yang muncul dalam cerita.

Emosi yang diharapkan muncul dari cerita ini: {', '.join(expected_emotions)}.

Buatlah umpan balik singkat dalam 2-3 kalimat yang:
- Ramah dan mendukung
- Sesuai dengan konteks cerita dan jawaban anak
- Tidak menggunakan istilah teknis atau bahasa sulit
- Dalam bahasa Indonesia
- Berikan saran apa yang bisa mereka lakukan untuk membantu sesuai dengan konteks cerita

Jawabanmu akan langsung dibaca oleh anak tersebut.
"""

    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Kamu adalah mentor ramah dan membimbing anak-anak dengan sabar."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )
        feedback = response.choices[0].message.content.strip()
        return jsonify({"feedback": feedback})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
