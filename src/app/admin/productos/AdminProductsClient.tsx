"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toggleProductFeatured, toggleProductPublished, deleteProduct } from "@/actions/inventory";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice?: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  imageUrl?: string;
  categoryNames: string[];
  totalStock: number;
  variantsCount: number;
};

export function AdminProductsClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryNames.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleFeatured = (productId: string, currentStatus: boolean) => {
    startTransition(async () => {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isFeatured: !currentStatus } : p))
      );
      await toggleProductFeatured(productId, currentStatus);
    });
  };

  const handleTogglePublished = (productId: string, currentStatus: boolean) => {
    startTransition(async () => {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isPublished: !currentStatus } : p))
      );
      await toggleProductPublished(productId, currentStatus);
    });
  };

  const handleDelete = (productId: string, name: string) => {
    if (confirm(`¿Estás segura de eliminar el producto "${name}"?`)) {
      startTransition(async () => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        await deleteProduct(productId);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar producto por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-4 py-2.5 text-xs max-w-sm w-full focus:outline-none focus:border-[#b6a450]"
        />

        <Link
          href="/admin/productos/nuevo"
          className="bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          + Crear Nuevo Producto
        </Link>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-stone-500 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Producto</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4 text-center">Stock Total</th>
                <th className="py-3.5 px-4 text-center">Destacado (Home)</th>
                <th className="py-3.5 px-4 text-center">Publicado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-stone-400">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                    {/* Producto + Foto */}
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        <Image
                          src={p.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <strong className="text-stone-900 font-serif-title text-sm block">
                          {p.name}
                        </strong>
                        <span className="text-[11px] text-stone-400">{p.variantsCount} variantes</span>
                      </div>
                    </td>

                    {/* Categorías */}
                    <td className="py-3 px-4 text-stone-600">
                      {p.categoryNames.join(", ") || "Sin categoría"}
                    </td>

                    {/* Precio */}
                    <td className="py-3 px-4">
                      <strong className="text-stone-900 block">
                        ${p.basePrice.toLocaleString("es-CO")}
                      </strong>
                      {p.compareAtPrice && p.compareAtPrice > p.basePrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          ${p.compareAtPrice.toLocaleString("es-CO")}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        p.totalStock <= 5 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {p.totalStock} u.
                      </span>
                    </td>

                    {/* Switch Destacado */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p.id, p.isFeatured)}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                          p.isFeatured
                            ? "bg-[#f7f3e1] text-[#8c7b30] border border-[#d4c478]"
                            : "bg-stone-100 text-stone-400 hover:text-stone-700"
                        }`}
                      >
                        {p.isFeatured ? "⭐ Destacado" : "No"}
                      </button>
                    </td>

                    {/* Switch Publicado */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(p.id, p.isPublished)}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                          p.isPublished
                            ? "bg-[#f0f3eb] text-[#5c6643] border border-[#b2bc98]"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {p.isPublished ? "Activo" : "Borrador"}
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/productos/${p.id}/editar`}
                        className="text-stone-700 hover:text-[#b6a450] font-semibold"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
