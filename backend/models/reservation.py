from models import db

class Reservation(db.Model):
    __tablename__ = 'reservation' 

    idReservation = db.Column(db.Integer, primary_key=True)
    heureDebut = db.Column(db.String(10), nullable=False)
    heureFin = db.Column(db.String(10), nullable=False)
    dateReservation = db.Column(db.String(20), nullable=False)
    statutReservation = db.Column(db.String(50), nullable=False)

    # Champs supplémentaires pour le formulaire :
    modeJeu = db.Column(db.String(50))     # Ex: "jouer_amis", "tournoi", "rechercher_adversaire"
    sport = db.Column(db.String(50))       # Ex: "Tennis"
    prix = db.Column(db.String(20))        # Ex: "Gratuit" ou "14$"
    joueurs = db.Column(db.JSON)
