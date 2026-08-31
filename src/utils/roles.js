/**
 * Convierte el rol que viene de la base (JWT / AuthContext)
 * al identificador que usan las pantallas de admin.
 *
 * GOD / ADMIN / DIRECTIVO → director (puede crear, editar y borrar todo)
 * SECRETARIA / PRECEPTORIA → secretaria (puede editar/crear según módulo)
 * DOCENTE / INSTRUCTOR    → instructor
 * ESTUDIANTE / ALUMNO     → estudiante
 */
export function mapDbRoleToUi(role) {
  const r = String(role || '').trim().toUpperCase()

  if (['GOD', 'DIOS', 'SUPERADMIN', 'ROOT', 'DIRECTIVO', 'DIRECTOR', 'ADMIN', 'ADMINISTRADOR', 'REGENTE'].includes(r)) return 'director'
  if (['SECRETARIA', 'SECRETARÍA', 'PRECEPTORIA', 'PRECEPTOR'].includes(r)) return 'secretaria'
  if (['DOCENTE', 'PROFESOR', 'INSTRUCTOR', 'TEACHER'].includes(r)) return 'instructor'
  return 'estudiante'
}

export function roleLabel(role) {
  const labels = {
    director: 'Directivo',
    secretaria: 'Secretaría',
    instructor: 'Docente',
    estudiante: 'Estudiante',
    GOD: 'Modo Dios',
    DIOS: 'Modo Dios',
    SUPERADMIN: 'Super Administrador',
    ROOT: 'Super Administrador',
    ADMIN: 'Administrador',
    ADMINISTRADOR: 'Administrador',
    DIRECTIVO: 'Directivo',
    DIRECTOR: 'Directivo',
    REGENTE: 'Regente',
    SECRETARIA: 'Secretaría',
    SECRETARÍA: 'Secretaría',
    PRECEPTORIA: 'Preceptoría',
    PRECEPTOR: 'Preceptor',
    DOCENTE: 'Docente',
    INSTRUCTOR: 'Docente',
    PROFESOR: 'Docente',
    ALUMNO: 'Estudiante',
    POSTULANTE: 'Postulante',
    ASPIRANTE: 'Aspirante',
    ESTUDIANTE: 'Estudiante',
  }

  const r = String(role || '').trim().toUpperCase()
  return labels[r] || labels[role] || labels[mapDbRoleToUi(role)] || role || 'Usuario'
}

