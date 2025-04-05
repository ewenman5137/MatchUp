"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/app/Composants/Header/page";
import Image from "next/image";

export default function ValidationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [tournoi, setTournoi] = useState<any>(null);
  const [niveauOk, setNiveauOk] = useState<boolean | null>(null);
  const [estUqac, setEstUqac] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/tournoi/${id}`)
        .then((res) => res.json())
        .then((data) => setTournoi(data))
        .catch((err) => console.error("Erreur tournoi:", err));
    }
  }, [id]);

  const handlePaiement = async () => {
    if (!niveauOk || !estUqac || !email) {
      alert("Veuillez remplir toutes les informations requises.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/inscription-tournoi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tournoi_id: id,
          email,
          estUqac,
          niveauConfirme: niveauOk
        })
      });

      if (res.ok) {
        router.push("/?success=1");
      } else {
        alert("Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      alert("Erreur lors de la connexion au serveur.");
    }
  };

  if (!tournoi) return <p className="text-center mt-10">Chargement...</p>;

  const imagePath = `/accueil/${tournoi.sport?.toLowerCase()}.png`;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold mb-2">Inscription au tournoi</h2>
        <p className="text-sm text-gray-500 mb-8">Page d’accueil &gt; S’inscrire à un tournoi</p>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Formulaire */} 
          <div className="flex-1 bg-gray-50 border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Vos informations</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Confirmez-vous avoir le niveau requis ({tournoi.niveau_requis || "Aucun"}) ? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label><input type="radio" name="niveau" onChange={() => setNiveauOk(true)} /> Oui</label>
                <label><input type="radio" name="niveau" onChange={() => setNiveauOk(false)} /> Non</label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Êtes-vous étudiant(e) ou employé(e) à l’UQAC ? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label><input type="radio" name="uqac" onChange={() => setEstUqac(true)} /> Oui</label>
                <label><input type="radio" name="uqac" onChange={() => setEstUqac(false)} /> Non</label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border px-4 py-2 rounded text-sm"
                placeholder="ex: prenom.nom@uqac.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Résumé tournoi */}
          <div className="w-full md:w-[280px] border rounded-lg p-4 bg-white shadow-sm text-sm">
            <Image src={imagePath} alt="sport" width={250} height={150} className="rounded mb-3 object-contain" />
            <h4 className="font-semibold">{tournoi.sport}</h4>
            <p className="text-gray-600 mb-1">{tournoi.lieu}</p>
            <p className="mb-1">1 terrain</p>
            <p className="mb-1">{new Date(tournoi.date).toLocaleDateString("fr-FR", {
              weekday: "long", day: "numeric", month: "long"
            })}</p>
            <p className="mb-1">{tournoi.heure} à {addOneHour(tournoi.heure)}</p>
            <p className="mb-1">Prix : Gratuit</p>

            <button
              className="w-full mt-4 bg-[#7A874C] text-white py-2 rounded"
              onClick={handlePaiement}
            >
              Payer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function addOneHour(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  const newH = (h + 1) % 24;
  return `${newH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
