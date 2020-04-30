from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
import psycopg2
from psycopg2 import sql
from postgres_config import pg_config


class User:
    def __init__(self, _id, username, password):
        self.id = _id
        self.username = username
        self.password = password

    # @jwt_required()
    @classmethod
    def find_by_username(cls, username):
        conn = psycopg2.connect(
            host=pg_config["host"],
            user=pg_config["user"],
            password=pg_config["password"],
            dbname=pg_config["dbname"],
        )
        cur = conn.cursor()

        cur.execute(
            sql.SQL("SELECT * FROM {} WHERE username = %s;").format(
                sql.Identifier(pg_config["schema"], pg_config["user_table"])
            ),
            (username,),
        )
        row = cur.fetchone()

        cur.close()
        conn.close()

        if row:
            return cls(*row)  # _id, username, password
        else:
            return None

    # @jwt_required()
    @classmethod
    def find_by_id(cls, _id):
        conn = psycopg2.connect(
            host=pg_config["host"],
            user=pg_config["user"],
            password=pg_config["password"],
            dbname=pg_config["dbname"],
        )
        cur = conn.cursor()

        cur.execute(
            sql.SQL("SELECT * FROM {} WHERE id = %s;").format(
                sql.Identifier(pg_config["schema"], pg_config["user_table"])
            ),
            (_id,),
        )
        row = cur.fetchone()

        cur.close()
        conn.close()

        if row:
            return cls(*row)  # _id, username, password
        else:
            return None


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

        if User.find_by_username(data["username"]):
            return {"message": "A user with that username already exists."}, 400

        conn = psycopg2.connect(
            host=pg_config["host"],
            user=pg_config["user"],
            password=pg_config["password"],
            dbname=pg_config["dbname"],
        )
        cur = conn.cursor()

        cur.execute(
            sql.SQL("INSERT INTO {} ({}) VALUES (%s, %s);").format(
                sql.Identifier(pg_config["schema"], pg_config["user_table"]),
                sql.SQL(", ").join(
                    [
                        sql.Identifier(column["name"])
                        for column in pg_config["user_columns"]
                        if column["constraint"] != "PRIMARY KEY"
                    ]
                ),
            ),
            (data["username"], data["password"],),
        )

        conn.commit()
        cur.close()
        conn.close()
        return {"message": "User created successfully."}, 201


class Attempt(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        "username", type=str, required=True, help="This field cannot be blank."
    )

    # @jwt_required()
    def post(self):
        data = Attempt.parser.parse_args()

        if not User.find_by_username(data["username"]):
            return {"message": "A user with that username does not exist."}, 404

        conn = psycopg2.connect(
            host=pg_config["host"],
            user=pg_config["user"],
            password=pg_config["password"],
            dbname=pg_config["dbname"],
        )
        cur = conn.cursor()

        cur.execute(
            sql.SQL("INSERT INTO {} ({}) VALUES (%s, %s);").format(
                sql.Identifier(pg_config["schema"], pg_config["attempt_table"]),
                sql.SQL(", ").join(
                    [
                        sql.Identifier(column["name"])
                        for column in pg_config["attempt_columns"]
                        if column["constraint"] != "PRIMARY KEY"
                    ]
                ),
            ),
            (data["username"],),
        )

        conn.commit()
        cur.close()
        conn.close()
        return {"message": "Attempt created successfully."}, 201