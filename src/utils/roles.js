/**
 * Normaliza el rol que viene de la base de datos / JWT.
 * Devuelve siempre en MAYÚSCULAS sin colapsar roles distintos.
 *
 * Roles del sistema:
 *   GOD · ADMIN · DIRECTOR · REGENTE · SECRETARIA · PRECEPTORIA
 *   INSTRUCTOR · ALUMNO · POSTULANTE
 *   DIRECTIVO (backward compat — tokens anteriores)
 */
export function mapDbRoleToUi(role) {
  const r = String(role || '').trim().toUpperCase()

  // Sinónimos / backward compat
  if (r === 'STUDENT' || r === 'ESTUDIANTE') return 'ALUMNO'
  if (r === 'PROFESOR' || r === 'TEACHER' || r === 'DOCENTE') return 'INSTRUCTOR'
  if (r === 'ADMINISTRADOR') return 'ADMIN'
  if (r === 'SECRETARÍA') return 'SECRETARIA'
  if (r === 'DIRECTIVO') return 'DIRECTOR' // tokens viejos → DIRECTOR

  // GOD, ADMIN, DIRECTOR, REGENTE, SECRETARIA, PRECEPTORIA,
  // INSTRUCTOR, ALUMNO, POSTULANTE → pasan tal cual
  return r || 'ALUMNO'
}

export function roleLabel(role) {
  const normalized = mapDbRoleToUi(role)
  const labels = {
    GOD:        'Dios del Sistema',
    ADMIN:      'Administrador',
    DIRECTOR:   'Director/a',
    REGENTE:    'Regente',
    SECRETARIA: 'Secretaría',
    PRECEPTORIA:'Preceptoría',
    INSTRUCTOR: 'Instructor/a',
    ALUMNO:     'Alumno/a',
    POSTULANTE: 'Postulante',
  }
  return labels[normalized] || normalized || 'Usuario'
}

/** Roles con permiso CRUD completo en Instructores */
export const CRUD_ROLES = ['GOD', 'ADMIN', 'DIRECTOR', 'REGENTE']

/** Roles con solo lectura en Instructores */
export const READ_ONLY_ROLES = ['SECRETARIA', 'PRECEPTORIA']

/** Roles sin acceso a Instructores */
export const NO_ACCESS_ROLES = ['INSTRUCTOR', 'ALUMNO', 'POSTULANTE']

/** Todos los roles con algún nivel de acceso */
export const ACCESS_ROLES = [...CRUD_ROLES, ...READ_ONLY_ROLES]

/** Verifica si el rol tiene CRUD completo */
export const canCrud = (role) => CRUD_ROLES.includes(mapDbRoleToUi(role))

/** Verifica si el rol puede al menos leer */
export const canRead = (role) => ACCESS_ROLES.includes(mapDbRoleToUi(role))
