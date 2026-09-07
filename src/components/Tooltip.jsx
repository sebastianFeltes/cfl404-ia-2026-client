import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Tooltip — se renderiza en document.body con position:fixed para no quedar
 * recortado por overflow ni debajo del aside (que crea su propio stacking context).
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
    default:
      return {
        top: rect.top - GAP,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)',
      }
  }
}

function Tooltip({ text, position = 'top', children, className = '' }) {
  const triggerRef = useRef(null)
  const [rect, setRect] = useState(null)

  const show = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    setRect(el.getBoundingClientRect())
  }, [])

  const hide = useCallback(() => setRect(null), [])

  useEffect(() => {
    if (!rect) return
    const sync = () => {
      const el = triggerRef.current
      if (!el) return
      setRect(el.getBoundingClientRect())
    }
    window.addEventListener('scroll', sync, true)
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('scroll', sync, true)
      window.removeEventListener('resize', sync)
    }
  }, [rect])

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
