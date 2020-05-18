import psycopg2
from psycopg2 import sql
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
