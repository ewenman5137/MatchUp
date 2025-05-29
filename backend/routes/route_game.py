from flask import Blueprint, request, jsonify
from models import db
from models.game import Game

game_bp = Blueprint("game", __name__)

@game_bp.route("/api/game/<int:game_id>", methods=["PUT"])
def update_game(game_id):
    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error": "Match non trouvé"}), 404

    data = request.json
    game.scoreEquipe1 = data.get("scoreEquipe1", game.scoreEquipe1)
    game.scoreEquipe2 = data.get("scoreEquipe2", game.scoreEquipe2)
    game.statutGame = data.get("statutGame", game.statutGame)
    game.sets = data.get("sets", game.sets)

    db.session.commit()
    return jsonify({"message": "Match mis à jour avec succès"})


@game_bp.route("/api/game/<int:game_id>", methods=["GET"])
def get_game(game_id):
    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error": "Match non trouvé"}), 404

    return jsonify({
        "id": game.idGame,
        "scoreEquipe1": game.scoreEquipe1,
        "scoreEquipe2": game.scoreEquipe2,
        "statutGame": game.statutGame,
        "sets": game.sets,
        "rencontre_id": game.rencontre_id
    })
