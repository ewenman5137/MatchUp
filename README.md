# MatchUp

[![License](https://img.shields.io/badge/license-MIT-green)]()

## Description

**MatchUp** est une application web destinée à la réservation de terrains de sport et à l’organisation de tournois au sein de l’Université du Québec à Chicoutimi. Elle centralise les démarches de réservation jusque-là effectuées par téléphone ou en présentiel, offrant une interface moderne et accessible 24/7 pour étudiants, personnel et visiteurs externes :contentReference[oaicite:0]{index=0}.

## Fonctionnalités principales

- **Réservation de terrains en ligne**  
  Consultation des disponibilités et confirmation immédiate des créneaux :contentReference[oaicite:1]{index=1}.  
- **Organisation de tournois**  
  Création, gestion et suivi des inscriptions, règles.  
- **Espace personnel**  
  Historique de réservation et modification de profil.  
- **Recherche d’adversaires et gestion d’équipes**  
  Publication d’annonces et constitution d’équipes selon les préférences sportives.  
- **Notifications et rappels**  
  Envoi automatique de confirmations, alertes de match et rappels :contentReference[oaicite:2]{index=2}.  
- **Tableau de bord administratif**  
  Statistiques d’occupation, gestion des comptes et calendrier global des événements.  

## Stack Technique

- **Frontend** : [Next.js](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/)  
- **Backend** : [Flask](https://flask.palletsprojects.com/) (Python)  
- **Base de données** : PostgreSQL  
- **Conteneurisation** : Docker & Docker Compose  
- **CI/CD** : GitHub Actions  
- **Authentification** : JWT + Cookies sécurisés  
- **Hosting** : Vercel (frontend) / Heroku or VPS (backend)

## Architecture

```text
┌─────────────┐    HTTP    ┌──────────────┐    SQL    ┌───────────────┐
│  Next.js    │──────────▶│  Flask API   │─────────▶│  PostgreSQL   │
│  (UI/SSR/SSG)│◀─────────│  (Routes,    │◀─────────│  (Data Store) │
└─────────────┘   fetch   │  Services,   │   ORM    └───────────────┘
                         │  Models)     │
                         └──────────────┘
