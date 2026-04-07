import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const subtotal = getTotal();
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12" data-aos="fade-right">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-2">YOUR BAG.</h1>
        <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs">{items.length} Items in your cart</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-app-card border border-app-border rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-app-bg border border-app-border flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-primary-accent font-black text-[10px] uppercase tracking-widest mb-1">{item.brand}</p>
                    <h3 className="text-xl font-black tracking-tight mb-1">{item.name}</h3>
                    <p className="text-app-text-muted text-xs font-bold uppercase tracking-widest mb-4">Size: US {item.selectedSize}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center bg-app-bg border border-app-border rounded-full px-3 py-1">
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} className="p-1 hover:text-primary-accent transition-colors"><Minus size={14} /></button>
                        <span className="w-8 text-center font-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} className="p-1 hover:text-primary-accent transition-colors"><Plus size={14} /></button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id, item.selectedSize)}
                        className="text-app-text-muted hover:text-secondary-accent transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="text-2xl font-black text-tertiary-accent">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest mt-1">${item.price} each</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="bg-app-card border border-app-border p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                <Truck className="text-primary-accent" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-app-text-muted">Free Shipping</p>
                <p className="text-xs font-bold">On orders over $200</p>
              </div>
              <div className="bg-app-card border border-app-border p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                <ShieldCheck className="text-tertiary-accent" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-app-text-muted">Secure Payment</p>
                <p className="text-xs font-bold">SSL Encrypted</p>
              </div>
              <div className="bg-app-card border border-app-border p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                <RotateCcw className="text-secondary-accent" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-app-text-muted">Easy Returns</p>
                <p className="text-xs font-bold">30 Day Guarantee</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-app-card border border-app-border rounded-3xl p-8 sticky top-32 neon-glow">
              <h3 className="text-2xl font-black tracking-tighter italic mb-8 uppercase">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-app-text-muted font-bold text-sm">
                  <span>Subtotal</span>
                  <span className="text-app-text">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-app-text-muted font-bold text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-tertiary-accent" : "text-app-text"}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-app-text-muted font-bold text-sm">
                  <span>Estimated Tax</span>
                  <span className="text-app-text">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-app-border my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black tracking-tighter italic">TOTAL</span>
                  <span className="text-3xl font-black text-primary-accent">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg">
                CHECKOUT NOW <ArrowRight size={20} />
              </Link>
              
              <div className="mt-8">
                <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest text-center mb-4">We Accept</p>
                <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" className="h-6" alt="Apple Pay" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center" data-aos="fade-up">
          <div className="w-24 h-24 bg-app-card border border-app-border rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingCart size={40} className="text-app-text-muted" />
          </div>
          <h3 className="text-4xl font-black tracking-tighter mb-4 italic">YOUR BAG IS EMPTY.</h3>
          <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs mb-10 max-w-md mx-auto">
            Looks like you haven't added any heat to your bag yet. What are you waiting for?
          </p>
          <Link to="/shop" className="btn-primary px-12">GO SHOPPING</Link>
        </div>
      )}
    </div>
  );
}
