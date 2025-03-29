from models import db

class Paiement(db.Model):
    __tablename__ = 'paiement'
    
    idPaiement = db.Column(db.Integer, primary_key=True)
    montant = db.Column(db.Float, nullable=False)
    statutPaiement = db.Column(db.String(50))
    datePaiement = db.Column(db.String(100))
