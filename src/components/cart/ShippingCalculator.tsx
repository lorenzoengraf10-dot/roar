import React, { useState } from 'react';
import { Truck, Search, Check, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export const ShippingCalculator: React.FC = () => {
  const { 
    zipCode, 
    setZipCode, 
    shippingOptions, 
    selectedShipping, 
    setSelectedShipping,
    shippingZone,
    isFreeShipping,
  } = useCart();

  const [inputZip, setInputZip] = useState(zipCode);
  const [isOpen, setIsOpen] = useState(true);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputZip.trim().length >= 4) {
      setZipCode(inputZip.trim());
    }
  };

  return (
    <div className="bg-dark-900/90 border border-dark-800 rounded-xl overflow-hidden text-xs">
      
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between text-left text-silver-300 hover:text-white transition-colors bg-dark-850"
      >
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-gold-400" />
          <span className="font-bold uppercase tracking-wider text-xs">
            Medios de Envío ({shippingZone})
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-silver-500" /> : <ChevronDown className="w-4 h-4 text-silver-500" />}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-3.5 space-y-3 border-t border-dark-800">
          
          {/* Zipcode input form */}
          <form onSubmit={handleCalculate} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={8}
                value={inputZip}
                onChange={(e) => setInputZip(e.target.value)}
                placeholder="Ingresa tu Código Postal"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-500 text-white px-3 py-2 rounded-lg text-xs outline-none uppercase"
              />
            </div>
            <button
              type="submit"
              className="bg-dark-800 hover:bg-gold-500 hover:text-dark-950 text-silver-200 border border-dark-700 font-bold px-3 py-2 rounded-lg text-xs uppercase tracking-wider transition-all"
            >
              Calcular
            </button>
          </form>

          <a
            href="https://www.correoargentino.com.ar/formularios/cpa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-silver-500 hover:text-gold-400 underline block"
          >
            ¿No sabes tu código postal? Búscalo en Correo Argentino
          </a>

          {/* Shipping Options list */}
          <div className="space-y-2 pt-1">
            {shippingOptions.map((opt) => {
              const isSelected = selectedShipping?.id === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedShipping(opt)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-gold-500/10 border-gold-500/80 text-white'
                      : 'bg-dark-950/60 border-dark-800 text-silver-400 hover:border-dark-700'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                      isSelected ? 'border-gold-400 bg-gold-400 text-dark-950' : 'border-dark-600 bg-dark-900'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs leading-tight">
                        {opt.name}
                      </div>
                      <div className="text-[10px] text-silver-400 mt-0.5">
                        {opt.deliveryTime} • <strong className="text-silver-300">{opt.courier}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {opt.price === 0 || (isFreeShipping && opt.id !== 'caba-express') ? (
                      <span className="font-black text-emerald-400 text-xs uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">
                        GRATIS
                      </span>
                    ) : (
                      <span className="font-bold text-white text-xs">
                        {formatCurrency(opt.price)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
