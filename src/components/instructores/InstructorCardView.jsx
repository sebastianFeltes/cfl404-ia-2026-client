import React, { useState, useEffect, useMemo } from 'react'
import { Mail, Phone, BookOpen, Calendar, Inbox, Plus, Eye, Pencil, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import InstructorAvatar from './InstructorAvatar'
import BadgeStatus from '../BadgeStatus'
import Tooltip from '../Tooltip'

const getInstructorCourses = (instructor) => {
  let courses = []
  if (Array.isArray(instructor?.assigned_courses) && instructor.assigned_courses.length > 0) {
    courses = instructor.assigned_courses.map((c) => (typeof c === 'string' ? c : (c.name || c.title || String(c))))
  } else if (Array.isArray(instructor?.courses) && instructor.courses.length > 0) {
    courses = instructor.courses.map((c) => (typeof c === 'string' ? c : (c.name || c.title || String(c))))
  } else if (instructor?.course_name) {
    if (typeof instructor.course_name === 'string' && instructor.course_name.includes(',')) {
      courses = instructor.course_name.split(',').map((s) => s.trim()).filter(Boolean)
    } else {
      courses = [instructor.course_name]
    }
  }

  return {
    firstCourse: courses[0] || null,
    extraCount: Math.max(0, courses.length - 1),
    extraCourses: courses.slice(1),
  }
}

const badgeStatus = (statusId) => (Number(statusId) === 3 ? 'licencia' : statusId)

function InstructorCardView({
  instructores = [],
  loading = false,
  onView,
  onEdit,
  onResetFilters,
  onAddInstructor,
  hasCrud = false,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  useEffect(() => {
    setCurrentPage(1)
  }, [instructores])

  const totalItems = instructores.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedInstructores = instructores.slice(startIndex, endIndex)

  const paginationRange = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (validCurrentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages]
    }
    if (validCurrentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages]
  }, [totalPages, validCurrentPage])

  const skeletonCards = Array(6).fill(null)

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden font-roboto transition-colors">
      <div className="w-full bg-slate-50/50 dark:bg-slate-900/50 p-5">

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skeletonCards.map((_, index) => (
              <div
                key={`skeleton-card-${index}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs animate-pulse space-y-4"
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

        {!loading && paginatedInstructores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {paginatedInstructores.map((instructor) => {
              const { firstCourse, extraCount, extraCourses } = getInstructorCourses(instructor)

              return (
                <div
                  key={instructor.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#37A6DE]/50 dark:hover:border-[#37A6DE]/40 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          className="cursor-pointer shrink-0"
                          onClick={() => onView && onView(instructor.id)}
                          title="Ver legajo completo"
                        >
                          <InstructorAvatar
                            src={instructor.profile_photo_url}
                            nombre={instructor.first_name}
                            apellido={instructor.last_name}
                            estado={instructor.status_id}
                            size="lg"
                          />
                        </button>
                        <div className="min-w-0">
                          <h3
                            onClick={() => onView && onView(instructor.id)}
                            className="font-bold text-slate-900 dark:text-slate-100 font-nunito hover:text-[#166193] dark:hover:text-[#37A6DE] cursor-pointer transition-colors leading-snug truncate"
                          >
                            {instructor.first_name} {instructor.last_name}
                          </h3>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                            DNI: {instructor.dni || '—'}
                          </p>
                        </div>
                      </div>

                      <BadgeStatus status={badgeStatus(instructor.status_id)} />
                    </div>

                    <div className="py-3.5 space-y-2.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 min-w-0">
                        <BookOpen size={14} className="text-[#166193] dark:text-[#37A6DE] shrink-0" />
                        {firstCourse ? (
                          <span className="font-semibold truncate" title={extraCount > 0 ? `${firstCourse}, ${extraCourses.join(', ')}` : firstCourse}>
                            {firstCourse}
                            {extraCount > 0 && (
                              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-custom-celeste/15 text-custom-azul-oscuro dark:bg-custom-celeste/25 dark:text-custom-celeste border border-custom-celeste/30">
                                +{extraCount}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic truncate">Sin cursos asignados</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Mail size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{instructor.email || '—'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span className="font-mono tabular-nums">{instructor.phone || 'Sin teléfono'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>
                          Registrado: {instructor.created_at ? new Date(instructor.created_at).toLocaleDateString('es-AR') : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
                    <button
                      type="button"
                      onClick={() => onView && onView(instructor.id)}
                      className="text-xs font-bold text-[#166193] dark:text-[#37A6DE] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Ver ficha →
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Tooltip text="Ver legajo completo" position="top">
                        <button
                          type="button"
                          onClick={() => onView && onView(instructor.id)}
                          className="p-1.5 text-custom-celeste hover:text-custom-azul-oscuro dark:hover:text-custom-celeste hover:bg-custom-celeste/10 rounded-lg transition-all duration-150 cursor-pointer"
                          aria-label={`Ver detalle del instructor ${instructor.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </Tooltip>

                      {hasCrud && (
                        <Tooltip text="Editar datos del docente" position="top">
                          <button
                            type="button"
                            onClick={() => onEdit && onEdit(instructor.id)}
                            className="p-1.5 text-custom-gris-claro dark:text-slate-400 hover:text-custom-gris-oscuro dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 cursor-pointer"
                            aria-label={`Editar instructor ${instructor.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && instructores.length === 0 && (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-3 shadow-inner">
              <Inbox className="h-10 w-10" aria-hidden="true" />
            </div>
            <h3 className="font-nunito font-extrabold text-base text-slate-800 dark:text-slate-200 mb-1">
              No se encontraron instructores
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 font-nunito">
              No hay registros que coincidan con los criterios de búsqueda actuales. Intentá cambiar los filtros o registrá uno nuevo.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onResetFilters}
                className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Restablecer Filtros
              </button>
              {hasCrud && (
                <button
                  type="button"
                  onClick={onAddInstructor}
                  className="px-3.5 py-1.5 bg-[#166193] hover:bg-[#124f78] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 text-[#FDEA14]" />
                  Nuevo Instructor
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!loading && totalItems > 0 && (
        <div className="bg-gray-50 dark:bg-slate-950 px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 no-print transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Mostrar:</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  aria-label="Cantidad de docentes por página"
                  className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg pl-3 pr-7 py-1.5 shadow-2xs focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
                >
                  <option value={6}>6 por página</option>
                  <option value={12}>12 por página</option>
                  <option value={24}>24 por página</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Mostrando <span className="font-bold text-slate-800 dark:text-slate-100">{startIndex + 1} - {endIndex}</span> de <span className="font-bold text-slate-800 dark:text-slate-100">{totalItems}</span> docentes
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={validCurrentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
              title="Página anterior"
              aria-label="Página anterior"
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
                const isActive = page === validCurrentPage
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
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
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={validCurrentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
              title="Página siguiente"
              aria-label="Página siguiente"
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

export default InstructorCardView
