"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";

type ProfileData = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
} | null;

interface AdminHeaderProps {
  profile: ProfileData;
  onToggleSidebar?: () => void;
}

export function AdminHeader({ profile, onToggleSidebar }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fullName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Administrador"
    : "Administrador";

  const initials = profile?.firstName
    ? `${profile.firstName.charAt(0)}${profile.lastName ? profile.lastName.charAt(0) : ""}`.toUpperCase()
    : "AD";

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#1c1917] text-[#f2f1e7] border-b border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm font-sans-ui">
      {/* Botón Móvil Menú & Título */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Abrir menú de administración"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Consola Administrativa
          </span>
        </div>
      </div>

      {/* Acciones Derecha: Ver Tienda & Menú de Perfil */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Acceso a Tienda Pública */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-300 hover:text-[#b6a450] bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 px-3.5 py-1.5 rounded-lg transition-all"
          title="Abrir la tienda pública en una pestaña"
        >
          <svg className="w-3.5 h-3.5 text-[#b6a450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="hidden sm:inline">Ver Tienda</span>
        </Link>

        {/* Dropdown de Gestión de Perfil & Cierre de Sesión */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full sm:rounded-xl sm:px-3 sm:py-1.5 hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-700"
            aria-expanded={dropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-[#b6a450] text-stone-950 font-bold text-xs flex items-center justify-center shadow-sm">
              {initials}
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <span className="font-semibold text-[#f2f1e7] block truncate max-w-[140px]">
                {fullName}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#b6a450] font-medium">
                {profile?.role === "ADMIN" ? "Administrador" : "Staff"}
              </span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Menú Desplegable */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1c1917] border border-stone-800 rounded-xl shadow-2xl py-2 z-50 animate-scaleIn text-stone-200 divide-y divide-stone-800">
              {/* Info de Usuario */}
              <div className="px-4 py-3">
                <p className="text-xs font-semibold text-white truncate">{fullName}</p>
                <p className="text-[11px] text-stone-400 truncate">{profile?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#b6a450]/15 text-[#b6a450] text-[10px] font-bold uppercase tracking-wider">
                  <span>🛡️</span> Rol {profile?.role || "ADMIN"}
                </div>
              </div>

              {/* Opciones de Navegación del Perfil */}
              <div className="py-1 text-xs">
                <Link
                  href="/admin/perfil"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
                >
                  <svg className="w-4 h-4 text-[#b6a450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Gestionar Perfil</span>
                </Link>

                <Link
                  href="/"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
                >
                  <svg className="w-4 h-4 text-[#8d9773]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Ir a la Tienda Pública</span>
                </Link>
              </div>

              {/* Cerrar Sesión */}
              <div className="p-1.5">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar Sesión</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
