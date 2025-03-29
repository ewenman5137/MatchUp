"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../Composants/Header/page";

export default function ReservationForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as
    | "jouer_amis"
    | "rechercher_adversaire"
    | "creer_tournoi";

  const [price, setPrice] = useState("Gratuit");
  const [players, setPlayers] = useState([{ id: 1, isMember: undefined }]);
  const [nextId, setNextId] = useState(2);
  const [showPopup, setShowPopup] = useState(false);
  const [totalPrice, setTotalPrice] = useState("Gratuit");
  const [sport, setSport] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [heureDebut, setHeureDebut] = useState<string | null>(null);
  const [heureFin, setHeureFin] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const storedSport = sessionStorage.getItem("reservation_sport");
      const storedId = sessionStorage.getItem("reservation_id");
      const storedDate = sessionStorage.getItem("reservation_date");
      const storedDebut = sessionStorage.getItem("reservation_heure_debut");
      const storedFin = sessionStorage.getItem("reservation_heure_fin");
  
      console.log("📥 Données récupérées dans le form (via setTimeout) :", {
        storedDate,
        storedDebut,
        storedFin,
        storedSport,
        storedId,
      });
  
      setSport(storedSport);
      setReservationId(storedId);
      setDate(storedDate);
      setHeureDebut(storedDebut);
      setHeureFin(storedFin);
    }, 100); // 100 ms
  }, []);
  
  

  const handleMembershipChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPlayers = [...players];
    newPlayers[index].isMember = e.target.value === "oui";
    setPlayers(newPlayers);
    setPrice(newPlayers.every(p => p.isMember) ? "Gratuit" : "7$");
  };

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { id: nextId, isMember: undefined }]);
      setNextId(nextId + 1);
    }
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
    setPrice(newPlayers.every(p => p.isMember) ? "Gratuit" : "7$");
  };

  const calculateTotalPrice = () => {
    const nonUqac = players.filter(p => p.isMember === false).length;
    return nonUqac === 0 ? "Gratuit" : `${nonUqac * 7}$`;
  };

  const handleSubmit = () => {
    const form = document.getElementById("reservationForm") as HTMLFormElement;
    if (form && form.checkValidity()) {
      const formData = new FormData(form);
      const data: any = {
        sport,
        mode,
        reservationId,
        dateReservation: date,
        heureDebut,
        heureFin,
        prix: price,
        joueurs: [],
      };

      formData.forEach((value, key) => {
        if (key.startsWith("joueur_")) {
          const [_, id, champ] = key.split("_");
          const joueurIndex = data.joueurs.findIndex((j: any) => j.id === id);
          if (joueurIndex === -1) {
            const nouveau = { id };
            nouveau[champ] = value;
            data.joueurs.push(nouveau);
          } else {
            data.joueurs[joueurIndex][champ] = value;
          }
        } else {
          data[key] = value;
        }
      });

      console.log("📦 Données à envoyer au backend :", data);

      fetch("http://localhost:5000/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setTotalPrice(calculateTotalPrice());
      setShowPopup(true);
    } else {
      form.reportValidity();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <Header />
      <main className="flex space-x-6 mt-24">
        <div className="flex-1 bg-white rounded-lg p-4 shadow">
          <h2 className="text-2xl font-semibold mb-4">
            {mode === "jouer_amis" && "Ajouter le nombre de joueurs"}
            {mode === "rechercher_adversaire" && "Trouver un adversaire"}
            {mode === "creer_tournoi" && "Créer un tournoi"}
          </h2>

          <form id="reservationForm" className="space-y-4">
            <input type="hidden" name="dateReservation" value={date || ""} />
            <input type="hidden" name="heureDebut" value={heureDebut || ""} />
            <input type="hidden" name="heureFin" value={heureFin || ""} />
            <input type="hidden" name="prix" value={price} />
            {players.map((player, index) => (
              <div key={player.id}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Joueur {player.id}</h3>
                  {players.length > 1 && (
                    <button
                      type="button"
                      className="text-red-600 text-sm hover:underline"
                      onClick={() => removePlayer(index)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <input type="hidden" name={`joueur_${player.id}_id`} value={player.id} />

                <label className="block mt-2">Étudiant(e)/employé UQAC ?</label>
                <div className="flex space-x-4">
                  <label>
                    <input
                      type="radio"
                      name={`joueur_${player.id}_isMember`}
                      value="oui"
                      onChange={e => handleMembershipChange(e, index)}
                      required
                    />
                    Oui
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`joueur_${player.id}_isMember`}
                      value="non"
                      onChange={e => handleMembershipChange(e, index)}
                    />
                    Non
                  </label>
                </div>

                {player.isMember !== false ? (
                  <>
                    <label>Email UQAC</label>
                    <input
                      type="email"
                      name={`joueur_${player.id}_email`}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <label>Numéro étudiant</label>
                    <input
                      type="text"
                      name={`joueur_${player.id}_numero`}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </>
                ) : (
                  <>
                    <label>Prénom</label>
                    <input
                      type="text"
                      name={`joueur_${player.id}_prenom`}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <label>Nom</label>
                    <input
                      type="text"
                      name={`joueur_${player.id}_nom`}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <label>Email</label>
                    <input
                      type="email"
                      name={`joueur_${player.id}_email`}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </>
                )}
              </div>
            ))}

            {(mode === "creer_tournoi" || mode === "rechercher_adversaire") && (
              <>
                <h3 className="text-xl font-bold mt-8">
                  {mode === "creer_tournoi" ? "Le tournoi" : "L’adversaire recherché"}
                </h3>

                <label>Nombre de joueurs minimum</label>
                <input name="minJoueurs" type="number" className="w-full p-2 border rounded" required />

                <label>Nombre de joueurs maximum</label>
                <input name="maxJoueurs" type="number" className="w-full p-2 border rounded" required />

                <label>Niveau requis</label>
                <input name="niveau" type="text" className="w-full p-2 border rounded" />

                <label>
                  {mode === "creer_tournoi" ? "Type de tournoi" : "Type de match"}
                </label>
                <input name="type" type="text" className="w-full p-2 border rounded" />

                <label>Sexe des adversaires</label>
                <input name="sexeAdversaires" type="text" className="w-full p-2 border rounded" />

                <label>Description</label>
                <textarea name="description" className="w-full p-2 border rounded" />
              </>
            )}
          </form>

          {mode === "jouer_amis" && players.length < 4 && (
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded"
              onClick={addPlayer}
            >
              Ajouter un joueur
            </button>
          )}
        </div>

        <div className="w-80 mt-24 space-y-4">
          <div className="bg-white shadow p-4 rounded-lg">
            <h3 className="font-semibold">Résumé</h3>
            <p><span className="font-medium">Sport :</span> {sport || "Non précisé"}</p>
            <p>
              <span className="font-medium">Créneau :</span>{" "}
              { `${heureDebut} à ${heureFin}`}
            </p>
            <p><span className="font-medium">Prix :</span> {price}</p>

            <button
              className="w-full bg-green-700 text-white py-2 mt-4 rounded"
              onClick={handleSubmit}
            >
              Payer
            </button>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Paiement</h2>
            <p className="text-lg mb-4">{totalPrice}</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => (window.location.href = "/reservation/form/confirmation")}
              >
                Cash
              </button>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => (window.location.href = "/reservation/form/confirmation")}
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
