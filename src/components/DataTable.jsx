import React from 'react'
import BadgeStatus from './BadgeStatus'
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
  userRole
}) {
  const tableHeaders = [
    { label: 'Alumno', align: 'left' },
    { label: 'DNI', align: 'left' },
    { label: 'Email', align: 'left' },
    { label: 'Teléfono', align: 'left' },
    { label: 'Rol', align: 'left' },
    { label: 'Estado', align: 'center' },
    { label: 'Inscrito (Curso)', align: 'left' },
    { label: 'Acciones', align: 'center' }
  ]

  const skeletonRows = Array(6).fill(null)
  const canCreate = userRole === 'director' || userRole === 'secretaria'

  return (
    <div className="w-full bg-white rounded-xl shadow-xs border border-custom-gris-claro/10 overflow-hidden font-roboto">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left" aria-label="Tabla de estudiantes">
          <thead>
            <tr className="bg-custom-gris-oscuro text-white text-xs font-bold uppercase tracking-wider">
              {tableHeaders.map((header, index) => (
                <th 
                  key={index} 
                  scope="col"
                  className={`p-4 border-b border-custom-gris-claro/20 ${
                    header.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium">
            {/* Loading State */}
            {loading && 
              skeletonRows.map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse hover:bg-gray-50/50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                    </div>
                  </td>
                  <td className="p-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-28 bg-gray-200 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                  <td className="p-4 text-center">
                    <div className="h-6 w-20 bg-gray-200 rounded-full mx-auto" />
                  </td>
                  <td className="p-4"><div className="h-4 w-36 bg-gray-200 rounded" /></td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                      <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                      <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            }

            {/* Data Success State */}
            {!loading && students.length > 0 && 
              students.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-custom-celeste/5 transition-colors duration-150 text-custom-gris-oscuro"
                >
                  {/* Photo and Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {student.profile_photo_url ? (
                        <img 
                          src={student.profile_photo_url} 
                          alt={`Foto de perfil de ${student.first_name}`}
                          className="h-10 w-10 rounded-full object-cover border border-custom-celeste/30"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-custom-azul-oscuro/10 text-custom-azul-oscuro flex items-center justify-center font-bold font-nunito border border-custom-azul-oscuro/20">
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-custom-gris-oscuro font-nunito">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-xs text-custom-gris-claro">
                          ID: #{student.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* DNI */}
                  <td className="p-4 text-custom-gris-oscuro font-mono text-xs">
                    {student.dni}
                  </td>
                  {/* Email */}
                  <td className="p-4 text-custom-gris-claro text-xs">
                    {student.email}
                  </td>
                  {/* Teléfono */}
                  <td className="p-4 text-custom-gris-claro text-xs">
                    {student.phone || 'Sin teléfono'}
                  </td>
                  {/* Rol */}
                  <td className="p-4">
                    <span className="text-xs font-semibold text-custom-gris-oscuro bg-gray-100 px-2 py-0.5 rounded">
                      {student.role_name}
                    </span>
                  </td>
                  {/* Estado */}
                  <td className="p-4 text-center">
                    <BadgeStatus status={student.status_id} />
                  </td>
                  {/* Curso Inscrito */}
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-custom-azul-oscuro text-xs">
                        {student.course_name || 'Sin curso'}
                      </div>
                      <div className="text-[10px] text-custom-gris-claro">
                        Desde: {student.enrollment_date || 'N/D'}
                      </div>
                    </div>
                  </td>
                  {/* Acciones */}
                  <td className="p-4">
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
        <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50/50">
          <div className="p-4 bg-gray-100 rounded-full text-custom-gris-claro/60 mb-4 shadow-inner">
            <Inbox className="h-12 w-12" aria-hidden="true" />
          </div>
          <h3 className="font-nunito font-extrabold text-lg text-custom-gris-oscuro mb-1">
            No se encontraron alumnos
          </h3>
          <p className="text-sm text-custom-gris-claro max-w-sm mb-6">
            No hay registros que coincidan con los criterios de búsqueda actuales. Intenta cambiar los filtros o registra uno nuevo.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onResetFilters}
              className="px-4 py-2 border border-custom-gris-claro/30 text-custom-gris-oscuro rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
            {canCreate && (
              <button
                onClick={onAddStudent}
                className="px-4 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Nuevo Alumno
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      {!loading && students.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-custom-gris-claro font-semibold">
          <div>
            Mostrando <span className="text-custom-gris-oscuro font-bold">{students.length}</span> alumnos
          </div>
          <div>
            Centro de Formación Laboral N°404
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
