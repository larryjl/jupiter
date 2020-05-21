from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.attempt import AttemptModel
from models.user import UserModel


class UserAttempt(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument("levelId", type=int, required=True)
    parser.add_argument("startPosition", type=str, required=True)
    parser.add_argument("targetPosition", type=str, required=True)

    @jwt_required()
    def get(self, username):
        try:
            attempts = [
                attempt.json()
                for attempt in AttemptModel.query.filter_by(username=username).all()
            ]
        except:
            return {"message": "An error occurred finding the attempts."}, 500
        if not attempts:
            return {"message": "No attempts found."}, 404
        return {"attempts": attempts}, 200

    @jwt_required()
    def post(self, username):
        data = UserAttempt.parser.parse_args()

        try:
            user = UserModel.find_by_username(username)
            userId = user.id
        except:
            return {"message": "An error occurred searching the user."}, 500

        if not user:
            return {"message": "A user with that username does not exist."}, 404

        try:
            attempt = AttemptModel(
                userId, data["levelId"], data["startPosition"], data["targetPosition"]
            ).save_to_db()
            return {"message": "Attempt created.", "id": attempt.id}, 201
        except:
            return {"message": "An error occurred posting the attempt."}, 500


class AttemptList(Resource):
    @jwt_required()
    def get(self):
        try:
            attempts = [attempt.json() for attempt in AttemptModel.query.all()]
        except:
            return {"message": "An error occurred finding the attempts."}, 500
        if not attempts:
            return {"message": "No attempts found."}, 404
        return {"attempts": attempts}, 200


class Attempt(Resource):
    @jwt_required()
    def get(self, attempt_id):
        try:
            attempt = AttemptModel.find_by_id(attempt_id)
        except:
            return {"message": "An error occurred finding the attempt."}, 500
        if not attempt:
            return {"message": "That attempt does not exist."}, 404
        return attempt.json(), 200

    @jwt_required()
    def patch(self, attempt_id):
        try:
            attempt = AttemptModel.find_by_id(attempt_id)
        except:
            return {"message": "An error occurred searching the attempt."}, 500

        if not attempt:
            return {"message": "That attempt does not exist."}, 404

        try:
            attempt.update_end_time()
            return {"message": "Attempt patched.", "id": attempt.id}, 200
        except:
            return {"message": "An error occurred patching the attempt."}, 500
