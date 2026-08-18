import React from 'react';
import { Truck, CreditCard, Percent, ShieldCheck, RefreshCw } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const benefits = [
    {
      icon: <Truck className="w-6 h-6 text-gold-400" />,
      title: 'ENVÍO GRATIS DESDE $90.000',
      subtitle: 'Envíos a todo el país vía Correo Argentino y Andreani.',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-emerald-400" />,
      title: '3 Y 6 CUOTAS SIN INTERÉS',
      subtitle: 'Con todas las tarjetas de crédito bancarias Visa y Mastercard.',
    },
    {
      icon: <Percent className="w-6 h-6 text-red-400" />,
      title: '15% OFF EN TRANSFERENCIA',
      subtitle: 'Descuento automático e inmediato en el checkout o por WhatsApp.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: 'ACERO 316L INALTERABLE',
      subtitle: 'Resistente al agua, perfumes y sudor. No mancha ni pierde brillo.',
    },
  ];

  return (
    <section id="beneficios" className="bg-dark-900 border-b border-dark-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-4 p-4 rounded-xl bg-dark-950/60 border border-dark-800/80 hover:border-gold-500/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-dark-850 border border-dark-700/60 flex items-center justify-center shrink-0">
                {b.icon}
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {b.title}
                </h4>
                <p className="text-[11px] text-silver-400 mt-0.5 leading-snug">
                  {b.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
