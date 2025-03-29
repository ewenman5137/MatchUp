"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../Composants/SideBar/page";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function HistoriquePage() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("tous");
  const [matchType, setMatchType] = useState<string>("tous");
  const [sortBy, setSortBy] = useState<string>("recent");

  const [filteredClassement, setFilteredClassement] = useState<number | string>("—");
  const [filteredPoints, setFilteredPoints] = useState<number>(0);
  const [filteredTendance, setFilteredTendance] = useState<number>(0);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/utilisateur/${userId}/statistiques`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setFilteredGames(data.games || []);
      })
      .catch((err) => console.error("Erreur chargement stats", err));
  }, [userId]);

  useEffect(() => {
    if (!stats?.games) return;
  
    let filtered = [...stats.games];
  
    if (selectedSport !== "tous") {
      filtered = filtered.filter((g) => g.sport?.toLowerCase() === selectedSport);
    }
  
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "vite") {
      filtered.sort((a, b) => (a.duree || 0) - (b.duree || 0));
    }
  
    // Si tableau != tous, on filtre directement
    const gamesToCompute = matchType !== "tous"
      ? filtered.filter((g) => g.type?.toLowerCase() === matchType)
      : filtered;
  
    setFilteredGames(gamesToCompute);

    // 🔁 Trier les matchs à l'intérieur de chaque tournoi
    gamesToCompute.forEach((tournoi) => {
      tournoi.matches.sort((a: any, b: any) => {
        const dateA = new Date(tournoi.date); // On utilise la date du tournoi (ou tu peux utiliser une date dans le match si dispo)
        const dateB = new Date(tournoi.date);

        return sortBy === "recent"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
    });

  
    const groupes = matchType !== "tous"
      ? [gamesToCompute]
      : Object.values(
          gamesToCompute.reduce((acc: any, g) => {
            const key = g.type?.toLowerCase() || "inconnu";
            acc[key] = acc[key] || [];
            acc[key].push(g);
            return acc;
          }, {})
        );
  
    let totalPoints = 0;
    let totalTendance = 0;
    let totalClassement = 0;
    let groupesValides = 0;
  
    groupes.forEach((group: any[]) => {
      if (group.length === 0) return;
  
      let points = 0;
      let victories = 0;
  
      group.forEach((tournoi) => {
        tournoi.matches.forEach((match: any) => {
          const sets1 = match.setsEquipe1 || [];
          const sets2 = match.setsEquipe2 || [];
          const score1 = sets1.filter((s: number, i: number) => s > sets2[i]).length;
          const score2 = sets2.filter((s: number, i: number) => s > sets1[i]).length;
          const win = score1 > score2;
  
          points += win ? 100 : -50;
          if (win) victories++;
        });
      });
  
      let classement = 20;
      if (victories > 5) classement = 1;
      else if (victories > 3) classement = 5;
      else if (victories > 1) classement = 10;
  
      const lastMatches = group.flatMap(t => t.matches).slice(-3);
      const tendance = lastMatches.reduce((acc, match) => {
        const sets1 = match.setsEquipe1 || [];
        const sets2 = match.setsEquipe2 || [];
        const score1 = sets1.filter((s: number, i: number) => s > sets2[i]).length;
        const score2 = sets2.filter((s: number, i: number) => s > sets1[i]).length;
        return acc + (score1 > score2 ? 100 : -50);
      }, 0);
  
      totalPoints += points;
      totalTendance += tendance;
      totalClassement += classement;
      groupesValides++;
    });
  
    setFilteredPoints(groupesValides ? Math.round(totalPoints / groupesValides) : 0);
    setFilteredTendance(groupesValides ? Math.round(totalTendance / groupesValides) : 0);
    setFilteredClassement(groupesValides ? Math.round(totalClassement / groupesValides) : "—");
    
  }, [selectedSport, matchType, sortBy, stats]);
  
  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-gradient-to-tr from-blue-100 to-yellow-50">
        {/* Statistiques */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard title="Votre classement" value={filteredClassement} />
          <StatCard title="Tendance" value={(filteredTendance >= 0 ? "+" : "") + filteredTendance} color={filteredTendance >= 0 ? "green" : "red"} />
          <StatCard title="Nombre de points" value={filteredPoints} />
          <StatCard title="Nombre de victoires" value={stats?.victoires || 0} />
          <StatCard title="Catégorie" value={stats?.categorie || "—"} />
        </div>

        {/* Filtres stylisés */}
        <div className="flex items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sport</span>
            {["tous", "tennis", "badminton", "ping pong"].map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1 rounded-full border ${selectedSport === sport ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100 text-gray-600"}`}
              >
                {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Tableau</span>
            {["tous", "simple", "double", "mixte"].map((type) => (
              <button
                key={type}
                onClick={() => setMatchType(type)}
                className={`px-3 py-1 rounded-full border ${matchType === type ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100 text-gray-600"}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Date</span>
            {["recent", "vite"].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-1 rounded-full border ${sortBy === sort ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100 text-gray-600"}`}
              >
                {sort === "recent" ? "Récents" : "Anciens"}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des tournois */}
        <div className="space-y-4">
          {(filteredGames || []).map((tournoi: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow">
              <button
                className="w-full px-4 py-4 flex justify-between items-center text-left"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-sm font-medium">
                  {tournoi.nom || "Tournoi"} - {tournoi.organisateur || "Organisateur"}  {tournoi.date || "Date"}
                </span>
                {activeAccordion === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {activeAccordion === index && (
                <div className="px-4 pb-4 space-y-2">
                  {(tournoi.matches || []).map((match: any, idx: number) => {
                    const setsEquipe1 = match.setsEquipe1 || [];
                    const setsEquipe2 = match.setsEquipe2 || [];

                    const score1 = setsEquipe1.filter((s: number, i: number) => s > setsEquipe2[i]).length;
                    const score2 = setsEquipe2.filter((s: number, i: number) => s > setsEquipe1[i]).length;
                    const victoire = score1 > score2;

                    return (
                      <div key={idx} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded font-bold text-white mr-4 ${victoire ? "bg-[#7A874C]" : "bg-gray-400"}`}
                        >
                          {victoire ? "V" : "D"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Toi</p>
                          <p className="text-sm text-gray-600">Adversaire</p>
                        </div>
                        <div className="text-xs text-center mx-4">
                          <p className="flex gap-1 justify-center">
                            {setsEquipe1.map((s: number, i: number) => (
                              <span
                                key={i}
                                className={s > (setsEquipe2[i] ?? 0) ? "font-bold" : ""}
                              >
                                {s}
                              </span>
                            ))}
                          </p>
                          <p className="flex gap-1 justify-center text-gray-500">
                            {setsEquipe2.map((s: number, i: number) => (
                              <span
                                key={i}
                                className={s > (setsEquipe1[i] ?? 0) ? "font-bold" : ""}
                              >
                                {s}
                              </span>
                            ))}
                          </p>
                        </div>

                        <div className={`text-sm font-semibold ${victoire ? "text-green-600" : "text-red-500"}`}>
                          {victoire ? "+100" : "-50"} points
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
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
