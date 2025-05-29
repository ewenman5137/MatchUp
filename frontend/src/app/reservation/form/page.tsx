"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../../Composants/Header/page";

export default function ReservationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") as
    | "jouer_amis"
    | "rechercher_adversaire"
    | "creer_tournoi";

  const [price, setPrice] = useState("Gratuit");
  const [players, setPlayers] = useState([{ id: 1, isMember: undefined }]);
  const [nextId, setNextId] = useState(2);
  const [totalPrice, setTotalPrice] = useState("Gratuit");
  const [sport, setSport] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [heureDebut, setHeureDebut] = useState<string | null>(null);
  const [heureFin, setHeureFin] = useState<string | null>(null);

  // Récupération des données de la réservation stockée
  useEffect(() => {
    setTimeout(() => {
      setSport(sessionStorage.getItem("reservation_sport"));
      setReservationId(sessionStorage.getItem("reservation_id"));
      setDate(sessionStorage.getItem("reservation_date"));
      setHeureDebut(sessionStorage.getItem("reservation_heure_debut"));
      setHeureFin(sessionStorage.getItem("reservation_heure_fin"));
    }, 100);
  }, []);

  const handleMembershipChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const copy = [...players];
    copy[idx].isMember = e.target.value === "oui";
    setPlayers(copy);
    setPrice(copy.every((p) => p.isMember) ? "Gratuit" : "7$");
  };

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { id: nextId, isMember: undefined }]);
      setNextId(nextId + 1);
    }
  };

  const removePlayer = (idx: number) => {
    const copy = players.filter((_, i) => i !== idx);
    setPlayers(copy);
    setPrice(copy.every((p) => p.isMember) ? "Gratuit" : "7$");
  };

  const calculateTotal = () => {
    const nonUqac = players.filter((p) => p.isMember === false).length;
    return nonUqac === 0 ? "Gratuit" : `${nonUqac * 7}$`;
  };

  // On poste d'abord la rencontre, puis le paiement, puis on redirige
  const handlePay = async (paymentMode: "cash" | "online") => {
    const form = document.getElementById("reservationForm") as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // 1) composer l'objet data
    const formData = new FormData(form);
    const payload: any = {
      sport,
      mode,
      reservationId,
      dateReservation: date,
      heureDebut,
      heureFin,
      prix: price,
      joueurs: [],
    };
    formData.forEach((val, key) => {
      if (key.startsWith("joueur_")) {
        const [_, id, field] = key.split("_");
        let ext = payload.joueurs.find((j: any) => j.id === id);
        if (!ext) {
          ext = { id };
          payload.joueurs.push(ext);
        }
        ext[field] = val;
      }
    });

    try {
      // 2) POST rencontre
      await fetch("http://localhost:5000/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 3) POST paiement
      const payPayload = {
        produit:      `Réservation ${sport}`,
        clientEmail:  payload.joueurs.map((j: any) => j.email).join(", "),
        statut:       "Payé",
        mode:         paymentMode,
        prix:         calculateTotal().replace("$",""),
      };
      await fetch("http://localhost:5000/paiements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payPayload),
      });

      // 4) On redirige vers la page de confirmation
      router.push("/reservation/form/confirmation");
    } catch (err) {
      console.error("Erreur lors du paiement :", err);
      alert("Une erreur est survenue, merci de réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <Header />
      <main className="flex space-x-6 mt-24">
        <div className="flex-1 bg-white rounded-lg p-4 shadow">
          <h2 className="text-2xl font-semibold mb-4">
            {{
              jouer_amis: "Ajouter le nombre de joueurs",
              rechercher_adversaire: "Trouver un adversaire",
              creer_tournoi: "Créer un tournoi",
            }[mode]}
          </h2>

          <form id="reservationForm" className="space-y-4">
            <input type="hidden" name="dateReservation" value={date||""} />
            <input type="hidden" name="heureDebut"      value={heureDebut||""} />
            <input type="hidden" name="heureFin"        value={heureFin||""} />
            <input type="hidden" name="prix"            value={price} />
            {players.map((player, idx) => (
              <div key={player.id}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Joueur {player.id}</h3>
                  {players.length > 1 && (
                    <button type="button"
                      className="text-red-600 text-sm hover:underline"
                      onClick={() => removePlayer(idx)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <input type="hidden"
                  name={`joueur_${player.id}_id`}
                  value={player.id}
                />

                <label>Étudiant(e)/employé UQAC ?</label>
                <div className="flex space-x-4">
                  <label>
                    <input type="radio"
                      name={`joueur_${player.id}_isMember`}
                      value="oui"
                      onChange={(e) => handleMembershipChange(e, idx)}
                      required
                    /> Oui
                  </label>
                  <label>
                    <input type="radio"
                      name={`joueur_${player.id}_isMember`}
                      value="non"
                      onChange={(e) => handleMembershipChange(e, idx)}
                    /> Non
                  </label>
                </div>

                {player.isMember !== false ? (
                  <>
                    <label>Email UQAC</label>
                    <input type="email"
                      name={`joueur_${player.id}_email`}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <label>Numéro étudiant</label>
                    <input type="text"
                      name={`joueur_${player.id}_numero`}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </>
                ) : (
                  <>
                    <label>Prénom</label>
                    <input type="text"
                      name={`joueur_${player.id}_prenom`}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <label>Nom</label>
                    <input type="text"
                      name={`joueur_${player.id}_nom`}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <label>Email</label>
                    <input type="email"
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
                {/* … champs tournoi / adversaire … */}
              </>
            )}
          </form>

          {mode === "jouer_amis" && players.length < 4 && (
            <button type="button"
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
            <p><strong>Sport :</strong> {sport || "Non précisé"}</p>
            <p><strong>Créneau :</strong> {`${heureDebut} à ${heureFin}`}</p>
            <p><strong>Prix :</strong> {price}</p>

            <button
              className="w-full bg-green-700 text-white py-2 rounded mb-2"
              onClick={() => handlePay("cash")}
            >
              Payer en cash
            </button>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={() => handlePay("online")}
            >
              Payer en ligne
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
