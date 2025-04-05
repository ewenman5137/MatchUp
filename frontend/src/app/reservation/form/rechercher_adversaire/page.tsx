"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/Composants/Header/page";

type Rencontre = {
  id: number;
  sport: string;
  niveau: string;
  date: string;
  heure: string;
  duree: number;
  terrain?: string;
  commentaire?: string;
  joueur1_email: string;
};

export default function RechercherAdversairePage() {
  const searchParams = useSearchParams();
  const sportURL = searchParams.get("sport");

  const [rencontres, setRencontres] = useState<Rencontre[]>([]);
  const [filtre, setFiltre] = useState(sportURL ?? "Tous");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: "",
    sport: sportURL || "",
    niveau: "",
    date: "",
    heure: "",
    duree: 1,
    terrain: "",
    commentaire: "",
  });

  const fetchRencontres = () => {
    fetch("http://localhost:5000/rencontres")
      .then((res) => res.json())
      .then((data) => setRencontres(data))
      .catch((err) => console.error("Erreur chargement rencontres :", err));
  };

  useEffect(() => {
    fetchRencontres();
    if (sportURL) {
      setForm((prev) => ({ ...prev, sport: sportURL }));
      setFiltre(sportURL);
    }
  }, [sportURL]);

  const proposerRencontre = async () => {
    const res = await fetch("http://localhost:5000/rencontres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Rencontre proposée ✅");
      setForm({
        email: "",
        sport: sportURL || "",
        niveau: "",
        date: "",
        heure: "",
        duree: 1,
        terrain: "",
        commentaire: "",
      });
      setShowForm(false);
      fetchRencontres();
    } else {
      alert("Erreur lors de la proposition.");
    }
  };

  const accepterRencontre = async (id: number) => {
    const email = prompt("Entrez votre adresse email pour accepter la rencontre :");
    if (!email) return;

    const res = await fetch(`http://localhost:5000/rencontres/${id}/accepter`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert("Match accepté !");
      fetchRencontres();
    } else {
      alert("Erreur lors de l’acceptation.");
    }
  };

  const rencontresFiltrees = rencontres.filter(
    (r) => filtre === "Tous" || r.sport.toLowerCase() === filtre.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-semibold mb-4">🔍 Rechercher un adversaire</h1>

        {/* Filtres sport */}
        <div className="flex gap-4 mb-6">
        {["Tous", "Tennis", "Badminton", "Pickleball"].map((s) => {
          const isActive = filtre.toLowerCase() === s.toLowerCase();
          return (
            <button
              key={s}
              onClick={() => setFiltre(s)}
              className={`px-4 py-1 rounded-full text-sm border ${
                isActive ? "bg-[#7A874C] text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {s}
            </button>
          );
        })}

        </div>

        {/* Toggle formulaire */}
        <button
          className="mb-6 bg-[#7A874C] text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Fermer le formulaire" : "Proposer un match"}
        </button>

        {showForm && (
          <div className="bg-gray-50 p-4 rounded shadow mb-10">
            <h2 className="text-lg font-medium mb-3">Proposer une rencontre</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border w-full px-3 py-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Sport</label>
                <select
                  value={form.sport}
                  onChange={(e) => setForm({ ...form, sport: e.target.value })}
                  className="border w-full px-3 py-2 rounded mt-1"
                >
                  <option value="">-- Choisir un sport --</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Pickleball">Pickleball</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="border w-full px-3 py-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Heure</label>
                <input
                  type="time"
                  value={form.heure}
                  onChange={(e) => setForm({ ...form, heure: e.target.value })}
                  className="border w-full px-3 py-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Niveau</label>
                <select
                  value={form.niveau}
                  onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                  className="border w-full px-3 py-2 rounded mt-1"
                >
                  <option value="">-- Choisir --</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Durée (heures)</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={form.duree}
                  onChange={(e) => setForm({ ...form, duree: Number(e.target.value) })}
                  className="border w-full px-3 py-2 rounded mt-1"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Commentaire</label>
              <textarea
                value={form.commentaire}
                onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
                className="w-full border px-3 py-2 rounded mt-1"
              ></textarea>
            </div>

            <button
              className="bg-[#7A874C] text-white px-4 py-2 rounded"
              onClick={proposerRencontre}
            >
              Envoyer la proposition
            </button>
          </div>
        )}

        {/* Liste des rencontres filtrées */}
        <h2 className="text-lg font-medium mb-3">Rencontres proposées</h2>
        {rencontresFiltrees.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune rencontre pour ce sport.</p>
        ) : (
          <div className="space-y-4">
            {rencontresFiltrees.map((r) => (
              <div
                key={r.id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {r.sport} - {r.niveau}
                  </p>
                  <p className="text-sm text-gray-600">
                    {r.date} à {r.heure} — {r.duree}h
                  </p>
                  <p className="text-sm text-gray-500">
                    Proposé par : {r.joueur1_email}
                  </p>
                  {r.commentaire && (
                    <p className="text-sm italic mt-1">💬 {r.commentaire}</p>
                  )}
                </div>
                <button
                  onClick={() => accepterRencontre(r.id)}
                  className="bg-[#7A874C] text-white px-4 py-2 rounded"
                >
                  Accepter le match
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
