// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { User, Phone, ShoppingBag, CheckCircle2, MessageCircle, Send } from 'lucide-react';
// import { useCartStore } from '../store/cartStore';
// import { createOrder } from '../api/orders';
// import { showToast } from '../utils/toast';   // ← updated import
// import confetti from 'canvas-confetti';
// import { motion } from 'motion/react';

// export default function Checkout() {
//   const [recipientName, setRecipientName] = useState('');
//   const [whatsappNumber, setWhatsappNumber] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { items, clearCart, getTotal } = useCartStore();
//   const navigate = useNavigate();

//   const total = getTotal();

//   if (items.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-32 text-center">
//         <h1 className="text-4xl font-black mb-4">YOUR BAG IS EMPTY</h1>
//         <Link to="/shop" className="btn-primary">BACK TO SHOP</Link>
//       </div>
//     );
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!recipientName.trim() || !whatsappNumber.trim()) {
//       showToast('Please fill in all fields', 'error');
//       return;
//     }
//     // Basic WhatsApp number validation (allow + and digits)
//     const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
//     if (!phoneRegex.test(whatsappNumber)) {
//       showToast('Please enter a valid phone number', 'error');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const orderItems = items.map(item => ({
//         productId: item.id,
//         quantity: item.quantity,
//         size: item.selectedSize,
//         color: item.selectedColor,
//       }));

//       await createOrder({
//         items: orderItems,
//         recipientName: recipientName.trim(),
//         whatsappNumber: whatsappNumber.trim(),
//       });
//       clearCart();
//       confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#A855F7', '#EC4899', '#84CC16'] });
//       showToast('Order placed! Admin will contact you on WhatsApp.', 'success');
//       // Redirect to order confirmation or profile page after 2 seconds
//       setTimeout(() => navigate('/profile'), 2000);
//     } catch (err) {
//       showToast(err.message, 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-5xl font-black tracking-tighter italic mb-8 text-center">CHECKOUT</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Left: Contact Form */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="bg-app-card border border-app-border rounded-3xl p-8"
//           >
//             <h2 className="text-2xl font-black italic mb-6 flex items-center gap-2">
//               <MessageCircle size={24} className="text-neon-pink" />
//               Contact Details
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-app-text-muted">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted" size={18} />
//                   <input
//                     type="text"
//                     value={recipientName}
//                     onChange={(e) => setRecipientName(e.target.value)}
//                     className="w-full bg-app-bg border border-app-border rounded-xl py-4 pl-12 pr-4 focus:border-primary-accent outline-none transition-colors"
//                     placeholder="John Doe"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-app-text-muted">
//                   WhatsApp Number
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted" size={18} />
//                   <input
//                     type="tel"
//                     value={whatsappNumber}
//                     onChange={(e) => setWhatsappNumber(e.target.value)}
//                     className="w-full bg-app-bg border border-app-border rounded-xl py-4 pl-12 pr-4 focus:border-primary-accent outline-none transition-colors"
//                     placeholder="+1234567890"
//                     required
//                   />
//                 </div>
//                 <p className="text-[10px] text-app-text-muted mt-2">Include country code (e.g., +1 for US)</p>
//               </div>

//               <div className="bg-neon-green/5 border border-neon-green/20 rounded-2xl p-4 mt-6">
//                 <p className="text-xs font-bold text-neon-green flex items-center gap-2">
//                   <CheckCircle2 size={14} />
//                   Admin will contact you on WhatsApp to confirm payment & delivery.
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
//               >
//                 {isSubmitting ? (
//                   <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" /> PLACING ORDER...</>
//                 ) : (
//                   <><Send size={20} /> PLACE ORDER</>
//                 )}
//               </button>
//             </form>
//           </motion.div>

//           {/* Right: Order Summary */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="bg-app-card border border-app-border rounded-3xl p-8 sticky top-32 h-fit"
//           >
//             <h2 className="text-2xl font-black italic mb-6 flex items-center gap-2">
//               <ShoppingBag size={24} className="text-primary-accent" />
//               Your Order
//             </h2>
//             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
//               {items.map((item) => (
//                 <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 border-b border-app-border pb-4">
//                   <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
//                   <div className="flex-1">
//                     <p className="font-black text-sm">{item.name}</p>
//                     <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">
//                       {item.selectedSize} / {item.selectedColor} &nbsp;| Qty: {item.quantity}
//                     </p>
//                     <p className="text-tertiary-accent font-bold text-sm mt-1">${(item.price * item.quantity).toFixed(2)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 pt-4 border-t border-app-border">
//               <div className="flex justify-between items-end">
//                 <span className="text-xl font-black italic">TOTAL</span>
//                 <span className="text-3xl font-black text-primary-accent">${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, ShoppingBag, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { createOrder } from '../api/orders';
import { showToast } from '../utils/toast';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

export default function Checkout() {
  const [recipientName, setRecipientName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, clearCart, getTotal } = useCartStore();
  const navigate = useNavigate();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-black mb-4">YOUR BAG IS EMPTY</h1>
        <Link to="/shop" className="btn-primary">BACK TO SHOP</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientName.trim() || !whatsappNumber.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
    if (!phoneRegex.test(whatsappNumber)) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.productId,      // product UUID
        quantity: item.quantity,
        size: item.size,         // stored directly from variant
        color: item.color,       // stored directly from variant
      }));

      await createOrder({
        items: orderItems,
        recipientName: recipientName.trim(),
        whatsappNumber: whatsappNumber.trim(),
      });
      clearCart();
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#A855F7', '#EC4899', '#84CC16'] });
      showToast('Order placed! Admin will contact you on WhatsApp.', 'success');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black tracking-tighter italic mb-8 text-center">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-app-card border border-app-border rounded-3xl p-8"
          >
            <h2 className="text-2xl font-black italic mb-6 flex items-center gap-2">
              <MessageCircle size={24} className="text-neon-pink" />
              Contact Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-app-text-muted">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted" size={18} />
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-4 pl-12 pr-4 focus:border-primary-accent outline-none transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-app-text-muted">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted" size={18} />
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-4 pl-12 pr-4 focus:border-primary-accent outline-none transition-colors"
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <p className="text-[10px] text-app-text-muted mt-2">Include country code (e.g., +1 for US)</p>
              </div>

              <div className="bg-neon-green/5 border border-neon-green/20 rounded-2xl p-4 mt-6">
                <p className="text-xs font-bold text-neon-green flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  Admin will contact you on WhatsApp to confirm payment & delivery.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" /> PLACING ORDER...</>
                ) : (
                  <><Send size={20} /> PLACE ORDER</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-app-card border border-app-border rounded-3xl p-8 sticky top-32 h-fit"
          >
            <h2 className="text-2xl font-black italic mb-6 flex items-center gap-2">
              <ShoppingBag size={24} className="text-primary-accent" />
              Your Order
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 border-b border-app-border pb-4">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                  <div className="flex-1">
                    <p className="font-black text-sm">{item.name}</p>
                    <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">
                      {item.size} / {item.color} &nbsp;| Qty: {item.quantity}
                    </p>
                    <p className="text-tertiary-accent font-bold text-sm mt-1">Ksh {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-app-border">
              <div className="flex justify-between items-end">
                <span className="text-xl font-black italic">TOTAL</span>
                <span className="text-3xl font-black text-primary-accent">Ksh {total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}