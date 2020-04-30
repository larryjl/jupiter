pg_config = {
    "host": "localhost",
    "user": "postgres",
    "password": "postgres",
    "schema": "public",
    "dbname": "jupiter",
    "maintenance_db": "postgres",
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
    ],
}
