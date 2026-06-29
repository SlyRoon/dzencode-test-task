import { Request, Response } from 'express';
import { mapOrder } from '../mappers';
import { prisma } from '../prisma';

export const orderController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: { prices: true },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    res.json(orders.map(mapOrder));
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const body = req.body ?? {};

    if (!body.title || String(body.title).trim() === '') {
      res.status(400).json({ message: 'Validation failed', fields: ['title'] });
      return;
    }

    const order = await prisma.order.create({
      data: {
        title: String(body.title).trim(),
        date: body.date ? new Date(body.date) : new Date(),
        description: body.description ? String(body.description) : '',
      },
    });

    res.status(201).json(mapOrder(order));
  },

  deleteById: async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    try {
      await prisma.order.delete({ where: { id } });
      res.status(200).json({ message: 'Order deleted' });
    } catch {
      res.status(404).json({ message: 'Order not found' });
    }
  },
};
