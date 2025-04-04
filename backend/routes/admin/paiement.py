from datetime import datetime
from models.paiement import Paiement
from flask import Blueprint, request, jsonify
from models.utilisateur import Utilisateur, db


paiement_bp = Blueprint('paiements', __name__)

@paiement_bp.route('/paiements', methods=['POST'])
def ajouter_paiement():
    data = request.get_json()

    try:
        id_user = data.get("idUser")
        if not id_user:
            return jsonify({"error": "idUser est requis"}), 400

        user = Utilisateur.query.get(id_user)
        if not user:
            return jsonify({"error": "Utilisateur introuvable"}), 404

        paiement = Paiement(
            produit=data.get("produit"),
            client=data.get("client"),
            montant=float(data.get("prix")),
            statutPaiement=data.get("statut"),
            datePaiement=datetime.now().strftime("%d %b %Y, %H:%M")
        )

        db.session.add(paiement)
        user.paiements.append(paiement)
        db.session.commit()

        return jsonify({"message": "Paiement ajouté", "id": paiement.idPaiement}), 201

    except Exception as e:
        print("Erreur ajout paiement:", str(e))
        return jsonify({"error": "Erreur lors de l'ajout"}), 500




@paiement_bp.route('/paiement/<int:id>', methods=['PUT'])
def modifier_paiement(id):
    paiement = Paiement.query.get(id)
    if not paiement:
        return jsonify({"error": "Paiement introuvable"}), 404

    data = request.get_json()
    paiement.produit = data.get("produit", paiement.produit)
    paiement.statutPaiement = data.get("statut", paiement.statutPaiement)
    paiement.montant = float(data.get("prix", paiement.montant))

    db.session.commit()
    return jsonify({"message": "Paiement mis à jour"}), 200


@paiement_bp.route('/paiements', methods=['GET'])
def get_paiements():
    paiements = Paiement.query.order_by(Paiement.idPaiement.desc()).all()
    result = []

    for p in paiements:
        utilisateur = p.utilisateurs[0] if p.utilisateurs else None  # on suppose un seul
        result.append({
            "id": p.idPaiement,
            "produit": p.produit,
            "client": utilisateur.nom + " " + utilisateur.prenom if utilisateur else p.client,
            "date": p.datePaiement,
            "statut": p.statutPaiement,
            "prix": f"${p.montant:.2f}",
            "avatar": "/avatar-jean-eude.png"
        })

    return jsonify(result), 200


@paiement_bp.route('/utilisateur/<int:idUser>/paiements', methods=['GET'])
def get_paiements_utilisateur(idUser):
    user = Utilisateur.query.get(idUser)
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    result = []
    for p in user.paiements:
        result.append({
            "id": p.idPaiement,
            "produit": p.produit,
            "date": p.datePaiement,
            "statut": p.statutPaiement,
            "prix": f"${p.montant:.2f}",
        })

    return jsonify(result), 200
