from db import db


class SequenceModel(db.Model):
    __tablename__ = "sequence"

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(
        db.DateTime(timezone=False),
        nullable=False,
        default=db.func.timezone("MST", db.func.current_timestamp()),
    )
    attemptId = db.Column(db.Integer, db.ForeignKey("attempt.id"), nullable=False)
    functions = db.Column(db.String(255))
    playerPositions = db.Column(db.String(255))
    playerAcceptablePositions = db.Column(db.String(255))
    score = db.Column(db.Integer)
    success = db.Column(db.Boolean)

    def __init__(
        self,
        attemptId,
        functions,
        playerPositions,
        playerAcceptablePositions,
        score,
        success,
    ):
        self.attemptId = attemptId
        self.functions = functions
        self.playerPositions = playerPositions
        self.playerAcceptablePositions = playerAcceptablePositions
        self.score = score
        self.success = success

    def json(self):
        return {
            "attemptId": self.attemptId,
            "functions": self.functions,
            "playerPositions": self.playerPositions,
            "playerAcceptablePositions": self.playerAcceptablePositions,
            "score": self.score,
            "success": self.success,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        return self

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        return self

    @classmethod
    def find_by_id(cls, id_):
        return cls.query.filter_by(id=id_).first()
