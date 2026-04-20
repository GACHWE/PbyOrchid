// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
// import { useCartStore } from '../store/cartStore';
// import { useWishlistStore } from '../store/wishlistStore';
// import { motion } from 'motion/react';
// import { toast } from './Toast';

// export default function ProductCard({ product, layout = 'grid' }) {
//   const { addItem } = useCartStore();
//   const { toggleWishlist, isInWishlist } = useWishlistStore();
//   const isWishlisted = isInWishlist(product.id);

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     // Default to first size for quick add
//     addItem(product, product.sizes[0]);
//     toast(`Added ${product.name} to cart!`);
//   };

//   const handleWishlist = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     toggleWishlist(product);
//     toast(isWishlisted ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist!`);
//   };

//   return (
//     <motion.div
//       whileHover={{ y: -10 }}
//       className={`group relative bg-app-card rounded-2xl overflow-hidden border border-app-border hover:border-primary-accent transition-all duration-500 ${layout === 'list' ? 'flex gap-6' : ''}`}
//       data-aos="fade-up"
//     >
//       {/* Badges */}
//       <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
//         {product.isNew && (
//           <span className="bg-tertiary-accent text-black text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">New Drop</span>
//         )}
//         {product.isTrending && (
//           <span className="bg-quaternary-accent text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">Hot</span>
//         )}
//       </div>

//       {/* Image Container */}
//       <div className={`relative overflow-hidden ${layout === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
//         <Link to={`/product/${product.id}`}>
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//             referrerPolicy="no-referrer"
//           />
//         </Link>
        
//         {/* Overlay Actions */}
//         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
//           <button 
//             onClick={handleWishlist}
//             className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isWishlisted ? 'bg-secondary-accent text-white' : 'bg-white text-black hover:bg-secondary-accent hover:text-white'}`}
//           >
//             <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
//           </button>
//           <Link 
//             to={`/product/${product.id}`}
//             className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-primary-accent hover:text-white transition-all duration-300"
//           >
//             <Eye size={20} />
//           </Link>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-5 flex-1 flex flex-col">
//         <div className="flex justify-between items-start mb-2">
//           <span className="text-xs font-bold text-app-text-muted uppercase tracking-widest">{product.brand}</span>
//           <div className="flex items-center gap-1 text-quaternary-accent">
//             <Star size={12} fill="currentColor" />
//             <span className="text-xs font-bold">{product.rating}</span>
//           </div>
//         </div>
        
//         <Link to={`/product/${product.id}`} className="text-lg font-black tracking-tight mb-1 group-hover:text-primary-accent transition-colors line-clamp-1">
//           {product.name}
//         </Link>
        
//         <p className="text-app-text-muted text-xs mb-4 line-clamp-2 flex-1">{product.description}</p>
        
//         <div className="flex items-center justify-between mt-auto">
//           <span className="text-xl font-black text-tertiary-accent">${product.price}</span>
//           <button 
//             onClick={handleAddToCart}
//             className="w-10 h-10 bg-primary-accent text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all neon-glow"
//           >
//             <ShoppingCart size={20} />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// import React, { useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
// import { useCartStore } from '../store/cartStore';
// import { useWishlistStore } from '../store/wishlistStore';
// import { motion } from 'motion/react';
// import { showToast } from '../utils/toast';

// export default function ProductCard({ product, layout = 'grid' }) {
//   const { addItem: addToCart } = useCartStore();
//   const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
//   const isWishlisted = isInWishlist(product.id);

//   // Extract first in‑stock variant (or first variant overall)
  
//   const firstAvailableVariant = useMemo(() => {
//     if (!product.variants?.length) return null;
//     const inStock = product.variants.find(v => (v.stockQuantity ?? 0) > 0);
//     return inStock || product.variants[0];
//   }, [product.variants]);

//   const imageUrl = product.resources?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image';
//   const isNew = product.newArrival || false;
//   const isTrending = product.featured || false;
//   const rating = product.rating || 0;

// const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!firstAvailableVariant) {
//       showToast('Out of stock', 'error');
//       return;
//     }
//     addToCart(product, firstAvailableVariant);
//     showToast(`Added ${product.name} (${firstAvailableVariant.color}, ${firstAvailableVariant.size})`, 'success');
//   };

//   const handleWishlist = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (isWishlisted) {
//       try {
//         await removeFromWishlist(product.id);
//         showToast(`Removed ${product.name} from wishlist`, 'success');
//       } catch (err) {
//         showToast(`Failed to remove ${product.name} from wishlist`, 'error');
//       }
//     } else {
//       try {
//         await addToWishlist(product.id, product);
//         showToast(`Added ${product.name} to wishlist!`, 'success');
//       } catch (err) {
//         showToast(`Failed to add ${product.name} to wishlist`, 'error');
//       }
//     }
//   };

