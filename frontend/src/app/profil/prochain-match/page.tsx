"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../Composants/SideBar/page";
import type { Match } from "@/types/match"; // Si tu veux externaliser le type

type Match = {
  id: number;
  date: string;
  heure: string;
  sport: string;
  lieu: string;
  mode: string;
  prix: string;
  joueurs: string[];
  participants?: string;
};

export default function ProchainsMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [filtreSport, setFiltreSport] = useState("Tous");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5000/api/utilisateur/${userId}`)
      .then((res) => res.json())
      .then((userData) => {
        setUserEmail(userData.email);

        return Promise.all([
          fetch("http://localhost:5000/api/utilisateurs").then((res) => res.json()),
          fetch(`http://localhost:5000/api/utilisateur/${userId}/prochains-matchs`).then((res) =>
            res.json()
          ),
        ]);
      })
      .then(([allUsers, reservations]) => {
        const matchesEnrichis = reservations.map((match: Match) => {
          const participants = match.joueurs
            .map((email) => {
              const user = allUsers.find((u: any) => u.email === email);
              return user ? `${user.prenom} ${user.nom}` : email;
            })
            .join(", ");
          return { ...match, participants };
        });

        setMatches(matchesEnrichis);
      })
      .catch((err) => console.error("Erreur chargement matchs :", err));
  }, []);

  const matchsFiltres = matches.filter((m) =>
    filtreSport === "Tous" ? true : m.sport.toLowerCase() === filtreSport.toLowerCase()
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* ✅ Sidebar à gauche */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 px-6 py-10 mt-10">
        <h1 className="text-2xl font-semibold mb-6">📅 Prochains matchs</h1>

        {/* Filtres */}
        <div className="flex gap-3 mb-6">
          {["Tous", "Tennis", "Badminton", "Pickleball"].map((sport) => (
            <button
              key={sport}
              onClick={() => setFiltreSport(sport)}
              className={`px-4 py-1 rounded-full border text-sm ${
                filtreSport === sport ? "bg-[#7A874C] text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {matchsFiltres.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun match prévu pour ce sport.</p>
        ) : (
          <div className="space-y-4">
            {matchsFiltres.map((match) => (
              <div
                key={match.id}
                className="border rounded p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-[80px] h-[80px] relative shrink-0">
                  <img
                    src={`/accueil/${match.sport.toLowerCase()}.png`}
                    alt={match.sport}
                    className="object-contain w-full h-full rounded"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {match.date} à {match.heure}
                  </p>
                  <p className="font-semibold text-lg">
                    {match.sport} — {match.mode}
                  </p>
                  <p className="text-sm text-gray-500">📍 {match.lieu}</p>
                  <p className="text-sm text-gray-500">💰 {match.prix}</p>
                  <p className="text-sm mt-1 font-medium">
                    🎾 Participants : {match.participants}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
