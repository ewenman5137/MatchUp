from flask import Blueprint, request, jsonify
from models.utilisateur import Utilisateur, db
from models.reservation import Reservation


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

@reservation_bp.route('/api/agenda/disponibilites', methods=['GET'])
def get_disponibilites():
    sport = request.args.get("sport")
    date = request.args.get("date")  # format : YYYY-MM-DD

    horaires = [
        "8h30 - 9h30", "9h30 - 10h30", "10h30 - 11h30", "11h30 - 12h30",
        "12h30 - 13h30", "13h30 - 14h30", "14h30 - 15h30"
    ]

    MAX_RESERVATIONS = 2  

    disponibilites = []

    for slot in horaires:
        debut, fin = slot.split(" - ")
        count = Reservation.query.filter_by(
            dateReservation=date,
            heureDebut=debut,
            heureFin=fin,
            sport=sport,
            statutReservation="confirmée"
        ).count()
        disponibilites.append({
            "slot": slot,
            "disponible": MAX_RESERVATIONS - count
        })

    return jsonify(disponibilites), 200

@reservation_bp.route("/api/utilisateur/<int:idUser>/prochains-matchs", methods=["GET"])
def get_prochains_matchs_user(idUser):
    try:
        user = Utilisateur.query.get(idUser)
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404

        email_user = user.email
        now = datetime.now()

        reservations = Reservation.query.filter(
            Reservation.dateReservation >= now.strftime("%Y-%m-%d"),
            Reservation.statutReservation == "confirmee"
        ).all()

        prochains = []
        for r in reservations:
            if email_user in (r.joueurs or []):
                date_str = r.dateReservation
                heure_str = r.heureDebut

             
                try:
                    datetime_match = datetime.strptime(f"{date_str} {heure_str}", "%Y-%m-%d %H:%M")
                    if datetime_match >= now:
                        prochains.append({
                            "id": r.idReservation,
                            "date": date_str,
                            "heure": heure_str,
                            "sport": r.sport,
                            "lieu": "UQAC",
                            "mode": r.modeJeu,
                            "prix": r.prix,
                            "joueurs": r.joueurs
                        })
                except Exception as e:
                    print("Erreur conversion date/heure :", e)

        # Trie par date
        prochains.sort(key=lambda x: f"{x['date']} {x['heure']}")

        return jsonify(prochains), 200

    except Exception as e:
        print("Erreur récupération prochains matchs:", e)
        return jsonify({"error": "Erreur serveur"}), 500
    

@reservation_bp.route("/reservation/annuler", methods=["POST"])
def annuler_reservation():
    data = request.get_json()
    try:
        reservation_id = data.get("reservation_id")
        email = data.get("email")

        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            return jsonify({"error": "Réservation introuvable"}), 404

        if email not in (reservation.joueurs or []):
            return jsonify({"error": "Vous ne pouvez pas annuler cette réservation"}), 403

        db.session.delete(reservation)
        db.session.commit()

        return jsonify({"message": "Réservation annulée ✅"}), 200

    except Exception as e:
        print("❌ Erreur annulation réservation:", e)
        return jsonify({"error": "Erreur lors de l'annulation"}), 500
