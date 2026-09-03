import React from "react";

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6 max-w-6xl font-sans-ui">
      <div className="border-b border-stone-200 pb-4 space-y-1.5">
        <div className="h-8 w-60 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-96 rounded skeleton-shimmer" />
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-24 rounded-lg skeleton-shimmer" />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-none">
            <div className="space-y-1.5">
              <div className="h-4 w-40 rounded skeleton-shimmer" />
              <div className="h-3 w-64 rounded skeleton-shimmer" />
            </div>
            <div className="h-6 w-24 rounded-full skeleton-shimmer" />
            <div className="h-5 w-28 rounded skeleton-shimmer" />
            <div className="h-8 w-20 rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
