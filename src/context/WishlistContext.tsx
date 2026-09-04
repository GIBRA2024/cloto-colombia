"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  toggleWishlistAction,
  getUserWishlistIdsAction,
  syncLocalWishlistAction,
} from "@/actions/wishlist";

type WishlistContextType = {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isLoaded: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "cloto_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar desde localStorage y sincronizar con servidor al montar
  useEffect(() => {
    let localSaved: string[] = [];
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        localSaved = JSON.parse(raw);
        if (Array.isArray(localSaved)) {
          setWishlistIds(localSaved);
        }
      }
    } catch (e) {
      console.error("Error al leer wishlist desde localStorage:", e);
    } finally {
      setIsLoaded(true);
    }

    // Sincronizar con base de datos si el usuario está autenticado
    (async () => {
      try {
        if (localSaved.length > 0) {
          const synced = await syncLocalWishlistAction(localSaved);
          if (synced && synced.length > 0) {
            setWishlistIds(synced);
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(synced));
          }
        } else {
          const serverIds = await getUserWishlistIdsAction();
          if (serverIds && serverIds.length > 0) {
            setWishlistIds(serverIds);
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(serverIds));
          }
        }
      } catch (err) {
        // En caso de usuario no autenticado o error de red, se mantiene el estado local
      }
    })();
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      const alreadyIn = wishlistIds.includes(productId);
      const nextIds = alreadyIn
        ? wishlistIds.filter((id) => id !== productId)
        : [...wishlistIds, productId];

      // Actualización optimista instantánea
      setWishlistIds(nextIds);
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextIds));
      } catch (e) {
        console.error("Error al guardar wishlist en storage:", e);
      }

      // Persistir en servidor si está autenticado
      try {
        await toggleWishlistAction(productId);
      } catch (e) {
        // Fallback silencioso para usuarios invitados
      }

      return !alreadyIn;
    },
    [wishlistIds]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        isLoaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist debe usarse dentro de un WishlistProvider");
  }
  return context;
}
