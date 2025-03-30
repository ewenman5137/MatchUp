from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db
from models.reservation import Reservation  # adapte selon ton arborescence

disponibilites_bp = Blueprint("disponibilites", __name__)

from flask import Blueprint, request, jsonify
from datetime import datetime

from models import db
from models.reservation import Reservation

disponibilites_bp = Blueprint("disponibilites", __name__)

@disponibilites_bp.route("/disponibilites", methods=["GET"])
def get_disponibilites():
    sport = request.args.get("sport")
    date_str = request.args.get("date")  # ex: 2025-03-30
    date = datetime.strptime(date_str, "%Y-%m-%d")
    jour = date.strftime("%A")  # ex: Monday

    horaires_sport = {
        "Tennis": {
            "all": ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]
        },
        "Pickleball": {
            "Thursday": ["18:00", "19:00", "20:00"],
            "Friday": ["18:00", "19:00", "20:00"],
            "Saturday": ["09:00", "10:00", "11:00"],
            "Sunday": ["09:00", "10:00", "11:00"]
        },
        # etc.
    }

    all_hours = horaires_sport.get(sport.capitalize(), {}).get(jour, horaires_sport.get(sport.capitalize(), {}).get("all", []))

    # Récupérer les réservations pour ce sport et cette date
    reservations = Reservation.query.filter_by(sport=sport.lower(), dateReservation=date_str).all()

    reserved_hours = []
    for r in reservations:
        h1 = int(r.heureDebut.split(":")[0])
        h2 = int(r.heureFin.split(":")[0])
        for h in range(h1, h2):  # inclus h1, exclut h2
            reserved_hours.append(f"{str(h).zfill(2)}:00")

    available_hours = [h for h in all_hours if h not in reserved_hours]

    return jsonify({"available_hours": available_hours})

