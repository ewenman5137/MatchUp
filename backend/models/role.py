from models import db

class Role(db.Model):
    __tablename__ = 'role'
    
    idRole = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), nullable=False)
