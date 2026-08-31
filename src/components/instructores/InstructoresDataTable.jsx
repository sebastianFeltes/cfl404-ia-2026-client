import React, { useState, useEffect, useMemo } from 'react'
import { Inbox, Plus, Eye, Pencil, UserMinus, BookOpen, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import Tooltip from '../Tooltip'

const getStatusBorder = (status) => {
  const statusStr = String(status || '').toLowerCase()
  if (statusStr === '1' || statusStr === 'activo') return 'border-2 border-emerald-500 ring-2 ring-emerald-500/20'
  if (statusStr === '3' || statusStr === 'licencia' || statusStr === 'suspendido') return 'border-2 border-amber-500 ring-2 ring-amber-500/20'
  if (statusStr === '2' || statusStr === 'inactivo') return 'border-2 border-red-500 ring-2 ring-red-500/20'
  return 'border-2 border-slate-300 dark:border-slate-700'
}

const getStatusTooltip = (status) => {
  const statusStr = String(status || '').toLowerCase()
  if (statusStr === '1' || statusStr === 'activo') return 'Estado: Activo'
  if (statusStr === '3' || statusStr === 'licencia' || statusStr === 'suspendido') return 'Estado: En Licencia'
  if (statusStr === '2' || statusStr === 'inactivo') return 'Estado: Inactivo'
  return 'Estado: Desconocido'
}

const getInstructorCourses = (instructor) => {
  let courses = []
  if (Array.isArray(instructor?.assigned_courses) && instructor.assigned_courses.length > 0) {
    courses = instructor.assigned_courses.map(c => typeof c === 'string' ? c : (c.name || c.title || String(c)))
  } else if (Array.isArray(instructor?.courses) && instructor.courses.length > 0) {
    courses = instructor.courses.map(c => typeof c === 'string' ? c : (c.name || c.title || String(c)))
  } else if (instructor?.course_name) {
    if (typeof instructor.course_name === 'string' && instructor.course_name.includes(',')) {
      courses = instructor.course_name.split(',').map(s => s.trim()).filter(Boolean)
    } else {
      courses = [instructor.course_name]
    }
  }

  const firstCourse = courses.length > 0 ? courses[0] : null
  const extraCount = Math.max(0, courses.length - 1)
  const extraCourses = courses.slice(1)

  return {
    courses,
    firstCourse,
    extraCount,
    extraCourses
  }
}

function InstructoresDataTable({ 
  instructores = [], 
  loading = false, 
  onView, 
  onEdit, 
  onDelete,
  onResetFilters,
  onAddInstructor,
  userRole,
  hasCrud = false,
}) {
  const tableHeaders = [
    { label: 'Instructor', align: 'left', width: 'w-[24%]', title: 'Nombre completo, foto y especialidad' },
    { label: 'DNI', align: 'left', width: 'w-[12%]', title: 'Documento Nacional de Identidad' },
    { label: 'Email Institucional', align: 'left', width: 'w-[22%]', title: 'Correo electrónico oficial' },
    { label: 'Teléfono', align: 'left', width: 'w-[14%]', title: 'Teléfono o móvil de contacto' },
    { label: 'Cursos Asignados', align: 'left', width: 'w-[18%]', title: 'Oferta técnica y fecha de asignación' },
    { label: 'Acciones', align: 'center', width: 'w-[10%]', title: 'Ver detalle, editar o dar de baja' }
  ]

  // Pagination state (5, 15, 25)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Reset to page 1 whenever list changes (filter/search/sort)
  // Using the array reference (not .length) so a same-length filter result still resets correctly
  useEffect(() => {
    setCurrentPage(1)
  }, [instructores])

  const totalItems = instructores.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedInstructores = instructores.slice(startIndex, endIndex)

  // Smart pagination range generator
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

  const skeletonRows = Array(pageSize).fill(null)

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden font-roboto transition-colors">
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed text-left" aria-label="Tabla de instructores">
          <thead>
            <tr className="bg-slate-900 dark:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider border-b border-slate-800">
              {tableHeaders.map((header, index) => (
                <th 
                  key={index} 
                  scope="col"
                  title={header.title}
                  className={`p-4 ${header.width} border-b border-custom-gris-claro/20 dark:border-slate-800 whitespace-nowrap ${
                    header.align === 'center' ? 'text-center' : 'text-left'
                  } ${header.label === 'Acciones' ? 'no-print' : ''}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm font-medium">
            {/* Loading State */}
            {loading && 
              skeletonRows.map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-slate-800 rounded-full shrink-0" />
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-slate-800 rounded" />
                    </div>
                  </td>
                  <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-28 bg-gray-200 dark:bg-slate-800 rounded" /></td>
                  <td className="p-4 text-center no-print">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                      <div className="h-8 w-8 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            }

            {/* Data Success State */}
            {!loading && paginatedInstructores.length > 0 && 
              paginatedInstructores.map((instructor) => (
                <tr 
                  key={instructor.id} 
                  className="hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-colors duration-150 text-custom-gris-oscuro dark:text-slate-200"
                >
                  {/* Photo and Name with Status Border */}
                  <td className="p-4 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      <Tooltip text={getStatusTooltip(instructor.status_id)} position="right">
                        {instructor.profile_photo_url ? (
                          <img 
                            src={instructor.profile_photo_url} 
                            alt={`Foto de ${instructor.first_name}`}
                            className={`h-10 w-10 rounded-full object-cover shadow-xs shrink-0 cursor-pointer ${getStatusBorder(instructor.status_id)}`}
                          />
                        ) : (
                          <div className={`h-10 w-10 rounded-full bg-custom-azul-oscuro/10 dark:bg-custom-azul-oscuro/30 text-custom-azul-oscuro dark:text-custom-celeste flex items-center justify-center font-bold font-nunito shadow-xs shrink-0 cursor-pointer ${getStatusBorder(instructor.status_id)}`}>
                          {(instructor.first_name?.[0] || '?')}{(instructor.last_name?.[0] || '')}
                          </div>
                        )}
                      </Tooltip>
                      <div className="min-w-0 flex-1 pr-2">
                        <div 
                          className="font-bold text-custom-gris-oscuro dark:text-slate-100 font-nunito hover:text-custom-azul-oscuro dark:hover:text-custom-celeste cursor-pointer transition-colors truncate"
                          onClick={() => onView && onView(instructor.id)}
                          title={`Ver legajo de ${instructor.first_name} ${instructor.last_name}`}
                        >
                          {instructor.first_name} {instructor.last_name}
                        </div>
                        <div className="text-xs text-custom-gris-claro dark:text-slate-400 truncate font-mono">
                          ID: #{instructor.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DNI */}
                  <td className="p-4 text-custom-gris-oscuro dark:text-slate-300 font-mono text-xs truncate" title={`DNI: ${instructor.dni}`}>
                    {instructor.dni}
                  </td>

                  {/* Email */}
                  <td className="p-4 text-custom-gris-claro dark:text-slate-400 text-xs truncate" title={`Email: ${instructor.email}`}>
                    {instructor.email}
                  </td>

                  {/* Teléfono */}
                  <td className="p-4 text-custom-gris-claro dark:text-slate-400 text-xs truncate font-mono" title={`Tel: ${instructor.phone || 'Sin registrar'}`}>
                    {instructor.phone || 'Sin registrar'}
                  </td>

                  {/* Cursos Asignados */}
                  <td className="p-4 overflow-hidden">
                    {(() => {
                      const { firstCourse, extraCount, extraCourses } = getInstructorCourses(instructor)
                      if (!firstCourse) {
                        return (
                          <div className="min-w-0 pr-2">
                            <div className="text-xs text-slate-400 dark:text-slate-500 italic flex items-center gap-1.5 cursor-default">
                              <BookOpen className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                              <span className="truncate">Sin cursos asignados</span>
                            </div>
                            <div className="text-[10px] text-custom-gris-claro dark:text-slate-400 truncate mt-0.5">
                              Registrado: {instructor.created_at ? new Date(instructor.created_at).toLocaleDateString('es-AR') : 'N/D'}
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div 
                              className="font-semibold text-custom-azul-oscuro dark:text-custom-celeste text-xs flex items-center gap-1.5 min-w-0 truncate cursor-default"
                              title={`Curso principal: ${firstCourse}`}
                            >
                              <BookOpen className="h-3.5 w-3.5 text-custom-celeste shrink-0" />
                              <span className="truncate">{firstCourse}</span>
                            </div>
                            {extraCount > 0 && (
                              <Tooltip 
                                text={`Cursos adicionales (${extraCount}): ${extraCourses.join(', ')}`} 
                                position="top"
                              >
                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-custom-celeste/15 text-custom-azul-oscuro dark:bg-custom-celeste/25 dark:text-custom-celeste border border-custom-celeste/30 shrink-0 cursor-help shadow-2xs hover:bg-custom-celeste/25 dark:hover:bg-custom-celeste/35 transition-colors">
                                  +{extraCount}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                          <div className="text-[10px] text-custom-gris-claro dark:text-slate-400 truncate mt-0.5">
                            Registrado: {instructor.created_at ? new Date(instructor.created_at).toLocaleDateString('es-AR') : 'N/D'}
                          </div>
                        </div>
                      )
                    })()}
                  </td>

                  {/* Acciones */}
                  <td className="p-4 no-print text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Ver — visible para todos con acceso */}
                      <Tooltip text="Ver legajo completo" position="top">
                        <button
                          onClick={() => onView && onView(instructor.id)}
                          className="p-1.5 text-custom-celeste hover:text-custom-azul-oscuro dark:hover:text-custom-celeste hover:bg-custom-celeste/10 rounded-lg transition-all duration-150 cursor-pointer"
                          aria-label={`Ver detalle del instructor ${instructor.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </Tooltip>

                      {/* Editar — solo roles CRUD */}
                      {hasCrud && (
                        <Tooltip text="Editar datos del docente" position="top">
                          <button
                            onClick={() => onEdit && onEdit(instructor.id)}
                            className="p-1.5 text-custom-gris-claro dark:text-slate-400 hover:text-custom-gris-oscuro dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 cursor-pointer"
                            aria-label={`Editar instructor ${instructor.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      )}

                      {/* Dar de baja — solo roles CRUD */}
                      {hasCrud && (
                        <Tooltip text="Dar de baja al docente" position="top">
                          <button
                            onClick={() => onDelete && onDelete(instructor.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all duration-150 cursor-pointer"
                            aria-label={`Dar de baja instructor ${instructor.id}`}
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && instructores.length === 0 && (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-slate-900/50">
          <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-full text-custom-gris-claro/60 dark:text-slate-400 mb-4 shadow-inner">
            <Inbox className="h-12 w-12" aria-hidden="true" />
          </div>
          <h3 className="font-nunito font-extrabold text-lg text-custom-gris-oscuro dark:text-slate-100 mb-1">
            No se encontraron instructores
          </h3>
          <p className="text-sm text-custom-gris-claro dark:text-slate-400 max-w-sm mb-6">
            No hay registros que coincidan con los criterios de búsqueda actuales. Intenta cambiar los filtros o registra uno nuevo.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onResetFilters}
              className="px-4 py-2 border border-custom-gris-claro/30 dark:border-slate-700 text-custom-gris-oscuro dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
            {hasCrud && (
              <button
                onClick={onAddInstructor}
                className="px-4 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Nuevo Instructor
              </button>
            )}
          </div>
        </div>
      )}

      {/* Elegant Pagination Footer */}
      {!loading && totalItems > 0 && (
        <div className="bg-gray-50 dark:bg-slate-950 px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 no-print transition-colors">
          
          {/* Left: Row Size Selector & Summary */}
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
                  <option value={5}>5 por página</option>
                  <option value={15}>15 por página</option>
                  <option value={25}>25 por página</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Mostrando <span className="font-bold text-slate-800 dark:text-slate-100">{startIndex + 1} - {endIndex}</span> de <span className="font-bold text-slate-800 dark:text-slate-100">{totalItems}</span> docentes
            </div>
          </div>

          {/* Right: Modern Page Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
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

export default InstructoresDataTable
