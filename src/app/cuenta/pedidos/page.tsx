import React from "react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Package, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mis Pedidos | Cloto Colombia",
  description: "Historial y seguimiento de pedidos de Cloto Colombia.",
};

export default async function CustomerOrdersPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/auth/login?redirect=/cuenta/pedidos");
  }

  const orders = await prisma.order.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payments: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans-ui space-y-8">
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/cuenta" className="hover:underline">
          Mi Cuenta
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">Historial de Pedidos</span>
      </div>

      <div className="border-b border-[#dfd8cb] pb-4">
        <h1 className="font-serif-title text-3xl text-[#1c1917]">
          Tus Pedidos Realizados
        </h1>
        <p className="font-serif-body text-xs text-stone-500 mt-1">
          Revisa el estado de envío, transportadora y comprobantes de tus compras.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#dfd8cb] p-8 space-y-3">
          <Package className="w-10 h-10 text-stone-300 mx-auto stroke-[1.5]" />
          <h3 className="font-serif-title text-lg text-stone-800">
            No tienes pedidos registrados
          </h3>
          <p className="text-xs text-stone-500 font-serif-body">
            Tus compras aparecerán aquí con su respectivo código de seguimiento.
          </p>
          <div>
            <Link
              href="/catalogo"
              className="inline-block bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusLabels: Record<string, { label: string; color: string }> = {
              PENDING: { label: "Pendiente", color: "bg-amber-100 text-amber-800" },
              CONFIRMED: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
              PROCESSING: { label: "En Preparación", color: "bg-purple-100 text-purple-800" },
              SHIPPED: { label: "Despachado", color: "bg-indigo-100 text-indigo-800" },
              DELIVERED: { label: "Entregado", color: "bg-emerald-100 text-emerald-800" },
              CANCELLED: { label: "Cancelado", color: "bg-rose-100 text-rose-800" },
              REFUNDED: { label: "Reembolsado", color: "bg-stone-100 text-stone-800" },
            };
            const currentStatus = statusLabels[order.status] || { label: order.status, color: "bg-stone-100 text-stone-800" };

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl border border-[#dfd8cb] shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-serif-title text-base text-stone-900">
                        {order.orderNumber}
                      </strong>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${currentStatus.color}`}>
                        {currentStatus.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Fecha: {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#1c1917]">
                      ${Number(order.totalAmount).toLocaleString("es-CO")} COP
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span>
                        • {item.productName} ({item.variantName}) x{item.quantity}
                      </span>
                      <span className="font-medium text-stone-900">
                        ${Number(item.totalPrice).toLocaleString("es-CO")}
                      </span>
                    </div>
                  ))}
                </div>

                {order.trackingNumber && (
                  <div className="p-3 bg-[#f0f3eb] rounded-lg text-xs text-[#5c6643] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 shrink-0" />
                      <span><strong>Guía de envío:</strong> {order.carrier || "Coordinadora / Servientrega"} #{order.trackingNumber}</span>
                    </span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Link
                    href={`/cuenta/pedidos/${order.id}`}
                    className="text-xs bg-stone-100 hover:bg-[#b6a450] hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Ver Detalle Completo &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
