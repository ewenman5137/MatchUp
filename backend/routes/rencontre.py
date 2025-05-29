from models.game import Game
from models.reservation import Reservation
from flask import Blueprint, request, jsonify
from models import db
from models.utilisateur import Utilisateur
from models.rencontre import RencontreProposee
from datetime import datetime, timedelta

rencontre_bp = Blueprint("rencontres", __name__)

def get_or_create_guest(email: str) -> Utilisateur:
    """Renvoie un Utilisateur correspondant à email.
    Si introuvable, crée un compte guest avec email_pseudo."""
    user = Utilisateur.query.filter_by(email=email).first()
    if user:
        return user

    guest_email = f"{email}_pseudo"
    user = Utilisateur(
        prenom="Invité",
        nom="",
        email=guest_email,
        mdp="",               # mot de passe vide
        roleParticipant="guest"
    )
    db.session.add(user)
    db.session.flush()       # pour générer user.idUser
    return user

@rencontre_bp.route("/rencontres", methods=["POST"])
def proposer_rencontre():
    data = request.get_json() or {}

    email1   = data.get("email") or data.get("emailInitiateur")
    sport    = data.get("sport")
    date_str = data.get("date")
    heure    = data.get("heure")
    if not (email1 and sport and date_str and heure):
        return jsonify({"error": "email, sport, date et heure sont requis"}), 400

    # on stockera l'email brut pour la réservation
    original_email1 = email1

    # on récupère ou crée l'utilisateur (avec suffixe _pseudo si besoin)
    user1 = get_or_create_guest(email1)

    try:
        # 1) création de la rencontre
        nouvelle = RencontreProposee(
            idJoueur1   = user1.idUser,
            sport       = sport,
            niveau      = data.get("niveau"),
            date        = datetime.strptime(date_str, "%Y-%m-%d"),
            heure       = heure,
            duree       = data.get("duree", 1),
            terrain     = data.get("terrain"),
            commentaire = data.get("commentaire"),
            statut      = "en_attente"
        )
        db.session.add(nouvelle)
        db.session.flush()  # pour nouvelle.id

        # 2) création de la réservation **immédiate**
        end = (datetime.strptime(heure, "%H:%M") + timedelta(hours=nouvelle.duree)).strftime("%H:%M")
        reservation = Reservation(
            dateReservation   = date_str,
            heureDebut        = heure,
            heureFin          = end,
            statutReservation = "confirmee",
            modeJeu           = "match_paire",
            sport             = sport,
            prix              = data.get("prix", "Gratuit"),
            # on passe ici l'email brut, pas le _pseudo
            joueurs           = [original_email1]
        )
        db.session.add(reservation)

        db.session.commit()
        return jsonify({"message": "Rencontre et réservation créées.", "id": nouvelle.id}), 201

    except Exception as e:
        db.session.rollback()
        print("Erreur création rencontre+reservation:", e)
        return jsonify({"error": "Erreur serveur"}), 500


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
    data   = request.get_json() or {}
    email2 = data.get("email") or data.get("emailInvite")
    if not email2:
        return jsonify({"error": "emailInvite (ou email) est requis"}), 400

    rencontre = RencontreProposee.query.get(id)
    if not rencontre or rencontre.statut != "en_attente":
        return jsonify({"error": "Rencontre non disponible"}), 400

    original_email2 = email2
    user2 = get_or_create_guest(email2)

    try:
        # mise à jour de la rencontre
        rencontre.idJoueur2 = user2.idUser
        rencontre.statut    = "acceptee"

        # création de la réservation
        start = datetime.strptime(rencontre.heure, "%H:%M")
        end   = (start + timedelta(hours=rencontre.duree)).strftime("%H:%M")
        joueurs_emails = []

        # retrouver email1 brut via la réservation existante ou comment faire ?
        # ici on le stocke temporairement dans commentaire si nécessaire
        # mais supposons que l'on remette la même logique :
        joueurs_emails.append(rencontre.commentaire or f"{rencontre.joueur1.email}".rstrip("_pseudo"))
        joueurs_emails.append(original_email2)

        reservation = Reservation(
            dateReservation   = rencontre.date.strftime("%Y-%m-%d"),
            heureDebut        = rencontre.heure,
            heureFin          = end,
            statutReservation = "confirmee",
            modeJeu           = "match_paire",
            sport             = rencontre.sport,
            prix              = "Gratuit",
            joueurs           = joueurs_emails
        )
        db.session.add(reservation)
        db.session.commit()

        return jsonify({"message": "Rencontre acceptée et réservation créée."}), 200

    except Exception as e:
        db.session.rollback()
        print("Erreur acceptation rencontre:", e)
        return jsonify({"error": "Erreur serveur"}), 500
