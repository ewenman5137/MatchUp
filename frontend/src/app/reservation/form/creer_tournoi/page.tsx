"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Header from "@/app/Composants/Header/page";
import Image from "next/image";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const sports = ["Tennis", "Badminton", "Pickleball"];
const horaires = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
const today = new Date();

export default function CreerTournoi() {
  const searchParams = useSearchParams();
  const sportFromUrl = searchParams.get("sport");

  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  const days = Array.from({ length: 9 }, (_, i) => addDays(today, i));
  const router = useRouter();

  const imagePath = `/accueil/${selectedSport?.toLowerCase()}.png`;

  useEffect(() => {
    const sportInitial = sportFromUrl
      ? sports.find((s) => s.toLowerCase() === sportFromUrl.toLowerCase())
      : "Tennis";
    setSelectedSport(sportInitial || "Tennis");
  }, [sportFromUrl]);

  const toggleHourSelection = (heure: string) => {
    if (selectedHours.includes(heure)) {
      setSelectedHours(selectedHours.filter((h) => h !== heure));
    } else if (selectedHours.length === 0) {
      setSelectedHours([heure]);
    } else if (selectedHours.length === 1) {
      const firstIndex = horaires.indexOf(selectedHours[0]);
      const currentIndex = horaires.indexOf(heure);
      if (Math.abs(currentIndex - firstIndex) === 1) {
        const ordered = [selectedHours[0], heure].sort(
          (a, b) => horaires.indexOf(a) - horaires.indexOf(b)
        );
        setSelectedHours(ordered);
      } else {
        setSelectedHours([heure]);
      }
    } else {
      setSelectedHours([heure]);
    }
  };

  const handleContinuer = () => {
    if (selectedHours.length === 0 || !selectedSport) {
      alert("Veuillez sélectionner une ou deux heures consécutives.");
      return;
    }

    const heureDebut = selectedHours[0];
    const selectedDate = format(days[selectedDay], "yyyy-MM-dd");
    const url = `/reservation/form/creer_tournoi/page2?sport=${encodeURIComponent(
      selectedSport
    )}&date=${selectedDate}&heure=${heureDebut}&duree=${selectedHours.length}`;
    router.push(url);
  };

  if (!selectedSport) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8 mt-[10vh]">
        <h2 className="text-xl font-semibold mb-2">Sélectionner un sport</h2>
        <p className="text-sm text-gray-500 mb-6">
          Page d’accueil &gt; Création d’un tournoi
        </p>

        <div className="flex flex-col md:flex-row">
          {/* Sélection à gauche */}
          <div className="flex-1 md:pr-6">
            {/* Sport */}
            <div className="flex gap-3 mb-6">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-4 py-1 rounded-full border ${
                    selectedSport === sport
                      ? "bg-[#7A874C] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>

            {/* Jours */}
            <div className="bg-gray-50 p-4 rounded-lg flex gap-2 overflow-auto mb-6">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    selectedDay === index
                      ? "bg-orange-400 text-white"
                      : "bg-white text-gray-700 border"
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {horaires.map((heure) => (
                <button
                  key={heure}
                  onClick={() => toggleHourSelection(heure)}
                  className={`border rounded p-3 text-center transition-all duration-150 ${
                    selectedHours.includes(heure)
                      ? "bg-[#7A874C] text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {heure}
                </button>
              ))}
            </div>
          </div>

          {/* Résumé à droite */}
          <div className="w-full md:w-[320px] mt-10 md:mt-0 md:ml-10">
            <div className="flex flex-col items-start bg-white shadow p-5 rounded-lg">
              <Image
                src={imagePath}
                alt={selectedSport || "sport"}
                width={80}
                height={80}
                className="rounded mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">{selectedSport}</p>
              <p className="text-sm text-gray-500 mb-2">UQAC, Chicoutimi</p>
              <p className="text-sm text-gray-400">Terrain (défini après)</p>
              <p className="text-sm text-gray-400 mb-2">
                {selectedHours.length === 0 && "Sélectionnez un créneau"}
                {selectedHours.length === 1 &&
                  `1h — ${selectedHours[0]} à ${parseInt(selectedHours[0]) + 1}h`}
                {selectedHours.length === 2 &&
                  `2h — ${selectedHours[0]} à ${parseInt(selectedHours[1]) + 1}h`}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {format(days[selectedDay], "EEEE d MMMM yyyy", { locale: fr })}
              </p>

              <button
                className="bg-[#7A874C] text-white px-4 py-2 rounded w-full"
                onClick={handleContinuer}
              >
                Continuer
              </button>

              <p className="text-xs text-gray-500 mt-4">
                ⚠️ Si vous organisez un tournoi, nous vous préconisons de réserver au moins 2 heures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
