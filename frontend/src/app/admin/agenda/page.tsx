"use client";

import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const sports = ["Badminton", "Pickleball", "Tennis"];
const horaires = [
  "8h00 - 9h00",
  "9h00 - 10h00",
  "10h00 - 11h00",
  "11h00 - 12h00",
  "12h00 - 13h00",
  "13h00 - 14h00",
  "14h00 - 15h00",
];

export default function AgendaAdmin() {
  const [selectedSport, setSelectedSport] = useState("Badminton");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [slotsBloques, setSlotsBloques] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [joueur1, setJoueur1] = useState("");
  const [joueur2, setJoueur2] = useState("");
  const [blocageSlot, setBlocageSlot] = useState<string>("");
  const [blocageDate, setBlocageDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const convertToTime = (str: string) => {
    const [h, m] = str.replace("h", ":").split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const handleSlotClick = (slot: string) => {
    if (slotsBloques.includes(slot)) return;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const fetchSlotsBloques = async () => {
    const date = selectedDate.toISOString().split("T")[0];
    const results = await Promise.all(
      horaires.map(async (slot) => {
        const [heureDebut] = slot.split(" - ");
        const heure = convertToTime(heureDebut);
        const res = await fetch(
          `http://localhost:5000/api/blocage?sport=${selectedSport}&date=${date}&heure=${heure}`
        );
        const data = await res.json();
        return data.bloque ? slot : null;
      })
    );
    setSlotsBloques(results.filter((s): s is string => s !== null));
  };

  const fetchUserId = async (email: string) => {
    const res = await fetch(`http://localhost:5000/api/utilisateur/id-par-email?email=${email}`);
    if (!res.ok) throw new Error("Impossible de récupérer l'utilisateur");
    const data = await res.json();
    return data.id;
  };

  useEffect(() => {
    fetchSlotsBloques();
  }, [selectedSport, selectedDate]);

  const handleConfirm = async () => {
  const dateISO = selectedDate.toISOString().split("T")[0];
  const email1 = joueur1.trim();
  const email2 = joueur2.trim();

  if (!email1 || !email2) {
    alert("Veuillez entrer les deux adresses email des joueurs.");
    return;
  }

  try {
    for (const slot of selectedSlots) {
      const [heureDebutBrut, heureFinBrut] = slot.split(" - ");
      const heureDebut = convertToTime(heureDebutBrut);
      const heureFin = convertToTime(heureFinBrut);

      const res = await fetch("http://localhost:5000/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateReservation: dateISO,
          heureDebut,
          heureFin,
          statutReservation: "confirmee",
          modeJeu: "match",
          sport: selectedSport,
          prix: "Gratuit",
          joueurs: [email1, email2]
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la création de la réservation");
      }
    }

    alert("Match(s) réservé(s) avec succès !");
    setSelectedSlots([]);
    setJoueur1("");
    setJoueur2("");
    setShowPopup(false);
  } catch (error) {
    console.error("Erreur lors de la création des matchs :", error);
    alert("Une erreur est survenue.");
  }
};



  const handleBlocage = async () => {
    if (!blocageSlot || !blocageDate) return;
    const [heureDebutBrut] = blocageSlot.split(" - ");
    const heure = convertToTime(heureDebutBrut);

    try {
      const res = await fetch("http://localhost:5000/api/blocage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: selectedSport,
          date: blocageDate,
          heure,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur blocage créneau");
      alert("Créneau bloqué avec succès");
      setBlocageSlot("");
      fetchSlotsBloques();
    } catch (error) {
      alert("Erreur lors du blocage de créneau");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colonne gauche */}
        <section>
          <h1 className="text-xl font-semibold mb-4">
            Agenda - {selectedSport}
          </h1>

          <div className="mb-4 space-x-2">
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-1 rounded-full border ${
                  selectedSport === sport
                    ? "bg-[#7A874C] text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          <div className="mb-4 text-gray-700">
            Date sélectionnée :{" "}
            <strong>
              {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
            </strong>
          </div>

          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="text-lg font-medium mb-3">Créneaux disponibles</h2>
            <div className="space-y-2">
              {horaires.map((slot) => {
                const isSelected = selectedSlots.includes(slot);
                const isBloque = slotsBloques.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => handleSlotClick(slot)}
                    disabled={isBloque}
                    className={`w-full text-left px-4 py-2 rounded border transition ${
                      isBloque
                        ? "bg-red-500 text-white cursor-not-allowed"
                        : isSelected
                        ? "bg-[#7A874C] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {slot} — {isBloque ? "bloqué" : "Terrain libre"}
                  </button>
                );
              })}
            </div>
          </div>

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
        </section>

        {/* Colonne droite : Blocage */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Bloquer un créneau</h2>
          <div className="bg-white rounded shadow p-4">
            <p className="mb-2 text-gray-600">Choisis une date :</p>
            <input
              type="date"
              value={blocageDate}
              onChange={(e) => setBlocageDate(e.target.value)}
              className="w-full mb-4 border rounded px-3 py-2"
            />
            <p className="mb-2 text-gray-600">Choisis un créneau :</p>
            <select
              className="w-full mb-4 border rounded px-3 py-2"
              value={blocageSlot}
              onChange={(e) => setBlocageSlot(e.target.value)}
            >
              <option value="">-- Choisir un créneau --</option>
              {horaires.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <button
              onClick={handleBlocage}
              disabled={!blocageSlot}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Bloquer ce créneau
            </button>
          </div>
        </section>
      </main>

      {/* Popup de réservation */}
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
              Réservation -{" "}
              {format(selectedDate, "d MMMM yyyy", { locale: fr })}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email joueur 1 :
              </label>
              <input
                type="email"
                value={joueur1}
                onChange={(e) => setJoueur1(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
                Email joueur 2 :
              </label>
              <input
                type="email"
                value={joueur2}
                onChange={(e) => setJoueur2(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <p className="text-sm text-gray-700 mb-2">Créneaux sélectionnés :</p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
              {selectedSlots.map((slot, index) => (
                <li key={index}>{slot}</li>
              ))}
            </ul>

            <button
              onClick={handleConfirm}
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
