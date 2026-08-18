import React from 'react';
import { Star, ShieldCheck, Instagram, Heart } from 'lucide-react';
import { REVIEWS } from '../../data/products';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-16 bg-dark-950 border-t border-dark-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1 text-gold-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
            ))}
            <span className="text-xs font-bold text-white ml-1.5">4.9 / 5.0 (Más de 500 pedidos)</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            La Comunidad ROAR
          </h2>
          <p className="text-silver-400 text-xs sm:text-sm">
            Clientes reales luciendo nuestras piezas en toda Argentina. Calidad probada y garantizada.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-dark-900 border border-dark-800 p-5 rounded-2xl flex flex-col justify-between hover:border-gold-500/40 transition-colors"
            >
              <div className="space-y-3">
                {/* Stars & Verified */}
                <div className="flex items-center justify-between">
                  <div className="flex text-gold-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center text-[10px] text-emerald-400 font-semibold space-x-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Comprador verificado</span>
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-xs text-silver-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 border-t border-dark-800 mt-4">
                <div className="font-bold text-white text-xs">{rev.author}</div>
                <div className="text-[10px] text-silver-500">{rev.location}</div>
                <div className="text-[10px] text-gold-500 font-semibold mt-1 truncate">
                  Compró: {rev.productName}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Social Grid Gallery */}
        <div className="pt-8 border-t border-dark-850">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="font-bold text-white text-sm uppercase tracking-wider">
                @roar.joyas en Instagram
              </span>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold-400 hover:underline uppercase font-bold tracking-wider"
            >
              Seguir en Instagram →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="group relative aspect-square rounded-xl overflow-hidden border border-dark-800 bg-dark-900">
              <img
                src={`${import.meta.env.BASE_URL}images/combo-trebol-verde.jpg`}
                alt="Instagram ROAR"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-bold">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>342</span>
              </div>
            </div>

            <div className="group relative aspect-square rounded-xl overflow-hidden border border-dark-800 bg-dark-900">
              <img
                src={`${import.meta.env.BASE_URL}images/collar-sol-dorado.jpg`}
                alt="Instagram ROAR"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-bold">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>518</span>
              </div>
            </div>

            <div className="group relative aspect-square rounded-xl overflow-hidden border border-dark-800 bg-dark-900">
              <img
                src={`${import.meta.env.BASE_URL}images/cadena-cruz-box.jpg`}
                alt="Instagram ROAR"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-bold">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>289</span>
              </div>
            </div>

            <div className="group relative aspect-square rounded-xl overflow-hidden border border-dark-800 bg-dark-900">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
                alt="Instagram ROAR"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-bold">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>410</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
