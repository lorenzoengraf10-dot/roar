import React from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-dark-900 border border-gold-500/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-md">
        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-xs font-semibold text-silver-200">
          {toastMessage}
        </p>
      </div>
    </div>
  );
};
