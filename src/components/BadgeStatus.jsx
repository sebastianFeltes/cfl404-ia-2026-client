import React from 'react'

function BadgeStatus({ status }) {
  // Normalize the status string to lowercase for safe matching
  const statusStr = String(status || '').trim().toLowerCase()

  let styles = 'bg-gray-100 text-gray-800'
  let label = 'Desconocido'

  if (statusStr === 'activo' || statusStr === '1') {
    // Activo: Light celeste/blue background with deep dark blue text
    styles = 'bg-custom-celeste/15 text-custom-azul-oscuro font-bold'
    label = 'Activo'
  } else if (statusStr === 'inactivo' || statusStr === '2') {
    // Inactivo: Neutral grey color
    styles = 'bg-custom-gris-claro/10 text-custom-gris-claro font-semibold'
    label = 'Inactivo'
  } else if (statusStr === 'licencia') {
    // Licencia: Yellow accent styling
    styles = 'bg-custom-amarillo/20 text-yellow-800 font-bold border border-custom-amarillo/40'
    label = 'En Licencia'
  } else if (statusStr === 'suspendido' || statusStr === '3') {
    // Suspendido: Yellow accent styling
    styles = 'bg-custom-amarillo/20 text-yellow-800 font-bold border border-custom-amarillo/40'
    label = 'Suspendido'
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
