from flask import Flask
from flask_cors import CORS
from db import db
from routes.auth import auth
from routes.emotion import emotion  
from routes.gpt_feedback import gpt
from routes.statistics import statistics
from routes.responses import responses
from routes.narratives import narratives_bp
from routes.achievements import achievements_bp
from routes.users import users
from dotenv import load_dotenv
import os
import logging
logging.basicConfig(level=logging.DEBUG)

# Manually point to the .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = True
CORS(app)

# PostgreSQL connection ✅
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:530154@localhost/feelio"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
app.register_blueprint(auth)
app.register_blueprint(emotion)  
app.register_blueprint(gpt)
app.register_blueprint(statistics)
app.register_blueprint(narratives_bp)
app.register_blueprint(responses)
app.register_blueprint(achievements_bp)
app.register_blueprint(users)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
