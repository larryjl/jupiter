from db import db


class AttemptModel(db.Model):
    __tablename__ = "attempt"

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(
        db.DateTime(timezone=False),
        nullable=False,
        default=db.func.timezone("MST", db.func.current_timestamp()),
    )
    ended = db.Column(db.DateTime(timezone=False), nullable=True,)
    userId = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    levelId = db.Column(db.Integer)
    startPosition = db.Column(db.String(255))
    targetPosition = db.Column(db.String(255))

    def __init__(self, user_id, level_id, start_position, target_position):
        self.userId = user_id
        self.levelId = level_id
        self.startPosition = start_position
        self.targetPosition = target_position

    def json(self):
        return {
            "userId": self.userId,
            "levelId": self.levelId,
            "startPosition": self.startPosition,
            "targetPosition": self.targetPosition,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        return self

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        return self

    def update_end_time(self):
        self.ended = db.func.timezone("MST", db.func.current_timestamp())
        db.session.commit()
        return self

    @classmethod
    def find_by_id(cls, id_):
        return cls.query.filter_by(id=id_).first()
