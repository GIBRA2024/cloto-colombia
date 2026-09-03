import React from "react";

export default function AccountLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans-ui space-y-10">
      {/* Cabecera Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfd8cb] pb-6">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded skeleton-shimmer" />
          <div className="h-8 w-60 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-48 rounded skeleton-shimmer" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 rounded-lg skeleton-shimmer" />
          <div className="h-10 w-28 rounded-lg skeleton-shimmer" />
        </div>
      </div>

      {/* 3 Tarjetas de Accesos Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-[#dfd8cb] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
            <div className="h-5 w-40 rounded skeleton-shimmer" />
            <div className="h-3.5 w-full rounded skeleton-shimmer" />
            <div className="h-3.5 w-3/4 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Compras Recientes Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-[#dfd8cb] pb-4">
          <div className="h-6 w-48 rounded skeleton-shimmer" />
          <div className="h-4 w-20 rounded skeleton-shimmer" />
        </div>
        <div className="space-y-4 divide-y divide-stone-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pt-4 first:pt-0 flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-36 rounded skeleton-shimmer" />
                <div className="h-3 w-48 rounded skeleton-shimmer" />
              </div>
              <div className="h-8 w-24 rounded-lg skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
