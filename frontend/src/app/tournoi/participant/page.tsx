"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "@/app/Composants/Header/page";

export default function ParticipantsTournoi() {
  const searchParams = useSearchParams();
  const idTournoi = searchParams.get("id");
  const [participants, setParticipants] = useState<any[]>([]);
  const [nomTournoi, setNomTournoi] = useState("");

  useEffect(() => {
    if (idTournoi) {
      fetch(`http://localhost:5000/tournoi/${idTournoi}`)
        .then((res) => res.json())
        .then((data) => {
          setNomTournoi(data.nomTournoi || "Tournoi");
        });

      fetch(`http://localhost:5000/tournoi/${idTournoi}/participants`)
        .then((res) => res.json())
        .then((data) => setParticipants(data))
        .catch((err) => console.error("Erreur chargement participants :", err));
    }
  }, [idTournoi]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-4 text-[#7A874C]">
          Participants au {nomTournoi}
        </h2>

        {participants.length === 0 ? (
          <p className="text-gray-500">Aucun participant inscrit pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {participants.map((p, index) => (
              <li key={index} className="border p-4 rounded shadow-sm">
                <p className="font-semibold">{p.nom}</p>
                <p className="text-sm text-gray-600">Email : {p.email}</p>
                <p className="text-sm text-gray-600">Niveau : {p.niveau || "Non précisé"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
