# routes/disponibilites.py (Flask)
from flask import Blueprint, request, jsonify
from models import db, Reservation  # ou ta table appropriée

disponibilites_bp = Blueprint("disponibilites", __name__)

@disponibilites_bp.route("/disponibilites", methods=["GET"])
def get_disponibilites():
    sport = request.args.get("sport")
    date = request.args.get("date")  # format : YYYY-MM-DD

    # Ex : liste complète des horaires disponibles
    all_hours = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]

    # Récupère les heures déjà réservées pour ce sport et cette date
    reservations = Reservation.query.filter_by(sport=sport, date_reservation=date).all()
    reserved_hours = [r.heure_debut for r in reservations]

    # Retire les heures réservées
    available_hours = [hour for hour in all_hours if hour not in reserved_hours]

    return jsonify({"available_hours": available_hours})
