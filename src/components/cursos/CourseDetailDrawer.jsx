import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  BookOpen,
  Calendar,
  Award,
  User,
  Layers,
  Pencil,
  UserMinus,
} from 'lucide-react'
import Tooltip from '../Tooltip'
import { getCourseStageFromDates, toDateInputValue } from '../../utils/courseStage'

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-custom-gris-claro dark:text-slate-400 font-bold uppercase">{label}</p>
      <p className="text-xs text-custom-gris-oscuro dark:text-slate-200 font-bold mt-0.5">{value == null || value === '' ? '—' : value}</p>
    </div>
  )
}

function CourseDetailDrawer({ course, isOpen, onClose, onEdit, onDeactivate, hasCrud = false }) {
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

  if (!course || !isOpen) return null

  const stage = getCourseStageFromDates(course)
  const familyName = course.family?.name || course.category || 'Sin familia'
  const instructorName = course.instructorName || course.staff || 'Sin instructor asignado'

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
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-custom-gris-claro/10 dark:border-slate-800 flex flex-col h-screen h-[100dvh] transition-transform duration-300 ease-in-out transform font-roboto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-drawer-title"
      >
        <div className="p-6 bg-custom-azul-oscuro text-white relative shrink-0">
          <div className="absolute top-4 right-4">
            <Tooltip text="Cerrar panel" position="left">
              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar ficha del curso"
              >
                <X className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-4 mt-2 pr-8">
            <div className="h-16 w-16 rounded-xl bg-white text-custom-azul-oscuro flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-bold text-custom-celeste">{familyName}</p>
              <h2 id="course-drawer-title" className="font-nunito font-extrabold text-xl leading-tight text-white">
                {course.name}
              </h2>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-full border bg-white/10 text-white border-white/20`}>
                  {course.status?.label || 'Estado'}
                </span>
                {stage && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-custom-amarillo text-custom-azul-oscuro">
                    {stage.short}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-custom-celeste" />
              Oferta y familia
            </h3>
            <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl space-y-3 border border-gray-100/50 dark:border-slate-800/80">
              <InfoRow label="Familia / Categoría" value={familyName} />
              <InfoRow label="Etapa lectiva" value={stage?.label || course.stage} />
              <InfoRow label="Descripción" value={course.detail?.description || course.courseDetail?.description} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <User className="h-4 w-4 text-custom-celeste" />
              Instructor a cargo
            </h3>
            <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl border border-gray-100/50 dark:border-slate-800/80">
              <p className="text-sm font-extrabold text-custom-azul-oscuro dark:text-custom-celeste">{instructorName}</p>
              {course.instructor?.email && (
                <p className="text-xs text-custom-gris-claro dark:text-slate-400 mt-0.5">{course.instructor.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-custom-celeste" />
              Cursada
            </h3>
            <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl grid grid-cols-2 gap-3 border border-gray-100/50 dark:border-slate-800/80">
              <InfoRow label="Inicio" value={toDateInputValue(course.startDate || course.start_date)} />
              <InfoRow label="Fin" value={toDateInputValue(course.endDate || course.end_time)} />
              <div className="col-span-2">
                <InfoRow label="Días y horario" value={course.schedule} />
              </div>
              <InfoRow label="Preinscripción" value={toDateInputValue(course.preEnrollmentDate || course.preenrollment_date)} />
              <InfoRow label="Dictado" value={course.isAnnual ? 'Anual / continuo' : 'Por etapa'} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-custom-celeste" />
              Carga y cupos
            </h3>
            <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl grid grid-cols-2 gap-3 border border-gray-100/50 dark:border-slate-800/80">
              <InfoRow label="Vacantes disponibles" value={`${course.availableQuota ?? course.detail?.quota ?? 0} de ${course.quota ?? course.detail?.quota ?? 0}`} />
              <InfoRow label="Inscriptos" value={course.enrolledCount ?? 0} />
              <InfoRow label="Horas cátedra" value={course.detail?.hour_quantity} />
              <InfoRow label="Clases" value={course.detail?.classes_quantity} />
              <InfoRow label="Inasistencias máx." value={course.maxAbsences ?? course.max_absences} />
              <InfoRow label="Requisito de título" value={course.detail?.title_required} />
              <div className="col-span-2">
                <InfoRow label="Aval institucional" value={course.detail?.endorsement_by} />
              </div>
              {course.sponsor?.name && (
                <div className="col-span-2">
                  <InfoRow label="Patrocinador" value={course.sponsor.name} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2.5 shrink-0 no-print">
          <div>
            {hasCrud && onDeactivate && Number(course.statusId || course.status?.id) !== 2 && (
              <Tooltip text="Dar de baja este curso" position="top">
                <button
                  onClick={() => onDeactivate(course)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3.5 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <UserMinus className="h-4 w-4" />
                  Dar de baja
                </button>
              </Tooltip>
            )}
          </div>
          {hasCrud && onEdit && (
            <Tooltip text="Modificar este curso" position="top">
              <button
                onClick={() => onEdit(course)}
                className="flex items-center justify-center gap-1.5 py-2 px-3.5 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/90 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Pencil className="h-4 w-4 text-custom-amarillo" />
                Editar
              </button>
            </Tooltip>
          )}
        </div>
      </aside>
    </>,
    document.body
  )
}

export default CourseDetailDrawer
