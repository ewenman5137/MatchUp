# routes/tournois.py
from flask import Blueprint, request, jsonify
from models import db, Utilisateur, Tournoi, Inscription

tournois = Blueprint("tournois", __name__)

@tournois.route("/register-tournament", methods=["POST"])
def register_tournament():
    data = request.json
    user_email = data.get("email")
    tournoi_id = data.get("tournoi_id")
    role = data.get("role_participant")

    utilisateur = Utilisateur.query.filter_by(email=user_email).first()
    tournoi = Tournoi.query.get(tournoi_id)

    if not utilisateur or not tournoi:
        return jsonify({"error": "Utilisateur ou tournoi non trouvé"}), 404

    inscription_existante = Inscription.query.filter_by(idUser=utilisateur.idUser, idTournoi=tournoi_id).first()
    if inscription_existante:
        return jsonify({"error": "Déjà inscrit à ce tournoi"}), 400

    inscription = Inscription(idUser=utilisateur.idUser, idTournoi=tournoi_id, roleParticipant=role)
    db.session.add(inscription)
    db.session.commit()

    return jsonify({"message": "Inscription réussie"}), 201
