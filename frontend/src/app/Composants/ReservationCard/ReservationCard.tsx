"use client";

import React, { useState } from "react";

type Props = {
  id: number; 
  date: string;
  sport: string;
  lieu: string;
  refId: string;
  terrain?: string;
  horaire?: string;
  joueurs?: number;
  prix?: string;
  onCancel?: () => void;
};


const ReservationCard = ({
  id,
  date,
  sport,
  lieu,
  refId,
  terrain,
  horaire,
  joueurs,
  prix,
  onCancel,
}: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const canCancel = (): boolean => {
    const now = new Date();
    const dateTime = new Date(`${date}T${horaire?.split(" à ")[0] || "00:00"}`);
    return dateTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000; // plus de 24h
  };

  const handleAnnulation = async () => {
    if (!canCancel()) {
      alert("Impossible d'annuler moins de 24h avant la réservation.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    try {
      await fetch(`http://localhost:5000/reservation/${id}`, { method: "DELETE" });
      alert("Réservation annulée.");
      setShowConfirm(false);
      onCancel?.(); 
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      alert("Erreur lors de l'annulation.");
    }
  };

  

  return (
    <div className="bg-white p-6 rounded-lg shadow relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{date}</h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Confirmé</span>
      </div>

      <div className="flex items-center space-x-4">
        <img
          src={sport ? `/${sport.toLowerCase()}_image.jpg` : "/default_sport.jpg"}
          alt={sport || "Sport"}
          className="h-20 w-20 rounded-lg"
        />
        <div>
          <h3 className="font-semibold">{sport} - Pavillon Sportif</h3>
          <p className="text-sm text-gray-500">{lieu}</p>
          <p className="text-sm text-gray-500">Réservation ref. #: {refId}</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {terrain && <p>Terrain {terrain}</p>}
        {horaire && <p>Horaire: {horaire}</p>}
        {joueurs !== undefined && <p>{joueurs} joueur{joueurs > 1 ? "s" : ""}</p>}
      </div>

      {prix && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Taxes</span>
            <span>Incluses</span>
          </div>
          <div className="flex justify-between font-semibold mt-2">
            <span>Total</span>
            <span>{prix}</span>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-4">
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">S'y rendre</button>
        <button
          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg"
          onClick={handleAnnulation}
        >
          Annuler
        </button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-md w-80 text-center">
            <h3 className="text-lg font-semibold mb-2">Annuler la réservation ?</h3>
            <p className="text-sm text-gray-600 mb-4">Cette action est irréversible.</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setShowConfirm(false)}
              >
                Annuler
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={confirmCancel}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
