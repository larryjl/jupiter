from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
import psycopg2
from psycopg2 import sql
from datetime import datetime
from postgres_config import pg_config

tables = {
    "user": pg_config["tables"]["user"]["table"],
    "attempt": pg_config["tables"]["attempt"]["table"],
}
columns = {
    "user": [column["name"] for column in pg_config["tables"]["user"]["columns"]],
    "user_input": [
        column["name"]
        for column in pg_config["tables"]["user"]["columns"]
        if not any(
            constraint in column["constraint"]
            for constraint in ["PRIMARY KEY", "DEFAULT"]
        )
    ],
    "attempt": [column["name"] for column in pg_config["tables"]["attempt"]["columns"]],
    "attempt_input": [
        column["name"]
        for column in pg_config["tables"]["attempt"]["columns"]
        if not any(
            constraint in column["constraint"]
            for constraint in ["PRIMARY KEY", "DEFAULT"]
        )
    ],
}


def connect():
    conn = psycopg2.connect(
        host=pg_config["host"],
        user=pg_config["user"],
        password=pg_config["password"],
        dbname=pg_config["dbname"],
    )
    cur = conn.cursor()
    return (conn, cur)


def select(cursor, table, where_column=None, where_value=None, select_columns=None):
    if where_column and select_columns:
        cursor.execute(
            sql.SQL("SELECT {} FROM {} WHERE {} = %s;").format(
                sql.SQL(", ").join(
                    [sql.Identifier(column) for column in select_columns]
                ),
                sql.Identifier(pg_config["schema"], table),
                sql.Identifier(where_column),
            ),
            (where_value,),
        )
    elif where_column:
        cursor.execute(
            sql.SQL("SELECT * FROM {} WHERE {} = %s;").format(
                sql.Identifier(pg_config["schema"], table),
                sql.Identifier(where_column),
            ),
            (where_value,),
        )
    else:
        cursor.execute(
            sql.SQL("SELECT * FROM {}").format(
                sql.Identifier(pg_config["schema"], table)
            )
        )


def insert(cursor, table, columns: list, values: tuple):
    cursor.execute(
        sql.SQL("INSERT INTO {} ({}) VALUES ({});").format(
            sql.Identifier(pg_config["schema"], table),
            sql.SQL(", ").join([sql.Identifier(column) for column in columns]),
            sql.SQL(", ").join([sql.Placeholder() for column in columns]),
        ),
        values,
    )


def update(cursor, table, set_column, set_value, where_column, where_value):
    cursor.execute(
        sql.SQL(
            """
            UPDATE {table} 
            SET {set_column} = %(set_value)s 
            WHERE {where_column} = %(where_value)s;
        """
        ).format(
            table=sql.Identifier(pg_config["schema"], table),
            set_column=sql.Identifier(set_column),
            where_column=sql.Identifier(where_column),
        ),
        {"set_value": set_value, "where_value": where_value,},
    )


class User:
    def __init__(self, id_, username, password):
        self.id = id_
        self.username = username
        self.password = password

    @classmethod
    def find_by_username(cls, username):

        (conn, cur) = connect()

        select(cur, tables["user"], columns["user"][1], username, columns["user"][:3])
        row = cur.fetchone()

        cur.close()
        conn.close()

        if row:
            return cls(*row)
        else:
            return None

    @classmethod
    def find_by_id(cls, id_):

        (conn, cur) = connect()

        select(cur, tables["user"], columns["user"][0], id_, columns["user"][:3])
        row = cur.fetchone()

        cur.close()
        conn.close()

        if row:
            return cls(*row)
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

    @classmethod
    def insert(cls, data):

        (conn, cur) = connect()
        insert(
            cur,
            tables["user"],
            columns["user_input"],
            (data["username"], data["password"],),
        )

        conn.commit()
        cur.close()
        conn.close()

    @classmethod
    def update(cls, data):

        (conn, cur) = connect()

        update(
            cur,
            tables["user"],
            columns["user"][2],
            data["password"],
            columns["user"][1],
            data["username"],
        )

        conn.commit()
        cur.close()
        conn.close()

    # @jwt_required()
    def post(self):

        data = UserRegister.parser.parse_args()

        try:
            user_exists = User.find_by_username(data["username"])
        except:
            return {"message": "An error occurred searching the user."}, 500

        if user_exists:
            return {"message": "A user with that username already exists."}, 400

        try:
            self.insert(data)
            return {"message": "User created."}, 201
        except:
            return {"message": "An error occurred inserting the user."}, 500

    # @jwt_required()
    def put(self):

        data = UserRegister.parser.parse_args()

        try:
            user_exists = User.find_by_username(data["username"])
        except:
            return {"message": "An error occurred searching the user."}, 500

        if user_exists:
            try:
                self.update(data)
                return {"message": "User updated."}, 201
            except:
                return {"message": "An error occurred updating the user."}, 500
        else:
            try:
                self.insert(data)
                return {"message": "User created."}, 201
            except:
                return {"message": "An error occurred inserting the user."}, 500


class Attempt(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument(
        "username", type=str, required=True, help="This field cannot be blank."
    )

    @classmethod
    def insert(cls, data):
        (conn, cur) = connect()

        insert(cur, tables["attempt"], columns["attempt_input"], (data["username"],))

        conn.commit()
        cur.close()
        conn.close()

    # @jwt_required()
    def get(self):
        try:
            (conn, cur) = connect()

            select(cur, tables["attempt"])
            query_result = cur.fetchall()

            cur.close()
            conn.close()

            if not query_result:
                return {"message": "No attempts found."}, 404

            result = [
                {
                    key: value
                    for (key, value) in list(
                        zip(
                            columns["attempt"],
                            [
                                value.strftime("%Y-%m-%d %H:%M:%S")
                                if isinstance(value, datetime)
                                else value
                                for value in row
                            ],
                        )
                    )
                }
                for row in query_result
            ]

            return {"attempts": result}
        except:
            return {"message": "An error occurred getting the attempts."}, 500

    # @jwt_required()
    def post(self):
        data = Attempt.parser.parse_args()

        try:
            user_exists = User.find_by_username(data["username"])
        except:
            return {"message": "An error occurred searching the user."}, 500

        if not user_exists:
            return {"message": "A user with that username does not exist."}, 404

        try:
            self.insert(data)
            return {"message": "Attempt created."}, 201
        except:
            return {"message": "An error occurred posting the attempt."}, 500
