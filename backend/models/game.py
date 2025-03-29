from models import db

class Game(db.Model):
    __tablename__ = 'game'
    idGame = db.Column(db.Integer, primary_key=True)
    scoreEquipe1 = db.Column(db.Integer)
    scoreEquipe2 = db.Column(db.Integer)
    statutGame = db.Column(db.String)
    sets = db.Column(db.String)
