import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    orderNumber?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const { orderId, orderNumber } = params;

  if (!orderId) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      coupons: true,
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddr = order.shippingAddress as any;
  const whatsappNumber = "573100000000";
  const whatsappMsg = encodeURIComponent(
    `¡Hola Cloto! Acabo de realizar el pedido ${order.orderNumber}. Me gustaría confirmar los detalles del despacho.`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans-ui space-y-8">
      {/* Banner de Éxito */}
      <div className="text-center space-y-4 bg-white p-8 sm:p-10 rounded-2xl border border-[#dfd8cb] shadow-lg">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#f0f3eb] flex items-center justify-center text-2xl text-[#5c6643]">
          ✓
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-bold block">
          ¡Gracias por tu compra!
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917]">
          Tu Pedido ha sido Confirmado
        </h1>
        <p className="font-serif-body text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Hemos recibido tu orden con número <strong>{order.orderNumber}</strong>. Estamos preparando tus prendas con nuestro empaque consciente y aromaterapia de marca.
        </p>

        <div className="pt-2">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors shadow-md"
          >
            <span>💬 Notificar por WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Detalles de la Orden */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] space-y-6">
        <h2 className="font-serif-title text-xl text-[#1c1917] border-b border-[#dfd8cb] pb-3">
          Detalle del Pedido #{order.orderNumber}
        </h2>

        {/* Lista de Prendas */}
        <div className="divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center text-xs">
              <div>
                <strong className="font-serif-title text-sm text-[#1c1917] block">
                  {item.productName}
                </strong>
                <span className="text-stone-500">
                  {item.variantName} • Cantidad: {item.quantity}
                </span>
              </div>
              <span className="font-semibold text-stone-900">
                ${Number(item.totalPrice).toLocaleString("es-CO")} COP
              </span>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="border-t border-[#dfd8cb] pt-4 space-y-1.5 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toLocaleString("es-CO")} COP</span>
          </div>
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Descuento aplicado</span>
              <span>-${Number(order.discountAmount).toLocaleString("es-CO")} COP</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Envío nacional</span>
            <span>{Number(order.shippingCost) === 0 ? "Gratis" : `$${Number(order.shippingCost).toLocaleString("es-CO")} COP`}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-bold text-[#1c1917]">
            <span>Total Pagado</span>
            <span>${Number(order.totalAmount).toLocaleString("es-CO")} COP</span>
          </div>
        </div>

        {/* Dirección de Envío */}
        <div className="border-t border-[#dfd8cb] pt-4 space-y-1 text-xs">
          <h3 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
            Dirección de Envío:
          </h3>
          <p className="text-stone-700">{shippingAddr?.recipientName} • Tel: {shippingAddr?.phone}</p>
          <p className="text-stone-600">
            {shippingAddr?.streetAddress} {shippingAddr?.apartmentSuite ? `, ${shippingAddr.apartmentSuite}` : ""}
          </p>
          <p className="text-stone-600">{shippingAddr?.city}, {shippingAddr?.stateProvince}</p>
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="flex justify-center gap-4">
        <Link
          href="/cuenta/pedidos"
          className="bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Ver mis Pedidos
        </Link>
        <Link
          href="/catalogo"
          className="bg-white border border-[#dfd8cb] hover:border-stone-800 text-[#1c1917] text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Seguir Comprando
        </Link>
      </div>
    </div>
  );
}
