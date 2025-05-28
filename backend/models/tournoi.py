from models import db

class Tournoi(db.Model):
    __tablename__ = 'tournoi'

    idTournoi = db.Column(db.Integer, primary_key=True)
    nomTournoi = db.Column(db.String)
    descriptionTournoi = db.Column(db.String)
    dateTournoi = db.Column(db.String)  # format ISO YYYY-MM-DD
    heureDebut = db.Column(db.String)
    heureFin = db.Column(db.String)
    sport_id = db.Column(db.Integer, db.ForeignKey('sport.idSport'), nullable=False)
    sport = db.relationship('Sport', backref='tournois')
    tableau = db.Column(db.Enum('simple', 'double', 'mixte', 'autre', name='tableau_type'), nullable=False)

    # ✅ Ajouter l’email de l’organisateur
    emailOrganisateur = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.idTournoi,
            "titre": self.nomTournoi,
            "description": self.descriptionTournoi,
            "date": self.dateTournoi,
            "heure": self.heureDebut,
            "heureFin": self.heureFin,
            "sport": self.sport.nomSport if self.sport else "Inconnu",
            "tableau": self.tableau,
            "nb_joueurs_max": 10,
            "nb_joueurs_inscrits": 2,
            "organisateur": self.emailOrganisateur,  # ✅ modifié ici aussi
            "niveau_requis": "Aucun",
            "date_limite": "2025-07-19T18:00:00"
        }
