import React from "react";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AddressListClient } from "./AddressListClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Libreta de Direcciones | Cloto Colombia",
  description: "Administra tus direcciones de entrega en Colombia.",
};

export default async function AddressesPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/auth/login?redirect=/cuenta/direcciones");
  }

  const addresses = await prisma.address.findMany({
    where: { profileId: profile.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans-ui space-y-8">
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/cuenta" className="hover:underline">
          Mi Cuenta
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">Libreta de Direcciones</span>
      </div>

      <div className="border-b border-[#dfd8cb] pb-4">
        <h1 className="font-serif-title text-3xl text-[#1c1917]">
          Tus Direcciones de Entrega
        </h1>
      </div>

      <AddressListClient
        addresses={addresses.map((a) => ({
          id: a.id,
          recipientName: a.recipientName,
          phone: a.phone,
          streetAddress: a.streetAddress,
          apartmentSuite: a.apartmentSuite,
          city: a.city,
          stateProvince: a.stateProvince,
          postalCode: a.postalCode,
          isDefault: a.isDefault,
        }))}
      />
    </div>
  );
}
