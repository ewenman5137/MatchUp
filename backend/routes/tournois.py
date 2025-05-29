from flask import Blueprint, request, jsonify
from models import db
from models.tournoi import Tournoi
from models.sport import Sport
from datetime import datetime, timedelta
from models.utilisateur import Utilisateur  # ✅ À ajouter

tournoi_bp = Blueprint("tournois", __name__)

@tournoi_bp.route("/tournois", methods=["POST"])
def creer_tournoi():
    data = request.get_json()
    print("📥 Données reçues pour tournoi:", data)

    try:
        sport_nom = data.get("sport")
        sport = Sport.query.filter_by(nomSport=sport_nom).first()
        if not sport:
            return jsonify({"error": "Sport introuvable"}), 400

        heure_obj = datetime.strptime(data["heure"], "%H:%M")
        heure_debut = heure_obj.strftime("%H:%M")
        heure_fin = (heure_obj + timedelta(hours=1)).strftime("%H:%M")

        nouveau_tournoi = Tournoi(
            nomTournoi=data.get("titre"),
            descriptionTournoi=data.get("description", ""),
            dateTournoi=datetime.strptime(data["date"], "%Y-%m-%d").date(),
            heureDebut=heure_debut,
            heureFin=heure_fin,
            sport_id=sport.idSport,
            tableau=data.get("tableau"),
            emailOrganisateur=data.get("email")  # ✅ ajouté ici
        )

        db.session.add(nouveau_tournoi)
        db.session.commit()

        return jsonify({
            "message": "Tournoi créé avec succès ✅",
            "id": nouveau_tournoi.idTournoi
        }), 201

    except Exception as e:
        print("❌ Erreur lors de la création du tournoi:", e)
        return jsonify({"error": "Erreur interne"}), 500



@tournoi_bp.route("/tournois", methods=["GET"])
def get_tournois():
    try:
        tournois = Tournoi.query.all()
        result = [t.to_dict() for t in tournois]
        return jsonify(result), 200
    except Exception as e:
        print("❌ Erreur lors de la récupération des tournois:", e)
        return jsonify({"error": "Erreur lors du chargement"}), 500


@tournoi_bp.route("/tournoi/<int:id>", methods=["GET"])
def get_tournoi_by_id(id):
    try:
        tournoi = Tournoi.query.get(id)
        if not tournoi:
            return jsonify({"error": "Tournoi introuvable"}), 404

        return jsonify(tournoi.to_dict()), 200

    except Exception as e:
        print("❌ Erreur récupération tournoi :", e)
        return jsonify({"error": "Erreur interne serveur"}), 500



@tournoi_bp.route("/inscription-tournoi", methods=["POST"])
def inscrire_utilisateur():
    data = request.get_json()
    print("📩 Reçu pour inscription:", data)

    try:
        email = data.get("email")
        tournoi_id = data.get("tournoi_id")

        # Trouve le tournoi
        tournoi = Tournoi.query.get(tournoi_id)
        if not tournoi:
            return jsonify({"error": "Tournoi introuvable"}), 404

        # Trouve l'utilisateur
        utilisateur = Utilisateur.query.filter_by(email=email).first()
        if not utilisateur:
            return jsonify({"error": "Utilisateur non trouvé"}), 404

        # Ajoute dans la table inscrire
        tournoi.participants.append(utilisateur)

        db.session.commit()

        return jsonify({"message": "Inscription réussie ✅"}), 200

    except Exception as e:
        print("❌ Erreur inscription:", e)
        return jsonify({"error": "Erreur lors de l'inscription"}), 500

@tournoi_bp.route("/api/utilisateur/<email>/organise-tournoi", methods=["GET"])
def est_organisateur(email):
    try:
        tournois = Tournoi.query.filter_by(emailOrganisateur=email).all()

        if not tournois:
            return jsonify({"organise": False, "tournois": []}), 200

        resultats = []
        for t in tournois:
            resultats.append({
                "id": t.idTournoi,
                "titre": t.nomTournoi,
                "description": t.descriptionTournoi,
                "date": t.dateTournoi,
                "heure": t.heureDebut,
                "heureFin": t.heureFin,
                "sport": t.sport.nomSport if t.sport else None,  # ✅ Vérifie si la relation est bien configurée
                "tableau": t.tableau,
                "organisateur": t.emailOrganisateur,
                "participants": [p.email for p in t.participants] if hasattr(t, "participants") else []
            })

        return jsonify({"organise": True, "tournois": resultats}), 200

    except Exception as e:
        print("❌ Erreur vérification organisateur:", e)
        import traceback
        traceback.print_exc()  # ⬅️ Ajoute ceci pour voir la stacktrace complète
        return jsonify({"error": "Erreur interne"}), 500


    
@tournoi_bp.route("/tournois/<int:id>", methods=["DELETE"])
def supprimer_tournoi(id):
    try:
        tournoi = Tournoi.query.get(id)
        if not tournoi:
            return jsonify({"error": "Tournoi introuvable"}), 404

        db.session.delete(tournoi)
        db.session.commit()
        return jsonify({"message": "Tournoi supprimé"}), 200

    except Exception as e:
        print("❌ Erreur suppression tournoi:", e)
        return jsonify({"error": "Erreur interne"}), 500


@tournoi_bp.route("/desinscription-tournoi", methods=["POST"])
def desinscrire_utilisateur():
    data = request.get_json()
    try:
        email = data.get("email")
        tournoi_id = data.get("tournoi_id")

        tournoi = Tournoi.query.get(tournoi_id)
        if not tournoi:
            return jsonify({"error": "Tournoi introuvable"}), 404

        utilisateur = Utilisateur.query.filter_by(email=email).first()
        if not utilisateur:
            return jsonify({"error": "Utilisateur non trouvé"}), 404

        if utilisateur in tournoi.participants:
            tournoi.participants.remove(utilisateur)
            db.session.commit()
            return jsonify({"message": "Désinscription réussie ✅"}), 200
        else:
            return jsonify({"error": "Utilisateur non inscrit à ce tournoi"}), 400

    except Exception as e:
        print("❌ Erreur désinscription tournoi:", e)
        return jsonify({"error": "Erreur lors de la désinscription"}), 500
