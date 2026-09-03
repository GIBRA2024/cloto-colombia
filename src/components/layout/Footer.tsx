"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1c1917] text-[#f2f1e7] pt-16 pb-12 font-sans-ui border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección Superior: Newsletter & Esencia de Marca */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-stone-800">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-serif-title text-3xl tracking-[0.2em] uppercase text-[#f2f1e7] block">
              CLOTO
            </span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b6a450] font-semibold">
              Sustainable Lifestyle • Marca de Estilo Sostenible
            </p>
            <p className="font-serif-body text-stone-300 text-sm leading-relaxed max-w-md">
              Transformar la manera de vestir, habitar y consumir. Diseñamos prendas, accesorios y objetos de hogar con diseño, propósito y conciencia sostenible.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-stone-800/80 text-[#8d9773] border border-[#8d9773]/30">
                <span>🌱</span> 100% Confección Colombiana
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-stone-800/80 text-[#b6a450] border border-[#b6a450]/30">
                <span>✨</span> Fibras Orgánicas & Eco
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-stone-900/60 p-6 sm:p-8 rounded-xl border border-stone-800">
              <h3 className="font-serif-title text-xl text-[#f2f1e7] mb-2">
                Únete al Universo Cloto
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm mb-4">
                Recibe noticias exclusivas de nuevos lanzamientos, eventos privados y un 10% de descuento en tu primera compra.
              </p>
              {subscribed ? (
                <div className="bg-[#8d9773]/20 border border-[#8d9773]/40 text-[#b6a450] px-4 py-3 rounded-lg text-xs flex items-center gap-2">
                  <span>✓</span>
                  <span>¡Gracias por suscribirte! Te hemos enviado tu cupón de bienvenida.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-stone-800/80 border border-stone-700 text-white placeholder-stone-500 px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-[#b6a450] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#b6a450] hover:bg-[#a39243] text-stone-900 font-semibold rounded-lg text-xs transition-colors uppercase tracking-wider whitespace-nowrap"
                  >
                    Suscribirme
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Sección Media: Enlaces Rápidos y Navegación */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-stone-800 text-xs">
          {/* Col 1: Líneas Cloto */}
          <div>
            <h4 className="uppercase tracking-widest text-[#b6a450] font-semibold mb-4 text-[11px]">
              Nuestras Líneas
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li>
                <Link href="/catalogo?linea=cloto-pijamas" className="hover:text-white transition-colors">
                  1. Cloto Ritual (Pijamas)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-ika-swimsuit" className="hover:text-white transition-colors">
                  2. Cloto Active (Bañadores)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-rebecca" className="hover:text-white transition-colors">
                  3. Cloto - Rebecca Casual
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-home" className="hover:text-white transition-colors">
                  4. Cloto Home (Habitar)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?promociones=true" className="text-[#d59f9e] hover:text-white transition-colors font-medium">
                  Promociones & Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Tipos de Pijama */}
          <div>
            <h4 className="uppercase tracking-widest text-[#b6a450] font-semibold mb-4 text-[11px]">
              Estilos de Pijamas
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li>
                <Link href="/catalogo?linea=cloto-pijamas&estilo=pijama-basica" className="hover:text-white transition-colors">
                  Pijamas Básicas (Tiras)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-pijamas&estilo=pijama-clasica" className="hover:text-white transition-colors">
                  Pijamas Clásicas (Camiseras)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-pijamas&estilo=pijama-casual" className="hover:text-white transition-colors">
                  Pijamas Casuales
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-pijamas&corte=short" className="hover:text-white transition-colors">
                  Pijamas con Short
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-pijamas&corte=pantalon" className="hover:text-white transition-colors">
                  Pijamas con Pantalón
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=ropa-descanso-batas" className="hover:text-white transition-colors">
                  Batas & Loungewear
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sobre la Marca */}
          <div>
            <h4 className="uppercase tracking-widest text-[#b6a450] font-semibold mb-4 text-[11px]">
              La Marca
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors">
                  Sobre Nosotros & Historia
                </Link>
              </li>
              <li>
                <Link href="/nosotros#sostenibilidad" className="hover:text-white transition-colors">
                  Moda Sostenible & Telas
                </Link>
              </li>
              <li>
                <Link href="/nosotros#valores" className="hover:text-white transition-colors">
                  Nuestros Valores
                </Link>
              </li>
              <li>
                <Link href="/cuenta" className="hover:text-white transition-colors">
                  Mi Perfil & Direcciones
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors text-stone-400">
                  Panel de Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Atención & WhatsApp */}
          <div>
            <h4 className="uppercase tracking-widest text-[#b6a450] font-semibold mb-4 text-[11px]">
              Atención Personalizada
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li>
                <a
                  href="https://wa.me/573100000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
                >
                  <span>💬</span> Asesoría WhatsApp VIP
                </a>
              </li>
              <li>
                <span className="text-stone-400">Horario: Lunes a Sábado 9am - 7pm</span>
              </li>
              <li>
                <span className="text-stone-400">Despachos nacionales desde Colombia</span>
              </li>
              <li>
                <span className="text-stone-400">Guía de Tallas & Cuidados</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sección Inferior: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Cloto Colombia (T&T). Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Términos y Condiciones</span>
            <span>•</span>
            <span>Política de Privacidad</span>
            <span>•</span>
            <span>Cambios y Garantías</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
