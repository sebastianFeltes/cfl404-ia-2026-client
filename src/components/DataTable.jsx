import React, { useMemo } from 'react'
import StudentAvatar from './StudentAvatar'
import ActionButtons from './ActionButtons'
import { Inbox, Plus, ChevronLeft, ChevronRight, ChevronDown, ShieldAlert } from 'lucide-react'

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

function DataTable({ 
  students = [], 
  loading = false, 
  onView, 
  onEdit, 
  onDelete,
  onPromote,
  onResetFilters,
  onAddStudent,
  userRole = 'director',
  // Paginación
  paginaActual = 1,
  itemsPorPagina = 10,
  setPaginaActual,
  setItemsPorPagina,
  totalResultados = 0,
  isPrintMode = false,
  // Pestañas
  activeTab = 'alumnos',
  setActiveTab,
  tabCounts = { alumnos: 0, postulantes: 0 }
}) {
  const isPostulantesTab = activeTab === 'postulantes'

  const tableHeaders = isPostulantesTab
    ? [
        { label: 'Postulante', align: 'left', width: '28%' },
        { label: 'DNI', align: 'left', width: '13%' },
        { label: 'Email', align: 'left', width: '22%' },
        { label: 'Teléfono', align: 'left', width: '14%' },
        { label: 'Curso Solicitado', align: 'left', width: '15%' },
        { label: 'Acciones', align: 'center', width: '8%' }
      ]
    : [
        { label: 'Alumno', align: 'left', width: '28%' },
        { label: 'DNI', align: 'left', width: '13%' },
        { label: 'Email', align: 'left', width: '22%' },
        { label: 'Teléfono', align: 'left', width: '14%' },
        { label: 'Curso Asignado', align: 'left', width: '15%' },
        { label: 'Acciones', align: 'center', width: '8%' }
      ]

  const skeletonRows = Array(6).fill(null)
  const canCreate = userRole === 'director' || userRole === 'secretaria'
  const totalPaginas = Math.max(1, Math.ceil(totalResultados / itemsPorPagina))
  const startIndex = totalResultados === 0 ? 0 : (paginaActual - 1) * itemsPorPagina + 1
  const endIndex = Math.min(paginaActual * itemsPorPagina, totalResultados)

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
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden font-roboto transition-colors">
      
      {/* ── Cartel de Doble Verificación en Postulantes (no-print) ── */}
      {!isPrintMode && isPostulantesTab && (
        <div className="mx-5 my-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 flex items-start gap-3 shadow-2xs">
          <div className="p-2 bg-amber-500/15 rounded-lg text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide font-nunito">
              Verificar que los datos sean Reales
            </h4>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed font-nunito">
              Doble verificación obligatoria: corrobora que el postulante haya entregado físicamente la documentación requerida antes de matricularlo. Recién al confirmar su pase a alumno regular se generará su <strong>Token de Asistencia</strong> (ID + Email).
            </p>
          </div>
        </div>
      )}

      {/* ── Tabla de Datos Estilo Cooperadora ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" aria-label={isPostulantesTab ? "Tabla de alumnos postulantes" : "Tabla de estudiantes"}>
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-nunito uppercase tracking-wider font-extrabold text-[11px]">
              {tableHeaders.map((header, index) => (
                <th 
                  key={index} 
                  scope="col"
                  style={{ width: header.width }}
                  className={`py-3.5 px-4 ${
                    header.align === 'center' ? 'text-center' : header.align === 'right' ? 'text-right' : 'text-left'
                  } ${header.label === 'Acciones' ? 'no-print' : ''}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-roboto text-xs">
            {/* Loading Skeleton */}
            {loading && 
              skeletonRows.map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 flex items-center gap-3">
                    <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  </td>
                  <td className="p-3.5"><div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="p-3.5"><div className="h-3.5 w-36 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="p-3.5"><div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="p-3.5"><div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="p-3.5 text-center">
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                  </td>
                </tr>
              ))
            }

            {/* Data Rows */}
            {!loading && students.length > 0 && 
              students.map((student) => {
                const isStudentPostulante = isPostulanteCheck(student)
                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer text-slate-800 dark:text-slate-200"
                    onClick={() => onView && onView(student.id)}
                  >
                    {/* Alumno / Postulante */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            onView && onView(student.id)
                          }}
                          title={`Ver detalle de ${student.first_name} ${student.last_name}`}
                        >
                          <StudentAvatar 
                            src={student.profile_photo_url} 
                            nombre={student.first_name} 
                            apellido={student.last_name} 
                            estado={isStudentPostulante ? 'postulante' : student.status_id} 
                            size="sm" 
                          />
                        </div>
                        <div 
                          className="min-w-0 flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            onView && onView(student.id)
                          }}
                        >
                          <div className="font-nunito font-bold text-slate-800 dark:text-slate-100 group-hover:text-custom-azul-oscuro dark:group-hover:text-custom-celeste transition-colors truncate">
                            {student.first_name} {student.last_name}
                          </div>
                          {isStudentPostulante && (
                            <div className="mt-0.5">
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-custom-celeste/15 text-custom-azul-oscuro dark:text-custom-celeste rounded font-nunito uppercase tracking-wide">
                                Postulante
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* DNI */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs tabular-nums">
                      {student.dni || '—'}
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs truncate max-w-[200px]" title={student.email}>
                      {student.email || '—'}
                    </td>

                    {/* Teléfono */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs font-mono tabular-nums">
                      {student.phone || '—'}
                    </td>

                    {/* Curso Asignado / Solicitado */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-nunito font-bold text-xs text-custom-azul-oscuro dark:text-custom-celeste truncate">
                          {student.course_name || 'Sin curso asignado'}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-nunito mt-0.5">
                          {isStudentPostulante ? 'Postulación: ' : 'Inscripción: '}
                          {student.enrollment_date || '—'}
                        </div>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-center no-print">
                      <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                        <ActionButtons 
                          studentId={student.id}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onPromote={onPromote}
                          isPostulante={isStudentPostulante}
                          userRole={userRole}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && students.length === 0 && (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 transition-colors">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-3 shadow-inner">
            <Inbox className="h-10 w-10" aria-hidden="true" />
          </div>
          <h3 className="font-nunito font-extrabold text-base text-slate-800 dark:text-slate-200 mb-1">
            {isPostulantesTab ? 'No se encontraron postulantes' : 'No se encontraron alumnos'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 font-nunito">
            {isPostulantesTab
              ? 'No hay solicitudes o preinscripciones de postulantes que coincidan con los criterios de búsqueda.'
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

      {/* Footer de Paginación Estilo Cooperadora (no-print) */}
      {!loading && totalResultados > 0 && !isPrintMode && (
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col md:flex-row items-center justify-between gap-4 select-none no-print">
          
          {/* Left: Items per page & Total Info */}
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
                  className="h-8 px-2.5 pr-7 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none appearance-none cursor-pointer transition-colors text-xs font-nunito"
                  title="Cantidad por página"
                >
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-nunito">
              Mostrando <span className="font-bold text-slate-800 dark:text-slate-100">{startIndex} - {endIndex}</span> de <span className="font-bold text-slate-800 dark:text-slate-100">{totalResultados}</span> {isPostulantesTab ? 'postulantes' : 'alumnos'}
            </div>
          </div>

          {/* Right: Page Navigation Controls */}
          <div className="flex items-center gap-1 font-nunito">
            <button
              onClick={() => setPaginaActual && setPaginaActual((p) => Math.max(p - 1, 1))}
              disabled={paginaActual === 1}
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
              onClick={() => setPaginaActual && setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
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

export default DataTable
