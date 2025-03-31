"use client";
import React, { useEffect, useState } from "react";
import Header from '../../../Composants/Header/page';
import ReservationCard from "../../../Composants/ReservationCard/ReservationCard";

interface Reservation {
  id: number;
  date: string;
  sport: string;
  lieu: string;
  refId: string;
  terrain?: string;
  horaire?: string;
  joueurs?: number;
  prix?: string;
}

const ReservationConfirmation = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/reservations") // adapte l’URL à ton backend
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement :", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <Header />
      <main className="flex space-x-6 mt-20">
        <div className="w-64 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Politique d'annulation</h4>
            <p className="text-sm text-gray-500">
              Vous pouvez annuler jusqu'à 24h avant sinon vous ne serez pas remboursé des frais d'inscription.
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {loading ? (
            <p className="text-gray-500">Chargement des réservations...</p>
          ) : reservations.length === 0 ? (
            <p className="text-gray-500">Aucune réservation trouvée.</p>
          ) : (
            reservations.map((res) => (
              <ReservationCard
                key={res.id}
                id={res.id} // 🔥 C’est ça qu’il manquait
                date={res.date}
                sport={res.sport}
                lieu={res.lieu}
                refId={res.refId}
                terrain={res.terrain}
                horaire={res.horaire}
                joueurs={res.joueurs}
                prix={res.prix}
                onCancel={() => setReservations((prev) => prev.filter((r) => r.id !== res.id))}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ReservationConfirmation;
