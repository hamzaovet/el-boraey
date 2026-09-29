import { PrismaClient } from "@prisma/client";
import { INITIAL_PRODUCTS, INITIAL_FLYER, INITIAL_DELIVERY_SETTINGS, INITIAL_POSTS } from "../src/data/boraeyMockData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding El Boraey Hypermarket database...");

  // Seed Products
  for (const prod of INITIAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {},
      create: {
        id: prod.id,
        name: prod.name,
        category: prod.category,
        originalPrice: prod.originalPrice,
        offerPrice: prod.offerPrice,
        discountPercentage: prod.discountPercentage,
        unit: prod.unit,
        image: prod.image,
        inStock: prod.inStock,
        isHotOffer: prod.isHotOffer || false,
        description: prod.description || null,
        mascotImage: prod.mascotImage || null,
        mascotQuote: prod.mascotQuote || null,
      },
    });
  }

  // Seed Flyer
  await prisma.offerFlyer.upsert({
    where: { id: INITIAL_FLYER.id },
    update: {},
    create: {
      id: INITIAL_FLYER.id,
      title: INITIAL_FLYER.title,
      subtitle: INITIAL_FLYER.subtitle,
      weekLabel: INITIAL_FLYER.weekLabel,
      startDate: INITIAL_FLYER.startDate,
      endDate: INITIAL_FLYER.endDate,
      theme: INITIAL_FLYER.theme,
      footerNote: INITIAL_FLYER.footerNote,
    },
  });

  // Seed Store Settings
  await prisma.storeSetting.upsert({
    where: { key: "delivery_settings" },
    update: {},
    create: {
      key: "delivery_settings",
      value: JSON.stringify(INITIAL_DELIVERY_SETTINGS),
    },
  });

  console.log("✅ El Boraey Database seeded successfully with products, flyer and settings!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
