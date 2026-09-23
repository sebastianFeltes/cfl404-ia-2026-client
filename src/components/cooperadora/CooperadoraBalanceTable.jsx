import React from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  GraduationCap,
  DollarSign,
  Trash2,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react'
import Tooltip from '../Tooltip'

export default function CooperadoraBalanceTable({
  entries = [],
  loading = false,
  onDeleteEntry,
}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-custom-gris-claro/10 dark:border-slate-800 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-custom-azul-oscuro dark:border-custom-celeste border-t-transparent mb-3" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 font-nunito">
          Cargando libro de balance contable…
        </p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-custom-gris-claro/10 dark:border-slate-800 p-12 text-center space-y-4">
        <FileSpreadsheet className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
        <div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 font-nunito">
            No hay movimientos registrados en este ciclo
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Los cobros de cuotas de alumnos, ventas y compras del buffet, y los gastos o donaciones se reflejarán aquí automáticamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-custom-gris-claro/10 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-roboto">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] font-bold text-slate-500 dark:text-slate-400 font-nunito">
            <tr>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">Fecha</th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">Origen</th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">Tipo</th>
              <th scope="col" className="px-4 py-3.5 min-w-[220px]">Detalle / Concepto</th>
              <th scope="col" className="px-4 py-3.5 text-right whitespace-nowrap">Ingreso ($)</th>
              <th scope="col" className="px-4 py-3.5 text-right whitespace-nowrap">Egreso ($)</th>
              <th scope="col" className="px-4 py-3.5 text-right whitespace-nowrap">Saldo Acumulado</th>
              <th scope="col" className="px-4 py-3.5 text-center whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {entries.map((e) => {
              const isIngreso = e.tipo === 'ingreso'
              const isBuffet = e.origen === 'buffet'

              return (
                <tr
                  key={e.id}
                  className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Fecha */}
                  <td className="px-4 py-3 font-mono font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {e.fecha || '—'}
                  </td>

                  {/* Origen */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isBuffet ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                        <ShoppingBag className="h-3 w-3" />
                        Buffet
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-300/40">
                        <GraduationCap className="h-3 w-3" />
                        Cooperadora
                      </span>
                    )}
                  </td>

                  {/* Tipo */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isIngreso ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <ArrowDownLeft className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        Ingreso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                        <ArrowUpRight className="h-3 w-3 text-red-600 dark:text-red-400" />
                        Egreso
                      </span>
                    )}
                  </td>

                  {/* Detalle */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">
                      {e.detalle}
                    </div>
                    {e.observaciones && (
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                        {e.observaciones}
                      </div>
                    )}
                  </td>

                  {/* Ingreso */}
                  <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">
                    {e.ingreso > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        +${e.ingreso.toLocaleString('es-AR')}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>

                  {/* Egreso */}
                  <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">
                    {e.egreso > 0 ? (
                      <span className="text-red-600 dark:text-red-400">
                        -${e.egreso.toLocaleString('es-AR')}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>

                  {/* Saldo Acumulado */}
                  <td className="px-4 py-3 text-right font-mono font-extrabold whitespace-nowrap">
                    <span
                      className={
                        (e.saldoAcumulado || 0) >= 0
                          ? 'text-custom-azul-oscuro dark:text-custom-celeste'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      ${(e.saldoAcumulado || 0).toLocaleString('es-AR')}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {e.canDelete && onDeleteEntry ? (
                      <Tooltip text="Eliminar movimiento" position="left">
                        <button
                          type="button"
                          onClick={() => onDeleteEntry(e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Eliminar movimiento ${e.detalle}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    ) : (
                      <span className="text-[11px] text-slate-300 dark:text-slate-600 font-mono">
                        {e.categoria === 'cuota' ? 'En Cuotas' : '—'}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
