"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  title: string;
  breadcrumb: string;
  restrictionNote?: string;
};

const sports = ["Tennis", "Badminton", "Pickleball"];

function generateNext8Days(): { label: string; iso: string }[] {
  const jours = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const today = new Date();
  const result: { label: string; iso: string }[] = [];

  for (let i = 0; i < 8; i++) {
    const date = new Date(today.getTime());
    date.setDate(date.getDate() + i);
    const label = `${i === 0 ? "Aujourd'hui" : jours[date.getDay()]
      } ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    const iso = date.toISOString().split("T")[0];
    result.push({ label, iso });
  }

  return result;
}

export default function SportSelector({ title, breadcrumb, restrictionNote }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") || "jouer_amis";
  const sportFromURL = searchParams.get("sport");

  const [dates, setDates] = useState<{ label: string; iso: string }[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("Tennis");
  const [selectedDate, setSelectedDate] = useState<{ label: string; iso: string } | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [availableHours, setAvailableHours] = useState<string[]>([]);

  useEffect(() => {
    const generatedDates = generateNext8Days();
    setDates(generatedDates);
    setSelectedDate(generatedDates[0]);
    if (sportFromURL) setSelectedSport(sportFromURL);
  }, [sportFromURL]);

  useEffect(() => {
    if (!selectedSport || !selectedDate) return;

    fetch(`http://localhost:5000/disponibilites?sport=${selectedSport}&date=${selectedDate.iso}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableHours(data.available_hours || []);
        setSelectedHours([]);
      })
      .catch((err) => {
        console.error("Erreur de chargement des créneaux :", err);
      });
  }, [selectedSport, selectedDate]);

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
    if (selectedHours.length === 0) {
      alert("Veuillez sélectionner au moins un créneau horaire.");
      return;
    }
    
    if (selectedHours.length > 2) {
      alert("Vous ne pouvez réserver qu'une ou deux heures maximum.");
      return;
    }
    
    const heures = selectedHours.map(h => parseInt(h)).sort((a, b) => a - b);
    const heureDebut = heures[0].toString().padStart(2, "0") + ":00";
    const heureFin = ((heures[selectedHours.length - 1]) + 1).toString().padStart(2, "0") + ":00";
    


    sessionStorage.setItem("reservation_date", selectedDate?.iso || "");
    sessionStorage.setItem("reservation_heure_debut", heureDebut);
    sessionStorage.setItem("reservation_heure_fin", heureFin);
    sessionStorage.setItem("reservation_sport", selectedSport.toLowerCase());
    sessionStorage.setItem("reservation_id", "3"); // ID fictif ou réel

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
            {dates.map((dateObj) => (
              <label
                key={dateObj.iso}
                className={`flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer border border-gray-300 ${
                  selectedDate?.iso === dateObj.iso ? "bg-gray-300" : ""
                }`}
                onClick={() => {
                  setSelectedDate(dateObj);
                  setSelectedHours([]);
                }}
              >
                {dateObj.label}
              </label>
            ))}
          </div>

          <div className="space-y-2">
            {availableHours.length === 0 && selectedDate ? (
              <p className="text-sm text-red-500">Aucun créneau disponible ce jour-là.</p>
            ) : (
              availableHours.map((hour) => (
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
              ))
            )}
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
            <p className="text-sm text-gray-500">{selectedDate?.label} {getFormattedHours()}</p>
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
