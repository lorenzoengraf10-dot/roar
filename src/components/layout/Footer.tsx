import React, { useState } from 'react';
import { Instagram, Phone, Mail, MapPin, ShieldCheck, RefreshCw, Truck, CreditCard, Send, CheckCircle2 } from 'lucide-react';
import { ProductCategory } from '../../types';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onSelectCategory: (cat: ProductCategory | 'todos') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSizeGuide, onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-dark-900 border-t border-dark-800 text-silver-400 text-sm">
      
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border-b border-dark-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs uppercase font-bold tracking-widest">
            <span>🎁 10% OFF EXTRA EN TU PRIMER PEDIDO</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Únete al ROAR Club
          </h3>
          <p className="text-silver-400 text-sm max-w-xl mx-auto">
            Recibe accesos anticipados a nuevos drops, promociones exclusivas de combos y códigos de descuento secretos.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-5 py-3 rounded-lg text-sm font-semibold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>¡Genial! Te enviamos tu código del 10% OFF a tu email.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-500 text-white px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shrink-0"
              >
                <span>Suscribirme</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-display font-black text-2xl tracking-[0.2em] text-white">
                ROAR
              </span>
              <span className="text-xs text-gold-500 font-bold uppercase tracking-widest border-l border-dark-700 pl-2">
                Joyería Urbana
              </span>
            </div>
            <p className="text-xs leading-relaxed text-silver-400">
              Diseñamos joyas y accesorios que definen tu presencia. Piezas forjadas en acero quirúrgico 316L y plata 925 con acabados de alta resistencia e inalterables al agua.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-dark-800 hover:bg-gold-500 hover:text-dark-950 flex items-center justify-center text-silver-300 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5491123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-dark-800 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-silver-300 transition-all"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:contacto@roarjoyas.com"
                className="w-9 h-9 rounded-full bg-dark-800 hover:bg-navy-custom hover:text-white flex items-center justify-center text-silver-300 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-dark-800 pb-2">
              Categorías
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('ofertas-combos')}
                  className="hover:text-gold-400 transition-colors"
                >
                  🔥 Ofertas & Combos Especiales
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cadenas')}
                  className="hover:text-gold-400 transition-colors"
                >
                  Cadenas & Dijes (Cruces, Medallones)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pulseras')}
                  className="hover:text-gold-400 transition-colors"
                >
                  Pulseras (Cuban Link, Tennis, Cuero)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('anillos')}
                  className="hover:text-gold-400 transition-colors"
                >
                  Anillos (Titanio, Sellos, Spinners)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('accesorios')}
                  className="hover:text-gold-400 transition-colors"
                >
                  Cadenas de Pantalón & Kits de Cuidado
                </button>
              </li>
            </ul>
          </div>

          {/* Ayuda & Guías */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-dark-800 pb-2">
              Ayuda & Asistencia
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenSizeGuide} className="hover:text-gold-400 transition-colors text-left">
                  📏 Guía de Talles para Anillos y Cadenas
                </button>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-gold-400 transition-colors">
                  🔄 Cambios y Devoluciones (30 días)
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-gold-400 transition-colors">
                  🛡️ Garantía de Calidad e Inalterabilidad
                </a>
              </li>
              <li>
                <a href="https://www.correoargentino.com.ar" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                  🚚 Seguimiento de Envíos
                </a>
              </li>
              <li>
                <a href="https://wa.me/5491123456789" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  💬 Atención Personalizada por WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Medios de Pago & Envíos */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-dark-800 pb-2">
              Pagos & Logística
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2">
                <CreditCard className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>3 y 6 Cuotas Sin Interés con todas las tarjetas de crédito bancarias.</span>
              </div>
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>15% de Descuento directo abonando con Transferencia / Depósito.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Envíos a todo el país vía Correo Argentino, Andreani y Moto Express.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-dark-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-silver-500 gap-4">
          <p>© {new Date().getFullYear()} ROAR Jewelry. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-4">
            <span>Industria Argentina 🇦🇷</span>
            <span>•</span>
            <span>Términos y Condiciones</span>
            <span>•</span>
            <span>Privacidad</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
