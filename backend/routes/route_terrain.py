from flask import Blueprint, request, jsonify
from models import db
from models.terrain_bloquer import BlocageCreneau

blocage_bp = Blueprint("blocage", __name__)

@blocage_bp.route("/api/blocage", methods=["GET"])
def verifier_blocage():
    sport = request.args.get("sport")
    date = request.args.get("date")
    heure = request.args.get("heure")

    if not sport or not date or not heure:
        return jsonify({"error": "Paramètres manquants"}), 400

    blocage = BlocageCreneau.query.filter_by(sport=sport, date=date, heure=heure).first()

    return jsonify({"bloque": blocage is not None}), 200


@blocage_bp.route("/api/blocage", methods=["POST"])
def creer_blocage():
    data = request.get_json()
    sport = data.get("sport")
    date = data.get("date")   # format "YYYY-MM-DD"
    heure = data.get("heure") # format "HH:MM"

    if not sport or not date or not heure:
        return jsonify({"error": "Champs requis manquants"}), 400

    # Vérifie si un blocage existe déjà
    existe = BlocageCreneau.query.filter_by(sport=sport, date=date, heure=heure).first()
    if existe:
        return jsonify({"error": "Créneau déjà bloqué"}), 409

    blocage = BlocageCreneau(sport=sport, date=date, heure=heure)
    db.session.add(blocage)
    db.session.commit()

    return jsonify({"message": "Créneau bloqué avec succès"}), 201