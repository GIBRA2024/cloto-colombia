"use client";

import React, { useState, useTransition } from "react";
import { saveAddress, deleteAddress, setDefaultAddress } from "@/actions/addresses";

type Address = {
  id: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  apartmentSuite?: string | null;
  city: string;
  stateProvince: string;
  postalCode?: string | null;
  isDefault: boolean;
};

export function AddressListClient({ addresses }: { addresses: Address[] }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    streetAddress: "",
    apartmentSuite: "",
    city: "Cali",
    stateProvince: "Valle del Cauca",
    postalCode: "760001",
    isDefault: false,
  });

  const openNewModal = () => {
    setEditingAddress(null);
    setFormData({
      recipientName: "",
      phone: "",
      streetAddress: "",
      apartmentSuite: "",
      city: "Cali",
      stateProvince: "Valle del Cauca",
      postalCode: "760001",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      recipientName: addr.recipientName,
      phone: addr.phone,
      streetAddress: addr.streetAddress,
      apartmentSuite: addr.apartmentSuite || "",
      city: addr.city,
      stateProvince: addr.stateProvince,
      postalCode: addr.postalCode || "",
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveAddress({
        id: editingAddress ? editingAddress.id : undefined,
        ...formData,
      });
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás segura de eliminar esta dirección?")) {
      startTransition(async () => {
        await deleteAddress(id);
      });
    }
  };

  const handleSetDefault = (id: string) => {
    startTransition(async () => {
      await setDefaultAddress(id);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-stone-500 font-serif-body">
          Administra los lugares de entrega para tus pedidos de Cloto en Colombia.
        </p>
        <button
          type="button"
          onClick={openNewModal}
          className="bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          + Agregar Dirección
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#dfd8cb] p-8 space-y-3">
          <span className="text-3xl">📍</span>
          <h3 className="font-serif-title text-lg text-stone-800">
            No tienes direcciones registradas
          </h3>
          <p className="text-xs text-stone-500 font-serif-body">
            Agrega tu primera dirección para agilizar tus compras en el checkout.
          </p>
          <div>
            <button
              type="button"
              onClick={openNewModal}
              className="bg-[#1c1917] hover:bg-[#b6a450] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Agregar mi primera dirección
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-6 bg-white rounded-2xl border transition-all space-y-3 relative ${
                addr.isDefault
                  ? "border-[#b6a450] shadow-sm bg-[#f7f3e1]/20"
                  : "border-[#dfd8cb] hover:border-stone-400"
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-serif-title text-base text-stone-900 font-medium">
                  {addr.recipientName}
                </h4>
                {addr.isDefault && (
                  <span className="badge-gold text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    Predeterminada
                  </span>
                )}
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <p>{addr.streetAddress} {addr.apartmentSuite ? `, ${addr.apartmentSuite}` : ""}</p>
                <p>{addr.city}, {addr.stateProvince} (Colombia)</p>
                <p className="text-stone-500">Teléfono: {addr.phone}</p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-stone-100 text-xs">
                {!addr.isDefault && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[#b6a450] hover:underline font-medium"
                  >
                    Establecer como principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEditModal(addr)}
                  className="text-stone-700 hover:text-black font-medium"
                >
                  Editar
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(addr.id)}
                  className="text-red-600 hover:text-red-800 font-medium ml-auto"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Crear / Editar Dirección */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-[#dfd8cb] shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#dfd8cb] pb-3">
              <h3 className="font-serif-title text-xl text-[#1c1917]">
                {editingAddress ? "Editar Dirección" : "Nueva Dirección de Entrega"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Nombre de quien recibe *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="Lucía Gómez"
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3 py-2 focus:outline-none focus:border-[#b6a450]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Teléfono celular *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="310 123 4567"
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3 py-2 focus:outline-none focus:border-[#b6a450]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Dirección de entrega *
                </label>
                <input
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="Carrera 100 # 15-20"
                  className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3 py-2 focus:outline-none focus:border-[#b6a450]"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Apartamento / Torre / Casa (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.apartmentSuite}
                  onChange={(e) => setFormData({ ...formData, apartmentSuite: e.target.value })}
                  placeholder="Apto 301 Torre 2"
                  className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3 py-2 focus:outline-none focus:border-[#b6a450]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Cali / Bogotá / Medellín..."
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3 py-2 focus:outline-none focus:border-[#b6a450]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    placeholder="Valle del Cauca..."
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3 py-2 focus:outline-none focus:border-[#b6a450]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultCheck"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="text-[#b6a450] focus:ring-[#b6a450] rounded"
                />
                <label htmlFor="isDefaultCheck" className="text-stone-700 cursor-pointer">
                  Marcar como dirección principal de entrega
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
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
                  {isPending ? "Guardando..." : "Guardar Dirección"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
