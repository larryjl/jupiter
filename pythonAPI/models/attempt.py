from queries import tables, columns, connect, select, insert, update
from datetime import datetime


class AttemptModel:
    def __init__(self, id_, username, created):
        self.id = id_
        self.username = username
        self.created = created

    @classmethod
    def find(cls, username=None):
        (conn, cur) = connect()

        select(
            cur, tables["attempt"], column["attempt"][1] if username else None, username
        )
        query_result = cur.fetchall()

        cur.close()
        conn.close()

        if not query_result:
            return None

        attempts = [
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
        return attempts

    @classmethod
    def insert(cls, data):
        (conn, cur) = connect()

        insert(cur, tables["attempt"], columns["attempt_input"], (data["username"],))

        conn.commit()
        cur.close()
        conn.close()
