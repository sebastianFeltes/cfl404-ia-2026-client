import React from 'react'

function BadgeStatus({ status }) {
  // Normalize the status string to lowercase for safe matching
  const statusStr = String(status || '').trim().toLowerCase()

  let styles = 'bg-gray-100 text-gray-800'
  let label = 'Desconocido'

  if (statusStr === 'activo' || statusStr === '1') {
    // Activo: Light celeste/blue background with deep dark blue text
    styles = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60'
    label = 'Activo'
  } else if (statusStr === 'inactivo' || statusStr === '2') {
    // Inactivo: Neutral grey color
    styles = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700'
    label = 'Inactivo'
  } else if (statusStr === 'postulante' || statusStr === 'aspirante' || statusStr === 'pendiente') {
    // Postulante: Celeste #37A6DE institucional
    styles = 'bg-[#37A6DE]/15 text-[#166193] dark:text-[#37A6DE] font-bold border border-[#37A6DE]/40'
    label = 'Postulante'
  } else if (statusStr === 'licencia') {
    // Licencia: Yellow accent styling
    styles = 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300 font-bold border border-yellow-200 dark:border-yellow-800/60'
    label = 'En Licencia'
  } else if (statusStr === 'suspendido' || statusStr === '3') {
    // Suspendido: Amber/yellow styling
    styles = 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800/60'
    label = 'Pendiente'
  }

  return (
    <span 
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs tracking-wide uppercase transition-all duration-200 ${styles}`}
      role="status"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {label}
    </span>
  )
}

export default BadgeStatus