//   return (
//     <motion.div
//       whileHover={{ y: -10 }}
//       className={`group relative bg-app-card rounded-2xl overflow-hidden border border-app-border hover:border-primary-accent transition-all duration-500 ${
//         layout === 'list' ? 'flex gap-6' : ''
//       }`}
//       data-aos="fade-up"
//     >
//       {/* Badges */}
//       <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
//         {isNew && (
//           <span className="bg-tertiary-accent text-black text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">
//             New Drop
//           </span>
//         )}
//         {isTrending && (
//           <span className="bg-quaternary-accent text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">
//             Hot
//           </span>
//         )}
//       </div>

//       {/* Image Container */}
//       <div
//         className={`relative overflow-hidden ${
//           layout === 'list' ? 'w-48 h-48' : 'aspect-square'
//         }`}
//       >
//         <Link to={`/product/${product.id}`}>
//           <img
//             src={imageUrl}
//             alt={product.name}
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//             referrerPolicy="no-referrer"
//           />
//         </Link>

//         {/* Overlay Actions */}
//         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
//           <button
//             onClick={handleWishlist}
//             className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
//               isWishlisted
//                 ? 'bg-secondary-accent text-white'
//                 : 'bg-white text-black hover:bg-secondary-accent hover:text-white'
//             }`}
//           >
//             <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
//           </button>
//           <Link
//             to={`/product/${product.id}`}
//             className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-primary-accent hover:text-white transition-all duration-300"
//           >
//             <Eye size={20} />
//           </Link>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-5 flex-1 flex flex-col">
//         <div className="flex justify-between items-start mb-2">
//           <span className="text-xs font-bold text-app-text-muted uppercase tracking-widest">
//             {product.brand || 'ORCHID'}
//           </span>
//           <div className="flex items-center gap-1 text-quaternary-accent">
//             <Star size={12} fill="currentColor" />
//             <span className="text-xs font-bold">{rating.toFixed(1)}</span>
//           </div>
//         </div>

//         <Link
//           to={`/product/${product.id}`}
//           className="text-lg font-black tracking-tight mb-1 group-hover:text-primary-accent transition-colors line-clamp-1"
//         >
//           {product.name}
//         </Link>

//         <p className="text-app-text-muted text-xs mb-4 line-clamp-2 flex-1">
//           {product.description || 'No description available'}
//         </p>

//         <div className="flex items-center justify-between mt-auto">
//           <span className="text-xl font-black text-tertiary-accent">
//             ${product.price}
//           </span>
//          <button
//         onClick={handleAddToCart}
//         className="w-10 h-10 bg-primary-accent text-white rounded-xl flex items-center justify-center hover:scale-110"
//         disabled={!firstAvailableVariant}
//       >
//         <ShoppingCart size={20} />
//       </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { motion } from 'motion/react';
import { showToast } from '../utils/toast';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  // Pick first in‑stock variant, or first variant if none in stock
  const firstAvailableVariant = useMemo(() => {
    if (!product.variants?.length) return null;
    const inStock = product.variants.find(v => (v.stockQuantity ?? 0) > 0);
    return inStock || product.variants[0];
  }, [product.variants]);

  const imageUrl = product.resources?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image';
  const isNew = product.newArrival || false;
  const isTrending = product.featured || false;
  const rating = product.rating || 0;

  // Use slug for product detail link – fallback to id if slug missing (should not happen)
  const productLink = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstAvailableVariant) {
      showToast('Out of stock', 'error');
      return;
    }
    addToCart(product, firstAvailableVariant);
    showToast(`Added ${product.name} (${firstAvailableVariant.color}, ${firstAvailableVariant.size})`, 'success');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      await removeFromWishlist(product.id);
      showToast(`Removed ${product.name} from wishlist`, 'success');
    } else {
      await addToWishlist(product.id, product);
      showToast(`Added ${product.name} to wishlist!`, 'success');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`group relative bg-app-card rounded-2xl overflow-hidden border border-app-border hover:border-primary-accent transition-all duration-500 ${
        layout === 'list' ? 'flex gap-6' : ''
      }`}
      data-aos="fade-up"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="bg-tertiary-accent text-black text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">
            New Drop
          </span>
        )}
        {isTrending && (
          <span className="bg-quaternary-accent text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">
            Hot
          </span>
        )}
      </div>

      {/* Image Container */}
      <div
        className={`relative overflow-hidden ${
          layout === 'list' ? 'w-48 h-48' : 'aspect-square'
        }`}
      >
        <Link to={productLink}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted
                ? 'bg-secondary-accent text-white'
                : 'bg-white text-black hover:bg-secondary-accent hover:text-white'
            }`}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={productLink}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-primary-accent hover:text-white transition-all duration-300"
          >
            <Eye size={20} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-app-text-muted uppercase tracking-widest">
            {product.brand || 'ORCHID'}
          </span>
          <div className="flex items-center gap-1 text-quaternary-accent">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold">{rating.toFixed(1)}</span>
          </div>
        </div>

        <Link
          to={productLink}
          className="text-lg font-black tracking-tight mb-1 group-hover:text-primary-accent transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <p className="text-app-text-muted text-xs mb-4 line-clamp-2 flex-1">
          {product.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-black text-tertiary-accent">
            ${product.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-primary-accent text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all neon-glow"
            disabled={!firstAvailableVariant}
            title={!firstAvailableVariant ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}