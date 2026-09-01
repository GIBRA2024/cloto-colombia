import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando siembra de datos (Seeding)...");

  // 1. Limpieza de datos previos en orden inverso de relaciones
  console.log("🧹 Limpiando registros existentes...");
  await prisma.orderCoupon.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();

  // 2. Creación de Categorías Jerárquicas
  console.log("📁 Creando categorías jerárquicas...");

  // Categorías Principales
  const catRopa = await prisma.category.create({
    data: {
      name: "Ropa & Moda",
      slug: "ropa-moda",
      description: "Prendas de vestir contemporáneas con materiales sostenibles y diseño atemporal.",
      imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
      orderIndex: 1,
    },
  });

  const catHogar = await prisma.category.create({
    data: {
      name: "Hogar & Muebles",
      slug: "hogar-muebles",
      description: "Mobiliario y piezas decorativas con estética minimalista, calidez y funcionalidad.",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      orderIndex: 2,
    },
  });

  // Subcategorías de Ropa
  const catHombre = await prisma.category.create({
    data: {
      name: "Hombre",
      slug: "hombre",
      parentId: catRopa.id,
      description: "Moda masculina casual, elegante y esencial.",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      orderIndex: 1,
    },
  });

  const catMujer = await prisma.category.create({
    data: {
      name: "Mujer",
      slug: "mujer",
      parentId: catRopa.id,
      description: "Prendas femeninas de cortes modernos y siluetas fluidas.",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      orderIndex: 2,
    },
  });

  // Sub-subcategorías
  const catCamisetas = await prisma.category.create({
    data: {
      name: "Camisetas & Tops",
      slug: "camisetas-tops",
      parentId: catHombre.id,
      orderIndex: 1,
    },
  });

  const catVestidos = await prisma.category.create({
    data: {
      name: "Vestidos & Enterizos",
      slug: "vestidos-enterizos",
      parentId: catMujer.id,
      orderIndex: 1,
    },
  });

  // Subcategorías de Hogar
  const catMuebles = await prisma.category.create({
    data: {
      name: "Mobiliario",
      slug: "mobiliario",
      parentId: catHogar.id,
      description: "Sofás, mesas, sillas y escritorios de diseño ergonómico.",
      imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
      orderIndex: 1,
    },
  });

  const catDecoracion = await prisma.category.create({
    data: {
      name: "Decoración & Iluminación",
      slug: "decoracion-iluminacion",
      parentId: catHogar.id,
      description: "Lámparas, jarrones, velas y textiles para transformar tus espacios.",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      orderIndex: 2,
    },
  });

  // 3. Creación de Colecciones
  console.log("✨ Creando colecciones...");
  const colNovedades = await prisma.collection.create({
    data: {
      name: "Nueva Colección 2026",
      slug: "nueva-coleccion-2026",
      description: "Los lanzamientos más recientes en moda y diseño de interiores.",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    },
  });

  const colNordico = await prisma.collection.create({
    data: {
      name: "Espacios Nórdicos & Minimal",
      slug: "espacios-nordicos",
      description: "Maderas naturales, tonos neutros y líneas limpias para tu hogar.",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    },
  });

  const colEsenciales = await prisma.collection.create({
    data: {
      name: "Esenciales de Temporada",
      slug: "esenciales-temporada",
      description: "Básicos premium que nunca pasan de moda.",
      imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
    },
  });

  // 4. Creación de Productos y Variantes
  console.log("🛋️ Creando productos y variantes...");

  // PRODUCTO 1: Sofá Minimalista
  const sofa = await prisma.product.create({
    data: {
      name: "Sofá Modular Nórdico 'Malmö'",
      slug: "sofa-modular-nordico-malmo",
      shortDescription: "Sofá de 3 puestos tapizado en lino natural de alta resistencia con estructura de madera maciza de roble.",
      description: "El sofá 'Malmö' combina la artesanía tradicional con la estética contemporánea escandinava. Su relleno de espuma de alta densidad indeformable garantiza máximo confort y durabilidad.",
      basePrice: 890.0,
      compareAtPrice: 1050.0,
      isPublished: true,
      isFeatured: true,
      weight: 48.5,
      width: 220.0,
      height: 82.0,
      depth: 95.0,
      categories: {
        create: [{ categoryId: catMuebles.id }, { categoryId: catHogar.id }],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }, { collectionId: colNordico.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
            altText: "Sofá Modular Nórdico Malmö color Beige en sala moderna",
            orderIndex: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
            altText: "Detalle de textura y acabado en roble del Sofá Malmö",
            orderIndex: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "SOF-MAL-BEI-3P",
            name: "Beige Arena / 3 Puestos",
            price: 890.0,
            compareAtPrice: 1050.0,
            stock: 12,
            size: "3 Puestos (220 cm)",
            color: "Beige Arena",
            colorHex: "#E3DAC9",
            material: "Lino Natural & Madera de Roble",
            weight: 48.5,
            width: 220.0,
            height: 82.0,
            depth: 95.0,
            isDefault: true,
            isActive: true,
          },
          {
            sku: "SOF-MAL-GRS-3P",
            name: "Gris Grafito / 3 Puestos",
            price: 890.0,
            compareAtPrice: 1050.0,
            stock: 8,
            size: "3 Puestos (220 cm)",
            color: "Gris Grafito",
            colorHex: "#4A4A4A",
            material: "Lino Natural & Madera de Roble",
            weight: 48.5,
            width: 220.0,
            height: 82.0,
            depth: 95.0,
            isDefault: false,
            isActive: true,
          },
          {
            sku: "SOF-MAL-BEI-4P",
            name: "Beige Arena / 4 Puestos (Chaise)",
            price: 1190.0,
            compareAtPrice: 1350.0,
            stock: 5,
            size: "4 Puestos c/ Chaise (280 cm)",
            color: "Beige Arena",
            colorHex: "#E3DAC9",
            material: "Lino Natural & Madera de Roble",
            weight: 62.0,
            width: 280.0,
            height: 82.0,
            depth: 160.0,
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // PRODUCTO 2: Mesa de Comedor de Roble
  await prisma.product.create({
    data: {
      name: "Mesa de Comedor Extensible 'Koben'",
      slug: "mesa-comedor-extensible-koben",
      shortDescription: "Mesa de comedor en madera maciza de roble con sistema de extensión oculto.",
      description: "Diseñada para compartir momentos únicos. Pasa de 6 a 10 comensales suavemente con su mecanismo de apertura alemán en acero inoxidable.",
      basePrice: 650.0,
      compareAtPrice: null,
      isPublished: true,
      isFeatured: true,
      weight: 38.0,
      width: 180.0,
      height: 75.0,
      depth: 90.0,
      categories: {
        create: [{ categoryId: catMuebles.id }, { categoryId: catHogar.id }],
      },
      collections: {
        create: [{ collectionId: colNordico.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
            altText: "Mesa de comedor Koben madera maciza",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "MES-KOB-ROB-180",
            name: "Roble Natural / 180-240cm",
            price: 650.0,
            stock: 15,
            size: "180x90 cm (Extensible a 240 cm)",
            color: "Roble Natural",
            colorHex: "#C2A378",
            material: "Madera Maciza de Roble FSC",
            weight: 38.0,
            width: 180.0,
            height: 75.0,
            depth: 90.0,
            isDefault: true,
            isActive: true,
          },
          {
            sku: "MES-KOB-NOG-180",
            name: "Nogal Oscuro / 180-240cm",
            price: 690.0,
            stock: 10,
            size: "180x90 cm (Extensible a 240 cm)",
            color: "Nogal Oscuro",
            colorHex: "#5A3D28",
            material: "Madera Maciza de Nogal FSC",
            weight: 39.5,
            width: 180.0,
            height: 75.0,
            depth: 90.0,
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // PRODUCTO 3: Lámpara de Pie Decorativa
  await prisma.product.create({
    data: {
      name: "Lámpara de Pie 'Lumina Arc'",
      slug: "lampara-pie-lumina-arc",
      shortDescription: "Lámpara de arco escultórica con base de mármol travertino y cúpula de latón cepillado.",
      description: "Una pieza de arte funcional que aporta luz cálida ambiental e indirecta para salones, rincones de lectura y oficinas contemporáneas.",
      basePrice: 195.0,
      compareAtPrice: 240.0,
      isPublished: true,
      isFeatured: true,
      weight: 12.0,
      width: 40.0,
      height: 185.0,
      depth: 110.0,
      categories: {
        create: [{ categoryId: catDecoracion.id }, { categoryId: catHogar.id }],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
            altText: "Lámpara de pie Lumina Arc en salón moderno",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "LAM-LUM-LAT-TRA",
            name: "Latón Cepillado & Travertino",
            price: 195.0,
            compareAtPrice: 240.0,
            stock: 25,
            size: "185 cm Alto",
            color: "Oro Cepillado",
            colorHex: "#D4AF37",
            material: "Mármol Travertino & Latón",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "LAM-LUM-NEG-MAR",
            name: "Negro Mate & Mármol Negro",
            price: 195.0,
            compareAtPrice: 240.0,
            stock: 18,
            size: "185 cm Alto",
            color: "Negro Mate",
            colorHex: "#1C1C1C",
            material: "Mármol Marquina & Acero Negro",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // PRODUCTO 4: Camiseta de Algodón Pesado (Ropa Hombre)
  await prisma.product.create({
    data: {
      name: "Camiseta Heavyweight Cotton 'Atelier'",
      slug: "camiseta-heavyweight-cotton-atelier",
      shortDescription: "Camiseta de corte boxy fit en algodón orgánico peinado de 240 GSM.",
      description: "Confeccionada con algodón de alto gramaje para una caída estructurada y durabilidad excepcional. Cuello acanalado reforzado que no se deforma.",
      basePrice: 45.0,
      compareAtPrice: 55.0,
      isPublished: true,
      isFeatured: true,
      weight: 0.35,
      categories: {
        create: [{ categoryId: catCamisetas.id }, { categoryId: catHombre.id }, { categoryId: catRopa.id }],
      },
      collections: {
        create: [{ collectionId: colEsenciales.id }, { collectionId: colNovedades.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
            altText: "Camiseta Heavyweight Blanca",
            orderIndex: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80",
            altText: "Camiseta Heavyweight Negra",
            orderIndex: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "TSH-ATL-WHT-S",
            name: "Blanco Óptico / S",
            price: 45.0,
            compareAtPrice: 55.0,
            stock: 30,
            size: "S",
            color: "Blanco Óptico",
            colorHex: "#FFFFFF",
            material: "100% Algodón Orgánico 240 GSM",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "TSH-ATL-WHT-M",
            name: "Blanco Óptico / M",
            price: 45.0,
            compareAtPrice: 55.0,
            stock: 45,
            size: "M",
            color: "Blanco Óptico",
            colorHex: "#FFFFFF",
            material: "100% Algodón Orgánico 240 GSM",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "TSH-ATL-WHT-L",
            name: "Blanco Óptico / L",
            price: 45.0,
            compareAtPrice: 55.0,
            stock: 40,
            size: "L",
            color: "Blanco Óptico",
            colorHex: "#FFFFFF",
            material: "100% Algodón Orgánico 240 GSM",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "TSH-ATL-BLK-S",
            name: "Negro Carbón / S",
            price: 45.0,
            compareAtPrice: 55.0,
            stock: 25,
            size: "S",
            color: "Negro Carbón",
            colorHex: "#111111",
            material: "100% Algodón Orgánico 240 GSM",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "TSH-ATL-BLK-M",
            name: "Negro Carbón / M",
            price: 45.0,
            compareAtPrice: 55.0,
            stock: 50,
            size: "M",
            color: "Negro Carbón",
            colorHex: "#111111",
            material: "100% Algodón Orgánico 240 GSM",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "TSH-ATL-BLK-L",
            name: "Negro Carbón / L",
            price: 45.0,
            compareAtPrice: 55.0,
            stock: 35,
            size: "L",
            color: "Negro Carbón",
            colorHex: "#111111",
            material: "100% Algodón Orgánico 240 GSM",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // PRODUCTO 5: Vestido Midi de Lino (Ropa Mujer)
  await prisma.product.create({
    data: {
      name: "Vestido Midi de Lino 'Aura'",
      slug: "vestido-midi-lino-aura",
      shortDescription: "Vestido midi con escote cuadrado, tirantes ajustables y espalda elástica en nido de abeja.",
      description: "Fresco, sofisticado y sumamente versátil. Elaborado en 100% lino europeo lavado a la piedra para máxima suavidad y caída natural.",
      basePrice: 85.0,
      compareAtPrice: null,
      isPublished: true,
      isFeatured: true,
      weight: 0.45,
      categories: {
        create: [{ categoryId: catVestidos.id }, { categoryId: catMujer.id }, { categoryId: catRopa.id }],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }, { collectionId: colEsenciales.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
            altText: "Vestido Midi de Lino color Terracota",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "DRS-AUR-TER-S",
            name: "Terracota / S",
            price: 85.0,
            stock: 20,
            size: "S",
            color: "Terracota",
            colorHex: "#C86D51",
            material: "100% Lino Europeo",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "DRS-AUR-TER-M",
            name: "Terracota / M",
            price: 85.0,
            stock: 25,
            size: "M",
            color: "Terracota",
            colorHex: "#C86D51",
            material: "100% Lino Europeo",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "DRS-AUR-TER-L",
            name: "Terracota / L",
            price: 85.0,
            stock: 15,
            size: "L",
            color: "Terracota",
            colorHex: "#C86D51",
            material: "100% Lino Europeo",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "DRS-AUR-OLI-M",
            name: "Verde Oliva / M",
            price: 85.0,
            stock: 22,
            size: "M",
            color: "Verde Oliva",
            colorHex: "#556B2F",
            material: "100% Lino Europeo",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 5. Creación de Cupones de Descuento
  console.log("🎟️ Creando cupones promocionales...");
  await prisma.coupon.createMany({
    data: [
      {
        code: "BIENVENIDO10",
        description: "10% de descuento en tu primera compra en toda la tienda.",
        discountType: "PERCENTAGE",
        discountValue: 10.0,
        minOrderAmount: 30.0,
        usageLimit: 1000,
        isActive: true,
      },
      {
        code: "HOGAR2026",
        description: "$50.00 de descuento en compras mayores a $300 en muebles y decoración.",
        discountType: "FIXED_AMOUNT",
        discountValue: 50.0,
        minOrderAmount: 300.0,
        usageLimit: 500,
        isActive: true,
      },
      {
        code: "ENVIOGRATIS",
        description: "Envío estándar gratuito sin monto mínimo.",
        discountType: "FREE_SHIPPING",
        discountValue: 0.0,
        isActive: true,
      },
    ],
  });

  console.log("✅ Seeding completado con éxito. ¡Catálogo listo para operar!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
