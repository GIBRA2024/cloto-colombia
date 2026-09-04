import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Sparkles, Clock, Feather } from "lucide-react";
import { ColombiaFlag } from "@/components/ui/BrandIcons";

export const metadata = {
  title: "Sobre Nosotros | Cloto Colombia - Moda Femenina Consciente",
  description:
    "Conoce la historia, misión, visión y valores de Cloto Colombia. Prendas atemporales diseñadas con telas orgánicas y procesos 100% colombianos.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-24 font-sans-ui">
      {/* 1. HERO EDITORIAL SOBRE NOSOTROS */}
      <section className="relative py-24 sm:py-32 bg-[#e9e5d9] border-b border-[#dfd8cb] overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs uppercase tracking-[0.35em] text-[#8d9773] font-semibold">
            Cloto Sustainable Lifestyle • Marca de Estilo Sostenible
          </span>
          <h1 className="font-serif-title text-4xl sm:text-6xl text-[#1c1917] font-light leading-tight">
            Vestir, Habitar y Consumir <br />
            <span className="italic font-normal text-[#b6a450]">un estilo de vida que elige mejor</span>
          </h1>
          <p className="font-serif-body text-stone-700 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Cloto nace en Colombia con la misión de transformar hábitos para transformar el futuro a través de prendas, accesorios y productos para el hogar con diseño y conciencia sostenible.
          </p>
        </div>
      </section>

      {/* 2. MANIFIESTO & ORIGEN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
              alt="Confección y diseño en Cloto Colombia"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#b6a450] font-semibold">
              Inspiración Orgánica
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917]">
              Inspiradas en la Mariposa y la Belleza Natural de Colombia
            </h2>
            <div className="font-serif-body text-stone-600 text-sm space-y-4 leading-relaxed">
              <p>
                Nuestras prendas, diseñadas y confeccionadas localmente con telas orgánicas y ecológicas, celebran la autenticidad de una mujer que no necesita seguir tendencias efímeras para destacar.
              </p>
              <p>
                Inspiradas en la mariposa, los paisajes, la flora y la fauna de nuestro país, cada colección es un homenaje a la elegancia etérea y a la fuerza serena de lo femenino.
              </p>
              <p>
                Creemos en un clóset que habite la vida de personas conscientes: que encuentran belleza en lo simple, confort en lo natural y armonía en su propio espacio.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#dfd8cb]">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <ColombiaFlag className="w-4 h-4" />
                </div>
                <h4 className="font-serif-title text-sm text-[#1c1917]">100% Hecho en Colombia</h4>
                <p className="text-[11px] text-stone-500">Talleres éticos con manos artesanas locales</p>
              </div>
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-[#8d9773]/10 text-[#5c6643] flex items-center justify-center">
                  <Leaf className="w-4 h-4 stroke-[1.75]" />
                </div>
                <h4 className="font-serif-title text-sm text-[#1c1917]">Fibras Nobles & Eco</h4>
                <p className="text-[11px] text-stone-500">Algodón orgánico, seda y textiles ecológicos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISIÓN, VISIÓN & PROPUESTA DE VALOR */}
      <section className="bg-white py-16 border-y border-[#dfd8cb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="bg-[#f2f1e7] p-8 rounded-2xl border border-[#dfd8cb] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#8d9773]/20 flex items-center justify-center text-[#5c6643] text-lg font-bold">
                M
              </div>
              <h3 className="font-serif-title text-2xl text-[#1c1917]">Nuestra Misión</h3>
              <p className="font-serif-body text-xs sm:text-sm text-stone-600 leading-relaxed">
                Transformar la manera de vestir, habitar y consumir, creando prendas, accesorios y productos para el hogar con diseño, propósito y conciencia sostenible. Un estilo de vida que elige mejor.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-[#f2f1e7] p-8 rounded-2xl border border-[#dfd8cb] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#b6a450]/20 flex items-center justify-center text-[#8c7b30] text-lg font-bold">
                V
              </div>
              <h3 className="font-serif-title text-2xl text-[#1c1917]">Nuestra Visión</h3>
              <p className="font-serif-body text-xs sm:text-sm text-stone-600 leading-relaxed">
                Ser una marca referente de estilo sostenible. Transformar hábitos para transformar el futuro.
              </p>
            </div>

            {/* Propuesta de Valor */}
            <div className="bg-[#f2f1e7] p-8 rounded-2xl border border-[#dfd8cb] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#9c6361]/20 flex items-center justify-center text-[#834442] text-lg font-bold">
                P
              </div>
              <h3 className="font-serif-title text-2xl text-[#1c1917]">Propuesta de Valor</h3>
              <p className="font-serif-body text-xs sm:text-sm text-stone-600 leading-relaxed">
                Prendas y objetos con diseño atemporal y propósito, fabricados responsablemente en Colombia con fibras orgánicas y ecológicas para quienes eligen vivir en armonía con su entorno.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALORES DE MARCA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d9773] font-semibold">
            Pilares Fundamentales
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl text-[#1c1917]">
            Valores que nos Guían
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl border border-[#dfd8cb] text-center space-y-3 group hover:border-[#b6a450] transition-colors">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#b6a450]/15 text-[#8c7b30] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-serif-title text-base text-[#1c1917]">Autenticidad</h4>
            <p className="text-xs text-stone-500 font-serif-body">Honrar lo genuino sin seguir modas pasajeras.</p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#dfd8cb] text-center space-y-3 group hover:border-[#8d9773] transition-colors">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#8d9773]/10 text-[#5c6643] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Leaf className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-serif-title text-base text-[#1c1917]">Sostenibilidad</h4>
            <p className="text-xs text-stone-500 font-serif-body">Procesos responsables con el planeta y su gente.</p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#dfd8cb] text-center space-y-3 group hover:border-[#1c1917] transition-colors">
            <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 text-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-serif-title text-base text-[#1c1917]">Atemporalidad</h4>
            <p className="text-xs text-stone-500 font-serif-body">Prendas duraderas que trascienden las estaciones.</p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#dfd8cb] text-center space-y-3 group hover:border-[#9c6361] transition-colors">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#9c6361]/15 text-[#9c6361] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Feather className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-serif-title text-base text-[#1c1917]">Calma & Sobriedad</h4>
            <p className="text-xs text-stone-500 font-serif-body">Elegancia sutil y naturalidad sin pretensión.</p>
          </div>
        </div>
      </section>

      {/* 5. CTA A CATÁLOGO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-10">
        <h3 className="font-serif-title text-3xl text-[#1c1917]">
          Te invitamos a descubrir nuestras colecciones
        </h3>
        <p className="font-serif-body text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Encuentra esa prenda especial que te hará sentir cómoda, bella y auténtica en cada instante.
        </p>
        <div>
          <Link
            href="/catalogo"
            className="inline-block bg-[#1c1917] hover:bg-[#b6a450] text-[#f2f1e7] text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-md transition-all duration-300 shadow-lg"
          >
            Explorar Catálogo Completo
          </Link>
        </div>
      </section>
    </div>
  );
}
