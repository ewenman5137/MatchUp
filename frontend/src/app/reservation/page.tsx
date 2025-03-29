"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../Composants/Header/page'; 

const sports = ["Tennis", "Badminton", "Pickleball"];

function generateNext8Days(): { label: string; iso: string }[] {
  const jours = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const today = new Date();
  const result: { label: string; iso: string }[] = [];

  for (let i = 0; i < 8; i++) {
    const date = new Date(today.getTime());
    date.setDate(today.getDate() + i);

    const labelJour = `${jours[date.getDay()]} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = i === 0 ? `Aujourd'hui (${labelJour})` : labelJour;
    const iso = date.toISOString().split("T")[0];

    result.push({ label, iso });
  }

  return result;
}

export default function SportSelection() {
  const [selectedSport, setSelectedSport] = useState<string>("Tennis");
  const [selectedDate, setSelectedDate] = useState<{ label: string; iso: string } | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [dates, setDates] = useState<{ label: string; iso: string }[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "jouer_amis";

  useEffect(() => {
    setDates(generateNext8Days());
  }, []);

  useEffect(() => {
    if (!selectedDate || !selectedSport) return;

    fetch(`http://localhost:5000/disponibilites?sport=${selectedSport}&date=${selectedDate.iso}`)
      .then(res => res.json())
      .then(data => {
        setAvailableHours(data.available_hours);
        setSelectedHours([]);
      })
      .catch(err => {
        console.error("Erreur en récupérant les disponibilités :", err);
      });
  }, [selectedDate, selectedSport]);

  const handleContinue = () => {
    if (!selectedDate || selectedHours.length !== 2) {
      alert("Veuillez sélectionner une date et un créneau horaire (2 heures consécutives).");
      return;
    }

    const [heureDebut, heureFin] = selectedHours.sort();

    sessionStorage.setItem("reservation_date", selectedDate.iso);
    sessionStorage.setItem("reservation_sport", selectedSport);
    sessionStorage.setItem("reservation_heure_debut", heureDebut);
    sessionStorage.setItem("reservation_heure_fin", heureFin);
    sessionStorage.setItem("reservation_id", "3");

    router.push(`/reservation/form?mode=${mode}`);
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
      const firstHour = parseInt(selectedHours[0]);
      const secondHour = parseInt(selectedHours[1]);
      if (secondHour === firstHour + 1) {
        return `${selectedHours[0]} à ${secondHour + 1}:00`;
      } else {
        return selectedHours.map(hour => `${hour} à ${parseInt(hour) + 1}:00`).join(' | ');
      }
    }
    return selectedHours.length === 1 ? `${selectedHours[0]} à ${parseInt(selectedHours[0]) + 1}:00` : 'Veuillez sélectionner une heure';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header />
      <main className="flex space-x-6 mt-32">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Sélectionner un sport</h2>
          <p className="text-sm text-gray-500 mb-6">
            <a href="/" className="text-blue-500 hover:underline">Page d'accueil</a> &gt; Jouer entre amis
          </p>

          <form method="GET" className="space-y-6">
            {/* Sélection Sport */}
            <div className="flex space-x-4 mb-4">
              {sports.map((sport) => (
                <label
                  key={sport}
                  className={`px-4 py-2 rounded-full cursor-pointer border border-gray-300 ${selectedSport === sport ? 'bg-green-700 text-white' : ''}`}
                  onClick={() => setSelectedSport(sport)}
                >
                  {sport}
                </label>
              ))}
            </div>

            {/* Sélection Date */}
            <div className="flex space-x-2 overflow-auto mb-4">
              {dates.map((dateObj) => (
                <label
                  key={dateObj.iso}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer border border-gray-300 ${selectedDate?.iso === dateObj.iso ? 'bg-gray-300' : ''}`}
                  onClick={() => {
                    setSelectedDate(dateObj);
                    setSelectedHours([]);
                  }}
                >
                  {dateObj.label}
                </label>
              ))}
            </div>

            {/* Créneaux horaires disponibles */}
            <div className="space-y-2">
              {availableHours.length === 0 && selectedDate ? (
                <p className="text-sm text-red-500">Aucun créneau disponible ce jour-là.</p>
              ) : (
                availableHours.map((hour) => (
                  <div
                    key={hour}
                    className={`w-full flex justify-between items-center px-4 py-2 rounded-lg cursor-pointer border border-gray-300 ${selectedHours.includes(hour) ? 'bg-gray-300' : ''}`}
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

        {/* Résumé / Carte */}
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
              <p className="text-sm text-gray-500">
                {selectedDate?.label} {getFormattedHours()}
              </p>
            </div>
            <button type="button" onClick={handleContinue} className="mt-4 w-full bg-green-700 text-white py-2 rounded">
              Continuer
            </button>
          </div>

          <div className="rounded-lg shadow p-4 bg-white">
            <p className="text-sm text-gray-700">
              Attention : Vous ne pouvez pas être plus de 4 personnes par terrain
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
