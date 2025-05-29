"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/Composants/Header/page";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Tournoi = {
  id: number;
  sport: string;
  description: string;
  date: string;
  heure: string;
  prix?: number;
  date_limite?: string;
  niveau_requis?: string;
  tableau?: string;
  nb_joueurs_max?: number;
  nb_joueurs_min?: number;
  organisateur?: string;
};

export default function ListeTournois() {
  const [tournois, setTournois] = useState<Tournoi[]>([]);
  const [participantsParTournoi, setParticipantsParTournoi] = useState<Record<number, number>>({});
  const [filtre, setFiltre] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [selectedTournoi, setSelectedTournoi] = useState<Tournoi | null>(null);
  const router = useRouter();

  // Chargement des tournois et du nombre de participants
  useEffect(() => {
    fetch("http://localhost:5000/tournois")
      .then((res) => res.json())
      .then(async (data: Tournoi[]) => {
        setTournois(data);
        const counts = await Promise.all(
          data.map(async (t) => {
            const resp = await fetch(`http://localhost:5000/tournoi/${t.id}/participants`);
            const list: any[] = await resp.json();
            return { id: t.id, count: list.length };
          })
        );
        setParticipantsParTournoi(Object.fromEntries(counts.map((c) => [c.id, c.count])));
      })
      .catch(() => setTournois([]));
  }, []);

  const today = new Date();
  const tournoisFiltres = tournois
    .filter((t) => new Date(t.date) > today)
    .filter((t) => filtre === "Tous" || t.sport === filtre)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const openModal = (t: Tournoi) => {
    setSelectedTournoi(t);
    setShowModal(true);
  };

  const handlePayment = async (mode: "cash" | "online") => {
    if (!selectedTournoi) return;

    try {
      // 1) Inscrire l'utilisateur au tournoi
      const email = sessionStorage.getItem("email") || "";
      await fetch("http://localhost:5000/inscription-tournoi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournoi_id: selectedTournoi.id,
          email,
        }),
      });

      // 2) Poster le paiement
      await fetch("http://localhost:5000/paiements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produit: `Inscription Tournoi #${selectedTournoi.id}`,
          clientEmail: email,
          statut: "Payé",
          mode,
          prix: selectedTournoi.prix ?? 0,
        }),
      });

      // 3) Redirection
      setShowModal(false);
      router.push(`/tournoi/validation?id=${selectedTournoi.id}`);
    } catch (err) {
      console.error("Erreur lors du paiement :", err);
      alert("Une erreur est survenue, merci de réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10 mt-20">
        <h2 className="text-xl font-semibold mb-2">S’inscrire à un tournoi</h2>
        <p className="text-sm text-gray-500 mb-6">Page d’accueil &gt; S’inscrire à un tournoi</p>

        {/* Filtre */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium">Filtre :</span>
          {["Tennis", "Badminton", "Pickleball", "Tous"].map((s) => (
            <button
              key={s}
              className={`px-4 py-1 rounded-full border text-sm ${
                filtre === s ? "bg-[#7A874C] text-white" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setFiltre(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Liste */}
        {tournoisFiltres.length > 0 ? (
          tournoisFiltres.map((t) => {
            const inscrits = participantsParTournoi[t.id] ?? 0;
            const max = t.nb_joueurs_max ?? 8;
            const pct = Math.min((inscrits / max) * 100, 100).toFixed(0);
            return (
              <div key={t.id} className="bg-white border rounded-lg p-5 mb-6 shadow-sm">
                <p className="text-sm text-gray-500 font-semibold mb-3">
                  {new Date(t.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  à {t.heure}
                </p>
                <div className="flex gap-6">
                  <div className="relative w-[100px] h-[100px]">
                    <Image
                      src={`/accueil/${t.sport.toLowerCase()}.png`}
                      alt={t.sport}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{t.sport} - UQAC</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Prix : <span className="font-bold">{t.prix ?? "Gratuit"}€</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Niveau requis : {t.niveau_requis || "Aucun"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Type : {t.tableau || "—"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Inscrits : {inscrits}/{max}
                    </p>
                    <div className="w-40 bg-gray-200 rounded-full h-2 my-2">
                      <div
                        className="bg-[#7A874C] h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Date limite :{" "}
                      {t.date_limite
                        ? new Date(t.date_limite).toLocaleString("fr-FR")
                        : "-"}
                    </p>
                    <button
                      onClick={() => openModal(t)}
                      className="mt-3 bg-[#7A874C] text-white px-4 py-1 rounded"
                    >
                      S’inscrire →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 mt-10">
            Aucun tournoi trouvé pour ce filtre.
          </p>
        )}

        {/* Politique */}
        <div className="text-sm text-gray-600 mt-10 max-w-lg">
          <h4 className="font-semibold mb-2">Politique d’annulation</h4>
          <p>
            Si le tournoi n’atteint pas le nombre de joueurs requis, vous serez
            remboursé sous 48 h. Annulation possible jusqu’à 24 h avant.
          </p>
        </div>
      </div>

      {/* Modal Paiement */}
      {showModal && selectedTournoi && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px] text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">Paiement</h3>
            <p className="text-xl mb-4">{selectedTournoi.prix ?? "Gratuit"}€</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#7A874C] text-white px-4 py-2 rounded"
                onClick={() => handlePayment("cash")}
              >
                Cash
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handlePayment("online")}
              >
                En ligne
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
