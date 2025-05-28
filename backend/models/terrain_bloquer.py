from models import db

class BlocageCreneau(db.Model):
    __tablename__ = 'blocage_creneau'

    id = db.Column(db.Integer, primary_key=True)
    sport = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(20), nullable=False)  # Format YYYY-MM-DD
    heure = db.Column(db.String(5), nullable=False)  # Format "08:00"

    def to_dict(self):
        return {
            "id": self.id,
            "sport": self.sport,
            "date": self.date,
            "heure": self.heure
        }
