from flask import Blueprint, jsonify
from models import db, Utilisateur, Reservation, Terrain
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    # Nombre total d'utilisateurs
    total_users = Utilisateur.query.count()

    # Réservations cette semaine
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())  # Lundi
    end_of_week = start_of_week + timedelta(days=6)  # Dimanche

    reservations_this_week = Reservation.query.filter(
        db.func.date(Reservation.dateReservation) >= start_of_week.date(),
        db.func.date(Reservation.dateReservation) <= end_of_week.date()
    ).count()

    # Taux d’occupation (simplifié ici : nombre de réservations / (nb terrains * 7 jours * 8 heures))
    total_terrains = Terrain.query.count()
    total_slots = total_terrains * 7 * 8  # Supposons 8 créneaux horaires par jour par terrain
    occupation_rate = min(int((reservations_this_week / total_slots) * 100), 100) if total_slots else 0

    return jsonify({
        "nombre_utilisateurs": total_users,
        "reservations_semaine": reservations_this_week,
        "taux_occupation": f"{occupation_rate}%"  # En pourcentage
    })
