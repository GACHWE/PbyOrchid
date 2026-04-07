import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft,
  Lock,
  Zap
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, clearCart, getTotal } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#EC4899', '#84CC16']
      });
      clearCart();
      setStep(4);
    }, 2000);
  };

  if (items.length === 0 && step < 4) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-black mb-4">YOUR BAG IS EMPTY</h1>
        <Link to="/shop" className="btn-primary">BACK TO SHOP</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-16 relative" data-aos="fade-down">
            <div className="absolute top-1/2 left-0 w-full h-px bg-app-border -translate-y-1/2 z-0" />
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= 1 ? 'bg-primary-accent text-white neon-glow' : 'bg-app-card border border-app-border text-app-text-muted'}`}>1</div>
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= 2 ? 'bg-primary-accent text-white neon-glow' : 'bg-app-card border border-app-border text-app-text-muted'}`}>2</div>
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= 3 ? 'bg-primary-accent text-white neon-glow' : 'bg-app-card border border-app-border text-app-text-muted'}`}>3</div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-black tracking-tighter italic uppercase">Shipping Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="First Name" className="bg-app-card border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none" />
                <input type="text" placeholder="Last Name" className="bg-app-card border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none" />
                <input type="email" placeholder="Email Address" className="bg-app-card border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none md:col-span-2" />
                <input type="text" placeholder="Address" className="bg-app-card border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none md:col-span-2" />
                <input type="text" placeholder="City" className="bg-app-card border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none" />
                <input type="text" placeholder="Zip Code" className="bg-app-card border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none" />
              </div>
              <button onClick={handleNext} className="btn-primary w-full py-4 text-lg">CONTINUE TO PAYMENT</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black tracking-tighter italic uppercase">Payment</h2>
                <button onClick={handleBack} className="text-app-text-muted hover:text-app-text flex items-center gap-1 font-bold text-xs uppercase tracking-widest"><ArrowLeft size={14} /> Back</button>
              </div>
              <div className="bg-app-card border border-app-border rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary-accent bg-primary-accent/5">
                  <CreditCard className="text-primary-accent" />
                  <span className="font-black tracking-widest uppercase text-xs">Credit / Debit Card</span>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Card Number" className="w-full bg-app-bg border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="bg-app-bg border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none" />
                    <input type="text" placeholder="CVC" className="bg-app-bg border border-app-border rounded-xl p-4 focus:border-primary-accent outline-none" />
                  </div>
                </div>
              </div>
              <button onClick={handleNext} className="btn-primary w-full py-4 text-lg">REVIEW ORDER</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black tracking-tighter italic uppercase">Review</h2>
                <button onClick={handleBack} className="text-app-text-muted hover:text-app-text flex items-center gap-1 font-bold text-xs uppercase tracking-widest"><ArrowLeft size={14} /> Back</button>
              </div>
              
              <div className="bg-app-card border border-app-border rounded-3xl p-8 space-y-6">
                {items.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center justify-between border-b border-app-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                      <div>
                        <p className="font-black text-sm">{item.name}</p>
                        <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black text-tertiary-accent">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-app-text-muted font-bold text-xs uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-app-text-muted font-bold text-xs uppercase tracking-widest">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-app-text-muted font-bold text-xs uppercase tracking-widest">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-xl font-black italic">TOTAL</span>
                    <span className="text-3xl font-black text-primary-accent">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder} 
                disabled={isProcessing}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full" /> PROCESSING...</>
                ) : (
                  <><Lock size={20} /> PLACE ORDER</>
                )}
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-tertiary-accent/20 text-tertiary-accent rounded-full flex items-center justify-center mx-auto mb-8 neon-glow-green">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-4">ORDER PLACED!</h2>
              <p className="text-app-text-muted font-bold uppercase tracking-widest text-sm mb-12">Your heat is on its way. Check your email for details.</p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/profile" className="btn-outline px-8">VIEW ORDERS</Link>
                <Link to="/" className="btn-primary px-8">BACK TO HOME</Link>
              </div>

              <div className="mt-20 flex items-center justify-center gap-8 text-app-text-muted">
                <div className="flex flex-col items-center gap-2">
                  <Zap size={24} className="text-primary-accent" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Fast Processing</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Truck size={24} className="text-tertiary-accent" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Express Shipping</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ShieldCheck size={24} className="text-secondary-accent" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Safe Delivery</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
