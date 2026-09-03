import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: dbUrl
    ? {
        db: {
          url: dbUrl,
        },
      }
    : undefined,
});

async function main() {
  console.log("🌱 Sincronizando árbol oficial de categorías de Cloto Sustainable Lifestyle...");

  // ====================================================
  // 1. LÍNEAS PRINCIPALES (Los 4 Universos de Marca)
  // ====================================================
  const linePijamas = await prisma.category.upsert({
    where: { slug: "cloto-pijamas" },
    update: {
      name: "Cloto Ritual (Pijamas & Descanso)",
      orderIndex: 1,
      isActive: true,
      description: "Pijamas clásicas, básicas y casuales, batolas, kimonos y prendas de descanso con telas ultrasuaves, algodón orgánico y seda.",
    },
    create: {
      name: "Cloto Ritual (Pijamas & Descanso)",
      slug: "cloto-pijamas",
      description: "Pijamas clásicas, básicas y casuales, batolas, kimonos y prendas de descanso con telas ultrasuaves, algodón orgánico y seda.",
      orderIndex: 1,
      isActive: true,
    },
  });

  const lineIka = await prisma.category.upsert({
    where: { slug: "cloto-ika-swimsuit" },
    update: {
      name: "Cloto Active (Bañadores & Ropa Deportiva)",
      orderIndex: 2,
      isActive: true,
      description: "Bañadores de 1, 2 y 3 piezas, pareos, salidas de baño, vestidos de playa y accesorios sostenibles.",
    },
    create: {
      name: "Cloto Active (Bañadores & Ropa Deportiva)",
      slug: "cloto-ika-swimsuit",
      description: "Bañadores de 1, 2 y 3 piezas, pareos, salidas de baño, vestidos de playa y accesorios sostenibles.",
      orderIndex: 2,
      isActive: true,
    },
  });

  const lineRebecca = await prisma.category.upsert({
    where: { slug: "cloto-rebecca" },
    update: {
      name: "Cloto - Rebecca Casual",
      orderIndex: 3,
      isActive: true,
      description: "Moda casual femenina y contemporánea: vestidos, conjuntos, camisas, pantalones y accesorios versátiles.",
    },
    create: {
      name: "Cloto - Rebecca Casual",
      slug: "cloto-rebecca",
      description: "Moda casual femenina y contemporánea: vestidos, conjuntos, camisas, pantalones y accesorios versátiles.",
      orderIndex: 3,
      isActive: true,
    },
  });

  const lineHome = await prisma.category.upsert({
    where: { slug: "cloto-home" },
    update: {
      name: "Cloto Home (Habitar)",
      orderIndex: 4,
      isActive: true,
      description: "Lencería y textiles de hogar: mantelería de mesa, vajillas, duvets, hamacas y decoración aromática.",
    },
    create: {
      name: "Cloto Home (Habitar)",
      slug: "cloto-home",
      description: "Lencería y textiles de hogar: mantelería de mesa, vajillas, duvets, hamacas y decoración aromática.",
      orderIndex: 4,
      isActive: true,
    },
  });

  // ====================================================
  // 2. SUBCATEGORÍAS OFICIALES: LÍNEA 1 - CLOTO RITUAL
  // ====================================================
  const ritualSubcategories = [
    { name: "Pijamas Clásicas (Camiseras)", slug: "pijamas-clasicas", orderIndex: 1 },
    { name: "Pijamas Básicas (Tiras)", slug: "pijamas-basicas", orderIndex: 2 },
    { name: "Pijamas Casuales (Camiseta)", slug: "pijamas-casuales", orderIndex: 3 },
    { name: "Batolas Clásicas & Básicas", slug: "batolas", orderIndex: 4 },
    { name: "Levantadoras & Kimonos", slug: "levantadoras-kimonos", orderIndex: 5 },
    { name: "Pantuflas de Descanso", slug: "pantuflas", orderIndex: 6 },
    { name: "Esencias & Rituales", slug: "esencias-rituales", orderIndex: 7 },
    { name: "Accesorios Ritual (Balacas, Colas)", slug: "accesorios-ritual", orderIndex: 8 },
  ];

  for (const cat of ritualSubcategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, parentId: linePijamas.id, orderIndex: cat.orderIndex, isActive: true },
      create: { name: cat.name, slug: cat.slug, parentId: linePijamas.id, orderIndex: cat.orderIndex, isActive: true },
    });
  }

  // ====================================================
  // 3. SUBCATEGORÍAS OFICIALES: LÍNEA 2 - CLOTO ACTIVE
  // ====================================================
  const activeSubcategories = [
    { name: "Bañadores de 1 Pieza (Enterizos)", slug: "banadores-una-pieza", orderIndex: 1 },
    { name: "Bañadores de 2 Piezas (Bikini, Clásico, Tanga)", slug: "banadores-dos-piezas", orderIndex: 2 },
    { name: "Bañadores de 3 Piezas", slug: "banadores-tres-piezas", orderIndex: 3 },
    { name: "Busos Deportivos & Protección UV", slug: "busos-protectores-sol", orderIndex: 4 },
    { name: "Pareos Pañoleta", slug: "pareos-panoleta", orderIndex: 5 },
    { name: "Pareos Faldas", slug: "faldas-pareos", orderIndex: 6 },
    { name: "Pañoletas", slug: "panoletas", orderIndex: 7 },
    { name: "Vestidos de Playa", slug: "vestidos-playa", orderIndex: 8 },
    { name: "Ruanas y/o Salidas de Baño", slug: "ruanas-salidas-bano", orderIndex: 9 },
    { name: "Camisetas Playeras & Deportivas", slug: "camisetas-playa", orderIndex: 10 },
    { name: "Sandalias Playeras", slug: "sandalias-playeras", orderIndex: 11 },
    { name: "Bolsos Playeros", slug: "bolsos-playeros", orderIndex: 12 },
    { name: "Accesorios Active", slug: "accesorios-playa", orderIndex: 13 },
    { name: "Shorts de Agua", slug: "shorts-agua", orderIndex: 14 },
  ];

  for (const cat of activeSubcategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, parentId: lineIka.id, orderIndex: cat.orderIndex, isActive: true },
      create: { name: cat.name, slug: cat.slug, parentId: lineIka.id, orderIndex: cat.orderIndex, isActive: true },
    });
  }

  // ====================================================
  // 4. SUBCATEGORÍAS: LÍNEA 3 - REBECCA CASUAL
  // ====================================================
  const rebeccaSubcategories = [
    { name: "Vestidos", slug: "vestidos", orderIndex: 1 },
    { name: "Conjuntos de pantalón", slug: "conjuntos-pantalon", orderIndex: 2 },
    { name: "Conjuntos con falda", slug: "conjuntos-falda", orderIndex: 3 },
    { name: "Camisas", slug: "camisas", orderIndex: 4 },
    { name: "Blusas", slug: "blusas", orderIndex: 5 },
    { name: "Camisetas", slug: "camisetas-casuales", orderIndex: 6 },
    { name: "Bodys", slug: "bodys", orderIndex: 7 },
    { name: "Pantalones", slug: "pantalones-casuales", orderIndex: 8 },
    { name: "Faldas", slug: "faldas-casuales", orderIndex: 9 },
    { name: "Shorts", slug: "shorts-casuales", orderIndex: 10 },
    { name: "Pescadores", slug: "pescadores-casuales", orderIndex: 11 },
    { name: "Bolsos", slug: "bolsos", orderIndex: 12 },
    { name: "Zapatos", slug: "zapatos", orderIndex: 13 },
    { name: "Cinturones", slug: "cinturones", orderIndex: 14 },
    { name: "Joyería & Accesorios (Aretes, pulseras, collares)", slug: "joyeria-accesorios", orderIndex: 15 },
  ];

  for (const cat of rebeccaSubcategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, parentId: lineRebecca.id, orderIndex: cat.orderIndex, isActive: true },
      create: { name: cat.name, slug: cat.slug, parentId: lineRebecca.id, orderIndex: cat.orderIndex, isActive: true },
    });
  }

  // ====================================================
  // 5. SUBCATEGORÍAS: LÍNEA 4 - CLOTO HOME
  // ====================================================
  const homeSubcategories = [
    { name: "Manteles", slug: "manteles", orderIndex: 1 },
    { name: "Caminos de mesa", slug: "caminos-mesa", orderIndex: 2 },
    { name: "Individuales", slug: "individuales", orderIndex: 3 },
    { name: "Servilletas", slug: "servilletas", orderIndex: 4 },
    { name: "Portavasos", slug: "portavasos", orderIndex: 5 },
    { name: "Servilleteros", slug: "servilleteros", orderIndex: 6 },
    { name: "Anunciadores de mesa", slug: "anunciadores", orderIndex: 7 },
    { name: "Vajillas", slug: "vajillas", orderIndex: 8 },
    { name: "Cobertores & Duvets", slug: "cobertores-duvets", orderIndex: 9 },
    { name: "Hamacas", slug: "hamacas", orderIndex: 10 },
    { name: "Truc", slug: "truc", orderIndex: 11 },
    { name: "Velas aromáticas", slug: "velas-aromaticas", orderIndex: 12 },
    { name: "Accesorios decorativos", slug: "accesorios-hogar", orderIndex: 13 },
  ];

  for (const cat of homeSubcategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, parentId: lineHome.id, orderIndex: cat.orderIndex, isActive: true },
      create: { name: cat.name, slug: cat.slug, parentId: lineHome.id, orderIndex: cat.orderIndex, isActive: true },
    });
  }

  console.log("✅ ¡Todas las categorías y subcategorías oficiales fueron sincronizadas con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
