import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IProduct } from "../../types";
import { getProducts, createProduct, deleteProduct } from "../../services/api";
import type { NewProductPayload } from "../../services/api";

interface ProductState {
  products: IProduct[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const response = await getProducts();
  return response;
});

export const fetchAddProduct = createAsyncThunk(
  "products/add",
  async (payload: NewProductPayload) => {
    const response = await createProduct(payload);
    return response;
  }
);

export const fetchDeleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number) => {
    await deleteProduct(id);
    return id;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      })
      .addCase(fetchAddProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(fetchDeleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
