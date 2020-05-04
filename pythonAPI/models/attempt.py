from db import db


class AttemptModel(db.Model):
    __tablename__ = "attempt"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), db.ForeignKey("users.id"), nullable=False)
    created = db.Column(
        db.DateTime(timezone=False),
        nullable=False,
        default=db.func.timezone("MST", db.func.current_timestamp()),
    )
    users = db.relationship("UserModel")

    def __init__(self, username):
        self.username = username

    def json(self):
        return {"username": self.username}

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
