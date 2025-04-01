"use client";

import React, { useEffect, useState } from "react";

interface Evenement {
  id: number;
  date: string; // Format: YYYY-MM-DD
  heure: string; // Format: HH:MM
  sport: string;
  lieu: string;
  type: "match" | "tournoi";
  joueursActuels: number;
  joueursMax: number;
  niveau?: string;
  sexe?: string;
  description?: string;
  organisateur: string;
}

const sports = ["Tennis", "Badminton", "Pickleball", "Aucun"];

export default function EvenementFinder({ type }: { type: "match" | "tournoi" }) {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("Aucun");

  useEffect(() => {
    fetch("http://localhost:5000/evenements")
      .then((res) => res.json())
      .then((data) => setEvenements(data))
      .catch((err) => console.error("Erreur chargement :", err));
  }, []);

  const now = new Date();
  const filtres = evenements.filter((e) => {
    const dateHeure = new Date(`${e.date}T${e.heure}`);
    return (
      e.type === type &&
      dateHeure >= now &&
      (selectedSport === "Aucun" || e.sport === selectedSport)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">
        {type === "match" ? "Trouver un adversaire" : "S'inscrire à un tournoi"}
      </h2>

      <div className="flex space-x-2 items-center">
        <span className="text-sm">Filtre :</span>
        {sports.map((s) => (
          <button
            key={s}
            className={`px-4 py-1 rounded-full text-sm border ${selectedSport === s ? "bg-green-700 text-white" : "bg-gray-100"}`}
            onClick={() => setSelectedSport(s)}
          >
            {s}
          </button>
        ))}
        <button className="ml-auto px-4 py-2 bg-green-700 text-white rounded">Trouver un match</button>
      </div>

      <div className="space-y-6">
        {filtres.map((e) => (
          <div key={e.id} className="bg-white p-4 rounded shadow-md">
            <h3 className="font-semibold text-lg mb-1">
              {e.sport} - {e.lieu}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(`${e.date}T${e.heure}`).toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="text-sm">
              {type === "match" ? `Niveau requis: ${e.niveau || "Aucun"}` : `Type de tournoi : ${e.type}`}
            </p>
            <p className="text-sm">Nombre de joueurs : {e.joueursActuels}/{e.joueursMax}</p>
            <p className="text-sm">Sexe des participants : {e.sexe || "mixte"}</p>
            <p className="text-sm mb-2">Organisateur : {e.organisateur}</p>
            {e.description && <p className="text-sm italic mb-2">{e.description}</p>}

            <button className="bg-green-600 text-white px-4 py-1 rounded text-sm">S'inscrire</button>
          </div>
        ))}

        {filtres.length === 0 && (
          <p className="text-sm text-gray-500">Aucun événement à venir pour ces critères.</p>
        )}
      </div>
    </div>
  );
}
