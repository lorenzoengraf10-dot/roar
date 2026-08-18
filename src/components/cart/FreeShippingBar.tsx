import React from 'react';
import { Truck, CheckCircle, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export const FreeShippingBar: React.FC = () => {
  const { isFreeShipping, freeShippingProgress, freeShippingRemaining, subtotal } = useCart();

  if (subtotal === 0) return null;

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-xl p-3.5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        {isFreeShipping ? (
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>¡Genial! Tienes ENVÍO GRATIS a todo el país</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-silver-300 font-medium">
            <Truck className="w-4 h-4 text-gold-400" />
            <span>
              Estás a <strong className="text-gold-400 font-bold">{formatCurrency(freeShippingRemaining)}</strong> de tener <strong className="text-white font-bold">Envío Gratis</strong>
            </span>
          </div>
        )}
        <span className="text-[10px] text-silver-500 font-bold">
          {Math.round(freeShippingProgress)}%
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden border border-dark-800">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFreeShipping 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
              : 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400'
          }`}
          style={{ width: `${freeShippingProgress}%` }}
        />
      </div>

      {!isFreeShipping && (
        <div className="text-[10px] text-silver-500 flex items-center justify-between">
          <span>Meta: $90.000</span>
          <span className="text-gold-400 font-semibold">Superando los $90k el envío es $0</span>
        </div>
      )}
    </div>
  );
};
