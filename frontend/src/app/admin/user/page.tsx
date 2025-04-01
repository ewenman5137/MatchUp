"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";

export default function UtilisateurPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);

  // Récupération des utilisateurs depuis l’API Flask
  useEffect(() => {
    fetch("http://localhost:5000/api/utilisateurs")
      .then((res) => res.json())
      .then((data) => setUtilisateurs(data))
      .catch((err) => console.error("Erreur fetch utilisateurs :", err));
  }, []);

  const supprimerUtilisateur = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/utilisateur/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUtilisateurs(utilisateurs.filter((u: any) => u.id !== id));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <main className="flex-1 p-10 space-y-10">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tous les utilisateurs</h2>
            <div className="flex items-center gap-4">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm">+ Filtre</button>
              <input
                type="text"
                placeholder="🔍 Rechercher"
                className="px-3 py-1 border border-gray-300 rounded text-sm w-60"
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-600">Utilisateur ⬇</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Statut</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Points</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Classement</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((u: any) => (
                  <tr key={u.id} className="border-t">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <img src="/avatar-jean-eude.png" className="w-8 h-8 rounded-full" />
                      {u.prenom} {u.nom}
                    </td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">{u.role || "N/A"}</td>
                    <td className="py-3 px-4">{u.points ?? 0}</td>
                    <td className="py-3 px-4">{u.classement ?? "–"}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => supprimerUtilisateur(u.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 bg-gray-50">
              <button className="px-3 py-1 border border-gray-300 rounded">Précédent</button>
              <span>Page 1 sur 1</span>
              <button className="px-3 py-1 border border-gray-300 rounded">Suivant</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
