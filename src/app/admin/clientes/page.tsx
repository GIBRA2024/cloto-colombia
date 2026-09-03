import React from "react";
import { prisma } from "@/lib/prisma";
import { CustomersClient, Customer } from "./CustomersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Clientes & Usuarios Registrados | Panel de Administración Cloto",
  description: "Gestión y seguimiento de usuarios registrados, compras y CRM de clientes.",
};

export default async function AdminCustomersPage() {
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      },
      addresses: {
        where: { isDefault: true },
        take: 1,
      },
    },
  });

  const formattedCustomers: Customer[] = profiles.map((p) => {
    const totalSpent = p.orders.reduce((acc: number, o) => acc + Number(o.totalAmount || 0), 0);
    const defaultAddress = p.addresses[0];
    const location = defaultAddress
      ? [defaultAddress.city, defaultAddress.stateProvince].filter(Boolean).join(", ")
      : null;

    return {
      id: p.id,
      email: p.email,
      firstName: p.firstName,
      lastName: p.lastName,
      fullName: [p.firstName, p.lastName].filter(Boolean).join(" ") || "Usuario Registrado",
      phone: p.phone || defaultAddress?.phone || null,
      role: p.role,
      location,
      ordersCount: p.orders.length,
      totalSpent,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif-title text-3xl text-stone-900">
          Clientes & Usuarios Registrados (CRM)
        </h1>
        <p className="font-serif-body text-xs text-stone-500 mt-1">
          Base de datos de personas con cuenta creada en Cloto, historial de compras, teléfonos para contacto y ubicación.
        </p>
      </div>

      <CustomersClient initialCustomers={formattedCustomers} />
    </div>
  );
}
