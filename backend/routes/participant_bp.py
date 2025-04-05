from flask import Blueprint, jsonify
from models import db
from models.tournoi import Tournoi
from models.utilisateur import Utilisateur

participants_bp = Blueprint("participants", __name__)

@participants_bp.route("/tournoi/<int:id>/participants", methods=["GET"])
def get_participants_by_tournoi(id):
    try:
        tournoi = Tournoi.query.get(id)
        if not tournoi:
            return jsonify({"error": "Tournoi introuvable"}), 404

        participants = tournoi.participants
        return jsonify([
            {
                "id": u.idUser,
                "nom": getattr(u, 'nom', 'Nom inconnu'),
                "prenom": getattr(u, 'prenom', ''),
                "email": getattr(u, 'email', '')
            } for u in participants
        ]), 200

    except Exception as e:
        print("❌ Erreur récupération des participants :", e)
        return jsonify({"error": "Erreur serveur"}), 500
