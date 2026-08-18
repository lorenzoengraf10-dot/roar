import React from 'react';
import { Flame, ShieldCheck, CreditCard, Truck } from 'lucide-react';

export const MarqueeHeader: React.FC = () => {
  const promoText = (
    <div className="flex items-center space-x-6 text-xs sm:text-sm font-semibold tracking-wider text-dark-950 uppercase">
      <span className="flex items-center space-x-1.5 font-bold">
        <Flame className="w-4 h-4 text-red-600 fill-red-600 animate-pulse" />
        <span>15% OFF EN TRANSFERENCIA</span>
      </span>
      <span className="text-dark-900/60">•</span>
      <span className="flex items-center space-x-1.5 font-bold">
        <CreditCard className="w-4 h-4 text-dark-900" />
        <span>3 Y 6 CUOTAS SIN INTERÉS</span>
      </span>
      <span className="text-dark-900/60">•</span>
      <span className="flex items-center space-x-1.5 font-bold">
        <Truck className="w-4 h-4 text-emerald-900" />
        <span>ENVÍO GRATIS A PARTIR DE $90.000</span>
      </span>
      <span className="text-dark-900/60">•</span>
      <span className="flex items-center space-x-1.5 font-bold">
        <ShieldCheck className="w-4 h-4 text-blue-900" />
        <span>ENVÍOS A TODA LA ARGENTINA</span>
      </span>
      <span className="text-dark-900/60">•</span>
    </div>
  );

  return (
    <aside aria-label="Anuncios y Promociones" className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 border-b border-gold-600/30 overflow-hidden py-2 relative z-40 select-none shadow-md">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center space-x-6 shrink-0 mr-6">
          {promoText}
        </div>
        <div className="flex items-center space-x-6 shrink-0 mr-6" aria-hidden="true">
          {promoText}
        </div>
        <div className="flex items-center space-x-6 shrink-0 mr-6" aria-hidden="true">
          {promoText}
        </div>
        <div className="flex items-center space-x-6 shrink-0 mr-6" aria-hidden="true">
          {promoText}
        </div>
      </div>
    </aside>
  );
};
