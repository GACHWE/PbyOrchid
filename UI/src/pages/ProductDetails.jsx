// import React, { useState, useMemo } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { 
//   Star, 
//   Heart, 
//   ShoppingCart, 
//   ArrowLeft, 
//   Truck, 
//   ShieldCheck, 
//   RotateCcw,
//   Plus,
//   Minus,
//   Check
// } from 'lucide-react';
// import { SNEAKERS } from '../data/sneakers';
// import { useCartStore } from '../store/cartStore';
// import { useWishlistStore } from '../store/wishlistStore';
// import ProductCard from '../components/ProductCard';
// import { motion, AnimatePresence } from 'motion/react';
// import { toast } from '../components/Toast';

// export default function Product() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const product = useMemo(() => SNEAKERS.find(s => s.id === parseInt(id)), [id]);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [activeImage, setActiveImage] = useState(0);
//   const [isAdded, setIsAdded] = useState(false);

//   const { addItem } = useCartStore();
//   const { toggleWishlist, isInWishlist } = useWishlistStore();
//   const isWishlisted = isInWishlist(product?.id);

//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-32 text-center">
//         <h1 className="text-4xl font-black mb-4">SNEAKER NOT FOUND</h1>
//         <Link to="/shop" className="btn-primary">BACK TO SHOP</Link>
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     if (!selectedSize) {
//       toast("Please select a size first!", "error");
//       return;
//     }
//     addItem(product, selectedSize);
//     setIsAdded(true);
//     toast(`Added ${product.name} (Size: ${selectedSize}) to cart!`);
//     setTimeout(() => setIsAdded(false), 2000);
//   };

//   const handleWishlist = () => {
//     toggleWishlist(product);
//     toast(isWishlisted ? `Removed from wishlist` : `Added to wishlist!`);
//   };

//   const relatedProducts = SNEAKERS.filter(s => s.brand === product.brand && s.id !== product.id).slice(0, 4);

//   return (
//     <div className="container mx-auto px-4 py-12">
//       {/* Breadcrumbs */}
//       <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white font-bold text-sm uppercase tracking-widest mb-12 transition-colors">
//         <ArrowLeft size={18} /> Back
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
//         {/* Gallery */}
//         <div className="space-y-6" data-aos="fade-right">
//           <div className="aspect-square rounded-3xl overflow-hidden bg-dark-card border border-dark-border relative group">
//             <img 
//               src={product.image} 
//               alt={product.name} 
//               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//               referrerPolicy="no-referrer"
//             />
//             <div className="absolute top-6 left-6 flex flex-col gap-2">
//               {product.isNew && <span className="bg-neon-green text-black px-3 py-1 rounded-sm font-black text-[10px] uppercase">New Drop</span>}
//               {product.isTrending && <span className="bg-neon-orange text-white px-3 py-1 rounded-sm font-black text-[10px] uppercase">Trending</span>}
//             </div>
//           </div>
//           <div className="grid grid-cols-4 gap-4">
//             {[product.image, product.image, product.image, product.image].map((img, i) => (
//               <button 
//                 key={i}
//                 onClick={() => setActiveImage(i)}
//                 className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-neon-purple' : 'border-dark-border hover:border-gray-600'}`}
//               >
//                 <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Info */}
//         <div data-aos="fade-left">
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-neon-purple font-black tracking-widest uppercase text-xs">{product.brand}</span>
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1 text-neon-orange">
//                 <Star size={16} fill="currentColor" />
//                 <span className="font-black">{product.rating}</span>
//               </div>
//               <span className="text-gray-500 text-xs font-bold">({product.reviews} Reviews)</span>
//             </div>
//           </div>

//           <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic mb-6 leading-none">{product.name}</h1>
          
//           <div className="flex items-center gap-6 mb-8">
//             <span className="text-4xl font-black text-neon-green">${product.price}</span>
//             <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Free Shipping Included</span>
//           </div>

//           <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium">
//             {product.description}
//           </p>

//           {/* Size Selector */}
//           <div className="mb-10">
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="font-black tracking-widest uppercase text-xs">Select Size (US)</h4>
//               <button className="text-neon-purple text-[10px] font-black uppercase tracking-widest hover:underline">Size Guide</button>
//             </div>
//             <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
//               {product.sizes.map(size => (
//                 <button
//                   key={size}
//                   onClick={() => setSelectedSize(size)}
//                   className={`py-3 rounded-xl font-black text-sm transition-all border-2 ${selectedSize === size ? 'bg-neon-purple border-neon-purple text-white neon-glow' : 'bg-dark-card border-dark-border hover:border-neon-purple text-gray-400'}`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-12">
//             <div className="flex items-center bg-dark-card border border-dark-border rounded-full px-4 py-2">
//               <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:text-neon-purple transition-colors"><Minus size={18} /></button>
//               <span className="w-12 text-center font-black text-lg">{quantity}</span>
//               <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:text-neon-purple transition-colors"><Plus size={18} /></button>
//             </div>
            
//             <button 
//               onClick={handleAddToCart}
//               className={`flex-1 btn-primary flex items-center justify-center gap-3 py-4 ${isAdded ? 'bg-neon-green hover:bg-neon-green' : ''}`}
//             >
//               {isAdded ? (
//                 <><Check size={20} /> ADDED TO CART</>
//               ) : (
//                 <><ShoppingCart size={20} /> ADD TO CART</>
//               )}
//             </button>
            
//             <button 
//               onClick={handleWishlist}
//               className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${isWishlisted ? 'bg-neon-pink border-neon-pink text-white' : 'border-dark-border hover:border-neon-pink text-gray-400'}`}
//             >
//               <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
//             </button>
//           </div>

//           {/* Features */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-dark-border pt-10">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neon-purple"><Truck size={20} /></div>
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fast Delivery</p>
//                 <p className="text-xs font-bold">2-4 Business Days</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neon-green"><ShieldCheck size={20} /></div>
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Authentic</p>
//                 <p className="text-xs font-bold">100% Guaranteed</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neon-pink"><RotateCcw size={20} /></div>
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Easy Returns</p>
//                 <p className="text-xs font-bold">30 Day Window</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       <section className="py-24 border-t border-dark-border">
//         <div className="flex items-center justify-between mb-12">
//           <h2 className="text-4xl font-black tracking-tighter italic">YOU MAY ALSO LIKE.</h2>
//           <Link to="/shop" className="text-neon-purple font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {relatedProducts.map(sneaker => (
//             <ProductCard key={sneaker.id} product={sneaker} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// pages/Product.jsx (relevant parts)
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Heart, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RotateCcw,
  Plus, Minus, Check
} from 'lucide-react';
import { getProductById, getAllProducts } from '../api/products';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/ProductCard';
import VariantSelector from '../components/VariantSelector';
import { motion, AnimatePresence } from 'motion/react';
import { showToast } from '../utils/toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product?.id);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data);
        
        // Default to first in-stock variant, or first overall
        const defaultVariant = data.variants?.find(v => v.stockQuantity > 0) || data.variants?.[0];
        setSelectedVariant(defaultVariant);
        
        if (data.brand) {
          setRelatedLoading(true);
          try {
            const relatedResp = await getAllProducts({
              brand: data.brand,
              page: 0,
              size: 4,
              sort: 'createdAt,desc'
            });
            const filtered = relatedResp.content.filter(p => p.id !== data.id);
            setRelatedProducts(filtered.slice(0,4));
          } catch (err) {
            console.error('Failed to fetch related products', err);
          } finally {
            setRelatedLoading(false);
          }
        }
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast("Please select a color and size first!", "error");
      return;
    }
    if (selectedVariant.stockQuantity === 0) {
      showToast("This variant is out of stock!", "error");
      return;
    }
    // ✅ Pass product (for price, name) and full variant (store uses only primitive fields)
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    showToast(`Added ${product.name} (${selectedVariant.color}, ${selectedVariant.size}) x${quantity} to cart!`, "success");
    setTimeout(() => setIsAdded(false), 2000);
  };
  
  const handleWishlist = async () => {
    if (!product) return;
    if (isWishlisted) {
      await removeFromWishlist(product.id);
      showToast(`Removed ${product.name} from wishlist`, "success");
    } else {
      await addToWishlist(product.id, product);
      showToast(`Added ${product.name} to wishlist!`, "success");
    }
  };
  
  if (loading) return <div className="container mx-auto px-4 py-32 flex justify-center"><LoadingSpinner /></div>;
  if (error || !product) return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-4xl font-black mb-4">PRODUCT NOT FOUND</h1>
      <p className="text-red-500 mb-8">{error}</p>
      <Link to="/shop" className="btn-primary">BACK TO SHOP</Link>
    </div>
  );
  
  const images = product.resources?.length ? product.resources.map(r => r.url) : [product.image || 'https://via.placeholder.com/600'];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white font-bold text-sm uppercase tracking-widest mb-12">
        <ArrowLeft size={18} /> Back
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square rounded-3xl overflow-hidden bg-dark-card border border-dark-border relative group">
            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {product.newArrival && <span className="bg-neon-green text-black px-3 py-1 rounded-sm font-black text-[10px] uppercase">New Drop</span>}
              {product.featured && <span className="bg-neon-orange text-white px-3 py-1 rounded-sm font-black text-[10px] uppercase">Trending</span>}
            </div>
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-neon-purple' : 'border-dark-border hover:border-gray-600'}`}>
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${i+1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-neon-purple font-black tracking-widest uppercase text-xs">{product.brand}</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-neon-orange">
                <Star size={16} fill="currentColor" />
                <span className="font-black">{product.rating || 0}</span>
              </div>
              <span className="text-gray-500 text-xs font-bold">(TODO: reviews)</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic mb-6 leading-none">{product.name}</h1>
          
          {/* Price from product */}
          <div className="flex items-center gap-6 mb-8">
            <span className="text-4xl font-black text-neon-green">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-500 line-through text-xl">${product.originalPrice}</span>
            )}
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Free Shipping</span>
          </div>
          
          <p className="text-gray-400 text-lg leading-relaxed mb-10">{product.description || "No description available."}</p>
          
          {/* Stock indicator */}
          {selectedVariant && (
            <div className="mb-4">
              {selectedVariant.stockQuantity > 0 ? (
                <span className="text-green-500 text-sm font-medium">✓ In stock ({selectedVariant.stockQuantity} available)</span>
              ) : (
                <span className="text-red-500 text-sm font-medium">✗ Out of stock</span>
              )}
            </div>
          )}
          
          {/* Variant Selector - receives and returns full variant but never renders it directly */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-10">
              <VariantSelector
                variants={product.variants}
                onVariantChange={setSelectedVariant}
                initialColor={selectedVariant?.color}
                initialSize={selectedVariant?.size}
              />
            </div>
          )}
          
          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="flex items-center bg-dark-card border border-dark-border rounded-full px-4 py-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:text-neon-purple"><Minus size={18} /></button>
              <span className="w-12 text-center font-black text-lg">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:text-neon-purple"><Plus size={18} /></button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
              className={`flex-1 btn-primary flex items-center justify-center gap-3 py-4 ${isAdded ? 'bg-neon-green' : ''} ${(!selectedVariant || selectedVariant.stockQuantity === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAdded ? <><Check size={20} /> ADDED TO CART</> : <><ShoppingCart size={20} /> ADD TO CART</>}
            </button>
            
            <button onClick={handleWishlist} className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${isWishlisted ? 'bg-neon-pink border-neon-pink text-white' : 'border-dark-border hover:border-neon-pink text-gray-400'}`}>
              <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-dark-border pt-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neon-purple"><Truck size={20} /></div>
              <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fast Delivery</p><p className="text-xs font-bold">2-4 Business Days</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neon-green"><ShieldCheck size={20} /></div>
              <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Authentic</p><p className="text-xs font-bold">100% Guaranteed</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neon-pink"><RotateCcw size={20} /></div>
              <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Easy Returns</p><p className="text-xs font-bold">30 Day Window</p></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <section className="py-24 border-t border-dark-border">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black tracking-tighter italic">YOU MAY ALSO LIKE.</h2>
          <Link to="/shop" className="text-neon-purple font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
        </div>
        {relatedLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="small" /></div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-center text-gray-500">No related products found.</p>
        )}
      </section>
    </div>
  );
}