from flask import Blueprint, request, jsonify
from models.evenement import Evenement, db
from datetime import datetime


evenement_bp = Blueprint("evenement", __name__)

@evenement_bp.route('/', methods=['POST'])
def create_evenement():
    try:
        data = request.get_json()

        evenement = Evenement(
            titre=data['titre'],
            description=data.get('description'),
            type_evenement=data['type'],
            sport=data['sport'],
            date=datetime.strptime(data['date'], "%Y-%m-%d").date(),
            heure=datetime.strptime(data['heure'], "%H:%M").time(),
            lieu=data['lieu'],
            nb_joueurs_max=data['nb_joueurs_max'],
            nb_joueurs_inscrits=data.get('nb_joueurs_inscrits', 0),
            niveau_requis=data.get('niveau_requis'),
            sexe=data.get('sexe'),
            organisateur=data['organisateur'],
            date_limite_inscription=datetime.strptime(data['date_limite'], "%Y-%m-%dT%H:%M") if data.get('date_limite') else None
        )

        db.session.add(evenement)
        db.session.commit()

        return jsonify({"message": "Événement créé avec succès", "id": evenement.id}), 201
    except Exception as e:
        print("Erreur lors de la création de l'événement:", str(e))
        return jsonify({"error": "Erreur lors de la création de l'événement"}), 500

@evenement_bp.route('/', methods=['GET'])
def get_all_evenements():
    try:
        tous = Evenement.query.all()
        return jsonify([e.to_dict() for e in tous])
    except Exception as e:
        print("Erreur lors de la récupération des événements:", str(e))
        return jsonify({"error": "Erreur lors de la récupération"}), 500

@evenement_bp.route('/a_venir', methods=['GET'])
def get_evenements_a_venir():
    try:
        maintenant = datetime.now()
        futurs = Evenement.query.filter(
            (Evenement.date > maintenant.date()) |
            ((Evenement.date == maintenant.date()) & (Evenement.heure > maintenant.time()))
        ).order_by(Evenement.date, Evenement.heure).all()
        return jsonify([e.to_dict() for e in futurs])
    except Exception as e:
        print("Erreur lors de la récupération des événements à venir:", str(e))
        return jsonify({"error": "Erreur lors de la récupération des événements à venir"}), 500

@evenement_bp.route('/passes', methods=['GET'])
def get_evenements_passes():
    try:
        maintenant = datetime.now()
        passes = Evenement.query.filter(
            (Evenement.date < maintenant.date()) |
            ((Evenement.date == maintenant.date()) & (Evenement.heure <= maintenant.time()))
        ).order_by(Evenement.date.desc(), Evenement.heure.desc()).all()
        return jsonify([e.to_dict() for e in passes])
    except Exception as e:
        print("Erreur lors de la récupération des événements passés:", str(e))
        return jsonify({"error": "Erreur lors de la récupération des événements passés"}), 500
