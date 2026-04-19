// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       items: [],

//       // Add item – variant must include id, size, color
//       addItem: (product, variant, quantity = 1) => {
//         if (!variant?.id || !variant?.size || !variant?.color) {
//           console.error('addItem: variant must have id, size, color', variant);
//           return;
//         }

//         const items = get().items;
//         const existingIndex = items.findIndex(item => item.variantId === variant.id);

//         if (existingIndex !== -1) {
//           const updated = [...items];
//           updated[existingIndex].quantity += quantity;
//           set({ items: updated });
//         } else {
//           const cartItem = {
//             id: product.id,           // product ID
//             variantId: variant.id,    // unique variant ID
//             name: product.name,
//             price: product.price,     // price from product
//             size: variant.size,
//             color: variant.color,
//             quantity,
//             image: product.resources?.[0]?.url || 'https://via.placeholder.com/100',
//             slug: product.slug,
//             brand: product.brand,
//           };
//           set({ items: [...items, cartItem] });
//         }
//       },

//       removeItem: (variantId) => {
//         set({ items: get().items.filter(item => item.variantId !== variantId) });
//       },

//       updateQuantity: (variantId, newQuantity) => {
//         const quantity = Math.max(1, newQuantity);
//         set({
//           items: get().items.map(item =>
//             item.variantId === variantId ? { ...item, quantity } : item
//           ),
//         });
//       },

//       clearCart: () => set({ items: [] }),

//       getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
//       getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
//     }),
//     { name: 'plugged-cart' }
//   )
// );

// store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],   // each item: { variantId, productId, name, price, size, color, quantity, image, slug, brand }

      addItem: (product, variant, quantity = 1) => {
        if (!variant?.id || !variant?.size || !variant?.color) {
          console.error('addItem: invalid variant', variant);
          return;
        }

        const existing = get().items.find(i => i.variantId === variant.id);
        if (existing) {
          set({
            items: get().items.map(i =>
              i.variantId === variant.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          const newItem = {
            variantId: variant.id,          // unique variant UUID
            productId: product.id,          // product UUID
            name: product.name,
            price: product.price,
            size: variant.size,             // string
            color: variant.color,           // string
            quantity,
            image: product.resources?.[0]?.url || '',
            slug: product.slug,
            brand: product.brand,
          };
          set({ items: [...get().items, newItem] });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter(i => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, newQuantity) => {
        const quantity = Math.max(1, newQuantity);
        set({
          items: get().items.map(i =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'plugged-cart' }
  )
);