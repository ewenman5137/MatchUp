"use client";

import React, { useEffect, useState } from "react";
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
  ArrowLeft,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [prenom, setPrenom] = useState("Utilisateur");
  const [nom, setNom] = useState("");
  const [sexe, setSexe] = useState("autre");

  const isActive = (exactPath: string) => pathname === exactPath;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5000/api/utilisateur/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setPrenom(data.prenom || "Utilisateur");
        setNom(data.nom || "");
        setSexe(data.sexe?.toLowerCase() || "autre");
      })
      .catch((err) => console.error("Erreur chargement utilisateur :", err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
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
        <div className="mb-10 text-center">
          <Link href="/">
            <h1 className="text-2xl font-semibold text-[#7A874C]">UQAC</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <SidebarLink href="/profil/user" icon={<UserCircle size={18} />} label="Profil" isActive={isActive} />
          <SidebarLink href="/profil/classement" icon={<Trophy size={18} />} label="Classement" isActive={isActive} />
          <SidebarLink href="/profil/historique" icon={<History size={18} />} label="Historique" isActive={isActive} />
          <SidebarLink href="/profil/agenda" icon={<Calendar size={18} />} label="Agenda" isActive={isActive} />
          <SidebarLink href="/profil/prochain-match" icon={<Calendar size={18} />} label="Prochain match" isActive={isActive} />
        </nav>
      </div>

      {/* Bas de la sidebar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">{prenom} {nom}</p>
          <p className="text-xs text-gray-500">
            {sexe === "femme" ? "Joueuse" : "Joueur"}
          </p>
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

function SidebarLink({
  href,
  icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: (path: string) => boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
          isActive(href) ? "bg-[#7A874C] text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span className="flex items-center gap-2">
          {icon} {label}
        </span>
        <ChevronRight size={16} />
      </div>
    </Link>
  );
}
