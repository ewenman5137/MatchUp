"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifie s'il y a un token en localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full h-[10vh] flex justify-between items-center bg-white shadow-md">
      <div className="flex items-center gap-4">
        <a href="/"><img src="/header/logoUqac.png" alt="Logo UQAC" className="h-16" /></a>
        <div className="border-l border-[#6F803F] h-12"></div>
        <div>
          <h1 className="font-bold text-lg">Section sportive</h1>
          <h2 className="text-[#6F803F] text-sm">Découvrez nos différents sports</h2>
        </div>
      </div>

      <div>
        {isLoggedIn ? (
          <a href="/profil/user" className="text-white bg-[#6F803F] rounded px-4 py-2 hover:bg-[#5b6e35] transition">
            Mon compte
          </a>
        ) : (
          <a href="/login" className="text-[#6F803F] border border-[#6F803F] rounded px-4 py-2 hover:bg-[#f0f5e9] transition">
            Se connecter
          </a>
        )}
      </div>
    </header>
  );
}
