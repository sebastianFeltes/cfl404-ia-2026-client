const TAGS = /<[^>]*>/g

export function todayYmd(now = new Date()) {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function plain(value) {
  return String(value ?? '').replace(TAGS, '').replace(/\s+/g, ' ').trim()
}

function digitsOf(value) {
  return plain(value).replace(/\D/g, '')
}

export function profileFormError(fields, { isPostulante = false } = {}) {
  const nombresLocked = Boolean(fields.nombresLocked)
  const apellidosLocked = Boolean(fields.apellidosLocked)
  const dniLocked = Boolean(fields.dniLocked)

  if (!nombresLocked && plain(fields.nombres).length < 2) {
    return 'El nombre tiene que tener al menos 2 caracteres'
  }
  if (!apellidosLocked && plain(fields.apellidos).length < 2) {
    return 'El apellido tiene que tener al menos 2 caracteres'
  }

  const dni = digitsOf(fields.dni)
  if (!dniLocked && (isPostulante || dni)) {
    if (!/^\d{7,8}$/.test(dni)) return 'El DNI debe tener 7 u 8 dígitos'
  }

  const phone = digitsOf(fields.telefono)
  if (isPostulante && !phone) return 'El teléfono es obligatorio'
  if (phone && (phone.length < 8 || phone.length > 15 || /^(\d)\1+$/.test(phone))) {
    return 'El teléfono debe tener entre 8 y 15 dígitos'
  }

  const extra = digitsOf(fields.telefonoSecundario)
  if (extra && (extra.length < 8 || extra.length > 15 || /^(\d)\1+$/.test(extra))) {
    return 'El teléfono alternativo debe tener entre 8 y 15 dígitos'
  }
  if (phone && extra && phone === extra) {
    return 'El teléfono alternativo tiene que ser distinto'
  }

  if (isPostulante && plain(fields.direccion).length < 2) return 'La dirección es obligatoria'
  if (plain(fields.direccion).length > 160) return 'La dirección supera los 160 caracteres'

  const dob = plain(fields.fechaNacimiento).slice(0, 10)
  if (isPostulante && !dob) return 'La fecha de nacimiento es obligatoria'
  if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return 'La fecha de nacimiento no es válida'
  if (dob && dob > todayYmd()) return 'La fecha de nacimiento no puede ser futura'

  return null
}
