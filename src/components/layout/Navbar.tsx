import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, Ruler, HelpCircle, PhoneCall, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CATEGORIES } from '../../data/products';
import { ProductCategory } from '../../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSizeGuide: () => void;
  selectedCategory: ProductCategory | 'todos';
  onSelectCategory: (cat: ProductCategory | 'todos') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenSizeGuide,
  selectedCategory,
  onSelectCategory,
}) => {
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (cat: ProductCategory | 'todos') => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
    // Smooth scroll to product section if on home
    const section = document.getElementById('catalogo-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-dark-950/95 backdrop-blur-md border-b border-dark-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Utilities (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 text-silver-400 hover:text-gold-400 transition-colors group"
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-widest font-medium">Buscar</span>
            </button>

            <button
              onClick={onOpenSizeGuide}
              className="flex items-center space-x-1.5 text-xs uppercase tracking-widest text-silver-400 hover:text-gold-400 transition-colors"
            >
              <Ruler className="w-4 h-4 text-gold-500" />
              <span>Guía de Talles</span>
            </button>
          </div>

          {/* Mobile Menu Button (Left on mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-silver-300 hover:text-white p-2"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={onOpenSearch}
              className="text-silver-300 hover:text-gold-400 p-2 ml-1"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Center Brand / Logo */}
          <div className="flex items-center justify-center">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleCategoryClick('todos'); }}
              className="flex flex-col items-center group py-2"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/logo-roar.jpg`}
                alt="ROAR Jewelry"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105 rounded"
                onError={(e) => {
                  // Fallback if image path fails
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-display font-black text-2xl tracking-[0.25em] text-white uppercase group-hover:text-gold-400 transition-colors">
                ROAR
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-500 font-semibold -mt-1">
                Joyería & Accesorios
              </span>
            </a>
          </div>

          {/* Right Utilities (Cart & Account) */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a
              href="https://wa.me/5491123456789?text=Hola%20ROAR!%20Tengo%20una%20consulta%20sobre%20las%20joyas"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-1.5 text-xs uppercase tracking-widest text-silver-400 hover:text-emerald-400 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>Atención</span>
            </a>

            <button
              onClick={openCart}
              className="relative flex items-center space-x-2 bg-dark-850 hover:bg-dark-800 border border-dark-700 hover:border-gold-500/50 px-3.5 py-2 rounded-full text-white transition-all group"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase">Carrito</span>
              <span className="bg-gold-500 text-dark-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center -ml-0.5">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Category Bar */}
        <nav className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2 py-3 border-t border-dark-850/80 text-xs uppercase font-bold tracking-wider">
          <button
            onClick={() => handleCategoryClick('todos')}
            className={`px-3.5 py-1.5 rounded-md transition-all ${
              selectedCategory === 'todos'
                ? 'bg-gold-500 text-dark-950 shadow-md shadow-gold-500/20'
                : 'text-silver-300 hover:text-white hover:bg-dark-850'
            }`}
          >
            Ver Todo
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id as ProductCategory)}
              className={`px-3.5 py-1.5 rounded-md transition-all flex items-center space-x-1 ${
                selectedCategory === cat.id
                  ? 'bg-gold-500 text-dark-950 shadow-md shadow-gold-500/20'
                  : 'text-silver-300 hover:text-white hover:bg-dark-850'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-dark-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-gold-500 px-2">
            Categorías
          </div>
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => handleCategoryClick('todos')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                selectedCategory === 'todos' ? 'bg-gold-500 text-dark-950 font-bold' : 'text-silver-200 hover:bg-dark-800'
              }`}
            >
              ✨ Todos los Productos
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id as ProductCategory)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  selectedCategory === cat.id ? 'bg-gold-500 text-dark-950 font-bold' : 'text-silver-200 hover:bg-dark-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-dark-800 space-y-2">
            <button
              onClick={() => {
                onOpenSizeGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-silver-300 hover:text-gold-400 bg-dark-850 rounded-lg"
            >
              <span className="flex items-center space-x-2">
                <Ruler className="w-4 h-4 text-gold-500" />
                <span>Guía de Talles</span>
              </span>
              <span className="text-xs text-gold-500">Ver tablas</span>
            </button>
            <a
              href="https://wa.me/5491123456789?text=Hola%20ROAR!%20Quiero%20hacer%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-emerald-400 bg-dark-850 rounded-lg"
            >
              <span className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-500" />
                <span>Asistencia por WhatsApp</span>
              </span>
              <span className="text-xs text-emerald-400 font-bold">Online</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
