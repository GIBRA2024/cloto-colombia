"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CouponValidationResult = {
  valid: boolean;
  code?: string;
  discountType?: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue?: number;
  calculatedDiscount?: number;
  message?: string;
};

/**
 * Validar cupón de descuento en el checkout
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  try {
    if (!code || !code.trim()) {
      return { valid: false, message: "Por favor ingresa un código de cupón." };
    }

    const cleanCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return { valid: false, message: "El cupón ingresado no existe o no está activo." };
    }

    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) {
      return { valid: false, message: "Este cupón aún no está vigente." };
    }

    if (coupon.endDate && coupon.endDate < now) {
      return { valid: false, message: "Este cupón ha expirado." };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: "Este cupón ha alcanzado el límite máximo de usos." };
    }

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return {
        valid: false,
        message: `Este cupón requiere una compra mínima de $${Number(coupon.minOrderAmount).toLocaleString("es-CO")} COP.`,
      };
    }

    // Cálculo del descuento
    let calculatedDiscount = 0;
    const discountVal = Number(coupon.discountValue);

    if (coupon.discountType === "PERCENTAGE") {
      calculatedDiscount = (subtotal * discountVal) / 100;
      if (coupon.maxDiscountAmount && calculatedDiscount > Number(coupon.maxDiscountAmount)) {
        calculatedDiscount = Number(coupon.maxDiscountAmount);
      }
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      calculatedDiscount = Math.min(subtotal, discountVal);
    } else if (coupon.discountType === "FREE_SHIPPING") {
      calculatedDiscount = 0; // Se maneja descontando el valor del envío
    }

    return {
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
      discountValue: discountVal,
      calculatedDiscount: Math.round(calculatedDiscount),
      message: `¡Cupón ${coupon.code} aplicado con éxito!`,
    };
  } catch (error: unknown) {
    console.error("Error validating coupon:", error);
    return { valid: false, message: "Error al validar el cupón." };
  }
}

/**
 * Crear o editar un cupón en el Admin
 */
export async function saveCoupon(data: {
  id?: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
}) {
  try {
    const cleanCode = data.code.trim().toUpperCase();

    let coupon;
    if (data.id) {
      coupon = await prisma.coupon.update({
        where: { id: data.id },
        data: {
          code: cleanCode,
          description: data.description || null,
          discountType: data.discountType,
          discountValue: data.discountValue,
          minOrderAmount: data.minOrderAmount || null,
          maxDiscountAmount: data.maxDiscountAmount || null,
          usageLimit: data.usageLimit || null,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          isActive: data.isActive,
        },
      });
    } else {
      coupon = await prisma.coupon.create({
        data: {
          code: cleanCode,
          description: data.description || null,
          discountType: data.discountType,
          discountValue: data.discountValue,
          minOrderAmount: data.minOrderAmount || null,
          maxDiscountAmount: data.maxDiscountAmount || null,
          usageLimit: data.usageLimit || null,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          isActive: data.isActive,
        },
      });
    }

    revalidatePath("/admin/cupones");
    return { success: true, data: coupon };
  } catch (error: unknown) {
    console.error("Error saving coupon:", error);
    return { error: error instanceof Error ? error.message : "Error al guardar cupón" };
  }
}

/**
 * Eliminar cupón
 */
export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/cupones");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting coupon:", error);
    return { error: error instanceof Error ? error.message : "Error al eliminar cupón" };
  }
}
