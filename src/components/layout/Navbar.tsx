"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Barra superior de anuncios */}
      <div className="bg-[#1c1917] text-[#f2f1e7] text-[11px] uppercase tracking-widest py-2 px-4 text-center font-sans-ui flex items-center justify-center gap-3">
        <span>✨ Envíos a toda Colombia</span>
        <span className="opacity-40">•</span>
        <span>Confección 100% Ética & Telas Orgánicas</span>
        <span className="opacity-40 hidden sm:inline">•</span>
        <span className="hidden sm:inline text-[#b6a450]">Asesoría Personalizada</span>
      </div>

      {/* Header Principal */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "glass-header shadow-sm border-b border-[#dfd8cb]/80 py-3"
            : "bg-[#f2f1e7] border-b border-[#dfd8cb] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Menú Móvil Botón */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1c1917] hover:text-[#b6a450] transition-colors"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-[#1c1917]">
              {/* Cloto Ritual con Dropdown */}
              <div className="relative group py-2">
                <Link
                  href="/catalogo?linea=cloto-pijamas"
                  className="hover:text-[#b6a450] transition-colors flex items-center gap-1"
                >
                  Ritual (Pijamas)
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 w-64 bg-white border border-[#dfd8cb] shadow-xl rounded-md p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="text-[10px] text-[#8d9773] font-semibold tracking-widest uppercase mb-2">
                    Línea 1: Cloto Ritual
                  </div>
                  <ul className="space-y-2 text-xs normal-case font-normal text-stone-700">
                    <li>
                      <Link href="/catalogo?linea=cloto-pijamas&estilo=pijamas-clasicas" className="hover:text-[#b6a450] block">
                        Pijamas Clásicas (Camiseras)
                      </Link>
                    </li>
                    <li>
                      <Link href="/catalogo?linea=cloto-pijamas&estilo=pijamas-basicas" className="hover:text-[#b6a450] block">
                        Pijamas Básicas (Tiras)
                      </Link>
                    </li>
                    <li>
                      <Link href="/catalogo?linea=cloto-pijamas&estilo=pijamas-casuales" className="hover:text-[#b6a450] block">
                        Pijamas Casuales (Algodón)
                      </Link>
                    </li>
                    <li>
                      <Link href="/catalogo?linea=cloto-pijamas&categoria=batolas" className="hover:text-[#b6a450] block">
                        Batolas, Levantadoras & Kimonos
                      </Link>
                    </li>
                    <li>
                      <Link href="/catalogo?linea=cloto-pijamas&categoria=pantuflas" className="hover:text-[#b6a450] block">
                        Pantuflas, Esencias & Rituales
                      </Link>
                    </li>
                    <li className="pt-2 border-t border-stone-100">
                      <Link href="/catalogo?linea=cloto-pijamas" className="text-[#b6a450] font-medium text-[11px] block">
                        Ver todo Cloto Ritual &rarr;
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cloto Active */}
              <Link href="/catalogo?linea=cloto-ika-swimsuit" className="hover:text-[#b6a450] transition-colors py-2">
                Cloto Active
              </Link>

              {/* Rebecca Casual */}
              <Link href="/catalogo?linea=cloto-rebecca" className="hover:text-[#b6a450] transition-colors py-2">
                Rebecca Casual
              </Link>

              {/* Cloto Home */}
              <Link href="/catalogo?linea=cloto-home" className="hover:text-[#b6a450] transition-colors py-2">
                Cloto Home
              </Link>

              {/* Sobre Nosotros */}
              <Link href="/nosotros" className="hover:text-[#b6a450] transition-colors py-2">
                Nosotros
              </Link>

              {/* Ofertas */}
              <Link href="/catalogo?promociones=true" className="text-[#9c6361] font-semibold hover:opacity-80 transition-opacity py-2 flex items-center gap-1">
                <span>Ofertas</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#9c6361]" />
              </Link>
            </nav>

            {/* Logo Central */}
            <div className="flex-1 lg:flex-none text-center">
              <Link href="/" className="inline-block group text-center">
                <span className="font-serif-title text-2xl sm:text-3xl tracking-[0.2em] font-medium text-[#1c1917] uppercase block transition-colors group-hover:text-[#b6a450]">
                  CLOTO
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-[#6b655f] -mt-1 block">
                  COLOMBIA
                </span>
              </Link>
            </div>

            {/* Acciones de la Derecha */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Buscador Botón */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-[#1c1917] hover:text-[#b6a450] transition-colors"
                aria-label="Buscar productos"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cuenta / Admin */}
              <Link
                href="/cuenta"
                className="p-1.5 text-[#1c1917] hover:text-[#b6a450] transition-colors hidden sm:inline-block"
                aria-label="Mi Cuenta"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Acceso directo a Admin (para administradores) */}
              <Link
                href="/admin"
                className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-stone-200/70 hover:bg-[#b6a450] hover:text-white rounded transition-colors hidden md:inline-block"
                title="Panel de Administración"
              >
                Admin
              </Link>

              {/* Botón Carrito */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-1.5 text-[#1c1917] hover:text-[#b6a450] transition-colors flex items-center"
                aria-label="Ver Carrito de Compras"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-[#9c6361] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Barra desplegable de Búsqueda */}
        {searchOpen && (
          <div className="border-t border-[#dfd8cb] bg-white/95 px-4 py-3 shadow-inner">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar pijamas, vestidos, lencería de cama, trajes de baño..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent border border-[#dfd8cb] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#b6a450]"
              />
              <button
                type="submit"
                className="bg-[#1c1917] hover:bg-[#b6a450] text-white text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors font-medium"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-900"
              >
                ✕
              </button>
            </form>
          </div>
        )}

        {/* Menú Móvil Desplegable */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#dfd8cb] bg-[#f2f1e7] px-6 py-6 space-y-4 shadow-lg font-sans-ui">
            <div className="space-y-3 text-sm">
              <p className="text-xs uppercase tracking-widest text-[#8d9773] font-bold">Líneas Cloto</p>
              <Link
                href="/catalogo?linea=cloto-pijamas"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-serif-title text-base text-[#1c1917]"
              >
                1. Cloto Ritual (Pijamas & Descanso)
              </Link>
              <Link
                href="/catalogo?linea=cloto-ika-swimsuit"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-serif-title text-base text-[#1c1917]"
              >
                2. Cloto Active (Bañadores & Ropa Deportiva)
              </Link>
              <Link
                href="/catalogo?linea=cloto-rebecca"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-serif-title text-base text-[#1c1917]"
              >
                3. Cloto - Rebecca Casual
              </Link>
              <Link
                href="/catalogo?linea=cloto-home"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-serif-title text-base text-[#1c1917]"
              >
                4. Cloto Home
              </Link>
            </div>

            <div className="pt-4 border-t border-[#dfd8cb] space-y-3 text-sm">
              <Link
                href="/catalogo?promociones=true"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#9c6361] font-semibold"
              >
                🏷️ Ofertas & Promociones
              </Link>
              <Link
                href="/nosotros"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#1c1917]"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/cuenta"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#1c1917]"
              >
                Mi Cuenta & Direcciones
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-stone-600 font-medium"
              >
                Panel de Administración (Admin)
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
