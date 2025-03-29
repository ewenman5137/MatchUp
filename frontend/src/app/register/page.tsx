"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom,
        nom,
        email,
        password,
        role: "user" // ou "admin" selon le besoin
      })
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess("Compte créé avec succès. Redirection...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(data.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Créer un compte</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <input
          type="text"
          placeholder="Prénom"
          className="w-full border p-2 rounded"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom"
          className="w-full border p-2 rounded"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Adresse email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="w-full border p-2 rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-[#7A874C] text-white p-2 rounded">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
