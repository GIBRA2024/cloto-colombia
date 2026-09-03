"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { updateVariantStock, batchUpdateVariantStock } from "@/actions/inventory";

type InventoryItem = {
  id: string; // variantId
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl?: string;
  sku: string;
  variantName: string;
  size?: string | null;
  color?: string | null;
  price: number;
  stock: number;
};

export function InventoryManagerClient({ initialVariants }: { initialVariants: InventoryItem[] }) {
  const [variants, setVariants] = useState(initialVariants);
  const [search, setSearch] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingChanges, setPendingChanges] = useState<{ [variantId: string]: number }>({});
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const filteredVariants = variants.filter((v) => {
    const matchesSearch =
      v.productName.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      (v.color && v.color.toLowerCase().includes(search.toLowerCase())) ||
      (v.size && v.size.toLowerCase().includes(search.toLowerCase()));

    const currentStock = pendingChanges[v.id] !== undefined ? pendingChanges[v.id] : v.stock;
    const matchesStockFilter = onlyLowStock ? currentStock <= 5 : true;

    return matchesSearch && matchesStockFilter;
  });

  const handleStockChange = (variantId: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    setPendingChanges((prev) => ({
      ...prev,
      [variantId]: validStock,
    }));
  };

  const handleResetSingle = (variantId: string) => {
    setPendingChanges((prev) => {
      const copy = { ...prev };
      delete copy[variantId];
      return copy;
    });
  };

  const handleSaveSingle = (variantId: string) => {
    const newStock = pendingChanges[variantId];
    if (newStock === undefined) return;

    startTransition(async () => {
      await updateVariantStock(variantId, newStock);
      setVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, stock: newStock } : v))
      );
      setPendingChanges((prev) => {
        const updated = { ...prev };
        delete updated[variantId];
        return updated;
      });
      setFeedbackMsg("Stock actualizado correctamente.");
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleSaveAllBatch = () => {
    const updates = Object.entries(pendingChanges).map(([variantId, stock]) => ({
      variantId,
      stock,
    }));

    if (updates.length === 0) return;

    startTransition(async () => {
      await batchUpdateVariantStock(updates);
      setVariants((prev) =>
        prev.map((v) => (pendingChanges[v.id] !== undefined ? { ...v, stock: pendingChanges[v.id] } : v))
      );
      setPendingChanges({});
      setFeedbackMsg("¡Todos los cambios de stock fueron guardados con éxito!");
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="space-y-6 text-xs font-sans-ui">
      {/* Barra de Filtros y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por SKU, prenda, color o talla..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-stone-300 rounded-lg px-4 py-2 text-xs w-72 focus:outline-none focus:border-[#b6a450] shadow-sm"
          />

          <button
            type="button"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-colors border text-xs ${
              onlyLowStock
                ? "bg-rose-50 text-rose-700 border-rose-300 shadow-sm"
                : "bg-white text-stone-700 border-stone-300 hover:border-stone-400 shadow-sm"
            }`}
          >
            <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>Solo Stock Bajo (&le; 5)</span>
          </button>
        </div>

        {hasPendingChanges && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleSaveAllBatch}
            className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-[#b6a450] hover:text-stone-950 text-[#f2f1e7] font-semibold px-5 py-2 rounded-lg transition-all shadow-md disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>{isPending ? "Guardando..." : `Guardar Todos (${Object.keys(pendingChanges).length})`}</span>
          </button>
        )}
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-[#f0f3eb] border border-[#b2bc98] text-[#5c6643] rounded-lg font-medium flex items-center gap-2 shadow-sm animate-fadeIn">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-stone-500 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Prenda / Producto</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Talla</th>
                <th className="py-3.5 px-4">Color</th>
                <th className="py-3.5 px-4">Precio (COP)</th>
                <th className="py-3.5 px-4 text-center">Stock Actual</th>
                <th className="py-3.5 px-4 text-center">Ajuste Rápido</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No se encontraron variantes de inventario para este filtro.
                  </td>
                </tr>
              ) : (
                filteredVariants.map((v) => {
                  const currentStock = pendingChanges[v.id] !== undefined ? pendingChanges[v.id] : v.stock;
                  const isModified = pendingChanges[v.id] !== undefined;
                  const isLow = currentStock <= 5;

                  return (
                    <tr key={v.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Producto */}
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                          <Image
                            src={v.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80"}
                            alt={v.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-serif-title text-sm text-stone-900 font-medium block">
                            {v.productName}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {v.variantName !== "Default" ? v.variantName : "Estándar"}
                          </span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-stone-600">
                        {v.sku}
                      </td>

                      {/* Talla */}
                      <td className="py-3 px-4 font-semibold text-stone-800">
                        {v.size || "—"}
                      </td>

                      {/* Color */}
                      <td className="py-3 px-4 text-stone-600">
                        {v.color || "—"}
                      </td>

                      {/* Precio */}
                      <td className="py-3 px-4 text-stone-900 font-semibold whitespace-nowrap">
                        ${v.price.toLocaleString("es-CO")}
                      </td>

                      {/* Badge Stock Actual (Diseño elegante sin cortes ni saltos de línea) */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex justify-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shadow-xs ${
                              currentStock === 0
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : isLow
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                currentStock === 0
                                  ? "bg-rose-500"
                                  : isLow
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            <span>{currentStock}</span>
                            <span className="text-[10px] font-normal text-stone-500">
                              {currentStock === 1 ? "unidad" : "unidades"}
                            </span>
                          </span>
                        </div>
                      </td>

                      {/* Stepper de Ajuste Rápido */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center border border-stone-200 rounded-lg bg-white shadow-xs overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleStockChange(v.id, currentStock - 1)}
                            className="w-8 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors font-semibold text-xs"
                            title="Disminuir stock"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={currentStock}
                            onChange={(e) => handleStockChange(v.id, Number(e.target.value))}
                            className="w-12 text-center bg-stone-50 border-x border-stone-200 py-1 text-xs font-bold text-stone-800 focus:outline-none focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleStockChange(v.id, currentStock + 1)}
                            className="w-8 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors font-semibold text-xs"
                            title="Aumentar stock"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Columna Acción: Siempre muestra opciones claras */}
                      <td className="py-3 px-4 text-right">
                        {isModified ? (
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleSaveSingle(v.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#b6a450] hover:bg-[#a39242] text-stone-950 font-bold rounded-lg text-xs transition-all shadow-sm"
                              title="Guardar nuevo stock"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              <span>{isPending ? "..." : "Guardar"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetSingle(v.id)}
                              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                              title="Deshacer cambio"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-end gap-2 text-stone-400">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400">
                              <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Al día
                            </span>
                            <Link
                              href={`/admin/productos/${v.productId}/editar`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-stone-600 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
                              title="Editar ficha del producto"
                            >
                              <svg className="w-3 h-3 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                              <span>Editar</span>
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
