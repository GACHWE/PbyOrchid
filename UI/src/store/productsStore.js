import { create } from 'zustand';
import { SNEAKERS } from '../data/sneakers';

export const useProductsStore = create((set) => ({
  products: SNEAKERS,
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  removeProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  updateProduct: (updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    })),
}));
