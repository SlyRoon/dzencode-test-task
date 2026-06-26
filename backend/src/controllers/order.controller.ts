import { Request, Response } from 'express';
import { orders } from '../mockData';
import { IOrder } from '../types';

const nextId = (): number =>
  orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;

const nowString = (): string =>
  new Date().toISOString().slice(0, 19).replace('T', ' ');

export const orderController = {
  getAll: (_req: Request, res: Response): void => {
    res.json(orders);
  },

  create: (req: Request, res: Response): void => {
    const body = req.body ?? {};

    if (!body.title || String(body.title).trim() === '') {
      res.status(400).json({ message: 'Validation failed', fields: ['title'] });
      return;
    }

    const order: IOrder = {
      id: nextId(),
      title: String(body.title).trim(),
      date: body.date || nowString(),
      description: body.description ? String(body.description) : '',
    };

    orders.push(order);
    res.status(201).json(order);
  },

  deleteById: (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const index = orders.findIndex((i) => i.id === id);
    if (index !== -1) {
      orders.splice(index, 1);
      res.status(200).json({ message: 'Order deleted' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  },
};
