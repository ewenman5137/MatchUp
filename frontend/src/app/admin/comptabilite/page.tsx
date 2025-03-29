"use client";

import React, { useState } from "react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";
import { Check, Edit2, Filter, Plus, X } from "lucide-react";

const paiementsExemple = [
  {
    produit: "Color Theory in Web Design",
    client: "Grace Moreta",
    date: "07 Aug, 4:32 pm",
    statut: "Payé",
    prix: "$14.99",
    avatar: "/avatar-jean-eude.png"
  },
  {
    produit: "Color Theory in Web Design",
    client: "Makenna Doman",
    date: "07 Aug, 4:32 pm",
    statut: "Impayé",
    prix: "$14.99",
    avatar: "/avatar-jean-eude.png"
  },
  {
    produit: "Color Theory in Web Design",
    client: "Kaylynn Madsen",
    date: "07 Aug, 4:32 pm",
    statut: "En attente",
    prix: "$14.99",
    avatar: "/avatar-jean-eude.png"
  }
];



export default function ComptabilitePage() {
  const [selectedPaiement, setSelectedPaiement] = useState<any | null>(null);
    const [paiements, setPaiements] = useState(paiementsExemple);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        {/* Statistiques */}
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

        {/* Paiement */}
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

          {/* Tableau */}
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
              {paiements.map((p, index) => (
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
              prix: `$${parseFloat(prix).toFixed(2)}`,
              date: new Date().toLocaleString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              avatar: "/avatar-jean-eude.png",
            };
  
            setPaiements([...paiements, nouveauPaiement]);
            setIsAddModalOpen(false);
            form.reset();
          }}
        >
          <div>
            <label className="text-sm font-medium">Produit</label>
            <input
              name="produit"
              type="text"
              required
              className="w-full border p-2 rounded mt-1"
              placeholder="Nom du produit"
            />
          </div>
  
          <div>
            <label className="text-sm font-medium">Client</label>
            <input
              name="client"
              type="text"
              required
              className="w-full border p-2 rounded mt-1"
              placeholder="Nom du client"
            />
          </div>
  
          <div>
            <label className="text-sm font-medium">Statut</label>
            <select
              name="statut"
              className="w-full border p-2 rounded mt-1"
              defaultValue="Payé"
            >
              <option>Payé</option>
              <option>Impayé</option>
              <option>En attente</option>
            </select>
          </div>
  
          <div>
            <label className="text-sm font-medium">Prix</label>
            <input
              name="prix"
              type="number"
              step="0.01"
              required
              className="w-full border p-2 rounded mt-1"
              placeholder="0.00"
            />
          </div>
  
          <button
            type="submit"
            className="w-full mt-4 bg-[#7A874C] text-white p-2 rounded hover:bg-[#667d3e]"
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  )}

      {/* MODALE */}
      {selectedPaiement && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            <button onClick={() => setSelectedPaiement(null)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <X />
            </button>
            <h2 className="text-lg font-bold text-center mb-6">Client - {selectedPaiement.client}</h2>

            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Produit</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded mt-1"
                  defaultValue="2h - terrain pickleball 13/09/24 à 9h"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Client</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded mt-1"
                  defaultValue={selectedPaiement.client}
                  disabled
                />
              </div>

              <div>
                <label className="text-sm font-medium">Statut</label>
                <select className="w-full border p-2 rounded mt-1" defaultValue={selectedPaiement.statut}>
                  <option>Payé</option>
                  <option>Impayé</option>
                  <option>En attente</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Prix</label>
                <input type="text" className="w-full border p-2 rounded mt-1" defaultValue="12" />
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
