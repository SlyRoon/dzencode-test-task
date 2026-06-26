import { createSlice } from '@reduxjs/toolkit';
import type { IOrder } from '../../types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrders, deleteOrder, createOrder } from '../../services/api';
interface OrdersState {
  orders: IOrder[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    status: 'idle',
    error: null,
}

export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async () => {
        const response = await getOrders();
        return response;
    }
);

export const fetchDeleteOrder = createAsyncThunk(
    'orders/delete',
    async (id: number) => {
        await deleteOrder(id);
        return id;
    }
);

export const fetchAddOrder = createAsyncThunk(
    'orders/add',
    async (payload: { title: string; description?: string }) => {
        const response = await createOrder({ title: payload.title, description: payload.description ?? '' });
        return response;
    }
);

const ordersSlice = createSlice ({
    name: 'orders',
    initialState: initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder 
        .addCase(fetchOrders.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(fetchOrders.fulfilled,(state,action )=> {
          state.status = 'succeeded'
          state.orders = action.payload
        })
        .addCase(fetchOrders.rejected,(state,action) => {
            state.status = 'failed'
            state.error = action.error.message || 'Unknown error'
        })
        builder 
        .addCase(fetchDeleteOrder.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(fetchDeleteOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter(i => i.id !== action.payload)

        })
        .addCase(fetchDeleteOrder.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message || 'Unknown error'
        })
        builder
        .addCase(fetchAddOrder.fulfilled, (state, action) => {
            state.orders.push(action.payload)
        })
    }
    
})
export default ordersSlice.reducer