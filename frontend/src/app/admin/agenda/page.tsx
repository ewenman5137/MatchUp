"use client";

import React, { useState } from "react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const sports = ["Badminton", "Pickleball", "Tennis"];

const horaires = [
  "8h30 - 9h30",
  "9h30 - 10h30",
  "10h30 - 11h30",
  "11h30 - 12h30",
  "12h30 - 13h30",
  "13h30 - 14h30",
  "14h30 - 15h30",
];

export default function AgendaAdmin() {
  const [selectedSport, setSelectedSport] = useState("Badminton");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleSlotClick = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin />

      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-xl font-semibold mb-4">Agenda - {selectedSport}</h1>

        {/* Sélection du sport */}
        <div className="mb-4 space-x-2">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-1 rounded-full border ${
                selectedSport === sport ? "bg-[#7A874C] text-white" : "bg-white text-gray-700"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Date sélectionnée */}
        <div className="mb-4 text-gray-700">
          Date sélectionnée :{" "}
          <strong>
            {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
          </strong>
        </div>

        {/* Créneaux horaires */}
        <div className="bg-white rounded shadow p-4 mb-6 max-w-lg">
          <h2 className="text-lg font-medium mb-3">Créneaux disponibles</h2>
          <div className="space-y-2">
            {horaires.map((slot) => (
              <button
                key={slot}
                onClick={() => handleSlotClick(slot)}
                className={`w-full text-left px-4 py-2 rounded border transition ${
                  selectedSlots.includes(slot)
                    ? "bg-[#7A874C] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {slot} — 2 terrains de libres
              </button>
            ))}
          </div>
        </div>

        {/* Bouton réserver */}
        <button
          disabled={selectedSlots.length === 0}
          onClick={() => setShowPopup(true)}
          className={`px-6 py-2 rounded text-white font-semibold ${
            selectedSlots.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#7A874C] hover:bg-[#667d3e]"
          }`}
        >
          Réserver
        </button>
      </main>

      {/* Popup de confirmation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">
              Réservation - {format(selectedDate, "d MMMM yyyy", { locale: fr })}
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Sport : <strong>{selectedSport}</strong>
            </p>
            <p className="text-sm text-gray-700 mb-2">Créneaux sélectionnés :</p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
              {selectedSlots.map((slot, index) => (
                <li key={index}>{slot}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                setShowPopup(false);
                alert("Réservation confirmée !");
              }}
              className="w-full bg-[#7A874C] text-white px-4 py-2 rounded"
            >
              Confirmer la réservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
