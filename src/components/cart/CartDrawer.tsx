import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldAlert, 
  Send, 
  CreditCard, 
  CheckCircle2 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { 
  formatCurrency, 
  MINIMUM_PURCHASE_AMOUNT, 
  calculateTransferDiscount,
  WHATSAPP_PHONE_NUMBER 
} from '../../utils/currency';
import { FreeShippingBar } from './FreeShippingBar';
import { ShippingCalculator } from './ShippingCalculator';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingCost,
    total,
    transferTotal,
    isMinimumMet,
    itemCount,
    selectedShipping,
    zipCode,
    shippingZone,
  } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  // Build WhatsApp pre-filled message
  const generateWhatsAppMessage = () => {
    let msg = `🦁 *HOLA ROAR! QUIERO REALIZAR UN PEDIDO*\n\n`;
    msg += `📦 *DETALLE DE PRODUCTOS:*\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.name}\n   - Medida/Talle: *${item.selectedVariant.name}*\n   - Cantidad: *${item.quantity}*\n   - Precio: *${formatCurrency(item.product.price * item.quantity)}*\n\n`;
    });
    msg += `--------------------------------\n`;
    msg += `🛒 *Subtotal:* ${formatCurrency(subtotal)}\n`;
    if (selectedShipping) {
      msg += `🚚 *Envío (${selectedShipping.name} - CP ${zipCode}):* ${selectedShipping.price === 0 ? 'GRATIS' : formatCurrency(selectedShipping.price)}\n`;
    }
    msg += `💰 *TOTAL CON TRANSFERENCIA (15% OFF):* ${formatCurrency(transferTotal)}\n`;
    msg += `💳 *Total con Tarjeta / Cuotas:* ${formatCurrency(total)}\n\n`;
    msg += `📍 *Zona de Envío:* ${shippingZone}\n`;
    msg += `Quedo a la espera de los datos de pago. ¡Muchas gracias!`;

    return encodeURIComponent(msg);
  };

  const handleWhatsAppCheckout = () => {
    const link = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${generateWhatsAppMessage()}`;
    window.open(link, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-dark-950 border-l border-dark-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-dark-800 bg-dark-900 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Carrito de Compras
              </h3>
              <span className="text-[11px] text-silver-400">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'} seleccionados
              </span>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="text-silver-400 hover:text-white p-2 rounded-lg hover:bg-dark-800 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* Free Shipping Progress Bar */}
          <FreeShippingBar />

          {/* Cart Item List */}
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-dark-900 border border-dark-800 text-silver-600 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">Tu carrito está vacío</h4>
                <p className="text-xs text-silver-500 max-w-xs mx-auto">
                  Agrega cadenas, anillos, pulseras o combos para disfrutar de nuestras promociones.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="bg-gold-500 hover:bg-gold-400 text-dark-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md"
              >
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="divide-y divide-dark-800 space-y-3">
              {items.map((item) => {
                const itemTotal = item.product.price * item.quantity;
                const itemTransferTotal = calculateTransferDiscount(itemTotal);

                return (
                  <div 
                    key={`${item.product.id}-${item.selectedVariant.id}`}
                    className="pt-3 first:pt-0 flex space-x-3 items-center justify-between"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-dark-900 border border-dark-800 shrink-0"
                      loading="lazy"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-white truncate leading-tight">
                        {item.product.name}
                      </h4>
                      <div className="inline-block text-[10px] text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded font-semibold mt-1">
                        {item.selectedVariant.name}
                      </div>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-xs font-black text-white">
                          {formatCurrency(itemTotal)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          ({formatCurrency(itemTransferTotal)} transf.)
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center border border-dark-700 bg-dark-900 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant.id, item.quantity - 1)}
                            className="p-1 text-silver-400 hover:text-white hover:bg-dark-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant.id, item.quantity + 1)}
                            className="p-1 text-silver-400 hover:text-white hover:bg-dark-800 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant.id)}
                          className="text-silver-500 hover:text-red-400 p-1 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Shipping Calculator Section */}
          {items.length > 0 && <ShippingCalculator />}

        </div>

        {/* Drawer Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-dark-800 bg-dark-900 space-y-3.5 shadow-xl">
            
            {/* Minimum Purchase Warning */}
            {!isMinimumMet && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <strong className="block font-bold">Compra mínima: {formatCurrency(MINIMUM_PURCHASE_AMOUNT)}</strong>
                  <span>Agrega {formatCurrency(MINIMUM_PURCHASE_AMOUNT - subtotal)} más para poder finalizar tu pedido.</span>
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-silver-400">
                <span>Subtotal productos:</span>
                <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-silver-400">
                <span>Costo de envío:</span>
                <span className="font-bold text-white">
                  {shippingCost === 0 ? (
                    <strong className="text-emerald-400">GRATIS</strong>
                  ) : (
                    formatCurrency(shippingCost)
                  )}
                </span>
              </div>
              
              {/* Transfer Discount Highlight */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center justify-between text-emerald-400 font-bold">
                <span>Total con 15% OFF Transferencia:</span>
                <span className="text-sm font-black">{formatCurrency(transferTotal)}</span>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-sm font-black text-white uppercase">Total Tarjetas / Cuotas:</span>
                  <div className="text-[10px] text-silver-400">Hasta 6 cuotas sin interés</div>
                </div>
                <span className="text-lg font-black text-gold-400">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Dual Checkout Action Buttons */}
            <div className="space-y-2 pt-1">
              
              {/* Online Checkout Button */}
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                disabled={!isMinimumMet}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  isMinimumMet
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-dark-950 shadow-lg shadow-gold-500/20'
                    : 'bg-dark-800 text-silver-600 cursor-not-allowed border border-dark-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Iniciar Compra Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* WhatsApp Checkout Button */}
              <button
                onClick={handleWhatsAppCheckout}
                disabled={!isMinimumMet}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  isMinimumMet
                    ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-md'
                    : 'bg-dark-850 text-silver-600 cursor-not-allowed border border-dark-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Pedir y Coordinar por WhatsApp (15% OFF)</span>
              </button>

            </div>

          </div>
        )}

      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
};
