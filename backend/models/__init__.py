from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

# 1. Import uniquement les classes de modèle (PAS les tables d'association)
from .utilisateur import Utilisateur
from .reservation import Reservation
from .sport import Sport
from .terrain import Terrain
from .tournoi import Tournoi
from .game import Game
from .paiement import Paiement
from .role import Role

# 2. Maintenant que tous les modèles sont enregistrés,
# on peut définir les tables d'association
from sqlalchemy import Column, Integer, String, ForeignKey, Table

associer = db.Table(
    'associer',
    Column('idUser', ForeignKey('utilisateur.idUser'), primary_key=True),
    Column('idReservation', ForeignKey('reservation.idReservation'), primary_key=True)
)

appartenir = db.Table(
    'appartenir',
    Column('idUser', ForeignKey('utilisateur.idUser'), primary_key=True),
    Column('idRole', ForeignKey('role.idRole'), primary_key=True)
)

lier = db.Table(
    'lier',
    Column('idSport', ForeignKey('sport.idSport'), primary_key=True),
    Column('idTournoi', ForeignKey('tournoi.idTournoi'), primary_key=True)
)

relier = db.Table(
    'relier',
    Column('idTerrain', ForeignKey('terrain.idTerrain'), primary_key=True),
    Column('idReservation', ForeignKey('reservation.idReservation'), primary_key=True)
)

utiliser = db.Table(
    'utiliser',
    Column('idTerrain', ForeignKey('terrain.idTerrain'), primary_key=True),
    Column('idGame', ForeignKey('game.idGame'), primary_key=True)
)

contenir = db.Table(
    'contenir',
    Column('idTournoi', ForeignKey('tournoi.idTournoi'), primary_key=True),
    Column('idGame', ForeignKey('game.idGame'), primary_key=True)
)

inscrire = db.Table(
    'inscrire',
    Column('idUser', ForeignKey('utilisateur.idUser'), primary_key=True),
    Column('idTournoi', ForeignKey('tournoi.idTournoi'), primary_key=True),
    Column('roleParticipant', String)
)

payer = db.Table(
    'payer',
    Column('idUser', ForeignKey('utilisateur.idUser'), primary_key=True),
    Column('idPaiement', ForeignKey('paiement.idPaiement'), primary_key=True)
)

jouer = db.Table(
    'jouer',
    Column('idUser', ForeignKey('utilisateur.idUser'), primary_key=True),
    Column('idGame', ForeignKey('game.idGame'), primary_key=True)
)

# 3. Déclaration des relations avec relationship()
Utilisateur.reservations = db.relationship(
    Reservation,
    secondary=associer,
    backref="utilisateurs"
)

Utilisateur.tournois = db.relationship(
    Tournoi,
    secondary=inscrire,
    backref="participants"
)

Utilisateur.paiements = db.relationship(
    Paiement,
    secondary=payer,
    backref="utilisateurs"
)

Utilisateur.roles = db.relationship(
    Role,
    secondary=appartenir,
    backref="utilisateurs"
)

Utilisateur.games = db.relationship(
    Game,
    secondary=jouer,
    backref="joueurs"
)

Tournoi.games = db.relationship(
    Game,
    secondary=contenir,
    backref="tournois"
)
