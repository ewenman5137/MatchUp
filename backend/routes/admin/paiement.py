# routes/paiement.py
from datetime import datetime
from flask import Blueprint, request, jsonify
from models.paiement import Paiement
from models.utilisateur import Utilisateur, db

paiement_bp = Blueprint('paiements', __name__)

# POST /paiements : idUser OU client (email libre) requis
@paiement_bp.route('/paiements', methods=['POST'])
def ajouter_paiement():
    data         = request.get_json() or {}
    id_user      = data.get("idUser")
    client_email = data.get("clientEmail") or data.get("client")
    statut       = data.get("statut")        # Par ex. "Payé"
    mode         = data.get("mode")          # "cash" ou "online"
    if not (id_user or client_email):
        return jsonify({"error": "idUser ou clientEmail est requis"}), 400

    user = None
    if id_user:
        user = Utilisateur.query.get(id_user)
        if not user:
            return jsonify({"error": "Utilisateur introuvable"}), 404

    try:
        paiement = Paiement(
            produit        = data["produit"],
            montant        = float(data.get("prix", 0)),
            # On combine ici le statut et le mode
            statutPaiement = f"{statut} ({'Cash' if mode=='cash' else 'En ligne'})",
            datePaiement   = datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            client         = client_email
        )
        if user:
            paiement.utilisateur = user

        db.session.add(paiement)
        db.session.commit()

        # On renvoie la même structure que tu utilises côté client
        return jsonify({
            "paiement": {
                "id":      paiement.idPaiement,
                "produit": paiement.produit,
                "client":  paiement.client,
                "date":    paiement.datePaiement,
                "statut":  paiement.statutPaiement,
                "prix":    f"${paiement.montant:.2f}",
                "avatar":  "/avatar-placeholder.png"
            }
        }), 201

    except Exception as e:
        print("Erreur ajout paiement:", e)
        return jsonify({"error": "Erreur lors de l'ajout"}), 500


# GET /paiements
@paiement_bp.route('/paiements', methods=['GET'])
def get_paiements():
    all_p = Paiement.query.order_by(Paiement.idPaiement.desc()).all()
    result = []
    for p in all_p:
        client_display = f"{p.utilisateur.prenom} {p.utilisateur.nom}" if p.utilisateur else p.client
        result.append({
            "id":      p.idPaiement,
            "produit": p.produit,
            "client":  client_display,
            "date":    p.datePaiement,
            "statut":  p.statutPaiement,    # contiendra désormais e.g. "Payé (Cash)"
            "prix":    f"${p.montant:.2f}",
            "avatar":  "/avatar-placeholder.png"
        })
    return jsonify(result), 200


# PUT /paiement/<id>
@paiement_bp.route('/paiement/<int:id>', methods=['PUT'])
def modifier_paiement(id):
    p = Paiement.query.get(id)
    if not p:
        return jsonify({"error": "Paiement introuvable"}), 404
    data = request.get_json() or {}

    # Si on veut autoriser la modification du mode, on peut aussi lire
    # data.get("mode") ici et le greffer au statutPaiement
    p.produit        = data.get("produit", p.produit)
    # Exemple : on écrase tout le statut (+ mode) à la main
    if "statut" in data and "mode" in data:
        p.statutPaiement = f"{data['statut']} ({'Cash' if data['mode']=='cash' else 'En ligne'})"
    else:
        p.statutPaiement = data.get("statut", p.statutPaiement)

    p.montant        = float(data.get("prix", p.montant))
    db.session.commit()
    return jsonify({"message": "Paiement mis à jour"}), 200
