"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  title: string;
  breadcrumb: string;
  restrictionNote?: string;
};

const sports = ["Tennis", "Badminton", "Pickleball"];
const hours = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

function generateNext8Days(): string[] {
  const jours = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const today = new Date();
  const result: string[] = [];

  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const label = `${jours[date.getDay()]} ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    result.push(i === 0 ? `Aujourd'hui (${label})` : label);
  }

  return result;
}

export default function SportSelector({ title, breadcrumb, restrictionNote }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") || "jouer_amis";
  const sportFromURL = searchParams.get("sport");

  const [dates, setDates] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("Tennis");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  useEffect(() => {
    const generatedDates = generateNext8Days();
    setDates(generatedDates);
    setSelectedDate(generatedDates[0]);
    if (sportFromURL) {
      setSelectedSport(sportFromURL);
    }
  }, [sportFromURL]);

  const handleSportChange = (sport: string) => {
    setSelectedSport(sport);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("sport", sport.toLowerCase());
    router.push(`?${current.toString()}`);
  };

  const toggleHourSelection = (hour: string) => {
    if (selectedHours.includes(hour)) {
      setSelectedHours(selectedHours.filter(h => h !== hour));
    } else if (selectedHours.length < 2) {
      setSelectedHours([...selectedHours, hour].sort());
    }
  };

  const getFormattedHours = () => {
    if (selectedHours.length === 2) {
      const [h1, h2] = selectedHours.map(h => parseInt(h));
      return h2 === h1 + 1
        ? `${selectedHours[0]} à ${h2 + 1}:00`
        : selectedHours.map(h => `${h} à ${parseInt(h) + 1}:00`).join(" | ");
    }
    return selectedHours.length === 1
      ? `${selectedHours[0]} à ${parseInt(selectedHours[0]) + 1}:00`
      : "Veuillez sélectionner deux créneaux consécutifs";
  };

  const handleContinue = () => {
    if (selectedHours.length !== 2) {
      alert("Veuillez sélectionner deux créneaux horaires.");
      return;
    }

    const [heure1, heure2] = selectedHours.map(h => parseInt(h));
    if (Math.abs(heure1 - heure2) !== 1) {
      alert("Les créneaux doivent être consécutifs (ex : 18:00 et 19:00)");
      return;
    }

    const heureDebut = Math.min(heure1, heure2).toString().padStart(2, "0") + ":00";
    const heureFin = (Math.max(heure1, heure2) + 1).toString().padStart(2, "0") + ":00";

    console.log("🎯 Sauvegarde sessionStorage :", {
      date: selectedDate,
      heureDebut,
      heureFin,
      sport: selectedSport
    });

    sessionStorage.setItem("reservation_date", selectedDate);
    sessionStorage.setItem("reservation_heure_debut", heureDebut);
    sessionStorage.setItem("reservation_heure_fin", heureFin);
    sessionStorage.setItem("reservation_sport", selectedSport.toLowerCase());
    sessionStorage.setItem("reservation_id", "3"); // ID fictif ou réel selon besoin

    router.push(`/reservation/form?mode=${mode}`);
  };

  return (
    <main className="text-black flex space-x-6 mt-32 min-h-screen bg-gray-50 p-6">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-sm text-gray-500 mb-6">
          <a href="/" className="text-blue-500 hover:underline">Page d'accueil</a> &gt; {breadcrumb}
        </p>

        <form className="space-y-6">
          <div className="flex space-x-4 mb-4">
            {sports.map((sport) => (
              <label
                key={sport}
                className={`px-4 py-2 rounded-full cursor-pointer border border-gray-300 ${
                  selectedSport === sport ? "bg-green-700 text-white" : ""
                }`}
                onClick={() => handleSportChange(sport)}
              >
                {sport}
              </label>
            ))}
          </div>

          <div className="flex space-x-2 overflow-auto mb-4">
            {dates.map((date) => (
              <label
                key={date}
                className={`flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer border border-gray-300 ${
                  selectedDate === date ? "bg-gray-300" : ""
                }`}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedHours([]);
                }}
              >
                {date}
              </label>
            ))}
          </div>

          <div className="space-y-2">
            {hours.map((hour) => (
              <div
                key={hour}
                className={`w-full flex justify-between items-center px-4 py-2 rounded-lg cursor-pointer border border-gray-300 ${
                  selectedHours.includes(hour) ? "bg-gray-300" : ""
                }`}
                onClick={() => toggleHourSelection(hour)}
              >
                {hour}
                <span>&#x276F;</span>
              </div>
            ))}
          </div>
        </form>
      </div>

      <div className="w-80 space-y-4 mt-16">
        <div className="rounded-lg shadow p-4 bg-white">
          <div className="flex space-x-4 items-center">
            <img src={`/${selectedSport.toLowerCase()}_image.jpg`} alt={selectedSport} className="h-16 w-16 rounded-lg" />
            <div>
              <h3 className="font-semibold">{selectedSport}</h3>
              <p className="text-sm text-gray-500">UQAC, Chicoutimi</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">1 terrain</p>
            <p className="text-sm text-gray-500">{selectedDate} {getFormattedHours()}</p>
          </div>
          <button type="button" onClick={handleContinue} className="mt-4 w-full bg-green-700 text-white py-2 rounded">
            Continuer
          </button>
        </div>

        {restrictionNote && (
          <div className="rounded-lg shadow p-4 bg-white">
            <p className="text-sm text-gray-700">{restrictionNote}</p>
          </div>
        )}
      </div>
    </main>
  );
}
