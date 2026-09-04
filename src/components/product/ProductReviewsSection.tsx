"use client";

import React, { useState } from "react";
import { Star, CheckCircle, MessageSquarePlus, Sparkles } from "lucide-react";
import { ReviewModal } from "./ReviewModal";
import type { ProductReviewsData } from "@/actions/reviews";
import { getProductReviewsAction } from "@/actions/reviews";

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  initialData: ProductReviewsData;
}

export function ProductReviewsSection({
  productId,
  productName,
  initialData,
}: ProductReviewsSectionProps) {
  const [data, setData] = useState<ProductReviewsData>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefreshReviews = async () => {
    try {
      const refreshed = await getProductReviewsAction(productId);
      setData(refreshed);
    } catch (e) {
      console.error("Error al refrescar reseñas:", e);
    }
  };

  const { reviews, averageRating, totalReviews, distribution } = data;

  return (
    <section id="resenas" className="border-t border-[#dfd8cb] pt-12 space-y-10 font-sans-ui">
      {/* Cabecera de Reseñas */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#dfd8cb] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-bold">
              Experiencias Reales
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-[#5c6643] bg-[#f0f3eb] px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 text-[#b6a450]" />
              Comunidad Cloto
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
            Opiniones de Nuestras Clientas
          </h2>
        </div>

        {/* Botón Escribir Reseña */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-wider font-semibold py-3 px-5 rounded-lg transition-colors shadow-sm hover:shadow shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Escribir una Reseña</span>
        </button>
      </div>

      {/* Resumen de Calificación & Desglose */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-[#dfd8cb] shadow-sm">
        {/* Puntuación General */}
        <div className="md:col-span-4 text-center md:border-r border-[#dfd8cb]/80 md:pr-8 space-y-2">
          <div className="font-serif-title text-5xl sm:text-6xl text-[#1c1917] font-light">
            {totalReviews > 0 ? averageRating.toFixed(1) : "5.0"}
          </div>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(averageRating)
                    ? "fill-[#b6a450] text-[#b6a450]"
                    : "text-stone-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-stone-500 font-serif-body">
            {totalReviews > 0
              ? `Basado en ${totalReviews} ${
                  totalReviews === 1 ? "calificación" : "calificaciones"
                }`
              : "Prenda recién lanzada en colección"}
          </p>
        </div>

        {/* Barras de Desglose por Estrellas */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
            const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-stone-600 font-medium flex items-center gap-1 shrink-0">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 fill-[#b6a450] text-[#b6a450]" />
                </span>

                {/* Barra de progreso */}
                <div className="flex-1 bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#b6a450] h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="w-10 text-right text-stone-400 text-[11px] shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de Opiniones */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#dfd8cb] space-y-3">
            <p className="font-serif-title text-base text-stone-800">
              Aún no hay opiniones para esta prenda
            </p>
            <p className="font-serif-body text-xs text-stone-500 max-w-md mx-auto">
              Si ya la has vestido o probado en casa, sé la primera en compartir tu opinión y ayuda a otras clientas a elegir.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#8d9773] hover:text-[#5c6643] font-semibold underline underline-offset-4"
            >
              Sé la primera en opinar &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-5 rounded-xl border border-[#dfd8cb] shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  {/* Encabezado Reseña: Estrellas + Verificación */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= review.rating
                              ? "fill-[#b6a450] text-[#b6a450]"
                              : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>

                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#5c6643] bg-[#f0f3eb] px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle className="w-3 h-3 text-[#8d9773]" />
                        <span>Compra Verificada</span>
                      </span>
                    )}
                  </div>

                  {/* Título de la Reseña */}
                  {review.title && (
                    <h4 className="font-semibold text-xs text-[#1c1917]">
                      {review.title}
                    </h4>
                  )}

                  {/* Comentario */}
                  <p className="text-xs font-serif-body text-stone-600 leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Autor y Fecha */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="font-medium text-stone-700">
                    {review.authorName}
                  </span>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Enviar Reseña */}
      <ReviewModal
        productId={productId}
        productName={productName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRefreshReviews}
      />
    </section>
  );
}
