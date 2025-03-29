from flask import Flask
from flask_cors import CORS
from routes.auth import auth
from routes.reservation import reservation_bp
from routes.utilisateur import utilisateur_bp
from routes.disponibilites import disponibilites_bp
from models import db
from models.utilisateur import Utilisateur  # 👈 importe bien ici ton modèle

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///matchup.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

app.register_blueprint(auth)
app.register_blueprint(reservation_bp)
app.register_blueprint(utilisateur_bp)
app.register_blueprint(disponibilites_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        session = db.session
        all_users = session.query(Utilisateur).all()
        print("Utilisateurs en base :", all_users)

        user = session.get(Utilisateur, 1)
        print("Utilisateur avec ID 1 :", user)


    app.run(debug=True)
