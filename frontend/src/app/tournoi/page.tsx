"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/Composants/Header/page";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ListeTournois() {
  const [tournois, setTournois] = useState([]);
  const [filtre, setFiltre] = useState("Aucun");
  const [showModal, setShowModal] = useState(false);
  const [selectedTournoiId, setSelectedTournoiId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/tournois")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTournois(data);
        } else {
          console.error("Données tournois inattendues :", data);
          setTournois([]);
        }
      })
      .catch((err) => {
        console.error("Erreur de chargement des tournois :", err);
        setTournois([]);
      });
  }, []);

  const tournoisFiltres = Array.isArray(tournois)
    ? (filtre === "Aucun" ? tournois : tournois.filter((t) => t.sport === filtre))
    : [];

  const handlePaiement = (id: number) => {
    setSelectedTournoiId(id);
    setShowModal(true);
  };

  const confirmerPaiement = () => {
    setShowModal(false);
    if (selectedTournoiId !== null) {
      router.push(`/tournoi/validation?id=${selectedTournoiId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold mb-2">S’inscrire à un tournoi</h2>
        <p className="text-sm text-gray-500 mb-6">Page d’accueil &gt; S’inscrire à un tournoi</p>

        <div className="flex items-center gap-4 mb-6">
          <p className="text-sm font-medium">Filtre :</p>
          {["Tennis", "Badminton", "Pickleball", "Aucun"].map((sport) => (
            <button
              key={sport}
              className={`px-4 py-1 rounded-full border text-sm ${
                filtre === sport ? "bg-[#7A874C] text-white" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setFiltre(sport)}
            >
              {sport}
            </button>
          ))}
          <button className="ml-auto bg-[#7A874C] text-white px-4 py-1 rounded">Trouver un match</button>
        </div>

        {tournoisFiltres.length > 0 ? (
          tournoisFiltres.map((tournoi, index) => (
            <div key={index} className="bg-white border rounded-lg p-5 mb-6 shadow-sm">
              <p className="text-sm text-gray-500 font-semibold mb-3">
                {new Date(tournoi.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })} à {tournoi.heure}
              </p>
              <div className="flex gap-6">
                <Image src="/tennis.jpg" alt="sport" width={100} height={100} className="rounded" />

                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{tournoi.sport} - UQAC</h3>
                  <p className="text-sm text-gray-600 mb-1">UQAC - 555, boulevard de l’Université, Chicoutimi</p>
                  <p className="text-sm text-gray-600">Niveau requis: {tournoi.niveau_requis || "Aucun"}</p>
                  <p className="text-sm text-gray-600">Type de tournoi : {tournoi.tableau}</p>
                  <p className="text-sm text-gray-600 mb-1">Minimum de joueurs pour le tournoi: {tournoi.nb_joueurs_min || 4}</p>
                  <p className="text-sm text-gray-600">
                    Nom de l’organisateur : {tournoi.organisateur || "Ewen Buhot"}
                  </p>
                  <a href="#" className="text-sm text-blue-600 underline">Voir le profil des participants</a>
                  <p className="mt-4 text-sm text-gray-700">
                    Description<br />{tournoi.description || "Aucune description fournie."}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <p className="text-sm">{tournoi.nb_joueurs_inscrits}/
                    {tournoi.nb_joueurs_max} joueurs</p>
                  <div className="w-40 bg-gray-200 rounded-full h-2 my-2">
                    <div
                      className="bg-[#7A874C] h-2 rounded-full"
                      style={{ width: `${(tournoi.nb_joueurs_inscrits / tournoi.nb_joueurs_max) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    ⏱️ date limite : {tournoi.date_limite ? new Date(tournoi.date_limite).toLocaleString("fr-FR") : "-"}
                  </p>
                  <button
                    className="bg-[#7A874C] text-white px-4 py-1 rounded"
                    onClick={() => handlePaiement(tournoi.idTournoi)}
                  >
                    S’inscrire →
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 mt-10">Aucun tournoi trouvé pour ce filtre.</p>
        )}

        <div className="text-sm text-gray-600 mt-10 max-w-lg">
          <h4 className="font-semibold mb-2">Politique d’annulation</h4>
          <p>
            Si le tournoi n’arrive pas à atteindre le nombre de joueurs minimum requis alors vous serez totalement remboursé des frais d’inscription sous 48h.
            Vous pouvez annuler jusqu’à 24h avant sinon vous ne serez pas remboursé des frais d’inscription.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px] text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">Paiement</h3>
            <p className="text-xl mb-4">12€</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmerPaiement} className="bg-[#7A874C] text-white px-4 py-2 rounded">Cash</button>
              <button onClick={confirmerPaiement} className="bg-[#7A874C] text-white px-4 py-2 rounded">En ligne</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
