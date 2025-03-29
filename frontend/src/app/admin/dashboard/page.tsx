"use client";

import React from "react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* Exemple de cards statistiques */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Nombre d’utilisateurs</p>
            <p className="text-3xl font-bold text-[#7A874C] mt-2">245</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Réservations cette semaine</p>
            <p className="text-3xl font-bold text-[#7A874C] mt-2">36</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Taux d’occupation</p>
            <p className="text-3xl font-bold text-[#7A874C] mt-2">82%</p>
          </div>
        </div>

        {/* Placeholder pour du contenu futur */}
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
