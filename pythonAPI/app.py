from flask import Flask, render_template
from flask_restful import Api
from flask_jwt import JWT
from flask_cors import CORS
from waitress import serve

from security import authenticate, identity
from resources.user import UserRegister
from resources.attempt import Attempt, AttemptList

from db import db
from postgres_config import pg_config


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f'postgresql+psycopg2://{pg_config["user"]}:{pg_config["password"]}'
    f'@{pg_config["host"]}:{pg_config["port"]}/{pg_config["dbname"]}'
)

# disable flask_sqlalchemy tracker but keep sqlalchemy tracker
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.secret_key = "mykey"
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5000"}})
api = Api(app)


@app.before_first_request
def create_tables():
    db.create_all()


@app.route("/")
def home():
    return render_template("index.html")


jwt = JWT(app, authenticate, identity)  # /auth

api.add_resource(UserRegister, "/register")
api.add_resource(AttemptList, "/attempts")
api.add_resource(Attempt, "/attempt/username=<string:username>")


if __name__ == "__main__":
    db.init_app(app)
    # app.run(port=5000, debug=True) # dev server
    serve(app, host="127.0.0.1", port=5000) # prod WSGI server (waitress)
