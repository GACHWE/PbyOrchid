// import { create } from 'zustand';
// import { 
//   getAllProducts, 
//   createProduct, 
//   updateProduct, 
//   deleteProduct 
// } from '../services/products';

// export const useProductsStore = create((set, get) => ({
//   products: [],
//   loading: false,
//   error: null,
//   totalPages: 0,
//   currentPage: 0,
//   totalElements: 0,

//   // Fetch products with filters/pagination
//   fetchProducts: async (params = {}) => {
//     set({ loading: true, error: null });
//     try {
//       const response = await getAllProducts(params);
//       set({
//         products: response.content,
//         totalPages: response.totalPages,
//         currentPage: response.number,
//         totalElements: response.totalElements,
//         loading: false,
//       });
//       return response;
//     } catch (err) {
//       set({ error: err.message, loading: false });
//       throw err;
//     }
//   },

//   // Add a new product (admin)
//   addProduct: async (productData) => {
//     set({ loading: true, error: null });
//     try {
//       const newProduct = await createProduct(productData);
//       // Optionally refetch or add to local state
//       set((state) => ({ 
//         products: [newProduct, ...state.products],
//         loading: false 
//       }));
//       return newProduct;
//     } catch (err) {
//       set({ error: err.message, loading: false });
//       throw err;
//     }
//   },

//   // Update an existing product (admin)
//   updateProduct: async (id, productData) => {
//     set({ loading: true, error: null });
//     try {
//       const updated = await updateProduct(id, productData);
//       set((state) => ({
//         products: state.products.map((p) => (p.id === id ? updated : p)),
//         loading: false,
//       }));
//       return updated;
//     } catch (err) {
//       set({ error: err.message, loading: false });
//       throw err;
//     }
//   },

//   // Remove a product (admin)
//   removeProduct: async (id) => {
//     set({ loading: true, error: null });
//     try {
//       await deleteProduct(id);
//       set((state) => ({
//         products: state.products.filter((p) => p.id !== id),
//         loading: false,
//       }));
//     } catch (err) {
//       set({ error: err.message, loading: false });
//       throw err;
//     }
//   },

//   // Clear error
//   clearError: () => set({ error: null }),
// }));