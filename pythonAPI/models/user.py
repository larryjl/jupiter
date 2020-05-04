from queries import tables, columns, connect, select, insert, update


class UserModel:
    def __init__(self, id_, username, password, created):
        self.id = id_
        self.username = username
        self.password = password
        self.created = created

    @classmethod
    def find_by_username(cls, username):

        (conn, cur) = connect()

        select(cur, tables["user"], columns["user"][1], username)
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

        select(cur, tables["user"], columns["user"][0], id_)
        row = cur.fetchone()

        cur.close()
        conn.close()

        if row:
            return cls(*row)
        else:
            return None

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
    def update_password(cls, data):

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
