import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Save,
  BookPlus,
  Pencil,
  Calendar,
  Clock,
  Users,
  Award,
  User,
  Layers,
  AlertCircle,
  Info,
  UserMinus,
} from 'lucide-react'
import Tooltip from '../Tooltip'
import { courseSchema } from '../../schemas/courseSchema'
import { getCourseStageFromDates, toDateInputValue, validateCourseStageDates } from '../../utils/courseStage'

const INITIAL_FORM_STATE = {
  name: '',
  familyId: '',
  instructorId: '',
  statusId: 1,
  startDate: '',
  endDate: '',
  startTime: '18:00',
  endTime: '21:00',
  preEnrollmentDate: '',
  isAnnual: false,
  quota: 20,
  hourQuantity: 120,
  classesQuantity: 32,
  maxAbsences: 4,
  description: '',
  titleRequired: false,
  endorsementBy: 'Ministerio de Educación y Trabajo de la Provincia de Buenos Aires',
  sponsorName: '',
  dayIds: [],
}

function CourseFormDrawer({
  course,
  isOpen,
  onClose,
  onSubmit,
  onDeactivate,
  families = [],
  instructors = [],
  days = [],
  isSubmitting = false,
  isReadOnly = false,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    setErrors({})
    if (course) {
      setFormData({
        id: course.id,
        name: course.name || '',
        familyId: course.familyId || course.family?.id || '',
        instructorId: course.instructorId || course.instructor?.id || '',
        statusId: Number(course.statusId || course.status?.id || 1),
        startDate: toDateInputValue(course.startDate || course.start_date),
        endDate: toDateInputValue(course.endDate || course.end_time),
        startTime: course.startTime || '18:00',
        endTime: course.endTime || '21:00',
        preEnrollmentDate: toDateInputValue(course.preEnrollmentDate || course.preenrollment_date),
        isAnnual: Boolean(course.isAnnual || course.is_annual),
        quota: course.quota ?? course.detail?.quota ?? 20,
        hourQuantity: course.detail?.hour_quantity ?? course.courseDetail?.hourQuantity ?? 120,
        classesQuantity: course.detail?.classes_quantity ?? course.courseDetail?.classesQuantity ?? 32,
        maxAbsences: course.maxAbsences ?? course.max_absences ?? 4,
        description: course.detail?.description || course.courseDetail?.description || '',
        titleRequired: Boolean(course.detail?.titleRequired || course.courseDetail?.titleRequired),
        endorsementBy: course.detail?.endorsement_by || course.courseDetail?.endorsementBy || INITIAL_FORM_STATE.endorsementBy,
        sponsorName: course.sponsor?.name || course.courseDetail?.sponsorName || '',
        dayIds: course.dayIds || (course.courseDays || []).map((item) => item.dayId),
      })
    } else {
      setFormData({ ...INITIAL_FORM_STATE })
    }
  }, [course, isOpen])

  const previewStage = useMemo(() => {
    return getCourseStageFromDates({
      startDate: formData.startDate,
      endDate: formData.endDate,
      isAnnual: formData.isAnnual,
    })
  }, [formData.startDate, formData.endDate, formData.isAnnual])

  const dateHint = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return null
    return validateCourseStageDates({
      startDate: formData.startDate,
      endDate: formData.endDate,
      isAnnual: formData.isAnnual,
    })
  }, [formData.startDate, formData.endDate, formData.isAnnual])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const toggleDay = (dayId) => {
    if (isReadOnly) return
    setFormData((prev) => {
      const exists = prev.dayIds.some((id) => Number(id) === Number(dayId))
      return {
        ...prev,
        dayIds: exists
          ? prev.dayIds.filter((id) => Number(id) !== Number(dayId))
          : [...prev.dayIds, dayId],
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isReadOnly || isSubmitting) return

    const payload = {
      ...formData,
      familyId: Number(formData.familyId),
      statusId: Number(formData.statusId),
      quota: Number(formData.quota),
      hourQuantity: Number(formData.hourQuantity),
      classesQuantity: Number(formData.classesQuantity),
      maxAbsences: Number(formData.maxAbsences),
      isAnnual: Boolean(formData.isAnnual),
      titleRequired: Boolean(formData.titleRequired),
      dayIds: formData.dayIds.map(Number),
    }

    const validation = courseSchema.safeParse(payload)
    if (!validation.success) {
      const formatted = {}
      validation.error.issues.forEach((issue) => {
        formatted[issue.path[0]] = issue.message
      })
      setErrors(formatted)
      return
    }

    onSubmit({ ...payload, ...validation.data, id: formData.id })
  }

  if (!isOpen && !course) return null

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-50 bg-custom-gris-oscuro/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-custom-gris-claro/10 dark:border-slate-800 flex flex-col h-screen h-[100dvh] transition-transform duration-300 ease-in-out transform font-roboto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-form-title"
      >
        <div className="p-6 bg-custom-azul-oscuro text-white relative shrink-0">
          <div className="absolute top-4 right-4">
            <Tooltip text="Cerrar formulario" position="left">
              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar formulario"
              >
                <X className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-4 mt-2 pr-8">
            <div className="h-16 w-16 rounded-xl bg-white text-custom-azul-oscuro flex items-center justify-center shadow-md shrink-0">
              {course ? <Pencil className="h-7 w-7" /> : <BookPlus className="h-7 w-7" />}
            </div>
            <div className="min-w-0">
              <h2 id="course-form-title" className="font-nunito font-extrabold text-xl leading-tight text-white truncate">
                {course ? formData.name || course.name : 'Registrar nuevo curso'}
              </h2>
              <p className="text-xs text-custom-celeste font-semibold mt-0.5">
                {previewStage ? previewStage.label : 'Completá las fechas para asignar la etapa lectiva'}
              </p>
            </div>
          </div>
        </div>

        <form id="course-admin-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {isReadOnly && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
              <Info className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Tu rol actual tiene permisos de solo lectura.</span>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-custom-celeste" />
              Identificación
            </h3>

            <div>
              <label htmlFor="name" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Nombre del curso <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isReadOnly}
                placeholder="Ej. Operador de PC"
                className={`w-full p-2.5 border rounded-lg bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 focus:outline-none ${
                  errors.name ? 'border-red-500' : 'border-custom-gris-claro/30 dark:border-slate-700 focus:border-custom-azul-oscuro'
                }`}
              />
              {errors.name && <FieldError message={errors.name} />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="familyId" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Familia / Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  id="familyId"
                  name="familyId"
                  value={formData.familyId}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full p-2.5 border rounded-lg bg-white dark:bg-slate-950 cursor-pointer ${
                    errors.familyId ? 'border-red-500' : 'border-custom-gris-claro/30 dark:border-slate-700'
                  }`}
                >
                  <option value="">Seleccionar familia</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>{family.name}</option>
                  ))}
                </select>
                {errors.familyId && <FieldError message={errors.familyId} />}
              </div>

              <div>
                <label htmlFor="statusId" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Estado
                </label>
                <select
                  id="statusId"
                  name="statusId"
                  value={formData.statusId}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 cursor-pointer"
                >
                  <option value={1}>Activo</option>
                  <option value={2}>Inactivo</option>
                  <option value={3}>Pendiente</option>
                  <option value={4}>Finalizado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <User className="h-4 w-4 text-custom-celeste" />
              Instructor a cargo
            </h3>
            <select
              name="instructorId"
              value={formData.instructorId}
              onChange={handleChange}
              disabled={isReadOnly}
              className={`w-full p-2.5 border rounded-lg bg-white dark:bg-slate-950 cursor-pointer ${
                errors.instructorId ? 'border-red-500' : 'border-custom-gris-claro/30 dark:border-slate-700'
              }`}
            >
              <option value="">Seleccionar instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.first_name} {instructor.last_name}
                  {Number(instructor.status_id) !== 1 ? ' (inactivo)' : ''}
                </option>
              ))}
            </select>
            {errors.instructorId && <FieldError message={errors.instructorId} />}
            {instructors.length === 0 && (
              <p className="text-[11px] text-amber-600">No hay instructores activos. Cargalos en Cuerpo Docente.</p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-custom-celeste" />
              Etapa lectiva y fechas
            </h3>

            <label className="flex items-center gap-2 font-bold text-custom-gris-oscuro dark:text-slate-200">
              <input
                type="checkbox"
                name="isAnnual"
                checked={formData.isAnnual}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded border-slate-300"
              />
              Curso anual / dictado continuo (aparece en ambas etapas)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="startDate" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Fecha de inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full p-2.5 border rounded-lg bg-gray-50/50 dark:bg-slate-950 ${
                    errors.startDate ? 'border-red-500' : 'border-custom-gris-claro/30 dark:border-slate-700'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Fecha de fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full p-2.5 border rounded-lg bg-gray-50/50 dark:bg-slate-950 ${
                    errors.endDate ? 'border-red-500' : 'border-custom-gris-claro/30 dark:border-slate-700'
                  }`}
                />
              </div>
            </div>
            {(errors.startDate || dateHint) && <FieldError message={errors.startDate || dateHint} />}
            {previewStage && !dateHint && (
              <p className="text-[11px] text-custom-azul-oscuro dark:text-custom-celeste font-semibold">
                Etapa calculada: {previewStage.label}
              </p>
            )}

            <div>
              <label htmlFor="preEnrollmentDate" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Inicio de preinscripción
              </label>
              <input
                type="date"
                id="preEnrollmentDate"
                name="preEnrollmentDate"
                value={formData.preEnrollmentDate}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-custom-celeste" />
              Días y horario
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {days.map((day) => {
                const selected = formData.dayIds.some((id) => Number(id) === Number(day.id))
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    disabled={isReadOnly}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-custom-azul-oscuro text-white border-custom-azul-oscuro'
                        : 'bg-white dark:bg-slate-950 text-slate-600 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {day.name}
                  </button>
                )
              })}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startTime" className="block font-bold mb-1">Hora inicio</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block font-bold mb-1">Hora fin</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-custom-celeste" />
              Carga académica
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="quota" className="block font-bold mb-1">Cupo *</label>
                <input type="number" id="quota" name="quota" value={formData.quota} onChange={handleChange} disabled={isReadOnly} className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950" />
                {errors.quota && <FieldError message={errors.quota} />}
              </div>
              <div>
                <label htmlFor="maxAbsences" className="block font-bold mb-1">Inasistencias máx.</label>
                <input type="number" id="maxAbsences" name="maxAbsences" value={formData.maxAbsences} onChange={handleChange} disabled={isReadOnly} className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950" />
              </div>
              <div>
                <label htmlFor="hourQuantity" className="block font-bold mb-1">Horas cátedra *</label>
                <input type="number" id="hourQuantity" name="hourQuantity" value={formData.hourQuantity} onChange={handleChange} disabled={isReadOnly} className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950" />
                {errors.hourQuantity && <FieldError message={errors.hourQuantity} />}
              </div>
              <div>
                <label htmlFor="classesQuantity" className="block font-bold mb-1">Cantidad de clases *</label>
                <input type="number" id="classesQuantity" name="classesQuantity" value={formData.classesQuantity} onChange={handleChange} disabled={isReadOnly} className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950" />
                {errors.classesQuantity && <FieldError message={errors.classesQuantity} />}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-custom-celeste" />
              Programa
            </h3>
            <div>
              <label htmlFor="description" className="block font-bold mb-1">Descripción *</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`w-full p-2.5 border rounded-lg bg-gray-50/50 dark:bg-slate-950 ${
                  errors.description ? 'border-red-500' : 'border-custom-gris-claro/30 dark:border-slate-700'
                }`}
              />
              {errors.description && <FieldError message={errors.description} />}
            </div>
            <label className="flex items-center gap-2 font-bold">
              <input type="checkbox" name="titleRequired" checked={formData.titleRequired} onChange={handleChange} disabled={isReadOnly} />
              Requiere secundario completo
            </label>
            <div>
              <label htmlFor="endorsementBy" className="block font-bold mb-1">Aval institucional</label>
              <input id="endorsementBy" name="endorsementBy" value={formData.endorsementBy} onChange={handleChange} disabled={isReadOnly} className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950" />
            </div>
            <div>
              <label htmlFor="sponsorName" className="block font-bold mb-1">Patrocinador</label>
              <input id="sponsorName" name="sponsorName" value={formData.sponsorName} onChange={handleChange} disabled={isReadOnly} placeholder="Ej. TecPlata" className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950" />
            </div>
          </div>
        </form>

        <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div>
            {course && !isReadOnly && onDeactivate && Number(formData.statusId) !== 2 && (
              <Tooltip text="Dar de baja este curso" position="top">
                <button
                  type="button"
                  onClick={() => onDeactivate(course)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <UserMinus className="h-4 w-4" />
                  Dar de baja
                </button>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-custom-gris-claro/30 dark:border-slate-700 text-custom-gris-oscuro dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="course-admin-form"
              disabled={isReadOnly || isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 text-custom-amarillo" />
              {isSubmitting ? 'Guardando...' : course ? 'Guardar cambios' : 'Crear curso'}
            </button>
          </div>
        </div>
      </aside>
    </>,
    document.body
  )
}

function FieldError({ message }) {
  return (
    <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" /> {message}
    </p>
  )
}

export default CourseFormDrawer
