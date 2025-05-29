from datetime import datetime
from models import db
from models.utilisateur import Utilisateur
from sqlalchemy.orm import relationship

class Paiement(db.Model):
    __tablename__ = 'paiement'

    idPaiement      = db.Column(db.Integer, primary_key=True)
    produit         = db.Column(db.String(120), nullable=False)
    montant         = db.Column(db.Float,   nullable=False)
    statutPaiement  = db.Column(db.String(50))
    datePaiement    = db.Column(db.String(100), default=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M"))

    # email libre (prospect) ou doublon de email utilisateur
    client          = db.Column(db.String(120), nullable=False)

    # liaison optionnelle vers Utilisateur
    user_id         = db.Column(db.Integer, db.ForeignKey('utilisateur.idUser'), nullable=True)
    utilisateur     = relationship(
        "Utilisateur",
        back_populates="paiements"
    )
