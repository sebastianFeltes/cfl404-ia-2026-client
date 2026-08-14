import React from 'react'
import { Inbox, Plus, Eye, Pencil, Trash2, BookOpen } from 'lucide-react'
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

function InstructoresDataTable({ 
  instructores = [], 
  loading = false, 
  onView, 
  onEdit, 
  onDelete,
  onResetFilters,
  onAddInstructor,
  userRole
}) {
  const tableHeaders = [
    { label: 'Instructor', align: 'left', width: 'w-[30%]' },
    { label: 'DNI', align: 'left', width: 'w-[14%]' },
    { label: 'Email Institucional', align: 'left', width: 'w-[24%]' },
    { label: 'Teléfono', align: 'left', width: 'w-[14%]' },
    { label: 'Cursos Asignados', align: 'left', width: 'w-[10%]' },
    { label: 'Acciones', align: 'center', width: 'w-[8%]' }
  ]

  const skeletonRows = Array(5).fill(null)
  const canEdit = userRole === 'director'
  const canDelete = userRole === 'director'
  const canCreate = userRole === 'director'

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden font-roboto transition-colors">
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed text-left" aria-label="Tabla de instructores">
          <thead>
            <tr className="bg-custom-gris-oscuro dark:bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
              {tableHeaders.map((header, index) => (
                <th 
                  key={index} 
                  scope="col"
                  className={`p-4 ${header.width} border-b border-custom-gris-claro/20 dark:border-slate-800 ${
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
            {!loading && instructores.length > 0 && 
              instructores.map((instructor) => (
                <tr 
                  key={instructor.id} 
                  className="hover:bg-custom-celeste/5 dark:hover:bg-slate-800/60 transition-colors duration-150 text-custom-gris-oscuro dark:text-slate-200"
                >
                  {/* Photo and Name with Status Border */}
                  <td className="p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Tooltip text={getStatusTooltip(instructor.status_id)} position="top">
                        {instructor.profile_photo_url ? (
                          <img 
                            src={instructor.profile_photo_url} 
                            alt={`Foto de ${instructor.first_name}`}
                            className={`h-10 w-10 rounded-full object-cover shadow-xs shrink-0 ${getStatusBorder(instructor.status_id)}`}
                          />
                        ) : (
                          <div className={`h-10 w-10 rounded-full bg-custom-azul-oscuro/10 dark:bg-custom-azul-oscuro/30 text-custom-azul-oscuro dark:text-custom-celeste flex items-center justify-center font-bold font-nunito shadow-xs shrink-0 ${getStatusBorder(instructor.status_id)}`}>
                            {instructor.first_name[0]}{instructor.last_name[0]}
                          </div>
                        )}
                      </Tooltip>
                      <div className="min-w-0 flex-1">
                        <div 
                          className="font-bold text-custom-gris-oscuro dark:text-slate-100 font-nunito hover:text-custom-azul-oscuro dark:hover:text-custom-celeste cursor-pointer transition-colors truncate"
                          onClick={() => onView && onView(instructor.id)}
                          title={`${instructor.first_name} ${instructor.last_name}`}
                        >
                          {instructor.first_name} {instructor.last_name}
                        </div>
                        <div className="text-xs text-custom-gris-claro dark:text-slate-400 truncate">
                          ID: #{instructor.id} {instructor.specialty ? `• ${instructor.specialty}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DNI */}
                  <td className="p-4 text-custom-gris-oscuro dark:text-slate-300 font-mono text-xs truncate">
                    {instructor.dni}
                  </td>

                  {/* Email */}
                  <td className="p-4 text-custom-gris-claro dark:text-slate-400 text-xs truncate" title={instructor.email}>
                    {instructor.email}
                  </td>

                  {/* Teléfono */}
                  <td className="p-4 text-custom-gris-claro dark:text-slate-400 text-xs truncate font-mono">
                    {instructor.phone || 'Sin registrar'}
                  </td>

                  {/* Cursos Asignados */}
                  <td className="p-4">
                    <div className="min-w-0">
                      <div className="font-semibold text-custom-azul-oscuro dark:text-custom-celeste text-xs flex items-center gap-1 truncate" title={instructor.course_name || 'Sin curso asignado'}>
                        <BookOpen className="h-3.5 w-3.5 text-custom-celeste shrink-0" />
                        <span className="truncate">{instructor.course_name || 'Sin curso asignado'}</span>
                      </div>
                      <div className="text-[10px] text-custom-gris-claro dark:text-slate-400 truncate">
                        Desde: {instructor.hire_date || instructor.enrollment_date || 'N/D'}
                      </div>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="p-4 no-print text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* Ver */}
                      <Tooltip text="Ver detalle" position="top">
                        <button
                          onClick={() => onView && onView(instructor.id)}
                          className="p-1.5 text-custom-celeste hover:text-custom-azul-oscuro dark:hover:text-custom-celeste hover:bg-custom-celeste/10 rounded-lg transition-all duration-150 cursor-pointer"
                          aria-label={`Ver detalle del instructor ${instructor.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </Tooltip>

                      {/* Editar (Solo Director) */}
                      {canEdit && (
                        <Tooltip text="Editar" position="top">
                          <button
                            onClick={() => onEdit && onEdit(instructor.id)}
                            className="p-1.5 text-custom-gris-claro dark:text-slate-400 hover:text-custom-gris-oscuro dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 cursor-pointer"
                            aria-label={`Editar instructor ${instructor.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      )}

                      {/* Eliminar (Solo Director) */}
                      {canDelete && (
                        <Tooltip text="Dar de baja" position="top">
                          <button
                            onClick={() => onDelete && onDelete(instructor.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all duration-150 cursor-pointer"
                            aria-label={`Eliminar instructor ${instructor.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
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
            {canCreate && (
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

      {/* Footer Info */}
      {!loading && instructores.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-950 px-6 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-custom-gris-claro dark:text-slate-400 font-semibold">
          <div>
            Mostrando <span className="text-custom-gris-oscuro dark:text-slate-200 font-bold">{instructores.length}</span> docentes
          </div>
          <div>
            Centro de Formación Laboral N°404 — Berisso
          </div>
        </div>
      )}
    </div>
  )
}

export default InstructoresDataTable
