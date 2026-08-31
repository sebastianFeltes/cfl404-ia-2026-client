import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Save, CheckCircle, Clock, Calendar, User, DollarSign, FileText, AlertCircle, Search, ChevronDown, Check, Trash2, Loader2 } from 'lucide-react'
import Tooltip from '../Tooltip'

export const MESES = [
  { id: 1, name: 'Enero', short: 'Ene' },
  { id: 2, name: 'Febrero', short: 'Feb' },
  { id: 3, name: 'Marzo', short: 'Mar' },
  { id: 4, name: 'Abril', short: 'Abr' },
  { id: 5, name: 'Mayo', short: 'May' },
  { id: 6, name: 'Junio', short: 'Jun' },
  { id: 7, name: 'Julio', short: 'Jul' },
  { id: 8, name: 'Agosto', short: 'Ago' },
  { id: 9, name: 'Septiembre', short: 'Sep' },
  { id: 10, name: 'Octubre', short: 'Oct' },
  { id: 11, name: 'Noviembre', short: 'Nov' },
  { id: 12, name: 'Diciembre', short: 'Dic' },
]

export default function CooperadoraPagoDrawer({
  student,
  isOpen,
  onClose,
  payments = {},
  onSavePayment,
  onDeletePayment,
  currentYear = new Date().getFullYear(),
  studentsList = [],
  onSelectStudent,
}) {
  const currentMonthIndex = new Date().getMonth() + 1
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex)
  const [amount, setAmount] = useState(2000)
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChangingStudent, setIsChangingStudent] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')

  const studentPayments = student ? (payments[student.id] || {}) : {}

  // Actualizar valores de monto y notas cuando se selecciona un mes
  const handleSelectMonth = (monthId) => {
    setSelectedMonth(monthId)
    const existingPago = studentPayments[monthId]
    if (existingPago?.pagado) {
      setAmount(existingPago.monto || 2000)
      setNotes(existingPago.notas || '')
    } else {
      setAmount(2000)
      setNotes('')
    }
    setFormError('')
  }

  // Reset form when student changes or drawer opens
  useEffect(() => {
    if (student && isOpen) {
      const currentStudentPayments = payments[student.id] || {}
      const firstUnpaid = MESES.find(m => !currentStudentPayments[m.id]?.pagado)?.id || currentMonthIndex
      setSelectedMonth(firstUnpaid)

      const existingPago = currentStudentPayments[firstUnpaid]
      if (existingPago?.pagado) {
        setAmount(existingPago.monto || 2000)
        setNotes(existingPago.notas || '')
      } else {
        setAmount(2000)
        setNotes('')
      }

      setFormError('')
      setIsChangingStudent(false)
      setStudentSearch('')
      setIsSubmitting(false)
    }
  }, [student, isOpen, payments, currentMonthIndex])

  if (!student && !isOpen) return null

  const totalPaidMonths = Object.keys(studentPayments).filter(m => studentPayments[m]?.pagado).length
  const totalPaidAmount = Object.values(studentPayments).reduce(
    (acc, p) => acc + (p?.pagado ? Number(p.monto || 0) : 0),
    0
  )

  const isSelectedMonthAlreadyPaid = Boolean(studentPayments[selectedMonth]?.pagado)
  const currentPaidRecord = studentPayments[selectedMonth]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) < 2000) {
      setFormError('El pago mínimo de cooperadora debe ser de $2.000.')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      await onSavePayment({
        studentId: student.id,
        month: Number(selectedMonth),
        amount: Number(amount),
        year: currentYear,
        date: new Date().toISOString().split('T')[0],
        notes: notes.trim(),
      })
    } catch (err) {
      setFormError(err.message || 'Error al guardar el pago de cooperadora')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!currentPaidRecord?.id) return
    if (!window.confirm(`¿Estás seguro de eliminar el pago del mes ${MESES.find(m => m.id === selectedMonth)?.name}?`)) {
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      await onDeletePayment(currentPaidRecord.id, student.id, selectedMonth)
      setAmount(2000)
      setNotes('')
    } catch (err) {
      setFormError(err.message || 'Error al eliminar el pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filtered students for dropdown
  const filteredStudents = studentsList.filter((s) => {
    const q = studentSearch.toLowerCase().trim()
    if (!q) return true
    return (
      (s.first_name && s.first_name.toLowerCase().includes(q)) ||
      (s.last_name && s.last_name.toLowerCase().includes(q)) ||
      (s.dni && s.dni.includes(q))
    )
  })

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
      {student && (
        <section
          className={`fixed inset-y-0 right-0 z-[101] w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-custom-gris-claro/10 dark:border-slate-800 flex flex-col h-full transition-transform duration-300 ease-in-out transform pointer-events-auto ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-labelledby="pago-drawer-title"
          aria-hidden={!isOpen}
        >
          {/* Header with student details & switcher */}
          <div className="p-6 bg-custom-azul-oscuro text-white relative shrink-0">
            <div className="absolute top-4 right-4">
              <Tooltip text="Cerrar panel" position="left">
                <button
                  onClick={onClose}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Cerrar panel de pagos"
                >
                  <X className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>

            <div className="flex items-start gap-3.5 mt-1">
              {student.profile_photo_url ? (
                <img
                  src={student.profile_photo_url}
                  alt={`${student.first_name} ${student.last_name}`}
                  className="h-14 w-14 rounded-full object-cover border-2 border-custom-celeste shadow-md shrink-0 mt-0.5"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-white/15 text-white flex items-center justify-center text-xl font-extrabold font-nunito border border-white/20 shrink-0 mt-0.5">
                  {student.first_name?.[0] || 'A'}{student.last_name?.[0] || 'L'}
                </div>
              )}

              <div className="min-w-0 flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <h2 id="pago-drawer-title" className="font-nunito font-extrabold text-xl leading-tight text-white truncate">
                    {student.first_name} {student.last_name}
                  </h2>
                  {studentsList.length > 1 && onSelectStudent && (
                    <button
                      type="button"
                      onClick={() => setIsChangingStudent(!isChangingStudent)}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer shrink-0"
                      title="Cambiar alumno seleccionado"
                    >
                      {isChangingStudent ? 'Ocultar lista' : 'Cambiar'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5 text-xs text-custom-celeste">
                  <span className="font-mono font-medium">DNI: {student.dni || 'Sin DNI'}</span>
                  <span>•</span>
                  <span className="truncate">{student.course_name || 'Sin curso asignado'}</span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white">
                    Ciclo Lectivo {currentYear}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {totalPaidMonths} / 12 cuotas abonadas
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Student Switcher Search Dropdown */}
            {isChangingStudent && (
              <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-white/10 space-y-2 animate-fade-in">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Buscar otro alumno por nombre o DNI…"
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-custom-celeste"
                    autoFocus
                  />
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {filteredStudents.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onSelectStudent(s)
                        setIsChangingStudent(false)
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        s.id === student.id
                          ? 'bg-custom-celeste/20 text-custom-celeste font-bold'
                          : 'hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="truncate">{s.first_name} {s.last_name}</span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{s.dni}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Body filling height */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

            {/* Resumen Anual de Pagos (Grid de 12 meses) */}
            <div className="space-y-3 shrink-0">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-custom-celeste" />
                  Historial de Cuotas {currentYear}
                </h3>
                <span className="text-xs font-extrabold text-custom-azul-oscuro dark:text-custom-celeste font-mono">
                  Total: ${totalPaidAmount.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {MESES.map((mes) => {
                  const pago = studentPayments[mes.id]
                  const estaPagado = Boolean(pago?.pagado)
                  const esMesSeleccionado = selectedMonth === mes.id

                  return (
                    <button
                      key={mes.id}
                      type="button"
                      onClick={() => handleSelectMonth(mes.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between min-h-[72px] ${
                        esMesSeleccionado
                          ? 'ring-2 ring-custom-azul-oscuro dark:ring-custom-celeste shadow-sm bg-custom-celeste/5 dark:bg-custom-celeste/10'
                          : ''
                      } ${
                        estaPagado
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300'
                          : 'bg-gray-50 dark:bg-slate-950 border-gray-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-nunito">{mes.short}</span>
                        {estaPagado ? (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                      <div>
                        {estaPagado ? (
                          <>
                            <p className="text-[11px] font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
                              ${Number(pago.monto).toLocaleString('es-AR')}
                            </p>
                            <p className="text-[9px] text-emerald-600/80 dark:text-emerald-400/70 truncate">
                              {pago.fecha ? new Date(pago.fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) : 'Registrado'}
                            </p>
                          </>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Formulario para Cargar / Actualizar Pago */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-custom-azul-oscuro dark:text-custom-celeste uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-custom-amarillo" />
                    Registrar Pago de Cuota ({MESES.find(m => m.id === selectedMonth)?.name})
                  </h4>
                  {isSelectedMonthAlreadyPaid && (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
                      Mes ya abonado (actualizará monto)
                    </span>
                  )}
                </div>

                {formError && (
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form id="form-cooperadora-pago" onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Selector de Mes */}
                    <div>
                      <label htmlFor="select-mes" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                        Mes a Registrar <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="select-mes"
                        value={selectedMonth}
                        onChange={(e) => handleSelectMonth(Number(e.target.value))}
                        className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer"
                      >
                        {MESES.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} {studentPayments[m.id]?.pagado ? '(Ya pagado)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Monto del Pago */}
                    <div>
                      <label htmlFor="input-monto" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                        Monto Abonado ($) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                        <input
                          type="number"
                          id="input-monto"
                          min="2000"
                          step="100"
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="2000"
                          className="w-full pl-7 pr-3 py-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-custom-gris-oscuro dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Observaciones / Notas */}
                  <div>
                    <label htmlFor="input-notas" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                      Observaciones / Comprobante (opcional)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <textarea
                        id="input-notas"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Transferencia bancaria #48192 o pago en efectivo en secretaría..."
                        className="w-full pl-9 pr-3 py-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste resize-none"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Quick Summary Pill */}
              <div className="p-3 rounded-xl bg-custom-celeste/10 dark:bg-custom-celeste/15 border border-custom-celeste/20 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-custom-celeste shrink-0" />
                  <span className="font-medium text-custom-azul-oscuro dark:text-custom-celeste">
                    Cuota {MESES.find(m => m.id === selectedMonth)?.name}:
                  </span>
                </div>
                <span className="font-mono font-extrabold text-custom-azul-oscuro dark:text-custom-celeste text-sm">
                  ${Number(amount || 0).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div>
              {isSelectedMonthAlreadyPaid && onDeletePayment && (
                <Tooltip text="Anular / Eliminar este pago del alumno" position="top">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar Pago
                  </button>
                </Tooltip>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Tooltip text="Cerrar sin guardar" position="top">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-custom-gris-claro/30 dark:border-slate-700 text-custom-gris-oscuro dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  Cerrar
                </button>
              </Tooltip>

              <Tooltip text="Guardar el pago de cooperadora para este alumno" position="top">
                <button
                  type="submit"
                  form="form-cooperadora-pago"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 text-custom-amarillo animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 text-custom-amarillo" />
                  )}
                  {isSubmitting ? 'Guardando...' : 'Guardar Pago'}
                </button>
              </Tooltip>
            </div>
          </div>
        </section>
      )}
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(drawerContent, document.body)
}
