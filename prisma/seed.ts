import {
  randBoolean,
  randFloat,
  randFood,
  randFullName,
  randPastDate,
} from "@ngneat/falso";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  // Create one gueset
  const guest = await prisma.guest.create({
    data: { name: randFullName() },
  });

  // Create historical orders for guest
  for (let i = 0; i < 100; i++) {
    await prisma.order.create({
      data: {
        guestId: guest.id,
        createdAt: randPastDate(),
        completedAt: randBoolean() ? randPastDate() : null,
        items: {
          create: [
            {
              name: randFood({ origin: "italy" }),
              price: randFloat({ min: 1, max: 10, fraction: 2 }),
            },
            {
              name: randFood({ origin: "italy" }),
              price: randFloat({ min: 1, max: 10, fraction: 2 }),
            },
            {
              name: randFood({ origin: "italy" }),
              price: randFloat({ min: 1, max: 10, fraction: 2 }),
            },
            {
              name: randFood({ origin: "italy" }),
              price: randFloat({ min: 1, max: 10, fraction: 2 }),
            },
          ],
        },
      },
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
