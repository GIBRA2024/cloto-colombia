"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { validateCoupon } from "@/actions/coupons";
import { createOrder } from "@/actions/orders";
import { saveAddress } from "@/actions/addresses";

type SavedAddress = {
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

type CheckoutClientProps = {
  userProfile: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  } | null;
  savedAddresses: SavedAddress[];
};

export function CheckoutClient({ userProfile, savedAddresses }: CheckoutClientProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estado de Dirección
  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddr ? defaultAddr.id : "new"
  );
  const [newAddress, setNewAddress] = useState({
    recipientName: userProfile ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() : "",
    phone: userProfile?.phone || "",
    streetAddress: "",
    apartmentSuite: "",
    city: "Cali",
    stateProvince: "Valle del Cauca",
    postalCode: "760001",
  });

  // Estado de Cupones
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    calculatedDiscount: number;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Estado de Pago
  const [paymentMethod, setPaymentMethod] = useState<string>("BANK_TRANSFER");
  const [customerNotes, setCustomerNotes] = useState("");

  // Cálculos
  const freeShippingThreshold = 200000;
  const isFreeShippingByCoupon = appliedCoupon?.discountType === "FREE_SHIPPING";
  const shippingCost = subtotal >= freeShippingThreshold || isFreeShippingByCoupon ? 0 : 15000;
  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

  // Aplicar cupón
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMessage(null);
    if (!couponInput.trim()) return;

    const res = await validateCoupon(couponInput, subtotal);
    if (res.valid) {
      setAppliedCoupon({
        code: res.code!,
        discountType: res.discountType!,
        discountValue: res.discountValue!,
        calculatedDiscount: res.calculatedDiscount!,
      });
      setCouponMessage({ text: res.message || "¡Cupón aplicado!" });
    } else {
      setAppliedCoupon(null);
      setCouponMessage({ text: res.message || "Cupón no válido", isError: true });
    }
  };

  // Procesar Compra
  const handlePlaceOrder = () => {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Tu carrito está vacío.");
      return;
    }

    if (!userProfile) {
      router.push(`/auth/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    let shippingData: any;
    if (selectedAddressId === "new" || savedAddresses.length === 0) {
      if (!newAddress.recipientName || !newAddress.phone || !newAddress.streetAddress || !newAddress.city) {
        setErrorMessage("Por favor completa los campos obligatorios de la dirección de entrega.");
        return;
      }
      shippingData = newAddress;
    } else {
      const selected = savedAddresses.find((a) => a.id === selectedAddressId);
      if (!selected) {
        setErrorMessage("Por favor selecciona una dirección de entrega válida.");
        return;
      }
      shippingData = {
        recipientName: selected.recipientName,
        phone: selected.phone,
        streetAddress: selected.streetAddress,
        apartmentSuite: selected.apartmentSuite || "",
        city: selected.city,
        stateProvince: selected.stateProvince,
        postalCode: selected.postalCode || "",
      };
    }

    startTransition(async () => {
      // Guardar dirección si es nueva
      if (selectedAddressId === "new") {
        await saveAddress({ ...newAddress, isDefault: savedAddresses.length === 0 });
      }

      const res = await createOrder({
        items: items.map((i) => ({
          variantId: i.variantId,
          productName: i.productName,
          variantName: i.variantName,
          sku: i.sku,
          unitPrice: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
        shippingAddress: shippingData,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        customerNotes,
      });

      if (res?.error) {
        setErrorMessage(res.error);
      } else if (res?.orderId) {
        clearCart();
        router.push(`/checkout/exito?orderId=${res.orderId}&orderNumber=${res.orderNumber}`);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4 font-sans-ui">
        <span className="text-4xl">🛍️</span>
        <h1 className="font-serif-title text-3xl text-[#1c1917]">Tu carrito está vacío</h1>
        <p className="font-serif-body text-xs text-stone-600">
          No tienes prendas seleccionadas para finalizar la compra.
        </p>
        <Link
          href="/catalogo"
          className="inline-block bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-wider font-semibold px-8 py-3.5 rounded-md transition-colors"
        >
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans-ui space-y-10">
      <div className="border-b border-[#dfd8cb] pb-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-bold">
          Cloto Colombia • Compra Segura
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917]">
          Finalizar Compra
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#f8eeed] border border-[#d59f9e] text-[#834442] text-xs rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* COLUMNA IZQUIERDA: DIRECCIÓN & PAGO (7 Columnas) */}
        <div className="lg:col-span-7 space-y-8">
          {/* PASO 1: DIRECCIÓN DE ENTREGA */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1c1917] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="font-serif-title text-xl text-[#1c1917]">
                Dirección de Entrega en Colombia
              </h2>
            </div>

            {/* Selector de direcciones guardadas */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Selecciona una de tus direcciones:
                </p>
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? "border-[#b6a450] bg-[#f7f3e1]/30 shadow-sm"
                          : "border-[#dfd8cb] hover:border-stone-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressSelection"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-[#b6a450] focus:ring-[#b6a450]"
                      />
                      <div className="text-xs space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-stone-900">{addr.recipientName}</strong>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-[#dfd8cb] text-stone-800 px-1.5 py-0.2 rounded font-medium">
                              Predeterminada
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600">
                          {addr.streetAddress} {addr.apartmentSuite ? `, ${addr.apartmentSuite}` : ""}
                        </p>
                        <p className="text-stone-500">
                          {addr.city}, {addr.stateProvince} • Tel: {addr.phone}
                        </p>
                      </div>
                    </label>
                  ))}

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressId === "new"
                        ? "border-[#b6a450] bg-[#f7f3e1]/30 shadow-sm"
                        : "border-[#dfd8cb] hover:border-stone-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="addressSelection"
                      checked={selectedAddressId === "new"}
                      onChange={() => setSelectedAddressId("new")}
                      className="text-[#b6a450] focus:ring-[#b6a450]"
                    />
                    <span className="text-xs font-semibold text-stone-800">
                      + Usar otra dirección nueva
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Formulario de nueva dirección */}
            {(selectedAddressId === "new" || savedAddresses.length === 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nombre de quien recibe *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                    placeholder="Lucía Gómez"
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Teléfono celular *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    placeholder="310 123 4567"
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Dirección de entrega *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.streetAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                    placeholder="Calle 15 # 85-30"
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Apartamento / Torre / Casa (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newAddress.apartmentSuite}
                    onChange={(e) => setNewAddress({ ...newAddress, apartmentSuite: e.target.value })}
                    placeholder="Apto 402 Torre B"
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="Cali / Bogotá / Medellín / Pereira..."
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.stateProvince}
                    onChange={(e) => setNewAddress({ ...newAddress, stateProvince: e.target.value })}
                    placeholder="Valle del Cauca / Cundinamarca / Antioquia..."
                    className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PASO 2: MÉTODO DE PAGO */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1c1917] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="font-serif-title text-xl text-[#1c1917]">
                Método de Pago
              </h2>
            </div>

            <div className="space-y-3">
              {/* Opción 1: Transferencia Bancaria / Nequi */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-[#b6a450] bg-[#f7f3e1]/30 shadow-sm"
                    : "border-[#dfd8cb] hover:border-stone-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={() => setPaymentMethod("BANK_TRANSFER")}
                  className="mt-1 text-[#b6a450] focus:ring-[#b6a450]"
                />
                <div className="text-xs space-y-1">
                  <strong className="text-stone-900 block">
                    Transferencia Bancaria / Nequi / Daviplata / Bancolombia
                  </strong>
                  <p className="text-stone-500 font-serif-body">
                    Recibirás las cuentas oficiales y número de confirmación al completar tu orden.
                  </p>
                </div>
              </label>

              {/* Opción 2: Pago Contraentrega */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "CASH_ON_DELIVERY"
                    ? "border-[#b6a450] bg-[#f7f3e1]/30 shadow-sm"
                    : "border-[#dfd8cb] hover:border-stone-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  checked={paymentMethod === "CASH_ON_DELIVERY"}
                  onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                  className="mt-1 text-[#b6a450] focus:ring-[#b6a450]"
                />
                <div className="text-xs space-y-1">
                  <strong className="text-stone-900 block">
                    Pago Contraentrega en Efectivo
                  </strong>
                  <p className="text-stone-500 font-serif-body">
                    Pagas al recibir tu paquete en la puerta de tu hogar (ciudades principales).
                  </p>
                </div>
              </label>

              {/* Opción 3: Tarjeta / PSE */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "STRIPE"
                    ? "border-[#b6a450] bg-[#f7f3e1]/30 shadow-sm"
                    : "border-[#dfd8cb] hover:border-stone-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="STRIPE"
                  checked={paymentMethod === "STRIPE"}
                  onChange={() => setPaymentMethod("STRIPE")}
                  className="mt-1 text-[#b6a450] focus:ring-[#b6a450]"
                />
                <div className="text-xs space-y-1">
                  <strong className="text-stone-900 block">
                    Tarjeta de Crédito / PSE / Pasarela Digital
                  </strong>
                  <p className="text-stone-500 font-serif-body">
                    Pago 100% cifrado con seguridad bancaria de alta tecnología.
                  </p>
                </div>
              </label>
            </div>

            {/* Notas del cliente */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Notas especiales o dedicatoria para empaque de regalo (Opcional):
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Ej: Es para un regalo de cumpleaños, por favor incluir mensaje para Sofía..."
                className="w-full bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#b6a450]"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN DE COMPRA & CUPONES (5 Columnas) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-6 sticky top-24">
            <h2 className="font-serif-title text-xl text-[#1c1917] border-b border-[#dfd8cb] pb-3">
              Resumen del Pedido
            </h2>

            {/* Lista de Prendas */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center text-xs">
                  <div className="relative w-12 h-14 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-title text-stone-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Cant: {item.quantity} • {item.variantName}
                    </p>
                  </div>
                  <span className="font-semibold text-stone-900">
                    ${(item.price * item.quantity).toLocaleString("es-CO")}
                  </span>
                </div>
              ))}
            </div>

            {/* FORMULARIO DE CUPÓN DE DESCUENTO (Influencers & Promos) */}
            <div className="pt-4 border-t border-[#dfd8cb]">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Código de descuento (ej: CAROXT&T10)"
                  className="flex-1 bg-[#f2f1e7]/40 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-xs uppercase focus:outline-none focus:border-[#b6a450]"
                />
                <button
                  type="submit"
                  className="bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`text-[11px] mt-2 font-medium ${
                    couponMessage.isError ? "text-red-600" : "text-emerald-700"
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Desglose de Totales */}
            <div className="border-t border-[#dfd8cb] pt-4 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  ${subtotal.toLocaleString("es-CO")} COP
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Descuento ({appliedCoupon.code})</span>
                  <span>-${discountAmount.toLocaleString("es-CO")} COP</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Envío a Colombia</span>
                <span>{shippingCost === 0 ? "¡Gratis!" : `$${shippingCost.toLocaleString("es-CO")} COP`}</span>
              </div>

              <div className="border-t border-[#dfd8cb] pt-3 flex justify-between items-baseline text-base font-bold text-stone-950">
                <span className="font-serif-title text-lg">Total a Pagar</span>
                <span className="text-xl text-[#1c1917]">
                  ${totalAmount.toLocaleString("es-CO")} COP
                </span>
              </div>
            </div>

            {/* Botón de Confirmar Pedido */}
            <button
              type="button"
              disabled={isPending}
              onClick={handlePlaceOrder}
              className="w-full bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-widest font-bold py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50"
            >
              {isPending ? "Confirmando pedido..." : "Confirmar y Realizar Pedido &rarr;"}
            </button>

            <div className="text-center text-[10px] text-stone-400 space-y-1">
              <p>🔒 Tus datos están protegidos con cifrado de 256 bits.</p>
              <p>🇨🇴 Despachos locales desde Colombia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
