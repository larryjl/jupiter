from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.attempt import AttemptModel
from models.user import UserModel


class Attempt(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument(
        "username", type=str, required=True, help="This field cannot be blank."
    )

    # @jwt_required()
    def get(self):
        # try:
        attempts = AttemptModel.find()
        # except:
        #     return {"message": "An error occurred finding the attempts."}, 500
        if not attempts:
            return {"message": "No attempts found."}, 404
        return {"attempts": attempts}, 200

    # @jwt_required()
    def post(self):
        data = Attempt.parser.parse_args()

        try:
            existing_user = UserModel.find_by_username(data["username"])
        except:
            return {"message": "An error occurred searching the user."}, 500

        if not existing_user:
            return {"message": "A user with that username does not exist."}, 404

        try:
            AttemptModel.insert(data)
            return {"message": "Attempt created."}, 201
        except:
            return {"message": "An error occurred posting the attempt."}, 500
