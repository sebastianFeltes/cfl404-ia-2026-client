import React from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import Tooltip from './Tooltip'

/**
 * ActionButtons — botones de acción por fila de alumno.
 *
 * Permisos por rol (RBAC):
 *   director   → Ver · Editar · Eliminar  (todo visible)
 *   secretaria → Ver · Editar              (Eliminar OCULTO)
 *   docente    → Ver                       (Editar y Eliminar OCULTOS)
 *
 * Los botones sin permiso se OCULTAN completamente (no se deshabilitan),
 * manteniendo la armonía visual de la fila.
 */
function ActionButtons({ studentId, onView, onEdit, onDelete, userRole }) {
  const canEdit   = userRole === 'director' || userRole === 'secretaria'
  const canDelete = userRole === 'director'

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Acciones del alumno">

      {/* ── Ver / Visualizar Detalle — visible para todos los roles ── */}
      <Tooltip text="Ver detalle del alumno" position="top">
        <button
          onClick={() => onView && onView(studentId)}
          className="p-1.5 text-custom-celeste hover:text-custom-azul-oscuro hover:bg-custom-celeste/10 rounded-lg transition-all duration-150 cursor-pointer"
          aria-label={`Ver detalle del alumno ${studentId}`}
        >
          <Eye className="h-4 w-4" />
        </button>
      </Tooltip>

      {/* ── Editar — visible solo para Director y Secretaria ── */}
      {canEdit && (
        <Tooltip text="Editar registro" position="top">
          <button
            onClick={() => onEdit && onEdit(studentId)}
            className="p-1.5 text-custom-gris-claro hover:text-custom-gris-oscuro hover:bg-gray-100 rounded-lg transition-all duration-150 cursor-pointer"
            aria-label={`Editar alumno ${studentId}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </Tooltip>
      )}

      {/* ── Eliminar — visible solo para Director ── */}
      {canDelete && (
        <Tooltip text="Eliminar registro" position="top">
          <button
            onClick={() => onDelete && onDelete(studentId)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer"
            aria-label={`Eliminar alumno ${studentId}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </Tooltip>
      )}
    </div>
  )
}

export default ActionButtons
