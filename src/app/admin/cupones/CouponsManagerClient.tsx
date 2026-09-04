"use client";

import React, { useState, useTransition } from "react";
import { saveCoupon, deleteCoupon } from "@/actions/coupons";
import { X } from "lucide-react";

type CouponItem = {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
};

export function CouponsManagerClient({ initialCoupons }: { initialCoupons: CouponItem[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
    discountValue: 10,
    minOrderAmount: "",
    maxDiscountAmount: "",
    usageLimit: "",
    isActive: true,
  });

  const openNewModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: "",
      maxDiscountAmount: "",
      usageLimit: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : "",
      maxDiscountAmount: coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : "",
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      isActive: coupon.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveCoupon({
        id: editingCoupon?.id,
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        isActive: formData.isActive,
      });

      if (res?.success && res.data) {
        setCoupons((prev) => {
          if (editingCoupon) {
            return prev.map((c) => (c.id === editingCoupon.id ? (res.data as any) : c));
          }
          return [res.data as any, ...prev];
        });
        setIsModalOpen(false);
      }
    });
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`¿Eliminar cupón "${code}"?`)) {
      startTransition(async () => {
        await deleteCoupon(id);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      });
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans-ui">
      <div className="flex justify-between items-center">
        <p className="text-stone-500 font-serif-body">
          Crea cupones personalizados para campañas de influencers (ej. CAROXT&T10) y promociones de temporada.
        </p>
        <button
          type="button"
          onClick={openNewModal}
          className="bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          + Crear Cupón
        </button>
      </div>

      {/* Tabla de Cupones */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-stone-500 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Código</th>
                <th className="py-3.5 px-4">Descuento</th>
                <th className="py-3.5 px-4">Descripción / Campaña</th>
                <th className="py-3.5 px-4 text-center">Usos</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-stone-400">
                    No hay cupones configurados.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900 text-sm">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#8d9773]">
                      {c.discountType === "PERCENTAGE"
                        ? `${c.discountValue}% OFF`
                        : c.discountType === "FIXED_AMOUNT"
                        ? `$${c.discountValue.toLocaleString("es-CO")} COP`
                        : "Envío Gratis"}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {c.description || "Sin descripción"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-stone-900">{c.usageCount}</span>
                      {c.usageLimit ? ` / ${c.usageLimit}` : " (Ilimitado)"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                      }`}>
                        {c.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="text-stone-700 hover:text-[#b6a450] font-semibold"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, c.code)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Cupón */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif-title text-xl text-stone-900">
                {editingCoupon ? "Editar Cupón" : "Nuevo Cupón de Descuento"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Código del Cupón (Mayúsculas) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="CAROXT&T10"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 uppercase font-mono font-bold focus:outline-none focus:border-[#b6a450]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Campaña / Descripción
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Colaboración con Carolina Influencer"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#b6a450]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tipo de Descuento
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2"
                  >
                    <option value="PERCENTAGE">Porcentaje (%)</option>
                    <option value="FIXED_AMOUNT">Monto Fijo (COP)</option>
                    <option value="FREE_SHIPPING">Envío Gratis</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Valor del Descuento *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Compra Mínima (COP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="Opcional"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Límite de Usos
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Ilimitado"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="couponActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="text-[#b6a450] focus:ring-[#b6a450] rounded"
                />
                <label htmlFor="couponActiveCheck" className="text-stone-700 cursor-pointer font-medium">
                  Cupón activo para redención
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[#1c1917] hover:bg-[#b6a450] text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar Cupón"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
