"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/Composants/Header/page";
import Footer from "@/app/Composants/Footer/page";
import EventFinder from "@/app/Composants/EvenementFinder/EvenementFinder"

export default function TournoiPage() {
  const [tournois, setTournois] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/evenement/a_venir")
      .then((res) => res.json())
      .then((data) => {
        const filtres = data.filter((e: any) => e.type === "tournoi");
        setTournois(filtres);
      })
      .catch((err) => console.error("Erreur chargement tournois:", err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <h2 className="text-xl text-gray-500 mb-2">Page d'accueil &gt; S'inscrire à un tournoi</h2>
        <h1 className="text-3xl font-bold text-[#6F803F] mb-6">Tournois à venir</h1>

        {/* Filtrage, bandeaux, etc. peuvent être ajoutés ici */}

        <EventFinder evenements={tournois} mode="tournoi" />
      </div>
      <Footer />
    </div>
  );
}
