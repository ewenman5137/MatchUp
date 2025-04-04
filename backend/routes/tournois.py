from flask import Blueprint, request, jsonify
from models import db
from models.tournoi import Tournoi
from models.sport import Sport
from datetime import datetime

tournoi_bp = Blueprint("tournois", __name__)

@tournoi_bp.route("/tournois", methods=["POST"])
def creer_tournoi():
    data = request.get_json()
    print("📥 Données reçues pour tournoi:", data)

    try:
        # Récupération du sport associé
        sport_nom = data.get("sport")
        sport = Sport.query.filter_by(nomSport=sport_nom).first()
        if not sport:
            return jsonify({"error": "Sport introuvable"}), 400

        nouveau_tournoi = Tournoi(
            nomTournoi=data.get("titre"),
            descriptionTournoi=data.get("description"),
            dateTournoi=data.get("date"),
            heureDebut=data.get("heureDebut"),
            heureFin=data.get("heureFin"),
            sport_id=sport.idSport,
            tableau=data.get("tableau")  # ex: "simple", "double", "mixte"
        )

        db.session.add(nouveau_tournoi)
        db.session.commit()

        return jsonify({
            "message": "Tournoi créé avec succès ✅",
            "id": nouveau_tournoi.idTournoi
        }), 201

    except Exception as e:
        print("❌ Erreur lors de la création du tournoi:", e)
        return jsonify({"error": "Erreur interne"}), 500

@tournoi_bp.route("/tournois", methods=["GET"])
def get_tournois():
    try:
        tournois = Tournoi.query.all()
        result = [t.to_dict() for t in tournois]
        return jsonify(result), 200
    except Exception as e:
        print("❌ Erreur lors de la récupération des tournois:", e)
        return jsonify({"error": "Erreur lors du chargement"}), 500


@tournoi_bp.route("/tournoi/<int:id>", methods=["GET"])
def get_tournoi_by_id(id):
    try:
        tournoi = Tournoi.query.get(id)
        if not tournoi:
            return jsonify({"error": "Tournoi introuvable"}), 404

        return jsonify(tournoi.to_dict()), 200

    except Exception as e:
        print("❌ Erreur récupération tournoi :", e)
        return jsonify({"error": "Erreur interne serveur"}), 500
