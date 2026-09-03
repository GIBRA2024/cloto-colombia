import React from "react";
import { getCurrentProfile } from "@/lib/auth";
import { CheckoutClient } from "./CheckoutClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Finalizar Compra | Cloto Colombia",
  description: "Checkout seguro para tu pedido de moda consciente Cloto Colombia.",
};

export default async function CheckoutPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/auth/login?redirect=/checkout");
  }

  const savedAddresses = (profile.addresses || []).map((a) => ({
    id: a.id,
    recipientName: a.recipientName,
    phone: a.phone,
    streetAddress: a.streetAddress,
    apartmentSuite: a.apartmentSuite,
    city: a.city,
    stateProvince: a.stateProvince,
    postalCode: a.postalCode,
    isDefault: a.isDefault,
  }));

  const userProfile = {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
  };

  return <CheckoutClient userProfile={userProfile} savedAddresses={savedAddresses} />;
}
