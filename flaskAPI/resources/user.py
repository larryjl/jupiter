from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.user import UserModel


class UserRegister(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument(
        "username", type=str, required=True, help="This field cannot be blank."
    )
    parser.add_argument(
        "password", type=str, required=True, help="This field cannot be blank."
    )

    def post(self):

        data = UserRegister.parser.parse_args()

        try:
            existing_user = UserModel.find_by_username(data["username"])
        except:
            return {"message": "An error occurred searching the user."}, 500

        if existing_user:
            return {"message": "A user with that username already exists."}, 400

        try:
            new_user = UserModel(data["username"], data["password"]).save_to_db()
            return {"message": "User created.", "id": new_user.id}, 201
        except:
            return {"message": "An error occurred inserting the user."}, 500

    @jwt_required()
    def put(self):

        data = UserRegister.parser.parse_args()

        try:
            user = UserModel.find_by_username(data["username"])
        except:
            return {"message": "An error occurred searching the user."}, 500

        if user:
            user.password = data["password"]
        else:
            user = UserModel(**data)

        try:
            user.save_to_db()
            return {"message": "User updated."}, 201
        except:
            return {"message": "An error occurred inserting the user."}, 500


class User(Resource):
    @jwt_required()
    def get(self, username):
        try:
            user = UserModel.find_by_username(username)
        except:
            return {"message": "An error occurred searching the user."}, 500
        if not user:
            return {"message": "A user with that username does not exist."}, 404
        return user.json(), 200
