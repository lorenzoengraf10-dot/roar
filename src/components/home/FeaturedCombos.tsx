import React from 'react';
import { Sparkles, Flame, Check, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, calculateTransferDiscount, calculateInstallment } from '../../utils/currency';
import { useCart } from '../../context/CartContext';

interface FeaturedCombosProps {
  combos: Product[];
  onQuickView: (product: Product) => void;
}

export const FeaturedCombos: React.FC<FeaturedCombosProps> = ({ combos, onQuickView }) => {
  const { addToCart } = useCart();

  if (combos.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-dark-900 via-dark-850 to-dark-900 border-y border-dark-800 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs uppercase font-bold tracking-widest">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>SETS & PACKS EXCLUSIVOS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Combos de Alto Impacto
          </h2>
          <p className="text-silver-400 text-sm">
            Conjuntos curados de collar + pulsera con descuento especial incluido. Ahorra hasta un 25% llevando el set completo.
          </p>
        </div>

        {/* Combos Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => {
            const savings = combo.originalPrice ? combo.originalPrice - combo.price : 0;
            const transferPrice = calculateTransferDiscount(combo.price);
            const installmentPrice = calculateInstallment(combo.price, 6);

            return (
              <div
                key={combo.id}
                className="bg-dark-950/80 rounded-2xl border border-dark-700 hover:border-gold-500/60 p-5 flex flex-col justify-between transition-all duration-300 card-dark-hover relative group"
              >
                {/* Save Badge */}
                {savings > 0 && (
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Ahorrás {formatCurrency(savings)}
                  </div>
                )}

                <div>
                  {/* Image */}
                  <div 
                    onClick={() => onQuickView(combo)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-dark-900 border border-dark-800 cursor-pointer"
                  >
                    <img
                      src={combo.images[0]}
                      alt={combo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-3 bg-dark-900/90 text-gold-400 border border-gold-500/30 text-[10px] font-black uppercase px-2.5 py-1 rounded">
                      SET 2 EN 1
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 
                    onClick={() => onQuickView(combo)}
                    className="text-base font-bold text-white hover:text-gold-400 transition-colors cursor-pointer line-clamp-1"
                  >
                    {combo.name}
                  </h3>
                  <p className="text-xs text-silver-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {combo.description}
                  </p>

                  {/* Features list */}
                  <div className="my-4 space-y-1.5 text-xs text-silver-300 bg-dark-900/60 p-3 rounded-lg border border-dark-800">
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Incluye Collar + Pulsera a juego</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Caja de presentación ROAR de regalo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Envío asegurado a todo el país</span>
                    </div>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-3 border-t border-dark-800 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-black text-white">
                          {formatCurrency(combo.price)}
                        </span>
                        {combo.originalPrice && (
                          <span className="text-xs text-silver-500 line-through">
                            {formatCurrency(combo.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-emerald-400 font-bold">
                        {formatCurrency(transferPrice)} con Transferencia
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-silver-400 uppercase font-semibold">En 6 cuotas de</div>
                      <div className="text-sm font-bold text-gold-400">{formatCurrency(installmentPrice)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onQuickView(combo)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold text-silver-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-dark-700 uppercase tracking-wider transition-colors"
                    >
                      Ver Opciones
                    </button>
                    <button
                      onClick={() => addToCart(combo, combo.variants[0], 1)}
                      className="py-2.5 px-3 rounded-xl text-xs font-black text-dark-950 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-1"
                    >
                      <span>Comprar Set</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
