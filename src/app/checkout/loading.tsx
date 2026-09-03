import React from "react";

export default function CheckoutLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans-ui space-y-8">
      {/* Cabecera Skeleton */}
      <div className="border-b border-[#dfd8cb] pb-4 space-y-2">
        <div className="h-3 w-36 rounded skeleton-shimmer" />
        <div className="h-9 w-64 rounded-lg skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Formulario Skeleton (Izquierda) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-5">
            <div className="h-6 w-48 rounded skeleton-shimmer" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="h-10 rounded-xl skeleton-shimmer" />
              <div className="h-10 rounded-xl skeleton-shimmer" />
            </div>
            <div className="h-10 rounded-xl skeleton-shimmer" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-10 rounded-xl skeleton-shimmer" />
              <div className="h-10 rounded-xl skeleton-shimmer" />
            </div>
            <div className="h-10 rounded-xl skeleton-shimmer" />
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-4">
            <div className="h-6 w-44 rounded skeleton-shimmer" />
            <div className="h-12 rounded-xl skeleton-shimmer" />
            <div className="h-12 rounded-xl skeleton-shimmer" />
          </div>
        </div>

        {/* Resumen de Compra Skeleton (Derecha) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-6">
            <div className="h-6 w-40 rounded skeleton-shimmer" />

            {/* Items */}
            <div className="space-y-4 pt-2 divide-y divide-stone-100">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 pt-3 first:pt-0">
                  <div className="w-16 h-20 rounded-lg skeleton-shimmer shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-4/5 rounded skeleton-shimmer" />
                    <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                    <div className="h-4 w-20 rounded skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded skeleton-shimmer" />
                <div className="h-3 w-24 rounded skeleton-shimmer" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded skeleton-shimmer" />
                <div className="h-3 w-20 rounded skeleton-shimmer" />
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-100">
                <div className="h-5 w-24 rounded skeleton-shimmer" />
                <div className="h-5 w-32 rounded skeleton-shimmer" />
              </div>
            </div>

            <div className="h-14 w-full rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
