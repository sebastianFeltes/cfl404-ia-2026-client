import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AlertCircle, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  PROFILE_NOTICE_INTERVAL_MS,
  missingEnrollmentFields,
  needsEnrollmentProfileNotice,
} from '../utils/enrollmentProfile'

const DISMISS_PREFIX = 'cfl404_incomplete_profile_dismissed'

function dismissKey(userId) {
  return `${DISMISS_PREFIX}:${userId}`
}

function readDismissedAt(userId) {
  if (userId == null) return 0
  try {
    const value = Number(sessionStorage.getItem(dismissKey(userId)))
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

function writeDismissedAt(userId) {
  if (userId == null) return
  try {
    sessionStorage.setItem(dismissKey(userId), String(Date.now()))
  } catch {
    // sessionStorage puede estar bloqueado; el aviso sigue funcionando en esta vista.
  }
}

/**
 * Aviso para postulantes con el legajo incompleto.
 * Se muestra al iniciar sesión y vuelve a aparecer cada 5 minutos
 * hasta que los datos básicos estén completos.
 */
export default function IncompleteProfileNotice() {
  const { user, isAuthenticated, isLoading, loginEpoch } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const seenLoginEpoch = useRef(0)
  const timerRef = useRef(null)
  const dialogRef = useRef(null)

  const needsNotice = !isLoading && isAuthenticated && needsEnrollmentProfileNotice(user)
  const missing = missingEnrollmentFields(user)
  const onProfile = location.pathname === '/perfil'

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleNext = useCallback((delay) => {
    clearTimer()
    timerRef.current = window.setTimeout(() => setOpen(true), delay)
  }, [clearTimer])

  useEffect(() => {
    if (!needsNotice || user?.id == null) {
      setOpen(false)
      clearTimer()
      return undefined
    }

    const freshLogin = loginEpoch > seenLoginEpoch.current
    if (freshLogin) {
      seenLoginEpoch.current = loginEpoch
      clearTimer()
      setOpen(true)
      return clearTimer
    }

    const dismissedAt = readDismissedAt(user.id)
    const remaining = dismissedAt
      ? PROFILE_NOTICE_INTERVAL_MS - (Date.now() - dismissedAt)
      : 0

    if (remaining <= 0) {
      clearTimer()
      setOpen(true)
    } else {
      scheduleNext(remaining)
    }

    return clearTimer
  }, [needsNotice, loginEpoch, user?.id, clearTimer, scheduleNext])

  const dismiss = useCallback(() => {
    writeDismissedAt(user?.id)
    setOpen(false)
    if (needsNotice) scheduleNext(PROFILE_NOTICE_INTERVAL_MS)
  }, [user?.id, needsNotice, scheduleNext])

  const goToProfile = useCallback(() => {
    dismiss()
    if (!onProfile) navigate('/perfil')
  }, [dismiss, navigate, onProfile])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, dismiss])

  if (!open || location.pathname === '/login') return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-nunito">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={dismiss}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="incomplete-profile-title"
        tabIndex={-1}
        onClick={goToProfile}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl outline-none animate-fadeIn cursor-pointer"
      >
        <div className="h-1.5 bg-custom-amarillo" />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            dismiss()
          }}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-slate-600 cursor-pointer"
          aria-label="Cerrar aviso"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <div className="mb-4 flex items-start gap-3 pr-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-700">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 id="incomplete-profile-title" className="font-roboto text-lg font-extrabold leading-tight text-custom-gris-oscuro">
                No podés inscribirte todavía
              </h2>
              <p className="mt-1 text-xs font-semibold text-custom-gris-claro">
                Faltan datos básicos de tu perfil
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-custom-gris-oscuro">
            Hasta que completes tu legajo no podés inscribirte a los cursos. Este aviso aparece al ingresar y se repite cada 5 minutos mientras falten datos.
          </p>

          {missing.length > 0 && (
            <ul className="mt-4 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-custom-gris-oscuro">
              {missing.map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-custom-amarillo" />
                  {label}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                dismiss()
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-custom-gris-claro transition-colors hover:bg-slate-50 cursor-pointer"
            >
              Ahora no
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                goToProfile()
              }}
              className="rounded-xl bg-custom-azul-oscuro px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#124e76] cursor-pointer"
            >
              {onProfile ? 'Entendido' : 'Completar mis datos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
