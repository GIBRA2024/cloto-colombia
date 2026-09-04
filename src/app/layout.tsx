import type { Metadata } from "next";
import { Playfair_Display, Lora, Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { StoreLayoutWrapper } from "@/components/layout/StoreLayoutWrapper";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cloto Sustainable Lifestyle | Marca de Estilo Sostenible",
  description:
    "Transformar la manera de vestir, habitar y consumir. Explora Cloto Ritual, Cloto Active, Cloto Rebecca y Cloto Home con telas orgánicas y diseño consciente 100% colombiano.",
  keywords: [
    "Cloto Colombia",
    "Pijamas Colombia",
    "Telas orgánicas",
    "Moda consciente",
    "Trajes de baño",
    "Lencería de hogar",
    "Pijamas de lujo",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${lora.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif-body bg-[#f2f1e7] text-[#1c1917]">
        <CartProvider>
          <WishlistProvider>
            <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

