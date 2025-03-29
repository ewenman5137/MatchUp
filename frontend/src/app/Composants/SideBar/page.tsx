"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  UserCircle,
  Trophy,
  Calendar,
  History,
  LogOut,
  Trash2,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isActive = (exactPath: string) => pathname === exactPath;

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login"); // Rediriger vers la page de connexion
  };

  const handleDelete = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/utilisateur/${userId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      localStorage.clear();
      router.push("/register");
    } else {
      alert("Erreur lors de la suppression du compte");
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r relative flex flex-col justify-between px-4 py-6 shadow-md">
      <div>
        {/* Flèche de retour */}
        <button className="mb-6">
          <ArrowLeft className="text-gray-500 hover:text-gray-800" />
        </button>

        {/* Logo UQAC */}
        <div className="mb-10">
          <h1 className="text-center text-2xl font-semibold text-[#7A874C]">UQAC</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link href="/profil/user">
            <div
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isActive("/profil/user")
                  ? "bg-[#7A874C] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <UserCircle size={18} /> Profil
              </span>
            </div>
          </Link>

          <Link href="/profil/classement">
            <div
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isActive("/profil/classement")
                  ? "bg-[#7A874C] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Trophy size={18} /> Classement
              </span>
              <ChevronRight size={16} />
            </div>
          </Link>

          <Link href="/profil/historique">
            <div
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isActive("/profil/historique")
                  ? "bg-[#7A874C] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <History size={18} /> Historique
              </span>
            </div>
          </Link>

          <Link href="/profil/agenda">
            <div
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isActive("/profil/agenda")
                  ? "bg-[#7A874C] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar size={18} /> Agenda
              </span>
              <ChevronRight size={16} />
            </div>
          </Link>
        </nav>
      </div>

      {/* Bas de la sidebar */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <img
            src="/avatar-jean-eude.png"
            alt="Jean-eude"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">Jean-eude</p>
            <p className="text-xs text-gray-500">producteur de tomates</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-700 hover:text-black text-sm"
        >
          <LogOut size={18} />
          Déconnexion
        </button>

        <button
          onClick={() => setShowConfirmDelete(true)}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm"
        >
          <Trash2 size={18} />
          Supprimer le compte
        </button>
      </div>

      {/* Pop-up de confirmation suppression */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
            <p className="text-sm text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
