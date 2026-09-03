"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { signupAction } from "@/actions/auth";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/cuenta";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await signupAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`);
        }, 2000);
      }
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans-ui">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#dfd8cb] shadow-xl">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-semibold">
            Únete a Cloto Colombia
          </span>
          <h1 className="font-serif-title text-3xl tracking-wide text-[#1c1917]">
            Crear Cuenta
          </h1>
          <p className="font-serif-body text-xs text-stone-600">
            Regístrate para guardar tus direcciones de envío y disfrutar de lanzamientos exclusivos.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-[#f8eeed] border border-[#d59f9e] text-[#834442] text-xs rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-[#f0f3eb] border border-[#b2bc98] text-[#5c6643] text-xs rounded-lg flex items-center gap-2">
            <span>✨</span>
            <span>¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="Lucía"
                className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="Gómez"
                className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="310 123 4567"
              className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="lucia@ejemplo.com"
              className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || success}
            className="w-full mt-2 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-widest font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isPending ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-[#b6a450] font-semibold hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
