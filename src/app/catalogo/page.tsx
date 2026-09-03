import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{
    linea?: string;
    estilo?: string;
    categoria?: string;
    corte?: string;
    talla?: string;
    promociones?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const { linea, estilo, categoria, corte, talla, promociones, q, sort } = params;

  // Construir filtros para Prisma
  const where: any = {
    isPublished: true,
  };

  // Filtro de promociones
  if (promociones === "true") {
    where.compareAtPrice = { not: null };
  }

  // Filtro de búsqueda por texto
  if (q && q.trim()) {
    where.OR = [
      { name: { contains: q.trim(), mode: "insensitive" } },
      { description: { contains: q.trim(), mode: "insensitive" } },
      { shortDescription: { contains: q.trim(), mode: "insensitive" } },
    ];
  }

  // Filtro por categorías jerárquicas
  // Si se selecciona un estilo o categoría específica, filtramos estrictamente por ese nivel (y sus posibles hijas).
  // Si solo se selecciona la línea general, mostramos todos los productos de esa línea.
  const specificCategorySlug = estilo || categoria;

  if (specificCategorySlug) {
    const matchedCategories = await prisma.category.findMany({
      where: {
        OR: [
          { slug: specificCategorySlug },
          { parent: { slug: specificCategorySlug } },
          { parent: { parent: { slug: specificCategorySlug } } },
        ],
      },
      select: { id: true },
    });

    const categoryIds = matchedCategories.map((c) => c.id);
    if (categoryIds.length > 0) {
      where.categories = {
        some: {
          categoryId: { in: categoryIds },
        },
      };
    } else {
      where.categories = {
        some: {
          category: { slug: specificCategorySlug },
        },
      };
    }
  } else if (linea) {
    const matchedCategories = await prisma.category.findMany({
      where: {
        OR: [
          { slug: linea },
          { parent: { slug: linea } },
          { parent: { parent: { slug: linea } } },
        ],
      },
      select: { id: true },
    });

    const categoryIds = matchedCategories.map((c) => c.id);
    if (categoryIds.length > 0) {
      where.categories = {
        some: {
          categoryId: { in: categoryIds },
        },
      };
    }
  }

  // Filtro por corte (en el nombre o slug)
  if (corte) {
    where.name = { contains: corte, mode: "insensitive" };
  }

  // Filtro por talla en variantes
  if (talla) {
    where.variants = {
      some: {
        size: { equals: talla, mode: "insensitive" },
        stock: { gt: 0 },
      },
    };
  }

  // Ordenamiento
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderBy = { basePrice: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { basePrice: "desc" };
  } else if (sort === "name") {
    orderBy = { name: "asc" };
  }

  // Ejecutar consulta
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: { orderBy: { orderIndex: "asc" } },
      variants: { where: { isActive: true } },
      categories: { include: { category: true } },
    },
  });

  // Obtener todas las líneas principales para el sidebar
  const lines = await prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  // Consultar subcategorías dinámicas si hay una línea seleccionada
  const currentLineCategory = linea
    ? await prisma.category.findUnique({
        where: { slug: linea },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { orderIndex: "asc" },
            include: {
              children: {
                where: { isActive: true },
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
      })
    : null;

  // Extraer subcategorías a mostrar según la línea
  const subcategoriesToDisplay: {
    name: string;
    slug: string;
    paramKey: "estilo" | "categoria";
  }[] = [];
  let subcategoriesSectionTitle = "Estilos & Categorías";

  if (currentLineCategory) {
    if (currentLineCategory.slug === "cloto-pijamas") {
      subcategoriesSectionTitle = "Prendas & Estilos de Cloto Ritual";
      for (const child of currentLineCategory.children) {
        if (child.children && child.children.length > 0) {
          for (const grandChild of child.children) {
            subcategoriesToDisplay.push({
              name: grandChild.name,
              slug: grandChild.slug,
              paramKey: "estilo",
            });
          }
        } else {
          subcategoriesToDisplay.push({
            name: child.name,
            slug: child.slug,
            paramKey: "categoria",
          });
        }
      }
    } else if (currentLineCategory.slug === "cloto-ika-swimsuit") {
      subcategoriesSectionTitle = "Prendas & Accesorios de Cloto Active";
      for (const child of currentLineCategory.children) {
        subcategoriesToDisplay.push({
          name: child.name,
          slug: child.slug,
          paramKey: "categoria",
        });
        if (child.children && child.children.length > 0) {
          for (const grandChild of child.children) {
            subcategoriesToDisplay.push({
              name: grandChild.name,
              slug: grandChild.slug,
              paramKey: "estilo",
            });
          }
        }
      }
    } else if (currentLineCategory.slug === "cloto-rebecca") {
      subcategoriesSectionTitle = "Categorías Casual & Moda";
      for (const child of currentLineCategory.children) {
        subcategoriesToDisplay.push({
          name: child.name,
          slug: child.slug,
          paramKey: "categoria",
        });
      }
    } else if (currentLineCategory.slug === "cloto-home") {
      subcategoriesSectionTitle = "Categorías Cloto Home";
      for (const child of currentLineCategory.children) {
        subcategoriesToDisplay.push({
          name: child.name,
          slug: child.slug,
          paramKey: "categoria",
        });
      }
    } else {
      subcategoriesSectionTitle = `Estilos de ${currentLineCategory.name}`;
      for (const child of currentLineCategory.children) {
        subcategoriesToDisplay.push({
          name: child.name,
          slug: child.slug,
          paramKey: "categoria",
        });
      }
    }
  }

  // El filtro de corte solo es relevante para pijamas o catálogo general
  const showCorteFilter = !linea || linea === "cloto-pijamas";
  // El filtro de tallas de vestir (XS, S, M, L, XL) no aplica para lencería de hogar y decoración
  const showTallaFilter = linea !== "cloto-home";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans-ui space-y-8">
      {/* Cabecera del Catálogo */}
      <div className="border-b border-[#dfd8cb] pb-6 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-semibold">
              Colección Cloto Colombia
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917] capitalize">
              {currentLineCategory
                ? currentLineCategory.name
                : linea
                ? linea.replace(/-/g, " ")
                : promociones === "true"
                ? "Ofertas & Promociones"
                : "Catálogo Completo"}
            </h1>
            {currentLineCategory?.description && (
              <p className="font-serif-body text-xs text-stone-600 mt-1 max-w-2xl">
                {currentLineCategory.description}
              </p>
            )}
          </div>
          <p className="text-xs text-stone-500">
            Mostrando <strong>{products.length}</strong> {products.length === 1 ? "prenda" : "prendas"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR DE FILTROS */}
        <aside className="space-y-6 lg:border-r lg:border-[#dfd8cb] lg:pr-6">
          {/* Limpiar Filtros */}
          {(linea || estilo || categoria || corte || talla || promociones || q) && (
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-xs text-[#9c6361] hover:underline font-semibold bg-[#9c6361]/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>✕</span> Limpiar todos los filtros
            </Link>
          )}

          {/* Filtro: Líneas de Producto */}
          <div className="space-y-2.5">
            <h3 className="font-serif-title text-sm uppercase tracking-wider text-[#1c1917]">
              Líneas de Producto
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <Link
                  href="/catalogo"
                  className={`hover:text-[#b6a450] block transition-colors ${
                    !linea && !promociones ? "font-bold text-[#b6a450]" : ""
                  }`}
                >
                  Todas las líneas
                </Link>
              </li>
              {lines.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/catalogo?linea=${l.slug}`}
                    className={`hover:text-[#b6a450] block transition-colors ${
                      linea === l.slug ? "font-bold text-[#b6a450]" : ""
                    }`}
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/catalogo?promociones=true"
                  className={`text-[#9c6361] hover:underline block transition-colors ${
                    promociones === "true" ? "font-bold" : ""
                  }`}
                >
                  🏷️ Solo Ofertas / Promociones
                </Link>
              </li>
            </ul>
          </div>

          {/* Filtro Dinámico: Subcategorías / Estilos según la línea */}
          {subcategoriesToDisplay.length > 0 && (
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <h3 className="font-serif-title text-sm uppercase tracking-wider text-[#1c1917]">
                {subcategoriesSectionTitle}
              </h3>
              <div className="space-y-1 text-xs text-stone-600">
                {subcategoriesToDisplay.map((item) => {
                  const isSelected =
                    estilo === item.slug || categoria === item.slug;
                  const targetHref = isSelected
                    ? `/catalogo?linea=${linea}`
                    : `/catalogo?linea=${linea}&${item.paramKey}=${item.slug}`;

                  return (
                    <Link
                      key={item.slug}
                      href={targetHref}
                      className={`block py-1 transition-colors hover:text-[#b6a450] ${
                        isSelected ? "font-bold text-[#b6a450]" : ""
                      }`}
                    >
                      {item.name} {isSelected && "✓"}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filtro: Cortes / Largos (Solo si aplica) */}
          {showCorteFilter && (
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <h3 className="font-serif-title text-sm uppercase tracking-wider text-[#1c1917]">
                Corte o Largo
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {["Short", "Pantalón", "Capri", "Pescador"].map((c) => {
                  const isSelected = corte === c.toLowerCase();
                  const targetHref = isSelected
                    ? `/catalogo${linea ? `?linea=${linea}` : ""}`
                    : `/catalogo?corte=${c.toLowerCase()}${linea ? `&linea=${linea}` : ""}`;

                  return (
                    <Link
                      key={c}
                      href={targetHref}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                        isSelected
                          ? "bg-[#1c1917] text-white border-[#1c1917]"
                          : "bg-white text-stone-700 border-[#dfd8cb] hover:border-[#b6a450]"
                      }`}
                    >
                      {c}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filtro: Tallas (Solo aplica a prendas de vestir, no a lencería de hogar/decoración) */}
          {showTallaFilter && (
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <h3 className="font-serif-title text-sm uppercase tracking-wider text-[#1c1917]">
                Talla
              </h3>
              <div className="grid grid-cols-5 gap-1.5">
                {["XS", "S", "M", "L", "XL"].map((t) => {
                  const isSelected = talla === t;
                  const targetHref = isSelected
                    ? `/catalogo${linea ? `?linea=${linea}` : ""}`
                    : `/catalogo?talla=${t}${linea ? `&linea=${linea}` : ""}`;

                  return (
                    <Link
                      key={t}
                      href={targetHref}
                      className={`text-xs py-1 text-center rounded border transition-colors ${
                        isSelected
                          ? "bg-[#1c1917] text-white border-[#1c1917]"
                          : "bg-white text-stone-700 border-[#dfd8cb] hover:border-[#b6a450]"
                      }`}
                    >
                      {t}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </aside>



        {/* GRILLA DE PRODUCTOS */}
        <main className="lg:col-span-3 space-y-6">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#dfd8cb] p-8 space-y-4">
              <span className="text-4xl">🕊️</span>
              <h2 className="font-serif-title text-2xl text-[#1c1917]">
                No encontramos prendas con los filtros seleccionados
              </h2>
              <p className="font-serif-body text-xs text-stone-500 max-w-md mx-auto">
                Intenta seleccionando otra categoría o limpiando los filtros para descubrir toda nuestra colección.
              </p>
              <div>
                <Link
                  href="/catalogo"
                  className="inline-block bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-md transition-colors"
                >
                  Ver Todo el Catálogo
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((product) => {
                const mainImg = product.images[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";
                const hoverImg = product.images[1]?.url || mainImg;
                const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.basePrice);
                const discountPercent = hasDiscount
                  ? Math.round(
                      ((Number(product.compareAtPrice) - Number(product.basePrice)) /
                        Number(product.compareAtPrice)) *
                        100
                    )
                  : null;

                return (
                  <div key={product.id} className="group flex flex-col space-y-2.5">
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
                        alt={`${product.name} vista`}
                        fill
                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {product.isFeatured && (
                          <span className="badge-gold text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shadow-sm">
                            Destacado
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="badge-terracotta text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
                            {discountPercent ? `-${discountPercent}%` : "Oferta"}
                          </span>
                        )}
                      </div>
                    </Link>

                    <div>
                      <h3 className="font-serif-title text-sm sm:text-base text-[#1c1917] group-hover:text-[#b6a450] transition-colors line-clamp-1">
                        <Link href={`/producto/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        {product.shortDescription || "Telas orgánicas colombianas"}
                      </p>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-xs sm:text-sm font-semibold ${hasDiscount ? "text-[#9c6361]" : "text-[#1c1917]"}`}>
                          ${Number(product.basePrice).toLocaleString("es-CO")} COP
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-stone-400 line-through">
                            ${Number(product.compareAtPrice).toLocaleString("es-CO")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
