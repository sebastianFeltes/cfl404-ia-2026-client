// Archivo: src/components/cooperadora/CooperadoraBuffetDrawer.jsx
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Save,
  DollarSign,
  Calendar,
  FileText,
  AlertCircle,
  ShoppingBag,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'

const INITIAL_BUFFET_STATE = {
  fecha: new Date().toISOString().split('T')[0],
  monto: '',
  tipo: 'ingreso', // ingreso | egreso
  detalle: '',
  observaciones: '',
}

export default function CooperadoraBuffetDrawer({
  isOpen,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(INITIAL_BUFFET_STATE)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...INITIAL_BUFFET_STATE,
        fecha: new Date().toISOString().split('T')[0],
      })
      setFormError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.monto || Number(formData.monto) <= 0) {
      setFormError('Por favor ingresá un monto numérico mayor a 0.')
      return
    }
    if (!formData.detalle.trim()) {
      setFormError('Por favor completá el detalle o concepto del movimiento.')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      await onSave({
        fecha: formData.fecha,
        monto: Number(formData.monto),
        tipo: formData.tipo,
        detalle: formData.detalle.trim(),
        observaciones: formData.observaciones.trim(),
      })
      onClose()
    } catch (err) {
      setFormError(err.message || 'Error al registrar el movimiento de buffet')
    } finally {
      setIsSubmitting(false)
    }
  }

  const esIngreso = formData.tipo === 'ingreso'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay coincidente con InstructorDrawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm"
          />

          {/* Panel coincidente con InstructorDrawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[460px] max-w-full z-50 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200 font-nunito"
            aria-label="Panel de Buffet"
          >
            {/* Cabecera coincidente con InstructorDrawer */}
            <div className="bg-white dark:bg-slate-900 px-8 pt-8 pb-5 border-b border-slate-100 dark:border-slate-800/80 relative shrink-0">
              <button
                onClick={onClose}
                title="Cerrar panel"
                aria-label="Cerrar"
                className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-1 transition-all focus:outline-none cursor-pointer"
              >
                <X size={20} strokeWidth={2} />
              </button>

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xs shrink-0 border ${
                  esIngreso
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400'
                }`}>
                  <ShoppingBag size={24} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 font-roboto leading-tight">
                    Movimiento de Buffet
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-nunito mt-0.5">
                    Ingresos por ventas o gastos de la cantina institucional
                  </p>
                </div>
              </div>

              {/* Selector de Tipo (Ingreso vs Egreso) coincidente con InstructorDrawer */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg mt-5 border border-slate-200/60 dark:border-slate-700/60 gap-1">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, tipo: 'ingreso' }))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium font-nunito transition-all cursor-pointer ${
                    formData.tipo === 'ingreso'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <ArrowDownLeft size={15} />
                  <span>+ Ingreso / Venta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, tipo: 'egreso' }))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium font-nunito transition-all cursor-pointer ${
                    formData.tipo === 'egreso'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <ArrowUpRight size={15} />
                  <span>- Gasto / Insumo</span>
                </button>
              </div>
            </div>

            {/* Contenido con scroll coincidente con InstructorDrawer */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 font-nunito space-y-4 pt-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form id="form-buffet" onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Datos del Registro
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="buffet-fecha" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Fecha
                    </label>
                    <input
                      type="date"
                      id="buffet-fecha"
                      name="fecha"
                      required
                      value={formData.fecha}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#166193] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="buffet-monto" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Monto ($)
                    </label>
                    <input
                      type="number"
                      id="buffet-monto"
                      name="monto"
                      min="1"
                      step="any"
                      required
                      value={formData.monto}
                      onChange={handleChange}
                      placeholder="15000"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#166193]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="buffet-detalle" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    Detalle / Concepto
                  </label>
                  <input
                    type="text"
                    id="buffet-detalle"
                    name="detalle"
                    required
                    value={formData.detalle}
                    onChange={handleChange}
                    placeholder="Ej. Venta de café y medialunas turno mañana"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#166193]"
                  />
                </div>

                <div>
                  <label htmlFor="buffet-observaciones" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    Observaciones adicionales (opcional)
                  </label>
                  <textarea
                    id="buffet-observaciones"
                    name="observaciones"
                    rows={3}
                    value={formData.observaciones}
                    onChange={handleChange}
                    placeholder="Comentarios adicionales o número de ticket/factura..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#166193] resize-none"
                  />
                </div>

                {/* Box Preview */}
                <div className={`p-3.5 rounded-lg border flex items-center justify-between text-xs ${
                  esIngreso
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                }`}>
                  <span className={`font-semibold uppercase tracking-wider text-[11px] ${
                    esIngreso ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    Impacto en Caja Buffet:
                  </span>
                  <span className={`font-mono font-bold text-sm ${
                    esIngreso ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'
                  }`}>
                    {formData.monto ? (esIngreso ? '+' : '-') + '$' + Number(formData.monto).toLocaleString('es-AR') : '$0'}
                  </span>
                </div>
              </form>
            </div>

            {/* Footer con botones coincidentes con InstructorDrawer */}
            <div className="px-8 py-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 shrink-0 font-nunito">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-9 px-4 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="form-buffet"
                disabled={isSubmitting}
                className="h-9 px-5 flex items-center justify-center gap-2 rounded-lg bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white text-xs font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} strokeWidth={2} />
                )}
                Guardar Movimiento
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
