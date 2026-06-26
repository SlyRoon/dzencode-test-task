import { Request, Response } from 'express';
import { products } from '../mockData';
import { IPrice, IProduct } from '../types';

const nextId = (): number =>
  products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;

const nowString = (): string =>
  new Date().toISOString().slice(0, 19).replace('T', ' ');

export const productController = {
  getAll: (_req: Request, res: Response): void => {
    res.json(products);
  },

  create: (req: Request, res: Response): void => {
    const body = req.body ?? {};

    // Серверная валидация обязательных полей
    const errors: string[] = [];
    if (!body.title || String(body.title).trim() === '') errors.push('title');
    if (!body.type || String(body.type).trim() === '') errors.push('type');
    if (body.serialNumber === undefined || Number(body.serialNumber) <= 0) errors.push('serialNumber');
    if (!body.order || Number(body.order) <= 0) errors.push('order');
    if (!Array.isArray(body.price) || body.price.length === 0) errors.push('price');

    if (errors.length > 0) {
      res.status(400).json({ message: 'Validation failed', fields: errors });
      return;
    }

    const price: IPrice[] = (body.price as IPrice[]).map((p) => ({
      value: Number(p.value) || 0,
      symbol: String(p.symbol),
      isDefault: Number(p.isDefault) ? 1 : 0,
    }));

    const product: IProduct = {
      id: nextId(),
      serialNumber: Number(body.serialNumber),
      isNew: Number(body.isNew) ? 1 : 0,
      photo: body.photo ? String(body.photo) : 'pathToFile.jpg',
      title: String(body.title).trim(),
      type: String(body.type).trim(),
      specification: body.specification ? String(body.specification).trim() : '',
      guarantee: {
        start: body.guarantee?.start || nowString(),
        end: body.guarantee?.end || nowString(),
      },
      price,
      order: Number(body.order),
      date: nowString(),
    };

    products.push(product);
    res.status(201).json(product);
  },

  deleteById: (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      res.status(200).json({ message: 'Product deleted', id });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  },
};
