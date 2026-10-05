import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Tooltip — se renderiza en document.body con position:fixed.
 *
 * Características:
 * - Singleton: Solo un tooltip visible en pantalla a la vez.
 * - Auto-cierre en scroll: Se cierra inmediatamente al scrollear cualquier contenedor o la ventana.
 * - Auto-cierre en clic / pointerdown: Se cierra al hacer clic en cualquier parte o elemento.
 * - Protección Navbar: No se muestra si el elemento está en la zona superior de la Navbar (< 64px)
 *   o fuera del viewport visible.
 * - zIndex ajustado (z-25) para no invadir barras de navegación ni modales/drawers.
 */

const GAP = 8
const NAVBAR_HEIGHT = 64

const originClass = {
  top: 'origin-bottom',
  bottom: 'origin-top',
  left: 'origin-right',
  right: 'origin-left',
}

const arrowClass = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-900',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-900',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-900',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-900',
}

// Registro global del callback de cierre del tooltip activo (Singleton)
let activeTooltipClose = null

function styleFromRect(rect, position) {
  let effectivePos = position

  // Si position es 'top' pero queda dentro o muy cerca de la Navbar (< 64px), invertir a 'bottom'
  if (position === 'top' && rect.top - GAP - 28 < NAVBAR_HEIGHT) {
    effectivePos = 'bottom'
  }

  switch (effectivePos) {
    case 'bottom':
      return {
        pos: 'bottom',
        style: {
          top: Math.max(NAVBAR_HEIGHT + GAP, rect.bottom + GAP),
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)',
        },
      }
    case 'left':
      return {
        pos: 'left',
        style: {
          top: Math.max(NAVBAR_HEIGHT + GAP, rect.top + rect.height / 2),
          left: rect.left - GAP,
          transform: 'translate(-100%, -50%)',
        },
      }
    case 'right':
      return {
        pos: 'right',
        style: {
          top: Math.max(NAVBAR_HEIGHT + GAP, rect.top + rect.height / 2),
          left: rect.right + GAP,
          transform: 'translateY(-50%)',
        },
      }
    default: // top
      return {
        pos: 'top',
        style: {
          top: rect.top - GAP,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)',
        },
      }
  }
}

function Tooltip({ text, position = 'top', children, className = '' }) {
  const triggerRef = useRef(null)
  const isHoveredRef = useRef(false)
  const [rect, setRect] = useState(null)

  const hide = useCallback(() => {
    if (activeTooltipClose === hide) {
      activeTooltipClose = null
    }
    setRect(null)
  }, [])

  const show = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()

    // No mostrar si el elemento está debajo o dentro del área de la Navbar (< 64px) o fuera de pantalla
    if (
      r.bottom <= NAVBAR_HEIGHT ||
      r.top >= window.innerHeight ||
      r.right <= 0 ||
      r.left >= window.innerWidth
    ) {
      hide()
      return
    }

    // Cerrar cualquier otro tooltip que esté abierto actualmente
    if (activeTooltipClose && activeTooltipClose !== hide) {
      activeTooltipClose()
    }
    activeTooltipClose = hide
    setRect(r)
  }, [hide])

  // Limpiar tooltip activo si el componente se desmonta
  useEffect(() => {
    return () => {
      if (activeTooltipClose === hide) {
        activeTooltipClose = null
      }
    }
  }, [hide])

  // Ocultar inmediatamente al scrollear cualquier contenedor, redimensionar ventana o hacer clic
  useEffect(() => {
    if (!rect) return

    const dismiss = () => {
      hide()
    }

    window.addEventListener('scroll', dismiss, { capture: true, passive: true })
    window.addEventListener('resize', dismiss, { passive: true })
    window.addEventListener('pointerdown', dismiss, { passive: true })

    return () => {
      window.removeEventListener('scroll', dismiss, { capture: true })
      window.removeEventListener('resize', dismiss)
      window.removeEventListener('pointerdown', dismiss)
    }
  }, [rect, hide])

  if (!text) return children

  const visible = Boolean(rect)
  const computed = rect ? styleFromRect(rect, position) : null

  return (
    <>
      <div
        ref={triggerRef}
        className={`flex ${className.includes('items-') ? '' : 'items-center'} ${className}`}
        onPointerEnter={show}
        onPointerLeave={hide}
        onFocusCapture={show}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) hide()
        }}
        onClick={hide}
      >
        {children}
      </div>
      {visible && computed &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              zIndex: 25,
              pointerEvents: 'none',
              ...computed.style,
            }}
            className={`whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl border border-slate-700/60 transition-opacity duration-150 ${originClass[computed.pos] ?? originClass.top}`}
          >
            {text}
            <span className={`absolute border-4 ${arrowClass[computed.pos] ?? arrowClass.top}`} aria-hidden="true" />
          </div>,
          document.body,
        )}
    </>
  )
}

export default Tooltip
