"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAccountClick = () => {
    const role = localStorage.getItem("role") || "user";
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/profil/user");
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full h-[10vh] flex justify-between items-center bg-white shadow-md px-6">
      <div className="flex items-center gap-4">
        <a href="/"><img src="/header/logoUqac.png" alt="Logo UQAC" className="h-16" /></a>
        <div className="border-l border-[#6F803F] h-12" />
        <div>
          <h1 className="font-bold text-lg">Section sportive</h1>
          <h2 className="text-[#6F803F] text-sm">Découvrez nos différents sports</h2>
        </div>
      </div>
      <div>
        {isLoggedIn ? (
          <button
            onClick={handleAccountClick}
            className="text-white bg-[#6F803F] rounded px-4 py-2 hover:bg-[#5b6e35] transition"
          >
            Mon compte
          </button>
        ) : (
          <a
            href="/login"
            className="text-[#6F803F] border border-[#6F803F] rounded px-4 py-2 hover:bg-[#f0f5e9] transition"
          >
            Se connecter
          </a>
        )}
      </div>
    </header>
  );
}
