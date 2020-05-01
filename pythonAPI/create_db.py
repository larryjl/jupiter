import psycopg2
from psycopg2 import sql
from postgres_config import pg_config


conn = psycopg2.connect(
    host=pg_config["host"],
    user=pg_config["user"],
    password=pg_config["password"],
    dbname=pg_config["maintenance_db"],
)
conn.autocommit = True
cur = conn.cursor()

cur.execute(
    """SELECT EXISTS(
        SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s
    );""",
    (pg_config["dbname"],),
)
if not cur.fetchone()[0]:
    cur.execute(
        sql.SQL("CREATE DATABASE {};").format(sql.Identifier(pg_config["dbname"]))
    )

cur.close()
conn.close()


conn = psycopg2.connect(
    host=pg_config["host"],
    user=pg_config["user"],
    password=pg_config["password"],
    dbname=pg_config["dbname"],
)
conn.autocommit = True
cur = conn.cursor()

for (table, columns) in pg_config["tables"].items():

    cur.execute(
        """SELECT EXISTS(
            SELECT 1 FROM information_schema.tables WHERE table_name = %s
        );""",
        (table,),
    )

    if not cur.fetchone()[0]:
        cur.execute(
            sql.SQL("CREATE TABLE {table} ({columns})").format(
                table=sql.Identifier(pg_config["schema"], table),
                columns=sql.SQL(", ").join(
                    [
                        sql.SQL(
                            "{} {} PRIMARY KEY"
                            if (column["constraint"] == "PRIMARY KEY")
                            else (
                                "{} {} NOT NULL UNIQUE"
                                if (column["constraint"] == "NOT NULL UNIQUE")
                                else (
                                    "{} {} NOT NULL"
                                    if (column["constraint"] == "NOT NULL")
                                    else (
                                        "{} {} UNIQUE"
                                        if (column["constraint"] == "UNIQUE")
                                        else (
                                            "{} {} NOT NULL DEFAULT (now() AT TIME ZONE 'MST')"
                                            if (
                                                column["constraint"]
                                                == "NOT NULL DEFAULT (now() AT TIME ZONE 'MST')"
                                            )
                                            else "{} {}"
                                        )
                                    )
                                )
                            )
                        ).format(
                            sql.Identifier(column["name"]),
                            sql.Identifier(column["type"]),
                        )
                        for column in columns
                    ]
                ),
            )
        )


cur.close()
conn.close()
