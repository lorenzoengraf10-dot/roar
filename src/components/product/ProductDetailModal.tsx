import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Send, 
  Star, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Plus, 
  Minus, 
  Check 
} from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { 
  formatCurrency, 
  calculateTransferDiscount, 
  calculateInstallment,
  WHATSAPP_PHONE_NUMBER 
} from '../../utils/currency';
import { calculateShippingByZipCode } from '../../utils/shipping';
import { useCart } from '../../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenSizeGuide,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [zipInput, setZipInput] = useState('1425');
  const [shippingResult, setShippingResult] = useState<any>(null);
  const [added, setAdded] = useState(false);

  // Sync initial variant
  React.useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setSelectedImageIndex(0);
      setQuantity(1);
      setShippingResult(calculateShippingByZipCode('1425', product.price));
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentVariant = selectedVariant || product.variants[0];
  const transferPrice = calculateTransferDiscount(product.price);
  const sixInstallments = calculateInstallment(product.price, 6);
  const threeInstallments = calculateInstallment(product.price, 3);

  const handleAddToCart = () => {
    if (!currentVariant.inStock) return;
    addToCart(product, currentVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleDirectWhatsApp = () => {
    const msg = `🦁 *HOLA ROAR! QUIERO COMPRAR ESTA JOYA*\n\n` +
      `💍 *Producto:* ${product.name}\n` +
      `📏 *Medida/Talle:* ${currentVariant.name}\n` +
      `🔢 *Cantidad:* ${quantity}\n` +
      `💰 *Precio con 15% OFF Transferencia:* ${formatCurrency(transferPrice * quantity)}\n\n` +
      `¿Me confirmarías disponibilidad para despacho? ¡Muchas gracias!`;

    const link = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
  };

  const handleCalcShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.trim().length >= 4) {
      setShippingResult(calculateShippingByZipCode(zipInput.trim(), product.price * quantity));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-dark-900 border border-dark-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 border-b border-dark-800 bg-dark-850 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2.5 py-1 rounded">
              {product.category.toUpperCase().replace('-', ' ')}
            </span>
            <span className="text-xs text-silver-400">• ROAR Oficial</span>
          </div>
          <button
            onClick={onClose}
            className="text-silver-400 hover:text-white p-1.5 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left: Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-dark-950 border border-dark-800 relative">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 bg-gold-500 text-dark-950 text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-gold-400' : 'border-dark-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} - vista ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Material & Warranty Badge */}
            <div className="p-3 bg-dark-950 rounded-xl border border-dark-800 flex items-center space-x-3 text-xs text-silver-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white block font-bold">Material: {product.material}</strong>
                <span>Hipoalergénico, inalterable al agua dulce y salada.</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="space-y-4 text-xs text-silver-300">
            
            {/* Title & Rating */}
            <div>
              <div className="flex items-center space-x-2 text-gold-400 mb-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-silver-400">
                  {product.rating || '5.0'} ({product.reviewCount || 34} opiniones)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Price Box */}
            <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-1.5">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-black text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-silver-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-500/20 text-red-400 text-[10px] font-extrabold px-2 py-0.5 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* 15% OFF Transfer */}
              <div className="text-sm font-bold text-emerald-400">
                {formatCurrency(transferPrice)} <span className="text-xs font-normal text-silver-400">pagando con 15% OFF en Transferencia</span>
              </div>

              {/* Installment breakdown */}
              <div className="pt-2 border-t border-dark-850 text-silver-400 text-xs">
                💳 Hasta <strong className="text-white">6 cuotas sin interés</strong> de <strong className="text-gold-400">{formatCurrency(sixInstallments)}</strong> (o 3 de {formatCurrency(threeInstallments)})
              </div>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-silver-300">
              {product.description}
            </p>

            {/* Variant / Size Selector */}
            <div className="space-y-2 pt-2 border-t border-dark-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Seleccionar Talle / Medida:
                </span>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-xs text-gold-400 hover:underline flex items-center space-x-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Ver Guía de Talles</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.inStock}
                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                      currentVariant.id === variant.id
                        ? 'bg-gold-500 text-dark-950 shadow-md font-black'
                        : variant.inStock
                        ? 'bg-dark-950 border border-dark-700 text-silver-300 hover:border-gold-500/40'
                        : 'bg-dark-950 border border-dark-850 text-silver-600 line-through cursor-not-allowed'
                    }`}
                  >
                    {variant.name} {!variant.inStock && '(Agotado)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Cantidad:</span>
              <div className="flex items-center border border-dark-700 bg-dark-950 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-silver-400 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 text-xs font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-silver-400 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!currentVariant.inStock}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  !currentVariant.inStock
                    ? 'bg-dark-800 text-silver-600 cursor-not-allowed border border-dark-700'
                    : added
                    ? 'bg-emerald-600 text-white font-black'
                    : 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-dark-950 shadow-lg shadow-gold-500/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Agregado al carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Agregar al Carrito • {formatCurrency(product.price * quantity)}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectWhatsApp}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600/90 hover:bg-emerald-500 text-white transition-all flex items-center justify-center space-x-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Comprar Directo por WhatsApp (15% OFF)</span>
              </button>
            </div>

            {/* In-Modal Shipping Calculator Preview */}
            <div className="pt-4 border-t border-dark-800 space-y-2">
              <div className="text-xs font-bold text-white uppercase flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-gold-400" />
                <span>Calcular costo de envío a tu localidad:</span>
              </div>
              
              <form onSubmit={handleCalcShipping} className="flex gap-2">
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  placeholder="Tu Código Postal (Ej: 1425)"
                  className="bg-dark-950 border border-dark-700 text-white px-3 py-1.5 rounded-lg text-xs outline-none flex-1"
                />
                <button
                  type="submit"
                  className="bg-dark-800 hover:bg-dark-700 text-silver-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase"
                >
                  Calcular
                </button>
              </form>

              {shippingResult && (
                <div className="bg-dark-950 p-2.5 rounded-lg border border-dark-800 space-y-1 text-[11px]">
                  <div className="text-gold-400 font-semibold">{shippingResult.zone}:</div>
                  {shippingResult.options.map((opt: any) => (
                    <div key={opt.id} className="flex justify-between text-silver-400">
                      <span>{opt.name}:</span>
                      <strong className="text-white">
                        {opt.price === 0 ? <span className="text-emerald-400">GRATIS</span> : formatCurrency(opt.price)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
