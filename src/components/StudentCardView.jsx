// Archivo: src/components/StudentCardView.jsx
import React, { useMemo } from 'react'
import { Link } from 'react-router'
import StudentAvatar from './StudentAvatar'
import Tooltip from './Tooltip'
import { 
  Mail, 
  Phone, 
  BookOpen, 
  Calendar, 
  Inbox, 
  Plus, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ExternalLink,
  Pencil,
  UserCheck,
  Eye
} from 'lucide-react'

function isPostulanteCheck(student) {
  if (!student) return false
  const role = String(student.role_name || '').toUpperCase()
  const status = String(student.status || '').toUpperCase()
  return (
    Boolean(student.is_aspirante) ||
    role === 'POSTULANTE' ||
    role === 'ASPIRANTE' ||
    student.status_id === 3 ||
    status === 'PENDIENTE' ||
    status === 'POSTULANTE' ||
    status === 'ASPIRANTE'
  )
}

export default function StudentCardView({
  students = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onPromote,
  onResetFilters,
  onAddStudent,
  onViewCourse,
  userRole = 'director',
  activeTab = 'alumnos',
  paginaActual = 1,
  itemsPorPagina = 10,
  setPaginaActual,
  setItemsPorPagina,
  totalResultados = 0,
  isPrintMode = false
}) {
  const isPostulantesTab = activeTab === 'postulantes'
  const canCreate = userRole === 'director' || userRole === 'secretaria'
  const canEdit = userRole === 'director' || userRole === 'secretaria'
  const totalPaginas = Math.max(1, Math.ceil(totalResultados / itemsPorPagina))
  const startIndex = totalResultados === 0 ? 0 : (paginaActual - 1) * itemsPorPagina + 1
  const endIndex = Math.min(paginaActual * itemsPorPagina, totalResultados)
  const skeletonCards = Array(6).fill(null)

  const paginationRange = useMemo(() => {
    if (totalPaginas <= 5) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1)
    }
    const delta = 1
    const range = []
    for (
      let i = Math.max(2, paginaActual - delta);
      i <= Math.min(totalPaginas - 1, paginaActual + delta);
      i++
    ) {
      range.push(i)
    }
    if (paginaActual - delta > 2) {
      range.unshift('...')
    }
    if (paginaActual + delta < totalPaginas - 1) {
      range.push('...')
    }
    range.unshift(1)
    if (totalPaginas > 1) {
      range.push(totalPaginas)
    }
    return range
  }, [paginaActual, totalPaginas])

  return (
    <div className="w-full bg-slate-50/50 dark:bg-slate-900/50 p-5 font-roboto transition-colors duration-200">
      
      {/* Cartel de Doble Verificación en Pestaña Postulantes */}
      {!isPrintMode && isPostulantesTab && (
        <div className="mb-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 flex items-start gap-3 shadow-2xs">
          <div className="p-2 bg-amber-500/15 rounded-lg text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide font-nunito">
              Verificar que los datos sean Reales
            </h4>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed font-nunito">
              Doble verificación obligatoria: corrobora que el postulante haya entregado físicamente la documentación requerida antes de matricularlo. Recién al confirmar su pase a alumno regular se generará su <strong>Token de Asistencia</strong> (ID del Alumno).
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeleton Cards */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skeletonCards.map((_, index) => (
            <div 
              key={`skeleton-card-${index}`} 
              className="bg-white dark:bg-slate-900 border border-custom-gris-claro/10 dark:border-slate-800 rounded-xl p-5 shadow-xs animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Cards Grid Success */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {students.map((student) => {
            const isStudentPostulante = isPostulanteCheck(student)
            return (
              <div
                key={student.id}
                className="bg-white dark:bg-slate-900 border border-custom-gris-claro/10 dark:border-slate-800 hover:border-custom-celeste/50 dark:hover:border-custom-celeste/40 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Header de la Tarjeta */}
                <div>
                  <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                    <div 
                      className="cursor-pointer shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onView && onView(student.id)
                      }}
                      title="Ver legajo completo"
                    >
                      <StudentAvatar
                        src={student.profile_photo_url}
                        nombre={student.first_name}
                        apellido={student.last_name}
                        estado={isStudentPostulante ? 'postulante' : student.status_id}
                        size="md"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 
                        onClick={(e) => {
                          e.stopPropagation()
                          onView && onView(student.id)
                        }}
                        className="font-bold text-slate-900 dark:text-slate-100 font-nunito group-hover:text-custom-azul-oscuro dark:group-hover:text-custom-celeste cursor-pointer transition-colors leading-snug truncate"
                      >
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        DNI: {student.dni || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="py-3.5 space-y-2.5 text-xs">
                    {/* Curso con Hipervínculo para ver Ficha del Curso */}
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 min-w-0">
                      <BookOpen size={14} className="text-custom-azul-oscuro dark:text-custom-celeste shrink-0" />
                      {student.course_name && student.course_name !== 'Sin curso asignado' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onViewCourse && onViewCourse(student.course_name, student)
                          }}
                          className="font-nunito font-bold text-xs text-custom-azul-oscuro dark:text-custom-celeste hover:underline hover:text-[#37A6DE] transition-colors truncate flex items-center gap-1 group/curso cursor-pointer text-left"
                          title={`Ver detalles del curso ${student.course_name}`}
                        >
                          <span className="truncate">{student.course_name}</span>
                          <ExternalLink size={11} className="opacity-0 group-hover/curso:opacity-100 transition-opacity shrink-0 text-custom-celeste" />
                        </button>
                      ) : (
                        <span className="font-nunito text-xs text-slate-400 italic truncate">
                          Sin curso asignado
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{student.email || '—'}</span>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span className="font-mono tabular-nums">{student.phone || 'Sin teléfono'}</span>
                    </div>

                    {/* Fecha de Inscripción */}
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
                      <Calendar size={13} className="text-slate-400 shrink-0" />
                      <span className="font-nunito">{isStudentPostulante ? 'Postulación:' : 'Inscrito:'} {student.enrollment_date || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1.5 no-print" onClick={(e) => e.stopPropagation()}>
                  {/* Ver detalles (Ojo) */}
                  <Tooltip text={isStudentPostulante ? "Ver ficha de postulación" : "Ver detalles del alumno"} position="top">
                    <button
                      type="button"
                      onClick={() => onView && onView(student.id)}
                      className="p-1.5 text-custom-celeste hover:text-custom-azul-oscuro hover:bg-custom-celeste/10 rounded-lg transition-all duration-150 cursor-pointer"
                      aria-label={isStudentPostulante ? "Ver ficha de postulación" : "Ver detalles"}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </Tooltip>

                  {/* Matricular (solo postulantes) */}
                  {isStudentPostulante && canEdit && onPromote && (
                    <Tooltip text="Aprobar y Matricular como Alumno" position="top">
                      <button
                        type="button"
                        onClick={() => onPromote(student.id)}
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-all cursor-pointer"
                        aria-label={`Matricular a ${student.first_name}`}
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  )}

                  {/* Editar */}
                  {canEdit && onEdit && (
                    <Tooltip text="Editar alumno" position="top">
                      <button
                        type="button"
                        onClick={() => onEdit(student.id)}
                        className="p-1.5 text-custom-gris-claro hover:text-custom-gris-oscuro hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                        aria-label={`Editar a ${student.first_name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && students.length === 0 && (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-xl border border-custom-gris-claro/10 dark:border-slate-800">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-3 shadow-inner">
            <Inbox className="h-10 w-10" aria-hidden="true" />
          </div>
          <h3 className="font-nunito font-extrabold text-base text-slate-800 dark:text-slate-200 mb-1">
            {isPostulantesTab ? 'No se encontraron postulantes' : 'No se encontraron alumnos'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 font-nunito">
            {isPostulantesTab
              ? 'No hay solicitudes o preinscripciones de postulantes que coincidan con la búsqueda.'
              : 'No hay registros de alumnos regulares que coincidan con los criterios de búsqueda o filtros actuales.'}
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetFilters}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-nunito font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
            {canCreate && (
              <button
                onClick={() => onAddStudent && onAddStudent(isPostulantesTab ? 'Postulante' : 'Alumno')}
                className={`px-3.5 py-1.5 text-white rounded-lg text-xs font-nunito font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                  isPostulantesTab 
                    ? 'bg-custom-celeste hover:bg-custom-celeste/95' 
                    : 'bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95'
                }`}
              >
                <Plus className="h-3.5 w-3.5 text-custom-amarillo" />
                {isPostulantesTab ? 'Nuevo Postulante' : 'Nuevo Alumno'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination Footer Estilo Cooperadora */}
      {!loading && totalResultados > 0 && !isPrintMode && (
        <div className="mt-5 flex flex-col md:flex-row items-center justify-between px-5 py-3 border border-custom-gris-claro/10 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 no-print text-xs gap-4 transition-colors">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-nunito">Mostrar:</span>
              <div className="relative">
                <select
                  value={itemsPorPagina}
                  onChange={(e) => {
                    setItemsPorPagina && setItemsPorPagina(Number(e.target.value))
                    setPaginaActual && setPaginaActual(1)
                  }}
                  title="Cantidad por página"
                  className="h-8 px-2.5 pr-7 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none appearance-none cursor-pointer transition-colors text-xs font-nunito"
                >
                  <option value={6}>6 por página</option>
                  <option value={12}>12 por página</option>
                  <option value={24}>24 por página</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-nunito">
              Mostrando <span className="font-bold text-slate-800 dark:text-slate-100">{startIndex} - {endIndex}</span> de <span className="font-bold text-slate-800 dark:text-slate-100">{totalResultados}</span> {isPostulantesTab ? 'postulantes' : 'alumnos'}
            </div>
          </div>

          <div className="flex items-center gap-1 font-nunito">
            <button
              onClick={() => setPaginaActual && setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              title="Página anterior"
              aria-label="Página anterior"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex items-center gap-1 px-1">
              {paginationRange.map((page, idx) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${idx}`} className="px-2 text-slate-400 font-bold select-none">
                      ...
                    </span>
                  )
                }
                const isActive = page === paginaActual
                return (
                  <button
                    key={page}
                    onClick={() => setPaginaActual && setPaginaActual(page)}
                    className={`h-8 min-w-[32px] px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'bg-custom-azul-oscuro dark:bg-custom-azul-oscuro text-white shadow-xs font-extrabold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setPaginaActual && setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
              title="Página siguiente"
              aria-label="Página siguiente"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
