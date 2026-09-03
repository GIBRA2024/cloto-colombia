import React from "react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mi Cuenta | Cloto Colombia",
  description: "Panel de cliente Cloto Colombia.",
};

export default async function AccountPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/auth/login?redirect=/cuenta");
  }

  // Obtener pedidos recientes
  const recentOrders = await prisma.order.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { items: true },
  });

  const addressCount = await prisma.address.count({
    where: { profileId: profile.id },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans-ui space-y-10">
      {/* Cabecera del Perfil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfd8cb] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-bold">
            Portal de Cliente
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917]">
            Hola, {profile.firstName || "Querida Clienta"} ✨
          </h1>
          <p className="font-serif-body text-xs text-stone-600">
            {profile.email} • {profile.role === "ADMIN" ? "Rol Administrador" : "Clienta VIP"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {profile.role === "ADMIN" && (
            <Link
              href="/admin"
              className="bg-[#b6a450] hover:bg-[#a39243] text-stone-950 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Ir al Panel Admin &rarr;
            </Link>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              className="bg-white border border-[#dfd8cb] hover:border-red-400 hover:text-red-700 text-xs font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>

      {/* Tarjetas de Accesos Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Libreta de Direcciones */}
        <Link
          href="/cuenta/direcciones"
          className="p-6 bg-white rounded-2xl border border-[#dfd8cb] shadow-sm hover:shadow-md hover:border-[#b6a450] transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f7f3e1] flex items-center justify-center text-lg text-[#8c7b30]">
            📍
          </div>
          <h3 className="font-serif-title text-lg text-[#1c1917] group-hover:text-[#b6a450] transition-colors">
            Libreta de Direcciones
          </h3>
          <p className="text-xs text-stone-500 font-serif-body">
            Tienes <strong>{addressCount}</strong> {addressCount === 1 ? "dirección guardada" : "direcciones guardadas"} para tus envíos en Colombia.
          </p>
          <span className="text-xs text-[#b6a450] font-semibold block pt-1">
            Gestionar direcciones &rarr;
          </span>
        </Link>

        {/* Historial de Pedidos */}
        <Link
          href="/cuenta/pedidos"
          className="p-6 bg-white rounded-2xl border border-[#dfd8cb] shadow-sm hover:shadow-md hover:border-[#b6a450] transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f0f3eb] flex items-center justify-center text-lg text-[#5c6643]">
            📦
          </div>
          <h3 className="font-serif-title text-lg text-[#1c1917] group-hover:text-[#b6a450] transition-colors">
            Historial de Pedidos
          </h3>
          <p className="text-xs text-stone-500 font-serif-body">
            Revisa el estado de tus compras, transportadora y guía logística.
          </p>
          <span className="text-xs text-[#b6a450] font-semibold block pt-1">
            Ver mis pedidos &rarr;
          </span>
        </Link>

        {/* Asesoría VIP WhatsApp */}
        <a
          href="https://wa.me/573100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-white rounded-2xl border border-[#dfd8cb] shadow-sm hover:shadow-md hover:border-[#25D366] transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center text-lg text-[#128C7E]">
            💬
          </div>
          <h3 className="font-serif-title text-lg text-[#1c1917] group-hover:text-[#128C7E] transition-colors">
            Asesoría Personalizada
          </h3>
          <p className="text-xs text-stone-500 font-serif-body">
            Contacta a tu asesora de imagen para recomendaciones de estilo o dudas de pedidos.
          </p>
          <span className="text-xs text-emerald-700 font-semibold block pt-1">
            Chatear por WhatsApp &rarr;
          </span>
        </a>
      </div>

      {/* Pedidos Recientes */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-[#dfd8cb] pb-4">
          <h2 className="font-serif-title text-xl text-[#1c1917]">
            Tus Compras Recientes
          </h2>
          <Link href="/cuenta/pedidos" className="text-xs text-[#b6a450] hover:underline font-medium">
            Ver todas &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <span className="text-3xl">👗</span>
            <p className="font-serif-body text-xs text-stone-500">
              Aún no has realizado ninguna compra en Cloto Colombia.
            </p>
            <Link
              href="/catalogo"
              className="inline-block bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Descubrir Colecciones
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-stone-900">{order.orderNumber}</strong>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })} • {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold text-sm text-[#1c1917]">
                    ${Number(order.totalAmount).toLocaleString("es-CO")} COP
                  </span>
                  <Link
                    href={`/cuenta/pedidos/${order.id}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#b6a450] hover:text-white transition-colors"
                  >
                    Detalle &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
