import { Request, Response } from "express";

import { prisma } from "../../prisma/db";

const getAllGuests = async (_req: Request, res: Response) => {
  const guests = await prisma.guest.findMany({ include: { orders: true } });
  return res.json(guests);
};

const getGuestById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const guest = await prisma.guest.findFirst({
    where: { id },
    include: { orders: true },
  });
  console.log(req.params);
  if (!guest) return res.status(404).send(`No guest found with id ${id}.`);

  return res.json(guest);
};

const createGuest = async (req: Request, res: Response) => {
  const guest = await prisma.guest.create({ data: { ...req.body } });
  return res.json(guest);
};

const deleteGuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const guest = await prisma.guest.delete({ where: { id } });
  return res.json(guest);
};

const updateGuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const guest = await prisma.guest.update({
    where: { id },
    data: { ...req.body },
  });
  return res.json(guest);
};

export { getAllGuests, getGuestById, createGuest, deleteGuest, updateGuest };
