import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.material.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-dark-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-dark-900 border border-dark-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-dark-800 bg-dark-850 flex items-center space-x-3">
          <Search className="w-5 h-5 text-gold-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cadenas, cruces, anillos, combos, pulseras..."
            className="w-full bg-transparent text-white placeholder-silver-500 text-sm outline-none font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-silver-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-silver-400 hover:text-white text-xs uppercase font-bold px-2 py-1 rounded bg-dark-800"
          >
            Cerrar
          </button>
        </div>

        {/* Search Content & Results */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Quick Suggestions when empty */}
          {!searchTerm.trim() ? (
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold text-silver-400 tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Búsquedas Populares</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Combo Trébol', 'Cruz Silver', 'Anillo León', 'Pulsera Cuban', 'Medallón Sol', 'Spinner'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="bg-dark-850 hover:bg-dark-800 border border-dark-700 text-silver-300 hover:text-gold-400 text-xs px-3 py-1.5 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-silver-400 text-sm space-y-1">
              <p className="font-bold text-white">No encontramos productos para "{searchTerm}"</p>
              <p className="text-xs text-silver-500">Prueba con palabras como: cruz, sol, trébol, cuban, anillo, etc.</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-800 space-y-2">
              <div className="text-xs font-semibold text-silver-400 mb-2">
                {searchResults.length} resultados encontrados:
              </div>
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="pt-2 first:pt-0 flex items-center justify-between p-2 rounded-xl hover:bg-dark-850 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-dark-950 border border-dark-700 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-silver-500 uppercase font-semibold">
                        {product.category.replace('-', ' ')} • {product.material}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black text-gold-400">
                      {formatCurrency(product.price)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-silver-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
