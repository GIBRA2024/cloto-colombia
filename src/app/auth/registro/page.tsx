"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { signupAction } from "@/actions/auth";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/cuenta";
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGooglePending(true);
      setError(null);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) {
        setError(error.message);
        setIsGooglePending(false);
      }
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al conectar con Google.");
      setIsGooglePending(false);
    }
  };

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
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-[#f0f3eb] border border-[#b2bc98] text-[#5c6643] text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...</span>
          </div>
        )}

        {/* Botón Registrarse con Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGooglePending || isPending || success}
          className="w-full flex items-center justify-center gap-3 bg-white border border-[#dfd8cb] hover:bg-[#faf8f5] text-stone-700 text-xs font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {isGooglePending ? "Conectando con Google..." : "Registrarme con Google"}
          </span>
        </button>

        {/* Separador */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#dfd8cb]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white px-3 text-stone-400 font-medium">o con tus datos</span>
          </div>
        </div>

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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg pl-4 pr-11 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 transition-colors"
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
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
