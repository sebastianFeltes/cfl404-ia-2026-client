import React from 'react'

/**
 * Tooltip — componente accesible con Tailwind CSS puro.
 * Configurado con z-index elevado (z-50), estilos oscuros/claros de alto contraste
 * y flechas orientadas dinámicamente.
 */
function Tooltip({ text, position = 'top', children }) {
  if (!text) return children

  const positionClasses = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top:    'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-900 dark:border-t-slate-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-900 dark:border-b-slate-800',
    left:   'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-900 dark:border-l-slate-800',
    right:  'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-900 dark:border-r-slate-800'
  }

  return (
    <div className="relative group/tooltip inline-flex items-center">
      {children}
      {/* Tooltip bubble */}
      <div
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl border border-slate-700/60 dark:border-slate-600/60
          opacity-0 scale-95 transition-all duration-150 ease-out
          group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100
          ${positionClasses[position]}`}
        role="tooltip"
      >
        {text}
        {/* Arrow indicator */}
        <span
          className={`absolute border-4 ${arrowClasses[position]}`}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export default Tooltip
