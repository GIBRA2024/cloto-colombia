import React from "react";

export default function AdminProductsLoading() {
  return (
    <div className="space-y-6 max-w-6xl font-sans-ui">
      {/* Cabecera y Botón Nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="space-y-1.5">
          <div className="h-8 w-60 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-80 rounded skeleton-shimmer" />
        </div>
        <div className="h-10 w-44 rounded-xl skeleton-shimmer" />
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 flex-1 rounded-xl skeleton-shimmer" />
        <div className="h-10 w-44 rounded-xl skeleton-shimmer" />
      </div>

      {/* Tabla Skeleton */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-stone-100 last:border-none">
            <div className="w-14 h-16 rounded-lg skeleton-shimmer shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-48 rounded skeleton-shimmer" />
              <div className="h-3 w-32 rounded skeleton-shimmer" />
            </div>
            <div className="h-5 w-24 rounded skeleton-shimmer" />
            <div className="h-6 w-16 rounded-full skeleton-shimmer" />
            <div className="h-8 w-20 rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
