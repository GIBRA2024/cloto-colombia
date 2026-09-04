"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function WishlistButton({
  productId,
  className = "",
  iconClassName = "w-4 h-4",
  showText = false,
  activeLabel = "En tus Favoritos",
  inactiveLabel = "Guardar en Favoritos",
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(productId);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    await toggleWishlist(productId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={`transition-all duration-200 flex items-center justify-center gap-2 ${className}`}
    >
      <Heart
        className={`${iconClassName} transition-all duration-200 ${
          active
            ? "fill-[#9c6361] text-[#9c6361]"
            : "text-stone-600 hover:text-[#9c6361]"
        } ${isAnimating ? "scale-125" : "scale-100"}`}
      />
      {showText && (
        <span className="text-xs font-semibold">
          {active ? activeLabel : inactiveLabel}
        </span>
      )}
    </button>
  );
}
