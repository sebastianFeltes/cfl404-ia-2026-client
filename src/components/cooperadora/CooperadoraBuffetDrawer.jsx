import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Save, DollarSign, Calendar, FileText, AlertCircle, ShoppingBag, ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react'
import Tooltip from '../Tooltip'

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

  if (!isOpen) return null

  const drawerContent = (
    <div className="fixed inset-0 z-[100] pointer-events-none font-roboto">
      {/* Full screen Backdrop overlay with blur */}
      <div
        className={`fixed inset-0 z-[100] bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer slide-over container */}
      <section
        className={`fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-custom-gris-claro/10 dark:border-slate-800 flex flex-col h-full transition-transform duration-300 ease-in-out transform pointer-events-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-labelledby="buffet-drawer-title"
        aria-hidden={!isOpen}
      >
        {/* Header with theme colors */}
        <div className="p-6 bg-slate-900 dark:bg-slate-900 text-white relative shrink-0 border-b border-slate-800">
          <div className="absolute top-4 right-4">
            <Tooltip text="Cerrar formulario" position="left">
              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar formulario de buffet"
              >
                <X className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <div className="p-2.5 bg-custom-azul-oscuro rounded-lg text-white shadow-md">
              <ShoppingBag className="h-5 w-5 text-custom-amarillo" />
            </div>
            <div>
              <h2 id="buffet-drawer-title" className="font-nunito font-extrabold text-lg leading-tight text-white">
                Nuevo Registro de Buffet
              </h2>
              <p className="text-xs text-custom-gris-claro dark:text-slate-400 font-semibold mt-0.5">
                Ingresos o gastos de la cantina institucional
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body with vertical fill */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between space-y-6 text-xs">
          <div className="space-y-4">
            {formError && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form id="form-buffet" onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo de Movimiento (Ingreso vs Gasto) */}
              <div>
                <label className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1.5">
                  Tipo de Registro <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                    formData.tipo === 'ingreso'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="tipo"
                      value="ingreso"
                      checked={formData.tipo === 'ingreso'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>+ Ingreso / Venta</span>
                  </label>

                  <label className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                    formData.tipo === 'egreso'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="tipo"
                      value="egreso"
                      checked={formData.tipo === 'egreso'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <ArrowUpRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>- Gasto / Insumo</span>
                  </label>
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label htmlFor="buffet-fecha" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Fecha del Movimiento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    id="buffet-fecha"
                    name="fecha"
                    required
                    value={formData.fecha}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer"
                  />
                </div>
              </div>

              {/* Monto */}
              <div>
                <label htmlFor="buffet-monto" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Monto ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    id="buffet-monto"
                    name="monto"
                    min="1"
                    step="100"
                    required
                    value={formData.monto}
                    onChange={handleChange}
                    placeholder="15000"
                    className="w-full pl-8 pr-3 py-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-mono font-bold text-sm focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste"
                  />
                </div>
              </div>

              {/* Detalle */}
              <div>
                <label htmlFor="buffet-detalle" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Detalle / Concepto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="buffet-detalle"
                  name="detalle"
                  required
                  value={formData.detalle}
                  onChange={handleChange}
                  placeholder="Ej. Venta de café y medialunas turno mañana"
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label htmlFor="buffet-observaciones" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Observaciones adicionales (opcional)
                </label>
                <textarea
                  id="buffet-observaciones"
                  name="observaciones"
                  rows={3}
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Comentarios adicionales o número de ticket/factura..."
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste resize-none"
                />
              </div>
            </form>
          </div>

          {/* Movement Preview Box */}
          <div className={`p-4 rounded-2xl border transition-colors ${
            esIngreso
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold uppercase tracking-wider text-[10px] ${
                esIngreso ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
              }`}>
                Impacto en Caja Buffet:
              </span>
              <span className={`font-mono font-extrabold text-base ${
                esIngreso ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'
              }`}>
                {formData.monto ? (esIngreso ? '+' : '-') + '$' + Number(formData.monto).toLocaleString('es-AR') : '$0'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {formData.detalle ? formData.detalle : 'Completá el detalle para registrar el movimiento.'}
            </p>
          </div>
        </div>

        {/* Footer with Submit button */}
        <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <Tooltip text="Cancelar y cerrar" position="top">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-custom-gris-claro/30 dark:border-slate-700 text-custom-gris-oscuro dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
          </Tooltip>

          <Tooltip text="Registrar movimiento en la caja del buffet" position="top">
            <button
              type="submit"
              form="form-buffet"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 text-custom-amarillo animate-spin" />
              ) : (
                <Save className="h-4 w-4 text-custom-amarillo" />
              )}
              {isSubmitting ? 'Guardando...' : 'Guardar Movimiento'}
            </button>
          </Tooltip>
        </div>
      </section>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(drawerContent, document.body)
}
