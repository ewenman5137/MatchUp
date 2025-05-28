"use client";

import './globals.css';
import './page.css';
import Header from './Composants/Header/page';
import Footer from './Composants/Footer/page';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const modes = [
  {
    id: "jouer_amis",
    title: "Jouer entre amis",
    icon: "🎮",
    description: "Réserve un terrain pour toi et tes potes !",
  },
  {
    id: "rechercher_adversaire",
    title: "Créer ou trouver un match",
    icon: "🔍",
    description: "Laisse une description pour trouver un adversaire.",
  },
  {
    id: "inscription_tournoi",
    title: "Participer à un tournoi",
    icon: "🏆",
    description: "Inscris-toi pour la compétition !",
  },
  {
    id: "creer_tournoi",
    title: "Créer un tournoi",
    icon: "🛠️",
    description: "Organise ton propre tournoi entre joueurs.",
  },
];

export default function Accueil() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const router = useRouter();

  const openModal = (sport: string) => {
    setSelectedSport(sport);
    setIsModalOpen(true);
  };

  const handleModeClick = (mode: string) => {
    if (mode === "jouer_amis" || mode === "creer_tournoi" || mode === "rechercher_adversaire") {
      router.push(`/reservation/form/${mode}?sport=${selectedSport}`);
    } else if (mode === "inscription_tournoi") {
      router.push(`/tournoi`);
    } else {
      router.push(`/adversaire`);
    }
  };  
  

  return (
    <div id="Accueil">
      <Header />

      <div id="header">
        <img id="imageAccueil" src="accueil/AccueilTerrain.png" alt="" />
        <div id="containeurText">
          <h1>Bienvenue sur le service des sports de l’uqac</h1>
          <h3>
            <br />
            <br />
            Vous retrouverez ici toutes informations pour pratiquer du sport au sein de l’UQAC.
            <br />
            <br />
            Vous pourrez ici vous inscrire à des cours, participer à des tournois ainsi que réserver des terrains pour jouer entre vous.
          </h3>
        </div>
      </div>

      <div className="titre">
        <div className="barreSeparation"></div>
        <h2>Comment fonctionne ce service ?</h2>
        <div className="barreSeparation"></div>
      </div>

      <div id="containeurFonctionnementService">
        <div id="containeurText">
          <p>Ce service a pour but de vous permettre d’accéder facilement aux équipements sportifs de l’UQAC. Vous y trouverez des sports comme le badminton, le tennis, le pickleball, et bien d’autres activités.</p>
          <p>
            <br />Vous pouvez réserver un terrain ou même participer à un tournoi. <br />
            - Étudiants : La réservation d’un terrain est gratuite.<br />
            - Employés : Vous bénéficiez d’une réduction.<br />
            - Externes : Vous êtes les bienvenus moyennant une participation financière.
          </p>
          <p>Si vous n’avez pas de raquette ou d’équipement, pas de panique ! L’UQAC propose également la location de matériel.</p>
        </div>
        <img src="accueil/imageBad.png" alt="" />
      </div>

      <div className="titre">
        <div className="barreSeparation"></div>
        <h2>Réserver un de nos terrains</h2>
        <div className="barreSeparation"></div>
      </div>

      <div id="containeurReservationSport">
        <div className="sportPetit" onClick={() => openModal("badminton")}>
          <img className="imagePetiteImage" src="accueil/badmintonReservation.png" alt="" />
          <button className="btnReservation">Réserver un terrain de badminton</button>
        </div>
        <div className="sportPetit" onClick={() => openModal("pickleball")}>
          <img className="imagePetiteImage" src="accueil/pickelballReservation.png" alt="" />
          <button className="btnReservation">Réserver un terrain de pickleball</button>
        </div>
        <div className="sportPetit" onClick={() => openModal("tennis")}>
          <img className="imagePetiteImage" src="accueil/tennisReservation.png" alt="" />
          <button className="btnReservation">Réserver un terrain de tennis</button>
        </div>
      </div>

      <div className="titre">
        <div className="barreSeparation"></div>
        <h2>Sport en équipes</h2>
        <div className="barreSeparation"></div>
      </div>

      <div id="containeurSportEquipe">
        <div className="sport">
          <a href="https://www.uqac.ca/inuk/hockey-masculin/" target="_blank" rel="noopener noreferrer">Hockey</a>
          <img src="accueil/hockey.jpg" alt="Hockey" />
        </div>
        <div className="sport">
          <img src="accueil/volleyball.jpg" alt="Volleyball" />
          <a href="https://www.uqac.ca/inuk/volleyball-feminin/" target="_blank" rel="noopener noreferrer">Volleyball</a>
        </div>
        <div className="sport">
          <a href="https://www.uqac.ca/inuk/cross-country/" target="_blank" rel="noopener noreferrer">Cross-country</a>
          <img src="accueil/cross-country.jpg" alt="Cross-country" />
        </div>
        <div className="sport">
          <img src="accueil/athletisme.jpg" alt="Athlétisme" />
          <a href="https://www.uqac.ca/inuk/athletisme/" target="_blank" rel="noopener noreferrer">Athlétisme</a>
        </div>
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full">
            <h2 className="text-2xl font-bold text-center mb-6">
              Choisis ton mode de jeu pour le <span className="capitalize">{selectedSport}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {modes.map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => handleModeClick(mode.id)}
                  className="cursor-pointer bg-gray-100 p-5 rounded-lg hover:bg-gray-200 transition text-center"
                >
                  <div className="text-4xl">{mode.icon}</div>
                  <h3 className="text-lg font-semibold mt-2 text-[#6F803F]">{mode.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{mode.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
