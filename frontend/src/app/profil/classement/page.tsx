"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../Composants/SideBar/page";

export default function ClassementPage() {
  const [search, setSearch] = useState("");
  const [joueurs, setJoueurs] = useState<any[]>([]);
  const [filteredJoueurs, setFilteredJoueurs] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("tous");
  const [matchType, setMatchType] = useState<string>("tous");
  const [selectedSexe, setSelectedSexe] = useState<string>("tous");

  const [classement, setClassement] = useState<number | string>("—");
  const [points, setPoints] = useState<number>(0);
  const [victoires, setVictoires] = useState<number>(0);
  const [categorie, setCategorie] = useState<string>("—");
  const [tendance, setTendance] = useState<number>(0);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    fetch("http://localhost:5000/api/classement") // ⚠️ Crée une route Flask qui retourne tous les utilisateurs avec leurs stats
      .then((res) => res.json())
      .then((data) => {
        setJoueurs(data);
        setFilteredJoueurs(data);
      })
      .catch((err) => console.error("Erreur chargement classement", err));
  }, []);

  useEffect(() => {
    let filtres = [...joueurs];

    if (selectedSport !== "tous") {
      filtres = filtres.map(j => ({
        ...j,
        games: j.games.filter((g: any) => g.sport?.toLowerCase() === selectedSport)
      }));
    }

    if (matchType !== "tous") {
      filtres = filtres.map(j => ({
        ...j,
        games: j.games.filter((g: any) => g.type?.toLowerCase() === matchType)
      }));
    }

    if (selectedSexe !== "tous") {
      filtres = filtres.filter(j => j.sexe?.toLowerCase() === selectedSexe);
    }

    if (search) {
      filtres = filtres.filter(j => j.pseudo.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredJoueurs(filtres);

    const currentUser = filtres.find(j => j.id === Number(userId));
    if (currentUser) {
      const games = currentUser.games || [];

      const vic = games.reduce((acc: number, tournoi: any) => {
        return acc + (tournoi.matches || []).filter((match: any) => {
          const s1 = match.setsEquipe1 || [];
          const s2 = match.setsEquipe2 || [];
          return s1.filter((x: number, i: number) => x > s2[i]).length >
                 s2.filter((x: number, i: number) => x > s1[i]).length;
        }).length;
      }, 0);

      const pts = vic * 100 - (games.length - vic) * 50;

      const lastMatches = games.flatMap(t => t.matches).slice(-3);
      const tend = lastMatches.reduce((acc, match) => {
        const s1 = match.setsEquipe1 || [];
        const s2 = match.setsEquipe2 || [];
        return acc + (s1.filter((x, i) => x > s2[i]).length > s2.filter((x, i) => x > s1[i]).length ? 100 : -50);
      }, 0);

      setClassement(currentUser.classement || "—");
      setPoints(currentUser.points);
      setVictoires(vic);
      setCategorie(currentUser.categorie || "—");
      setTendance(tend);
    }

  }, [joueurs, selectedSport, matchType, selectedSexe, search]);

  const xpMax = Math.max(...filteredJoueurs.map(j => j.xp || 0));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-gradient-to-tr from-blue-100 to-yellow-50">

        {/* Statistiques */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard title="Votre classement" value={classement} />
          <StatCard title="Tendance" value={(tendance >= 0 ? "+" : "") + tendance} color={tendance >= 0 ? "green" : "red"} />
          <StatCard title="Nombre de points" value={points} />
          <StatCard title="Nombre de victoires" value={victoires} />
          <StatCard title="Catégorie" value={categorie} />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center space-x-4 mb-4 text-sm">
          <span className="font-medium">Sport</span>
          {["tous", "tennis", "badminton", "ping pong"].map(s => (
            <button key={s} onClick={() => setSelectedSport(s)} className={`px-3 py-1 rounded-full border ${selectedSport === s ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{s}</button>
          ))}

          <span className="ml-4 font-medium">Tableau</span>
          {["tous", "simple", "double", "mixte"].map(t => (
            <button key={t} onClick={() => setMatchType(t)} className={`px-3 py-1 rounded-full border ${matchType === t ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{t}</button>
          ))}

          <span className="ml-4 font-medium">Sexe</span>
          {["tous", "m", "f"].map(sexe => (
            <button key={sexe} onClick={() => setSelectedSexe(sexe)} className={`px-3 py-1 rounded-full border ${selectedSexe === sexe ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
              {sexe === "tous" ? "Tous" : sexe.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Recherche */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Chercher un pseudo"
            className="px-3 py-1 border border-gray-300 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2">N°</th>
                <th className="py-2">Pseudo</th>
                <th className="py-2 text-right">XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredJoueurs.map((j, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">{j.rang || index + 1}</td>
                  <td className="py-2 flex items-center gap-2">
                    <img src="/avatar-placeholder.png" alt="avatar" className="w-5 h-5 rounded-full" />
                    {j.pseudo}
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>{j.xp}</span>
                      <div className="w-40 h-2 bg-gray-200 rounded">
                        <div className="h-full bg-green-400 rounded" style={{ width: `${(j.xp / xpMax) * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJoueurs.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400">
                    Aucun joueur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color = "black" }: { title: string; value: any; color?: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
    </div>
  );
}
