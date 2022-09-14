import { Item } from "@prisma/client";
import { Request, Response } from "express";

import { prisma } from "../../prisma/db";

const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { guest: true, orderItems: true },
  });
  res.json(orders);
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(parseInt(id))) {
    res.status(400).send(`Error parsing order id: ${id}`);
    return;
  }
  const order = await prisma.order.findFirst({
    where: { id },
    include: { guest: true, orderItems: true },
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
  const order = await prisma.order.delete({ where: { id } });
  res.json(order);
};

const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.update({
    where: { id },
    data: { ...req.body },
  });
  res.json(order);
};

const completeOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findFirst({ where: { id } });
  if (order?.completedAt) {
    res.status(400).send("Order is already completed");
    return;
  }

  const completedOrder = await prisma.order.update({
    where: { id },
    data: { completedAt: new Date() },
  });

  res.json(completedOrder);
};

interface PlaceOrderRequest {
  guestName?: string;
  items: string;
}

const placeOrder = async (req: Request, res: Response) => {
  const { guestName, items }: PlaceOrderRequest = req.body;
  if (!items) throw new Error(`No items: ${req.body}`);

  const parsedItems: (Item & { quantity: number })[] = JSON.parse(items);
  const orderItems = parsedItems.map((i) => ({
    itemId: i.id,
    quantity: i.quantity,
  }));

  // Errors
  if (!guestName || guestName === "") {
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
  // End errors
  const order = await prisma.order.create({
    data: {
      createdAt: new Date(),
      guest: { create: { name: guestName } },
      orderItems: {
        createMany: {
          data: orderItems,
        },
      },
    },
    select: { id: true, createdAt: true, guest: true, orderItems: true },
  });
  if (order) {
    res.json(order);
    return;
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
};
