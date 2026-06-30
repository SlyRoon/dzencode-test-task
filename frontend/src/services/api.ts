import axios from 'axios';
import type { IOrder, IProduct } from '../types';

const api = axios.create({
  baseURL: '/api',
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readArrayPayload = <T>(payload: unknown, resourceName: string): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (isRecord(payload) && Array.isArray(payload.data)) {
    return payload.data as T[];
  }

  throw new Error(`Invalid ${resourceName} response: expected an array`);
};

const readObjectPayload = <T>(payload: unknown, resourceName: string): T => {
  if (isRecord(payload)) {
    return payload as T;
  }

  throw new Error(`Invalid ${resourceName} response: expected an object`);
};

// ----- Orders -----
export const getOrders = async (): Promise<IOrder[]> => {
  const { data } = await api.get<unknown>('/orders');
  return readArrayPayload<IOrder>(data, 'orders');
};

export const createOrder = async (payload: Pick<IOrder, 'title' | 'description'>): Promise<IOrder> => {
  const { data } = await api.post<unknown>('/orders', payload);
  return readObjectPayload<IOrder>(data, 'order');
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/orders/${id}`);
};

// ----- Products -----
export const getProducts = async (): Promise<IProduct[]> => {
  const { data } = await api.get<unknown>('/products');
  return readArrayPayload<IProduct>(data, 'products');
};

export type NewProductPayload = Omit<IProduct, 'id' | 'date'>;

export const createProduct = async (payload: NewProductPayload): Promise<IProduct> => {
  const { data } = await api.post<unknown>('/products', payload);
  return readObjectPayload<IProduct>(data, 'product');
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
