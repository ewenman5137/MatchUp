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
    

@reservation_bp.route('/reservations', methods=['GET'])
def get_reservations():
    try:
        reservations = Reservation.query.all()
        result = []

        for res in reservations:
            result.append({
                "id": res.idReservation,
                "date": res.dateReservation,
                "sport": res.sport or "non spécifié",
                "prix": res.prix or "Gratuit",
                "lieu": "UQAC, Chicoutimi",
                "refId": str(res.idReservation).zfill(8),
                "terrain": "n°1",
                "horaire": f"{res.heureDebut} à {res.heureFin}",
                "joueurs": len(res.joueurs) if res.joueurs else 1
            })

        return jsonify(result), 200

    except Exception as e:
        print("❌ ERREUR FLASK /reservations :", e)  # 👈 AIDE AU DEBUG
        return jsonify({"error": "Impossible de charger les réservations"}), 500


@reservation_bp.route('/reservation/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    reservation = Reservation.query.get(id)
    if reservation:
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"message": "Réservation supprimée ✅"}), 200
    return jsonify({"error": "Réservation introuvable"}), 404
