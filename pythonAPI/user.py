from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
import psycopg2
from psycopg2 import sql
from postgres_config import pg_config


def connect():
    conn = psycopg2.connect(
        host=pg_config["host"],
        user=pg_config["user"],
        password=pg_config["password"],
        dbname=pg_config["dbname"],
    )
    cur = conn.cursor()
    return (conn, cur)


def select(cursor, table, column=None, value=None):
    cursor.execute(
        sql.SQL(
            "SELECT * FROM {} WHERE {} = %s;" if column else "SELECT * FROM {}"
        ).format(sql.Identifier(pg_config["schema"], table), sql.Identifier(column)),
        (value,),
    )

def insert(cursor, table, columns: list, values: tuple):
    cursor.execute(
        sql.SQL("INSERT INTO {} ({}) VALUES (%s, %s);").format(
            sql.Identifier(pg_config["schema"], "user"),
            sql.SQL(", ").join(
                [sql.Identifier(column) for column in columns]
            ),
            sql.SQL(", ").join([sql.Placeholder() for column in columns]),
        ),
        values,
    )

def update(cursor, table, set_column, set_value, where_column, where_value):
    cursor.execute(
        sql.SQL("""
            UPDATE {table} 
            SET {set_column} = %(set_value)s 
            WHERE {where_column} = %(where_value)s;
        """).format(
            table = sql.Identifier(pg_config["schema"], table),
            set_column = sql.Identifier(set_column),
            where_column = sql.Identifier(where_column)
        ),
        ("set_value": set_value, "where_value": where_value,),
    )

class User:
    def __init__(self, _id, username, password):
        self.id = _id
        self.username = username
        self.password = password

    @classmethod
    def find_by_username(cls, username):

        (conn, cur) = connect()

        select(cur, "user", "username", username)
        row = cur.fetchone()

        cur.close()
        conn.close()

        if row:
            return cls(*row)  # _id, username, password
        else:
            return None

    @classmethod
    def find_by_id(cls, _id):

        (conn, cur) = connect()

        select(cur, "user", "id", _id)
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
    columns = [column["name"] for column in pg_config["user"]]
    input_columns = [
        column["name"]
        for column in pg_config["user"]
        if not any(
            default in column["constraint"] for default in ["PRIMARY KEY", "DEFAULT"]
        )
    ]

    @classmethod
    def insert(cls, data):

        (conn, cur) = connect()
        insert(cur, "user", cls.input_columns, (data["username"], data["password"],))
        
        conn.commit()
        cur.close()
        conn.close()

    @classmethod
    def update(cls, data):

        (conn, cur) = connect()

        update(cur, "user", "password", data["password"], "username", data["username"])

        conn.commit()
        cur.close()
        conn.close()

    # @jwt_required()
    def post(self):

        data = UserRegister.parser.parse_args()

        try:
            user_exists = User.find_by_username(data["username"])
        except e:
            return {"message": "An error occurred searching the user."}, 500

        if user_exists:
            return {"message": "A user with that username already exists."}, 400

        try:
            self.insert(data)
            return {"message": "User created."}, 201
        except e:
            return {"message": "An error occurred inserting the user."}, 500

    # @jwt_required()
    def put(self):

        data = UserRegister.parser.parse_args()

        try:
            user_exists = User.find_by_username(data["username"])
        except e:
            return {"message": "An error occurred searching the user."}, 500

        if user_exists:
            try:
                self.update(data)
                return {"message": "User updated."}, 201
            except e:
                return {"message": "An error occurred updating the user."}, 500
        else:
            try:
                self.insert(data)
                return {"message": "User created."}, 201
            except e:
                return {"message": "An error occurred inserting the user."}, 500


class Attempt(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument(
        "username", type=str, required=True, help="This field cannot be blank."
    )
    columns = [column["name"] for column in pg_config["attempt"]]
    input_columns = [
        column["name"]
        for column in pg_config["attempt"]
        if not any(
            default in column["constraint"] for default in ["PRIMARY KEY", "DEFAULT"]
        )
    ]

    @classmethod
    def insert(cls, data):
        (conn, cur) = connect()

        insert(cur, "attempt", cls.input_columns, (data["username"],))

        conn.commit()
        cur.close()
        conn.close()

    # @jwt_required()
    def get(self):
        try:
            (conn, cur) = connect()

            select(cur, "attempt")
            query_result = cur.fetchall()

            cur.close()
            conn.close()

            result = [
                {key: value for (key, value) in list(zip(Attempt.columns, row))}
                for row in query_result
            ]

            return {"attempts": result}
        except e:
            return {"message": "An error occurred getting the attempts."}, 500

    # @jwt_required()
    def post(self):
        data = Attempt.parser.parse_args()

        try:
            user_exists = User.find_by_username(data["username"])
        except e:
            return {"message": "An error occurred searching the user."}, 500

        if not user_exists:
            return {"message": "A user with that username does not exist."}, 404

        try:
            self.insert(data)
            return {"message": "Attempt created."}, 201
        except e:
            return {"message": "An error occurred posting the attempt."}, 500
