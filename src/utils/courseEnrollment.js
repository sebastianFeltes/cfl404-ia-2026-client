const FINISHED = new Set(['curso_finalizado', 'egresado', 'finalizado'])

export function compareCoursesByStart(a, b) {
  const da = String(a?.start_date || a?.startDate || '')
  const db = String(b?.start_date || b?.startDate || '')
  if (!da && !db) return String(a?.name || '').localeCompare(String(b?.name || ''), 'es')
  if (!da) return 1
  if (!db) return -1
  const byDate = da.localeCompare(db)
  if (byDate !== 0) return byDate
  return String(a?.name || '').localeCompare(String(b?.name || ''), 'es')
}

export function enrollActionFor(course, { isAuthenticated, role, tickets = [], enrollments = [], profileIncomplete = false } = {}) {
  const ticket = tickets.find((item) => item.courseId === course?.id)
  if (ticket?.status === 'listo') {
    return { disabled: false, label: 'Confirmar preinscripción', mode: 'ready' }
  }
  if (ticket?.status === 'esperando') {
    return { disabled: true, label: `En espera · ${ticket.position}`, mode: 'waiting' }
  }
  if (enrollments.some((item) => item.courseId === course?.id)) {
    return { disabled: true, label: 'Ya inscripto', mode: 'enrolled' }
  }

  const statusName = String(course?.enrollmentStatus?.name || course?.status?.name || '').toLowerCase()
  const statusId = Number(course?.enrollmentStatus?.id || course?.statusId || course?.status?.id)
  if (FINISHED.has(statusName) || statusId === 11 || statusId === 4) {
    return { disabled: true, label: 'Curso finalizado', mode: 'finished' }
  }

  const quota = Number(course?.detail?.quota ?? course?.quota ?? course?.detail?.total_quota ?? 0)
  const available = Number(course?.availableQuota)
  const full = !(quota > 0) || (Number.isFinite(available) ? available <= 0 : statusName === 'cupo_completo' || statusId === 10)
  if (full) return { disabled: true, label: 'Sin cupo', mode: 'full' }

  const today = new Date().toISOString().slice(0, 10)
  const opens = course?.preenrollment_date || course?.preEnrollmentDate
  if (opens && today < String(opens).slice(0, 10)) {
    return { disabled: true, label: 'Próximamente', mode: 'soon' }
  }

  if (!isAuthenticated) return { disabled: false, label: 'Iniciar sesión', mode: 'login' }
  if (role !== 'postulante') return { disabled: true, label: 'Solo postulantes', mode: 'role' }
  if (profileIncomplete) return { disabled: false, label: 'Completar datos', mode: 'profile' }
  return { disabled: false, label: 'Inscribirme', mode: 'ready' }
}

export function courseQuotaBadge(course) {
  const statusName = String(course?.enrollmentStatus?.name || course?.status?.name || '').toLowerCase()
  const statusId = Number(course?.enrollmentStatus?.id || course?.statusId || course?.status?.id)
  if (FINISHED.has(statusName) || statusId === 11 || statusId === 4) {
    return { label: 'Curso finalizado', className: 'bg-slate-800 text-white' }
  }
  const quota = Number(course?.detail?.quota ?? course?.quota ?? course?.detail?.total_quota ?? 0)
  const available = Number(course?.availableQuota)
  if (!(quota > 0) || (Number.isFinite(available) && available <= 0)) {
    return { label: 'Cupo completo', className: 'bg-rose-600 text-white' }
  }
  if (Number.isFinite(available) && available <= 3) {
    return { label: 'Últimos cupos', className: 'bg-amber-400 text-slate-950' }
  }
  return { label: 'Inscripción abierta', className: 'bg-emerald-600 text-white' }
}
