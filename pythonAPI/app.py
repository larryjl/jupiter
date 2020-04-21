from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

players = [{"username": "lawrence", "attempts": [{"attemptId": 1,}]}]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/players", methods=["GET"])
def get_players():
    return jsonify({"layers": players})


@app.route("/api/players", methods=["POST"])
def post_player():
    request_data = request.get_json()
    new_player = {"username": request_data["username"], "attempts": []}
    players.append(new_player)
    return jsonify(new_player)


@app.route("/api/players/<string:username>", methods=["GET"])
def get_player(name):
    for player in players:
        if player["username"] == username:
            return jsonify(player)
    return jsonify({"message": "player not found"})


@app.route("/api/players/<string:username>/attempts", methods=["POST"])
def post_attempt():
    request_data = request.get_json()
    for player in players:
        if player["username"] == username:
            new_attempt = {}
            player["attempts"].append(new_player)
            return jsonify(new_attempt)
    return jsonify({"message": "player not found"})


@app.route("/api/players/<string:username>/attempts", methods=["GET"])
def get_attempts():
    for player in players:
        if player["username"] == username:
            return jsonify({"attempts": player["attempts"]})
    return jsonify({"message": "player not found"})


app.run(port=5000)
