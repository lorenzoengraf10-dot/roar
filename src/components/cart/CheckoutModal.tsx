import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Send, 
  Truck 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, calculateTransferDiscount, WHATSAPP_PHONE_NUMBER } from '../../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    subtotal, 
    shippingCost, 
    total, 
    transferTotal, 
    selectedShipping, 
    zipCode, 
    shippingZone, 
    clearCart 
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card' | 'mp'>('transfer');
  const [copied, setCopied] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
  };

  const handleSendToWhatsApp = () => {
    let msg = `🦁 *NUEVA ORDEN DE COMPRA - ROAR JOYAS*\n\n`;
    msg += `👤 *Cliente:* ${formData.name}\n`;
    msg += `📱 *Teléfono:* ${formData.phone}\n`;
    msg += `✉️ *Email:* ${formData.email}\n`;
    msg += `📍 *Dirección de Entrega:* ${formData.address}, ${formData.city} (CP: ${zipCode})\n\n`;
    msg += `💳 *Método de Pago Elegido:* ${
      paymentMethod === 'transfer' ? 'Transferencia Bancaria (15% OFF)' : 'Tarjeta de Crédito / Mercado Pago'
    }\n\n`;
    msg += `📦 *PRODUCTOS SOLICITADOS:*\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.name} [${item.selectedVariant.name}] x${item.quantity} - ${formatCurrency(item.product.price * item.quantity)}\n`;
    });
    msg += `\n🚚 *Envío:* ${selectedShipping ? selectedShipping.name : 'Estándar'} (${shippingCost === 0 ? 'GRATIS' : formatCurrency(shippingCost)})\n`;
    msg += `💰 *MONTO FINAL A ABONAR:* ${formatCurrency(paymentMethod === 'transfer' ? transferTotal : total)}\n\n`;
    if (formData.notes) {
      msg += `📝 *Aclaraciones:* ${formData.notes}\n\n`;
    }
    msg += `¡Aguardo la confirmación de acreditación para el despacho!`;

    const link = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-dark-900 border border-dark-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-dark-800 bg-dark-850 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              Finalizar Pedido • ROAR
            </h3>
            <p className="text-xs text-silver-400">
              Completa tus datos de envío y selecciona tu medio de pago
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-silver-400 hover:text-white p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-silver-300">
          
          {orderComplete ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white uppercase">¡Orden Registrada con Éxito!</h4>
                <p className="text-xs text-silver-400 max-w-md mx-auto">
                  Para coordinar el envío de inmediato y enviar tu comprobante de pago, haz clic en el botón de abajo para comunicarte con nuestro equipo.
                </p>
              </div>

              {/* Order summary box */}
              <div className="bg-dark-850 border border-dark-700 p-4 rounded-xl max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between font-bold text-white text-xs">
                  <span>Destinatario:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between text-silver-400 text-xs">
                  <span>Entrega en:</span>
                  <span>{formData.address}, {formData.city}</span>
                </div>
                <div className="flex justify-between text-gold-400 font-black text-sm pt-2 border-t border-dark-700">
                  <span>Total a pagar:</span>
                  <span>{formatCurrency(paymentMethod === 'transfer' ? transferTotal : total)}</span>
                </div>
              </div>

              <button
                onClick={handleSendToWhatsApp}
                className="bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Orden por WhatsApp</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleFinishOrder} className="space-y-6">
              
              {/* Step 1: Customer & Shipping Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-gold-400" />
                  <span>1. Datos de Envío & Contacto</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-silver-400 mb-1 font-semibold">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Lucas Martínez"
                      className="w-full bg-dark-950 border border-dark-700 focus:border-gold-500 text-white p-2.5 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-silver-400 mb-1 font-semibold">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ej: 11 2345 6789"
                      className="w-full bg-dark-950 border border-dark-700 focus:border-gold-500 text-white p-2.5 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-silver-400 mb-1 font-semibold">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nombre@email.com"
                      className="w-full bg-dark-950 border border-dark-700 focus:border-gold-500 text-white p-2.5 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-silver-400 mb-1 font-semibold">Ciudad / Localidad *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ej: Palermo / Rosario"
                      className="w-full bg-dark-950 border border-dark-700 focus:border-gold-500 text-white p-2.5 rounded-lg outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-silver-400 mb-1 font-semibold">Dirección de Entrega (Calle, Número, Piso/Depto) *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Ej: Av. Santa Fe 3450, Piso 4 B"
                      className="w-full bg-dark-950 border border-dark-700 focus:border-gold-500 text-white p-2.5 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="space-y-3 pt-4 border-t border-dark-800">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gold-400" />
                  <span>2. Selecciona Medio de Pago</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  {/* Option 1: Transferencia 15% OFF */}
                  <div
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'transfer'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-dark-950 border-dark-800 text-silver-400 hover:border-dark-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-bold text-emerald-400 mb-1">
                      <Building2 className="w-4 h-4" />
                      <span>Transferencia</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                      15% OFF DIRECTO
                    </span>
                    <div className="text-sm font-black text-white mt-2">
                      {formatCurrency(transferTotal)}
                    </div>
                  </div>

                  {/* Option 2: Tarjetas / Cuotas */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-gold-500/10 border-gold-500 text-white'
                        : 'bg-dark-950 border-dark-800 text-silver-400 hover:border-dark-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-bold text-gold-400 mb-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Tarjetas</span>
                    </div>
                    <span className="text-[10px] text-silver-400">
                      3 y 6 Cuotas Sin Interés
                    </span>
                    <div className="text-sm font-black text-white mt-2">
                      {formatCurrency(total)}
                    </div>
                  </div>

                  {/* Option 3: Mercado Pago */}
                  <div
                    onClick={() => setPaymentMethod('mp')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'mp'
                        ? 'bg-blue-500/10 border-blue-500 text-white'
                        : 'bg-dark-950 border-dark-800 text-silver-400 hover:border-dark-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-bold text-blue-400 mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Mercado Pago</span>
                    </div>
                    <span className="text-[10px] text-silver-400">
                      Débito / Dinero en cuenta
                    </span>
                    <div className="text-sm font-black text-white mt-2">
                      {formatCurrency(total)}
                    </div>
                  </div>

                </div>

                {/* Bank Transfer Details Box */}
                {paymentMethod === 'transfer' && (
                  <div className="bg-dark-950 p-4 rounded-xl border border-emerald-500/30 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        Datos de la cuenta bancaria ROAR:
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('ROAR.JOYAS.MP')}
                        className="text-[11px] text-gold-400 hover:underline flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copied ? '¡Copiado!' : 'Copiar Alias'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-silver-300">
                      <div><strong>Alias:</strong> ROAR.JOYAS.MP</div>
                      <div><strong>CBU:</strong> 0000003100012345678901</div>
                      <div><strong>Banco:</strong> Mercado Pago / Banco Galicia</div>
                      <div><strong>Titular:</strong> ROAR JOYERÍA S.A.S.</div>
                    </div>
                    <p className="text-[10px] text-silver-400 italic">
                      * Al confirmar, tu pedido queda reservado por 24hs para recibir el comprobante.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-dark-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gold-500/20"
              >
                Confirmar y Finalizar Pedido ({formatCurrency(paymentMethod === 'transfer' ? transferTotal : total)})
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
