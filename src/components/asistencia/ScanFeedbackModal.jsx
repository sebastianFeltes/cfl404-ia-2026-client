import React, { useEffect } from 'react'

const PANEL_STYLES = {
  P: 'bg-emerald-600 text-white',
  T: 'bg-amber-500 text-slate-950',
  M: 'bg-orange-600 text-white',
  A: 'bg-red-600 text-white',
  J: 'bg-blue-600 text-white',
  F: 'bg-slate-600 text-white',
}

export default function ScanFeedbackModal({ feedback, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(feedback.id), 4000)
    return () => clearTimeout(timer)
  }, [feedback.id, onDismiss])

  const result = feedback.results?.[0]
  const code = result?.code || ''
  const panelClass = feedback.type === 'error'
    ? 'bg-red-700 text-white'
    : (PANEL_STYLES[code] || 'bg-custom-azul-oscuro text-white')
  const student = feedback.student || {}
  const fullName = [student.first_name, student.last_name].filter(Boolean).join(' ')
  const dni = student.dni ? String(student.dni) : ''
  const outcome = feedback.type === 'error'
    ? (feedback.message || 'No se pudo registrar la asistencia')
    : (result?.secretaria ? 'Avisar en secretaría' : (result?.message || feedback.message || ''))

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center px-8 text-center ${panelClass}`}
      role="status"
      aria-live="polite"
    >
      {fullName && (
        <p className="font-nunito font-extrabold text-[clamp(2rem,6vh,4.5rem)] leading-tight">{fullName}</p>
      )}
      {dni && (
        <p className="mt-2 font-nunito font-bold text-[clamp(1.4rem,4vh,3rem)] leading-tight">DNI {dni}</p>
      )}
      {feedback.type !== 'error' && code && (
        <p className="mt-4 font-nunito font-black text-[clamp(5rem,18vh,12rem)] leading-none">{code}</p>
      )}
      {outcome && (
        <p className={`font-nunito font-extrabold leading-tight ${
          feedback.type === 'error'
            ? 'text-[clamp(2rem,6vh,4.5rem)]'
            : 'mt-4 text-[clamp(1.4rem,3vh,2.4rem)]'
        }`}
        >
          {outcome}
        </p>
      )}
    </div>
  )
}
