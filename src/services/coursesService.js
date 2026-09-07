import { GET, POST, DELETE, PUT } from './api'
import { getCourseStageFromDates, formatCourseSchedule, courseMatchesStage } from '../utils/courseStage'

const COURSE_STATUS_UI = {
  1: { label: 'Activo', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400', badgeColor: 'bg-emerald-500' },
  2: { label: 'Inactivo', color: 'bg-slate-500/10 text-slate-700 border-slate-300 dark:text-slate-400', badgeColor: 'bg-slate-500' },
  3: { label: 'Pendiente', color: 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400', badgeColor: 'bg-amber-500' },
  4: { label: 'Finalizado', color: 'bg-gray-500/10 text-gray-700 border-gray-300 dark:text-gray-400', badgeColor: 'bg-gray-500' },
}

function toIsoDate(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

function mapApiCourse(item) {
  const stage = item.stageKey
    ? { key: item.stageKey, label: item.stage }
    : getCourseStageFromDates(item)
  const statusId = item.statusId || item.status?.id || 1
  const statusUi = item.status?.label
    ? item.status
    : { id: statusId, ...(COURSE_STATUS_UI[statusId] || COURSE_STATUS_UI[1]) }
  const familyName = item.family?.name || item.category || null
  const instructor = item.instructor || null
  const instructorName = item.instructorName
    || item.staff
    || (instructor ? `${instructor.firstName} ${instructor.lastName}`.trim() : 'Sin instructor asignado')

  return {
    ...item,
    id: item.id,
    name: item.name,
    familyId: item.familyId || item.family?.id || null,
    family: item.family || (familyName ? { id: item.familyId, name: familyName } : null),
    category: familyName,
    instructor,
    instructorId: item.instructorId || instructor?.id || null,
    instructorName,
    staff: instructorName,
    statusId,
    status: {
      id: statusId,
      name: item.status?.name,
      label: statusUi.label,
      color: statusUi.color,
      badgeColor: statusUi.badgeColor,
    },
    startDate: item.startDate,
    endDate: item.endDate,
    start_date: item.start_date || toIsoDate(item.startDate),
    end_time: item.end_time || toIsoDate(item.endDate),
    startTime: item.startTime || '',
    endTime: item.endTime || '',
    preEnrollmentDate: item.preEnrollmentDate,
    preenrollment_date: item.preenrollment_date || toIsoDate(item.preEnrollmentDate),
    isAnnual: Boolean(item.isAnnual ?? item.is_annual),
    is_annual: Boolean(item.isAnnual ?? item.is_annual),
    stage: stage?.label || item.stage || 'Sin etapa asignada',
    stageKey: stage?.key || item.stageKey || null,
    schedule: item.schedule || formatCourseSchedule(item),
    maxAbsences: item.maxAbsences ?? item.max_absences ?? 4,
    max_absences: item.maxAbsences ?? item.max_absences ?? 4,
    quota: item.quota ?? item.courseDetail?.quota ?? item.detail?.quota ?? 0,
    availableQuota: item.availableQuota ?? Math.max(0, (item.courseDetail?.quota ?? item.detail?.quota ?? 0) - (item.enrolledCount ?? 0)),
    enrolledCount: item.enrolledCount ?? 0,
    dayIds: item.dayIds || (item.courseDays || []).map((d) => d.dayId),
    courseDays: item.courseDays || [],
    sponsor: item.sponsor || null,
    detail: item.detail || {
      description: item.courseDetail?.description || '',
      quota: item.courseDetail?.quota ?? 0,
      total_quota: item.courseDetail?.quota ?? 0,
      hour_quantity: item.courseDetail?.hourQuantity ?? 0,
      classes_quantity: item.courseDetail?.classesQuantity ?? 0,
      title_required: item.courseDetail?.titleRequired ? 'Secundario Completo' : 'Primario Completo',
      titleRequired: Boolean(item.courseDetail?.titleRequired),
      endorsement_by: item.courseDetail?.endorsementBy || 'CFP N°404 Berisso',
    },
  }
}

function toApiPayload(courseData) {
  return {
    name: courseData.name,
    familyId: Number(courseData.familyId),
    instructorId: courseData.instructorId,
    statusId: Number(courseData.statusId || 1),
    startDate: courseData.startDate,
    endDate: courseData.endDate,
    startTime: courseData.startTime || null,
    endTime: courseData.endTime || null,
    preEnrollmentDate: courseData.preEnrollmentDate || null,
    isAnnual: Boolean(courseData.isAnnual),
    maxAbsences: Number(courseData.maxAbsences ?? courseData.max_absences ?? 4),
    description: courseData.description || courseData.detail?.description,
    quota: Number(courseData.quota ?? courseData.detail?.quota ?? 20),
    hourQuantity: Number(courseData.hourQuantity ?? courseData.hour_quantity ?? courseData.detail?.hour_quantity ?? 120),
    classesQuantity: Number(courseData.classesQuantity ?? courseData.classes_quantity ?? courseData.detail?.classes_quantity ?? 32),
    titleRequired: Boolean(courseData.titleRequired),
    endorsementBy: courseData.endorsementBy || courseData.detail?.endorsement_by || undefined,
    sponsorName: courseData.sponsorName || courseData.sponsor?.name || undefined,
    dayIds: Array.isArray(courseData.dayIds) ? courseData.dayIds.map(Number) : [],
  }
}

export { courseMatchesStage }

export async function fetchCourses() {
  try {
    const data = await GET('/courses')
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapApiCourse)
    }
    return []
  } catch (error) {
    if (error.status === 401 || error.status === 403) throw error
    throw new Error(error.message || 'No se pudieron cargar los cursos')
  }
}

export async function fetchFamilies() {
  try {
    const data = await GET('/families')
    if (Array.isArray(data) && data.length > 0) return data
  } catch (error) {
    console.warn('No se pudieron obtener las familias:', error.message)
  }
  return [
    { id: 1, name: 'Oficios' },
    { id: 2, name: 'Tecnología' },
    { id: 3, name: 'Emprendimiento' },
    { id: 4, name: 'Servicios' },
    { id: 5, name: 'Administración' },
  ]
}

export async function fetchDays() {
  try {
    const data = await GET('/days')
    if (Array.isArray(data) && data.length > 0) return data
  } catch (error) {
    console.warn('No se pudieron obtener los días:', error.message)
  }
  return [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' },
  ]
}

export async function fetchInstructorsForCourses() {
  try {
    const response = await GET('/api/v1/instructores')
    const list = response?.data || []
    return list.filter((person) => String(person.role_name || '').toUpperCase() === 'INSTRUCTOR')
  } catch (error) {
    console.warn('No se pudieron obtener los instructores:', error.message)
    return []
  }
}

export async function addCourseService(courseData) {
  const payload = toApiPayload(courseData)
  const res = await POST('/courses', payload)
  return mapApiCourse(res)
}

export async function updateCourseService(courseId, courseData) {
  const payload = toApiPayload(courseData)
  const res = await PUT('/courses', payload, courseId)
  return mapApiCourse(res)
}

export async function deactivateCourseService(courseId) {
  const res = await PUT('/courses', { statusId: 2 }, courseId)
  return mapApiCourse(res)
}

export async function removeCourseService(courseId) {
  await DELETE('/courses', courseId)
  return true
}
