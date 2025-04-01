"use client";
import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    nombre_utilisateurs: 0,
    reservations_semaine: 0,
    taux_occupation: "0%",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Erreur récupération stats:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Nombre d’utilisateurs</p>
            <p className="text-3xl font-bold text-[#7A874C] mt-2">{stats.nombre_utilisateurs}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Réservations cette semaine</p>
            <p className="text-3xl font-bold text-[#7A874C] mt-2">{stats.reservations_semaine}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Taux d’occupation</p>
            <p className="text-3xl font-bold text-[#7A874C] mt-2">{stats.taux_occupation}</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Activité récente</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Aucune activité récente à afficher pour le moment.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
