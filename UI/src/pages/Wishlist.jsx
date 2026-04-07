import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (product) => {
    addItem(product, product.sizes[0]);
    toggleWishlist(product);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div data-aos="fade-right">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-2">MY WISHLIST.</h1>
          <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs">Saved {items.length} Sneakers</p>
        </div>
        <Link to="/shop" className="btn-outline flex items-center gap-2" data-aos="fade-left">
          CONTINUE SHOPPING <ArrowRight size={18} />
        </Link>
      </div>

      {items.length > 0 ? (
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
                    onClick={() => toggleWishlist(product)}
                    className="w-10 h-10 bg-app-card/50 backdrop-blur-md text-app-text rounded-full flex items-center justify-center hover:bg-secondary-accent transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    className="w-10 h-10 bg-primary-accent text-white rounded-full flex items-center justify-center hover:scale-110 transition-all neon-glow"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 text-center" data-aos="fade-up">
          <div className="w-24 h-24 bg-app-card border border-app-border rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart size={40} className="text-app-text-muted" />
          </div>
          <h3 className="text-4xl font-black tracking-tighter mb-4 italic">YOUR WISHLIST IS EMPTY.</h3>
          <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs mb-10 max-w-md mx-auto">
            Save your favorite kicks here to keep an eye on them. Don't let the heat get away!
          </p>
          <Link to="/shop" className="btn-primary px-12">GO SHOPPING</Link>
        </div>
      )}
    </div>
  );
}
