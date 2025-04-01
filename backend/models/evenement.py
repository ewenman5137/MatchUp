from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Evenement(db.Model):
    __tablename__ = 'evenement'

    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    type_evenement = db.Column(db.String(20), nullable=False)  # "match" ou "tournoi"
    sport = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    heure = db.Column(db.Time, nullable=False)
    lieu = db.Column(db.String(100), nullable=False)
    nb_joueurs_max = db.Column(db.Integer, nullable=False)
    nb_joueurs_inscrits = db.Column(db.Integer, default=0)
    niveau_requis = db.Column(db.String(50))
    sexe = db.Column(db.String(10))  # "mixte", "homme", "femme"
    organisateur = db.Column(db.String(100), nullable=False)
    date_limite_inscription = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "titre": self.titre,
            "description": self.description,
            "type": self.type_evenement,
            "sport": self.sport,
            "date": self.date.isoformat(),
            "heure": self.heure.strftime("%H:%M"),
            "lieu": self.lieu,
            "nb_joueurs_max": self.nb_joueurs_max,
            "nb_joueurs_inscrits": self.nb_joueurs_inscrits,
            "niveau_requis": self.niveau_requis,
            "sexe": self.sexe,
            "organisateur": self.organisateur,
            "date_limite": self.date_limite_inscription.isoformat() if self.date_limite_inscription else None
        }
