import React from 'react';
import { ArrowRight, Sparkles, Flame, Shield, Award } from 'lucide-react';
import { ProductCategory } from '../../types';

interface HeroBannerProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 py-12 lg:py-20 border-b border-dark-800">
      
      {/* Background radial ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-navy-custom/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-gold-500/30 text-gold-400 text-xs uppercase font-bold tracking-widest shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>NUEVO DROP 2026 • JOYERÍA & ACCESORIOS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
              DOMINA TU ESTILO CON{' '}
              <span className="gold-gradient-text">ROAR</span>
            </h1>

            {/* Subheading */}
            <p className="text-silver-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Piezas forjadas en acero quirúrgico 316L y plata de ley. Diseñadas para resistir agua, entrenamientos y el paso del tiempo con brillo inalterable.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="bg-dark-850/80 border border-dark-700/80 p-3 rounded-lg flex items-center space-x-2.5">
                <Flame className="w-5 h-5 text-red-500 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white uppercase">15% OFF</div>
                  <div className="text-[10px] text-silver-400">En Transferencia</div>
                </div>
              </div>
              <div className="bg-dark-850/80 border border-dark-700/80 p-3 rounded-lg flex items-center space-x-2.5">
                <Shield className="w-5 h-5 text-gold-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white uppercase">6 CUOTAS</div>
                  <div className="text-[10px] text-silver-400">Sin Interés</div>
                </div>
              </div>
              <div className="bg-dark-850/80 border border-dark-700/80 p-3 rounded-lg flex items-center space-x-2.5 col-span-2 sm:col-span-1">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white uppercase">WATERPROOF</div>
                  <div className="text-[10px] text-silver-400">Acero 316L</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-dark-950 font-black px-8 py-4 rounded-xl text-sm uppercase tracking-widest transition-all shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 flex items-center justify-center space-x-2 group"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectCategory('ofertas-combos')}
                className="w-full sm:w-auto bg-dark-850 hover:bg-dark-800 text-silver-200 hover:text-white border border-dark-700 hover:border-gold-500/50 font-bold px-7 py-4 rounded-xl text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <span>🔥 Ver Packs & Combos</span>
              </button>
            </div>

          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Main Banner Image Container */}
              <div className="relative rounded-2xl overflow-hidden border border-dark-700 bg-dark-850 shadow-2xl group">
                <img
                  src={`${import.meta.env.BASE_URL}images/combo-trebol-verde.jpg`}
                  alt="ROAR Drop 2026"
                  className="w-full h-[380px] sm:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                
                {/* Floating Product Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-dark-900/90 backdrop-blur-md p-4 rounded-xl border border-dark-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                      SET DESTACADO
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      Combo Trébol Esmeralda Silver
                    </h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-gold-400 font-black text-sm">$74.999</span>
                      <span className="text-xs text-silver-500 line-through">$94.000</span>
                      <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded">
                        20% OFF
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectCategory('ofertas-combos')}
                    className="bg-gold-500 hover:bg-gold-400 text-dark-950 text-xs font-black uppercase tracking-wider px-3.5 py-2.5 rounded-lg transition-all"
                  >
                    Ver Set
                  </button>
                </div>
              </div>

              {/* Floating Secondary Mini Card */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-dark-900 border border-dark-700/90 p-3 rounded-xl shadow-xl items-center space-x-3 backdrop-blur-md">
                <img
                  src={`${import.meta.env.BASE_URL}images/cadena-cruz-box.jpg`}
                  alt="Cruz Silver"
                  className="w-12 h-12 rounded-lg object-cover border border-dark-700"
                />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gold-400">Favorito de Clientes</div>
                  <div className="text-xs font-bold text-white">Cadena Cruz Box Silver</div>
                  <div className="text-xs text-silver-400">3 cuotas de <strong className="text-white">$16.666</strong></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
