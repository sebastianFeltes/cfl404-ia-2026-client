import React, { useState, useMemo, useEffect } from 'react'
import { Plus, User, CheckCircle, Clock, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react'
import Tooltip from '../Tooltip'
import { MESES } from './CooperadoraPagoDrawer'

export default function CooperadoraAlumnosTable({
  alumnos = [],
  payments = {},
  loading = false,
  onSelectStudent,
  currentYear = new Date().getFullYear(),
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset to page 1 whenever alumnos change (e.g., searching or filtering)
  useEffect(() => {
    setCurrentPage(1)
  }, [alumnos.length])

  // Pagination calculations
  const totalItems = alumnos.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(currentPage, totalPages)

  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedAlumnos = useMemo(() => {
    return alumnos.slice(startIndex, endIndex)
  }, [alumnos, startIndex, endIndex])

  // Helper for pagination numbers with dots
  const paginationRange = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const delta = 1
    const range = []
    for (
      let i = Math.max(2, validCurrentPage - delta);
      i <= Math.min(totalPages - 1, validCurrentPage + delta);
      i++
    ) {
      range.push(i)
    }
    if (validCurrentPage - delta > 2) {
      range.unshift('...')
    }
    if (validCurrentPage + delta < totalPages - 1) {
      range.push('...')
    }
    range.unshift(1)
    if (totalPages > 1) {
      range.push(totalPages)
    }
    return range
  }, [validCurrentPage, totalPages])

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 p-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-custom-celeste border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-custom-gris-claro dark:text-slate-400 font-nunito">
          Cargando nómina de alumnos y cuotas de cooperadora…
        </p>
      </div>
    )
  }

  if (alumnos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 p-12 text-center">
        <p className="text-custom-gris-claro dark:text-slate-400 font-nunito font-semibold text-base">
          No se encontraron alumnos con los criterios de búsqueda.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Probá modificando el término de búsqueda o limpiando los filtros.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-nunito uppercase tracking-wider font-extrabold text-[11px]">
              <th className="py-3.5 px-4 sticky left-0 z-10 bg-slate-50 dark:bg-slate-950 min-w-[220px] shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)]">
                Estudiante
              </th>
              {MESES.map((mes) => (
                <th key={mes.id} className="py-3.5 px-2 text-center min-w-[68px]">
                  {mes.short}
                </th>
              ))}
              <th className="py-3.5 px-3 text-center min-w-[90px]">
                Cuotas
              </th>
              <th className="py-3.5 px-4 text-right min-w-[100px]">
                Total ({currentYear})
              </th>
              <th className="py-3.5 px-3 text-center w-14">
                Acción
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-roboto">
            {paginatedAlumnos.map((alumno) => {
              const studentPayments = payments[alumno.id] || {}
              const totalPaidCount = Object.keys(studentPayments).filter(
                (m) => studentPayments[m]?.pagado
              ).length
              const totalPaidAmount = Object.values(studentPayments).reduce(
                (acc, p) => acc + (p?.pagado ? Number(p.monto || 0) : 0),
                0
              )

              return (
                <tr
                  key={alumno.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectStudent(alumno)}
                >
                  {/* Sticky Student Column */}
                  <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 dark:bg-slate-900 dark:group-hover:bg-slate-850 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] transition-colors">
                    <div className="flex items-center gap-3">
                      {alumno.profile_photo_url ? (
                        <img
                          src={alumno.profile_photo_url}
                          alt={`${alumno.first_name} ${alumno.last_name}`}
                          className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-custom-celeste/10 dark:bg-custom-celeste/20 text-custom-azul-oscuro dark:text-custom-celeste flex items-center justify-center font-nunito font-bold text-xs shrink-0">
                          {alumno.first_name?.[0] || 'A'}{alumno.last_name?.[0] || 'L'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-nunito font-bold text-slate-800 dark:text-slate-100 group-hover:text-custom-azul-oscuro dark:group-hover:text-custom-celeste transition-colors truncate">
                          {alumno.first_name} {alumno.last_name}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                          {alumno.dni ? `DNI ${alumno.dni}` : (alumno.course_name || 'Estudiante')}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* 12 Monthly Status Columns */}
                  {MESES.map((mes) => {
                    const pago = studentPayments[mes.id]
                    const estaPagado = Boolean(pago?.pagado)

                    return (
                      <td key={mes.id} className="py-3 px-1.5 text-center">
                        {estaPagado ? (
                          <Tooltip
                            text={`${mes.name}: $${Number(pago.monto).toLocaleString('es-AR')} (${pago.fecha ? new Date(pago.fecha + 'T00:00:00').toLocaleDateString('es-AR') : 'Abonado'})`}
                            position="top"
                          >
                            <span className="inline-flex flex-col items-center justify-center px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 font-mono font-bold text-[10px] leading-tight cursor-pointer">
                              <span>${Number(pago.monto).toLocaleString('es-AR')}</span>
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip text={`${mes.name}: Cuota pendiente`} position="top">
                            <span className="inline-block text-slate-300 dark:text-slate-600 font-bold text-xs cursor-pointer select-none">
                              —
                            </span>
                          </Tooltip>
                        )}
                      </td>
                    )
                  })}

                  {/* Total Paid Months Count */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        totalPaidCount >= 6
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : totalPaidCount > 0
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {totalPaidCount} / 12
                    </span>
                  </td>

                  {/* Total Amount Paid */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                    ${totalPaidAmount.toLocaleString('es-AR')}
                  </td>

                  {/* Action Column */}
                  <td className="py-3 px-3 text-center">
                    <Tooltip text="Registrar o ver pagos" position="left">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectStudent(alumno)
                        }}
                        className="p-1.5 rounded-lg text-custom-azul-oscuro dark:text-custom-celeste hover:bg-custom-azul-oscuro/10 dark:hover:bg-custom-celeste/10 transition-colors cursor-pointer"
                        aria-label={`Ver o cargar pagos de ${alumno.first_name} ${alumno.last_name}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="bg-gray-50 dark:bg-slate-950 px-6 py-3.5 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 no-print transition-colors">
          {/* Left: Rows per page & Count summary */}
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
                  aria-label="Cantidad de alumnos por página"
                  className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg pl-3 pr-7 py-1.5 shadow-2xs focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Mostrando <span className="font-bold text-slate-800 dark:text-slate-100">{startIndex + 1} - {endIndex}</span> de <span className="font-bold text-slate-800 dark:text-slate-100">{totalItems}</span> alumnos
            </div>
          </div>

          {/* Right: Page Navigation Controls */}
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
