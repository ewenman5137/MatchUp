"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserCircle,
  LayoutGrid,
  Calendar,
  Briefcase,
  LogOut,
  Trash2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const [nomUtilisateur, setNomUtilisateur] = useState("Utilisateur");

  useEffect(() => {
    // 🔁 Remplace par ta méthode d’auth : localStorage, session, API, etc.
    const nom = localStorage.getItem("nomUtilisateur") || "Admin";
    setNomUtilisateur(nom);
  }, []);

  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-white border-r relative flex flex-col justify-between px-4 py-6 shadow-md">
      <div>
        {/* Bouton retour */}
        <button onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="text-gray-500 hover:text-gray-800" />
        </button>


        {/* Logo */}
        <Link href="/" className="block mb-10 text-center">
          <h1 className="text-2xl font-semibold text-[#7A874C] hover:underline cursor-pointer">
            UQAC
          </h1>
        </Link>


        {/* Navigation */}
        <nav className="space-y-2">
          <SidebarLink href="/admin/dashboard" icon={<LayoutGrid size={18} />} label="Dashboard" isActive={isActive} />
          <SidebarLink href="/admin/user" icon={<UserCircle size={18} />} label="Utilisateur" isActive={isActive} />
          <SidebarLink href="/admin/agenda" icon={<Calendar size={18} />} label="Agenda" isActive={isActive} />
          <SidebarLink href="/admin/comptabilite" icon={<Briefcase size={18} />} label="Comptabilité" isActive={isActive} />
        </nav>
      </div>

      {/* Bas de page */}
      <div className="space-y-3">
        <div className="flex items-start flex-col gap-1">
          <p className="font-semibold text-sm">{nomUtilisateur}</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>

        <button className="flex items-center gap-2 text-gray-700 hover:text-black text-sm">
          <LogOut size={18} />
          Déconnexion
        </button>

        <button className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm">
          <Trash2 size={18} />
          Supprimer le compte
        </button>
      </div>
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
