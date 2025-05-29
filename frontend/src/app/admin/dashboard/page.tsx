"use client";
import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";

type Statistiques = {
  nombre_utilisateurs: number;
  reservations_semaine: number;
  taux_occupation: string;
  activites_recentes: Activite[];
};

type Activite = {
  id: string;
  type: "reservation" | "paiement";
  description: string;
  date: string; // ISO
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Statistiques>({
    nombre_utilisateurs: 0,
    reservations_semaine: 0,
    taux_occupation: "0%",
    activites_recentes: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data: Statistiques) => setStats(data))
      .catch((err) => console.error("Erreur récupération stats:", err));
  }, []);

  const {
    nombre_utilisateurs,
    reservations_semaine,
    taux_occupation,
    activites_recentes,
  } = stats;

  // Filtrer
  const filtered = activites_recentes.filter((act) =>
    act.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 p-10 space-y-10">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-6">
          <Card label="Nombre d’utilisateurs" value={nombre_utilisateurs} />
          <Card
            label="Réservations cette semaine"
            value={reservations_semaine}
          />
          <Card
            label="Taux d’occupation"
            value={taux_occupation}
            isString
          />
        </div>

        {/* Activité récente */}
        <section className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Activité récente
            </h2>
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded text-sm w-full md:w-64"
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center p-4 text-gray-500"
                    >
                      Aucune activité trouvée.
                    </td>
                  </tr>
                ) : (
                  pageData.map((act) => (
                    <tr key={act.id} className="border-t">
                      <td className="p-3">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            act.type === "reservation"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        />
                        {act.type === "reservation"
                          ? "Réservation"
                          : "Paiement"}
                      </td>
                      <td className="p-3">{act.description}</td>
                      <td className="p-3">
                        {new Date(act.date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 bg-gray-50">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Précédent
              </button>
              <span>
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({
  label,
  value,
  isString,
}: {
  label: string;
  value: number | string;
  isString?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-[#7A874C] mt-2">
        {isString ? (value as string) : (value as number)}
      </p>
    </div>
  );
}
