import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function HomePage() {
  // Ejecutar consultas en paralelo para máxima velocidad de respuesta
  const [featuredProducts, promoProducts, lines] = await Promise.all([
    // 1. Obtener productos destacados
    prisma.product.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      include: {
        images: { orderBy: { orderIndex: "asc" }, take: 2 },
        variants: { where: { isActive: true } },
      },
      take: 8,
    }),

    // 2. Obtener productos en oferta / promoción
    prisma.product.findMany({
      where: {
        isPublished: true,
        compareAtPrice: { not: null },
      },
      include: {
        images: { orderBy: { orderIndex: "asc" }, take: 2 },
        variants: { where: { isActive: true } },
      },
      take: 8,
    }),

    // 3. Obtener las 4 líneas principales
    prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      orderBy: { orderIndex: "asc" },
    }),
  ]);


  return (
    <div className="space-y-20 pb-20 font-sans-ui">
      {/* 1. HERO EDITORIAL PRINCIPAL */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#e9e5d9] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1920&q=85"
            alt="Cloto Colombia Colección de Lujo"
            fill
            priority
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917]/70 via-[#1c1917]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-left w-full">
          <div className="max-w-2xl space-y-6 text-[#f2f1e7]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f1e7]/15 backdrop-blur-md border border-[#f2f1e7]/30 text-xs tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#b6a450]" />
              <span>Cloto Sustainable Lifestyle • Elige Mejor</span>
            </div>

            <h1 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-light tracking-wide leading-[1.1]">
              Vestir, Habitar <br />
              <span className="italic font-normal text-[#b6a450]">& Consumir</span>
            </h1>

            <p className="font-serif-body text-stone-200 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed">
              Transformar hábitos para transformar el futuro. Prendas, accesorios y objetos para el hogar creados con diseño, propósito y conciencia sostenible.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/catalogo?linea=cloto-pijamas"
                className="bg-[#f2f1e7] hover:bg-[#b6a450] hover:text-white text-[#1c1917] text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-md transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Explorar Cloto Ritual
              </Link>
              <Link
                href="/catalogo"
                className="bg-transparent hover:bg-white/20 text-[#f2f1e7] border border-[#f2f1e7]/60 text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-md transition-all duration-300 backdrop-blur-sm"
              >
                Ver Todo el Catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE LOS 4 PILARES DE MARCA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-2xl border border-[#dfd8cb] shadow-lg text-center">
          <div className="space-y-1.5 border-r border-stone-100 last:border-none">
            <span className="text-2xl">🌱</span>
            <h4 className="font-serif-title text-sm text-[#1c1917]">Telas Orgánicas & Eco</h4>
            <p className="text-[11px] text-stone-500">Algodón orgánico, seda y fibras recicladas</p>
          </div>
          <div className="space-y-1.5 border-r border-stone-100 last:border-none">
            <span className="text-2xl">🇨🇴</span>
            <h4 className="font-serif-title text-sm text-[#1c1917]">100% Colombiano</h4>
            <p className="text-[11px] text-stone-500">Diseñado y confeccionado localmente</p>
          </div>
          <div className="space-y-1.5 border-r border-stone-100 last:border-none">
            <span className="text-2xl">✨</span>
            <h4 className="font-serif-title text-sm text-[#1c1917]">Diseño con Propósito</h4>
            <p className="text-[11px] text-stone-500">Un estilo de vida que elige mejor</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-2xl">🎁</span>
            <h4 className="font-serif-title text-sm text-[#1c1917]">Detalles que Enamoran</h4>
            <p className="text-[11px] text-stone-500">Regalo de scrunchie o balaca en cada pijama</p>
          </div>
        </div>
      </section>

      {/* 3. VITRINA DE LAS 4 LÍNEAS DE PRODUCTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-semibold">
            Nuestros Universos
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917]">
            Las 4 Líneas de Cloto
          </h2>
          <p className="font-serif-body text-xs sm:text-sm text-stone-600">
            Descubre colecciones creadas para acompañar cada momento de tu día con elegancia serena.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tarjeta 1: Cloto Ritual */}
          <Link
            href="/catalogo?linea=cloto-pijamas"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
          >
            <Image
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
              alt="Cloto Ritual - Pijamas y Ropa de Descanso"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-1 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#b6a450] font-semibold">
                Línea 01 • Descanso
              </span>
              <h3 className="font-serif-title text-2xl">Cloto Ritual</h3>
              <p className="text-xs text-stone-300 font-serif-body">Pijamas Clásicas, Básicas, Casuales & Batolas</p>
              <span className="inline-block text-[11px] uppercase tracking-wider text-[#b6a450] font-medium pt-2 group-hover:translate-x-1 transition-transform">
                Explorar línea &rarr;
              </span>
            </div>
          </Link>

          {/* Tarjeta 2: Cloto Active */}
          <Link
            href="/catalogo?linea=cloto-ika-swimsuit"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
          >
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              alt="Cloto Active - Bañadores y Ropa Deportiva"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-1 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#b6a450] font-semibold">
                Línea 02 • Deporte & Playa
              </span>
              <h3 className="font-serif-title text-2xl">Cloto Active</h3>
              <p className="text-xs text-stone-300 font-serif-body">Bañadores 1, 2 y 3 piezas, Pareos & Salidas</p>
              <span className="inline-block text-[11px] uppercase tracking-wider text-[#b6a450] font-medium pt-2 group-hover:translate-x-1 transition-transform">
                Explorar línea &rarr;
              </span>
            </div>
          </Link>

          {/* Tarjeta 3: Cloto - Rebecca Casual */}
          <Link
            href="/catalogo?linea=cloto-rebecca"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
          >
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
              alt="Cloto - Rebecca Casual"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-1 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#b6a450] font-semibold">
                Línea 03
              </span>
              <h3 className="font-serif-title text-2xl">Rebecca Casual</h3>
              <p className="text-xs text-stone-300 font-serif-body">Vestidos, Blusas & Linos Naturales</p>
              <span className="inline-block text-[11px] uppercase tracking-wider text-[#b6a450] font-medium pt-2 group-hover:translate-x-1 transition-transform">
                Explorar línea &rarr;
              </span>
            </div>
          </Link>

          {/* Tarjeta 4: Cloto Home */}
          <Link
            href="/catalogo?linea=cloto-home"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
          >
            <Image
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
              alt="Cloto Home"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-1 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#b6a450] font-semibold">
                Línea 04
              </span>
              <h3 className="font-serif-title text-2xl">Cloto Home</h3>
              <p className="text-xs text-stone-300 font-serif-body">Lencería de Cama, Baño & Mesa</p>
              <span className="inline-block text-[11px] uppercase tracking-wider text-[#b6a450] font-medium pt-2 group-hover:translate-x-1 transition-transform">
                Explorar línea &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. SECCIÓN DE PRODUCTOS DESTACADOS (Alimentada desde Admin isFeatured = true) */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#dfd8cb] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#b6a450] font-semibold">
                Curaduría Exclusiva
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
                Prendas Destacadas
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="text-xs uppercase tracking-wider text-[#1c1917] hover:text-[#b6a450] font-semibold flex items-center gap-1 transition-colors"
            >
              Ver todo el catálogo &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const mainImg = product.images[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";
              const hoverImg = product.images[1]?.url || mainImg;
              const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.basePrice);

              return (
                <div key={product.id} className="group flex flex-col space-y-3">
                  <Link
                    href={`/producto/${product.slug}`}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 shadow-sm"
                  >
                    <Image
                      src={mainImg}
                      alt={product.name}
                      fill
                      className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    <Image
                      src={hoverImg}
                      alt={`${product.name} detalle`}
                      fill
                      className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="badge-gold text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shadow-sm">
                        Destacado
                      </span>
                      {hasDiscount && (
                        <span className="badge-terracotta text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
                          Oferta
                        </span>
                      )}
                    </div>
                  </Link>

                  <div>
                    <h3 className="font-serif-title text-sm sm:text-base text-[#1c1917] group-hover:text-[#b6a450] transition-colors line-clamp-1">
                      <Link href={`/producto/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {product.shortDescription || "Confección consciente colombiana"}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-semibold text-[#1c1917]">
                        ${Number(product.basePrice).toLocaleString("es-CO")} COP
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-stone-400 line-through">
                          ${Number(product.compareAtPrice).toLocaleString("es-CO")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. BANNER EDITORIAL & GRID VISUAL DE SILUETAS CLOTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Editorial Central */}
        <div className="relative rounded-3xl overflow-hidden bg-[#1c1917] text-[#f2f1e7] shadow-xl border border-stone-800">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1920&q=80"
              alt="Cloto Pijamas Ritual de Descanso"
              fill
              className="object-cover object-center opacity-30 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1c1917] via-[#1c1917]/90 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b6a450]/15 border border-[#b6a450]/30 text-[#b6a450] text-[10px] uppercase tracking-[0.25em] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b6a450]" />
              <span>Cloto Pijamas • Ritual de Descanso</span>
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-wide text-white">
              El Arte de Habitar <br />
              <span className="italic font-normal text-[#b6a450]">tu Propio Espacio</span>
            </h2>

            <p className="font-serif-body text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg">
              Prendas confeccionadas con intención para acompañar tus noches y momentos de calma. Texturas fluidas, caídas suaves y cortes pensados para el descanso consciente.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/catalogo?linea=cloto-pijamas"
                className="bg-[#b6a450] hover:bg-[#a39242] text-stone-950 font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <span>Explorar Colección de Pijamas</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/catalogo?linea=cloto-pijamas&categoria=ropa-descanso-batas"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs uppercase tracking-widest font-semibold px-5 py-3.5 rounded-xl transition-all backdrop-blur-sm"
              >
                Batas & Kimonos
              </Link>
            </div>
          </div>
        </div>

        {/* Trío de Siluetas en Grid Fotográfico Editorial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Silueta 01: Básicas de Tiras */}
          <Link
            href="/catalogo?linea=cloto-pijamas&estilo=pijama-basica"
            className="group relative h-84 rounded-2xl overflow-hidden border border-[#dfd8cb] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6"
          >
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85"
              alt="Pijamas Básicas de Tiras"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/95 via-[#1c1917]/45 to-transparent" />
            <div className="relative z-10 space-y-1 text-[#f2f1e7]">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#b6a450] font-bold">
                Silueta 01
              </span>
              <h3 className="font-serif-title text-xl text-white group-hover:text-[#b6a450] transition-colors">
                Básica de Tiras
              </h3>
              <p className="text-xs text-stone-300 line-clamp-1">
                Tirantes regulables, siluetas frescas y caída fluida.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b6a450] pt-1 group-hover:translate-x-1 transition-transform">
                Ver siluetas en catálogo &rarr;
              </span>
            </div>
          </Link>

          {/* Silueta 02: Clásica Camisera */}
          <Link
            href="/catalogo?linea=cloto-pijamas&estilo=pijama-clasica"
            className="group relative h-84 rounded-2xl overflow-hidden border border-[#dfd8cb] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6"
          >
            <Image
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=85"
              alt="Pijamas Clásicas Camiseras"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/95 via-[#1c1917]/45 to-transparent" />
            <div className="relative z-10 space-y-1 text-[#f2f1e7]">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#b6a450] font-bold">
                Silueta 02
              </span>
              <h3 className="font-serif-title text-xl text-white group-hover:text-[#b6a450] transition-colors">
                Clásica Camisera
              </h3>
              <p className="text-xs text-stone-300 line-clamp-1">
                Camisa abotonada, cuello solapa y vivos contrastantes.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b6a450] pt-1 group-hover:translate-x-1 transition-transform">
                Ver siluetas en catálogo &rarr;
              </span>
            </div>
          </Link>

          {/* Silueta 03: Batas & Loungewear */}
          <Link
            href="/catalogo?linea=cloto-pijamas&categoria=ropa-descanso-batas"
            className="group relative h-84 rounded-2xl overflow-hidden border border-[#dfd8cb] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6"
          >
            <Image
              src="https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=85"
              alt="Batas y Kimonos de Descanso"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/95 via-[#1c1917]/45 to-transparent" />
            <div className="relative z-10 space-y-1 text-[#f2f1e7]">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#b6a450] font-bold">
                Silueta 03
              </span>
              <h3 className="font-serif-title text-xl text-white group-hover:text-[#b6a450] transition-colors">
                Batas & Loungewear
              </h3>
              <p className="text-xs text-stone-300 line-clamp-1">
                Prendas relajadas tipo kimono y batas envolventes.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b6a450] pt-1 group-hover:translate-x-1 transition-transform">
                Ver siluetas en catálogo &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. SECCIÓN DE OFERTAS Y PROMOCIONES (compareAtPrice > basePrice) */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#dfd8cb] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#9c6361] font-bold">
                Oportunidades Especiales
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
                Promociones de Temporada
              </h2>
            </div>
            <Link
              href="/catalogo?promociones=true"
              className="text-xs uppercase tracking-wider text-[#9c6361] hover:text-[#834442] font-semibold flex items-center gap-1 transition-colors"
            >
              Ver todas las promociones &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {promoProducts.map((product) => {
              const mainImg = product.images[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";
              const discountPercent = product.compareAtPrice
                ? Math.round(
                    ((Number(product.compareAtPrice) - Number(product.basePrice)) /
                      Number(product.compareAtPrice)) *
                      100
                  )
                : null;

              return (
                <div key={product.id} className="group flex flex-col space-y-3">
                  <Link
                    href={`/producto/${product.slug}`}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 shadow-sm"
                  >
                    <Image
                      src={mainImg}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3 z-10">
                      <span className="badge-terracotta text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded shadow-sm">
                        {discountPercent ? `-${discountPercent}% OFF` : "OFERTA"}
                      </span>
                    </div>
                  </Link>

                  <div>
                    <h3 className="font-serif-title text-sm sm:text-base text-[#1c1917] group-hover:text-[#b6a450] transition-colors line-clamp-1">
                      <Link href={`/producto/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-[#9c6361]">
                        ${Number(product.basePrice).toLocaleString("es-CO")} COP
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ${Number(product.compareAtPrice).toLocaleString("es-CO")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. MANIFIESTO DE MARCA EDITORIAL (Manual de Marca) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 py-12">
        <span className="text-2xl">🦋</span>
        <h2 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917] leading-snug">
          &ldquo;Creemos en una moda que habla bajito pero deja huella —hecha con intención, respeto por el entorno y amor por los detalles.&rdquo;
        </h2>
        <p className="font-serif-body text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Inspiradas en la mariposa y los paisajes de Colombia, cada pieza es un homenaje a la elegancia etérea y a la fuerza serena de lo femenino.
        </p>
        <div className="pt-2">
          <Link
            href="/nosotros"
            className="inline-block text-xs uppercase tracking-widest text-[#1c1917] hover:text-[#b6a450] font-semibold border-b border-[#1c1917] pb-1 transition-colors"
          >
            Conoce nuestra historia y valores &rarr;
          </Link>
        </div>
      </section>

      {/* 8. COMUNIDAD & SOCIAL COMMERCE (Estrategia de Mercadeo UGC) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-semibold">
            #MujerCloto • Instagram
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
            Momentos & Estilo de Vida
          </h2>
          <p className="font-serif-body text-xs text-stone-600">
            Comparte tus momentos usando @clotocolombia para ser parte de nuestra vitrina.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-square rounded-xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
              alt="Estilo Cloto"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif-title">
              @la.econstantino ✨
            </div>
          </div>

          <div className="relative aspect-square rounded-xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80"
              alt="Estilo Cloto"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif-title">
              @sofigarcesc 🌿
            </div>
          </div>

          <div className="relative aspect-square rounded-xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
              alt="Estilo Cloto"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif-title">
              @cirlepelobueno ☀️
            </div>
          </div>

          <div className="relative aspect-square rounded-xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
              alt="Estilo Cloto"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif-title">
              @eleonora.morales 🕊️
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
