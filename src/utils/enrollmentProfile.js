import { canonicalRole } from './roles'

function filled(value) {
  return String(value ?? '').trim().length > 0
}

const ENROLLMENT_FIELDS = [
  { label: 'Nombre', read: (user) => user.nombres },
  { label: 'Apellido', read: (user) => user.apellidos },
  { label: 'DNI', read: (user) => user.dni },
  { label: 'Teléfono', read: (user) => user.telefono || user.detail?.phone },
  { label: 'Dirección', read: (user) => user.direccion || user.detail?.address },
  { label: 'Fecha de nacimiento', read: (user) => user.fechaNacimiento || user.detail?.dob || user.dob },
]

/** Etiquetas de los datos básicos que todavía faltan para inscribirse. */
export function missingEnrollmentFields(user) {
  if (!user) return ENROLLMENT_FIELDS.map((field) => field.label)
  return ENROLLMENT_FIELDS
    .filter((field) => !filled(field.read(user)))
    .map((field) => field.label)
}

/** Datos mínimos del legajo para poder inscribirse a un curso. */
export function hasBasicEnrollmentData(user) {
  return Boolean(user) && missingEnrollmentFields(user).length === 0
}

/** Postulante autenticado que todavía no puede inscribirse. */
export function needsEnrollmentProfileNotice(user) {
  if (!user) return false
  return canonicalRole(user.rol || user.tipo) === 'postulante' && !hasBasicEnrollmentData(user)
}

/** Cada cuánto se vuelve a mostrar el aviso si el legajo sigue incompleto. */
export const PROFILE_NOTICE_INTERVAL_MS = 5 * 60 * 1000

export const ENROLLMENT_PROFILE_NOTICE = 'Completá tus datos básicos (nombre, apellido, DNI, teléfono, dirección y fecha de nacimiento) para poder inscribirte.'
