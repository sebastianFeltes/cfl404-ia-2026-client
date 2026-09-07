import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, UserMinus, X } from 'lucide-react'
import Tooltip from '../Tooltip'

function CourseDeleteModal({ course, isOpen, onClose, onConfirm }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !course) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-roboto">
      <div
        className="fixed inset-0 bg-custom-gris-oscuro/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-custom-gris-claro/10 dark:border-slate-800 max-w-md w-full overflow-hidden relative z-10 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-delete-title"
      >
        <div className="absolute top-4 right-4">
          <Tooltip text="Cerrar diálogo" position="left">
            <button
              onClick={onClose}
              className="text-custom-gris-claro dark:text-slate-400 hover:text-custom-gris-oscuro dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar confirmación"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </Tooltip>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3.5 text-red-600 dark:text-red-400 mb-4">
            <div className="p-2 bg-red-50 dark:bg-red-950/50 rounded-lg">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 id="course-delete-title" className="font-nunito font-extrabold text-lg text-custom-gris-oscuro dark:text-slate-100 leading-tight">
              ¿Dar de baja el curso?
            </h3>
          </div>

          <p className="text-xs text-custom-gris-claro dark:text-slate-400 font-medium leading-relaxed">
            Estás por dar de baja el curso. Pasará a estado inactivo y dejará de figurar en la oferta activa:
          </p>

          <div className="my-3 p-3 bg-red-50/50 dark:bg-red-950/30 rounded-lg border border-red-100 dark:border-red-900/50">
            <p className="text-sm font-extrabold text-custom-gris-oscuro dark:text-slate-100">
              {course.name}
            </p>
            <p className="text-[11px] text-custom-azul-oscuro dark:text-custom-celeste font-bold mt-0.5">
              Familia: {course.family?.name || course.category || 'Sin familia'}
            </p>
          </div>

          <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-2">
            * El registro se conserva. Podés reactivarlo después editando el estado.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-950 px-6 py-4 flex items-center gap-3 justify-end border-t border-gray-100 dark:border-slate-800">
          <Tooltip text="Cancelar y mantener el curso" position="top">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-custom-gris-claro/30 dark:border-slate-700 text-custom-gris-oscuro dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </Tooltip>

          <Tooltip text="Confirmar baja del curso" position="top">
            <button
              onClick={() => onConfirm(course.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <UserMinus className="h-4 w-4" />
              Confirmar baja
            </button>
          </Tooltip>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CourseDeleteModal
