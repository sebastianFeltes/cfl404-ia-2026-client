export const COURSE_STATUS_OPTIONS = [
  { id: 1, label: 'Activo' },
  { id: 2, label: 'Inactivo' },
  { id: 3, label: 'Pendiente' },
  { id: 4, label: 'Finalizado' },
  { id: 8, label: 'Inscripción Abierta' },
  { id: 9, label: 'Últimos Cupos' },
  { id: 10, label: 'Cupo Completo' },
  { id: 11, label: 'Curso Finalizado' },
]

const RUNNING_STATUS_IDS = new Set([1, 8, 9, 10])

export function isCourseRunning(statusId) {
  return RUNNING_STATUS_IDS.has(Number(statusId))
}
