import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, BookOpen, ClipboardCheck, Wallet } from 'lucide-react'

const CODE_STYLES = {
  P: 'bg-emerald-500 text-white',
  T: 'bg-amber-500 text-white',
  M: 'bg-orange-500 text-white',
  A: 'bg-red-500 text-white',
  J: 'bg-blue-500 text-white',
  F: 'bg-slate-500 text-white',
}

export default function ScanFeedbackModal({ feedback, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(feedback.id), 4000)
    return () => clearTimeout(timer)
  }, [feedback.id, onDismiss])

  const isError = feedback.type === 'error'

  return (
    <div
      className={`pointer-events-none w-[min(92vw,420px)] rounded-2xl border shadow-2xl overflow-hidden animate-fade-in ${
        isError
          ? 'bg-red-950/95 border-red-400/40 text-red-50'
          : 'bg-custom-azul-oscuro/95 border-custom-celeste/40 text-white'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={`px-5 py-4 flex items-center gap-3 ${isError ? 'bg-red-900/50' : 'bg-black/15'}`}>
        {isError ? (
          <AlertCircle className="h-7 w-7 text-red-300 shrink-0" />
        ) : (
          <CheckCircle2 className="h-7 w-7 text-emerald-300 shrink-0" />
        )}
        <div>
          <p className="font-nunito font-extrabold text-lg leading-tight">
            {isError ? 'No se registró' : 'Asistencia registrada'}
          </p>
          {!isError && feedback.student && (
            <p className="text-sm text-white/80 mt-0.5">
              {feedback.student.last_name}, {feedback.student.first_name}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 py-4 space-y-3 text-sm">
        {isError ? (
          <p>{feedback.message}</p>
        ) : (
          <>
            {feedback.results?.map((item) => (
              <div key={`${item.course_id}-${item.attendance_id}`} className="space-y-2 border-t border-white/10 first:border-t-0 first:pt-0 pt-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-custom-celeste shrink-0" />
                  <span className="font-semibold">{item.course_name}</span>
                  <span className={`ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg font-extrabold text-sm ${CODE_STYLES[item.code] || 'bg-white/20'}`}>
                    {item.code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-white/85">
                  <div className="flex items-center gap-1.5">
                    <ClipboardCheck size={14} className="text-custom-amarillo" />
                    <span>Faltas restantes: <strong>{item.remaining_absences ?? '—'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wallet size={14} className={item.cooperadora_paid ? 'text-emerald-300' : 'text-red-300'} />
                    <span>
                      Cooperadora:{' '}
                      <strong>{item.cooperadora_paid ? 'Al día' : 'Pendiente'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
