import { Item, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(parseInt(id))) {
    res.status(400).send(`Error parsing order id: ${id}`);
    return;
  }
  const order = await prisma.order.findFirst({
    where: { id: parseInt(id) },
    include: { guest: true, items: true },
  });
  if (!order) {
    res.status(404).send(`No order found with id ${id}.`);
    return;
  }

  if (order) res.json(order);
};

const createOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.create({ data: { ...req.body } });
  res.json(order);
};

const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.delete({ where: { id: parseInt(id) } });
  res.json(order);
};

const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { ...req.body },
  });
  res.json(order);
};

const completeOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findFirst({ where: { id: parseInt(id) } });
  if (order?.completedAt) {
    res.status(400).send("Order is already completed");
    return;
  }

  const completedOrder = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { completedAt: new Date() },
  });

  res.json(completedOrder);
};

const getOrderTotal = async (req: Request, res: Response) => {
  const { items }: { items: number[] } = req.body;

  const data = await prisma.item.aggregate({
    _sum: { price: true },
    where: {
      id: { in: items },
    },
  });

  if (data._sum.price === null) {
    res.status(400).json({ message: "Error getting order total" });
    return;
  }

  const subTotal = Number(data._sum.price);
  const tax = Number((subTotal * 0.0825).toFixed(2));
  const total = subTotal + tax;

  res.json({ subTotal, tax, total });
};

const placeOrder = async (req: Request, res: Response) => {
  const {
    guestName,
    guestId,
    items,
  }: {
    guestName?: string;
    guestId?: string;
    items: Pick<Item, "id">[];
  } = req.body;

  if (!guestId && (!guestName || guestName === "")) {
    res.status(400).json({
      message: "Error placing order, guest name required.",
    });
    return;
  }
  if (!items || items.length === 0) {
    res.status(400).json({
      message: "Error placing order, cannot create an order with no items",
    });
    return;
  }

  // Existing guest
  if (guestId) {
    const order = await prisma.order.create({
      data: {
        createdAt: new Date(),
        guest: {
          connect: { id: guestId },
        },
        items: { connect: items },
      },
      select: { createdAt: true, guest: true, items: true },
    });
    if (order) {
      res.json(order);
      return;
    }
  }

  // New guest
  if (!guestId) {
    const order = await prisma.order.create({
      data: {
        createdAt: new Date(),
        guest: {
          create: { name: guestName },
        },
        items: { connect: items },
      },
      select: { createdAt: true, guest: true, items: true },
    });
    if (order) {
      res.json(order);
      return;
    }
  }
};

export {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  completeOrder,
  deleteOrder,
  placeOrder,
  getOrderTotal,
};
