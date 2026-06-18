import axios from 'axios';
import type { IOrder, IProduct } from '../types';
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});
 


export const getOrders = async (): Promise<IOrder[]> => {
    const {data} = await api.get<IOrder[]>('/orders');
    return data
}
export const deleteOrder = async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`)
}
export const getProducts = async (): Promise<IProduct[]> => {
    const {data} = await api.get<IProduct[]>('/products');
    return data
}