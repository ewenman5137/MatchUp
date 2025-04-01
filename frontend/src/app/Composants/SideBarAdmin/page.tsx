"use client";

import React from "react";
import { usePathname } from "next/navigation";
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

  // Active uniquement si le chemin correspond exactement
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-white border-r relative flex flex-col justify-between px-4 py-6 shadow-md">
      <div>
        {/* Bouton retour */}
        <button className="mb-6">
          <ArrowLeft className="text-gray-500 hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-center text-2xl font-semibold text-[#7A874C]">UQAC</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {/* Dashboard */}
          <Link href="/admin/dashboard">
            <div
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isActive("/admin/dashboard")
                  ? "bg-[#7A874C] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid size={18} /> Dashboard
              </span>
              <ChevronRight size={16} />
            </div>
          </Link>

          {/* Utilisateur */}
          <Link href="/admin/user">
            <div
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isActive("/admin/user")
                  ? "bg-[#7A874C] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <UserCircle size={18} /> Utilisateur
              </span>
              <ChevronRight size={16} />
            </div>
          </Link>

          {/* Agenda */}
          <Link href="/admin/agenda">
            <div
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isActive("/admin/agenda")
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

          {/* Comptabilité */}
          <Link href="/admin/comptabilite">
            <div
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isActive("/admin/comptabilite")
                  ? "bg-[#7A874C] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase size={18} /> Comptabilité
              </span>
              <ChevronRight size={16} />
            </div>
          </Link>
        </nav>
      </div>

      {/* Bas de page - Infos admin */}
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
