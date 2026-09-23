import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

function DeleteConfirmationModal({ student, isOpen, onClose, onConfirm }) {
  if (!isOpen || !student) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-roboto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-custom-gris-claro/10 dark:border-slate-800 max-w-md w-full overflow-hidden relative z-10 animate-scale-up transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
          aria-label="Cerrar confirmación"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal content body */}
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
            <div className="p-2.5 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/40">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 id="modal-title" className="font-nunito font-extrabold text-lg text-slate-900 dark:text-slate-100 leading-tight">
                Confirmar Baja
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-nunito mt-0.5">
                Desvinculación del registro en el sistema
              </p>
            </div>
          </div>

          <p className="text-xs text-custom-gris-claro dark:text-slate-400 font-medium leading-relaxed font-nunito">
            Estás por dar de baja el registro de:
          </p>
          
          <div className="my-3 p-3.5 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/40">
            <p className="text-sm font-nunito font-extrabold text-slate-900 dark:text-slate-100">
              {student.first_name} {student.last_name}
            </p>
            <p className="text-[11px] text-custom-gris-claro dark:text-slate-400 font-bold font-mono mt-0.5">
              DNI: {student.dni || '—'} | ID: #{student.id}
            </p>
          </div>

          <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-2 font-nunito">
            * Esta acción dará de baja al alumno y lo desvinculará de las listas de asistencia activas.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50/70 dark:bg-slate-950 px-6 py-4 flex items-center gap-3 justify-end border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-nunito font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            onClick={() => onConfirm(student.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-nunito font-bold shadow-xs transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Confirmar Baja
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
