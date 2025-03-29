"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../Composants/SideBar/page";
import { useRouter } from "next/navigation";


export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "null" || userId === "undefined") {
      router.push("/login");
      return;
    }
    

    fetch(`http://localhost:5000/api/utilisateur/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Erreur de chargement", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    const res = await fetch(`http://localhost:5000/api/utilisateur/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      setShowPopup(true);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-gradient-to-tr from-blue-100 to-yellow-50">
        <div className="bg-white p-10 rounded-3xl shadow max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="text-lg font-medium text-gray-700">
              <p className="text-sm">{user?.prenom}</p>
              <h2 className="text-2xl font-bold">{user?.nom}</h2>
            </div>
            <button onClick={handleSave} className="bg-[#7A874C] text-white px-6 py-2 rounded-lg shadow">
              Modifier
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <InputField label="Prénom" value={user?.prenom} disabled />
            <InputField label="Nom de famille" value={user?.nom} disabled />
            <InputField label="Adresse email" value={user?.email} disabled />

            <SelectField label="Sexe" name="sexe" value={user?.sexe} onChange={handleChange} options={["", "Homme", "Femme", "Autre"]} />
            <SelectField label="Langue" name="langue" value={user?.langue} onChange={handleChange} options={["", "Français", "Anglais", "Espagnol"]} />
            <SelectField label="Nationalité" name="nationalite" value={user?.nationalite} onChange={handleChange} options={["", "Canadienne", "Française", "Autre"]} />
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Profil mis à jour</h2>
            <p className="text-gray-600">Les informations ont bien été enregistrées.</p>
            <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded" onClick={() => setShowPopup(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, disabled }: { label: string; value?: string; disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">{label}</label>
      <input type="text" className="w-full bg-gray-100 p-3 rounded-lg" value={value || ""} disabled={disabled} />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: { label: string; name: string; value?: string; onChange: any; options: string[] }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full bg-white p-3 rounded-lg border border-gray-300"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt || `-- Sélectionnez ${label.toLowerCase()} --`}
          </option>
        ))}
      </select>
    </div>
  );
}
