"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Sparkles, X } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const freeShippingThreshold = 200000; // $200.000 COP para envío gratis
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans-ui">
      {/* Backdrop oscuro con desenfoque */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#f2f1e7] shadow-2xl flex flex-col border-l border-[#dfd8cb]">
          {/* Cabecera del Drawer */}
          <div className="px-6 py-5 border-b border-[#dfd8cb] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h2 className="font-serif-title text-xl text-[#1c1917]">Tu Carrito</h2>
              <span className="text-xs bg-[#e9e5d9] text-[#1c1917] px-2 py-0.5 rounded-full font-medium">
                {itemCount} {itemCount === 1 ? "prenda" : "prendas"}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Barra de Envío Gratis */}
          <div className="bg-[#e9e5d9]/60 px-6 py-3 border-b border-[#dfd8cb]">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-stone-700 mb-1.5">
                Te faltan <strong>${remainingForFreeShipping.toLocaleString("es-CO")} COP</strong> para <strong>Envío Gratis</strong> en Colombia.
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-semibold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>¡Calificas para Envío Gratis a toda Colombia!</span>
              </p>
            )}
            <div className="w-full bg-[#dfd8cb] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#b6a450] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Contenido / Lista de Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#e9e5d9] flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif-title text-lg text-stone-800">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Descubre nuestras pijamas en telas orgánicas, trajes de baño y lencería de hogar.
                </p>
                <Link
                  href="/catalogo"
                  onClick={closeCart}
                  className="inline-block bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-wider font-medium px-6 py-2.5 rounded-md transition-colors"
                >
                  Explorar Catálogo
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-lg border border-[#dfd8cb] shadow-sm relative group"
                >
                  {/* Foto de la prenda */}
                  <div className="relative w-20 h-24 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image
                      src={item.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif-title text-sm text-[#1c1917] line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-0.5"
                          title="Eliminar del carrito"
                          aria-label="Eliminar del carrito"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {item.variantName || `${item.color || ""} ${item.size ? `• Talla ${item.size}` : ""}`}
                      </p>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-semibold text-[#1c1917]">
                          ${Number(item.price).toLocaleString("es-CO")} COP
                        </span>
                        {item.compareAtPrice && Number(item.compareAtPrice) > Number(item.price) && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ${Number(item.compareAtPrice).toLocaleString("es-CO")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper de cantidad */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center border border-[#dfd8cb] rounded bg-[#f2f1e7]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-stone-600 hover:bg-stone-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-stone-600 hover:bg-stone-200"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-medium text-stone-900">
                        ${(Number(item.price) * item.quantity).toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del Drawer con Totales y Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#dfd8cb] space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1c1917]">
                    ${subtotal.toLocaleString("es-CO")} COP
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Envío nacional</span>
                  <span>{subtotal >= freeShippingThreshold ? "Gratis" : "Calculado en checkout"}</span>
                </div>
              </div>

              <div className="border-t border-[#dfd8cb] pt-3 flex justify-between items-baseline">
                <span className="font-serif-title text-base text-[#1c1917]">Total Estimado</span>
                <span className="text-lg font-bold text-[#1c1917]">
                  ${subtotal.toLocaleString("es-CO")} COP
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full block text-center bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-widest font-semibold py-3.5 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Finalizar Compra &rarr;
                </Link>

                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full text-center text-xs text-stone-500 hover:text-stone-900 py-1"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
