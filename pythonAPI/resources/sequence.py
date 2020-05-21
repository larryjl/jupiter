from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.sequence import SequenceModel
from models.attempt import AttemptModel


class AttemptSequence(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument("functions", type=str, required=True)
    parser.add_argument("playerPositions", type=str, required=True)
    parser.add_argument("playerAcceptablePositions", type=str, required=True)
    parser.add_argument("score", type=int, required=True)
    parser.add_argument("success", type=bool, required=True)

    @jwt_required()
    def get(self, attempt_id):
        try:
            sequences = [
                sequence.json()
                for sequence in SequenceModel.query.filter_by(
                    attemptId=attempt_id
                ).all()
            ]
        except:
            return {"message": "An error occurred finding the sequences."}, 500
        if not sequences:
            return {"message": "No sequences found."}, 404
        return {"sequences": sequences}, 200

    @jwt_required()
    def post(self, attempt_id):
        data = AttemptSequence.parser.parse_args()

        try:
            attempt = AttemptModel.find_by_id(attempt_id)
            attemptId = attempt.id
        except:
            return {"message": "An error occurred searching the attempt."}, 500

        if not attempt:
            return {"message": "An attempt with that id does not exist."}, 404

        try:
            sequence = SequenceModel(
                attemptId,
                data["functions"],
                data["playerPositions"],
                data["playerAcceptablePositions"],
                data["score"],
                data["success"],
            ).save_to_db()
            return {"message": "Sequence created.", "id": sequence.id}, 201
        except:
            return {"message": "An error occurred posting the sequence."}, 500


class SequenceList(Resource):
    @jwt_required()
    def get(self):
        try:
            sequences = [sequence.json() for sequence in SequenceModel.query.all()]
        except:
            return {"message": "An error occurred finding the sequences."}, 500
        if not sequences:
            return {"message": "No sequences found."}, 404
        return {"sequences": sequences}, 200


class Sequence(Resource):
    @jwt_required()
    def get(self, sequence_id):
        try:
            sequence = SequenceModel.find_by_id(sequence_id)
        except:
            return {"message": "An error occurred finding the sequence."}, 500
        if not sequence:
            return {"message": "That sequence does not exist."}, 404
        return sequence.json(), 200
