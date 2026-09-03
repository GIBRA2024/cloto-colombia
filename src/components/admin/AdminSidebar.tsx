"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";

type ProfileData = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
} | null;

interface AdminSidebarProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "📊",
    exact: true,
  },
  {
    href: "/admin/productos",
    label: "Productos & Fotos",
    icon: "👗",
    exact: false,
  },
  {
    href: "/admin/categorias",
    label: "Categorías",
    icon: "🗂️",
    exact: false,
  },
  {
    href: "/admin/inventario",
    label: "Control de Stock",
    icon: "📦",
    exact: false,
  },
  {
    href: "/admin/pedidos",
    label: "Pedidos & Envíos",
    icon: "🚚",
    exact: false,
  },
  {
    href: "/admin/cupones",
    label: "Cupones & Promos",
    icon: "🎟️",
    exact: false,
  },
  {
    href: "/admin/perfil",
    label: "Mi Perfil & Cuenta",
    icon: "👤",
    exact: false,
  },
];

export function AdminSidebar({ profile, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const fullName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Administrador"
    : "Administrador";

  const initials = profile?.firstName
    ? `${profile.firstName.charAt(0)}${profile.lastName ? profile.lastName.charAt(0) : ""}`.toUpperCase()
    : "AD";

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Backdrop Móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Principal */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#1c1917] text-[#f2f1e7] flex flex-col justify-between border-r border-stone-800 transition-transform duration-300 ease-in-out font-sans-ui ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Encabezado del Sidebar con Logo */}
        <div className="p-6 border-b border-stone-800/80">
          <div className="flex items-center justify-between">
            <Link href="/admin" onClick={onClose} className="inline-block group">
              <span className="font-serif-title text-2xl tracking-[0.2em] font-medium text-[#f2f1e7] uppercase block group-hover:text-[#b6a450] transition-colors">
                CLOTO
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#b6a450] -mt-1 block font-bold">
                ADMIN CONSOLE
              </span>
            </Link>

            {/* Botón cerrar en móvil */}
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Lista de Navegación */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-bold px-3.5 mb-3">
            Módulos de Gestión
          </p>
          <nav className="space-y-1.5 text-xs font-medium">
            {navItems.map((item) => {
              const active = isLinkActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-[#b6a450] text-stone-950 font-semibold shadow-md shadow-[#b6a450]/10 translate-x-1"
                      : "text-stone-300 hover:text-white hover:bg-stone-800/90"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Base del Sidebar: Tarjeta de Perfil & Acciones de Sesión */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-900/40 space-y-3 text-xs">
          {/* Tarjeta de Usuario */}
          <Link
            href="/admin/perfil"
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-800/80 transition-colors group"
            title="Ver / Gestionar mi perfil"
          >
            <div className="w-9 h-9 rounded-full bg-[#b6a450] text-stone-950 font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-[#f2f1e7] block truncate text-xs group-hover:text-[#b6a450] transition-colors">
                {fullName}
              </span>
              <span className="text-[10px] text-stone-400 block truncate">
                {profile?.email}
              </span>
            </div>
          </Link>

          {/* Botones de Acción */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              onClick={onClose}
              className="text-[11px] text-center py-2 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            >
              Tienda 🛍️
            </Link>

            <form action={logoutAction} className="w-full">
              <button
                type="submit"
                className="w-full text-[11px] py-2 px-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 transition-colors font-medium text-center"
              >
                Salir 🚪
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
