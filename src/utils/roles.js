/**
 * Convierte el rol que viene de la base (JWT / AuthContext)
 * al identificador que usan las pantallas de admin.
 *
 * DIRECTIVO / ADMIN → director (puede crear y editar)
 * SECRETARIA        → secretaria
 * DOCENTE           → instructor
 * ESTUDIANTE        → estudiante
 */
export function mapDbRoleToUi(role) {
  const r = String(role || '').trim().toUpperCase()

  if (['DIRECTIVO', 'DIRECTOR', 'ADMIN', 'ADMINISTRADOR'].includes(r)) return 'director'
  if (['SECRETARIA', 'SECRETARÍA'].includes(r)) return 'secretaria'
  if (['DOCENTE', 'PROFESOR', 'INSTRUCTOR', 'TEACHER'].includes(r)) return 'instructor'
  return 'estudiante'
}

export function roleLabel(role) {
  const labels = {
    director: 'Directivo',
    secretaria: 'Secretaría',
    instructor: 'Docente',
    estudiante: 'Estudiante',
    ADMIN: 'Administrador',
    DIRECTIVO: 'Directivo',
    DOCENTE: 'Docente',
    ESTUDIANTE: 'Estudiante',
  }

  return labels[role] || labels[mapDbRoleToUi(role)] || role || 'Usuario'
}
