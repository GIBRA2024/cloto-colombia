import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans-ui space-y-16">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-16 rounded skeleton-shimmer" />
        <span className="text-stone-300">/</span>
        <div className="h-3 w-28 rounded skeleton-shimmer" />
        <span className="text-stone-300">/</span>
        <div className="h-3 w-40 rounded skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Galería Skeleton (Izquierda - 5 columnas) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden skeleton-shimmer" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-20 rounded-lg overflow-hidden skeleton-shimmer shrink-0" />
            ))}
          </div>
        </div>

        {/* Información del Producto Skeleton (Derecha - 7 columnas) */}
        <div className="lg:col-span-7 space-y-6">

          <div className="space-y-2">
            <div className="h-3 w-32 rounded skeleton-shimmer" />
            <div className="h-8 w-4/5 rounded-lg skeleton-shimmer" />
            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          </div>

          <div className="h-8 w-40 rounded-lg skeleton-shimmer" />

          {/* Selector de Color Skeleton */}
          <div className="space-y-2.5 pt-4 border-t border-stone-200">
            <div className="h-3 w-24 rounded skeleton-shimmer" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full skeleton-shimmer" />
              ))}
            </div>
          </div>

          {/* Selector de Tallas Skeleton */}
          <div className="space-y-2.5 pt-4 border-t border-stone-200">
            <div className="h-3 w-24 rounded skeleton-shimmer" />
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 rounded-lg skeleton-shimmer" />
              ))}
            </div>
          </div>

          {/* Botón de Compra Skeleton */}
          <div className="pt-4 space-y-3">
            <div className="h-14 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
          </div>

          {/* Garantías y Beneficios Skeleton */}
          <div className="space-y-3 pt-6 border-t border-stone-200">
            <div className="h-4 w-full rounded skeleton-shimmer" />
            <div className="h-4 w-5/6 rounded skeleton-shimmer" />
            <div className="h-4 w-4/5 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
