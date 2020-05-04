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

    # @jwt_required()
    def post(self):

        data = UserRegister.parser.parse_args()

        try:
            existing_user = UserModel.find_by_username(data["username"])
        except:
            return {"message": "An error occurred searching the user."}, 500

        if existing_user:
            return {"message": "A user with that username already exists."}, 400

        try:
            UserModel.insert(data)
            return {"message": "User created."}, 201
        except:
            return {"message": "An error occurred inserting the user."}, 500

    # @jwt_required()
    def put(self):

        data = UserRegister.parser.parse_args()

        try:
            existing_user = UserModel.find_by_username(data["username"])
        except:
            return {"message": "An error occurred searching the user."}, 500

        if existing_user:
            try:
                UserModel.update_password(data)
                return {"message": "User updated."}, 201
            except:
                return {"message": "An error occurred updating the user."}, 500
        else:
            try:
                UserModel.insert(data)
                return {"message": "User created."}, 201
            except:
                return {"message": "An error occurred inserting the user."}, 500
