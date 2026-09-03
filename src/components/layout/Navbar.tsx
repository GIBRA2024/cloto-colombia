"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type NavChild = {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
};

type NavParent = {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
  children: NavChild[];
};

const LINE_NAMES: Record<string, string> = {
  "cloto-pijamas": "Ritual (Pijamas)",
  "cloto-ika-swimsuit": "Cloto Active",
  "cloto-rebecca": "Rebecca Casual",
  "cloto-home": "Cloto Home",
};

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<NavParent[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cargar categorías dinámicamente desde la base de datos
  useEffect(() => {
    fetch("/api/nav-categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: NavParent[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Filtrar categorías que sean líneas principales (excluir categorías de prueba si no tienen hijos)
          const validLines = data.filter((cat) => cat.slug.startsWith("cloto") || cat.children.length > 0);
          setCategories(validLines);
        }
      })
      .catch((err) => console.error("Error al cargar categorías en Navbar:", err));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Fallback estático en caso de carga inicial
  const defaultLines: NavParent[] = [
    {
      id: "1",
      name: "Cloto Ritual",
      slug: "cloto-pijamas",
      orderIndex: 1,
      children: [
        { id: "1-1", name: "Pijamas Clásicas (Camiseras)", slug: "pijamas-clasicas", orderIndex: 1 },
        { id: "1-2", name: "Pijamas Básicas (Tiras)", slug: "pijamas-basicas", orderIndex: 2 },
        { id: "1-3", name: "Pijamas Casuales (Algodón)", slug: "pijamas-casuales", orderIndex: 3 },
        { id: "1-4", name: "Batolas, Levantadoras & Kimonos", slug: "batolas", orderIndex: 4 },
        { id: "1-5", name: "Pantuflas, Esencias & Rituales", slug: "pantuflas", orderIndex: 5 },
      ],
    },
    {
      id: "2",
      name: "Cloto Active",
      slug: "cloto-ika-swimsuit",
      orderIndex: 2,
      children: [
        { id: "2-1", name: "Bañadores de 1 Pieza (Enterizos)", slug: "banadores-una-pieza", orderIndex: 1 },
        { id: "2-2", name: "Bañadores de 2 Piezas (Bikinis)", slug: "banadores-dos-piezas", orderIndex: 2 },
        { id: "2-3", name: "Ruanas & Salidas de Baño", slug: "ruanas-salidas-bano", orderIndex: 3 },
        { id: "2-4", name: "Pareos & Faldas Playeras", slug: "faldas-pareos", orderIndex: 4 },
        { id: "2-5", name: "Vestidos de Playa & Shorts", slug: "vestidos-playa", orderIndex: 5 },
      ],
    },
    {
      id: "3",
      name: "Cloto - Rebecca Casual",
      slug: "cloto-rebecca",
      orderIndex: 3,
      children: [
        { id: "3-1", name: "Vestidos Atemporales", slug: "vestidos", orderIndex: 1 },
        { id: "3-2", name: "Conjuntos de Pantalón & Falda", slug: "conjuntos-pantalon", orderIndex: 2 },
        { id: "3-3", name: "Camisas, Blusas & Bodys", slug: "camisas", orderIndex: 3 },
        { id: "3-4", name: "Pantalones, Faldas & Shorts", slug: "pantalones-casuales", orderIndex: 4 },
        { id: "3-5", name: "Joyería, Bolsos & Accesorios", slug: "joyeria-accesorios", orderIndex: 5 },
      ],
    },
    {
      id: "4",
      name: "Cloto Home (Habitar)",
      slug: "cloto-home",
      orderIndex: 4,
      children: [
        { id: "4-1", name: "Manteles & Caminos de Mesa", slug: "manteles", orderIndex: 1 },
        { id: "4-2", name: "Individuales, Servilletas & Portavasos", slug: "individuales", orderIndex: 2 },
        { id: "4-3", name: "Duvets, Sábanas & Lencería de Cama", slug: "sabanas", orderIndex: 3 },
        { id: "4-4", name: "Vajillas & Cristalería de Mesa", slug: "vajillas", orderIndex: 4 },
        { id: "4-5", name: "Cojines, Hamacas & Decoración", slug: "cojines", orderIndex: 5 },
      ],
    },
  ];

  const activeLines = categories.length > 0 ? categories : defaultLines;

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

            {/* Navegación Desktop Dinámica */}
            <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-[#1c1917]">
              {activeLines.map((line) => {
                const displayName = LINE_NAMES[line.slug] || line.name;
                const hasChildren = line.children && line.children.length > 0;

                return (
                  <div key={line.id} className="relative group py-2">
                    <Link
                      href={`/catalogo?linea=${line.slug}`}
                      className="hover:text-[#b6a450] transition-colors flex items-center gap-1"
                    >
                      {displayName}
                      {hasChildren && (
                        <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>

                    {hasChildren && (
                      <div className="absolute top-full left-0 w-64 bg-white border border-[#dfd8cb] shadow-xl rounded-md p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="text-[10px] text-[#8d9773] font-semibold tracking-widest uppercase mb-2">
                          {line.name}
                        </div>
                        <ul className="space-y-2 text-xs normal-case font-normal text-stone-700 max-h-72 overflow-y-auto pr-1">
                          {line.children.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/catalogo?linea=${line.slug}&categoria=${sub.slug}`}
                                className="hover:text-[#b6a450] block transition-colors"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                          <li className="pt-2 border-t border-stone-100">
                            <Link
                              href={`/catalogo?linea=${line.slug}`}
                              className="text-[#b6a450] font-medium text-[11px] block hover:underline"
                            >
                              Ver todo {displayName} &rarr;
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

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

              {/* Cuenta */}
              <Link
                href="/cuenta"
                className="p-1.5 text-[#1c1917] hover:text-[#b6a450] transition-colors hidden sm:inline-block"
                aria-label="Mi Cuenta"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
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
            <div className="space-y-4 text-sm">
              <p className="text-xs uppercase tracking-widest text-[#8d9773] font-bold">Líneas Cloto</p>
              
              {activeLines.map((line, idx) => {
                const displayName = LINE_NAMES[line.slug] || line.name;
                const hasChildren = line.children && line.children.length > 0;

                return (
                  <div key={line.id} className="space-y-1">
                    <Link
                      href={`/catalogo?linea=${line.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-serif-title text-base text-[#1c1917] hover:text-[#b6a450]"
                    >
                      {idx + 1}. {displayName}
                    </Link>
                    {hasChildren && (
                      <div className="flex flex-wrap gap-1.5 pl-2 text-[11px] text-stone-600">
                        {line.children.slice(0, 4).map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/catalogo?linea=${line.slug}&categoria=${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="hover:text-[#b6a450]"
                          >
                            {sub.name} •
                          </Link>
                        ))}
                        <Link
                          href={`/catalogo?linea=${line.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-[#b6a450] font-medium"
                        >
                          Ver todo &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
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
            </div>
          </div>
        )}
      </header>
    </>
  );
}
