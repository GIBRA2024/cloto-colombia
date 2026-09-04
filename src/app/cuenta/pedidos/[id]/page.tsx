import React from "react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Truck, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

interface SingleOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SingleOrderPage({ params }: SingleOrderPageProps) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(`/auth/login?redirect=/cuenta/pedidos/${id}`);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      coupons: true,
      payments: true,
    },
  });

  if (!order || (order.profileId !== profile.id && profile.role !== "ADMIN")) {
    notFound();
  }

  const shippingAddr = order.shippingAddress as any;
  const whatsappUrl = getWhatsAppLink(
    `¡Hola Cloto! Tengo una consulta sobre el estado de mi pedido ${order.orderNumber}.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans-ui space-y-8">
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/cuenta" className="hover:underline">
          Mi Cuenta
        </Link>
        <span>/</span>
        <Link href="/cuenta/pedidos" className="hover:underline">
          Pedidos
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">{order.orderNumber}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfd8cb] pb-4">
        <div>
          <h1 className="font-serif-title text-3xl text-[#1c1917]">
            Pedido #{order.orderNumber}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Realizado el {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs uppercase font-bold px-3 py-1 rounded-full bg-[#f7f3e1] text-[#8c7b30] border border-[#d4c478]">
          Estado: {order.status}
        </span>
      </div>

      {/* Información Logística */}
      {order.trackingNumber && (
        <div className="bg-[#f0f3eb] p-6 rounded-2xl border border-[#b2bc98] space-y-2">
          <h3 className="font-serif-title text-base text-[#5c6643] font-semibold flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#5c6643]" />
            <span>Guía de Envío Asignada</span>
          </h3>
          <p className="text-xs text-stone-700">
            Transportadora: <strong>{order.carrier || "Coordinadora"}</strong> • Número de Guía: <strong>{order.trackingNumber}</strong>
          </p>
        </div>
      )}

      {/* Artículos del Pedido */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-6">
        <h2 className="font-serif-title text-xl text-[#1c1917] border-b border-[#dfd8cb] pb-3">
          Prendas Incluidas
        </h2>

        <div className="divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex justify-between items-center text-xs">
              <div>
                <strong className="font-serif-title text-sm text-[#1c1917] block">
                  {item.productName}
                </strong>
                <span className="text-stone-500">
                  {item.variantName} (SKU: {item.sku}) • Cantidad: {item.quantity}
                </span>
              </div>
              <span className="font-semibold text-stone-900 text-sm">
                ${Number(item.totalPrice).toLocaleString("es-CO")} COP
              </span>
            </div>
          ))}
        </div>

        {/* Resumen de Montos */}
        <div className="border-t border-[#dfd8cb] pt-4 space-y-1.5 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toLocaleString("es-CO")} COP</span>
          </div>
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Descuento</span>
              <span>-${Number(order.discountAmount).toLocaleString("es-CO")} COP</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Envío</span>
            <span>{Number(order.shippingCost) === 0 ? "Gratis" : `$${Number(order.shippingCost).toLocaleString("es-CO")} COP`}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-stone-100 text-base font-bold text-[#1c1917]">
            <span>Total</span>
            <span>${Number(order.totalAmount).toLocaleString("es-CO")} COP</span>
          </div>
        </div>

        {/* Dirección de Envío */}
        <div className="border-t border-[#dfd8cb] pt-4 space-y-1 text-xs">
          <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
            Dirección de Envío:
          </h4>
          <p className="text-stone-700">{shippingAddr?.recipientName} • Tel: {shippingAddr?.phone}</p>
          <p className="text-stone-600">
            {shippingAddr?.streetAddress} {shippingAddr?.apartmentSuite ? `, ${shippingAddr.apartmentSuite}` : ""}
          </p>
          <p className="text-stone-600">{shippingAddr?.city}, {shippingAddr?.stateProvince}</p>
        </div>
      </div>

      {/* Soporte WhatsApp */}
      <div className="text-center pt-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-emerald-700 hover:underline font-semibold"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>¿Tienes dudas sobre este pedido? Consulta con nuestra asesora por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
