import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

function DeleteConfirmationModal({ student, isOpen, onClose, onConfirm }) {
  if (!isOpen || !student) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-roboto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-custom-gris-oscuro/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div 
        className="bg-white rounded-xl shadow-2xl border border-custom-gris-claro/10 max-w-md w-full overflow-hidden relative z-10 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-custom-gris-claro hover:text-custom-gris-oscuro p-1 rounded-lg"
          aria-label="Cerrar confirmación"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal content body */}
        <div className="p-6">
          <div className="flex items-center gap-3.5 text-red-600 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 id="modal-title" className="font-nunito font-extrabold text-lg text-custom-gris-oscuro leading-tight">
              Confirmar Eliminación
            </h3>
          </div>

          <p className="text-xs text-custom-gris-claro font-medium leading-relaxed">
            Estás por eliminar de forma permanente el registro del alumno:
          </p>
          
          <div className="my-3 p-3 bg-red-50/50 rounded-lg border border-red-100">
            <p className="text-sm font-extrabold text-custom-gris-oscuro">
              {student.first_name} {student.last_name}
            </p>
            <p className="text-[11px] text-custom-gris-claro font-bold font-mono mt-0.5">
              DNI: {student.dni} | ID: #{student.id}
            </p>
          </div>

          <p className="text-xs text-red-600 font-semibold mt-2">
            * Esta acción no se puede deshacer y retirará al alumno de todos sus cursos activos.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center gap-3 justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-custom-gris-claro/30 text-custom-gris-oscuro hover:bg-gray-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            onClick={() => onConfirm(student.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Confirmar Eliminación
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
