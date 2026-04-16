import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // product: backend ProductDto, size: string from product.variants[].size
      addItem: (product, size, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && item.selectedSize === size
        );

        // Build cart item from backend product
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          selectedSize: size,
          quantity: quantity,
          image: product.resources?.[0]?.url || 'https://via.placeholder.com/100',
          slug: product.slug,
          brand: product.brand,
        };

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.selectedSize === size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, cartItem] });
        }
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedSize === size)
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === productId && item.selectedSize === size
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'plugged-cart',
    }
  )
);