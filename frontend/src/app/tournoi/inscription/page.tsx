"use client";

import { useParams } from "next/navigation";
import Header from "@/app/Composants/Header/page";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function InscriptionTournoi() {
  const { id } = useParams();
  const [tournoi, setTournoi] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [niveauConfirme, setNiveauConfirme] = useState(true);
  const [isUqac, setIsUqac] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/tournoi/${id}`)
      .then((res) => res.json())
      .then((data) => setTournoi(data))
      .catch((err) => console.error("Erreur chargement tournoi :", err));
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-2">Inscription au tournoi</h2>
        <p className="text-sm text-gray-500 mb-6">Page d’accueil &gt; S’inscrire à un tournoi</p>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border p-6 rounded-lg space-y-6">
            <h3 className="text-lg font-semibold">Vos informations</h3>

            <div>
              <p className="text-sm font-medium mb-1">
                Confirmez-vous avoir le niveau requis pour le tournoi ({tournoi?.niveau_requis || "Aucun"}) ?
              </p>
              <label className="mr-4">
                <input
                  type="radio"
                  checked={niveauConfirme}
                  onChange={() => setNiveauConfirme(true)}
                /> Oui
              </label>
              <label>
                <input
                  type="radio"
                  checked={!niveauConfirme}
                  onChange={() => setNiveauConfirme(false)}
                /> Non
              </label>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Êtes-vous étudiant(e) / employé(e) à l’UQAC ? *</p>
              <label className="mr-4">
                <input
                  type="radio"
                  checked={isUqac}
                  onChange={() => setIsUqac(true)}
                /> Oui
              </label>
              <label>
                <input
                  type="radio"
                  checked={!isUqac}
                  onChange={() => setIsUqac(false)}
                /> Non
              </label>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Adresse email étudiante / employé *
              </label>
              <input
                type="email"
                className="w-full border p-2 rounded"
                placeholder="Entrer l'adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Récapitulatif tournoi */}
          <div className="bg-white border p-5 rounded-lg shadow-sm">
            <Image src="/tennis.jpg" alt="image tournoi" width={100} height={100} className="rounded mb-4" />
            <p className="font-semibold">{tournoi?.sport || "Tennis"}</p>
            <p className="text-sm text-gray-500 mb-2">UQAC, Chicoutimi</p>
            <p className="text-sm">1 terrain</p>
            <p className="text-sm">1h</p>
            <p className="text-sm">
              {new Date(tournoi?.dateTournoi).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <p className="text-sm mb-2">
              {tournoi?.heureDebut} à {tournoi?.heureFin}
            </p>
            <p className="text-sm font-medium mb-3">Prix</p>
            <p className="text-sm font-semibold mb-3">Gratuit</p>

            <button className="w-full bg-[#7A874C] text-white p-2 rounded">Payer</button>

            <p className="text-xs text-gray-500 mt-4">
              Le prix que vous payez correspond à votre place dans le tournoi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
