from db import db


class UserModel(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(
        db.DateTime(timezone=False),
        nullable=False,
        default=db.func.timezone("MST", db.func.current_timestamp()),
    )
    username = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password = db.Column(db.String(255), nullable=False)
    attempts = db.relationship("AttemptModel", lazy="dynamic")

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def json(self):
        return {
            "username": self.username,
            "password": self.password,
            "attempts": [attempt.json() for attempt in self.attempts.all()],
        }

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, id_):
        return cls.query.filter_by(id=id_).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        return self

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        return self
