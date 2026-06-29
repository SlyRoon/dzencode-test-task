import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { mapProduct } from '../mappers';
import { IPrice } from '../types';

const now = (): Date => new Date();

export const productController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    const products = await prisma.product.findMany({
      include: { prices: true },
      orderBy: { id: 'asc' },
    });

    res.json(products.map(mapProduct));
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const body = req.body ?? {};

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

    const order = await prisma.order.findUnique({
      where: { id: Number(body.order) },
      select: { id: true },
    });

    if (!order) {
      res.status(400).json({ message: 'Validation failed', fields: ['order'] });
      return;
    }

    const price: IPrice[] = (body.price as IPrice[]).map((p) => ({
      value: Number(p.value) || 0,
      symbol: String(p.symbol),
      isDefault: Number(p.isDefault) ? 1 : 0,
    }));

    const fallbackDate = now();
    const product = await prisma.product.create({
      data: {
        serialNumber: String(body.serialNumber),
        isNew: Number(body.isNew) ? 1 : 0,
        photo: body.photo ? String(body.photo) : 'pathToFile.jpg',
        title: String(body.title).trim(),
        type: String(body.type).trim(),
        specification: body.specification ? String(body.specification).trim() : '',
        guaranteeStart: body.guarantee?.start ? new Date(body.guarantee.start) : fallbackDate,
        guaranteeEnd: body.guarantee?.end ? new Date(body.guarantee.end) : fallbackDate,
        orderId: Number(body.order),
        date: fallbackDate,
        prices: {
          create: price.map((item) => ({
            value: item.value,
            symbol: item.symbol,
            isDefault: item.isDefault,
          })),
        },
      },
      include: { prices: true },
    });

    res.status(201).json(mapProduct(product));
  },

  deleteById: async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    try {
      await prisma.product.delete({ where: { id } });
      res.status(200).json({ message: 'Product deleted', id });
    } catch {
      res.status(404).json({ message: 'Product not found' });
    }
  },
};
