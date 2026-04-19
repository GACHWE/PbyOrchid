// utils/toast.js
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export const showToast = (message, type = 'success') => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
          type === 'success'
            ? 'bg-neon-green/10 border-neon-green/20 text-neon-green neon-glow-green'
            : 'bg-neon-pink/10 border-neon-pink/20 text-neon-pink neon-glow-pink'
        }`}
      >
        {type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        <p className="font-black text-xs uppercase tracking-widest flex-1">{message}</p>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="opacity-50 hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>
    ),
    { duration: 3000, position: 'bottom-right' }
  );
};