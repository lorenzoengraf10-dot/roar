import React, { useState } from 'react';
import { X, Ruler, HelpCircle, Check, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'anillos' | 'cadenas' | 'pulseras'>('anillos');

  if (!isOpen) return null;

  const ringSizes = [
    { talle: '16', diametro: '17.8 mm', circunferencia: '56 mm' },
    { talle: '17', diametro: '18.1 mm', circunferencia: '57 mm' },
    { talle: '18', diametro: '18.5 mm', circunferencia: '58 mm' },
    { talle: '19', diametro: '18.8 mm', circunferencia: '59 mm' },
    { talle: '20', diametro: '19.1 mm', circunferencia: '60 mm' },
    { talle: '21', diametro: '19.4 mm', circunferencia: '61 mm' },
    { talle: '22', diametro: '19.7 mm', circunferencia: '62 mm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-dark-900 border border-dark-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 border-b border-dark-800 flex items-center justify-between bg-dark-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Guía Oficial de Talles & Medidas
              </h3>
              <p className="text-[11px] text-silver-400">
                Encuentra la medida exacta para tu joya ROAR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-silver-400 hover:text-white p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-dark-800 bg-dark-950 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('anillos')}
            className={`py-3 text-center transition-colors border-b-2 ${
              activeTab === 'anillos'
                ? 'border-gold-500 text-gold-400 bg-dark-900'
                : 'border-transparent text-silver-400 hover:text-white'
            }`}
          >
            💍 Anillos
          </button>
          <button
            onClick={() => setActiveTab('cadenas')}
            className={`py-3 text-center transition-colors border-b-2 ${
              activeTab === 'cadenas'
                ? 'border-gold-500 text-gold-400 bg-dark-900'
                : 'border-transparent text-silver-400 hover:text-white'
            }`}
          >
            ⛓️ Cadenas & Dijes
          </button>
          <button
            onClick={() => setActiveTab('pulseras')}
            className={`py-3 text-center transition-colors border-b-2 ${
              activeTab === 'pulseras'
                ? 'border-gold-500 text-gold-400 bg-dark-900'
                : 'border-transparent text-silver-400 hover:text-white'
            }`}
          >
            ✨ Pulseras
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-silver-300">
          
          {/* Tab 1: Anillos */}
          {activeTab === 'anillos' && (
            <div className="space-y-6">
              
              {/* How to measure */}
              <div className="bg-dark-850 p-4 rounded-xl border border-dark-700 space-y-3">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider flex items-center space-x-2">
                  <Info className="w-4 h-4 text-gold-400" />
                  <span>¿Cómo saber tu talle de anillo?</span>
                </h4>
                <ol className="text-xs space-y-2 list-decimal list-inside text-silver-300">
                  <li>Toma una regla milimetrada y un anillo que te quede cómodo en el dedo deseado.</li>
                  <li>Mide el <strong>diámetro interno</strong> del anillo (de borde interior a borde interior, sin contar los bordes exteriores).</li>
                  <li>Compara los milímetros con la siguiente tabla para conocer tu talle exacto.</li>
                </ol>
              </div>

              {/* Size Table */}
              <div>
                <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">
                  Tabla de Conversión de Talles (Argentina / Internacional)
                </h4>
                <div className="overflow-x-auto rounded-xl border border-dark-700">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-dark-950 text-gold-400 font-bold uppercase tracking-wider border-b border-dark-700">
                      <tr>
                        <th className="py-3 px-4">Talle ROAR</th>
                        <th className="py-3 px-4">Diámetro Interno</th>
                        <th className="py-3 px-4">Circunferencia Dedo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800 bg-dark-900">
                      {ringSizes.map((row) => (
                        <tr key={row.talle} className="hover:bg-dark-850 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-white">Talle {row.talle}</td>
                          <td className="py-2.5 px-4 text-gold-300 font-semibold">{row.diametro}</td>
                          <td className="py-2.5 px-4 text-silver-400">{row.circunferencia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Cadenas */}
          {activeTab === 'cadenas' && (
            <div className="space-y-4">
              <div className="bg-dark-850 p-4 rounded-xl border border-dark-700 space-y-3">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                  Guía Visual de Largos de Cadena
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-dark-900 rounded-lg border border-dark-700 flex items-start space-x-3">
                    <div className="font-black text-gold-400 text-sm shrink-0">45 cm</div>
                    <div>
                      <strong className="text-white block">Ajustada / Clavícula:</strong>
                      <span>Queda cerca de la base del cuello. Ideal para usar sola o como primera capa en layering.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-dark-900 rounded-lg border border-dark-700 flex items-start space-x-3">
                    <div className="font-black text-gold-400 text-sm shrink-0">50 cm</div>
                    <div>
                      <strong className="text-white block">Estándar al Pecho (Recomendado):</strong>
                      <span>La medida más versátil. Cae justo sobre el esternón. Perfecta para cruces y dijes.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-dark-900 rounded-lg border border-dark-700 flex items-start space-x-3">
                    <div className="font-black text-gold-400 text-sm shrink-0">55 cm</div>
                    <div>
                      <strong className="text-white block">Media / Debajo del Pecho:</strong>
                      <span>Caída amplia y relajada. Ideal para usar por encima de buzos o remeras oversize.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-dark-900 rounded-lg border border-dark-700 flex items-start space-x-3">
                    <div className="font-black text-gold-400 text-sm shrink-0">60 cm</div>
                    <div>
                      <strong className="text-white block">Larga Urbana:</strong>
                      <span>Look urbano marcado. Permite sacar y poner la cadena sin abrir el broche.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Pulseras */}
          {activeTab === 'pulseras' && (
            <div className="space-y-4">
              <div className="bg-dark-850 p-4 rounded-xl border border-dark-700 space-y-3">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                  ¿Cómo medir tu muñeca para Pulseras?
                </h4>
                <p className="text-xs text-silver-300">
                  Rodea tu muñeca con un hilo o cinta métrica justo por detrás del hueso de la muñeca. Mide el largo y <strong>súmale 1.5 cm a 2 cm</strong> para un calce cómodo.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-dark-900 p-3 rounded-lg border border-dark-700 text-center">
                    <div className="font-black text-white text-sm">17 - 18 cm</div>
                    <div className="text-[11px] text-silver-400">Muñeca Delgada</div>
                  </div>
                  <div className="bg-dark-900 p-3 rounded-lg border border-dark-700 text-center border-gold-500/40">
                    <div className="font-black text-gold-400 text-sm">19 - 20 cm</div>
                    <div className="text-[11px] text-silver-300 font-bold">Estándar (90% de clientes)</div>
                  </div>
                  <div className="bg-dark-900 p-3 rounded-lg border border-dark-700 text-center">
                    <div className="font-black text-white text-sm">21 - 22 cm</div>
                    <div className="text-[11px] text-silver-400">Muñeca Ancha</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-dark-800 bg-dark-850 flex items-center justify-between">
          <a
            href="https://wa.me/5491123456789?text=Hola%20ROAR!%20Tengo%20dudas%20con%20mi%20talle%20de%20joya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>¿Aún tienes dudas? Escríbenos por WhatsApp</span>
          </a>
          <button
            onClick={onClose}
            className="bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
