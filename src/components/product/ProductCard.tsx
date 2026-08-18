import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { 
  formatCurrency, 
  calculateTransferDiscount, 
  calculateInstallment 
} from '../../utils/currency';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || { id: 'default', name: 'Único', inStock: true }
  );
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const transferPrice = calculateTransferDiscount(product.price);
  const installmentPrice = calculateInstallment(product.price, 3);
  const sixInstallmentPrice = calculateInstallment(product.price, 6);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedVariant.inStock) return;
    addToCart(product, selectedVariant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div 
      className="group bg-dark-900 rounded-2xl border border-dark-800 hover:border-gold-500/50 p-3 sm:p-4 flex flex-col justify-between card-dark-hover relative overflow-hidden transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-5 left-5 z-20 flex flex-col space-y-1.5 pointer-events-none">
        {product.tag && (
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md ${
            product.tag === 'COMBO' ? 'bg-gold-500 text-dark-950 font-black' :
            product.tag === 'HOT' ? 'bg-red-600 text-white' :
            product.tag === 'NUEVO' ? 'bg-emerald-600 text-white' :
            'bg-dark-800 text-gold-400 border border-gold-500/30'
          }`}>
            {product.tag}
          </span>
        )}
        {product.originalPrice && (
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Image Container with Quick View Trigger */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-dark-950 cursor-pointer mb-3.5 border border-dark-850"
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-dark-900/90 hover:bg-gold-500 hover:text-dark-950 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-dark-700 hover:border-gold-400 transition-all flex items-center space-x-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Rápida</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Material / Category tag */}
          <div className="flex items-center justify-between text-[11px] text-silver-500 mb-1">
            <span className="truncate max-w-[170px] uppercase font-medium">{product.material}</span>
            <div className="flex items-center text-gold-400">
              <Star className="w-3 h-3 fill-gold-400 text-gold-400 mr-0.5" />
              <span className="font-bold text-[10px]">{product.rating || '5.0'}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-white hover:text-gold-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Variant / Size Selector */}
        {product.variants.length > 1 && (
          <div className="pt-1">
            <div className="text-[10px] uppercase tracking-wider text-silver-400 mb-1 font-semibold">
              Talle / Medida:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  disabled={!v.inStock}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    selectedVariant.id === v.id
                      ? 'bg-gold-500/20 border-gold-500 text-gold-300 font-bold'
                      : v.inStock
                      ? 'bg-dark-850 border-dark-700 text-silver-300 hover:border-dark-600'
                      : 'bg-dark-950 border-dark-850 text-silver-600 line-through cursor-not-allowed'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Block */}
        <div className="pt-2 border-t border-dark-800 space-y-1">
          
          {/* Main Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-black text-white">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-silver-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Transfer Discount Price (In red/emerald highlight like Kratos) */}
          <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
            <span className="font-black text-sm">{formatCurrency(transferPrice)}</span>
            <span className="text-[10px] text-silver-400">con 15% OFF Transferencia</span>
          </div>

          {/* Installments Note */}
          <div className="text-[11px] text-silver-400 leading-none pt-0.5">
            Hasta <strong className="text-white">6 cuotas</strong> sin interés de <strong className="text-gold-400">{formatCurrency(sixInstallmentPrice)}</strong>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant.inStock}
          className={`w-full mt-3 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
            !selectedVariant.inStock
              ? 'bg-dark-800 text-silver-600 cursor-not-allowed border border-dark-700'
              : justAdded
              ? 'bg-emerald-600 text-white font-black shadow-md'
              : 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-dark-950 font-black shadow-md hover:shadow-gold-500/20'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>¡Agregado!</span>
            </>
          ) : !selectedVariant.inStock ? (
            <span>Sin Stock</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Agregar al Carrito</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
