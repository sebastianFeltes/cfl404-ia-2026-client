import { GET, POST, DELETE, PUT } from './api'
import { coursesData as initialCourses } from '../data/coursesData'

/**
 * Servicio de Cursos — Interacción con la API del servidor y fallback al dataset local
 */

export async function fetchCourses() {
  try {
    const data = await GET('/courses')
    if (Array.isArray(data) && data.length > 0) {
      // Mapear campos de la base de datos a la estructura del frontend
      return data.map((item, index) => ({
        id: item.id || index + 1,
        name: item.name,
        stage: item.stage || 'Segunda Etapa (Julio - Diciembre)',
        stageKey: item.stageKey || 'segunda',
        category: item.category || 'Oficios',
        image: item.image || '/images/Herreria.webp',
        status: {
          id: item.statusId || 1,
          label: item.statusId === 1 ? 'Cupos disponibles' : item.statusId === 2 ? 'Últimos cupos' : 'Cupo completo',
          color: item.statusId === 1 
            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400' 
            : item.statusId === 2
            ? 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400'
            : 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-400',
          badgeColor: item.statusId === 1 ? 'bg-emerald-500' : item.statusId === 2 ? 'bg-amber-500' : 'bg-rose-500'
        },
        start_date: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '2026-07-15',
        end_time: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '2026-12-15',
        schedule: item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : 'Lunes y Miércoles 18:00 - 21:00 hs',
        max_absences: item.maxAbsences || 4,
        staff: item.staff ? `${item.staff.firstName} ${item.staff.lastName}` : 'Docente CFL 404',
        detail: {
          description: item.courseDetail?.description || 'Curso de formación profesional.',
          quota: item.courseDetail?.quota ?? 20,
          total_quota: item.courseDetail?.quota ? item.courseDetail.quota + 5 : 25,
          hour_quantity: item.courseDetail?.hourQuantity || 120,
          classes_quantity: item.courseDetail?.classesQuantity || 32,
          title_required: item.courseDetail?.titleRequired ? 'Secundario Completo' : 'Primario Completo',
          endorsement_by: item.courseDetail?.endorsementBy || 'CFP N°404 Berisso'
        }
      }))
    }
    return initialCourses
  } catch (error) {
    console.warn('Servidor offline o sin datos de cursos, utilizando dataset local:', error.message)
    return initialCourses
  }
}

export async function addCourseService(courseData) {
  try {
    const payload = {
      name: courseData.name,
      description: courseData.detail?.description || courseData.description,
      quota: Number(courseData.detail?.quota || courseData.quota || 20),
      hourQuantity: Number(courseData.detail?.hour_quantity || courseData.hour_quantity || 120),
      classesQuantity: Number(courseData.detail?.classes_quantity || courseData.classes_quantity || 32),
      statusId: Number(courseData.statusId || 1),
      maxAbsences: Number(courseData.max_absences || 4),
      startTime: courseData.schedule || '18:00 hs',
      endTime: '21:00 hs'
    }
    const res = await POST('/courses', payload)
    return res
  } catch (error) {
    console.warn('No se pudo guardar en backend, creando en estado local:', error.message)
    return null
  }
}

export async function removeCourseService(courseId) {
  try {
    if (typeof courseId === 'string' && courseId.includes('-')) {
      await DELETE('/courses', courseId)
    }
    return true
  } catch (error) {
    console.warn('Error al eliminar curso del servidor:', error.message)
    return true
  }
}
