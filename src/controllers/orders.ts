import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany();
  res.status(200).json(orders);
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findFirst({
    where: { id: parseInt(id) },
    include: { guest: true },
  });
  if (!order) {
    res.status(404).send(`No order found with id ${id}.`);
  }

  if (order) res.status(200).json(order);
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

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
