import React from 'react';
import { Home, Layers, Search, Ruler, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface BottomTabBarProps {
  onOpenSearch: () => void;
  onOpenSizeGuide: () => void;
  onScrollToCatalog: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  onOpenSearch,
  onOpenSizeGuide,
  onScrollToCatalog,
}) => {
  const { itemCount, openCart } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-950/95 backdrop-blur-lg border-t border-dark-800 py-2 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* Inicio */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center text-silver-400 hover:text-gold-400 transition-colors py-1 group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] mt-1 font-medium tracking-wide">Inicio</span>
        </button>

        {/* Categorías */}
        <button
          onClick={onScrollToCatalog}
          className="flex flex-col items-center justify-center text-silver-400 hover:text-gold-400 transition-colors py-1 group"
        >
          <Layers className="w-5 h-5 group-hover:scale-110 transition-transform text-gold-500" />
          <span className="text-[10px] mt-1 font-medium tracking-wide">Catálogo</span>
        </button>

        {/* Buscar */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center text-silver-400 hover:text-gold-400 transition-colors py-1 group"
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] mt-1 font-medium tracking-wide">Buscar</span>
        </button>

        {/* Talles */}
        <button
          onClick={onOpenSizeGuide}
          className="flex flex-col items-center justify-center text-silver-400 hover:text-gold-400 transition-colors py-1 group"
        >
          <Ruler className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] mt-1 font-medium tracking-wide">Talles</span>
        </button>

        {/* Carrito */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center text-silver-400 hover:text-gold-400 transition-colors py-1 relative group"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-gold-400" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gold-500 text-dark-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold text-gold-400 tracking-wide">Carrito</span>
        </button>

      </div>
    </div>
  );
};
