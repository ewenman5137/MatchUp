"use client";

import React from "react";
import Sidebar from "../../Composants/SideBar/page";
import { CalendarDays, MapPin, X } from "lucide-react";

export default function AgendaPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10 bg-gray-50">
        <div className="grid grid-cols-3 gap-6">
          {/* Colonne gauche - Événements */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Événement à venir</h2>
              <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                <img src="/tennis_image.jpg" alt="Tennis" className="w-20 h-20 object-cover rounded" />
                <div>
                  <p className="text-sm text-gray-500">Dimanche 16 juillet 2025 à 18h</p>
                  <p className="font-semibold">Tennis</p>
                  <p className="text-sm text-gray-500">UQAC, Chicoutimi</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Événement passé</h2>
              <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                <img src="/tennis_image.jpg" alt="Tennis" className="w-20 h-20 object-cover rounded" />
                <div>
                  <p className="text-sm text-gray-500">Samedi 15 juillet 2025 à 18h</p>
                  <p className="font-semibold">Tennis</p>
                  <p className="text-sm text-gray-500">UQAC, Chicoutimi</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Politique d'annulation</h2>
              <div className="bg-white rounded-lg shadow p-4 text-sm text-gray-600">
                Vous pouvez annuler jusqu'à 24h avant sinon vous ne serez pas remboursé des frais d'inscription.
              </div>
            </div>
          </div>

          {/* Colonne centrale - Détails */}
          <div className="col-span-2 bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Lundi 17 juillet 2025 à 18h</h2>

            <div className="flex gap-4 items-center">
              <img src="/tennis_image.jpg" alt="Tennis" className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <p className="font-semibold">Tennis - Pavillon Sportif</p>
                <p className="text-sm text-gray-500">UQAC - 555, boulevard de l'Université, Chicoutimi</p>
                <p className="text-sm text-gray-400">Réservation ref. #: 65742695</p>
              </div>
              <div className="flex gap-3">
                <button className="flex flex-col items-center text-sm text-gray-700 hover:text-black">
                  <MapPin className="w-5 h-5 mb-1" />
                  S’y rendre
                </button>
                <button className="flex flex-col items-center text-sm text-gray-700 hover:text-black">
                  <CalendarDays className="w-5 h-5 mb-1" />
                  Reporter
                </button>
                <button className="flex flex-col items-center text-sm text-red-500 hover:text-red-700">
                  <X className="w-5 h-5 mb-1" />
                  Annuler
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4 text-sm space-y-1">
              <p className="font-semibold">Terrain n°1</p>
              <p>Durée : 1h</p>
              <p>2 joueurs</p>
            </div>

            <div className="border-t pt-4 flex justify-between items-center text-sm">
              <span className="text-gray-600">Taxes</span>
              <span className="text-gray-400">Incluses</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>12€</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
