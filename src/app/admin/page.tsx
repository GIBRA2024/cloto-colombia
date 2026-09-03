import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Ejecutar todas las métricas en paralelo para respuesta instantánea del dashboard
  const [
    totalProducts,
    featuredProducts,
    publishedProducts,
    lowStockVariants,
    lowStockCount,
    totalOrders,
    pendingOrders,
    recentOrders,
    allOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      include: { product: true },
      take: 5,
    }),
    prisma.productVariant.count({
      where: { stock: { lte: 5 }, isActive: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.order.findMany({ select: { totalAmount: true } }),
  ]);

  const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);


  return (
    <div className="space-y-8 max-w-6xl">
      {/* Cabecera */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif-title text-3xl text-stone-900">
          Dashboard de Gestión
        </h1>
        <p className="font-serif-body text-xs text-stone-500 mt-1">
          Resumen general de ventas, inventario crítico y productos destacados en Cloto Colombia.
        </p>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Ventas Totales
          </span>
          <p className="text-2xl font-bold text-stone-900">
            ${totalRevenue.toLocaleString("es-CO")}
          </p>
          <span className="text-[11px] text-stone-400">{totalOrders} pedidos realizados</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Pedidos Pendientes
          </span>
          <p className="text-2xl font-bold text-amber-600">
            {pendingOrders}
          </p>
          <Link href="/admin/pedidos" className="text-[11px] text-[#b6a450] hover:underline">
            Gestionar pedidos &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Alertas de Stock Bajo (&le;5)
          </span>
          <p className={`text-2xl font-bold ${lowStockCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {lowStockCount}
          </p>
          <Link href="/admin/inventario" className="text-[11px] text-[#b6a450] hover:underline">
            Ajustar inventario &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Productos en Tienda
          </span>
          <p className="text-2xl font-bold text-stone-900">
            {publishedProducts} / {totalProducts}
          </p>
          <span className="text-[11px] text-[#8d9773] font-medium">{featuredProducts} destacados en Home</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alertas de Inventario Crítico */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h2 className="font-serif-title text-lg text-stone-900">
              ⚠️ Alertas de Stock Bajo (&le; 5 unidades)
            </h2>
            <Link href="/admin/inventario" className="text-xs text-[#b6a450] hover:underline">
              Ver todo &rarr;
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">
              No hay variantes con stock crítico en este momento.
            </p>
          ) : (
            <div className="divide-y divide-stone-100 text-xs">
              {lowStockVariants.map((v) => (
                <div key={v.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <strong className="text-stone-900 block">{v.product.name}</strong>
                    <span className="text-stone-500">{v.name} (SKU: {v.sku})</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${v.stock === 0 ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                    {v.stock} disponibles
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimos Pedidos Recibidos */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h2 className="font-serif-title text-lg text-stone-900">
              🛒 Últimos Pedidos
            </h2>
            <Link href="/admin/pedidos" className="text-xs text-[#b6a450] hover:underline">
              Ver todos &rarr;
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">
              Aún no se han recibido pedidos.
            </p>
          ) : (
            <div className="divide-y divide-stone-100 text-xs">
              {recentOrders.map((o) => (
                <div key={o.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <strong className="text-stone-900 block">{o.orderNumber}</strong>
                    <span className="text-stone-500">
                      {o.items.length} prendas • {new Date(o.createdAt).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-900 block">
                      ${Number(o.totalAmount).toLocaleString("es-CO")}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-700">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
