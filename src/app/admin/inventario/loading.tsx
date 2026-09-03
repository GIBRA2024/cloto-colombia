import React from "react";

export default function AdminInventoryLoading() {
  return (
    <div className="space-y-6 max-w-6xl font-sans-ui">
      <div className="border-b border-stone-200 pb-4 space-y-1.5">
        <div className="h-8 w-64 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-96 rounded skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
            <div className="h-3 w-28 rounded skeleton-shimmer" />
            <div className="h-6 w-20 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-none">
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-52 rounded skeleton-shimmer" />
              <div className="h-3 w-36 rounded skeleton-shimmer" />
            </div>
            <div className="h-8 w-24 rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
