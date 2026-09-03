import React from "react";
import { prisma } from "@/lib/prisma";
import { CouponsManagerClient } from "./CouponsManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedCoupons = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    description: c.description,
    discountType: c.discountType as any,
    discountValue: Number(c.discountValue),
    minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
    maxDiscountAmount: c.maxDiscountAmount ? Number(c.maxDiscountAmount) : null,
    usageLimit: c.usageLimit,
    usageCount: c.usageCount,
    startDate: c.startDate ? c.startDate.toISOString() : null,
    endDate: c.endDate ? c.endDate.toISOString() : null,
    isActive: c.isActive,
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif-title text-3xl text-stone-900">
          Cupones de Descuento & Campañas de Influencers
        </h1>
        <p className="font-serif-body text-xs text-stone-500 mt-1">
          Gestiona códigos promocionales, comisiones de influencers y descuentos automáticos.
        </p>
      </div>

      <CouponsManagerClient initialCoupons={formattedCoupons} />
    </div>
  );
}
