"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { WishlistButton } from "@/components/ui/WishlistButton";
import {
  Leaf,
  Search,
  Ruler,
  XCircle,
  AlertTriangle,
  CheckCircle,
  Check,
  Layers,
  Sparkles,
  Gift,
  X,
  ChevronDown,
  Star,
} from "lucide-react";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import type { ProductReviewsData } from "@/actions/reviews";

type ProductImage = {
  id: string;
  url: string;
  altText?: string | null;
  orderIndex: number;
  variantId?: string | null;
};

type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  price: number | any;
  compareAtPrice?: number | any | null;
  stock: number;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  material?: string | null;
};

type ProductData = {
  id: string;
  name: string;
  slug: string;
  isHomeProduct?: boolean;
  shortDescription?: string | null;
  description: string;
  basePrice: number | any;
  compareAtPrice?: number | any | null;
  images: ProductImage[];
  variants: ProductVariant[];
  relatedProducts: {
    id: string;
    name: string;
    slug: string;
    basePrice: number | any;
    compareAtPrice?: number | any | null;
    images: { url: string }[];
  }[];
};

export function ProductDetailClient({
  product,
  reviewsData,
}: {
  product: ProductData;
  reviewsData?: ProductReviewsData;
}) {
  const router = useRouter();
  const { addItem, openCart } = useCart();

  // Imágenes
  const images = product.images.length > 0
    ? product.images
    : [{ id: "def", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80", orderIndex: 0 }];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("composicion");

  // Estado para el Carrusel en Pantalla Completa (Lightbox)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index?: number) => {
    setLightboxIndex(index !== undefined ? index : activeImageIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Manejar eventos de teclado y bloqueo de scroll en el Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, nextLightboxImage, prevLightboxImage]);


  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  // Extraer colores y tallas únicos
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter(Boolean))
  );
  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean))
  );

  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const isLowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5;

  const currentPrice = Number(selectedVariant?.price || product.basePrice);
  const currentCompareAtPrice = selectedVariant?.compareAtPrice
    ? Number(selectedVariant.compareAtPrice)
    : product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;

  const hasDiscount = currentCompareAtPrice && currentCompareAtPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((currentCompareAtPrice - currentPrice) / currentCompareAtPrice) * 100)
    : null;

  // Manejar selección de color
  const handleColorSelect = (colorName: string) => {
    const matchingVariant = product.variants.find(
      (v) => v.color === colorName && (selectedVariant?.size ? v.size === selectedVariant.size : true)
    ) || product.variants.find((v) => v.color === colorName);

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
      // Cambiar imagen si hay una vinculada
      const matchingImgIdx = images.findIndex((img) => img.variantId === matchingVariant.id);
      if (matchingImgIdx > -1) {
        setActiveImageIndex(matchingImgIdx);
      }
    }
  };

  // Manejar selección de talla
  const handleSizeSelect = (sizeName: string) => {
    const matchingVariant = product.variants.find(
      (v) => v.size === sizeName && (selectedVariant?.color ? v.color === selectedVariant.color : true)
    ) || product.variants.find((v) => v.size === sizeName);

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    addItem(
      {
        id: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
        sku: selectedVariant.sku,
        price: currentPrice,
        compareAtPrice: currentCompareAtPrice,
        size: selectedVariant.size,
        color: selectedVariant.color,
        colorHex: selectedVariant.colorHex,
        imageUrl: images[activeImageIndex]?.url || images[0]?.url,
        stock: selectedVariant.stock,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    if (!selectedVariant || isOutOfStock) return;
    handleAddToCart();
    router.push("/checkout");
  };

  // Enlace WhatsApp con mensaje personalizado
  const whatsappUrl = getWhatsAppLink(
    `¡Hola Cloto! Me interesa ${product.isHomeProduct ? "el producto de hogar" : "la prenda"} "${product.name}"${
      selectedVariant?.color ? ` en color ${selectedVariant.color}` : ""
    }${selectedVariant?.size ? ` (${product.isHomeProduct ? "medida" : "talla"} ${selectedVariant.size})` : ""}. ¿Podrían asesorarme con la disponibilidad y detalles?`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans-ui space-y-16">
      {/* 1. MÓDULO PRINCIPAL DE PRODUCTO: FOTOS COMPACTAS + INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* GALERÍA DE IMÁGENES (5 Columnas en Desktop: Más compacta, centrada y fija) */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-3.5 lg:sticky lg:top-24 self-start items-start justify-center lg:justify-start">
          {/* Miniaturas de Fotos */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[460px] pb-1 sm:pb-0 shrink-0">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-stone-100 ${
                  activeImageIndex === idx
                    ? "border-[#b6a450] shadow-sm scale-105"
                    : "border-[#dfd8cb] hover:border-stone-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${product.name} miniatura ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Imagen Principal (Aspect Ratio fijo 3:4, clic para abrir Lightbox) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => openLightbox(activeImageIndex)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openLightbox(activeImageIndex);
            }}
            title="Toca para ampliar foto"
            className="group relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-md border border-[#dfd8cb]/60 shrink-0 cursor-zoom-in"
          >
            <Image
              src={images[activeImageIndex]?.url || images[0].url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 420px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges Flotantes */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
              <span className="badge-olive text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shadow-sm inline-flex items-center gap-1">
                <Leaf className="w-3 h-3 text-[#5c6643]" />
                <span>Fibras Orgánicas & Eco</span>
              </span>
              {hasDiscount && (
                <span className="badge-terracotta text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
                  {discountPercent ? `-${discountPercent}%` : "OFERTA"}
                </span>
              )}
            </div>

            {/* Botón Favoritos Flotante */}
            <div className="absolute top-3 right-3 z-10">
              <WishlistButton
                productId={product.id}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110"
                iconClassName="w-5 h-5"
              />
            </div>

            {/* Botón flotante 'Ampliar' */}
            <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              <Search className="w-3 h-3" />
              <span>Ampliar</span>
            </div>
          </div>
        </div>


        {/* DETALLES DE COMPRA Y VARIANTES (7 Columnas en Desktop: Más espacio para lectura y acordeones) */}
        <div className="lg:col-span-7 space-y-6">

          <div className="space-y-2 border-b border-[#dfd8cb] pb-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-bold">
              Cloto Sustainable Lifestyle • Colección Oficial
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917] leading-tight">
              {product.name}
            </h1>
            <p className="font-serif-body text-xs text-stone-600">
              {product.shortDescription || "Prenda atemporal confeccionada con telas orgánicas colombianas."}
            </p>

            {/* Calificación y Enlace a Reseñas */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(reviewsData?.averageRating ?? 5)
                        ? "fill-[#b6a450] text-[#b6a450]"
                        : "text-stone-300"
                    }`}
                  />
                ))}
              </div>
              <a
                href="#resenas"
                className="text-xs text-stone-500 hover:text-[#b6a450] font-medium transition-colors"
              >
                {reviewsData?.totalReviews && reviewsData.totalReviews > 0
                  ? `${reviewsData.averageRating.toFixed(1)} (${reviewsData.totalReviews} ${
                      reviewsData.totalReviews === 1 ? "opinión" : "opiniones"
                    })`
                  : "Sé la primera en opinar"}
              </a>
            </div>

            {/* Precios */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#1c1917]">
                ${currentPrice.toLocaleString("es-CO")} COP
              </span>
              {hasDiscount && (
                <span className="text-sm text-stone-400 line-through">
                  ${currentCompareAtPrice.toLocaleString("es-CO")}
                </span>
              )}
            </div>
          </div>

          {/* Selector de Colores */}
          {availableColors.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
                Color: <span className="font-normal text-stone-600">{selectedVariant?.color || "Seleccionar"}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((col) => {
                  const isSelected = selectedVariant?.color === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => handleColorSelect(col!)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm scale-105"
                          : "bg-white text-stone-800 border-[#dfd8cb] hover:border-[#b6a450]"
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de Tallas o Medidas */}
          {availableSizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
                  {product.isHomeProduct ? "Medida / Formato:" : "Talla:"}{" "}
                  <span className="font-normal text-stone-600">{selectedVariant?.size || "Seleccionar"}</span>
                </label>
                {!product.isHomeProduct && (
                  <button
                    type="button"
                    onClick={() => setActiveAccordion("guia-tallas")}
                    className="text-[11px] text-[#b6a450] hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Guía de tallas</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((sz) => {
                  const isSelected = selectedVariant?.size === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeSelect(sz!)}
                      className={`text-xs py-2 rounded-lg border font-medium transition-all ${
                        isSelected
                          ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm scale-105"
                          : "bg-white text-stone-800 border-[#dfd8cb] hover:border-[#b6a450]"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alerta de Disponibilidad & Stock */}
          <div className="text-xs">
            {isOutOfStock ? (
              <p className="text-[#834442] font-semibold flex items-center gap-1.5">
                <XCircle className="w-4 h-4 shrink-0 text-[#834442]" />
                <span>{product.isHomeProduct ? "Producto agotado en esta opción" : "Prenda agotada en esta talla/color"}</span>
              </p>
            ) : isLowStock ? (
              <p className="text-[#8c7b30] font-semibold flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#8c7b30]" />
                <span>¡Solo quedan {selectedVariant?.stock} unidades disponibles!</span>
              </p>
            ) : (
              <p className="text-[#5c6643] font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 shrink-0 text-[#5c6643]" />
                <span>Disponible para despacho inmediato en Colombia</span>
              </p>
            )}
          </div>

          {/* Cantidad y Botones de Compra */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#dfd8cb] rounded-lg bg-white px-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-10 flex items-center justify-center text-stone-600 hover:text-black font-semibold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))
                  }
                  className="w-8 h-10 flex items-center justify-center text-stone-600 hover:text-black font-semibold"
                >
                  +
                </button>
              </div>

              {/* Botón Añadir al Carrito */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-widest font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none"
              >
                {isOutOfStock ? "Agotado" : "Añadir al Carrito"}
              </button>
            </div>

            {/* Botón Comprar Ahora */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="w-full bg-[#b6a450] hover:bg-[#a39243] text-stone-950 text-xs uppercase tracking-widest font-bold py-3.5 rounded-lg transition-all duration-200 shadow-md disabled:opacity-40 disabled:pointer-events-none"
            >
              Comprar Ahora &rarr;
            </button>

            {/* Botón Guardar en Favoritos */}
            <WishlistButton
              productId={product.id}
              showText={true}
              activeLabel="En tus Favoritos (Toca para quitar)"
              inactiveLabel="Guardar en mi Lista de Deseos"
              className="w-full py-3 px-4 rounded-lg border border-[#dfd8cb] bg-white hover:bg-stone-50 text-stone-700 shadow-sm text-xs font-semibold"
              iconClassName="w-4 h-4"
            />
          </div>

          {/* BOTÓN ASESORÍA PERSONALIZADA WHATSAPP */}
          <div className="p-4 bg-white rounded-xl border border-[#dfd8cb] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1c1917]">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.818-.818 5.97 5.97 0 011.057-3.035C4.607 15.65 4 13.91 4 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span>{product.isHomeProduct ? "¿Dudas con las medidas, telas o decoración?" : "¿Tienes dudas con tu talla, tela o ajuste?"}</span>
            </div>
            <p className="text-[11px] text-stone-500 font-serif-body">
              {product.isHomeProduct
                ? "Escríbenos directamente por WhatsApp para coordinar medidas especiales de mesa, cama o asesoría de espacios."
                : "Habla directamente con nuestra asesora de imagen por WhatsApp para una atención personalizada."}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white text-xs font-semibold transition-colors border border-[#25D366]/30"
            >
              <span>Consultar por WhatsApp</span> &rarr;
            </a>
          </div>

          {/* ACORDEONES EDITORIALES (Telas, Guía de Tallas / Dimensiones, Cuidados, Empaque) */}
          <div className="border-t border-[#dfd8cb] pt-4 space-y-2">
            {/* Acordeón 1: Composición & Fibras */}
            <div className="border border-[#dfd8cb] rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setActiveAccordion(activeAccordion === "composicion" ? null : "composicion")
                }
                className="w-full px-4 py-3 text-left flex justify-between items-center text-xs font-semibold text-[#1c1917]"
              >
                <span className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#8d9773]" />
                  <span>{product.isHomeProduct ? "Materiales & Confección de Hogar" : "Composición & Fibras Orgánicas"}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                    activeAccordion === "composicion" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeAccordion === "composicion" && (
                <div className="px-4 pb-4 text-xs font-serif-body text-stone-600 space-y-2 border-t border-stone-100 pt-2">
                  <p>
                    {product.description}
                  </p>
                  <div className="text-[11px] text-[#8d9773] font-sans-ui font-medium space-y-1 pt-1 border-t border-stone-100">
                    <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#8d9773] shrink-0" /> Confeccionado con materiales seleccionados de alta nobleza y durabilidad.</p>
                    <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#8d9773] shrink-0" /> 100% Hecho en talleres éticos de Colombia con conciencia ambiental.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Acordeón 2: Guía de Tallas para Ropa vs Dimensiones para Hogar */}
            {product.isHomeProduct ? (
              <div className="border border-[#dfd8cb] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === "dimensiones" ? null : "dimensiones")
                  }
                  className="w-full px-4 py-3 text-left flex justify-between items-center text-xs font-semibold text-[#1c1917]"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#8d9773]" />
                    <span>Dimensiones & Especificaciones</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                      activeAccordion === "dimensiones" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "dimensiones" && (
                  <div className="px-4 pb-4 text-xs font-serif-body text-stone-600 space-y-2 border-t border-stone-100 pt-2 font-sans-ui">
                    <p>
                      Pieza diseñada exclusivamente para la colección de hogar <strong>Cloto Home (Habitar)</strong>. Creada con materiales de alta durabilidad, texturas nobles y confección artesanal para embellecer tus espacios cotidianos.
                    </p>
                    {availableSizes.length > 0 && (
                      <div className="mt-2 p-2.5 bg-stone-50 rounded border border-stone-200">
                        <span className="font-semibold text-stone-900 block mb-1">Medidas / Formatos disponibles:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {availableSizes.map((sz) => (
                            <span key={sz} className="px-2 py-0.5 bg-white border border-stone-300 rounded text-[11px] text-stone-700">
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-[11px] text-stone-500 pt-1">
                      ¿Necesitas medidas personalizadas para tu mesa, cama o espacio? Puedes consultarnos directamente por WhatsApp.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-[#dfd8cb] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === "guia-tallas" ? null : "guia-tallas")
                  }
                  className="w-full px-4 py-3 text-left flex justify-between items-center text-xs font-semibold text-[#1c1917]"
                >
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#8d9773]" />
                    <span>Guía de Medidas (cm)</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                      activeAccordion === "guia-tallas" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "guia-tallas" && (
                  <div className="px-4 pb-4 text-xs text-stone-600 space-y-2 border-t border-stone-100 pt-2 font-sans-ui">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-900 font-semibold">
                          <th className="py-1">Talla</th>
                          <th className="py-1">Busto (cm)</th>
                          <th className="py-1">Cintura (cm)</th>
                          <th className="py-1">Cadera (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        <tr><td className="py-1 font-bold">XS</td><td>82-86</td><td>62-66</td><td>88-92</td></tr>
                        <tr><td className="py-1 font-bold">S</td><td>86-90</td><td>66-70</td><td>92-96</td></tr>
                        <tr><td className="py-1 font-bold">M</td><td>90-96</td><td>70-76</td><td>96-102</td></tr>
                        <tr><td className="py-1 font-bold">L</td><td>96-102</td><td>76-82</td><td>102-108</td></tr>
                        <tr><td className="py-1 font-bold">XL</td><td>102-108</td><td>82-88</td><td>108-114</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Acordeón 3: Cuidados & Lavado */}
            <div className="border border-[#dfd8cb] rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setActiveAccordion(activeAccordion === "cuidados" ? null : "cuidados")
                }
                className="w-full px-4 py-3 text-left flex justify-between items-center text-xs font-semibold text-[#1c1917]"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8d9773]" />
                  <span>{product.isHomeProduct ? "Cuidados & Mantenimiento de Hogar" : "Cuidados de la Prenda"}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                    activeAccordion === "cuidados" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeAccordion === "cuidados" && (
                <div className="px-4 pb-4 text-xs font-serif-body text-stone-600 space-y-1.5 border-t border-stone-100 pt-2">
                  {product.isHomeProduct ? (
                    <>
                      <p>• Lavar a mano o en ciclo suave de lavadora con agua fría.</p>
                      <p>• Usar jabón neutro libre de cloro o agentes blanqueadores abrasivos.</p>
                      <p>• Secar a la sombra para preservar la viveza de las fibras y colores.</p>
                      <p>• Planchado a temperatura moderada si el textil lo requiere.</p>
                    </>
                  ) : (
                    <>
                      <p>• Lavar a mano con agua fría o en ciclo delicado dentro de una bolsa de lavado.</p>
                      <p>• Usar jabón suave sin blanqueadores abrasivos.</p>
                      <p>• Secar a la sombra sobre superficie plana para preservar la suavidad de las fibras.</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Acordeón 4: Empaque & Despachos */}
            <div className="border border-[#dfd8cb] rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setActiveAccordion(activeAccordion === "empaque" ? null : "empaque")
                }
                className="w-full px-4 py-3 text-left flex justify-between items-center text-xs font-semibold text-[#1c1917]"
              >
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#8d9773]" />
                  <span>Experiencia de Empaque & Envíos</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                    activeAccordion === "empaque" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeAccordion === "empaque" && (
                <div className="px-4 pb-4 text-xs font-serif-body text-stone-600 space-y-2 border-t border-stone-100 pt-2">
                  {!product.isHomeProduct && (
                    <div className="bg-[#f2f1e7] p-2.5 rounded border border-[#dfd8cb] text-[11px] text-[#5c6643] font-sans-ui font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#b6a450] shrink-0" />
                      <span><strong>Obsequio de Marca:</strong> Nuestras pijamas y prendas de descanso se entregan siempre acompañadas de una balaca y/o scrunchie a juego para complementar tu ritual.</span>
                    </div>
                  )}
                  <p>
                    {product.isHomeProduct
                      ? "Cada pieza de Cloto Home se empaca con protección especial, tarjeta personalizada y nuestro aroma característico, lista para ambientar tus espacios o para regalar."
                      : "Cada pedido incluye nuestro empaque de lujo con tarjeta personalizada y aroma característico de la marca, ideal para consentirte o regalar."}
                  </p>
                  <p className="font-sans-ui text-[11px] text-stone-500">
                    Despachos a toda Colombia (2 a 4 días hábiles en ciudades principales).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRODUCTOS RECOMENDADOS */}
      {product.relatedProducts.length > 0 && (
        <div className="border-t border-[#dfd8cb] pt-12 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#b6a450] font-semibold">
              Te Podría Encantar
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
              Prendas Complementarias
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel) => {
              const relImg = rel.images[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";
              return (
                <div key={rel.id} className="group space-y-2">
                  <Link
                    href={`/producto/${rel.slug}`}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 block shadow-sm"
                  >
                    <Image
                      src={relImg}
                      alt={rel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 z-10">
                      <WishlistButton
                        productId={rel.id}
                        className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110"
                      />
                    </div>
                  </Link>
                  <div>
                    <h4 className="font-serif-title text-sm text-[#1c1917] group-hover:text-[#b6a450] transition-colors line-clamp-1">
                      <Link href={`/producto/${rel.slug}`}>{rel.name}</Link>
                    </h4>
                    <span className="text-xs font-semibold text-[#1c1917]">
                      ${Number(rel.basePrice).toLocaleString("es-CO")} COP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SECCIÓN DE RESEÑAS Y OPINIONES */}
      <ProductReviewsSection
        productId={product.id}
        productName={product.name}
        initialData={
          reviewsData || {
            reviews: [],
            averageRating: 5,
            totalReviews: 0,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          }
        }
      />

      {/* MODAL LIGHTBOX / CARRUSEL EN PANTALLA COMPLETA */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6 text-white animate-fade-in select-none">

          {/* Barra Superior del Lightbox */}
          <div className="w-full flex justify-between items-center max-w-6xl">
            <div className="space-y-0.5">
              <h3 className="font-serif-title text-base sm:text-lg text-[#dfd8cb]">
                {product.name}
              </h3>
              <p className="text-xs text-stone-400">
                Foto {lightboxIndex + 1} de {images.length}
              </p>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Cerrar (Esc)"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área Central con Flechas y Foto Grande */}
          <div className="relative w-full max-w-5xl h-[65vh] sm:h-[72vh] flex items-center justify-center my-auto">
            {/* Flecha Anterior */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={prevLightboxImage}
                className="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#b6a450] text-white hover:text-stone-950 flex items-center justify-center text-xl transition-all shadow-lg border border-white/20"
                title="Foto anterior (←)"
              >
                ←
              </button>
            )}

            {/* Imagen Principal en Alta Resolución */}
            <div className="relative w-full h-full max-w-4xl max-h-[70vh]">
              <Image
                src={images[lightboxIndex]?.url || images[0].url}
                alt={`${product.name} ampliación ${lightboxIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1200px) 90vw, 1000px"
                className="object-contain"
              />
            </div>

            {/* Flecha Siguiente */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={nextLightboxImage}
                className="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#b6a450] text-white hover:text-stone-950 flex items-center justify-center text-xl transition-all shadow-lg border border-white/20"
                title="Siguiente foto (→)"
              >
                →
              </button>
            )}
          </div>

          {/* Tira de Miniaturas Inferior */}
          {images.length > 1 && (
            <div className="w-full max-w-2xl flex justify-center gap-2 overflow-x-auto py-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-stone-800 ${
                    lightboxIndex === idx
                      ? "border-[#b6a450] scale-105 shadow-md"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

