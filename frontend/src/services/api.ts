import axios from 'axios';
import type { IOrder, IProduct } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// ----- Orders -----
export const getOrders = async (): Promise<IOrder[]> => {
  const { data } = await api.get<IOrder[]>('/orders');
  return data;
};

export const createOrder = async (payload: Pick<IOrder, 'title' | 'description'>): Promise<IOrder> => {
  const { data } = await api.post<IOrder>('/orders', payload);
  return data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/orders/${id}`);
};

// ----- Products -----
export const getProducts = async (): Promise<IProduct[]> => {
  const { data } = await api.get<IProduct[]>('/products');
  return data;
};

export type NewProductPayload = Omit<IProduct, 'id' | 'date'>;

export const createProduct = async (payload: NewProductPayload): Promise<IProduct> => {
  const { data } = await api.post<IProduct>('/products', payload);
  return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
