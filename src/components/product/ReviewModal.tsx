"use client";

import React, { useState, useTransition } from "react";
import { Star, X, CheckCircle2, AlertCircle } from "lucide-react";
import { submitReviewAction } from "@/actions/reviews";

interface ReviewModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({
  productId,
  productName,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("productId", productId);
    formData.set("rating", String(rating));
    formData.set("title", title);
    formData.set("comment", comment);

    startTransition(async () => {
      const res = await submitReviewAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccessMsg(res.message || "¡Reseña publicada con éxito!");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#dfd8cb] shadow-2xl p-6 sm:p-8 space-y-6 font-sans-ui relative">
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="space-y-1 text-center sm:text-left pr-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8d9773] font-bold">
            Tu Opinión Importa
          </span>
          <h3 className="font-serif-title text-2xl text-[#1c1917]">
            Calificar Prenda
          </h3>
          <p className="font-serif-body text-xs text-stone-500 line-clamp-1">
            {productName}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#f8eeed] border border-[#d59f9e] text-[#834442] text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#f0f3eb] border border-[#b2bc98] text-[#5c6643] text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calificación de Estrellas */}
          <div className="space-y-1.5 text-center sm:text-left">
            <label className="block text-xs font-semibold text-stone-700">
              ¿Cómo calificarías tu prenda?
            </label>
            <div className="flex items-center justify-center sm:justify-start gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating ?? rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 text-stone-300 hover:scale-110 transition-transform"
                    aria-label={`Calificar con ${star} estrellas`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        isFilled
                          ? "fill-[#b6a450] text-[#b6a450]"
                          : "text-stone-300"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-bold text-stone-700 ml-2">
                {hoverRating ?? rating} de 5
              </span>
            </div>
          </div>

          {/* Título Resumen */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Título breve de tu experiencia (opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Calidad excepcional y tela muy fresca"
              className="w-full bg-[#f2f1e7]/30 border border-[#dfd8cb] rounded-lg px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          {/* Comentario Detallado */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tu opinión detallada <span className="text-stone-400 font-normal">(mínimo 5 caracteres)</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos sobre el calce, la textura de las fibras orgánicas, la caída de la prenda o cómo te sentiste usándola..."
              className="w-full bg-[#f2f1e7]/30 border border-[#dfd8cb] rounded-lg p-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b6a450]"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || Boolean(successMsg)}
              className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {isPending ? "Publicando..." : "Publicar Reseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
