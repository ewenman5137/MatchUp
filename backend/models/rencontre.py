from models import db
from datetime import datetime

class RencontreProposee(db.Model):
    __tablename__ = "rencontre_proposee"

    id = db.Column(db.Integer, primary_key=True)
    
    # Joueur ayant proposé la rencontre
    idJoueur1 = db.Column(db.Integer, db.ForeignKey('utilisateur.idUser'), nullable=False)
    joueur1 = db.relationship('Utilisateur', foreign_keys=[idJoueur1])

    # Joueur ayant accepté la rencontre
    idJoueur2 = db.Column(db.Integer, db.ForeignKey('utilisateur.idUser'), nullable=True)
    joueur2 = db.relationship('Utilisateur', foreign_keys=[idJoueur2])

    sport = db.Column(db.String(50), nullable=False)
    niveau = db.Column(db.String(50), nullable=True)  # pour filtrer par niveau
    date = db.Column(db.Date, nullable=False)
    heure = db.Column(db.String(5), nullable=False)  # Ex: "18:00"
    duree = db.Column(db.Integer, default=1)  # Durée en heures
    terrain = db.Column(db.String(100), nullable=True)
    statut = db.Column(db.String(20), default="en_attente")  # en_attente, accepté, annulé
    commentaire = db.Column(db.Text, nullable=True)

    date_creation = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "joueur1": self.joueur1.email,
            "joueur2": self.joueur2.email if self.joueur2 else None,
            "sport": self.sport,
            "niveau": self.niveau,
            "date": self.date.isoformat(),
            "heure": self.heure,
            "duree": self.duree,
            "terrain": self.terrain,
            "statut": self.statut,
            "commentaire": self.commentaire
        }

