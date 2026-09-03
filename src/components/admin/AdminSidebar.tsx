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

// Iconos vectoriales profesionales SVG
function DashboardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function ProductsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CategoriesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h3.18a2.25 2.25 0 0 1 1.76.84L12.5 6h5.5A2.25 2.25 0 0 1 20.25 8.25v9.5A2.25 2.25 0 0 1 18 20H6A2.25 2.25 0 0 1 3.75 17.75V6Z" />
    </svg>
  );
}

function InventoryIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OrdersIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h15v13H1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function CouponsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3z" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="15" y1="15" x2="15.01" y2="15" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" />
    </svg>
  );
}

function CustomersIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.999-3.198a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

function ProfileIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function StoreIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
    </svg>
  );
}

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: DashboardIcon,
    exact: true,
  },
  {
    href: "/admin/productos",
    label: "Productos & Fotos",
    icon: ProductsIcon,
    exact: false,
  },
  {
    href: "/admin/categorias",
    label: "Categorías",
    icon: CategoriesIcon,
    exact: false,
  },
  {
    href: "/admin/inventario",
    label: "Control de Stock",
    icon: InventoryIcon,
    exact: false,
  },
  {
    href: "/admin/pedidos",
    label: "Pedidos & Envíos",
    icon: OrdersIcon,
    exact: false,
  },
  {
    href: "/admin/cupones",
    label: "Cupones & Promos",
    icon: CouponsIcon,
    exact: false,
  },
  {
    href: "/admin/clientes",
    label: "Clientes & CRM",
    icon: CustomersIcon,
    exact: false,
  },
  {
    href: "/admin/perfil",
    label: "Mi Perfil & Cuenta",
    icon: ProfileIcon,
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
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 h-screen shrink-0 bg-[#1c1917] text-[#f2f1e7] flex flex-col justify-between border-r border-stone-800 transition-transform duration-300 ease-in-out font-sans-ui ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Encabezado del Sidebar con Logo */}
        <div className="p-6 border-b border-stone-800/80 shrink-0">
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

        {/* Lista de Navegación con scroll independiente si es necesario */}
        <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-bold px-3.5 mb-3">
            Módulos de Gestión
          </p>
          <nav className="space-y-1.5 text-xs font-medium">
            {navItems.map((item) => {
              const active = isLinkActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-[#b6a450] text-stone-950 font-semibold shadow-md shadow-[#b6a450]/15 translate-x-1"
                      : "text-stone-300 hover:text-white hover:bg-stone-800/90"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors shrink-0 ${
                      active
                        ? "text-stone-950"
                        : "text-stone-400 group-hover:text-[#b6a450]"
                    }`}
                  />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-950 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Base del Sidebar: Tarjeta de Perfil & Acciones de Sesión (Siempre Visible y Fijo al Fondo) */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-900/40 space-y-3 text-xs shrink-0 mt-auto">
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
              className="inline-flex items-center justify-center gap-1.5 text-[11px] font-medium py-2 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            >
              <StoreIcon className="w-3.5 h-3.5 text-stone-400" />
              <span>Tienda</span>
            </Link>

            <form action={logoutAction} className="w-full">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-medium py-2 px-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 transition-colors"
              >
                <LogoutIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>Salir</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
