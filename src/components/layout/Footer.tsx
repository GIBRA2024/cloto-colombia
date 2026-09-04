"use client";

import React from "react";
import Link from "next/link";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-[#1c1917] text-[#f2f1e7] pt-16 pb-12 font-sans-ui border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección Superior: Manifiesto de Marca & Concierge VIP */}
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
                <svg className="w-3.5 h-3.5 text-[#8d9773]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
                <span>Talleres Éticos</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-stone-800/80 text-[#b6a450] border border-[#b6a450]/30">
                <svg className="w-3.5 h-3.5 text-[#b6a450]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span>Fibras Orgánicas & Eco</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-stone-900/60 p-6 sm:p-8 rounded-xl border border-stone-800 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#b6a450] font-semibold block">
                Atención & Asesoría VIP
              </span>
              <h3 className="font-serif-title text-xl sm:text-2xl text-[#f2f1e7]">
                ¿Buscas una silueta especial o asesoría para tu espacio?
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm font-serif-body leading-relaxed">
                Nuestras asesoras de moda y hogar te acompañan de forma personalizada en la elección de tallas, confección de prendas, textiles de cama y empaques para regalo.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={getWhatsAppLink("Hola Cloto, quisiera asesoría personalizada con una prenda o producto")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b6a450] hover:bg-[#a39243] text-stone-950 font-bold rounded-lg text-xs transition-colors uppercase tracking-wider"
                >
                  <svg className="w-4 h-4 text-stone-950" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.187 1.564 5.941l-1.564 5.715 5.86-1.537c1.701.928 3.652 1.464 5.727 1.464 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
                  </svg>
                  <span>Chatear por WhatsApp</span>
                </a>
                <Link
                  href="/ayuda"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs transition-colors"
                >
                  <span>Centro de Ayuda</span> &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Media: Enlaces Rápidos y Navegación */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-stone-800 text-xs">
          {/* Col 1: Líneas Cloto */}
          <div>
            <h4 className="uppercase tracking-widest text-[#b6a450] font-semibold mb-4 text-[11px]">
              Nuestras Colecciones
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li>
                <Link href="/catalogo?linea=cloto-pijamas" className="hover:text-white transition-colors">
                  Cloto Ritual (Pijamas)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-ika-swimsuit" className="hover:text-white transition-colors">
                  Cloto Active (Bañadores)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-rebecca" className="hover:text-white transition-colors">
                  Cloto Rebecca (Casual)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?linea=cloto-home" className="hover:text-white transition-colors">
                  Cloto Home (Habitar)
                </Link>
              </li>
              <li>
                <Link href="/catalogo?promociones=true" className="text-[#d59f9e] hover:text-white transition-colors font-medium">
                  Promociones & Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Servicio al Cliente */}
          <div>
            <h4 className="uppercase tracking-widest text-[#b6a450] font-semibold mb-4 text-[11px]">
              Servicio al Cliente
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li>
                <Link href="/ayuda#tallas" className="hover:text-white transition-colors">
                  Guía de Tallas & Cuidados
                </Link>
              </li>
              <li>
                <Link href="/ayuda#envios" className="hover:text-white transition-colors">
                  Envíos & Cobertura Nacional
                </Link>
              </li>
              <li>
                <Link href="/ayuda#cambios" className="hover:text-white transition-colors">
                  Cambios, Garantías & Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/ayuda#faq" className="hover:text-white transition-colors">
                  Preguntas Frecuentes (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/cuenta/pedidos" className="hover:text-white transition-colors">
                  Rastreo & Mis Pedidos
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
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Asesoría WhatsApp VIP</span>
                </a>
              </li>
              <li>
                <span className="text-stone-400">Horario: Lunes a Sábado 9am - 7pm</span>
              </li>
              <li>
                <span className="text-stone-400">Despachos nacionales desde Colombia</span>
              </li>
              <li>
                <span className="text-stone-400">Atención personalizada y directa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sección Inferior: Copyright & Legal */}
        <div className="pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/ayuda" className="hover:text-stone-200 transition-colors">
                Términos y Condiciones
              </Link>
              <span>•</span>
              <Link href="/ayuda" className="hover:text-stone-200 transition-colors">
                Política de Privacidad
              </Link>
              <span>•</span>
              <Link href="/ayuda" className="hover:text-stone-200 transition-colors">
                Cambios y Garantías
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-stone-400 gap-2 border-t border-stone-800/80 pt-4">
            <p>
              © {new Date().getFullYear()} Cloto Colombia (T&T). Contenido y marca protegidos.
            </p>
            <p>
              Software y plataforma tecnológica © {new Date().getFullYear()}{" "}
              <a
                href="https://gibracompany.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-stone-300 hover:text-white hover:underline transition-colors"
              >
                Gibra Company
              </a>
              . Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
