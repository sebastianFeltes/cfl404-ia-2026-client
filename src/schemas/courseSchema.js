import { z } from 'zod'
import { validateCourseStageDates } from '../utils/courseStage'

/**
 * Esquema de validación Zod para el formulario de Cursos en el cliente
 */
export const courseSchema = z.object({
  name: z.string({
    error: 'El nombre del curso es obligatorio',
  }).min(3, 'El nombre del curso debe tener al menos 3 caracteres'),

  familyId: z.coerce.number({
    error: 'Seleccioná una familia',
  }).min(1, 'Seleccioná una familia de curso'),

  instructorId: z.string({
    error: 'Seleccioná un instructor',
  }).min(1, 'Seleccioná un instructor con rol docente'),

  startDate: z.string({
    error: 'La fecha de inicio es obligatoria',
  }).min(1, 'La fecha de inicio es obligatoria'),

  endDate: z.string({
    error: 'La fecha de fin es obligatoria',
  }).min(1, 'La fecha de fin es obligatoria'),

  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  preEnrollmentDate: z.string().optional().nullable(),
  isAnnual: z.coerce.boolean(),

  quota: z.coerce
    .number({ error: 'El cupo debe ser un número válido' })
    .min(1, 'El cupo de vacantes debe ser al menos 1'),

  hourQuantity: z.coerce
    .number({ error: 'Las horas deben ser un número válido' })
    .min(1, 'La cantidad de horas cátedra debe ser mayor a 0'),

  classesQuantity: z.coerce
    .number({ error: 'Las clases deben ser un número válido' })
    .min(1, 'La cantidad de clases debe ser mayor a 0'),

  maxAbsences: z.coerce.number().min(0).optional(),
  statusId: z.coerce.number().min(1).max(4),
  description: z.string({
    error: 'La descripción del curso es obligatoria',
  }).min(10, 'La descripción detallada debe tener al menos 10 caracteres'),

  titleRequired: z.coerce.boolean().optional(),
  endorsementBy: z.string().optional().nullable(),
  sponsorName: z.string().optional().nullable(),
  dayIds: z.array(z.coerce.number()).optional(),
}).superRefine((data, ctx) => {
  const message = validateCourseStageDates({
    startDate: data.startDate,
    endDate: data.endDate,
    isAnnual: Boolean(data.isAnnual),
  })
  if (message) {
    ctx.addIssue({
      code: 'custom',
      path: ['startDate'],
      message,
    })
  }
})
