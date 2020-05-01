pg_config = {
    "host": "localhost",
    "user": "postgres",
    "password": "postgres",
    "schema": "public",
    "maintenance_db": "postgres",
    "dbname": "jupiter",
    "tables": {
        "user": [
            {"name": "id", "type": "serial", "constraint": "PRIMARY KEY",},
            {"name": "username", "type": "varchar", "constraint": "NOT NULL UNIQUE",},
            {"name": "password", "type": "varchar", "constraint": "NOT NULL"},
        ],
        "attempt": [
            {"name": "id", "type": "serial", "constraint": "PRIMARY KEY",},
            {"name": "username", "type": "varchar", "constraint": "NOT NULL",},
            {
                "name": "created",
                "type": "timestamp",
                "constraint": "NOT NULL DEFAULT (now() AT TIME ZONE 'MST')",
            },
        ],
    },
    "user_table": "user",
    "user_columns": [
        {"name": "id", "type": "serial", "constraint": "PRIMARY KEY",},
        {"name": "username", "type": "varchar", "constraint": "NOT NULL UNIQUE",},
        {"name": "password", "type": "varchar", "constraint": "NOT NULL"},
    ],
    "attempt_table": "attempt",
    "attempt_columns": [
        {"name": "id", "type": "serial", "constraint": "PRIMARY KEY",},
        {"name": "username", "type": "varchar", "constraint": "NOT NULL",},
        {
            "name": "created",
            "type": "timestamp without time zone",
            "constraint": "NOT NULL DEFAULT (now() AT TIME ZONE 'MST')",
        },
    ],
}
