"use client";

import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";
import { Check, Edit2, Filter, Plus, X } from "lucide-react";

export default function ComptabilitePage() {
  const [selectedPaiement, setSelectedPaiement] = useState<any | null>(null);
  const [paiements, setPaiements] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/paiements")
      .then((res) => res.json())
      .then((data) => setPaiements(data))
      .catch((err) => console.error("Erreur récupération paiements :", err));
  }, []);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Payé":
        return "bg-green-500";
      case "En attente":
        return "bg-yellow-500";
      case "Impayé":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <main className="flex-1 p-10 space-y-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-sm text-gray-500">Revenu du mois</p>
            <p className="text-3xl font-bold text-green-600">$30,400</p>
            <p className="text-xs text-gray-400 mt-1">+12% vs mois dernier</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-sm text-gray-500">Revenu de la semaine</p>
            <p className="text-3xl font-bold text-blue-600">$42,000</p>
            <p className="text-xs text-gray-400 mt-1">+16% augmentation</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="text-3xl font-bold text-yellow-500">103</p>
            <p className="text-xs text-gray-400 mt-1">+24% vs last month</p>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Paiement</h2>
            <span className="text-sm text-gray-500">Aug 07, 2023</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="🔍 Rechercher"
                className="px-3 py-1 border border-gray-300 rounded text-sm w-64"
              />
              <button className="p-2 border border-gray-300 rounded">
                <Filter size={16} />
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="flex items-center gap-1 bg-[#7A874C] text-white px-3 py-1 rounded text-sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={16} /> Ajouter un paiement
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm">⬇ Exporter</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">Produit</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Date d’achat</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Prix</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((p: any, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{p.produit}</td>
                    <td className="p-3 flex items-center gap-2">
                      <img src={p.avatar} className="w-7 h-7 rounded-full" />
                      {p.client}
                    </td>
                    <td className="p-3">{p.date}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${getStatutColor(p.statut)}`}></span>
                        {p.statut}
                      </div>
                    </td>
                    <td className="p-3">{p.prix}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => setSelectedPaiement(p)} className="text-gray-500 hover:text-black">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal ajout */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-lg font-bold text-center mb-6">Ajouter un paiement</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const produit = form.produit.value;
                const client = form.client.value;
                const statut = form.statut.value;
                const prix = form.prix.value;
                const nouveauPaiement = {
                  produit,
                  client,
                  statut,
                  prix,
                };
                fetch("http://localhost:5000/paiements", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(nouveauPaiement),
                })
                  .then(() => {
                    setIsAddModalOpen(false);
                    form.reset();
                    return fetch("http://localhost:5000/paiements");
                  })
                  .then((res) => res.json())
                  .then((data) => setPaiements(data));
              }}
            >
              <div>
                <label className="text-sm font-medium">Produit</label>
                <input name="produit" type="text" required className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Client</label>
                <input name="client" type="text" required className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Statut</label>
                <select name="statut" className="w-full border p-2 rounded mt-1" defaultValue="Payé">
                  <option>Payé</option>
                  <option>Impayé</option>
                  <option>En attente</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Prix</label>
                <input name="prix" type="number" step="0.01" required className="w-full border p-2 rounded mt-1" />
              </div>
              <button type="submit" className="w-full mt-4 bg-[#7A874C] text-white p-2 rounded hover:bg-[#667d3e]">
                Valider
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal édition */}
      {selectedPaiement && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            <button onClick={() => setSelectedPaiement(null)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <X />
            </button>
            <h2 className="text-lg font-bold text-center mb-6">Client - {selectedPaiement.client}</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const produit = form.produit.value;
                const statut = form.statut.value;
                const prix = parseFloat(form.prix.value);
                fetch(`http://localhost:5000/paiement/${selectedPaiement.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ produit, statut, prix }),
                })
                  .then(() => {
                    setSelectedPaiement(null);
                    return fetch("http://localhost:5000/paiements");
                  })
                  .then((res) => res.json())
                  .then((data) => setPaiements(data));
              }}
            >
              <div>
                <label className="text-sm font-medium">Produit</label>
                <input name="produit" type="text" defaultValue={selectedPaiement.produit} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Client</label>
                <input name="client" type="text" value={selectedPaiement.client} disabled className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Statut</label>
                <select name="statut" className="w-full border p-2 rounded mt-1" defaultValue={selectedPaiement.statut}>
                  <option>Payé</option>
                  <option>Impayé</option>
                  <option>En attente</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Prix</label>
                <input name="prix" type="number" defaultValue={parseFloat(selectedPaiement.prix.replace('$', ''))} className="w-full border p-2 rounded mt-1" />
              </div>
              <button type="submit" className="w-full mt-4 bg-[#7A874C] text-white p-2 rounded hover:bg-[#667d3e]">
                Valider
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}