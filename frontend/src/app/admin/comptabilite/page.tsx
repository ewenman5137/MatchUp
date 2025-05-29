"use client";

import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../Composants/SideBarAdmin/page";
import { Edit2, Plus, X } from "lucide-react";

export default function ComptabilitePage() {
  const [paiements, setPaiements]               = useState<any[]>([]);
  const [filteredPaiements, setFilteredPaiements] = useState<any[]>([]);
  const [selectedPaiement, setSelectedPaiement] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen]     = useState(false);
  const [searchTerm, setSearchTerm]             = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/paiements")
      .then(res => res.json())
      .then(data => {
        setPaiements(data);
        setFilteredPaiements(data);
      })
      .catch(err => console.error("Erreur fetch paiements:", err));
  }, []);

  // Quand searchTerm change, on met à jour filteredPaiements
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredPaiements(
      paiements.filter(p =>
        p.client.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, paiements]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Payé":      return "bg-green-500";
      case "En attente":return "bg-yellow-500";
      case "Impayé":    return "bg-red-500";
      default:          return "bg-gray-400";
    }
  };

  const revenuMois = paiements.reduce((tot, p) => {
    const d = new Date(p.date);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
      ? tot + parseFloat(p.prix.replace("$", ""))
      : tot;
  }, 0);

  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date as any) - (yearStart as any)) / 86400000 + 1) / 7);
  };

  const revenuSemaine = paiements.reduce((tot, p) => {
    const d = new Date(p.date);
    const n = new Date();
    return getWeekNumber(d) === getWeekNumber(n) && d.getFullYear() === n.getFullYear()
      ? tot + parseFloat(p.prix.replace("$", ""))
      : tot;
  }, 0);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload: any = {
      produit:     form.produit.value,
      clientEmail: form.clientEmail.value,
      statut:      form.statut.value,
      prix:        form.prix.value,
    };
    fetch("http://localhost:5000/paiements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(json => {
        const newPay = json.paiement;
        setPaiements(prev => [newPay, ...prev]);
        setIsAddModalOpen(false);
        form.reset();
      })
      .catch(console.error);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPaiement) return;
    const form = e.currentTarget;
    const updated = {
      produit: form.produit.value,
      statut:  form.statut.value,
      prix:    form.prix.value,
    };
    fetch(`http://localhost:5000/paiement/${selectedPaiement.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then(() => {
        setPaiements(prev =>
          prev.map(p =>
            p.id === selectedPaiement.id
              ? { ...p,
                  produit: updated.produit,
                  statut:  updated.statut,
                  prix:    `$${parseFloat(updated.prix).toFixed(2)}` }
              : p
          )
        );
        setSelectedPaiement(null);
      })
      .catch(console.error);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <main className="flex-1 p-10 space-y-10">
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-6">
          <Card title="Revenu du mois" value={`$${revenuMois.toFixed(2)}`} color="text-green-600" />
          <Card title="Revenu de la semaine" value={`$${revenuSemaine.toFixed(2)}`} color="text-blue-600" />
          <Card title="Nombre" value={paiements.length} color="text-yellow-500" />
        </div>

        {/* Table & Recherche */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Paiements</h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" })}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="🔍 Rechercher par client"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm w-64"
              />
            </div>
            <button
              className="flex items-center gap-1 bg-[#7A874C] text-white px-3 py-1 rounded text-sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={16} /> Ajouter un paiement
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">Produit</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Prix</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPaiements.map((p, i) => (
                  <tr key={i} className="border-t">
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

      {/* Modales */}
      {isAddModalOpen && (
        <PaiementModal
          title="Ajouter un paiement"
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAdd}
          submitLabel="Valider"
        />
      )}
      {selectedPaiement && (
        <PaiementModal
          title="Éditer un paiement"
          data={selectedPaiement}
          onClose={() => setSelectedPaiement(null)}
          onSubmit={handleEdit}
          submitLabel="Mettre à jour"
          disableClient
        />
      )}
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function PaiementModal({ title, data, onClose, onSubmit, submitLabel, disableClient }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black"><X/></button>
        <h2 className="text-lg font-bold text-center mb-6">{title}</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium">Produit</label>
            <input name="produit" type="text" defaultValue={data?.produit} required className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Client (email)</label>
            <input
              name="clientEmail"
              type="email"
              defaultValue={data?.client}
              disabled={disableClient}
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Statut</label>
            <select name="statut" defaultValue={data?.statut || "Payé"} className="w-full border p-2 rounded mt-1">
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
              defaultValue={data ? parseFloat(data.prix.replace("$","")) : ""}
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <button type="submit" className="w-full mt-4 bg-[#7A874C] text-white p-2 rounded hover:bg-[#667d3e]">
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
