"use client";

import React, { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/orders";

type OrderItem = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  carrier?: string | null;
  trackingNumber?: string | null;
  adminNotes?: string | null;
  customerNotes?: string | null;
  shippingAddress: any;
  items: {
    id: string;
    productName: string;
    variantName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
};

export function AdminOrdersClient({ initialOrders }: { initialOrders: OrderItem[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();
  const [activeTrackingInputs, setActiveTrackingInputs] = useState<{
    [orderId: string]: { carrier: string; trackingNumber: string };
  }>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) =>
    statusFilter === "ALL" ? true : o.status === statusFilter
  );

  const handleStatusChange = (orderId: string, newStatus: any) => {
    startTransition(async () => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      await updateOrderStatus({ orderId, status: newStatus });
      setFeedback("Estado de orden actualizado.");
      setTimeout(() => setFeedback(null), 3000);
    });
  };

  const handleSaveTracking = (orderId: string) => {
    const input = activeTrackingInputs[orderId];
    if (!input) return;

    startTransition(async () => {
      const targetOrder = orders.find((o) => o.id === orderId);
      await updateOrderStatus({
        orderId,
        status: targetOrder?.status || "SHIPPED",
        carrier: input.carrier,
        trackingNumber: input.trackingNumber,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, carrier: input.carrier, trackingNumber: input.trackingNumber }
            : o
        )
      );
      setFeedback("Guía logística guardada correctamente.");
      setTimeout(() => setFeedback(null), 3000);
    });
  };

  return (
    <div className="space-y-6 text-xs font-sans-ui">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
          Filtrar por estado:
        </span>
        {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
              statusFilter === st
                ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm"
                : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
            }`}
          >
            {st === "ALL" ? "Todos" : st}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="p-3 bg-[#f0f3eb] border border-[#b2bc98] text-[#5c6643] rounded-lg font-medium flex items-center gap-2">
          <span>✓</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-400">
            No hay pedidos en este estado.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const tracking = activeTrackingInputs[order.id] || {
              carrier: order.carrier || "Coordinadora",
              trackingNumber: order.trackingNumber || "",
            };

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <strong className="font-serif-title text-base text-stone-900">
                        {order.orderNumber}
                      </strong>
                      <span className="text-[11px] text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-stone-600 mt-0.5">
                      Cliente: <strong>{order.shippingAddress?.recipientName}</strong> (Tel: {order.shippingAddress?.phone})
                    </p>
                  </div>

                  {/* Selector de Estado */}
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 font-semibold text-[11px]">Estado:</span>
                    <select
                      value={order.status}
                      disabled={isPending}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 font-semibold text-stone-900 focus:outline-none focus:border-[#b6a450]"
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="CONFIRMED">Confirmado</option>
                      <option value="PROCESSING">En Preparación</option>
                      <option value="SHIPPED">Despachado</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                      <option value="REFUNDED">Reembolsado</option>
                    </select>
                  </div>
                </div>

                {/* Prendas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 border-r border-stone-100 pr-4">
                    <h4 className="font-semibold uppercase tracking-wider text-[10px] text-stone-500">
                      Prendas Solicitadas:
                    </h4>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-stone-700">
                          <span>
                            • {item.productName} ({item.variantName}) x{item.quantity}
                          </span>
                          <span className="font-medium">${item.totalPrice.toLocaleString("es-CO")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dirección y Totales */}
                  <div className="space-y-2 text-stone-600">
                    <h4 className="font-semibold uppercase tracking-wider text-[10px] text-stone-500">
                      Entrega & Totales:
                    </h4>
                    <p className="text-stone-700">
                      📍 {order.shippingAddress?.streetAddress} {order.shippingAddress?.apartmentSuite ? `, ${order.shippingAddress.apartmentSuite}` : ""}, {order.shippingAddress?.city}, {order.shippingAddress?.stateProvince}
                    </p>
                    <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-100">
                      <span>Total Pagado:</span>
                      <span>${order.totalAmount.toLocaleString("es-CO")} COP</span>
                    </div>
                  </div>
                </div>

                {/* Formulario de Guía de Transporte */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-2 bg-stone-50/50 p-3 rounded-xl">
                  <span className="font-semibold text-stone-700">🚚 Asignar Guía:</span>
                  <input
                    type="text"
                    placeholder="Transportadora (ej: Coordinadora)"
                    value={tracking.carrier}
                    onChange={(e) =>
                      setActiveTrackingInputs({
                        ...activeTrackingInputs,
                        [order.id]: { ...tracking, carrier: e.target.value },
                      })
                    }
                    className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs w-44"
                  />
                  <input
                    type="text"
                    placeholder="Número de Guía / Tracking"
                    value={tracking.trackingNumber}
                    onChange={(e) =>
                      setActiveTrackingInputs({
                        ...activeTrackingInputs,
                        [order.id]: { ...tracking, trackingNumber: e.target.value },
                      })
                    }
                    className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs flex-1"
                  />
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleSaveTracking(order.id)}
                    className="bg-[#1c1917] hover:bg-[#b6a450] text-white px-3.5 py-1 rounded font-semibold transition-colors"
                  >
                    Guardar Guía
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
