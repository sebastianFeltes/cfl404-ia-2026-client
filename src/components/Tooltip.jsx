import React from 'react'

/**
 * Tooltip — componente reutilizable de tooltip accesible con Tailwind CSS puro.
 * Usa posicionamiento absoluto sobre el elemento padre (necesita `relative` en el padre).
 *
 * Props:
 *   text     — string: texto que se mostrará en el tooltip
 *   position — 'top' | 'bottom' | 'left' | 'right' (default: 'top')
 *   children — elemento sobre el que se dispara el tooltip
 */
function Tooltip({ text, position = 'top', className = '', children }) {
  const positionClasses = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top:    'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-custom-gris-oscuro',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-custom-gris-oscuro',
    left:   'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-custom-gris-oscuro',
    right:  'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-custom-gris-oscuro'
  }

  return (
    <div className={`relative group/tooltip inline-flex justify-center ${className}`}>
      {children}
      {/* Tooltip bubble */}
      <div
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-custom-gris-oscuro/95 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lg
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
