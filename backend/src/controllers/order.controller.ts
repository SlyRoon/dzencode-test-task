import { Request, Response } from 'express';
import { orders } from '../mockData';

export const orderController = {
  getAll: (_req: Request, res: Response): void => {
    res.json(orders);
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