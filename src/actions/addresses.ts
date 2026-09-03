"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type AddressFormData = {
  id?: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  apartmentSuite?: string;
  city: string;
  stateProvince: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
};

export async function saveAddress(data: AddressFormData) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { error: "Debes iniciar sesión para gestionar tus direcciones." };
    }

    // Si se marca como predeterminada, quitar predeterminada de las demás
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { profileId: profile.id },
        data: { isDefault: false },
      });
    }

    let address;
    if (data.id) {
      address = await prisma.address.update({
        where: { id: data.id, profileId: profile.id },
        data: {
          recipientName: data.recipientName,
          phone: data.phone,
          streetAddress: data.streetAddress,
          apartmentSuite: data.apartmentSuite || null,
          city: data.city,
          stateProvince: data.stateProvince,
          postalCode: data.postalCode || "000000",
          country: data.country || "CO",
          isDefault: data.isDefault ?? false,
        },
      });
    } else {
      // Si es la primera dirección del usuario, marcarla como default automáticamente
      const count = await prisma.address.count({ where: { profileId: profile.id } });
      const shouldBeDefault = data.isDefault || count === 0;

      address = await prisma.address.create({
        data: {
          profileId: profile.id,
          recipientName: data.recipientName,
          phone: data.phone,
          streetAddress: data.streetAddress,
          apartmentSuite: data.apartmentSuite || null,
          city: data.city,
          stateProvince: data.stateProvince,
          postalCode: data.postalCode || "000000",
          country: data.country || "CO",
          isDefault: shouldBeDefault,
        },
      });
    }

    revalidatePath("/cuenta/direcciones");
    revalidatePath("/checkout");
    return { success: true, data: address };
  } catch (error: unknown) {
    console.error("Error saving address:", error);
    return { error: error instanceof Error ? error.message : "Error al guardar dirección" };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { error: "No autorizado." };
    }

    await prisma.address.delete({
      where: { id: addressId, profileId: profile.id },
    });

    revalidatePath("/cuenta/direcciones");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting address:", error);
    return { error: error instanceof Error ? error.message : "Error al eliminar dirección" };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { error: "No autorizado." };
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { profileId: profile.id },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId, profileId: profile.id },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/cuenta/direcciones");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error setting default address:", error);
    return { error: error instanceof Error ? error.message : "Error al actualizar dirección principal" };
  }
}
