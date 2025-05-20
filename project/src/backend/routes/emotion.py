from flask import Blueprint, request, jsonify
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import os

emotion = Blueprint("emotion", __name__)

# Load model & tokenizer ONCE
model_path = os.path.join(os.path.dirname(__file__), "..", "emotion_model")
model_path = os.path.abspath(model_path)
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)
model.eval()

@emotion.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.sigmoid(outputs.logits).squeeze().tolist()
    return jsonify({"probabilities": probs})
