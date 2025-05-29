from flask import Blueprint, jsonify, request
from models.utilisateur import Utilisateur
from models import db

utilisateur_bp = Blueprint("utilisateur", __name__)

@utilisateur_bp.route("/api/utilisateur/<int:idUser>", methods=["GET"])
def get_utilisateur(idUser):
    user = Utilisateur.query.get(idUser)
    print("Requête reçue pour ID:", idUser)
    if user:
        return jsonify({
            "prenom": user.prenom,
            "nom": user.nom,
            "email": user.email,
            "sexe": user.sexe,
            "langue": user.langue,
            "nationalite": user.nationalite,
        })
    return jsonify({"error": "Utilisateur non trouvé"}), 404


# ✅ Cette fonction doit être ici et pas dans le modèle
@utilisateur_bp.route("/api/utilisateur/<int:idUser>", methods=["PUT"])
def update_utilisateur(idUser):
    user = Utilisateur.query.get(idUser)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    data = request.get_json()
    user.sexe = data.get("sexe", user.sexe)
    user.langue = data.get("langue", user.langue)
    user.nationalite = data.get("nationalite", user.nationalite)

    db.session.commit()
    return jsonify({"message": "Utilisateur mis à jour"}), 200

@utilisateur_bp.route("/api/utilisateur/<int:idUser>", methods=["DELETE"])
def delete_utilisateur(idUser):
    user = Utilisateur.query.get(idUser)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Utilisateur supprimé avec succès"}), 200

@utilisateur_bp.route("/api/utilisateur/<int:idUser>/statistiques", methods=["GET"])
def get_statistiques_utilisateur(idUser):
    sport = request.args.get("sport")  # ex: "Tennis"
    tableau = request.args.get("tableau")  # ex: "simple"

    user = Utilisateur.query.get(idUser)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    # Tous les matchs joués par l'utilisateur
    games = user.games

    # Filtrage par sport et tableau
    if sport:
        games = [g for g in games if any(t.sport.nomSport.lower() == sport.lower() for t in g.tournois)]
    if tableau:
        games = [g for g in games if any(t.tableau.lower() == tableau.lower() for t in g.tournois)]

    # Classement filtré (tu peux adapter selon logique réelle)
    classement = user.classement

    statistiques = {
        "classement": classement,
        "points": user.points or 0,
        "categorie": "Expert" if (user.points or 0) >= 800 else "Débutant",
        "victoires": len([g for g in games if g.scoreEquipe1 > g.scoreEquipe2]),
        "games": [
            {
                "nom": tournoi.nomTournoi,
                "sport": tournoi.sport.nomSport,
                "type": tournoi.tableau,
                "date": tournoi.dateTournoi,
                "organisateur": "Organisateur",
                "matches": [
                    {
                        "setsEquipe1": [int(s.split("-")[0]) for s in g.sets.split(";")],
                        "setsEquipe2": [int(s.split("-")[1]) for s in g.sets.split(";")]
                    }
                    for g in tournoi.games if user in g.joueurs
                ]
            }
            for tournoi in user.tournois
        ],

    }

    return jsonify(statistiques), 200


@utilisateur_bp.route("/api/classement", methods=["GET"])
def get_classement():
    utilisateurs = Utilisateur.query.all()
    data = []

    for user in utilisateurs:
        games_data = []
        for tournoi in user.tournois:
            tournoi_games = []
            for game in tournoi.games:
                if user in game.joueurs:
                    # Séparer les sets proprement
                    sets_equipes = (game.sets or "").split(";")
                    sets_e1, sets_e2 = [], []
                    for s in sets_equipes:
                        try:
                            e1, e2 = s.split("-")
                            sets_e1.append(int(e1.strip()))
                            sets_e2.append(int(e2.strip()))
                        except:
                            continue

                    tournoi_games.append({
                        "setsEquipe1": sets_e1,
                        "setsEquipe2": sets_e2,
                        "scoreEquipe1": game.scoreEquipe1,
                        "scoreEquipe2": game.scoreEquipe2,
                    })

            if tournoi_games:
                games_data.append({
                    "nom": tournoi.nomTournoi,
                    "date": tournoi.dateTournoi.isoformat() if hasattr(tournoi.dateTournoi, "isoformat") else tournoi.dateTournoi,
                    "type": tournoi.tableau,
                    "sport": tournoi.sport.nomSport if tournoi.sport else None,
                    "matches": tournoi_games
                })

        data.append({
            "id": user.idUser,
            "pseudo": f"{user.prenom} {user.nom}",
            "sexe": user.sexe.lower() if user.sexe else "",
            "classement": user.classement,
            "points": user.points,
             "categorie": (
                "Expert" if (user.points or 0) >= 800
                else "Intermédiaire" if (user.points or 0) >= 500
                else "Débutant"
            ),
            "games": games_data,
            "xp": user.points or 0,
        })

    return jsonify(data)


@utilisateur_bp.route("/api/utilisateurs", methods=["GET"])
def get_utilisateurs():
    utilisateurs = Utilisateur.query.all()
    return jsonify([
        {
            "id": u.idUser,
            "prenom": u.prenom,
            "nom": u.nom,
            "email": u.email,
            "sexe": u.sexe,
            "langue": u.langue,
            "nationalite": u.nationalite,
            "points": u.points,
            "classement": u.classement,
            "role": u.roleParticipant,
        }
        for u in utilisateurs
    ])

@utilisateur_bp.route("/api/utilisateur/id-par-email", methods=["GET"])
def get_user_id_by_email():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email requis"}), 400

    utilisateur = Utilisateur.query.filter_by(email=email).first()
    if not utilisateur:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    return jsonify({
        "id": utilisateur.idUser,
        "prenom": utilisateur.prenom,
        "nom": utilisateur.nom
    }), 200


@utilisateur_bp.route("/api/utilisateur/<email>/tournois-inscrits", methods=["GET"])
def get_tournois_inscrits(email):
    try:
        utilisateur = Utilisateur.query.filter_by(email=email).first()
        if not utilisateur:
            return jsonify({"error": "Utilisateur introuvable"}), 404

        tournois_inscrits = utilisateur.tournois  # doit venir de la relation many-to-many

        result = []
        for t in tournois_inscrits:
            participants_emails = [u.email for u in t.participants]  # <- important
            result.append({
                "id": t.idTournoi,
                "titre": t.nomTournoi,
                "date": t.dateTournoi,
                "heure": t.heureDebut,
                "sport": t.sport.nomSport if t.sport else "Inconnu",
                "tableau": t.tableau,
                "organisateur": t.emailOrganisateur,
                "participants": participants_emails
            })

        return jsonify(result), 200

    except Exception as e:
        print("❌ Erreur lors de la récupération des tournois inscrits :", e)
        return jsonify({"error": "Erreur serveur"}), 500
