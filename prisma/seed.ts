import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando siembra de datos de Cloto Colombia (Seeding)...");

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

  // ------------------------------------------------------
  // 2. CREACIÓN DE CATEGORÍAS JERÁRQUICAS
  // ------------------------------------------------------
  console.log("📁 Creando las 4 líneas principales y sus subcategorías...");

  // ===== LÍNEA 1: CLOTO PIJAMAS & ROPA DE DESCANSO =====
  const linePijamas = await prisma.category.create({
    data: {
      name: "Cloto Pijamas & Descanso",
      slug: "cloto-pijamas",
      description: "Pijamas y prendas de descanso con telas ultrasuaves, satín de lujo y cortes ergonómicos para el máximo confort.",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      orderIndex: 1,
    },
  });

  // Categoría Pijamas
  const catPijamas = await prisma.category.create({
    data: {
      name: "Pijamas",
      slug: "pijamas",
      parentId: linePijamas.id,
      description: "Colección completa de pijamas dividida por estilo: Básica, Clásica y Casual.",
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
      orderIndex: 1,
    },
  });

  // Categoría Loungewear / Ropa de Descanso
  const catLoungewear = await prisma.category.create({
    data: {
      name: "Ropa de Descanso & Batas",
      slug: "ropa-descanso-batas",
      parentId: linePijamas.id,
      description: "Batas, kimonos y sets relajados para estar en casa.",
      imageUrl: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80",
      orderIndex: 2,
    },
  });

  // Subcategorías de Pijamas: 1.1 Básica, 1.2 Clásica, 1.3 Casual
  // --- 1.1 PIJAMA BÁSICA (Blusa con tiras) ---
  const catPijamaBasica = await prisma.category.create({
    data: {
      name: "Pijama Básica (Tiras)",
      slug: "pijama-basica",
      parentId: catPijamas.id,
      description: "Top o blusa de tirantes finos ajustables. Diseños frescos, ligeros y versátiles.",
      orderIndex: 1,
    },
  });

  const catBasicaShort = await prisma.category.create({
    data: {
      name: "Básica con Short",
      slug: "basica-con-short",
      parentId: catPijamaBasica.id,
      orderIndex: 1,
    },
  });

  const catBasicaPantalon = await prisma.category.create({
    data: {
      name: "Básica con Pantalón",
      slug: "basica-con-pantalon",
      parentId: catPijamaBasica.id,
      orderIndex: 2,
    },
  });

  await prisma.category.create({
    data: {
      name: "Básica con Capri",
      slug: "basica-con-capri",
      parentId: catPijamaBasica.id,
      orderIndex: 3,
    },
  });

  await prisma.category.create({
    data: {
      name: "Básica con Pescador",
      slug: "basica-con-pescador",
      parentId: catPijamaBasica.id,
      orderIndex: 4,
    },
  });

  const catBatolaBasica = await prisma.category.create({
    data: {
      name: "Batola Básica",
      slug: "batola-basica",
      parentId: catPijamaBasica.id,
      description: "Batolas y camisones frescos de una sola pieza con tiras.",
      orderIndex: 5,
    },
  });

  // --- 1.2 PIJAMA CLÁSICA (Con Camisa abotonada y cuello) ---
  const catPijamaClasica = await prisma.category.create({
    data: {
      name: "Pijama Clásica (Camisera)",
      slug: "pijama-clasica",
      parentId: catPijamas.id,
      description: "Elegancia tradicional con camisa abotonada al frente, cuello con solapa y vivos contrastantes.",
      orderIndex: 2,
    },
  });

  const catClasicaShort = await prisma.category.create({
    data: {
      name: "Clásica con Short",
      slug: "clasica-con-short",
      parentId: catPijamaClasica.id,
      orderIndex: 1,
    },
  });

  const catClasicaPantalon = await prisma.category.create({
    data: {
      name: "Clásica con Pantalón",
      slug: "clasica-con-pantalon",
      parentId: catPijamaClasica.id,
      orderIndex: 2,
    },
  });

  await prisma.category.create({
    data: {
      name: "Clásica con Capri",
      slug: "clasica-con-capri",
      parentId: catPijamaClasica.id,
      orderIndex: 3,
    },
  });

  await prisma.category.create({
    data: {
      name: "Clásica con Pescador",
      slug: "clasica-con-pescador",
      parentId: catPijamaClasica.id,
      orderIndex: 4,
    },
  });

  const catBatolaClasica = await prisma.category.create({
    data: {
      name: "Batola Clásica / Camisera",
      slug: "batola-clasica",
      parentId: catPijamaClasica.id,
      description: "Batola tipo camisón abotonado de largo medio con cuello camisero.",
      orderIndex: 5,
    },
  });

  // --- 1.3 PIJAMA CASUAL (Relajada / Manga Corta / Cuello redondo o en V) ---
  const catPijamaCasual = await prisma.category.create({
    data: {
      name: "Pijama Casual",
      slug: "pijama-casual",
      parentId: catPijamas.id,
      description: "Prendas informales, camisetas cómodas y cortes relajados ideales tanto para dormir como para estar en casa.",
      orderIndex: 3,
    },
  });

  const catCasualShort = await prisma.category.create({
    data: {
      name: "Casual con Short",
      slug: "casual-con-short",
      parentId: catPijamaCasual.id,
      orderIndex: 1,
    },
  });

  await prisma.category.create({
    data: {
      name: "Casual con Pantalón",
      slug: "casual-con-pantalon",
      parentId: catPijamaCasual.id,
      orderIndex: 2,
    },
  });

  await prisma.category.create({
    data: {
      name: "Casual con Capri",
      slug: "casual-con-capri",
      parentId: catPijamaCasual.id,
      orderIndex: 3,
    },
  });

  await prisma.category.create({
    data: {
      name: "Casual con Pescador",
      slug: "casual-con-pescador",
      parentId: catPijamaCasual.id,
      orderIndex: 4,
    },
  });

  await prisma.category.create({
    data: {
      name: "Batola Casual",
      slug: "batola-casual",
      parentId: catPijamaCasual.id,
      orderIndex: 5,
    },
  });

  // Subcategorías de Loungewear
  const catBatas = await prisma.category.create({
    data: {
      name: "Batas & Kimonos",
      slug: "batas-kimonos",
      parentId: catLoungewear.id,
      orderIndex: 1,
    },
  });

  // ===== LÍNEA 2: CLOTO - IKA SWIMSUIT (Bañadores y Ropa Deportiva) =====
  const lineIka = await prisma.category.create({
    data: {
      name: "Cloto - Ika Swimsuit",
      slug: "cloto-ika-swimsuit",
      description: "Trajes de baño, bikinis, salidas de playa y ropa deportiva con tecnología de secado rápido y protección UV.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      orderIndex: 2,
    },
  });

  const catBanadores = await prisma.category.create({
    data: {
      name: "Bañadores & Enterizos",
      slug: "banadores-enterizos",
      parentId: lineIka.id,
      orderIndex: 1,
    },
  });

  await prisma.category.create({
    data: {
      name: "Bikinis & Sets de Playa",
      slug: "bikinis-sets",
      parentId: lineIka.id,
      orderIndex: 2,
    },
  });

  await prisma.category.create({
    data: {
      name: "Ropa Deportiva / Activewear",
      slug: "ropa-deportiva",
      parentId: lineIka.id,
      orderIndex: 3,
    },
  });

  // ===== LÍNEA 3: CLOTO - REBECCA (Ropa Casual) =====
  const lineRebecca = await prisma.category.create({
    data: {
      name: "Cloto - Rebecca",
      slug: "cloto-rebecca",
      description: "Moda casual femenina y contemporánea con siluetas elegantes, linos naturales y prendas versátiles.",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
      orderIndex: 3,
    },
  });

  const catVestidos = await prisma.category.create({
    data: {
      name: "Vestidos",
      slug: "vestidos",
      parentId: lineRebecca.id,
      orderIndex: 1,
    },
  });

  await prisma.category.create({
    data: {
      name: "Blusas & Tops",
      slug: "blusas-tops",
      parentId: lineRebecca.id,
      orderIndex: 2,
    },
  });

  await prisma.category.create({
    data: {
      name: "Pantalones & Faldas",
      slug: "pantalones-faldas",
      parentId: lineRebecca.id,
      orderIndex: 3,
    },
  });

  // ===== LÍNEA 4: CLOTO HOME (Lencería de Hogar) =====
  const lineHome = await prisma.category.create({
    data: {
      name: "Cloto Home",
      slug: "cloto-home",
      description: "Lencería y textiles de hogar con los más altos estándares de calidad, suavidad y diseño atemporal.",
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
      orderIndex: 4,
    },
  });

  const catRopaCama = await prisma.category.create({
    data: {
      name: "Ropa de Cama & Duvets",
      slug: "ropa-cama-duvets",
      parentId: lineHome.id,
      orderIndex: 1,
    },
  });

  await prisma.category.create({
    data: {
      name: "Baño & Toallas",
      slug: "bano-toallas",
      parentId: lineHome.id,
      orderIndex: 2,
    },
  });

  await prisma.category.create({
    data: {
      name: "Mesa & Mantelería",
      slug: "mesa-manteleria",
      parentId: lineHome.id,
      orderIndex: 3,
    },
  });

  // ------------------------------------------------------
  // 3. CREACIÓN DE COLECCIONES DESTACADAS
  // ------------------------------------------------------
  console.log("✨ Creando colecciones de marketing...");
  const colNovedades = await prisma.collection.create({
    data: {
      name: "Nueva Colección 2026",
      slug: "nueva-coleccion-2026",
      description: "Lo más reciente en diseño de pijamas, descanso y moda.",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    },
  });

  const colSatin = await prisma.collection.create({
    data: {
      name: "Colección Satín & Seda Luxury",
      slug: "satin-seda-luxury",
      description: "Tacto sedoso, brillo sutil y máxima ligereza sobre tu piel.",
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
    },
  });

  const colBestSellers = await prisma.collection.create({
    data: {
      name: "Más Vendidos / Best Sellers",
      slug: "mas-vendidos",
      description: "Las piezas favoritas de nuestras clientas.",
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    },
  });

  // ------------------------------------------------------
  // 4. CREACIÓN DE PRODUCTOS Y VARIANTES (PIJAMAS & OTRAS LÍNEAS)
  // ------------------------------------------------------
  console.log("👗 Creando productos con variantes de color y talla...");

  // 1. Pijama Básica con Short: "Satín Romance"
  await prisma.product.create({
    data: {
      name: "Pijama Básica Short 'Satín Romance'",
      slug: "pijama-basica-short-satin-romance",
      shortDescription: "Blusa de tirantes finos ajustables con short a juego y delicados detalles en encaje.",
      description: "Elaborada en satín de seda de alta densidad con acabado perlado. La blusa con escote en V y tirantes regulables ofrece un calce perfecto, mientras que el short cuenta con elástico suave que no marca la piel.",
      basePrice: 129000.0,
      compareAtPrice: 149000.0,
      isPublished: true,
      isFeatured: true,
      weight: 0.25,
      categories: {
        create: [
          { categoryId: linePijamas.id },
          { categoryId: catPijamas.id },
          { categoryId: catPijamaBasica.id },
          { categoryId: catBasicaShort.id },
        ],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }, { collectionId: colSatin.id }, { collectionId: colBestSellers.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
            altText: "Pijama Básica Short Satín Romance en color Rosa Palo",
            orderIndex: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
            altText: "Detalle de encaje y tiras ajustables Pijama Básica",
            orderIndex: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "PIJ-BAS-SHT-ROS-S",
            name: "Rosa Palo / S",
            price: 129000.0,
            compareAtPrice: 149000.0,
            stock: 18,
            size: "S",
            color: "Rosa Palo",
            colorHex: "#F4C2C2",
            material: "Satín de Seda Premium",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "PIJ-BAS-SHT-ROS-M",
            name: "Rosa Palo / M",
            price: 129000.0,
            compareAtPrice: 149000.0,
            stock: 24,
            size: "M",
            color: "Rosa Palo",
            colorHex: "#F4C2C2",
            material: "Satín de Seda Premium",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "PIJ-BAS-SHT-ROS-L",
            name: "Rosa Palo / L",
            price: 129000.0,
            compareAtPrice: 149000.0,
            stock: 15,
            size: "L",
            color: "Rosa Palo",
            colorHex: "#F4C2C2",
            material: "Satín de Seda Premium",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "PIJ-BAS-SHT-AZU-M",
            name: "Azul Medianoche / M",
            price: 129000.0,
            compareAtPrice: 149000.0,
            stock: 20,
            size: "M",
            color: "Azul Medianoche",
            colorHex: "#0D1B2A",
            material: "Satín de Seda Premium",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "PIJ-BAS-SHT-AZU-L",
            name: "Azul Medianoche / L",
            price: 129000.0,
            compareAtPrice: 149000.0,
            stock: 12,
            size: "L",
            color: "Azul Medianoche",
            colorHex: "#0D1B2A",
            material: "Satín de Seda Premium",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 2. Pijama Básica con Pantalón: "Algodón Pima Serena"
  await prisma.product.create({
    data: {
      name: "Pijama Básica Pantalón 'Algodón Serena'",
      slug: "pijama-basica-pantalon-algodon-serena",
      shortDescription: "Top de tiras ajustables y pantalón largo holgado en 100% Algodón Pima hipoalergénico.",
      description: "Frescura y suavidad natural para tus noches. Pantalón de tiro medio con bolsillos laterales y blusa de tirantes con doble forro en busto para mayor discreción y comodidad.",
      basePrice: 159000.0,
      compareAtPrice: null,
      isPublished: true,
      isFeatured: true,
      weight: 0.38,
      categories: {
        create: [
          { categoryId: linePijamas.id },
          { categoryId: catPijamas.id },
          { categoryId: catPijamaBasica.id },
          { categoryId: catBasicaPantalon.id },
        ],
      },
      collections: {
        create: [{ collectionId: colBestSellers.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80",
            altText: "Pijama Básica Pantalón Algodón Serena",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "PIJ-BAS-PNT-GRI-S",
            name: "Gris Perla / S",
            price: 159000.0,
            stock: 15,
            size: "S",
            color: "Gris Perla",
            colorHex: "#E5E5E5",
            material: "100% Algodón Pima",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "PIJ-BAS-PNT-GRI-M",
            name: "Gris Perla / M",
            price: 159000.0,
            stock: 20,
            size: "M",
            color: "Gris Perla",
            colorHex: "#E5E5E5",
            material: "100% Algodón Pima",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "PIJ-BAS-PNT-LIL-M",
            name: "Lila Pastel / M",
            price: 159000.0,
            stock: 18,
            size: "M",
            color: "Lila Pastel",
            colorHex: "#D8BFD8",
            material: "100% Algodón Pima",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 3. Batola Básica: "Batola Tiras Silk Touch"
  await prisma.product.create({
    data: {
      name: "Batola Básica de Tiras 'Silk Touch'",
      slug: "batola-basica-tiras-silk-touch",
      shortDescription: "Batola corta de silueta fluida, escote sutil y tiras graduables.",
      description: "Una prenda icónica de una sola pieza. Confeccionada en satín elásticado que se desliza suavemente sobre tu cuerpo garantizando frescura y elegancia.",
      basePrice: 119000.0,
      compareAtPrice: 139000.0,
      isPublished: true,
      isFeatured: false,
      weight: 0.2,
      categories: {
        create: [
          { categoryId: linePijamas.id },
          { categoryId: catPijamas.id },
          { categoryId: catPijamaBasica.id },
          { categoryId: catBatolaBasica.id },
        ],
      },
      collections: {
        create: [{ collectionId: colSatin.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
            altText: "Batola Básica de Tiras en Satín",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "BAT-BAS-MAR-S",
            name: "Marfil / S",
            price: 119000.0,
            stock: 12,
            size: "S",
            color: "Marfil",
            colorHex: "#FFFFF0",
            material: "Satín Seda Elastano",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "BAT-BAS-MAR-M",
            name: "Marfil / M",
            price: 119000.0,
            stock: 16,
            size: "M",
            color: "Marfil",
            colorHex: "#FFFFF0",
            material: "Satín Seda Elastano",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 4. Pijama Clásica con Short: "Camisera Victoria Short"
  await prisma.product.create({
    data: {
      name: "Pijama Clásica Camisera con Short 'Victoria'",
      slug: "pijama-clasica-camisera-short-victoria",
      shortDescription: "Camisa manga corta con cuello camisero, botones frontales nacarados y short con vivo contrastante.",
      description: "El clásico reinventado con el toque Cloto. Camisa de corte holgado y elegante ribete en contraste en solapas y mangas. El short cuenta con pretina anatómica.",
      basePrice: 169000.0,
      compareAtPrice: 189000.0,
      isPublished: true,
      isFeatured: true,
      weight: 0.32,
      categories: {
        create: [
          { categoryId: linePijamas.id },
          { categoryId: catPijamas.id },
          { categoryId: catPijamaClasica.id },
          { categoryId: catClasicaShort.id },
        ],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }, { collectionId: colBestSellers.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
            altText: "Pijama Clásica Camisera Victoria Short",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "PIJ-CLA-SHT-BLA-S",
            name: "Blanco Perla / S",
            price: 169000.0,
            compareAtPrice: 189000.0,
            stock: 20,
            size: "S",
            color: "Blanco Perla",
            colorHex: "#FDFBF7",
            material: "Satín Twill de Lujo",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "PIJ-CLA-SHT-BLA-M",
            name: "Blanco Perla / M",
            price: 169000.0,
            compareAtPrice: 189000.0,
            stock: 25,
            size: "M",
            color: "Blanco Perla",
            colorHex: "#FDFBF7",
            material: "Satín Twill de Lujo",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "PIJ-CLA-SHT-ESM-M",
            name: "Verde Esmeralda / M",
            price: 169000.0,
            compareAtPrice: 189000.0,
            stock: 14,
            size: "M",
            color: "Verde Esmeralda",
            colorHex: "#0B5345",
            material: "Satín Twill de Lujo",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 5. Pijama Clásica con Pantalón: "Camisera Royal Pantalón"
  await prisma.product.create({
    data: {
      name: "Pijama Clásica Camisera Pantalón 'Royal'",
      slug: "pijama-clasica-camisera-pantalon-royal",
      shortDescription: "Camisa manga larga abotonada con cuello solapa y pantalón largo a juego en satín premium.",
      description: "Máxima sofisticación para el descanso y las mañanas de fin de semana. Botonadura delicada al tono, bolsillo superior de ribete y pantalón con caída pesada inigualable.",
      basePrice: 199000.0,
      compareAtPrice: 229000.0,
      isPublished: true,
      isFeatured: true,
      weight: 0.48,
      categories: {
        create: [
          { categoryId: linePijamas.id },
          { categoryId: catPijamas.id },
          { categoryId: catPijamaClasica.id },
          { categoryId: catClasicaPantalon.id },
        ],
      },
      collections: {
        create: [{ collectionId: colSatin.id }, { collectionId: colBestSellers.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
            altText: "Pijama Clásica Pantalón Royal",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "PIJ-CLA-PNT-CHA-S",
            name: "Champagne / S",
            price: 199000.0,
            stock: 15,
            size: "S",
            color: "Champagne",
            colorHex: "#F7E7CE",
            material: "Satín Royal 100%",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "PIJ-CLA-PNT-CHA-M",
            name: "Champagne / M",
            price: 199000.0,
            stock: 18,
            size: "M",
            color: "Champagne",
            colorHex: "#F7E7CE",
            material: "Satín Royal 100%",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "PIJ-CLA-PNT-NEG-M",
            name: "Negro Ónix / M",
            price: 199000.0,
            stock: 22,
            size: "M",
            color: "Negro Ónix",
            colorHex: "#1C1C1C",
            material: "Satín Royal 100%",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 6. Batola Clásica Camisera: "Batola Camisera Oxford"
  await prisma.product.create({
    data: {
      name: "Batola Clásica Camisera 'Oxford'",
      slug: "batola-clasica-camisera-oxford",
      shortDescription: "Camisón largo abotonado con cuello clásico y bajo redondeado con aberturas laterales.",
      description: "Estilo boyfriend chic. Una prenda versátil para el descanso que combina la estructura de una camisa elegante con la ligereza de una batola cómoda.",
      basePrice: 145000.0,
      compareAtPrice: null,
      isPublished: true,
      isFeatured: false,
      weight: 0.35,
      categories: {
        create: [
          { categoryId: linePijamas.id },
          { categoryId: catPijamas.id },
          { categoryId: catPijamaClasica.id },
          { categoryId: catBatolaClasica.id },
        ],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80",
            altText: "Batola Clásica Camisera Oxford",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "BAT-CLA-OXF-AZU-M",
            name: "Azul Cielo Rayas / M",
            price: 145000.0,
            stock: 16,
            size: "M",
            color: "Azul Cielo",
            colorHex: "#87CEEB",
            material: "Popelina de Algodón Suave",
            isDefault: true,
            isActive: true,
          },
        ],
      },
    },
  });

  // 7. Pijama Casual Short: "Lounge Rib Blossom"
  await prisma.product.create({
    data: {
      name: "Pijama Casual Short 'Rib Blossom'",
      slug: "pijama-casual-short-rib-blossom",
      shortDescription: "Camiseta cuello en V de silueta relajada con short en tejido acanalado ultra elástico.",
      description: "Diseñada para la comodidad diaria. Tejido rib de viscosa transpirable que se adapta a tus movimientos sin perder su forma.",
      basePrice: 115000.0,
      compareAtPrice: null,
      isPublished: true,
      isFeatured: true,
      weight: 0.28,
      categories: {
        create: [
          { categoryId: linePijamas.id },
          { categoryId: catPijamas.id },
          { categoryId: catPijamaCasual.id },
          { categoryId: catCasualShort.id },
        ],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
            altText: "Pijama Casual Short Rib Blossom",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "PIJ-CAS-SHT-SAL-S",
            name: "Salvia / S",
            price: 115000.0,
            stock: 20,
            size: "S",
            color: "Verde Salvia",
            colorHex: "#9DC183",
            material: "Rib de Viscosa & Spandex",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "PIJ-CAS-SHT-SAL-M",
            name: "Salvia / M",
            price: 115000.0,
            stock: 25,
            size: "M",
            color: "Verde Salvia",
            colorHex: "#9DC183",
            material: "Rib de Viscosa & Spandex",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 8. Bata / Kimono: "Kimono Cloto Luxury Satín"
  await prisma.product.create({
    data: {
      name: "Bata Kimono 'Cloto Luxury Satín'",
      slug: "bata-kimono-cloto-luxury-satin",
      shortDescription: "Bata envolvente con lazo ajustable a la cintura y mangas 3/4 con detalles de encaje.",
      description: "El complemento perfecto para tus pijamas. Confeccionada en satín de caída pesada que aporta sofisticación a tus momentos de descanso.",
      basePrice: 179000.0,
      compareAtPrice: 199000.0,
      isPublished: true,
      isFeatured: true,
      weight: 0.35,
      categories: {
        create: [
          { categoryId: linePijamas.id },
          { categoryId: catLoungewear.id },
          { categoryId: catBatas.id },
        ],
      },
      collections: {
        create: [{ collectionId: colSatin.id }, { collectionId: colBestSellers.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
            altText: "Bata Kimono Cloto Luxury Satín",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "BAT-KIM-MAR-TU",
            name: "Marfil / Talla Única",
            price: 179000.0,
            stock: 30,
            size: "Talla Única",
            color: "Marfil",
            colorHex: "#FFFFF0",
            material: "Satín de Seda & Encaje Francés",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "BAT-KIM-NEG-TU",
            name: "Negro / Talla Única",
            price: 179000.0,
            stock: 25,
            size: "Talla Única",
            color: "Negro",
            colorHex: "#111111",
            material: "Satín de Seda & Encaje Francés",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 9. LÍNEA 2: Ika Swimsuit - Traje de Baño Amalfi
  await prisma.product.create({
    data: {
      name: "Enterizo Ika Swimsuit 'Amalfi Sun'",
      slug: "enterizo-ika-swimsuit-amalfi-sun",
      shortDescription: "Traje de baño entero con control de abdomen suave, escote en V y tirantes cruzados en espalda.",
      description: "Textil premium con protección UV 50+ y secado rápido. Forro completo modelador y copas removibles.",
      basePrice: 189000.0,
      compareAtPrice: 219000.0,
      isPublished: true,
      isFeatured: true,
      weight: 0.28,
      categories: {
        create: [{ categoryId: lineIka.id }, { categoryId: catBanadores.id }],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            altText: "Enterizo Ika Swimsuit Amalfi Sun",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "SWI-IKA-AMA-TER-S",
            name: "Terracota Sol / S",
            price: 189000.0,
            stock: 15,
            size: "S",
            color: "Terracota",
            colorHex: "#C86D51",
            material: "Lycra Reciclada UV 50+",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "SWI-IKA-AMA-TER-M",
            name: "Terracota Sol / M",
            price: 189000.0,
            stock: 20,
            size: "M",
            color: "Terracota",
            colorHex: "#C86D51",
            material: "Lycra Reciclada UV 50+",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 10. LÍNEA 3: Rebecca Casual - Vestido Midi Lino Riviera
  await prisma.product.create({
    data: {
      name: "Vestido Midi de Lino 'Rebecca Riviera'",
      slug: "vestido-midi-lino-rebecca-riviera",
      shortDescription: "Vestido midi confeccionado en 100% lino natural con escote cuadrado y falda con movimiento.",
      description: "Diseño fresco, femenino y sumamente versátil para el día o la noche. Elaborado artesanalmente en Colombia con lino pre-lavado.",
      basePrice: 220000.0,
      compareAtPrice: 250000.0,
      isPublished: true,
      isFeatured: true,
      weight: 0.42,
      categories: {
        create: [{ categoryId: lineRebecca.id }, { categoryId: catVestidos.id }],
      },
      collections: {
        create: [{ collectionId: colNovedades.id }, { collectionId: colBestSellers.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
            altText: "Vestido Midi de Lino Rebecca Riviera",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "DRS-REB-RIV-BEI-S",
            name: "Beige Lino / S",
            price: 220000.0,
            stock: 14,
            size: "S",
            color: "Beige Arena",
            colorHex: "#E3DAC9",
            material: "100% Lino Puro",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "DRS-REB-RIV-BEI-M",
            name: "Beige Lino / M",
            price: 220000.0,
            stock: 18,
            size: "M",
            color: "Beige Arena",
            colorHex: "#E3DAC9",
            material: "100% Lino Puro",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // 11. LÍNEA 4: Cloto Home - Juego de Sábanas 400 Hilos
  await prisma.product.create({
    data: {
      name: "Juego de Sábanas 400 Hilos 'Cloto Home Sanctuary'",
      slug: "juego-sabanas-400-hilos-cloto-home-sanctuary",
      shortDescription: "Juego de sábanas completo en 100% Algodón Satén de 400 hilos de fibra larga.",
      description: "Transforma tu habitación en una suite de lujo. Incluye sábana ajustable con elástico perimetral profundo, sábana plana y 2 fundas de almohada con detalle de pestaña.",
      basePrice: 320000.0,
      compareAtPrice: 360000.0,
      isPublished: true,
      isFeatured: true,
      weight: 2.2,
      categories: {
        create: [{ categoryId: lineHome.id }, { categoryId: catRopaCama.id }],
      },
      collections: {
        create: [{ collectionId: colBestSellers.id }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
            altText: "Juego de Sábanas Cloto Home Sanctuary",
            orderIndex: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "HOM-SAB-400-QUE-BLA",
            name: "Blanco Óptico / Cama Queen (160x190 cm)",
            price: 320000.0,
            stock: 20,
            size: "Queen (160x190)",
            color: "Blanco Óptico",
            colorHex: "#FFFFFF",
            material: "100% Algodón Satén 400 Hilos",
            isDefault: true,
            isActive: true,
          },
          {
            sku: "HOM-SAB-400-KIN-BLA",
            name: "Blanco Óptico / Cama King (200x200 cm)",
            price: 380000.0,
            stock: 15,
            size: "King (200x200)",
            color: "Blanco Óptico",
            colorHex: "#FFFFFF",
            material: "100% Algodón Satén 400 Hilos",
            isDefault: false,
            isActive: true,
          },
          {
            sku: "HOM-SAB-400-QUE-GRI",
            name: "Gris Nube / Cama Queen (160x190 cm)",
            price: 320000.0,
            stock: 12,
            size: "Queen (160x190)",
            color: "Gris Nube",
            colorHex: "#D3D3D3",
            material: "100% Algodón Satén 400 Hilos",
            isDefault: false,
            isActive: true,
          },
        ],
      },
    },
  });

  // ------------------------------------------------------
  // 5. CUPONES DE BIENVENIDA & BENEFICIOS
  // ------------------------------------------------------
  console.log("🎟️ Creando cupones de descuento oficiales...");
  await prisma.coupon.createMany({
    data: [
      {
        code: "BIENVENIDA10",
        description: "10% de descuento en tu primera compra de pijamas y moda Cloto.",
        discountType: "PERCENTAGE",
        discountValue: 10.0,
        minOrderAmount: 100000.0,
        usageLimit: 1000,
        isActive: true,
      },
      {
        code: "CLOTOLOVE",
        description: "$25.000 COP de descuento en compras superiores a $200.000 COP.",
        discountType: "FIXED_AMOUNT",
        discountValue: 25000.0,
        minOrderAmount: 200000.0,
        usageLimit: 500,
        isActive: true,
      },
      {
        code: "ENVIOGRATIS",
        description: "Envío estándar gratuito a toda Colombia.",
        discountType: "FREE_SHIPPING",
        discountValue: 0.0,
        isActive: true,
      },
    ],
  });

  console.log("✅ Seeding de Cloto Colombia completado con éxito. ¡Todo listo!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
