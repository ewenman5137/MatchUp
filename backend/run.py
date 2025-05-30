from flask import Flask
from flask_cors import CORS
from routes.auth import auth
from routes.reservation import reservation_bp
from routes.utilisateur import utilisateur_bp
from routes.disponibilites import disponibilites_bp
from routes.evenement import evenement_bp
from routes.admin.dashboardAdmin import dashboard_bp
from routes.admin.paiement import paiement_bp
from routes.tournois import tournoi_bp
from models import db
from models.utilisateur import Utilisateur  
from routes.participant_bp import participants_bp
from routes.rencontre import rencontre_bp
from routes.route_terrain import blocage_bp
from routes.route_game import game_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///matchup.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

app.register_blueprint(auth)
app.register_blueprint(reservation_bp)
app.register_blueprint(utilisateur_bp)
app.register_blueprint(disponibilites_bp)
app.register_blueprint(evenement_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(paiement_bp)
app.register_blueprint(tournoi_bp)
app.register_blueprint(participants_bp)
app.register_blueprint(rencontre_bp)
app.register_blueprint(blocage_bp)
app.register_blueprint(game_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        session = db.session
        all_users = session.query(Utilisateur).all()
        print("Utilisateurs en base :", all_users)

        user = session.get(Utilisateur, 1)
        print("Utilisateur avec ID 1 :", user)


    app.run(debug=True)
