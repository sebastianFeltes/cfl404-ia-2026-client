import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, DollarSign, Trash2, ArrowDownLeft, ArrowUpRight, ShoppingBag, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import Tooltip from '../Tooltip'

export default function CooperadoraBuffetTable({
  registros = [],
  onDeleteRegistro,
  onOpenNewModal,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset to page 1 whenever registros change
  useEffect(() => {
    setCurrentPage(1)
  }, [registros.length])

  // Pagination calculations
  const totalItems = registros.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(currentPage, totalPages)

  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedRegistros = useMemo(() => {
    return registros.slice(startIndex, endIndex)
  }, [registros, startIndex, endIndex])

  // Helper for pagination range
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

  if (registros.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 p-12 text-center transition-colors">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <p className="text-custom-gris-oscuro dark:text-slate-200 font-nunito font-bold text-lg">
          No hay registros de buffet todavía
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-md mx-auto">
          Podés registrar los ingresos diarios por recaudación del buffet o los gastos en insumos y mercadería.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={onOpenNewModal}
            className="px-4 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            + Cargar Primer Movimiento
          </button>
        </div>
      </div>
    )
  }

  // Calculate totals from ALL records
  const totalIngresos = registros
    .filter((r) => r.tipo !== 'egreso')
    .reduce((acc, r) => acc + Number(r.monto || 0), 0)

  const totalEgresos = registros
    .filter((r) => r.tipo === 'egreso')
    .reduce((acc, r) => acc + Number(r.monto || 0), 0)

  const balanceNeto = totalIngresos - totalEgresos

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Header */}
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-nunito uppercase tracking-wider font-extrabold text-[11px]">
                <th className="py-3.5 px-4 min-w-[130px]">Fecha</th>
                <th className="py-3.5 px-3 min-w-[110px]">Tipo</th>
                <th className="py-3.5 px-4 min-w-[220px]">Detalle / Concepto</th>
                <th className="py-3.5 px-4 min-w-[180px]">Observaciones</th>
                <th className="py-3.5 px-4 text-right min-w-[120px]">Monto</th>
                <th className="py-3.5 px-3 text-center w-14">Acción</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-roboto">
              {paginatedRegistros.map((item) => {
                const esIngreso = item.tipo !== 'egreso'

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Fecha */}
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold font-mono flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{item.fecha ? new Date(item.fecha + 'T00:00:00').toLocaleDateString('es-AR') : 'Sin fecha'}</span>
                    </td>

                    {/* Tipo */}
                    <td className="py-3 px-3">
                      {esIngreso ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <ArrowDownLeft className="h-3 w-3" />
                          Ingreso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <ArrowUpRight className="h-3 w-3" />
                          Gasto
                        </span>
                      )}
                    </td>

                    {/* Detalle */}
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                      {item.detalle}
                    </td>

                    {/* Observaciones */}
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 italic">
                      {item.observaciones || '—'}
                    </td>

                    {/* Monto */}
                    <td className={`py-3 px-4 text-right font-mono font-extrabold text-sm ${
                      esIngreso ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {esIngreso ? '+' : '-'}${Number(item.monto).toLocaleString('es-AR')}
                    </td>

                    {/* Acción */}
                    <td className="py-3 px-3 text-center">
                      <Tooltip text="Eliminar este registro" position="left">
                        <button
                          type="button"
                          onClick={() => onDeleteRegistro && onDeleteRegistro(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          aria-label="Eliminar registro"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                )
              })}
            </tbody>

            {/* Footer Summary */}
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-800 font-nunito font-extrabold text-xs">
                <td colSpan={4} className="py-3.5 px-4 text-slate-700 dark:text-slate-300 text-right uppercase tracking-wider">
                  Balance Neto Total Buffet:
                </td>
                <td className={`py-3.5 px-4 text-right font-mono font-extrabold text-sm ${
                  balanceNeto >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  ${balanceNeto.toLocaleString('es-AR')}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <div className="bg-gray-50 dark:bg-slate-950 px-6 py-3.5 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 no-print transition-colors">
            {/* Left: Rows selector & Summary */}
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
                    aria-label="Cantidad de registros por página"
                    className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg pl-3 pr-7 py-1.5 shadow-2xs focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
                  >
                    <option value={5}>5 por página</option>
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Mostrando <span className="font-bold text-slate-800 dark:text-slate-100">{startIndex + 1} - {endIndex}</span> de <span className="font-bold text-slate-800 dark:text-slate-100">{totalItems}</span> movimientos
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
    </div>
  )
}
