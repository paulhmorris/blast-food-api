import {
  rand,
  randBoolean,
  randFloat,
  randFood,
  randFullName,
  randNumber,
  randPastDate,
} from "@ngneat/falso";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const foodNames = randFood({ origin: "italy", length: 1000 });

async function seed() {
  // Create one guest
  const guest = await prisma.guest.create({
    data: { name: randFullName() },
  });

  // Create items
  for (let i = 0; i < 25; i++) {
    const food = rand(foodNames);
    console.log(food);
    await prisma.item.create({
      data: {
        name: food,
        price: randFloat({ min: 1, max: 10, fraction: 2 }),
      },
    });
  }

  const allItems = await prisma.item.findMany();

  // Create historical orders for guest
  for (let i = 0; i < 25; i++) {
    await prisma.order.create({
      data: {
        guestId: guest.id,
        createdAt: randPastDate(),
        completedAt: randBoolean() ? randPastDate() : null,
        orderItems: {
          createMany: {
            data: [
              {
                itemId: rand(allItems).id,
                quantity: randNumber({ min: 1, max: 3 }),
              },
              {
                itemId: rand(allItems).id,
                quantity: randNumber({ min: 1, max: 3 }),
              },
              {
                itemId: rand(allItems).id,
                quantity: randNumber({ min: 1, max: 3 }),
              },
            ],
          },
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
