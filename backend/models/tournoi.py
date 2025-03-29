from models import db
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship

class Tournoi(db.Model):
    __tablename__ = 'tournoi'

    idTournoi = Column(Integer, primary_key=True)
    nomTournoi = Column(String)
    descriptionTournoi = Column(String)
    dateTournoi = Column(String)
    heureDebut = Column(String)
    heureFin = Column(String)

    sport_id = Column(Integer, ForeignKey('sport.idSport'), nullable=False)
    sport = relationship('Sport', backref='tournois')

    tableau = db.Column(Enum('simple', 'double', 'mixte', 'autre', name='tableau_type'), nullable=False)
