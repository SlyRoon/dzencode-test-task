import { Price, Product } from '@prisma/client';
import { IOrder, IProduct } from './types';

type ProductWithPrices = Product & { prices: Price[] };

const pad = (value: number): string => String(value).padStart(2, '0');

const formatDateTime = (value: Date | null): string => {
  if (!value) return '';

  return [
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`,
    `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`,
  ].join(' ');
};

export const mapProduct = (product: ProductWithPrices): IProduct => ({
  id: product.id,
  serialNumber: Number(product.serialNumber) || 0,
  isNew: product.isNew,
  photo: product.photo ?? '',
  title: product.title,
  type: product.type ?? '',
  specification: product.specification ?? '',
  guarantee: {
    start: formatDateTime(product.guaranteeStart),
    end: formatDateTime(product.guaranteeEnd),
  },
  price: product.prices.map((price) => ({
    value: Number(price.value),
    symbol: price.symbol,
    isDefault: price.isDefault,
  })),
  order: product.orderId ?? 0,
  date: formatDateTime(product.date),
});

export const mapOrder = (order: {
  id: number;
  title: string;
  date: Date;
  description: string | null;
  products?: ProductWithPrices[];
}): IOrder => ({
  id: order.id,
  title: order.title,
  date: formatDateTime(order.date),
  description: order.description ?? '',
  products: order.products?.map(mapProduct),
});
