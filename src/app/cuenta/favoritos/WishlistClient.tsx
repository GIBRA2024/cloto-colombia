"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getProductsByIdsAction } from "@/actions/wishlist";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  mainImage: string;
  variants: {
    id: string;
    name: string;
    price: number;
    stock: number;
    size?: string | null;
    color?: string | null;
  }[];
  addedAt: string;
};

export function WishlistClient({ initialProducts = [] }: { initialProducts?: WishlistProduct[] }) {
  const { wishlistIds, toggleWishlist, isLoaded } = useWishlist();
  const { addItem, openCart } = useCart();
  const [products, setProducts] = useState<WishlistProduct[]>(initialProducts);
  const [loading, setLoading] = useState(!initialProducts.length && wishlistIds.length > 0);

  useEffect(() => {
    if (!isLoaded) return;

    // Si ya tenemos productos iniciales y coinciden con los IDs, no volvemos a consultar
    if (initialProducts.length > 0 && initialProducts.length === wishlistIds.length) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }

    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // Consultar productos por IDs de la wishlist (útil para visitantes y cambios en cliente)
    (async () => {
      setLoading(true);
      try {
        const fetched = await getProductsByIdsAction(wishlistIds);
        setProducts(fetched);
      } catch (err) {
        console.error("Error al cargar productos de favoritos:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [wishlistIds, isLoaded, initialProducts]);

  const handleRemove = async (id: string) => {
    await toggleWishlist(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleQuickAdd = (product: WishlistProduct) => {
    const firstVariant = product.variants[0];
    if (!firstVariant) return;

    addItem({
      id: firstVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: firstVariant.id,
      variantName: firstVariant.name,
      sku: `${product.slug}-${firstVariant.size || "std"}`,
      price: firstVariant.price,
      compareAtPrice: product.compareAtPrice,
      size: firstVariant.size,
      color: firstVariant.color,
      imageUrl: product.mainImage,
      stock: firstVariant.stock,
    });

    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans-ui space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/cuenta" className="hover:underline">
          Mi Cuenta
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">Favoritos</span>
      </div>

      {/* Cabecera Editorial */}
      <div className="border-b border-[#dfd8cb] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-semibold">
            Tu Selección Personal
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917]">
            Mis Prendas Favoritas
          </h1>
          <p className="font-serif-body text-xs text-stone-600 max-w-xl">
            Prendas de descanso, lencería de cama y trajes de baño que has guardado para tu próximo pedido o ritual personal.
          </p>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          {products.length} {products.length === 1 ? "artículo guardado" : "artículos guardados"}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse py-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-stone-200 rounded-xl" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Estado Vacío */
        <div className="text-center py-20 bg-white rounded-2xl border border-[#dfd8cb] space-y-5 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#f2f1e7] flex items-center justify-center text-[#9c6361]">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2 px-4">
            <h3 className="font-serif-title text-xl text-[#1c1917]">
              Aún no tienes prendas guardadas
            </h3>
            <p className="font-serif-body text-xs text-stone-500 max-w-sm mx-auto">
              Explora nuestras colecciones sostenibles y toca el icono de corazón en las piezas que más te enamoren.
            </p>
          </div>
          <div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Grilla de Favoritos */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const hasDiscount =
              product.compareAtPrice && product.compareAtPrice > product.basePrice;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between bg-white rounded-xl border border-[#dfd8cb] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Foto de Producto */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <Link href={`/producto/${product.slug}`}>
                      <Image
                        src={product.mainImage || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Botón Eliminar Rápido */}
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id)}
                      title="Eliminar de favoritos"
                      aria-label="Eliminar de favoritos"
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-stone-500 hover:text-red-600 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Badge de Oferta */}
                    {hasDiscount && (
                      <span className="absolute top-2.5 left-2.5 badge-terracotta text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
                        Oferta
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5 space-y-1.5">
                    <h3 className="font-serif-title text-sm text-[#1c1917] group-hover:text-[#b6a450] transition-colors line-clamp-1">
                      <Link href={`/producto/${product.slug}`}>{product.name}</Link>
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-[#1c1917]">
                        ${product.basePrice.toLocaleString("es-CO")} COP
                      </span>
                      {hasDiscount && product.compareAtPrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          ${product.compareAtPrice.toLocaleString("es-CO")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="p-3.5 pt-0 flex flex-col gap-1.5">
                  {product.variants.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-[11px] uppercase tracking-wider font-semibold py-2 px-3 rounded-lg transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Mover al Carrito</span>
                    </button>
                  ) : (
                    <Link
                      href={`/producto/${product.slug}`}
                      className="w-full text-center bg-[#f2f1e7] hover:bg-[#dfd8cb] text-stone-800 text-[11px] uppercase tracking-wider font-semibold py-2 px-3 rounded-lg transition-colors"
                    >
                      Ver Prenda
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
