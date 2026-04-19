import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { showToast } from '../utils/toast';
import {useWishlistStore} from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';

// Skeleton loader component
const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-app-card rounded-2xl aspect-square mb-3"></div>
        <div className="h-4 bg-app-card rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-app-card rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default function Wishlist() {
  const {
    items,
    loading,
    error,
    totalItems,
    hasMore,
    fetchWishlist,
    removeItem,
    loadMore,
  } = useWishlistStore();

  const { addItem: addToCart } = useCartStore();

  // Initial fetch
  useEffect(() => {
    fetchWishlist(0, 12);
  }, []);

  // Move to cart + remove from wishlist
  const handleMoveToCart = async (product) => {
    const firstSize = product.sizes?.[0] || 'M';
    addToCart(product, firstSize);
    try {
      await removeItem(product.id);
      showToast(`${product.name} moved to cart`, 'success');
    } catch (err) {
      showToast(`Failed to move ${product.name} to cart`, 'error');
    }
  };

  // Remove item
  const handleRemove = async (product) => {
    if (window.confirm(`Remove ${product.name} from wishlist?`)) {
      try {
        await removeItem(product.id);
        showToast('Removed from wishlist', 'success');
      } catch (err) {
        showToast('Could not remove item', 'error');
      }
    }
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <p className="text-app-text-muted mb-4">Failed to load wishlist: {error}</p>
        <button onClick={() => fetchWishlist(0, 12)} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div data-aos="fade-right">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-2">
            MY WISHLIST.
          </h1>
          <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs">
            Saved {totalItems} Sneaker{totalItems !== 1 && 's'}
          </p>
        </div>
        <Link to="/shop" className="btn-outline flex items-center gap-2" data-aos="fade-left">
          CONTINUE SHOPPING <ArrowRight size={18} />
        </Link>
      </div>

      {/* Loading first page */}
      {loading && items.length === 0 ? (
        <WishlistSkeleton />
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <ProductCard product={product} />
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <button
                      onClick={() => handleRemove(product)}
                      className="w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-10 h-10 bg-primary-accent text-white rounded-full flex items-center justify-center hover:scale-110 transition-all neon-glow"
                      aria-label="Move to cart"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn-outline flex items-center gap-2 px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    LOADING...
                  </>
                ) : (
                  'LOAD MORE'
                )}
              </button>
            </div>
          )}

          {/* End of list */}
          {!hasMore && items.length > 0 && (
            <p className="text-center text-app-text-muted text-sm mt-12">
              You've reached the end of your wishlist
            </p>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="py-32 text-center" data-aos="fade-up">
          <div className="w-24 h-24 bg-app-card border border-app-border rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart size={40} className="text-app-text-muted" />
          </div>
          <h3 className="text-4xl font-black tracking-tighter mb-4 italic">
            YOUR WISHLIST IS EMPTY.
          </h3>
          <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs mb-10 max-w-md mx-auto">
            Save your favorite kicks here to keep an eye on them. Don't let the heat get away!
          </p>
          <Link to="/shop" className="btn-primary px-12">
            GO SHOPPING
          </Link>
        </div>
      )}
    </div>
  );
}