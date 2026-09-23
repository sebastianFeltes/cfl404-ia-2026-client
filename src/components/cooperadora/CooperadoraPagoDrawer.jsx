// Archivo: src/components/cooperadora/CooperadoraPagoDrawer.jsx
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Save,
  CheckCircle,
  Clock,
  Calendar,
  User as UserIcon,
  DollarSign,
  FileText,
  AlertCircle,
  Search,
  Check,
  Trash2,
  Loader2,
  GraduationCap,
  ArrowDownLeft,
  ArrowUpRight,
  Tag,
  BookOpen,
} from 'lucide-react'

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
  initialTab = 'alumno',
  payments = {},
  onSavePayment,
  onDeletePayment,
  onSaveCoopMovement,
  currentYear = new Date().getFullYear(),
  studentsList = [],
  onSelectStudent,
}) {
  const MIN_FEE = 2000
  const currentMonthIndex = new Date().getMonth() + 1

  // Pestaña activa: 'alumno' | 'ingreso_vario' | 'gastos'
  const [activeTab, setActiveTab] = useState(initialTab)

  // ── Estado Tab 1: Alumno ──
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex)
  const [amount, setAmount] = useState(2000)
  const [notes, setNotes] = useState('')
  const [isChangingStudent, setIsChangingStudent] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')

  // ── Estado Tab 2: Ingreso Vario ──
  const [varioFecha, setVarioFecha] = useState(new Date().toISOString().split('T')[0])
  const [varioMonto, setVarioMonto] = useState('')
  const [varioCategory, setVarioCategory] = useState('donacion')
  const [varioDetalle, setVarioDetalle] = useState('')
  const [varioObservaciones, setVarioObservaciones] = useState('')

  // ── Estado Tab 3: Gastos Cooperadora ──
  const [gastoFecha, setGastoFecha] = useState(new Date().toISOString().split('T')[0])
  const [gastoMonto, setGastoMonto] = useState('')
  const [gastoCategory, setGastoCategory] = useState('gasto')
  const [gastoDetalle, setGastoDetalle] = useState('')
  const [gastoObservaciones, setGastoObservaciones] = useState('')

  // ── Estado común ──
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const effectiveStudent = student || (studentsList.length > 0 ? studentsList[0] : null)
  const studentPayments = effectiveStudent ? (payments[effectiveStudent.id] || {}) : {}

  // Reiniciar estado al abrir el drawer o cambiar initialTab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'alumno')
      setFormError('')
      setIsSubmitting(false)
      setIsChangingStudent(false)
      setStudentSearch('')

      // Reset ingreso vario
      setVarioFecha(new Date().toISOString().split('T')[0])
      setVarioMonto('')
      setVarioCategory('donacion')
      setVarioDetalle('')
      setVarioObservaciones('')

      // Reset gastos
      setGastoFecha(new Date().toISOString().split('T')[0])
      setGastoMonto('')
      setGastoCategory('gasto')
      setGastoDetalle('')
      setGastoObservaciones('')
    }
  }, [isOpen, initialTab])

  // Ajustar mes seleccionado al cambiar de alumno
  useEffect(() => {
    if (isOpen && effectiveStudent) {
      const currentStudentPayments = payments[effectiveStudent.id] || {}
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
    }
  }, [effectiveStudent?.id, isOpen])

  // Calcular distribución multi-mes
  const calcDistribution = (startMonth, totalAmount) => {
    const fullMonths = Math.floor(totalAmount / MIN_FEE)
    if (fullMonths <= 1) return [{ month: Math.min(startMonth, 12), amount: totalAmount }]

    const dist = []
    let cur = startMonth
    let remaining = totalAmount

    while (cur <= 12 && remaining >= MIN_FEE && dist.length < fullMonths - 1) {
      dist.push({ month: cur, amount: MIN_FEE })
      remaining -= MIN_FEE
      cur++
    }

    if (cur <= 12) {
      dist.push({ month: cur, amount: remaining })
    } else if (dist.length > 0) {
      dist[dist.length - 1].amount += remaining
    }

    return dist
  }

  const distributionPreview = Number(amount) >= MIN_FEE
    ? calcDistribution(selectedMonth, Number(amount))
    : []

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

  // Submit Tab 1: Alumno
  const handleSubmitAlumno = async (e) => {
    e.preventDefault()
    if (!effectiveStudent) {
      setFormError('Por favor selecciona un alumno de la lista.')
      return
    }
    if (!amount || Number(amount) < 2000) {
      setFormError('El pago mínimo de cooperadora debe ser de $2.000.')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      await onSavePayment({
        studentId: effectiveStudent.id,
        month: Number(selectedMonth),
        amount: Number(amount),
        year: currentYear,
        date: new Date().toISOString().split('T')[0],
        notes: notes.trim(),
      })
      onClose()
    } catch (err) {
      setFormError(err.message || 'Error al guardar el pago de cooperadora')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Tab 2: Ingreso Vario
  const handleSubmitVario = async (e) => {
    e.preventDefault()
    if (!varioMonto || Number(varioMonto) <= 0) {
      setFormError('El monto del ingreso debe ser mayor a 0.')
      return
    }
    if (!varioDetalle.trim()) {
      setFormError('Por favor ingresá el detalle o concepto del ingreso vario.')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      if (onSaveCoopMovement) {
        await onSaveCoopMovement({
          fecha: varioFecha,
          monto: Number(varioMonto),
          tipo: 'ingreso',
          category: varioCategory,
          detalle: varioDetalle.trim(),
          observaciones: varioObservaciones.trim(),
        })
      }
      onClose()
    } catch (err) {
      setFormError(err.message || 'Error al registrar el ingreso extraordinario')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Tab 3: Gastos Cooperadora
  const handleSubmitGasto = async (e) => {
    e.preventDefault()
    if (!gastoMonto || Number(gastoMonto) <= 0) {
      setFormError('El monto del gasto debe ser mayor a 0.')
      return
    }
    if (!gastoDetalle.trim()) {
      setFormError('Por favor ingresá el detalle o concepto del gasto de cooperadora.')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      if (onSaveCoopMovement) {
        await onSaveCoopMovement({
          fecha: gastoFecha,
          monto: Number(gastoMonto),
          tipo: 'egreso',
          category: gastoCategory,
          detalle: gastoDetalle.trim(),
          observaciones: gastoObservaciones.trim(),
        })
      }
      onClose()
    } catch (err) {
      setFormError(err.message || 'Error al registrar el gasto de cooperadora')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminación de pago de alumno
  const handleDeletePagoAlumno = async () => {
    const currentPaidRecord = studentPayments[selectedMonth]
    if (!currentPaidRecord?.id || !effectiveStudent) return
    if (!window.confirm(`¿Estás seguro de eliminar el pago del mes ${MESES.find(m => m.id === selectedMonth)?.name}?`)) {
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      await onDeletePayment(currentPaidRecord.id, effectiveStudent.id, selectedMonth)
      setAmount(2000)
      setNotes('')
    } catch (err) {
      setFormError(err.message || 'Error al eliminar el pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSelectedMonthAlreadyPaid = Boolean(studentPayments[selectedMonth]?.pagado)
  const totalPaidMonths = Object.keys(studentPayments).filter(m => studentPayments[m]?.pagado).length
  const totalPaidAmount = Object.values(studentPayments).reduce(
    (acc, p) => acc + (p?.pagado ? Number(p.monto || 0) : 0),
    0
  )

  const filteredStudents = studentsList.filter((s) => {
    const q = studentSearch.toLowerCase().trim()
    if (!q) return true
    return (
      (s.first_name && s.first_name.toLowerCase().includes(q)) ||
      (s.last_name && s.last_name.toLowerCase().includes(q)) ||
      (s.dni && s.dni.includes(q))
    )
  })

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
            className="fixed top-0 right-0 h-full w-[470px] max-w-full z-50 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200 font-nunito"
            aria-label="Panel de Cooperadora"
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

              {activeTab === 'alumno' && effectiveStudent ? (
                <div className="flex items-center gap-4">
                  {effectiveStudent.profile_photo_url ? (
                    <img
                      src={effectiveStudent.profile_photo_url}
                      alt={`${effectiveStudent.first_name} ${effectiveStudent.last_name}`}
                      className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#166193] dark:text-sky-400 text-lg font-semibold font-roboto shadow-xs shrink-0">
                      {effectiveStudent.first_name?.[0] || 'A'}{effectiveStudent.last_name?.[0] || 'L'}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 font-roboto leading-tight truncate">
                        {effectiveStudent.first_name} {effectiveStudent.last_name}
                      </h2>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 font-nunito mt-0.5 leading-tight truncate">
                      {effectiveStudent.course_name || 'Sin curso asignado'} • DNI: {effectiveStudent.dni || 'S/D'}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-md px-2 py-0.5 text-xs font-medium">
                        {totalPaidMonths} / 12 cuotas
                      </span>
                      {studentsList.length > 1 && onSelectStudent && (
                        <button
                          type="button"
                          onClick={() => setIsChangingStudent(!isChangingStudent)}
                          className="text-xs text-[#166193] dark:text-sky-400 hover:underline font-medium cursor-pointer"
                        >
                          {isChangingStudent ? 'Ocultar alumnos' : 'Cambiar alumno'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xs shrink-0 border ${
                    activeTab === 'ingreso_vario'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400'
                  }`}>
                    {activeTab === 'ingreso_vario' ? (
                      <ArrowDownLeft size={24} strokeWidth={2} />
                    ) : (
                      <ArrowUpRight size={24} strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 font-roboto leading-tight">
                      {activeTab === 'ingreso_vario' ? 'Ingreso Vario' : 'Gastos de Cooperadora'}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-nunito mt-0.5">
                      {activeTab === 'ingreso_vario'
                        ? 'Donaciones, premios y subsidios institucionales'
                        : 'Salidas de fondos, compras y mantenimiento'}
                    </p>
                  </div>
                </div>
              )}

              {/* Selector de Pestañas coincidente con diseño de InstructorDrawer */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg mt-5 border border-slate-200/60 dark:border-slate-700/60 gap-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('alumno'); setFormError(''); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium font-nunito transition-all cursor-pointer ${
                    activeTab === 'alumno'
                      ? 'bg-white dark:bg-slate-900 text-[#166193] dark:text-sky-400 shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <GraduationCap size={15} />
                  <span>Ingreso Alumno</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('ingreso_vario'); setFormError(''); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium font-nunito transition-all cursor-pointer ${
                    activeTab === 'ingreso_vario'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <ArrowDownLeft size={15} />
                  <span>Ingreso Vario</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('gastos'); setFormError(''); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium font-nunito transition-all cursor-pointer ${
                    activeTab === 'gastos'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <ArrowUpRight size={15} />
                  <span>Gastos Coop</span>
                </button>
              </div>

              {/* Selector de alumnos desplegable */}
              {isChangingStudent && activeTab === 'alumno' && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Buscar por nombre o DNI…"
                      className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#166193]"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                    {filteredStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          onSelectStudent(s)
                          setIsChangingStudent(false)
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-md text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          s.id === effectiveStudent?.id
                            ? 'bg-[#166193]/10 text-[#166193] dark:text-sky-400 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
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

            {/* Contenido con scroll coincidente con InstructorDrawer */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 font-nunito space-y-5">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2 mt-4">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* ══════════════ TAB 1: ALUMNO ══════════════ */}
              {activeTab === 'alumno' && (
                <>
                  {/* Grid de 12 Meses */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-6 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> Meses del Ciclo {currentYear}
                      </span>
                      <span className="font-mono normal-case font-medium text-slate-500 dark:text-slate-400">
                        Total: ${totalPaidAmount.toLocaleString('es-AR')}
                      </span>
                    </h3>

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
                            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                              esMesSeleccionado
                                ? 'ring-2 ring-[#166193] dark:ring-sky-500 border-transparent shadow-xs'
                                : ''
                            } ${
                              estaPagado
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold">{mes.short}</span>
                              {estaPagado ? (
                                <CheckCircle size={13} className="text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Clock size={13} className="text-slate-300 dark:text-slate-600" />
                              )}
                            </div>
                            <div>
                              {estaPagado ? (
                                <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                                  ${Number(pago.monto).toLocaleString('es-AR')}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Pendiente</span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Formulario */}
                  <form id="form-coop-alumno" onSubmit={handleSubmitAlumno} className="space-y-4 pt-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      Datos del Pago
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                          Mes
                        </label>
                        <select
                          value={selectedMonth}
                          onChange={(e) => handleSelectMonth(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#166193] cursor-pointer"
                        >
                          {MESES.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} {studentPayments[m.id]?.pagado ? '(Abonado)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                          Monto ($)
                        </label>
                        <input
                          type="number"
                          min="2000"
                          step="100"
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="2000"
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#166193]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                        Comprobante / Observaciones (opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Transferencia #9281 o pago en efectivo en secretaría..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#166193] resize-none"
                      />
                    </div>
                  </form>

                  {/* Distribución Multi-mes */}
                  {distributionPreview.length > 1 ? (
                    <div className="p-3.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold">
                        <Calendar size={13} className="shrink-0" />
                        <span>Distribución automática en {distributionPreview.length} meses:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {distributionPreview.map((item, idx) => {
                          const mesName = MESES.find(m => m.id === item.month)?.short || `M${item.month}`
                          const isPartial = item.amount < MIN_FEE
                          return (
                            <div
                              key={idx}
                              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                                isPartial
                                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              <span className="font-bold">{mesName}:</span> ${item.amount.toLocaleString('es-AR')}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Cuota {MESES.find(m => m.id === selectedMonth)?.name}:
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        ${Number(amount || 0).toLocaleString('es-AR')}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* ══════════════ TAB 2: INGRESO VARIO ══════════════ */}
              {activeTab === 'ingreso_vario' && (
                <form id="form-coop-vario" onSubmit={handleSubmitVario} className="space-y-4 pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Detalle del Ingreso Extraordinario
                  </h3>

                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Tipo de Ingreso Vario
                    </label>
                    <select
                      value={varioCategory}
                      onChange={(e) => setVarioCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="donacion">Donación de Particular o Empresa</option>
                      <option value="premio">Premio o Reconocimiento</option>
                      <option value="subsidio">Subsidio Estatal o Institucional</option>
                      <option value="evento">Recaudación de Evento / Rifa</option>
                      <option value="otro">Otro Ingreso Extraordinario</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                        Fecha
                      </label>
                      <input
                        type="date"
                        required
                        value={varioFecha}
                        onChange={(e) => setVarioFecha(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                        Monto ($)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        required
                        value={varioMonto}
                        onChange={(e) => setVarioMonto(e.target.value)}
                        placeholder="15000"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Concepto / Detalle
                    </label>
                    <input
                      type="text"
                      required
                      value={varioDetalle}
                      onChange={(e) => setVarioDetalle(e.target.value)}
                      placeholder="Ej. Donación de insumos por exalumnos del curso de Electricidad"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Observaciones adicionales (opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={varioObservaciones}
                      onChange={(e) => setVarioObservaciones(e.target.value)}
                      placeholder="Número de recibo, donante, observaciones..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  {/* Impacto */}
                  <div className="p-3.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                      Impacto en Cooperadora:
                    </span>
                    <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-300">
                      {varioMonto ? `+$${Number(varioMonto).toLocaleString('es-AR')}` : '$0'}
                    </span>
                  </div>
                </form>
              )}

              {/* ══════════════ TAB 3: SALIDAS / GASTOS ══════════════ */}
              {activeTab === 'gastos' && (
                <form id="form-coop-gasto" onSubmit={handleSubmitGasto} className="space-y-4 pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Detalle del Gasto o Salida
                  </h3>

                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Categoría del Gasto
                    </label>
                    <select
                      value={gastoCategory}
                      onChange={(e) => setGastoCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="gasto">Gasto General de Cooperadora</option>
                      <option value="compra">Compra de Materiales / Equipamiento</option>
                      <option value="mantenimiento">Reparación o Mantenimiento Edilicio</option>
                      <option value="servicio">Servicios o Contrataciones</option>
                      <option value="otro">Otro Egreso</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                        Fecha
                      </label>
                      <input
                        type="date"
                        required
                        value={gastoFecha}
                        onChange={(e) => setGastoFecha(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                        Monto ($)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        required
                        value={gastoMonto}
                        onChange={(e) => setGastoMonto(e.target.value)}
                        placeholder="8500"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Concepto / Detalle
                    </label>
                    <input
                      type="text"
                      required
                      value={gastoDetalle}
                      onChange={(e) => setGastoDetalle(e.target.value)}
                      placeholder="Ej. Compra de resmas de hojas y tóner para secretaría"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Observaciones adicionales (opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={gastoObservaciones}
                      onChange={(e) => setGastoObservaciones(e.target.value)}
                      placeholder="Factura número, proveedor, notas adicionales..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                    />
                  </div>

                  {/* Impacto */}
                  <div className="p-3.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
                    <span className="text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                      Impacto en Cooperadora:
                    </span>
                    <span className="font-mono font-bold text-sm text-amber-700 dark:text-amber-300">
                      {gastoMonto ? `-$${Number(gastoMonto).toLocaleString('es-AR')}` : '$0'}
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* Footer con botones coincidentes con InstructorDrawer */}
            <div className="px-8 py-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 font-nunito">
              <div>
                {activeTab === 'alumno' && isSelectedMonthAlreadyPaid && onDeletePayment && (
                  <button
                    type="button"
                    onClick={handleDeletePagoAlumno}
                    disabled={isSubmitting}
                    className="h-9 px-3 flex items-center justify-center gap-1.5 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                    Eliminar Pago
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="h-9 px-4 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cerrar
                </button>

                {activeTab === 'alumno' && (
                  <button
                    type="submit"
                    form="form-coop-alumno"
                    disabled={isSubmitting}
                    className="h-9 px-5 flex items-center justify-center gap-2 rounded-lg bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white text-xs font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} strokeWidth={2} />
                    )}
                    Guardar Pago
                  </button>
                )}

                {activeTab === 'ingreso_vario' && (
                  <button
                    type="submit"
                    form="form-coop-vario"
                    disabled={isSubmitting}
                    className="h-9 px-5 flex items-center justify-center gap-2 rounded-lg bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white text-xs font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} strokeWidth={2} />
                    )}
                    Guardar Ingreso
                  </button>
                )}

                {activeTab === 'gastos' && (
                  <button
                    type="submit"
                    form="form-coop-gasto"
                    disabled={isSubmitting}
                    className="h-9 px-5 flex items-center justify-center gap-2 rounded-lg bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white text-xs font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} strokeWidth={2} />
                    )}
                    Guardar Gasto
                  </button>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
