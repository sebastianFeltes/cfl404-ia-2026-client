import React, { useState, useEffect, useMemo } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  User,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Inbox,
  Award,
} from 'lucide-react'
import Tooltip from '../Tooltip'
import { getCourseStageFromDates } from '../../utils/courseStage'

function CourseCardView({
  courses = [],
  loading = false,
  onView,
  onEdit,
  onResetFilters,
  onAddCourse,
  hasCrud = false,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  useEffect(() => {
    setCurrentPage(1)
  }, [courses])

  const totalItems = courses.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedCourses = courses.slice(startIndex, endIndex)

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skeletonCards.map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 p-5 flex flex-col justify-between animate-pulse min-h-[260px]"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md" />
                  <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-md" />
                </div>
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/40">
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 text-slate-400">
              <Inbox size={40} />
            </div>
            <h4 className="font-nunito font-extrabold text-lg text-custom-gris-oscuro dark:text-slate-100 mb-1">
              No se encontraron cursos
            </h4>
            <p className="text-xs text-custom-gris-claro dark:text-slate-400 max-w-sm mb-4">
              Probá ajustando los términos de búsqueda o los filtros de etapa y familia.
            </p>
            <div className="flex gap-2">
              {onResetFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-custom-gris-oscuro dark:text-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Restablecer filtros
                </button>
              )}
              {hasCrud && onAddCourse && (
                <button
                  type="button"
                  onClick={onAddCourse}
                  className="px-4 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  + Agregar curso
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedCourses.map((course) => {
              const stage = getCourseStageFromDates(course)
              const isActive = Number(course.statusId || course.status?.id) === 1
              const isPending = Number(course.statusId || course.status?.id) === 3
              const familyName = course.family?.name || course.category || 'General'
              const instructorName = course.instructorName || course.staff || 'Sin instructor'
              const vacancies = course.availableQuota ?? course.detail?.quota ?? 0
              const totalQuota = course.quota ?? course.detail?.quota ?? 0

              return (
                <div
                  key={course.id}
                  className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-[#166193]/40 dark:hover:border-[#37A6DE]/40 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Card Header: Category badge + Status Dot */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-custom-azul-oscuro dark:text-custom-celeste uppercase tracking-wider truncate max-w-[70%]">
                        {familyName}
                      </span>

                      {/* Status indicator dot */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50 ring-2 ring-emerald-500/20'
                              : isPending
                              ? 'bg-amber-400 ring-2 ring-amber-400/20'
                              : 'bg-slate-400 ring-2 ring-slate-400/20'
                          }`}
                          title={course.status?.label || (isActive ? 'Activo' : 'Finalizado / Inactivo')}
                        />
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {course.status?.label || (isActive ? 'Activo' : 'Finalizado')}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onView?.(course)}
                      className="text-base font-extrabold text-custom-gris-oscuro dark:text-slate-100 hover:text-custom-azul-oscuro dark:hover:text-custom-celeste transition-colors cursor-pointer leading-snug line-clamp-2 mb-2 font-nunito"
                      title={course.name}
                    >
                      {course.name}
                    </h3>

                    {/* Stage Tag */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-[#166193] dark:text-sky-300 bg-[#166193]/10 dark:bg-sky-950/50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Sparkles size={11} className="text-[#FDEA14]" />
                        {stage?.label || course.stage || 'Sin etapa'}
                      </span>
                    </div>

                    {/* Specs / Metadata list */}
                    <div className="space-y-2 text-xs text-custom-gris-claro dark:text-slate-400 font-medium">
                      {/* Instructor */}
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                          <User size={12} />
                        </div>
                        <span className="truncate text-slate-700 dark:text-slate-300 font-semibold">
                          {instructorName}
                        </span>
                      </div>

                      {/* Schedule */}
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                          <Clock size={12} />
                        </div>
                        <span className="truncate">
                          {course.schedule || 'Horario a confirmar'}
                        </span>
                      </div>

                      {/* Vacancies */}
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                          <Users size={12} />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-bold">
                          {vacancies} vacantes disponibles
                          {totalQuota > 0 && (
                            <span className="text-slate-400 font-normal"> / {totalQuota}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onView?.(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-custom-azul-oscuro dark:text-custom-celeste rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      Ver detalle
                    </button>

                    {hasCrud && (
                      <Tooltip text="Editar curso" position="top">
                        <button
                          type="button"
                          onClick={() => onEdit?.(course)}
                          className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-500 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                          aria-label="Editar curso"
                        >
                          <Pencil size={14} />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-custom-gris-claro dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="h-8 px-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro cursor-pointer"
            >
              <option value={6}>6 cursos</option>
              <option value={9}>9 cursos</option>
              <option value={12}>12 cursos</option>
              <option value={24}>24 cursos</option>
            </select>
            <span>por página</span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              Mostrando <strong className="text-custom-gris-oscuro dark:text-slate-200">{startIndex + 1}</strong> a{' '}
              <strong className="text-custom-gris-oscuro dark:text-slate-200">{endIndex}</strong> de{' '}
              <strong className="text-custom-gris-oscuro dark:text-slate-200">{totalItems}</strong> cursos
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              {paginationRange.map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">
                    …
                  </span>
                ) : (
                  <button
                    key={`page-${page}`}
                    type="button"
                    onClick={() => setCurrentPage(Number(page))}
                    className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      validCurrentPage === page
                        ? 'bg-custom-azul-oscuro text-white shadow-xs'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseCardView
