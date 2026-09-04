import React from "react";
import { getUserWishlistAction } from "@/actions/wishlist";
import { WishlistClient } from "./WishlistClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mis Favoritos | Cloto Colombia",
  description: "Tus prendas de descanso, lencería de cama y trajes de baño guardados en Cloto Colombia.",
};

export default async function FavoritosPage() {
  const initialProducts = await getUserWishlistAction();

  return <WishlistClient initialProducts={initialProducts} />;
}
