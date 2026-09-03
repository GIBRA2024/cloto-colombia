"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/cuenta";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("redirect", redirectTo);

    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans-ui">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#dfd8cb] shadow-xl">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-semibold">
            Bienvenida al Universo
          </span>
          <h1 className="font-serif-title text-3xl tracking-wide text-[#1c1917]">
            Iniciar Sesión
          </h1>
          <p className="font-serif-body text-xs text-stone-600">
            Accede a tu libreta de direcciones, historial de pedidos y beneficios exclusivos.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-[#f8eeed] border border-[#d59f9e] text-[#834442] text-xs rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="redirect" value={redirectTo} />

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="tu@correo.com"
              className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450] focus:ring-1 focus:ring-[#b6a450]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-stone-700">
                Contraseña
              </label>
              <a href="#" className="text-[11px] text-[#b6a450] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450] focus:ring-1 focus:ring-[#b6a450]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-widest font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isPending ? "Iniciando sesión..." : "Ingresar a mi cuenta"}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-600">
            ¿Aún no tienes una cuenta?{" "}
            <Link
              href={`/auth/registro?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-[#b6a450] font-semibold hover:underline"
            >
              Crear cuenta nueva
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
