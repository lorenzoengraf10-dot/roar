import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../../types';
import { CATEGORIES } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ProductCategory | 'todos';
  onSelectCategory: (cat: ProductCategory | 'todos') => void;
  onQuickView: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onQuickView,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = selectedCategory === 'todos' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    switch (sortBy) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return list;
    }
  }, [products, selectedCategory, sortBy]);

  return (
    <section id="catalogo-section" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Category Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-dark-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-gold-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colección Oficial</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {selectedCategory === 'todos' ? 'Catálogo Completo' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </h2>
          <p className="text-silver-400 text-xs sm:text-sm mt-1">
            Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'piezas exclusivas'}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="flex items-center space-x-2 text-xs text-silver-400 bg-dark-900 border border-dark-800 rounded-lg px-3 py-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="bg-dark-900 text-white">Destacados</option>
              <option value="price-asc" className="bg-dark-900 text-white">Menor Precio</option>
              <option value="price-desc" className="bg-dark-900 text-white">Mayor Precio</option>
              <option value="rating" className="bg-dark-900 text-white">Mejor Calificados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
        <button
          onClick={() => onSelectCategory('todos')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            selectedCategory === 'todos'
              ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20'
              : 'bg-dark-900 text-silver-300 hover:text-white border border-dark-800 hover:border-dark-700'
          }`}
        >
          ✨ Todos
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id as ProductCategory)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20'
                : 'bg-dark-900 text-silver-300 hover:text-white border border-dark-800 hover:border-dark-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-12 text-center text-silver-400">
          <p className="text-base font-bold text-white mb-2">No se encontraron productos en esta categoría.</p>
          <button
            onClick={() => onSelectCategory('todos')}
            className="text-xs uppercase font-bold text-gold-400 hover:underline"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

    </section>
  );
};
