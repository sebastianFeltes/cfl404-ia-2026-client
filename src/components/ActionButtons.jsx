import { Eye, Pencil, Trash2, UserCheck } from 'lucide-react'
import Tooltip from './Tooltip'

/**
 * ActionButtons — botones de acción por fila de alumno / postulante.
 *
 * Permisos por rol (RBAC):
 *   director   → Ver · Editar · Eliminar · Matricular (todo visible)
 *   secretaria → Ver · Editar · Matricular            (Eliminar OCULTO)
 *   docente    → Ver                                  (Editar y Eliminar OCULTOS)
 */
function ActionButtons({ studentId, onView, onEdit, onDelete, onPromote, isPostulante = false, userRole }) {
  const canEdit   = userRole === 'director' || userRole === 'secretaria'
  const canDelete = userRole === 'director'

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Acciones del registro">

      {/* ── Ver / Visualizar Detalle — visible para todos los roles ── */}
      <Tooltip text={isPostulante ? "Ver ficha de postulación" : "Ver detalle del alumno"} position="top">
        <button
          onClick={() => onView && onView(studentId)}
          className="p-1.5 text-custom-celeste hover:text-custom-azul-oscuro hover:bg-custom-celeste/10 rounded-lg transition-all duration-150 cursor-pointer"
          aria-label={`Ver detalle ${studentId}`}
        >
          <Eye className="h-4 w-4" />
        </button>
      </Tooltip>

      {/* ── Matricular como Alumno (Solo para Postulantes) ── */}
      {isPostulante && canEdit && onPromote && (
        <Tooltip text="Aprobar documentación y Matricular como Alumno" position="top">
          <button
            onClick={() => onPromote(studentId)}
            className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-all duration-150 cursor-pointer"
            aria-label={`Matricular como alumno regular a ${studentId}`}
          >
            <UserCheck className="h-4 w-4" />
          </button>
        </Tooltip>
      )}

      {/* ── Editar — visible solo para Director y Secretaria ── */}
      {canEdit && (
        <Tooltip text="Editar registro" position="top">
          <button
            onClick={() => onEdit && onEdit(studentId)}
            className="p-1.5 text-custom-gris-claro hover:text-custom-gris-oscuro hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 cursor-pointer"
            aria-label={`Editar ${studentId}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </Tooltip>
      )}

      {/* ── Eliminar — visible solo para Director ── */}
      {canDelete && (
        <Tooltip text={isPostulante ? "Descartar postulación" : "Eliminar registro"} position="top">
          <button
            onClick={() => onDelete && onDelete(studentId)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all duration-150 cursor-pointer"
            aria-label={`Eliminar ${studentId}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </Tooltip>
      )}
    </div>
  )
}

export default ActionButtons
