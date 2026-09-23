import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Tooltip — renderizado en document.body con position:fixed para no quedar
 * recortado por overflow ni debajo del aside.
 *
 * Correcciones:
 * - El tooltip se OCULTA al scroll/resize (evita "float" visual).
 * - Los listeners se registran una sola vez (no dentro de un efecto que depende de `rect`).
 * - Se usa un ref para `isHovered` para evitar stale-closures.
 * - Se cierra si el trigger queda fuera del viewport.
 *
 * Soporta posición: top | bottom | left | right.
 */

const GAP = 8

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

function styleFromRect(rect, position) {
  switch (position) {
    case 'bottom':
      return {
        top: rect.bottom + GAP,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)',
      }
    case 'left':
      return {
        top: rect.top + rect.height / 2,
        left: rect.left - GAP,
        transform: 'translate(-100%, -50%)',
      }
    case 'right':
      return {
        top: rect.top + rect.height / 2,
        left: rect.right + GAP,
        transform: 'translateY(-50%)',
      }
    default: // top
      return {
        top: rect.top - GAP,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)',
      }
  }
}

function Tooltip({ text, position = 'top', children, className = '' }) {
  const triggerRef = useRef(null)
  const isHoveredRef = useRef(false)
  const [rect, setRect] = useState(null)

  const computeRect = useCallback(() => {
    const el = triggerRef.current
    if (!el) return null
    return el.getBoundingClientRect()
  }, [])

  const show = useCallback(() => {
    isHoveredRef.current = true
    const r = computeRect()
    if (r) setRect(r)
  }, [computeRect])

  const hide = useCallback(() => {
    isHoveredRef.current = false
    setRect(null)
  }, [])

  // Ocultar el tooltip en scroll o resize — evita que quede "flotando"
  useEffect(() => {
    const handleDismiss = () => {
      if (isHoveredRef.current) {
        // Si el trigger aún está en pantalla podríamos re-posicionarlo,
        // pero lo más seguro y limpio es ocultarlo al scrollear.
        isHoveredRef.current = false
        setRect(null)
      }
    }

    window.addEventListener('scroll', handleDismiss, true)
    window.addEventListener('resize', handleDismiss)
    return () => {
      window.removeEventListener('scroll', handleDismiss, true)
      window.removeEventListener('resize', handleDismiss)
    }
  }, []) // ← vacío: se registra solo una vez, sin fugas

  if (!text) return children

  const visible = Boolean(rect)

  return (
    <>
      <div
        ref={triggerRef}
        className={`flex items-center ${className}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocusCapture={show}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) hide()
        }}
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              zIndex: 10000,
              pointerEvents: 'none',
              ...styleFromRect(rect, position),
            }}
            className={`whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl border border-slate-700/60 ${originClass[position] ?? originClass.top}`}
          >
            {text}
            <span className={`absolute border-4 ${arrowClass[position] ?? arrowClass.top}`} aria-hidden="true" />
          </div>,
          document.body,
        )}
    </>
  )
}

export default Tooltip
