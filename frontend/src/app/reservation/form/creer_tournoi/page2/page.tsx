"use client";

import React, { useState } from "react";
import Header from "@/app/Composants/Header/page";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";

export default function CreerTournoiPage2() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🏷️ Récupération des paramètres de l'étape 1
  const sport = searchParams.get("sport") || "Tennis";
  const date = searchParams.get("date") || "2025-07-16";
  const heure = searchParams.get("heure") || "18:00";

  const [isEtudiant, setIsEtudiant] = useState("Oui");
  const [email, setEmail] = useState("");
  const [minJoueurs, setMinJoueurs] = useState(4);
  const [maxJoueurs, setMaxJoueurs] = useState(10);
  const [niveau, setNiveau] = useState("Aucun");
  const [typeTournoi, setTypeTournoi] = useState("simple");
  const [sexe, setSexe] = useState("Mixte");
  const [description, setDescription] = useState("");
  const imagePath = `/accueil/${sport?.toLowerCase()}.png`;

  const handleSubmit = async () => {
    if (!email) {
      alert("Veuillez renseigner votre adresse email.");
      return;
    }

    const body = {
      titre: `Tournoi de ${sport}`,
      description,
      type: "tournoi",
      sport,
      date,
      heure,
      lieu: "UQAC - 555, boulevard de l’Université, Chicoutimi",
      nb_joueurs_min: minJoueurs,
      nb_joueurs_max: maxJoueurs,
      niveau_requis: niveau,
      sexe,
      organisateur: "Organisateur UQAC",
      date_limite: `${date}T12:00`, // Ex: 12h le jour même
      tableau: typeTournoi, // ✅ très important !
    };

    const res = await fetch("http://localhost:5000/tournois", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/?success=1");
    } else {
      alert("❌ Erreur lors de la création du tournoi.");
    }
  };

  const dateObj = parseISO(date);
  const heureFin = `${(parseInt(heure) + 1).toString().padStart(2, "0")}:00`;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-2">Création du tournoi</h2>
        <p className="text-sm text-gray-500 mb-6">Page d’accueil &gt; Création d’un tournoi</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 🧾 Formulaire à gauche */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Vos informations</h3>
              <div className="flex items-center gap-4 mb-2">
                <p>Étudiant(e)/employé(e) UQAC ? *</p>
                <label className="flex items-center gap-1">
                  <input type="radio" name="uqac" value="Oui" checked={isEtudiant === "Oui"} onChange={() => setIsEtudiant("Oui")} /> Oui
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="uqac" value="Non" checked={isEtudiant === "Non"} onChange={() => setIsEtudiant("Non")} /> Non
                </label>
              </div>
              <input
                type="email"
                placeholder="Adresse email"
                required
                className="border p-2 rounded w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Paramètres du tournoi</h3>

              <label className="block mb-1">Nombre de joueurs minimum *</label>
              <input
                type="number"
                min={2}
                value={minJoueurs}
                onChange={(e) => setMinJoueurs(Number(e.target.value))}
                className="border p-2 rounded w-full mb-4"
              />

              <label className="block mb-1">Nombre de joueurs maximum *</label>
              <input
                type="number"
                min={minJoueurs}
                value={maxJoueurs}
                onChange={(e) => setMaxJoueurs(Number(e.target.value))}
                className="border p-2 rounded w-full mb-4"
              />

              <label className="block mb-1">Niveau requis</label>
              <input
                type="text"
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />

              <label className="block mb-1">Type de tournoi *</label>
              <input
                type="text"
                value={typeTournoi}
                onChange={(e) => setTypeTournoi(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />

              <label className="block mb-1">Sexe des participants</label>
              <input
                type="text"
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />

              <label className="block mb-1">Description du tournoi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Entrez une description..."
                className="border p-2 rounded w-full"
                rows={4}
              />
            </div>
          </div>

          {/* 🧾 Résumé à droite */}
          <div className="bg-white shadow p-5 rounded-lg">
            <Image
              src={imagePath}
              alt={sport || "sport"}
              width={80}
              height={80}
              className="rounded mb-4"
            />
            <p className="text-sm font-semibold">{sport}</p>
            <p className="text-xs text-gray-500">UQAC, Chicoutimi</p>
            <p className="text-sm mt-2">1 terrain</p>
            <p className="text-sm">1h</p>
            <p className="text-sm">
              {format(dateObj, "EEEE d MMMM", { locale: fr })}
            </p>
            <p className="text-sm mb-2">{heure} à {heureFin}</p>
            <p className="text-sm">Prix</p>
            <p className="text-sm font-semibold mb-3">Gratuit</p>
            <button onClick={handleSubmit} className="w-full bg-[#7A874C] text-white px-4 py-2 rounded">
              Payer
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Le prix que vous payez correspond à votre place dans le tournoi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
