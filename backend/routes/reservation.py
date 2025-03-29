from flask import Blueprint, request, jsonify
from models.utilisateur import db
from models.reservation import Reservation
# (et les autres à venir : terrain, tournoi, etc.)

from datetime import datetime

reservation_bp = Blueprint('reservation', __name__)

@reservation_bp.route('/reservation', methods=['POST'])
def create_reservation():
    data = request.get_json()
    print("📥 Données reçues :", data)

    try:
        date_reservation = data.get("dateReservation")
        heure_debut = data.get("heureDebut")
        heure_fin = data.get("heureFin")
        statut = data.get("statutReservation", "en_attente")
        mode_jeu = data.get("modeJeu", "inconnu")
        sport = data.get("sport", "non spécifié")
        prix = data.get("prix", "Gratuit")
        joueurs = data.get("joueurs", [])

        nouvelle_reservation = Reservation(
            dateReservation=date_reservation,
            heureDebut=heure_debut,
            heureFin=heure_fin,
            statutReservation=statut,
            modeJeu=mode_jeu,
            sport=sport,
            prix=prix,
            joueurs=joueurs
        )

        db.session.add(nouvelle_reservation)
        db.session.commit()

        return jsonify({
            "message": "Réservation enregistrée avec succès ✅",
            "id": nouvelle_reservation.idReservation
        }), 201

    except Exception as e:
        print("❌ Erreur :", str(e))
        return jsonify({"error": "Erreur lors de la création de la réservation"}), 500