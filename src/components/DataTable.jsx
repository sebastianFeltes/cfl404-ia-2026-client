import React from 'react'
import StudentAvatar from './StudentAvatar'
import ActionButtons from './ActionButtons'
import { Inbox, Plus } from 'lucide-react'

function DataTable({ 
  students = [], 
  loading = false, 
  onView, 
  onEdit, 
  onDelete,
  onResetFilters,
  onAddStudent,
  userRole = 'director',
  // Paginación
  paginaActual = 1,
  itemsPorPagina = 10,
  setPaginaActual,
  setItemsPorPagina,
  totalResultados = 0,
  isPrintMode = false
}) {
  const tableHeaders = [
    { label: 'Alumno', align: 'left', width: '28%' },
    { label: 'DNI', align: 'left', width: '13%' },
    { label: 'Email', align: 'left', width: '22%' },
    { label: 'Teléfono', align: 'left', width: '14%' },
    { label: 'Curso Inscrito', align: 'left', width: '15%' },
    { label: 'Acciones', align: 'center', width: '8%' }
  ]

  const skeletonRows = Array(6).fill(null)
  const canCreate = userRole === 'director' || userRole === 'secretaria'
  const totalPaginas = Math.ceil(totalResultados / itemsPorPagina) || 1

  return (
    <div className="w-full bg-white dark:bg-slate-900 overflow-hidden font-roboto transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left" aria-label="Tabla de estudiantes">
          <thead>
            {/* Cabecera con azul institucional #166193 */}
            <tr className="bg-[#166193] text-white text-[11px] font-bold uppercase tracking-wider">
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
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
            {/* Loading Skeleton */}
            {loading && 
              skeletonRows.map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 flex items-center gap-3">
                    <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
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
              students.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors duration-150 text-slate-800 dark:text-slate-200"
                >
                  {/* Foto de perfil con anillo de estado y Nombre */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="cursor-pointer"
                        onClick={() => onView && onView(student.id)}
                        title={`Ver detalle de ${student.first_name} ${student.last_name}`}
                      >
                        <StudentAvatar 
                          src={student.profile_photo_url} 
                          nombre={student.first_name} 
                          apellido={student.last_name} 
                          estado={student.status_id} 
                          size="sm" 
                        />
                      </div>
                      <div 
                        className="min-w-0 cursor-pointer"
                        onClick={() => onView && onView(student.id)}
                      >
                        <div className="font-bold text-slate-900 dark:text-slate-100 font-nunito hover:text-[#166193] dark:hover:text-[#37A6DE] transition-colors truncate">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          ID: #{student.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DNI */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs tabular-nums">
                    {student.dni}
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs truncate max-w-[200px]" title={student.email}>
                    {student.email}
                  </td>

                  {/* Teléfono */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs font-mono tabular-nums">
                    {student.phone || '—'}
                  </td>

                  {/* Curso Asignado */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-[#166193] dark:text-[#37A6DE] text-xs">
                        {student.course_name || 'Sin curso asignado'}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        Inscripción: {student.enrollment_date || '—'}
                      </div>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4 text-center no-print">
                    <div className="flex justify-center">
                      <ActionButtons 
                        studentId={student.id}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        userRole={userRole}
                      />
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && students.length === 0 && (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-slate-50/40 dark:bg-slate-900/40">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-3 shadow-inner">
            <Inbox className="h-10 w-10" aria-hidden="true" />
          </div>
          <h3 className="font-nunito font-extrabold text-base text-slate-800 dark:text-slate-200 mb-1">
            No se encontraron alumnos
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 font-nunito">
            No hay registros que coincidan con los criterios de búsqueda o filtros actuales.
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetFilters}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
            {canCreate && (
              <button
                onClick={onAddStudent}
                className="px-3.5 py-1.5 bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-[#FDEA14]" />
                Nuevo Alumno
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer de Paginación Estilo Docentes (Sólo en pantalla) */}
      {!loading && totalResultados > 0 && !isPrintMode && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 no-print text-xs gap-3">
          
          {/* Selector de Items por Página */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Mostrar</span>
            <select
              value={itemsPorPagina}
              onChange={(e) => {
                setItemsPorPagina && setItemsPorPagina(Number(e.target.value))
                setPaginaActual && setPaginaActual(1)
              }}
              title="Cantidad de alumnos a mostrar por página"
              className="h-7 px-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>por página</span>
          </div>

          {/* Información y botones Anterior / Siguiente */}
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span>
              Mostrando <strong>{totalResultados === 0 ? 0 : (paginaActual - 1) * itemsPorPagina + 1}</strong> a{" "}
              <strong>{Math.min(paginaActual * itemsPorPagina, totalResultados)}</strong> de{" "}
              <strong>{totalResultados}</strong> resultados
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaginaActual && setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                title="Ir a la página anterior"
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual && setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                title="Ir a la página siguiente"
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
