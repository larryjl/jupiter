import os

from flask import Flask, render_template
from flask_restful import Api
from flask_jwt import JWT
from flask_cors import CORS

from security import authenticate, identity
from resources.user import UserRegister, User
from resources.attempt import UserAttempt, Attempt, AttemptList
from resources.sequence import AttemptSequence, Sequence, SequenceList, UserSequence

from db import db

if not os.environ.get("HEROKU"):
    from dotenv import load_dotenv

    load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.environ.get("SECRET_KEY")

if os.environ.get("HEROKU"):
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "https://larryjl-jupiter.herokuapp.com/*",
                    "https://larryjl.github.io/jupiter/",
                ]
            }
        },
    )
else:
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000/jupiter/"}})

api = Api(app)


@app.before_first_request
def create_tables():
    db.create_all()


@app.route("/")
def home():
    return render_template("index.html")


app.config["JWT_AUTH_URL_RULE"] = "/api/auth"
jwt = JWT(app, authenticate, identity)  # /auth

api.add_resource(UserRegister, "/api/register")
api.add_resource(User, "/api/users/username=<string:username>")
api.add_resource(UserAttempt, "/api/attempts/username=<string:username>")
api.add_resource(Attempt, "/api/attempts/id=<string:attempt_id>")
api.add_resource(AttemptList, "/api/attempts")
api.add_resource(UserSequence, "/api/sequences/username=<string:username>")
api.add_resource(AttemptSequence, "/api/sequences/attemptid=<string:attempt_id>")
api.add_resource(Sequence, "/api/sequences/id=<string:sequence_id>")
api.add_resource(SequenceList, "/api/sequences")


if __name__ == "__main__":
    db.init_app(app)
    app.run(port=5000, debug=True)  # dev server
