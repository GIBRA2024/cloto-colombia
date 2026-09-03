import React from "react";

export default function CatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans-ui space-y-8">
      {/* Cabecera Skeleton */}
      <div className="border-b border-[#dfd8cb] pb-6 space-y-2">
        <div className="h-3 w-32 rounded skeleton-shimmer" />
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="h-9 w-64 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-28 rounded skeleton-shimmer" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <aside className="space-y-6 lg:border-r lg:border-[#dfd8cb] lg:pr-6">
          {/* Bloque 1: Líneas */}
          <div className="space-y-3">
            <div className="h-4 w-36 rounded skeleton-shimmer" />
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-full rounded skeleton-shimmer" />
              <div className="h-3.5 w-4/5 rounded skeleton-shimmer" />
              <div className="h-3.5 w-3/4 rounded skeleton-shimmer" />
              <div className="h-3.5 w-5/6 rounded skeleton-shimmer" />
            </div>
          </div>

          {/* Bloque 2: Estilos */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="h-4 w-40 rounded skeleton-shimmer" />
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-3/4 rounded skeleton-shimmer" />
              <div className="h-3.5 w-2/3 rounded skeleton-shimmer" />
              <div className="h-3.5 w-4/5 rounded skeleton-shimmer" />
            </div>
          </div>

          {/* Bloque 3: Tallas */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="h-4 w-20 rounded skeleton-shimmer" />
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 rounded skeleton-shimmer" />
              ))}
            </div>
          </div>
        </aside>

        {/* Grilla de Productos Skeleton */}
        <main className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-2.5">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden skeleton-shimmer" />
                <div className="space-y-1.5 pt-1">
                  <div className="h-4 w-4/5 rounded skeleton-shimmer" />
                  <div className="h-3 w-3/5 rounded skeleton-shimmer" />
                  <div className="h-4 w-24 rounded skeleton-shimmer pt-1" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
