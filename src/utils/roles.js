/**
 * Roles canónicos de la base (MAYÚSCULAS), sin colapsar GOD/DIRECTOR/SECRETARIA.
 *
 * mapDbRoleToUi() sigue agrupando para Alumnos y el layout (director/secretaria/…).
 * canCrud/canRead usan el rol canónico para Instructores.
 */
export function canonicalRole(role) {
  const r = String(role || '').trim().toUpperCase()

  if (['DIOS', 'SUPERADMIN', 'ROOT'].includes(r)) return 'GOD'
  if (r === 'ADMINISTRADOR') return 'ADMIN'
  if (r === 'DIRECTIVO') return 'DIRECTOR'
  if (r === 'SECRETARÍA') return 'SECRETARIA'
  if (r === 'PRECEPTOR') return 'PRECEPTORIA'
  if (['PROFESOR', 'TEACHER', 'DOCENTE'].includes(r)) return 'INSTRUCTOR'
  if (['STUDENT', 'ESTUDIANTE'].includes(r)) return 'ALUMNO'
  if (r === 'ASPIRANTE') return 'POSTULANTE'
  if (r === 'DIRECTOR') return 'DIRECTOR'

  return r || 'ALUMNO'
}

/**
 * Agrupa el rol de la base al identificador corto de las pantallas de alumnos.
 * GOD / ADMIN / DIRECTOR / REGENTE → director
 * SECRETARIA / PRECEPTORIA → secretaria
 * INSTRUCTOR → instructor
 * resto → estudiante
 */
export function mapDbRoleToUi(role) {
  const r = canonicalRole(role)

  if (['GOD', 'ADMIN', 'DIRECTOR', 'REGENTE'].includes(r)) return 'director'
  if (['SECRETARIA', 'PRECEPTORIA'].includes(r)) return 'secretaria'
  if (r === 'INSTRUCTOR') return 'instructor'
  return 'estudiante'
}

export function roleLabel(role) {
  const normalized = canonicalRole(role)
  const labels = {
    GOD: 'Dios del Sistema',
    ADMIN: 'Administrador',
    DIRECTOR: 'Director/a',
    REGENTE: 'Regente',
    SECRETARIA: 'Secretaría',
    PRECEPTORIA: 'Preceptoría',
    INSTRUCTOR: 'Instructor/a',
    ALUMNO: 'Alumno/a',
    POSTULANTE: 'Postulante',
    director: 'Directivo',
    secretaria: 'Secretaría',
    instructor: 'Docente',
    estudiante: 'Estudiante',
  }

  return labels[normalized] || labels[role] || labels[mapDbRoleToUi(role)] || role || 'Usuario'
}

/** Roles con permiso CRUD completo en Instructores */
export const CRUD_ROLES = ['GOD', 'ADMIN', 'DIRECTOR', 'REGENTE']

/** Roles con solo lectura en Instructores */
export const READ_ONLY_ROLES = ['SECRETARIA', 'PRECEPTORIA']

/** Roles sin acceso a Instructores */
export const NO_ACCESS_ROLES = ['INSTRUCTOR', 'ALUMNO', 'POSTULANTE']

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
