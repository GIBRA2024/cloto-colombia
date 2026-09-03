"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/actions/inventory";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

type ProductFormClientProps = {
  initialProduct?: {
    id: string;
    name: string;
    slug: string;
    shortDescription?: string | null;
    description: string;
    basePrice: number;
    compareAtPrice?: number | null;
    isPublished: boolean;
    isFeatured: boolean;
    categoryIds: string[];
    images: { url: string; altText?: string; orderIndex: number; variantId?: string | null }[];
    variants: {
      id?: string;
      sku: string;
      name: string;
      price: number;
      compareAtPrice?: number | null;
      stock: number;
      size?: string;
      color?: string;
      colorHex?: string;
      material?: string;
    }[];
  };
  categories: CategoryItem[];
};

export function ProductFormClient({ initialProduct, categories }: ProductFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [basePrice, setBasePrice] = useState(initialProduct?.basePrice || 120000);
  const [compareAtPrice, setCompareAtPrice] = useState<number | string>(
    initialProduct?.compareAtPrice || ""
  );
  const [isPublished, setIsPublished] = useState(initialProduct?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialProduct?.categoryIds || []
  );

  // Galería de Imágenes
  const [images, setImages] = useState(
    initialProduct?.images || [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        altText: "",
        orderIndex: 0,
      },
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variantes
  const [variants, setVariants] = useState(
    initialProduct?.variants || [
      {
        sku: "CLOTO-NEW-S",
        name: "Estándar / S",
        price: 120000,
        compareAtPrice: null,
        stock: 10,
        size: "S",
        color: "Natural",
        colorHex: "#f2f1e7",
        material: "100% Algodón Orgánico",
      },
    ]
  );

  // Auto slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialProduct) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  // Agregar Imagen
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages([
      ...images,
      {
        url: newImageUrl.trim(),
        altText: name || "Foto de producto",
        orderIndex: images.length,
      },
    ]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImages(updated.map((img, i) => ({ ...img, orderIndex: i })));
  };

  // Manejo de Variantes
  const handleAddVariant = () => {
    const nextSku = `CLOTO-${Math.floor(1000 + Math.random() * 9000)}`;
    setVariants([
      ...variants,
      {
        sku: nextSku,
        name: "Nueva Variante",
        price: basePrice,
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        stock: 5,
        size: "M",
        color: "Natural",
        colorHex: "#ffffff",
        material: "Algodón Orgánico",
      },
    ]);
  };

  const handleUpdateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !slug.trim()) {
      setError("El nombre y el slug son obligatorios.");
      return;
    }

    if (images.length === 0) {
      setError("Por favor agrega al menos una imagen a la galería.");
      return;
    }

    if (variants.length === 0) {
      setError("Por favor agrega al menos una variante de producto.");
      return;
    }

    startTransition(async () => {
      const res = await saveProduct({
        id: initialProduct?.id,
        name,
        slug,
        shortDescription,
        description,
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        isPublished,
        isFeatured,
        categoryIds: selectedCategoryIds,
        images,
        variants: variants.map((v) => ({
          ...v,
          price: Number(v.price),
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
          stock: Number(v.stock),
        })),
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/admin/productos");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl text-xs font-sans-ui">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h2 className="font-serif-title text-2xl text-stone-900">
            {initialProduct ? `Editar Producto: ${initialProduct.name}` : "Crear Nuevo Producto"}
          </h2>
          <p className="text-stone-500 font-serif-body">
            Configura información general, galería de fotos, promociones e inventario por talla.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/productos"
            className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            {isPending ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* BLOQUE 1: DATOS GENERALES */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-serif-title text-lg text-stone-900 border-b border-stone-100 pb-2">
          1. Información General
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Nombre del Producto *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Pijama Clásica Satín Beige..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Slug URL *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="pijama-clasica-satin-beige"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-stone-700 mb-1">Descripción Corta</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Prenda atemporal confeccionada en Colombia..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-stone-700 mb-1">Descripción Completa & Telas *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla los textiles, tacto, beneficios del corte y confección responsable..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 2: PRECIOS & PROMOCIONES & SWITCHES */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-serif-title text-lg text-stone-900 border-b border-stone-100 pb-2">
          2. Precios, Promociones y Visibilidad
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Precio Base (COP) *</label>
            <input
              type="number"
              required
              min={0}
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Precio Anterior / Tachado (Oferta)
            </label>
            <input
              type="number"
              min={0}
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : "")}
              placeholder="Opcional para mostrar % descuento"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isFeaturedSwitch"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-[#b6a450] focus:ring-[#b6a450] rounded"
            />
            <label htmlFor="isFeaturedSwitch" className="font-semibold text-stone-800 cursor-pointer">
              ⭐ Destacado en Home
            </label>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isPublishedSwitch"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-[#8d9773] focus:ring-[#8d9773] rounded"
            />
            <label htmlFor="isPublishedSwitch" className="font-semibold text-stone-800 cursor-pointer">
              🌐 Publicado en Tienda
            </label>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: GESTOR DE MÚLTIPLES IMÁGENES (Galería Multimedia) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-2">
          <h3 className="font-serif-title text-lg text-stone-900">
            3. Galería de Múltiples Fotos ({images.length} fotos)
          </h3>
          <span className="text-[11px] text-stone-500 font-serif-body">
            La primera foto será la portada principal del catálogo.
          </span>
        </div>

        {/* Formulario para agregar foto */}
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Pega la URL de la imagen (https://...)"
            className="flex-1 bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Agregar a Galería
          </button>
        </div>

        {/* Grilla de miniaturas con controles de orden */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group bg-stone-100 rounded-xl overflow-hidden border border-stone-200 aspect-[3/4] flex flex-col justify-between p-2 shadow-sm"
            >
              <Image
                src={img.url}
                alt={img.altText || `Foto ${idx + 1}`}
                fill
                className="object-cover"
              />

              <div className="relative z-10 flex justify-between items-center bg-black/60 backdrop-blur-sm p-1 rounded text-white text-[10px]">
                <span className="font-bold">#{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="text-red-300 hover:text-red-500 font-bold"
                  title="Eliminar foto"
                >
                  ✕
                </button>
              </div>

              <div className="relative z-10 flex justify-between gap-1 mt-auto bg-black/60 backdrop-blur-sm p-1 rounded text-white text-[10px]">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveImage(idx, "up")}
                  className="hover:text-[#b6a450] disabled:opacity-30"
                  title="Mover a la izquierda"
                >
                  ←
                </button>
                <span className="truncate max-w-[60px]">{idx === 0 ? "Portada" : "Galería"}</span>
                <button
                  type="button"
                  disabled={idx === images.length - 1}
                  onClick={() => handleMoveImage(idx, "down")}
                  className="hover:text-[#b6a450] disabled:opacity-30"
                  title="Mover a la derecha"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BLOQUE 4: CATEGORÍAS & LÍNEAS */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
          <div>
            <h3 className="font-serif-title text-lg text-stone-900">
              4. Categorías & Líneas de Producto
            </h3>
            <p className="text-[11px] text-stone-500 font-serif-body mt-0.5">
              Selecciona la línea principal y los estilos o subcategorías a los que pertenece esta prenda.
            </p>
          </div>
          <Link
            href="/admin/categorias"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-[#8d9773] hover:text-[#5c6643] flex items-center gap-1 self-start sm:self-auto bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors"
            title="Abre el gestor en una pestaña nueva para que no pierdas tus cambios"
          >
            <span>⚙️</span>
            <span>Gestionar o crear categorías &rarr;</span>
          </Link>
        </div>

        {/* Grupos por línea principal */}
        <div className="space-y-6">
          {categories
            .filter((c) => !c.parentId)
            .map((line) => {
              const subcats = categories.filter((c) => c.parentId === line.id);
              const isLineChecked = selectedCategoryIds.includes(line.id);

              return (
                <div
                  key={line.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
                >
                  {/* Checkbox de la Línea Principal */}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLineChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds([...selectedCategoryIds, line.id]);
                        } else {
                          setSelectedCategoryIds(
                            selectedCategoryIds.filter((id) => id !== line.id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-[#b6a450] focus:ring-[#b6a450] rounded"
                    />
                    <span className="font-serif-title text-sm font-semibold text-stone-900">
                      {line.name}
                    </span>
                  </label>

                  {/* Subcategorías de la Línea */}
                  {subcats.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-1 pl-6">
                      {subcats.map((sub) => {
                        const isSubChecked = selectedCategoryIds.includes(sub.id);
                        return (
                          <label
                            key={sub.id}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                              isSubChecked
                                ? "bg-white border-[#b6a450] font-semibold text-stone-900 shadow-sm"
                                : "bg-white/80 border-stone-200 hover:border-stone-400 text-stone-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSubChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Auto-check the parent line as well if checking a subcategory
                                  const nextIds = new Set([
                                    ...selectedCategoryIds,
                                    sub.id,
                                    line.id,
                                  ]);
                                  setSelectedCategoryIds(Array.from(nextIds));
                                } else {
                                  setSelectedCategoryIds(
                                    selectedCategoryIds.filter(
                                      (id) => id !== sub.id
                                    )
                                  );
                                }
                              }}
                              className="text-[#b6a450] focus:ring-[#b6a450] rounded"
                            />
                            <span className="truncate">{sub.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>


      {/* BLOQUE 5: VARIANTES & INVENTARIO */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-2">
          <h3 className="font-serif-title text-lg text-stone-900">
            5. Variantes & Control de Stock ({variants.length} variantes)
          </h3>
          <button
            type="button"
            onClick={handleAddVariant}
            className="bg-stone-100 hover:bg-[#b6a450] hover:text-white text-stone-900 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
          >
            + Agregar Variante
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 sm:grid-cols-6 gap-3 items-end"
            >
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  value={variant.sku}
                  onChange={(e) => handleUpdateVariant(idx, "sku", e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                  Talla
                </label>
                <input
                  type="text"
                  value={variant.size || ""}
                  onChange={(e) => handleUpdateVariant(idx, "size", e.target.value)}
                  placeholder="XS, S, M, L..."
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={variant.color || ""}
                  onChange={(e) => handleUpdateVariant(idx, "color", e.target.value)}
                  placeholder="Azul, Rosa..."
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={variant.stock}
                  onChange={(e) => handleUpdateVariant(idx, "stock", Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                  Precio (COP)
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={variant.price}
                  onChange={(e) => handleUpdateVariant(idx, "price", Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={variants.length <= 1}
                  onClick={() => handleRemoveVariant(idx)}
                  className="text-red-500 hover:text-red-700 py-1.5 text-xs disabled:opacity-30"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
