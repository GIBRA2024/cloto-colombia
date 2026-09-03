"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type CreateOrderInput = {
  items: {
    variantId: string;
    productName: string;
    variantName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    imageUrl?: string;
  }[];
  shippingAddress: {
    recipientName: string;
    phone: string;
    streetAddress: string;
    apartmentSuite?: string;
    city: string;
    stateProvince: string;
    postalCode?: string;
    country?: string;
  };
  couponCode?: string;
  paymentMethod: string;
  customerNotes?: string;
};

/**
 * Crear una nueva orden desde el Checkout
 */
export async function createOrder(input: CreateOrderInput) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { error: "Debes iniciar sesión para completar tu compra." };
    }

    if (!input.items || input.items.length === 0) {
      return { error: "El carrito está vacío." };
    }

    // 1. Validar disponibilidad de stock para cada variante
    for (const item of input.items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant || variant.stock < item.quantity) {
        return {
          error: `Lo sentimos, la prenda "${item.productName} (${item.variantName})" no cuenta con stock suficiente disponible (${variant?.stock ?? 0} disponibles).`,
        };
      }
    }

    // 2. Calcular subtotal
    const subtotal = input.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    // 3. Evaluar envío gratis o tarifa estándar ($15.000 COP)
    const freeShippingThreshold = 200000;
    let shippingCost = subtotal >= freeShippingThreshold ? 0 : 15000;

    // 4. Evaluar cupón si existe
    let discountAmount = 0;
    let appliedCoupon = null;

    if (input.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        appliedCoupon = coupon;
        const discountVal = Number(coupon.discountValue);

        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = (subtotal * discountVal) / 100;
          if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
            discountAmount = Number(coupon.maxDiscountAmount);
          }
        } else if (coupon.discountType === "FIXED_AMOUNT") {
          discountAmount = Math.min(subtotal, discountVal);
        } else if (coupon.discountType === "FREE_SHIPPING") {
          shippingCost = 0;
        }

        // Incrementar uso del cupón
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

    // 5. Generar número de orden único ORD-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${new Date().getFullYear()}-${randomSuffix}`;

    // 6. Transacción para crear orden, items y descontar inventario
    const order = await prisma.$transaction(async (tx) => {
      // Descontar inventario
      for (const item of input.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Crear Orden
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          profileId: profile.id,
          status: "PENDING",
          paymentStatus: input.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID",
          currency: "COP",
          subtotal,
          shippingCost,
          discountAmount,
          totalAmount,
          shippingAddress: input.shippingAddress,
          customerNotes: input.customerNotes || null,
          items: {
            create: input.items.map((i) => ({
              variantId: i.variantId,
              productName: i.productName,
              variantName: i.variantName,
              sku: i.sku,
              unitPrice: i.unitPrice,
              quantity: i.quantity,
              totalPrice: i.unitPrice * i.quantity,
              imageUrl: i.imageUrl || null,
            })),
          },
          payments: {
            create: {
              provider: input.paymentMethod as "STRIPE" | "MERCADO_PAGO" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "OTHER",
              amount: totalAmount,
              status: input.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID",
            },
          },
        },
      });

      if (appliedCoupon) {
        await tx.orderCoupon.create({
          data: {
            orderId: newOrder.id,
            couponId: appliedCoupon.id,
            code: appliedCoupon.code,
            discountAmount,
          },
        });
      }

      return newOrder;
    });

    revalidatePath("/cuenta/pedidos");
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin/inventario");

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error: unknown) {
    console.error("Error creating order:", error);
    return { error: error instanceof Error ? error.message : "Error al procesar la orden." };
  }
}

/**
 * Actualizar estado logístico de la orden desde el Admin
 */
export async function updateOrderStatus(data: {
  orderId: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  carrier?: string;
  trackingNumber?: string;
  adminNotes?: string;
}) {
  try {
    const updated = await prisma.order.update({
      where: { id: data.orderId },
      data: {
        status: data.status,
        carrier: data.carrier || null,
        trackingNumber: data.trackingNumber || null,
        adminNotes: data.adminNotes || null,
      },
    });

    revalidatePath("/admin/pedidos");
    revalidatePath(`/cuenta/pedidos/${data.orderId}`);
    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Error updating order status:", error);
    return { error: error instanceof Error ? error.message : "Error al actualizar estado del pedido" };
  }
}
