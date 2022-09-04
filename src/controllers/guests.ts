import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllGuests = async (_req: Request, res: Response) => {
  const guests = await prisma.guest.findMany({ include: { orders: true } });
  res.status(200).json(guests);
};

const getGuestById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const guest = await prisma.guest.findFirst({
    where: { id },
    include: { orders: true },
  });
  console.log(req.params);
  if (!guest) {
    res.status(404).send(`No guest found with id ${id}.`);
  }

  if (guest) res.status(200).json(guest);
};

const createGuest = async (req: Request, res: Response) => {
  const guest = await prisma.guest.create({ data: { ...req.body } });
  res.json(guest);
};

const deleteGuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const guest = await prisma.guest.delete({ where: { id } });
  res.json(guest);
};

const updateGuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const guest = await prisma.guest.update({
    where: { id },
    data: { ...req.body },
  });
  res.json(guest);
};

export { getAllGuests, getGuestById, createGuest, deleteGuest, updateGuest };
