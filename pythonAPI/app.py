from flask import Flask, render_template
from flask_restful import Api
from flask_jwt import JWT

from security import authenticate, identity
from resources.user import UserRegister
from resources.attempt import Attempt, AttemptList

app = Flask(__name__)
app.secret_key = "mykey"
api = Api(app)

jwt = JWT(app, authenticate, identity)  # /auth


@app.route("/")
def home():
    return render_template("index.html")


api.add_resource(UserRegister, "/register")
api.add_resource(AttemptList, "/attempts")
api.add_resource(Attempt, "/attempt/username=<string:username>")


if __name__ == "__main__":
    app.run(port=5000, debug=True)
