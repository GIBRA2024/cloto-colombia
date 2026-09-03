import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 max-w-6xl font-sans-ui">
      {/* Cabecera Skeleton */}
      <div className="border-b border-stone-200 pb-4 space-y-2">
        <div className="h-8 w-64 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-96 rounded skeleton-shimmer" />
      </div>

      {/* 4 Tarjetas de Métricas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <div className="h-3 w-28 rounded skeleton-shimmer" />
            <div className="h-7 w-36 rounded-lg skeleton-shimmer" />
            <div className="h-3 w-24 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* 2 Tablas de Alertas & Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="h-5 w-48 rounded skeleton-shimmer" />
              <div className="h-4 w-16 rounded skeleton-shimmer" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((row) => (
                <div key={row} className="flex justify-between items-center py-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                    <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                  </div>
                  <div className="h-6 w-20 rounded-full skeleton-shimmer" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
