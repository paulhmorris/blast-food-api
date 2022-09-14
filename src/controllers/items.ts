import { Request, Response } from "express";

import { prisma } from "../../prisma/db";

const getAllItems = async (_req: Request, res: Response) => {
  const items = await prisma.item.findMany();
  return res.json(items);
};

const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.item.findFirst({
    where: { id },
  });

  if (!item) return res.status(404).send(`No item found with id ${id}.`);
  return res.status(200).json(item);
};

const createItem = async (req: Request, res: Response) => {
  const item = await prisma.item.create({ data: { ...req.body } });
  return res.json(item);
};

const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.item.delete({ where: { id } });
  return res.json(item);
};

const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.item.update({
    where: { id },
    data: { ...req.body },
  });
  return res.json(item);
};

export { getAllItems, getItemById, createItem, deleteItem, updateItem };
