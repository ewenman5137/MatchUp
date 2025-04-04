"use client";

import React, { useState } from "react";
import Header from "@/app/Composants/Header/page";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreerTournoiPage2() {
  const router = useRouter();

  const [isEtudiant, setIsEtudiant] = useState<string | null>("Oui");
  const [email, setEmail] = useState("");
  const [minJoueurs, setMinJoueurs] = useState(4);
  const [maxJoueurs, setMaxJoueurs] = useState(10);
  const [niveau, setNiveau] = useState("Aucun");
  const [typeTournoi, setTypeTournoi] = useState("simple");
  const [sexe, setSexe] = useState("Mixte");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const body = {
      titre: "Tournoi Été 2025",
      description,
      date: "2025-07-16",
      heureDebut: "18:00",
      heureFin: "19:00",
      sport: "Tennis",
      tableau: typeTournoi,
    };

    const res = await fetch("http://localhost:5000/tournois", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/tournois");
    } else {
      alert("Erreur lors de la création du tournoi ❌");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-2">Création du tournoi</h2>
        <p className="text-sm text-gray-500 mb-6">Page d’accueil &gt; Création d’un tournoi</p>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Vos informations</h3>
              <div className="flex items-center gap-4 mb-2">
                <p>Vous êtes étudiant(e)/employé UQAC ? *</p>
                <label className="flex items-center gap-1">
                  <input type="radio" name="uqac" value="Oui" checked={isEtudiant === "Oui"} onChange={() => setIsEtudiant("Oui")} /> Oui
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="uqac" value="Non" checked={isEtudiant === "Non"} onChange={() => setIsEtudiant("Non")} /> Non
                </label>
              </div>
              <input type="email" placeholder="Entrer l'adresse email" required className="border p-2 rounded w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Le tournoi</h3>
              <label className="block mb-1">Combien de joueurs souhaitez-vous avoir au minimum ? *</label>
              <input type="number" min={2} value={minJoueurs} onChange={(e) => setMinJoueurs(Number(e.target.value))} className="border p-2 rounded w-full mb-4" />

              <label className="block mb-1">Et au maximum ? *</label>
              <input type="number" min={minJoueurs} value={maxJoueurs} onChange={(e) => setMaxJoueurs(Number(e.target.value))} className="border p-2 rounded w-full mb-4" />

              <label className="block mb-1">Est-ce qu'il y a un niveau requis ? *</label>
              <input type="text" value={niveau} onChange={(e) => setNiveau(e.target.value)} className="border p-2 rounded w-full mb-4" />

              <label className="block mb-1">Quel sera votre type de tournoi ? *</label>
              <input type="text" value={typeTournoi} onChange={(e) => setTypeTournoi(e.target.value)} className="border p-2 rounded w-full mb-4" />

              <label className="block mb-1">Quel est le sexe des adversaires ? *</label>
              <input type="text" value={sexe} onChange={(e) => setSexe(e.target.value)} className="border p-2 rounded w-full mb-4" />

              <label className="block mb-1">Description du tournoi</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Entrez la description du tournoi ..." className="border p-2 rounded w-full" rows={4} />
            </div>
          </div>

          <div className="bg-white shadow p-5 rounded-lg">
            <Image src="/tennis.jpg" alt="tennis" width={80} height={80} className="rounded mb-4" />
            <p className="text-sm font-semibold">Tennis</p>
            <p className="text-xs text-gray-500">UQAC, Chicoutimi</p>
            <p className="text-sm mt-2">1 terrain</p>
            <p className="text-sm">1h</p>
            <p className="text-sm">Dimanche 16 juillet</p>
            <p className="text-sm mb-2">18h à 19h</p>
            <p className="text-sm">Prix</p>
            <p className="text-sm font-semibold mb-3">Gratuit</p>
            <button onClick={handleSubmit} className="w-full bg-[#7A874C] text-white px-4 py-2 rounded">Payer</button>
            <p className="text-xs text-gray-500 mt-4">
              Le prix que vous payez correspond à votre place dans le tournoi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
