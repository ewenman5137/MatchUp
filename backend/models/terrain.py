from models import db

class Terrain(db.Model):
    __tablename__ = 'terrain'
    
    idTerrain = db.Column(db.Integer, primary_key=True)
    nomTerrain = db.Column(db.String(100), nullable=False)
    capaciteMax = db.Column(db.Integer, nullable=False)
