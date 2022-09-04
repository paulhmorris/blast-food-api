import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllItems = async (_req: Request, res: Response) => {
  const items = await prisma.item.findMany();
  res.status(200).json(items);
};

const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.item.findFirst({
    where: { id: parseInt(id) },
  });
  if (!item) {
    res.status(404).send(`No item found with id ${id}.`);
  }

  if (item) res.status(200).json(item);
};

const createItem = async (req: Request, res: Response) => {
  const item = await prisma.item.create({ data: { ...req.body } });
  res.json(item);
};

const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.item.delete({ where: { id: parseInt(id) } });
  res.json(item);
};

const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.item.update({
    where: { id: parseInt(id) },
    data: { ...req.body },
  });
  res.json(item);
};

export { getAllItems, getItemById, createItem, deleteItem, updateItem };
