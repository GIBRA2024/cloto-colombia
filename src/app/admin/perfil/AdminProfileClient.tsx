"use client";

import React, { useState } from "react";
import Link from "next/link";
import { updateProfileAction, logoutAction } from "@/actions/auth";
import { ShieldCheck, Check, X, LogOut } from "lucide-react";

interface AdminProfileClientProps {
  profile: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    role: string;
    createdAt: string;
  };
}

export function AdminProfileClient({ profile }: AdminProfileClientProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);

    setLoading(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "¡Tu perfil de administrador ha sido actualizado con éxito!" });
    }
  };

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Administrador Cloto";
  const initials = profile.firstName
    ? `${profile.firstName.charAt(0)}${profile.lastName ? profile.lastName.charAt(0) : ""}`.toUpperCase()
    : "AD";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabecera de Página */}
      <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-bold">
            Administración & Seguridad
          </span>
          <h1 className="font-serif-title text-3xl text-stone-900 mt-1">
            Mi Perfil de Administrador
          </h1>
          <p className="font-serif-body text-xs text-stone-500 mt-1">
            Gestiona tus datos de acceso, credenciales y opciones de sesión en Cloto Colombia.
          </p>
        </div>

        {/* Botón rápido de cerrar sesión */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </form>
      </div>

      {/* Banner de Resumen de Usuario */}
      <div className="bg-[#1c1917] text-[#f2f1e7] p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#b6a450] text-stone-950 font-bold text-2xl flex items-center justify-center shadow-lg shrink-0">
          {initials}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="font-serif-title text-2xl text-white">
              {fullName}
            </h2>
            <span className="px-2.5 py-1 rounded-md bg-[#b6a450]/20 text-[#b6a450] border border-[#b6a450]/40 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              {profile.role === "ADMIN" ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Rol Administrador</span>
                </>
              ) : (
                "Staff"
              )}
            </span>
          </div>
          <p className="text-stone-400 text-xs">
            {profile.email} • Cuenta activa desde {new Date(profile.createdAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Sesión activa
            </span>
            <span>•</span>
            <Link href="/" target="_blank" className="hover:text-[#b6a450] transition-colors underline">
              Ver tienda pública &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Notificación de Estado */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? <Check className="w-4 h-4 shrink-0 text-emerald-600" /> : <X className="w-4 h-4 shrink-0 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid de Formularios & Ajustes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Datos Personales */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="font-serif-title text-xl text-stone-900">
              Información Personal
            </h3>
            <p className="text-xs text-stone-500 font-serif-body mt-0.5">
              Actualiza los nombres con los que te identificarás en el sistema administrativo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={profile.firstName || ""}
                  placeholder="Ej: Mateo"
                  className="w-full bg-[#fbfbfa] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#b6a450] focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={profile.lastName || ""}
                  placeholder="Ej: Giraldo"
                  className="w-full bg-[#fbfbfa] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#b6a450] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={profile.phone || ""}
                placeholder="+57 300 000 0000"
                className="w-full bg-[#fbfbfa] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#b6a450] focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                Correo Electrónico (Solo Lectura)
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-stone-400">
                El correo está vinculado a las credenciales principales de Supabase Auth.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? "Guardando Cambios..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>

        {/* Panel Lateral: Privilegios y Sesión */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif-title text-lg text-stone-900">
              Permisos del Sistema
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Crear y editar productos
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Ajustar inventario y stock
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Gestionar pedidos y guías
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Crear cupones de descuento
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Ver reportes financieros
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif-title text-lg text-stone-900">
              Cierre de Sesión
            </h3>
            <p className="text-xs text-stone-500 font-serif-body">
              Al cerrar sesión se invalidarán las cookies seguras de administrador en este navegador.
            </p>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión Ahora</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
