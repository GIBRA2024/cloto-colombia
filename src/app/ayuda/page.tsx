import React from "react";
import Link from "next/link";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Servicio al Cliente & Ayuda | Cloto Colombia",
  description:
    "Guía de tallas, políticas de envío nacional, cambios, garantías y preguntas frecuentes de Cloto Colombia.",
};

export default function HelpPage() {
  return (
    <div className="bg-[#f8f7f4] min-h-screen pb-24 font-sans-ui text-stone-800">
      {/* 1. Header Editorial */}
      <section className="bg-[#1c1917] text-[#f2f1e7] py-16 sm:py-20 border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#b6a450] font-semibold">
            Centro de Asistencia • Cloto Colombia
          </span>
          <h1 className="font-serif-title text-3xl sm:text-5xl font-light">
            Servicio al Cliente & Ayuda
          </h1>
          <p className="font-serif-body text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Resolvemos tus dudas sobre tallaje, envíos en Colombia, proceso de cambios y cuidados de tus prendas para que tu experiencia sea perfecta.
          </p>

          {/* Accesos directos rápidos */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <a
              href="#tallas"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#b6a450] hover:text-stone-950 text-xs text-stone-200 transition-colors"
            >
              Guía de Tallas
            </a>
            <a
              href="#envios"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#b6a450] hover:text-stone-950 text-xs text-stone-200 transition-colors"
            >
              Envíos Nacionales
            </a>
            <a
              href="#cambios"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#b6a450] hover:text-stone-950 text-xs text-stone-200 transition-colors"
            >
              Cambios & Garantías
            </a>
            <a
              href="#faq"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#b6a450] hover:text-stone-950 text-xs text-stone-200 transition-colors"
            >
              Preguntas Frecuentes
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* SECCIÓN 1: GUÍA DE TALLAS & CUIDADOS */}
        <section id="tallas" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#dfd8cb] pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#b6a450] font-bold">
              Medidas y Ajuste
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
              Guía de Tallas & Cuidados de Telas
            </h2>
          </div>

          <p className="font-serif-body text-xs sm:text-sm text-stone-600 leading-relaxed">
            Nuestras siluetas están pensadas para brindar soltura, fluidez y máximo confort. Toma tus medidas con una cinta métrica en posición relajada:
          </p>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-stone-600 text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Talla</th>
                  <th className="py-3 px-4 font-bold">Busto (cm)</th>
                  <th className="py-3 px-4 font-bold">Cintura (cm)</th>
                  <th className="py-3 px-4 font-bold">Cadera (cm)</th>
                  <th className="py-3 px-4 font-bold">Equivalencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                <tr className="hover:bg-stone-50/50">
                  <td className="py-3 px-4 font-bold text-stone-900">S (Small)</td>
                  <td className="py-3 px-4">84 - 89 cm</td>
                  <td className="py-3 px-4">64 - 69 cm</td>
                  <td className="py-3 px-4">90 - 95 cm</td>
                  <td className="py-3 px-4 text-stone-500">Talla 6 - 8</td>
                </tr>
                <tr className="hover:bg-stone-50/50">
                  <td className="py-3 px-4 font-bold text-stone-900">M (Medium)</td>
                  <td className="py-3 px-4">90 - 95 cm</td>
                  <td className="py-3 px-4">70 - 75 cm</td>
                  <td className="py-3 px-4">96 - 101 cm</td>
                  <td className="py-3 px-4 text-stone-500">Talla 8 - 10</td>
                </tr>
                <tr className="hover:bg-stone-50/50">
                  <td className="py-3 px-4 font-bold text-stone-900">L (Large)</td>
                  <td className="py-3 px-4">96 - 102 cm</td>
                  <td className="py-3 px-4">76 - 82 cm</td>
                  <td className="py-3 px-4">102 - 108 cm</td>
                  <td className="py-3 px-4 text-stone-500">Talla 10 - 12</td>
                </tr>
                <tr className="hover:bg-stone-50/50">
                  <td className="py-3 px-4 font-bold text-stone-900">XL (Extra Large)</td>
                  <td className="py-3 px-4">103 - 110 cm</td>
                  <td className="py-3 px-4">83 - 90 cm</td>
                  <td className="py-3 px-4">109 - 116 cm</td>
                  <td className="py-3 px-4 text-stone-500">Talla 12 - 14</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#f2f1e7] rounded-xl border border-[#dfd8cb] space-y-2">
            <h4 className="font-serif-title text-sm font-semibold text-[#1c1917]">
              Cuidados Recomendados para Fibras Nobles:
            </h4>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
              <li>Lavar a mano o en ciclo delicado con agua fría.</li>
              <li>Usar jabón suave para prendas delicadas y evitar blanqueadores.</li>
              <li>Secar a la sombra, preferiblemente en superficie plana o gancho acolchado.</li>
              <li>Planchar a baja temperatura del revés o con vapor suave.</li>
            </ul>
          </div>
        </section>

        {/* SECCIÓN 2: ENVÍOS & COBERTURA NACIONAL */}
        <section id="envios" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#dfd8cb] pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#b6a450] font-bold">
              Despachos en Colombia
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
              Envíos & Cobertura Nacional
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
              <span className="font-bold text-[#1c1917] block text-sm">Ciudades Principales</span>
              <p className="text-stone-600">
                Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y Pereira:
              </p>
              <p className="font-semibold text-emerald-800">
                Tiempo de entrega: 2 a 4 días hábiles.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
              <span className="font-bold text-[#1c1917] block text-sm">Resto del País y Municipios</span>
              <p className="text-stone-600">
                Poblaciones intermedias y cobertura nacional extendida:
              </p>
              <p className="font-semibold text-emerald-800">
                Tiempo de entrega: 3 a 6 días hábiles.
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-600">
            Una vez procesado tu pedido, te compartiremos el número de guía para que puedas rastrear el estado del envío en tiempo real.
          </p>
        </section>

        {/* SECCIÓN 3: CAMBIOS & GARANTÍAS */}
        <section id="cambios" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#dfd8cb] pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#b6a450] font-bold">
              Tranquilidad en tu Compra
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
              Cambios, Garantías & Devoluciones
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
              <h4 className="font-bold text-[#1c1917] text-sm">Política de Cambios (30 Días)</h4>
              <p>
                Si necesitas cambiar tu prenda por talla o preferencia de modelo, tienes hasta <strong>30 días calendario</strong> posteriores a la entrega. La prenda debe estar en perfecto estado, sin usar, con sus etiquetas originales y empaque.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
              <h4 className="font-bold text-[#1c1917] text-sm">Garantía de Calidad</h4>
              <p>
                Todas nuestras prendas cuentan con <strong>90 días de garantía</strong> por costuras, cremalleras o defectos de confección. Cuidamos cada detalle artesanal para que tu experiencia sea duradera.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: PREGUNTAS FRECUENTES (FAQ) */}
        <section id="faq" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#dfd8cb] pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#b6a450] font-bold">
              Respuestas Rápidas
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl text-[#1c1917]">
              Preguntas Frecuentes (FAQ)
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
              <span className="font-bold text-[#1c1917] block text-sm">¿Cuáles son los medios de pago aceptados?</span>
              <p className="text-stone-600">
                Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PSE, Nequi, Daviplata y transferencias bancarias a través de nuestra pasarela de pagos segura.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
              <span className="font-bold text-[#1c1917] block text-sm">¿Cómo puedo rastrear mi pedido?</span>
              <p className="text-stone-600">
                Puedes ingresar a la sección <Link href="/cuenta/pedidos" className="text-[#b6a450] font-semibold underline">Mis Pedidos</Link> en tu perfil para consultar el estado del despacho en cualquier momento.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
              <span className="font-bold text-[#1c1917] block text-sm">¿Tienen asesoría personalizada para regalos o medidas?</span>
              <p className="text-stone-600">
                ¡Sí! Nuestro equipo de atención VIP te asesora vía WhatsApp en la elección de siluetas, empaques para regalo y combinación de prendas.
              </p>
            </div>
          </div>
        </section>

        {/* Banner de Contacto Directo */}
        <div className="p-8 bg-[#1c1917] text-[#f2f1e7] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif-title text-xl text-white">¿Prefieres asesoría personalizada directa?</h3>
            <p className="text-xs text-stone-300">Nuestras asesoras de moda están disponibles para ayudarte de inmediato.</p>
          </div>
          <a
            href={getWhatsAppLink("Hola Cloto, tengo una pregunta sobre mi compra")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#b6a450] hover:bg-[#a39243] text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Chatear por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
