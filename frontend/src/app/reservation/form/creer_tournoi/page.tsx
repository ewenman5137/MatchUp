"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Header from "@/app/Composants/Header/page";
import Image from "next/image";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const sports = ["Tennis", "Badminton", "Pickleball"];
const horaires = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
const today = new Date();

export default function CreerTournoi() {
  const [selectedSport, setSelectedSport] = useState("Tennis");
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  const days = Array.from({ length: 9 }, (_, i) => addDays(today, i));
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold mb-2">Sélectionner un sport</h2>
        <p className="text-sm text-gray-500 mb-6">Page d’accueil &gt; Création d’un tournoi</p>

        {/* Sélecteur de sport */}
        <div className="flex gap-3 mb-6">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-1 rounded-full border ${
                selectedSport === sport ? "bg-[#7A874C] text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Sélecteur de jour */}
        <div className="bg-gray-50 p-4 rounded-lg flex gap-2 overflow-auto mb-6">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                selectedDay === index ? "bg-orange-400 text-white" : "bg-white text-gray-700 border"
              }`}
            >
              <div className="text-xs font-medium">
                {format(day, "EEE", { locale: fr })}
              </div>
              <div className="text-sm">{format(day, "dd")}</div>
            </button>
          ))}
        </div>

        {/* Créneaux horaires */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {horaires.map((heure) => (
            <button
              key={heure}
              onClick={() => setSelectedHour(heure)}
              className={`border rounded p-3 text-center ${
                selectedHour === heure ? "bg-[#7A874C] text-white" : "bg-white text-gray-800"
              }`}
            >
              {heure}
            </button>
          ))}
        </div>

        {/* Résumé sélection à droite */}
        <div className="flex flex-col items-start bg-white shadow p-5 rounded-lg max-w-sm">
          <Image src="/tennis.jpg" alt="tennis" width={80} height={80} className="rounded mb-4" />
          <p className="text-sm text-gray-700 font-medium">{selectedSport}</p>
          <p className="text-sm text-gray-500 mb-2">UQAC, Chicoutimi</p>
          <p className="text-sm">Terrain (défini après)</p>
          <p className="text-sm">{selectedHour ? `1h — ${selectedHour} à ${parseInt(selectedHour) + 1}h` : "Sélectionnez un créneau"}</p>
          <p className="text-sm text-gray-600 mb-4">
            {format(days[selectedDay], "EEEE d MMMM yyyy", { locale: fr })}
          </p>

          <button className="bg-[#7A874C] text-white px-4 py-2 rounded w-full" onClick={() => router.push("/reservation/form/creer_tournoi/page2")}> Continuer </button>


          <p className="text-xs text-gray-500 mt-4">
            ⚠️ Si vous organisez un tournoi, nous vous préconisons de réserver au moins 2 heures.
          </p>
        </div>
      </div>
    </div>
  );
}
