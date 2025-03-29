from models import db

class Sport(db.Model):
    __tablename__ = 'sport'
    
    idSport = db.Column(db.Integer, primary_key=True)
    nomSport = db.Column(db.String(100), nullable=False)
    descriptionSport = db.Column(db.String(255))
