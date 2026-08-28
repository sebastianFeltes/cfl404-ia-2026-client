import React, { useState } from 'react'
import { Settings2, RefreshCw, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react'

function StatusController({ currentState = 'success', onChangeState }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="fixed bottom-6 right-6 z-50 font-roboto no-print">
      {isOpen ? (
        <div className="bg-[#1D1E1C]/95 text-white border border-slate-700/60 rounded-xl shadow-2xl p-4 w-64 backdrop-blur-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-[#FDEA14]" />
              <span className="text-xs font-bold uppercase tracking-wider font-nunito">
                Simulador de Estados
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title="Minimizar panel"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {/* Success/Data button */}
            <button
              type="button"
              onClick={() => onChangeState('success')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                currentState === 'success'
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Con Datos (Success)
              </span>
              {currentState === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>

            {/* Loading button */}
            <button
              type="button"
              onClick={() => onChangeState('loading')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                currentState === 'loading'
                  ? 'bg-[#166193] text-white shadow-md font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <RefreshCw className={`h-3.5 w-3.5 text-[#37A6DE] ${currentState === 'loading' ? 'animate-spin' : ''}`} />
                Cargando (Loading Skeleton)
              </span>
              {currentState === 'loading' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </button>

            {/* Empty button */}
            <button
              type="button"
              onClick={() => onChangeState('empty')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                currentState === 'empty'
                  ? 'bg-[#FDEA14] text-[#1D1E1C] shadow-md font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-[#FDEA14] group-hover:text-white" />
                Vacío (Empty State)
              </span>
              {currentState === 'empty' && <span className="w-1.5 h-1.5 rounded-full bg-[#1D1E1C]" />}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 mt-3 text-center italic font-nunito">
            * Alterna estados para comprobar skeletons y pantallas vacías.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1D1E1C] text-white p-3 rounded-full shadow-2xl border border-slate-700/80 hover:bg-[#166193] transition-all duration-200 hover:-translate-y-1 cursor-pointer flex items-center justify-center"
          title="Abrir Simulador de Estados de la Tabla"
          aria-label="Abrir Simulador de Estados"
        >
          <Settings2 className="h-5 w-5 text-[#FDEA14]" />
        </button>
      )}
    </div>
  )
}

export default StatusController
