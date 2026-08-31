import { GET, POST, DELETE } from './api'

/**
 * Obtener listado de pagos de cooperadora y mapa estructurado de cuotas
 * @param {number} [year] - Ciclo lectivo (año)
 * @param {string} [studentId] - Opcional: filtrar por alumno específico
 */
export async function getCooperadoraPagos(year, studentId) {
  const params = new URLSearchParams()
  if (year) params.append('year', year)
  if (studentId) params.append('studentId', studentId)

  const query = params.toString() ? `?${params.toString()}` : ''
  return await GET(`/api/v1/cooperadora/pagos${query}`)
}

/**
 * Guardar o actualizar (Upsert) una cuota de cooperadora para un alumno
 * @param {Object} payload - { studentId, month, year, amount, date, notes }
 */
export async function saveCooperadoraPago(payload) {
  return await POST('/api/v1/cooperadora/pagos', payload)
}

/**
 * Eliminar un pago de cooperadora por ID
 * @param {string} id - ID del pago
 */
export async function deleteCooperadoraPago(id) {
  return await DELETE('/api/v1/cooperadora/pagos', id)
}

/**
 * Obtener todos los movimientos de Buffet (ingresos y egresos)
 * @param {Object} [filters] - { tipo, year }
 */
export async function getBuffetMovements(filters = {}) {
  const params = new URLSearchParams()
  if (filters.tipo) params.append('tipo', filters.tipo)
  if (filters.year) params.append('year', filters.year)

  const query = params.toString() ? `?${params.toString()}` : ''
  return await GET(`/api/v1/cooperadora/buffet${query}`)
}

/**
 * Registrar un nuevo movimiento de Buffet (ingreso o egreso)
 * @param {Object} payload - { fecha, monto, tipo, detalle, observaciones }
 */
export async function createBuffetMovement(payload) {
  return await POST('/api/v1/cooperadora/buffet', payload)
}

/**
 * Eliminar un movimiento de Buffet por ID
 * @param {string} id - ID del movimiento
 */
export async function deleteBuffetMovement(id) {
  return await DELETE('/api/v1/cooperadora/buffet', id)
}
