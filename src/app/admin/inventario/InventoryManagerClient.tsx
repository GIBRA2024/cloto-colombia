"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
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
            className="bg-white border border-stone-300 rounded-lg px-4 py-2 text-xs w-72 focus:outline-none focus:border-[#b6a450]"
          />

          <button
            type="button"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors border ${
              onlyLowStock
                ? "bg-rose-100 text-rose-800 border-rose-300 shadow-sm"
                : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
            }`}
          >
            ⚠️ Solo Stock Bajo (&le; 5)
          </button>
        </div>

        {hasPendingChanges && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleSaveAllBatch}
            className="bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] font-semibold px-5 py-2 rounded-lg transition-colors shadow-md disabled:opacity-50 animate-pulse"
          >
            {isPending ? "Guardando..." : `Guardar Cambios (${Object.keys(pendingChanges).length})`}
          </button>
        )}
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-[#f0f3eb] border border-[#b2bc98] text-[#5c6643] rounded-lg font-medium flex items-center gap-2">
          <span>✓</span>
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
                  <td colSpan={8} className="py-10 text-center text-stone-400">
                    No se encontraron variantes de inventario.
                  </td>
                </tr>
              ) : (
                filteredVariants.map((v) => {
                  const currentStock = pendingChanges[v.id] !== undefined ? pendingChanges[v.id] : v.stock;
                  const isModified = pendingChanges[v.id] !== undefined;
                  const isLow = currentStock <= 5;

                  return (
                    <tr key={v.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Producto */}
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                          <Image
                            src={v.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80"}
                            alt={v.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-serif-title text-sm text-stone-900 font-medium">
                          {v.productName}
                        </span>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-stone-600">
                        {v.sku}
                      </td>

                      {/* Talla */}
                      <td className="py-3 px-4 font-semibold text-stone-800">
                        {v.size || "-"}
                      </td>

                      {/* Color */}
                      <td className="py-3 px-4 text-stone-600">
                        {v.color || "-"}
                      </td>

                      {/* Precio */}
                      <td className="py-3 px-4 text-stone-900 font-semibold">
                        ${v.price.toLocaleString("es-CO")}
                      </td>

                      {/* Badge Stock */}
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                          currentStock === 0
                            ? "bg-rose-100 text-rose-800"
                            : isLow
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {currentStock} unidades
                        </span>
                      </td>

                      {/* Stepper de Ajuste Rápido */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center border border-stone-300 rounded bg-stone-50">
                          <button
                            type="button"
                            onClick={() => handleStockChange(v.id, currentStock - 1)}
                            className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-200"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={currentStock}
                            onChange={(e) => handleStockChange(v.id, Number(e.target.value))}
                            className="w-12 text-center bg-transparent border-x border-stone-300 py-1 text-xs font-semibold focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleStockChange(v.id, currentStock + 1)}
                            className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-200"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Acción */}
                      <td className="py-3 px-4 text-right">
                        {isModified && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleSaveSingle(v.id)}
                            className="px-3 py-1 bg-[#1c1917] hover:bg-[#b6a450] text-white rounded font-semibold transition-colors shadow-sm"
                          >
                            Guardar
                          </button>
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
