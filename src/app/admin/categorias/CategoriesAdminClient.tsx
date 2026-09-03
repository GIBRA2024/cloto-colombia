"use client";

import React, { useState, useTransition } from "react";
import { saveCategory, toggleCategoryActive, deleteCategory } from "@/actions/categories";

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string | null;
  orderIndex: number;
  isActive: boolean;
  productsCount: number;
  children: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    description: string | null;
    orderIndex: number;
    isActive: boolean;
    productsCount: number;
  }[];
};

interface CategoriesAdminClientProps {
  initialCategories: CategoryData[];
}

export function CategoriesAdminClient({ initialCategories }: CategoriesAdminClientProps) {
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Estado del Modal de Creación / Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id?: string;
    name: string;
    slug: string;
    parentId: string | null;
    description: string;
    orderIndex: number;
    isActive: boolean;
  } | null>(null);

  // Obtener todas las líneas principales disponibles para el selector
  const mainLines = categories.map((c) => ({ id: c.id, name: c.name }));

  // Abrir modal para nueva categoría
  const handleOpenNew = (defaultParentId: string | null = null) => {
    setError(null);
    setEditingCategory({
      name: "",
      slug: "",
      parentId: defaultParentId,
      description: "",
      orderIndex: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar categoría existente
  const handleOpenEdit = (cat: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    description: string | null;
    orderIndex: number;
    isActive: boolean;
  }) => {
    setError(null);
    setEditingCategory({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      description: cat.description || "",
      orderIndex: cat.orderIndex,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  // Guardar categoría (crear o actualizar)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setError(null);

    startTransition(async () => {
      const res = await saveCategory(editingCategory);
      if (res.error) {
        setError(res.error);
        return;
      }

      // Si todo sale bien, recargar la página para reflejar relaciones
      window.location.reload();
    });
  };

  // Cambiar estado activo
  const handleToggleActive = (id: string, currentStatus: boolean, isParent: boolean, parentId?: string) => {
    startTransition(async () => {
      // Optimistic update
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            return { ...c, isActive: !currentStatus };
          }
          if (c.children.some((sub) => sub.id === id)) {
            return {
              ...c,
              children: c.children.map((sub) =>
                sub.id === id ? { ...sub, isActive: !currentStatus } : sub
              ),
            };
          }
          return c;
        })
      );

      await toggleCategoryActive(id, currentStatus);
    });
  };

  // Eliminar categoría
  const handleDelete = (id: string, name: string, productsCount: number) => {
    let msg = `¿Estás segura de eliminar la categoría "${name}"?`;
    if (productsCount > 0) {
      msg += `\n\n⚠️ ¡Atención! Hay ${productsCount} producto(s) asignado(s) a esta categoría. Se desvincularán de ella, pero no se borrarán los productos.`;
    }

    if (confirm(msg)) {
      startTransition(async () => {
        const res = await deleteCategory(id);
        if (res.error) {
          alert(`Error: ${res.error}`);
          return;
        }
        window.location.reload();
      });
    }
  };

  // Filtro de búsqueda
  const filteredCategories = categories.filter((line) => {
    const matchLine =
      line.name.toLowerCase().includes(search.toLowerCase()) ||
      line.slug.toLowerCase().includes(search.toLowerCase());
    const matchChild = line.children.some(
      (sub) =>
        sub.name.toLowerCase().includes(search.toLowerCase()) ||
        sub.slug.toLowerCase().includes(search.toLowerCase())
    );
    return matchLine || matchChild;
  });

  return (
    <div className="space-y-8 font-sans-ui pb-16">
      {/* Encabezado Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-bold">
            Catálogo & Arquitectura
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-stone-900">
            Gestor de Categorías
          </h1>
          <p className="text-xs text-stone-500 font-serif-body mt-1">
            Crea, organiza, renombra y desactiva las líneas y subcategorías de Cloto Colombia.
          </p>
        </div>

        <button
          onClick={() => handleOpenNew(null)}
          className="inline-flex items-center justify-center gap-2 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <span>+</span>
          <span>Nueva Categoría o Línea</span>
        </button>
      </div>

      {/* Barra de Filtro Rápido */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-stone-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar categoría o subcategoría..."
            className="w-full pl-8 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#b6a450]"
          />
        </div>
        <div className="text-xs text-stone-500">
          Total líneas principales: <strong>{categories.length}</strong>
        </div>
      </div>

      {/* Árbol de Categorías Organizado por Líneas */}
      <div className="space-y-6">
        {filteredCategories.map((line) => {
          const subcategories = line.children.filter((sub) =>
            search.trim()
              ? sub.name.toLowerCase().includes(search.toLowerCase()) ||
                sub.slug.toLowerCase().includes(search.toLowerCase())
              : true
          );

          return (
            <div
              key={line.id}
              className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${
                line.isActive ? "border-stone-200" : "border-stone-200 bg-stone-50/50 opacity-75"
              }`}
            >
              {/* Cabecera de la Línea Principal */}
              <div className="p-5 bg-[#fbfaf7] border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b6a450]" />
                    <h3 className="font-serif-title text-base sm:text-lg text-stone-900 font-medium">
                      {line.name}
                    </h3>
                    <span className="text-[10px] bg-stone-200/80 text-stone-700 px-2 py-0.5 rounded-full font-mono">
                      /{line.slug}
                    </span>
                    {!line.isActive && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                        Inactiva en tienda
                      </span>
                    )}
                  </div>
                  {line.description && (
                    <p className="text-xs text-stone-500 font-serif-body pl-5">
                      {line.description}
                    </p>
                  )}
                </div>

                {/* Acciones de la Línea */}
                <div className="flex items-center gap-2 pl-5 sm:pl-0">
                  <button
                    onClick={() => handleOpenNew(line.id)}
                    className="text-[11px] bg-white hover:bg-stone-100 text-[#5c6643] border border-stone-300 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>Añadir Subcategoría</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(line)}
                    className="text-[11px] bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-2.5 py-1.5 rounded-lg transition-colors"
                    title="Editar línea"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleToggleActive(line.id, line.isActive, true)}
                    className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors font-medium ${
                      line.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200"
                    }`}
                    title={line.isActive ? "Desactivar línea" : "Activar línea"}
                  >
                    {line.isActive ? "Activa" : "Pausada"}
                  </button>
                </div>
              </div>

              {/* Lista de Subcategorías Hijas */}
              <div className="p-5">
                {subcategories.length === 0 ? (
                  <div className="text-center py-6 text-xs text-stone-400 font-serif-body">
                    No hay subcategorías registradas en esta línea. Haz clic en{" "}
                    <strong>+ Añadir Subcategoría</strong> para crear la primera.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          sub.isActive
                            ? "bg-white border-stone-200 hover:border-stone-300 shadow-sm"
                            : "bg-stone-100 border-stone-200 text-stone-500"
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-stone-900 truncate">
                              {sub.name}
                            </h4>
                            {!sub.isActive && (
                              <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-medium">
                                Pausada
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                            <span>slug: {sub.slug}</span>
                            <span>•</span>
                            <span className="text-[#8d9773] font-semibold">
                              {sub.productsCount} {sub.productsCount === 1 ? "prenda" : "prendas"}
                            </span>
                          </div>
                        </div>

                        {/* Botones de acción de la subcategoría */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 hover:bg-stone-100 rounded text-stone-600 transition-colors"
                            title="Editar nombre o slug"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleToggleActive(sub.id, sub.isActive, false, line.id)}
                            className={`p-1.5 rounded transition-colors text-xs ${
                              sub.isActive
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-stone-400 hover:bg-stone-200"
                            }`}
                            title={sub.isActive ? "Desactivar" : "Activar"}
                          >
                            {sub.isActive ? "👁️" : "🙈"}
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id, sub.name, sub.productsCount)}
                            className="p-1.5 hover:bg-rose-50 rounded text-stone-400 hover:text-rose-600 transition-colors"
                            title="Eliminar subcategoría"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL PARA CREAR O EDITAR CATEGORÍA */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-[#fbfaf7]">
              <div>
                <h3 className="font-serif-title text-xl text-stone-900">
                  {editingCategory.id ? "Editar Categoría" : "Nueva Categoría o Subcategoría"}
                </h3>
                <p className="text-xs text-stone-500 font-serif-body">
                  Configura el nombre, ubicación y visibilidad en la tienda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => {
                    const nameVal = e.target.value;
                    setEditingCategory((prev) =>
                      prev
                        ? {
                            ...prev,
                            name: nameVal,
                            slug: !prev.id
                              ? nameVal
                                  .toLowerCase()
                                  .normalize("NFD")
                                  .replace(/[\u0300-\u036f]/g, "")
                                  .replace(/[^a-z0-9\s-]/g, "")
                                  .replace(/[\s_-]+/g, "-")
                              : prev.slug,
                          }
                        : null
                    );
                  }}
                  placeholder="Ej: Kimonos de Seda, Pantalones de Lino..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                />
              </div>

              {/* Línea Padre */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  ¿A qué Línea pertenece?
                </label>
                <select
                  value={editingCategory.parentId || ""}
                  onChange={(e) =>
                    setEditingCategory((prev) =>
                      prev ? { ...prev, parentId: e.target.value || null } : null
                    )
                  }
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                >
                  <option value="">Ninguna (Es una Línea Principal)</option>
                  {mainLines.map((line) => (
                    <option key={line.id} value={line.id}>
                      Subcategoría de: {line.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-400 mt-1">
                  Si seleccionas una línea (ej: Cloto Ritual), aparecerá como subcategoría dentro de ella.
                </p>
              </div>

              {/* Slug URL */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Slug URL (identificador)
                </label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory((prev) =>
                      prev ? { ...prev, slug: e.target.value } : null
                    )
                  }
                  placeholder="ej: kimonos-de-seda"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#b6a450]"
                />
              </div>

              {/* Descripción Opcional */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  placeholder="Breve detalle sobre los estilos o prendas de esta categoría..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                />
              </div>

              {/* Orden y Switch de Activo */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    value={editingCategory.orderIndex}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, orderIndex: Number(e.target.value) } : null
                      )
                    }
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isActiveModalSwitch"
                    checked={editingCategory.isActive}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, isActive: e.target.checked } : null
                      )
                    }
                    className="w-4 h-4 text-[#8d9773] focus:ring-[#8d9773] rounded"
                  />
                  <label htmlFor="isActiveModalSwitch" className="text-xs font-semibold text-stone-800 cursor-pointer">
                    Activa en la tienda
                  </label>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
