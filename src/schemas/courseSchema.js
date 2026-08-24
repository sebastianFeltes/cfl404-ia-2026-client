import { z } from 'zod'

/**
 * Esquema de validación Zod para el formulario de Cursos en el cliente
 */
export const courseSchema = z.object({
  name: z.string({
    error: 'El nombre del curso es obligatorio'
  }).min(3, 'El nombre del curso debe tener al menos 3 caracteres'),

  category: z.enum(['Oficios', 'Tecnología', 'Emprendimiento', 'Servicios', 'Administración'], {
    error: 'Seleccione una categoría válida'
  }),

  stageKey: z.enum(['segunda', 'primera']),

  schedule: z.string({
    error: 'El horario de cursada es obligatorio'
  }).min(3, 'Ingrese los días y horarios de cursada (ej. Martes 18:00 hs)'),

  quota: z.coerce
    .number({ error: 'El cupo debe ser un número válido' })
    .min(1, 'El cupo de vacantes debe ser al menos 1'),

  hour_quantity: z.coerce
    .number({ error: 'Las horas deben ser un número válido' })
    .min(1, 'La cantidad de horas cátedra debe ser mayor a 0'),

  classes_quantity: z.coerce
    .number({ error: 'Las clases deben ser un número válido' })
    .min(1, 'La cantidad de clases debe ser mayor a 0'),

  statusId: z.coerce.number().min(1).max(4),

  description: z.string({
    error: 'La descripción del curso es obligatoria'
  }).min(10, 'La descripción detallada debe tener al menos 10 caracteres')
})
