from flask import Flask, jsonify, request, render_template
from flask_restful import Resource, Api
from flask_jwt import JWT, jwt_required

from security import authenticate, identity

app = Flask(__name__)
app.secret_key = "mykey"
api = Api(app)

jwt = JWT(app, authenticate, identity)  # /auth


@app.route("/")
def home():
    return render_template("index.html")


players = [{"username": "lawrence"}]
attempts = [{"username": "lawrence", "id": 1}]


class Player(Resource):
    @jwt_required()
    def get(self, username):
        player = next(
            filter(lambda player: player["username"] == username, players), None
        )
        return jsonify(player), 200 if item else 404

    def post(self, username):
        if next(filter(lambda player: player["username"] == username, players), None):
            return (
                {"message": f"Username: {username} already exists."},
                400,
            )  # Bad Request
        requestData = request.get_json(silent=False)
        player = {
            "username": username,
        }
        players.append(player)
        return jsonify(player), 201  # Created

    def delete(self, name):
        if (
            next(filter(lambda player: player["username"] == username, players), None)
            == None
        ):
            return (
                {"message": f"Username: {username} does not exist."},
                400,
            )  # Bad Request
        global players
        players = list(filter(lambda player: player["username"] != name, players))
        return {"message": f"Username: {username} deleted."}, 200


class Attempt(Resource):
    def get(self, attemptId):
        attempt = next(
            filter(lambda attempt: attempt["id"] == attemptId, attempts), None
        )
        return jsonify(attempt), 200 if attempt else 404

    def post(self, attemptId):
        if next(filter(lambda attempt: attempt["id"] == attemptId, attempts), None):
            return (
                {"message": f"Attempt: {attemptId} already exists."},
                400,
            )  # Bad Request
        requestData = request.get_json(silent=False)
        attempt = {
            "id": attemptId,
        }
        attempts.append(attempt)
        return jsonify(attempt), 201  # Created


class AttemptList(Resource):
    def get(self, username):
        userAttempts = [
            attempt for attempt in attempts if attempt["username"] == username
        ]
        return jsonify(attemptList), 200 if len(userAttempts) > 0 else 404

    def newId(self):
        return 1

    def post(self, username):
        attempt = {"id": self.newId(), "username": username}
        attempts.append(attempt)
        return jsonify(attempt), 201  # Created


api.add_resource(Player, "/players/<string:username>")
api.add_resource(Attempt, "/attempts/<string:attemptId>")
api.add_resource(AttemptList, "/players/<string:username>/attempts")

app.run(port=5000, debug=True)
