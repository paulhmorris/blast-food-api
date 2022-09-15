import { Item } from "@prisma/client";
import { Request, Response } from "express";

import { prisma } from "../../prisma/db";

const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { guest: true, orderItems: true },
  });
  return res.json(orders);
};

const getOpenOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { completedAt: null },
    include: { guest: true, orderItems: true },
  });
  return res.json(orders);
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findFirst({
    where: { id },
    include: { guest: true, orderItems: true },
  });
  if (!order) {
    return res.status(404).send(`No order found with id ${id}.`);
  }
  return res.json(order);
};

const createOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.create({ data: { ...req.body } });
  return res.json(order);
};

const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.delete({ where: { id } });
  return res.json(order);
};

const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.update({
    where: { id },
    data: { ...req.body },
  });
  return res.json(order);
};

const completeOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findFirst({ where: { id } });
  if (order?.completedAt) {
    return res.status(400).json({ message: "Order is already completed" });
  }

  const completedOrder = await prisma.order.update({
    where: { id },
    data: { completedAt: new Date() },
  });

  console.log(completedOrder);
  return res.json(completedOrder);
};

interface PlaceOrderRequest {
  guestName?: string;
  items: string;
}

const placeOrder = async (req: Request, res: Response) => {
  const { guestName, items }: PlaceOrderRequest = req.body;
  if (items.length === 0) {
    return res.status(400).json({ error: "No items found", body: req.body });
  }

  const parsedItems: (Item & { quantity: number })[] = JSON.parse(items);
  const orderItems = parsedItems.map((i) => ({
    itemId: i.id,
    quantity: i.quantity,
  }));

  // Errors
  if (!guestName || guestName === "") {
    return res.status(400).json({
      message: "Error placing order, guest name required.",
    });
  }
  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Error placing order, cannot create an order with no items",
    });
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
    return res.json(order);
  }
};

export {
  getAllOrders,
  getOpenOrders,
  getOrderById,
  createOrder,
  updateOrder,
  completeOrder,
  deleteOrder,
  placeOrder,
};
