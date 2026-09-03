import React from "react";

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 font-sans-ui">
      <div className="text-center space-y-5 max-w-sm w-full">
        {/* Monograma / Logo Pulsante */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#dfd8cb] border-t-[#b6a450] animate-spin" />
          <span className="absolute font-serif-title text-xl font-bold tracking-widest text-[#1c1917]">
            C
          </span>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif-title text-2xl tracking-[0.25em] text-[#1c1917] uppercase">
            CLOTO
          </h2>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8d9773] font-semibold">
            Moda Consciente Colombia
          </p>
        </div>

        {/* Barra de progreso shimmer */}
        <div className="w-48 mx-auto h-1 rounded-full overflow-hidden bg-[#dfd8cb]/60">
          <div className="h-full w-full skeleton-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}
