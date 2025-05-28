from flask import Blueprint, request, jsonify
from models.utilisateur import db, Utilisateur

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    prenom = data.get("prenom")
    nom = data.get("nom")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if Utilisateur.query.filter_by(email=email).first():
        return jsonify({"error": "Adresse email déjà utilisée"}), 400

    user = Utilisateur(prenom=prenom, nom=nom, email=email, roleParticipant=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Compte créé avec succès"}), 201


@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = Utilisateur.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401

    return jsonify({
        "message": "Connexion réussie",
        "user": {
            "id": user.idUser,
            "prenom": user.prenom,
            "nom": user.nom,
            "email": user.email,
            "role": user.roleParticipant
        }
    }), 200

@auth.route("/utilisateurs", methods=["GET"])
def get_all_users():
    users = Utilisateur.query.all()
    result = []

    for user in users:
        result.append({
            "id": user.idUser,
            "prenom": user.prenom,
            "nom": user.nom,
            "email": user.email,
            "role": user.roleParticipant,
            "sexe": user.sexe,
            "langue": user.langue,
            "nationalite": user.nationalite,
            "points": user.points,
            "classement": user.classement
        })

    return jsonify(result), 200
