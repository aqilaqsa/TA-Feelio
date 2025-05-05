from flask import Flask
from flask_cors import CORS
from db import db
from routes.auth import auth
# from routes.emotion import emotion  # 🚫 disable this for now

app = Flask(__name__)
CORS(app)

# PostgreSQL connection ✅
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:530154@localhost/feelio"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
app.register_blueprint(auth)
# app.register_blueprint(emotion)  # 🚫 disable model routes

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
