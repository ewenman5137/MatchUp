from models.game import Game
from models.reservation import Reservation
from flask import Blueprint, request, jsonify
from models import db
from models.utilisateur import Utilisateur
from models.rencontre import RencontreProposee
from datetime import datetime, timedelta

rencontre_bp = Blueprint("rencontres", __name__)

@rencontre_bp.route("/rencontres", methods=["POST"])
def proposer_rencontre():
    data = request.get_json()
    try:
        # 🔍 Récupération de l'utilisateur à partir de son email
        email = data.get("email")
        utilisateur = Utilisateur.query.filter_by(email=email).first()

        if not utilisateur:
            return jsonify({"error": "Utilisateur introuvable"}), 404

        # ✅ Création de la rencontre
        nouvelle = RencontreProposee(
            idJoueur1=utilisateur.idUser,
            sport=data["sport"],
            niveau=data.get("niveau"),
            date=datetime.strptime(data["date"], "%Y-%m-%d"),
            heure=data["heure"],
            duree=data.get("duree", 1),
            terrain=data.get("terrain"),
            commentaire=data.get("commentaire"),
            statut="en_attente"
        )

        db.session.add(nouvelle)
        db.session.commit()

        return jsonify({"message": "Rencontre proposée avec succès."}), 201

    except Exception as e:
        print("Erreur création rencontre:", e)
        return jsonify({"error": "Erreur serveur"}), 500



# Obtenir toutes les propositions disponibles
@rencontre_bp.route("/rencontres", methods=["GET"])
def get_rencontres():
    try:
        rencontres = RencontreProposee.query.filter_by(statut="en_attente").all()
        return jsonify([r.to_dict() for r in rencontres]), 200
    except Exception as e:
        print("Erreur liste rencontres:", e)
        return jsonify({"error": "Erreur serveur"}), 500


@rencontre_bp.route("/rencontres/<int:id>/accepter", methods=["PATCH"])
def accepter_rencontre(id):
    data = request.get_json()
    try:
        rencontre = RencontreProposee.query.get(id)
        if not rencontre or rencontre.statut != "en_attente":
            return jsonify({"error": "Rencontre non disponible"}), 400

        # ✅ Récupérer utilisateur via email
        email = data.get("email")
        utilisateur = Utilisateur.query.filter_by(email=email).first()
        if not utilisateur:
            return jsonify({"error": "Utilisateur introuvable"}), 404

        rencontre.idJoueur2 = utilisateur.idUser
        rencontre.statut = "accepte"

        # Création de la réservation
        heure_fin = (datetime.strptime(rencontre.heure, "%H:%M") + timedelta(hours=rencontre.duree)).strftime("%H:%M")
        reservation = Reservation(
            heureDebut=rencontre.heure,
            heureFin=heure_fin,
            dateReservation=rencontre.date.strftime("%Y-%m-%d"),
            statutReservation="confirmee",
            modeJeu="rechercher_adversaire",
            sport=rencontre.sport,
            prix="Gratuit",
            joueurs=[rencontre.joueur1.email, utilisateur.email]
        )
        db.session.add(reservation)

        # Match lié
        match = Game(scoreEquipe1=0, scoreEquipe2=0, statutGame="a_jouer", sets="")
        db.session.add(match)

        db.session.commit()

        return jsonify({"message": "Rencontre acceptée, match créé."}), 200

    except Exception as e:
        print("Erreur acceptation rencontre:", e)
        return jsonify({"error": "Erreur serveur"}), 500
