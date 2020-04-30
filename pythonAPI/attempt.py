from flask import request
from flask_restful import Resource, Api, reqparse
from flask_jwt import jwt_required
import psycopg2
from psycopg2 import sql
from postgres_config import pg_config


class Player(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("date", type=object, help="This field cannot be blank.")

    # @jwt_required()
    def get(self, username):
        global players
        conn = psycopg2.connect(
            host=pg_config["host"],
            user=pg_config["user"],
            password=pg_config["password"],
            dbname=pg_config["dbname"],
        )
        cur = conn.cursor()
        player = next(
            filter(lambda player: player["username"] == username, players), None
        )
        return player, 200 if player else 404

    # @jwt_required()
    def post(self, username):
        global players
        if next(filter(lambda player: player["username"] == username, players), None):
            return (
                {"message": f"Username: {username} already exists."},
                400,
            )  # Bad Request

        data = Player.parser.parse_args()
        player = {
            "username": username,
        }
        players.append(player)
        return player, 201  # Created

    # @jwt_required()
    def delete(self, username):
        global players
        if (
            next(filter(lambda player: player["username"] == username, players), None)
            == None
        ):
            return (
                {"message": f"Username: {username} does not exist."},
                400,
            )  # Bad Request
        players = list(filter(lambda player: player["username"] != username, players))
        return {"message": f"Username: {username} deleted."}, 200

    # @jwt_required()
    def put(self, username):
        global players
        data = Player.parser.parse_args()
        player = next(filter(lambda x: x["username"] == username, players), None)
        if player is None:
            player = {
                "username": username,
            }
            players.append(player)
        else:
            player.update(data)
        return player


class Attempt(Resource):

    # @jwt_required()
    def get(self, attemptId):
        global attempts
        attempt = next(
            filter(lambda attempt: attempt["id"] == attemptId, attempts), None
        )
        return attempt, 200 if attempt else 404

    # @jwt_required()
    def post(self, attemptId):
        global attempts
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
        return attempt, 201  # Created


class AttemptList(Resource):

    # @jwt_required()
    def get(self, username):
        userAttempts = [
            attempt for attempt in attempts if attempt["username"] == username
        ]
        return attemptList, 200 if len(userAttempts) > 0 else 404

    # @jwt_required()
    def newId(self):
        return 1

    # @jwt_required()
    def post(self, username):
        global attempts
        attempt = {"id": self.newId(), "username": username}
        attempts.append(attempt)
        return attempt, 201  # Created
