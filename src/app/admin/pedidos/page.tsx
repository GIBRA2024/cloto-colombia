import React from "react";
import { prisma } from "@/lib/prisma";
import { AdminOrdersClient } from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payments: true,
      coupons: true,
    },
  });

  const formattedOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    createdAt: o.createdAt.toISOString(),
    status: o.status as any,
    paymentStatus: o.paymentStatus,
    subtotal: Number(o.subtotal),
    shippingCost: Number(o.shippingCost),
    discountAmount: Number(o.discountAmount),
    totalAmount: Number(o.totalAmount),
    carrier: o.carrier,
    trackingNumber: o.trackingNumber,
    adminNotes: o.adminNotes,
    customerNotes: o.customerNotes,
    shippingAddress: o.shippingAddress,
    items: o.items.map((i) => ({
      id: i.id,
      productName: i.productName,
      variantName: i.variantName,
      sku: i.sku,
      unitPrice: Number(i.unitPrice),
      quantity: i.quantity,
      totalPrice: Number(i.totalPrice),
    })),
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif-title text-3xl text-stone-900">
          Gestión de Pedidos & Logística
        </h1>
        <p className="font-serif-body text-xs text-stone-500 mt-1">
          Actualiza estados de despacho, transportadoras y números de guía de envío.
        </p>
      </div>

      <AdminOrdersClient initialOrders={formattedOrders} />
    </div>
  );
}
