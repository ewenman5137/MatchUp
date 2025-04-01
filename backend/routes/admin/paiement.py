from datetime import datetime
from models.paiement import Paiement
from flask import Blueprint, request, jsonify
from models.utilisateur import db


paiement_bp = Blueprint('paiements', __name__)

@paiement_bp.route('/paiements', methods=['POST','GET'])
def ajouter_paiement():
    data = request.get_json()
    paiement = Paiement(
        produit=data.get("produit"),
        client=data.get("client"),
        montant=float(data.get("prix")),
        statutPaiement=data.get("statut"),
        datePaiement=datetime.now().strftime("%d %b %Y, %H:%M")
    )
    db.session.add(paiement)
    db.session.commit()
    return jsonify({"message": "Paiement ajouté", "id": paiement.idPaiement}), 201


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
