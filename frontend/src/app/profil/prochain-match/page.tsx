"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../Composants/SideBar/page";

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

type Tournoi = {
  id: number;
  titre: string;
  date: string;
  heure: string;
  sport: string;
  tableau: string;
  participants: string[];
  organisateur: string;
};

export default function ProchainsMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [filtreSport, setFiltreSport] = useState("Tous");
  const [tournoisParticipant, setTournoisParticipant] = useState<Tournoi[]>([]);
  const [tournoisOrganisateur, setTournoisOrganisateur] = useState<Tournoi[]>([]);

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
          fetch(`http://localhost:5000/tournois`).then((res) => res.json()),
          fetch(`http://localhost:5000/api/utilisateur/${userData.email}/organise-tournoi`).then((res) =>
            res.json()
          )
        ]);
      })
      .then(([allUsers, reservations, allTournois, organisateurResponse]) => {
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

        const participant = allTournois.filter(
          (t: Tournoi) => t.participants?.includes(userEmail) && t.organisateur !== userEmail
        );

        setTournoisParticipant(participant);
        setTournoisOrganisateur(organisateurResponse.tournois || []);
      })
      .catch((err) => console.error("Erreur :", err));
  }, []);

  const handleModifierScore = async (matchId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/game/${matchId}`);
      if (!res.ok) {
        alert("Impossible de récupérer les infos du match");
        return;
      }
      const game = await res.json();

      const score1 = prompt("Score Équipe 1 :", game.scoreEquipe1);
      const score2 = prompt("Score Équipe 2 :", game.scoreEquipe2);
      const sets = prompt("Sets (ex: 11-9;8-11;11-6) :", game.sets || "");

      const updateRes = await fetch(`http://localhost:5000/api/game/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scoreEquipe1: parseInt(score1),
          scoreEquipe2: parseInt(score2),
          sets: sets,
          statutGame: "Terminé"
        })
      });

      if (updateRes.ok) {
        alert("Score mis à jour !");
        window.location.reload();
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    }
  };

  const matchsFiltres = matches.filter((m) =>
    filtreSport === "Tous" ? true : m.sport.toLowerCase() === filtreSport.toLowerCase()
  );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 px-6 py-10 mt-10">
        <h1 className="text-2xl font-semibold mb-6">📅 Prochains matchs</h1>

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
              <div key={match.id} className="border rounded p-4 flex items-center gap-4 shadow-sm">
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
                  <p className="font-semibold text-lg">{match.sport} — {match.mode}</p>
                  <p className="text-sm text-gray-500">📍 {match.lieu}</p>
                  <p className="text-sm text-gray-500">💰 {match.prix}</p>
                  <p className="text-sm mt-1 font-medium">🎾 Participants : {match.participants}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold mt-12 mb-4">🎾 Tournois auxquels je participe</h2>
        {tournoisParticipant.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun tournoi prévu où vous êtes inscrit(e).</p>
        ) : (
          <div className="space-y-4">
            {tournoisParticipant.map((t) => (
              <div key={t.id} className="border rounded p-4 shadow-sm flex items-center gap-4">
                <div className="w-[80px] h-[80px] relative shrink-0">
                  <img src={`/accueil/${t.sport.toLowerCase()}.png`} alt={t.sport} className="w-full h-full object-contain rounded" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t.date} à {t.heure}</p>
                  <p className="text-lg font-semibold">{t.titre}</p>
                  <p className="text-sm text-gray-500">📍 UQAC, Chicoutimi</p>
                  <p className="text-sm text-gray-500">🧑‍🤝‍🧑 Format : {t.tableau}</p>
                  <p className="text-sm mt-1 font-medium">Participants : {t.participants.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold mt-12 mb-4">🧑‍💼 Tournois que j’organise</h2>
        {tournoisOrganisateur.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun tournoi que vous organisez pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {tournoisOrganisateur.map((t) => (
              <div key={t.id} className="border rounded p-4 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-[80px] h-[80px] relative shrink-0">
                    <img src={`/accueil/${t.sport.toLowerCase()}.png`} alt={t.sport} className="w-full h-full object-contain rounded" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.date} à {t.heure}</p>
                    <p className="text-lg font-semibold">{t.titre}</p>
                    <p className="text-sm text-gray-500">📍 UQAC, Chicoutimi</p>
                    <p className="text-sm text-gray-500">🧑‍🤝‍🧑 Format : {t.tableau}</p>
                    <p className="text-sm text-gray-500">📧 Organisateur : {t.organisateur}</p>
                    <p className="text-sm mt-1 font-medium">Participants : {t.participants.join(", ")}</p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce tournoi ?");
                    if (!confirmDelete) return;

                    const res = await fetch(`http://localhost:5000/tournois/${t.id}`, {
                      method: "DELETE",
                    });

                    if (res.ok) {
                      setTournoisOrganisateur((prev) =>
                        prev.filter((tournoi) => tournoi.id !== t.id)
                      );
                    } else {
                      alert("Erreur lors de la suppression du tournoi.");
                    }
                  }}
                  className="mt-2 self-start text-sm text-red-600 hover:underline"
                >
                  Supprimer ce tournoi
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
