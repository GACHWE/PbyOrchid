// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useWishlistStore = create(
//   persist(
//     (set, get) => ({
//       items: [],
//       toggleWishlist: (product) => {
//         const items = get().items;
//         const exists = items.find((item) => item.id === product.id);
//         if (exists) {
//           set({ items: items.filter((item) => item.id !== product.id) });
//         } else {
//           set({ items: [...items, product] });
//         }
//       },
//       isInWishlist: (productId) => {
//         return get().items.some((item) => item.id === productId);
//       },
//     }),
//     {
//       name: 'plugged-wishlist',
//     }
//   )
// );

// store/wishlistStore.js
import { create } from 'zustand';
import * as wishlistApi from '../api/wishlist';

export const useWishlistStore = create((set, get) => ({
  // State
  items: [],           // array of ProductDto
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
  hasMore: false,

  // Actions
  fetchWishlist: async (page = 0, size = 12, append = false) => {
    set({ loading: true, error: null });
    try {
      const response = await wishlistApi.getWishlist(page, size);
      // response = { content: [...], totalPages, totalElements, number, ... }
      const newItems = response.content || [];
      set(state => ({
        items: append ? [...state.items, ...newItems] : newItems,
        loading: false,
        currentPage: response.number,
        totalPages: response.totalPages,
        totalItems: response.totalElements,
        hasMore: response.number + 1 < response.totalPages,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addItem: async (productId, product) => {
    // Optimistic update
    const previousItems = get().items;
    // Add to local state temporarily (if product object is known)
    if (product) {
      set({ items: [product, ...previousItems] });
    }
    try {
      await wishlistApi.addToWishlist(productId);
      // No need to refetch, but we must ensure the item is really added.
      // If product wasn't provided, we might refetch first page.
      // For simplicity, we refetch first page to get consistent order.
      await get().fetchWishlist(0, get().itemsPerPage || 12);
    } catch (err) {
      // Rollback
      set({ items: previousItems });
      throw err;
    }
  },

  removeItem: async (productId) => {
    const previousItems = get().items;
    // Optimistic remove
    set({ items: previousItems.filter(item => item.id !== productId) });
    try {
      await wishlistApi.removeFromWishlist(productId);
      // Optionally refetch current page to sync counts
      await get().fetchWishlist(get().currentPage, get().itemsPerPage || 12);
    } catch (err) {
      // Rollback
      set({ items: previousItems });
      throw err;
    }
  },

  // Inside useWishlistStore (add after other actions)
fetchWishlistCount: async () => {
  // Fetch only 1 item per page to get totalElements without loading all items
  try {
    const response = await wishlistApi.getWishlist(0, 1);
    set({ totalItems: response.totalElements });
  } catch (err) {
    console.error('Failed to fetch wishlist count', err);
    // Keep existing totalItems (don't reset on error)
  }
},

  loadMore: async () => {
    const { currentPage, hasMore, loading } = get();
    if (!hasMore || loading) return;
    await get().fetchWishlist(currentPage + 1, 12, true);
  },

  clearError: () => set({ error: null }),

  // Helper to know if a product is in current wishlist (client-side)
  isInWishlist: (productId) => {
    return get().items.some(item => item.id === productId);
  },

  itemsPerPage: 12,
}));

// export default useWishlistStore;