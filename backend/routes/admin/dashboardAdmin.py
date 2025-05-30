from flask import Blueprint, jsonify
from models import db, Utilisateur, Reservation, Paiement, Terrain
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    # Statistiques principales
    # on ne compte que les vrais UQAC (email en @uqac.ca et pas _pseudo)
    total_users = Utilisateur.query \
        .filter(Utilisateur.email.endswith('@uqac.ca')) \
        .filter(~Utilisateur.email.endswith('_pseudo')) \
        .count()

    # Réservations de la semaine
    today = datetime.today().date()
    start_week = today - timedelta(days=today.weekday())
    end_week   = start_week + timedelta(days=6)

    reservations_this_week = Reservation.query.filter(
        db.func.date(Reservation.dateReservation) >= start_week,
        db.func.date(Reservation.dateReservation) <= end_week
    ).count()

    # Taux d’occupation
    total_terrains = Terrain.query.count()
    total_slots    = total_terrains * 7 * 8
    occupation_rate = f"{min(int(reservations_this_week / total_slots * 100), 100)}%"

    # Activités récentes (fusion par créneau)
    activities = []
    grouped = {}

    recent_res = (
        Reservation.query
        .order_by(Reservation.idReservation.desc())
        .limit(20)
        .all()
    )
    for r in recent_res:
        key = (r.sport, r.dateReservation, r.heureDebut)

        # ici : r.joueurs est une liste de dict
        raw = r.joueurs or []
        emails = []
        for entry in raw:
            if isinstance(entry, dict) and 'email' in entry:
                emails.append(entry['email'])
            elif isinstance(entry, str):
                emails.append(entry)
        # on met à jour le set de chaînes
        grouped.setdefault(key, set()).update(emails)

    # on construit ensuite les activités fusionnées
    for (sport, date_str, heure), emails in grouped.items():
        joueurs_display = []
        for email in emails:
            # retire le suffixe _pseudo pour l'affichage
            display = email[:-7] if email.endswith('_pseudo') else email
            user = Utilisateur.query.filter_by(email=email).first()
            if user:
                joueurs_display.append(f"{user.prenom} {user.nom}")
            else:
                joueurs_display.append(display)
        duo = " & ".join(joueurs_display) or "(aucun joueur)"

        try:
            dt = datetime.strptime(f"{date_str} {heure}", "%Y-%m-%d %H:%M")
        except ValueError:
            dt = datetime.today()

        activities.append({
            "id":          f"res-{sport}-{date_str}-{heure}",
            "type":        "reservation",
            "description": f"Réservation {sport} par {duo} le {date_str} à {heure}",
            "date":        dt.isoformat()
        })

    # Paiements manuels
    recent_pay = (
        Paiement.query
        .order_by(Paiement.datePaiement.desc())
        .limit(10)
        .all()
    )
    for p in recent_pay:
        try:
            dt = datetime.strptime(p.datePaiement, "%Y-%m-%d %H:%M")
        except ValueError:
            dt = datetime.today()
        activities.append({
            "id":          f"pay-{p.idPaiement}",
            "type":        "paiement",
            "description": f"Paiement manuel de {p.montant:.2f}€ pour {p.client}",
            "date":        dt.isoformat()
        })

    # tri global & on garde les 10 plus récentes
    activities.sort(key=lambda a: a["date"], reverse=True)
    activities = activities[:10]

    return jsonify({
        "nombre_utilisateurs":  total_users,
        "reservations_semaine": reservations_this_week,
        "taux_occupation":      occupation_rate,
        "activites_recentes":   activities
    })
