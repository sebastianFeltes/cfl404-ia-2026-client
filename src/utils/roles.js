/**
 * Roles canónicos de la base (minúscula), sin colapsar god/director/secretaria.
 *
 * mapDbRoleToUi() sigue agrupando para Alumnos y el layout (director/secretaria/…).
 * canCrud/canRead usan el rol canónico para Instructores.
 */
export function canonicalRole(role) {
  const r = String(role || '').trim().toLowerCase()

  if (['dios', 'superadmin', 'root'].includes(r)) return 'god'
  if (r === 'administrador') return 'admin'
  if (r === 'directivo') return 'director'
  if (r === 'secretaría' || r === 'secretaria') return 'secretaria'
  if (r === 'preceptor') return 'preceptoria'
  if (['profesor', 'profesores', 'teacher', 'teachers', 'docente', 'docentes', 'instructor', 'instructores'].includes(r)) return 'instructor'
  if (['student', 'students', 'estudiante', 'estudiantes', 'alumno', 'alumnos'].includes(r)) return 'alumno'
  if (['aspirante', 'aspirantes', 'postulante', 'postulantes'].includes(r)) return 'postulante'
  if (r === 'contralor') return 'contralor'
  if (r === 'director') return 'director'
  if (r === 'regente') return 'regente'
  if (r === 'admin') return 'admin'
  if (r === 'god') return 'god'
  if (r === 'preceptoria') return 'preceptoria'

  return r || 'alumno'
}

/**
 * Agrupa el rol de la base al identificador corto de las pantallas de alumnos.
 * god / admin / director / regente → director
 * secretaria / preceptoria → secretaria
 * instructor → instructor
 * resto → estudiante
 */
export function mapDbRoleToUi(role) {
  const r = canonicalRole(role)

  if (['god', 'admin', 'director', 'regente'].includes(r)) return 'director'
  if (['secretaria', 'preceptoria'].includes(r)) return 'secretaria'
  if (r === 'instructor') return 'instructor'
  return 'estudiante'
}

export function roleLabel(role) {
  const normalized = canonicalRole(role)
  const labels = {
    god: 'Dios del Sistema',
    admin: 'Administrador',
    director: 'Director/a',
    regente: 'Regente',
    secretaria: 'Secretaría',
    preceptoria: 'Preceptoría',
    instructor: 'Instructor/a',
    alumno: 'Alumno/a',
    postulante: 'Postulante',
    contralor: 'Contralor',
    estudiante: 'Estudiante',
  }

  return labels[normalized] || labels[role] || labels[mapDbRoleToUi(role)] || role || 'Usuario'
}

/** Roles con permiso CRUD completo en Instructores */
export const CRUD_ROLES = ['god', 'admin', 'director', 'regente']

/** Roles con solo lectura en Instructores */
export const READ_ONLY_ROLES = ['secretaria', 'preceptoria']

/** Roles sin acceso a Instructores */
export const NO_ACCESS_ROLES = ['instructor', 'alumno', 'postulante']

/** Todos los roles con algún nivel de acceso a Instructores */
export const ACCESS_ROLES = [...CRUD_ROLES, ...READ_ONLY_ROLES]

/** Verifica si el rol tiene CRUD completo (acepta rol de DB o el agrupado del layout) */
export const canCrud = (role) => {
  const canonical = canonicalRole(role)
  if (CRUD_ROLES.includes(canonical)) return true
  return mapDbRoleToUi(role) === 'director'
}

/** Verifica si el rol puede al menos leer Instructores */
export const canRead = (role) => {
  const canonical = canonicalRole(role)
  if (ACCESS_ROLES.includes(canonical)) return true
  return ['director', 'secretaria'].includes(mapDbRoleToUi(role))
}

/** Roles con acceso a la planilla de asistencia (staff) */
export const ATTENDANCE_READ_ROLES = [...ACCESS_ROLES]

/** Verifica acceso de lectura a la planilla de asistencia */
export const canReadAttendance = (role) => {
  const canonical = canonicalRole(role)
  if (ATTENDANCE_READ_ROLES.includes(canonical)) return true
  return ['director', 'secretaria'].includes(mapDbRoleToUi(role))
}

/** Emails con acceso explícito al lector QR */
export const QR_SCANNER_EMAILS = ['programma.ad.futura@gmail.com']

/** Verifica acceso al lector QR */
export const canScanQr = (role, email) => {
  const canonical = canonicalRole(role)
  if (canonical === 'contralor' || canonical === 'god') return true
  const normalizedEmail = String(email ?? '').trim().toLowerCase()
  return QR_SCANNER_EMAILS.includes(normalizedEmail)
}
