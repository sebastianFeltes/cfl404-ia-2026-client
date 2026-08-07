import { useState } from 'react'

/**
 * Tooltip component - muestra una etiqueta de texto al hacer hover.
 *
 * Props:
 *  - text     : string  – Texto a mostrar en el tooltip.
 *  - children : node   – Elemento que activa el tooltip al hover.
 *  - className: string – Clases extras para el wrapper (opcional).
 */
function Tooltip({ text, children, className = '' }) {
    const [visible, setVisible] = useState(false)

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {children}

            {/* Tooltip bubble */}
            <div
                role="tooltip"
                className={`
                    absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[9999]
                    whitespace-nowrap
                    bg-white text-custom-gris-oscuro
                    text-xs font-nunito font-semibold
                    px-3 py-1.5 rounded-lg
                    border border-gray-200
                    shadow-lg shadow-black/10
                    pointer-events-none
                    transition-all duration-200
                    ${visible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-1 invisible'
                    }
                `}
            >
                {text}
                {/* Arrow */}
                <span
                    className="
                        absolute -top-[5px] left-1/2 -translate-x-1/2
                        w-2.5 h-2.5 bg-white border-l border-t border-gray-200
                        rotate-45
                    "
                />
            </div>
        </div>
    )
}

export default Tooltip
