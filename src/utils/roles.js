/**
 * Convierte el rol que viene de la base (JWT / AuthContext)
 * al identificador que usan las pantallas de admin.
 *
 * Roles con permisos completos de gestión (Agregar/Quitar cursos y profesores):
 * 1. GOD
 * 2. ADMIN
 * 3. DIRECTOR
 * 4. REGENTE
 */
export function mapDbRoleToUi(role) {
  const r = String(role || '').trim().toUpperCase()

  if (['GOD', 'ADMIN', 'ADMINISTRADOR', 'DIRECTOR', 'DIRECTIVO', 'REGENTE'].includes(r)) return 'director'
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
    GOD: 'SuperAdmin (GOD)',
    ADMIN: 'Administrador',
    DIRECTOR: 'Director',
    REGENTE: 'Regente',
    DIRECTIVO: 'Directivo',
    DOCENTE: 'Docente',
    ESTUDIANTE: 'Estudiante',
  }

  return labels[role] || labels[mapDbRoleToUi(role)] || role || 'Usuario'
}
