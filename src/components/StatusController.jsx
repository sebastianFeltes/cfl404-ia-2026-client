import React, { useState } from 'react'
import { Settings2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

function StatusController({ currentState, onChangeState }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="fixed bottom-6 right-6 z-50 font-roboto">
      {isOpen ? (
        <div className="bg-custom-gris-oscuro/95 text-white border border-custom-gris-claro/30 rounded-xl shadow-2xl p-4 w-64 backdrop-blur-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-custom-gris-claro/20">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4.5 w-4.5 text-custom-amarillo animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Simulador de Estados
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs text-custom-gris-claro hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10"
            >
              Ocultar
            </button>
          </div>

          <div className="space-y-2">
            {/* Loading button */}
            <button
              onClick={() => onChangeState('loading')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentState === 'loading'
                  ? 'bg-custom-celeste text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <RefreshCw className={`h-3.5 w-3.5 ${currentState === 'loading' ? 'animate-spin' : ''}`} />
                Cargando (Loading)
              </span>
              {currentState === 'loading' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </button>

            {/* Empty button */}
            <button
              onClick={() => onChangeState('empty')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentState === 'empty'
                  ? 'bg-custom-amarillo text-custom-gris-oscuro shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                Vacío (Empty State)
              </span>
              {currentState === 'empty' && <span className="w-1.5 h-1.5 rounded-full bg-custom-gris-oscuro" />}
            </button>

            {/* Success/Data button */}
            <button
              onClick={() => onChangeState('success')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentState === 'success'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5" />
                Con Datos (Success)
              </span>
              {currentState === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          </div>

          <p className="text-[9px] text-custom-gris-claro mt-3 text-center italic">
            * Haz clic para alternar los estados de la tabla en tiempo real.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-custom-gris-oscuro text-white p-3 rounded-full shadow-lg border border-custom-gris-claro/30 hover:bg-custom-azul-oscuro transition-all duration-200 hover:-translate-y-1"
          title="Abrir Simulador de Estados"
          aria-label="Abrir Simulador de Estados"
        >
          <Settings2 className="h-5 w-5 text-custom-amarillo animate-spin-slow" />
        </button>
      )}
    </div>
  )
}

export default StatusController
