"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";

export default function UtilisateurPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <main className="flex-1 p-10 space-y-10">
        {/* Tous les utilisateurs */}
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
                  <th className="py-3 px-4 font-medium text-gray-600">Utilisateurs ⬇</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Numéro Tel.</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Statut</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Nombre de match</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {["Étudiant", "Employé", "Externe"].map((statut, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <img src="/avatar-jean-eude.png" className="w-8 h-8 rounded-full" />
                      John Doe
                    </td>
                    <td className="py-3 px-4">JohnDoe@gmail.com</td>
                    <td className="py-3 px-4">+33782347282</td>
                    <td className="py-3 px-4">{statut}</td>
                    <td className="py-3 px-4">0</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-gray-500 hover:text-red-600">
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

        {/* Utilisateurs signalés */}
        <section>
          <div className="flex items-center justify-between mb-4 mt-6">
            <h2 className="text-xl font-semibold">Utilisateurs signalés</h2>
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
                  <th className="py-3 px-4 font-medium text-gray-600">Utilisateurs ⬇</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Numéro Tel.</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Signaleur</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Motif</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img src="/avatar-jean-eude.png" className="w-8 h-8 rounded-full" />
                    John Doe
                  </td>
                  <td className="py-3 px-4">JohnDoe@gmail.com</td>
                  <td className="py-3 px-4">+33782347282</td>
                  <td className="py-3 px-4">John John</td>
                  <td className="py-3 px-4">
                    Trop nul au tennis
                    <a href="#" className="ml-2 text-blue-600 text-sm underline">
                      voir le profil
                    </a>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-gray-500 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
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
