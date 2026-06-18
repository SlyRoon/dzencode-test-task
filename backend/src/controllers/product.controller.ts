import { Request, Response } from 'express';
import { products } from '../mockData';

export const productController = {
  getAll: (_req: Request, res: Response): void => {
    res.json(products)
  },
};
