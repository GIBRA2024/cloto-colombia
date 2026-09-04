import React from "react";

export function ColombiaFlag({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={`rounded-full overflow-hidden shrink-0 inline-block ring-1 ring-black/10 shadow-xs ${className}`}
      viewBox="0 0 32 32"
      aria-label="Bandera de Colombia"
      role="img"
    >
      <rect width="32" height="16" fill="#FCD116" />
      <rect y="16" width="32" height="8" fill="#003893" />
      <rect y="24" width="32" height="8" fill="#CE1126" />
    </svg>
  );
}

export function ButterflyIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Cuerpo central estilizado */}
      <path d="M12 5v14" />
      <path d="M10.5 4a1.5 1.5 0 0 1 3 0" />
      {/* Alas superiores elegantes */}
      <path d="M12 7.5C9 3 4 3 3 6.5s2 8.5 9 8.5" />
      <path d="M12 7.5C15 3 20 3 21 6.5s-2 8.5-9 8.5" />
      {/* Alas inferiores */}
      <path d="M12 14c-4 0-7 2.5-6.5 5.5s4 1 6.5-2.5" />
      <path d="M12 14c4 0 7 2.5 6.5 5.5s-4 1-6.5-2.5" />
    </svg>
  );
}
