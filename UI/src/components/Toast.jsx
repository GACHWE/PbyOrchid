import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

let toastCount = 0;
let addToastFn = null;

export const toast = (message, type = 'success') => {
  if (addToastFn) {
    addToastFn(message, type);
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = (message, type) => {
      const id = toastCount++;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[300px] ${
              t.type === 'success' 
                ? 'bg-neon-green/10 border-neon-green/20 text-neon-green neon-glow-green' 
                : 'bg-neon-pink/10 border-neon-pink/20 text-neon-pink neon-glow-pink'
            }`}
          >
            {t.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <p className="font-black text-xs uppercase tracking-widest flex-1">{t.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} className="opacity-50 hover:opacity-100">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
