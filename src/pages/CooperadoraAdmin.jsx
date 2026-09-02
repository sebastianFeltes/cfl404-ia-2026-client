import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router'
import {
  Wallet,
  GraduationCap,
  ShoppingBag,
  Search,
  Download,
  Printer,
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  FilterX,
  DollarSign,
  Users,
  Calendar,
  Lock,
  ArrowRight,
  RefreshCw,
  Loader2,
} from 'lucide-react'

import StatCard from '../components/StatCard'
import Tooltip from '../components/Tooltip'
import CooperadoraAlumnosTable from '../components/cooperadora/CooperadoraAlumnosTable'
import CooperadoraBuffetTable from '../components/cooperadora/CooperadoraBuffetTable'
import CooperadoraPagoDrawer from '../components/cooperadora/CooperadoraPagoDrawer'
import CooperadoraBuffetDrawer from '../components/cooperadora/CooperadoraBuffetDrawer'
import { GET } from '../services/api'
import {
  getCooperadoraPagos,
  saveCooperadoraPago,
  deleteCooperadoraPago,
  getBuffetMovements,
  createBuffetMovement,
  deleteBuffetMovement,
} from '../services/cooperadoraService'
import { useAuth } from '../context/AuthContext'

const COOPERADORA_ALLOWED_ROLES = [
  'GOD',
  'ADMIN',
  'DIRECTOR',
  'DIRECTIVO',
  'REGENTE',
  'SECRETARIA',
  'SECRETARÍA',
  'PRECEPTORIA',
  'PRECEPTOR',
]

export default function CooperadoraAdmin() {
  const currentSystemYear = new Date().getFullYear()
  const { user } = useAuth()
  const rawRole = String(user?.rol || '').toUpperCase().trim()

  // Ciclo Lectivo Seleccionado
  const [selectedYear, setSelectedYear] = useState(currentSystemYear)

  // Tab State: 'alumnos' | 'buffet'
  const [activeTab, setActiveTab] = useState('alumnos')

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCurso, setFilterCurso] = useState('')
  const [filterBuffetTipo, setFilterBuffetTipo] = useState('')

  // State: Data from Backend
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState({})
  const [buffetRecords, setBuffetRecords] = useState([])

  // State: Loading & Errors
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  // Drawers
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState(null)
  const [isBuffetDrawerOpen, setIsBuffetDrawerOpen] = useState(false)

  // Toast
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // ── 1. Cargar Datos del Servidor ──────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setErrorMessage(null)

      // Ejecutar llamadas concurrentes a la API
      const [studentsRes, paymentsRes, buffetRes] = await Promise.allSettled([
        GET('/api/v1/alumnos'),
        getCooperadoraPagos(selectedYear),
        getBuffetMovements({ year: selectedYear }),
      ])

      // Procesar Alumnos
      if (studentsRes.status === 'fulfilled' && studentsRes.value?.data) {
        const studentList = Array.isArray(studentsRes.value.data) ? studentsRes.value.data : []
        setStudents(studentList)
      } else if (studentsRes.status === 'rejected') {
        console.warn('Error al cargar alumnos:', studentsRes.reason)
      }

      // Procesar Pagos de Cooperadora
      if (paymentsRes.status === 'fulfilled' && paymentsRes.value) {
        const paymentsMap = paymentsRes.value.paymentsMap || {}
        setPayments(paymentsMap)
      } else if (paymentsRes.status === 'rejected') {
        console.warn('Error al cargar pagos de cooperadora:', paymentsRes.reason)
      }

      // Procesar Movimientos de Buffet
      if (buffetRes.status === 'fulfilled' && buffetRes.value?.data) {
        const records = Array.isArray(buffetRes.value.data) ? buffetRes.value.data : []
        setBuffetRecords(records)
      } else if (buffetRes.status === 'rejected') {
        console.warn('Error al cargar movimientos de buffet:', buffetRes.reason)
      }
    } catch (err) {
      console.error('Error global cargando cooperadora:', err)
      setErrorMessage('No se pudieron sincronizar todos los datos con el servidor.')
    } finally {
      setLoading(false)
    }
  }, [selectedYear])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── 2. Manejo de Pagos de Cuotas de Alumnos ────────────────────────────────
  const handleSavePayment = async ({ studentId, month, amount, year, date, notes }) => {
    try {
      const res = await saveCooperadoraPago({
        studentId,
        month,
        amount,
        year: year || selectedYear,
        date,
        notes,
      })

      // Soporte para distribución automática multi-mes
      const allSaved = res.allSaved || [res.data]

      setPayments((prev) => {
        const studentCurrent = prev[studentId] || {}
        const updated = { ...studentCurrent }

        allSaved.forEach((p) => {
          updated[p.month] = {
            id: p.id,
            pagado: true,
            monto: p.amount,
            year: p.year || year || selectedYear,
            fecha: p.fecha || date || new Date().toISOString().split('T')[0],
            notas: p.notas || notes || '',
          }
        })

        return { ...prev, [studentId]: updated }
      })

      const st = students.find((s) => s.id === studentId)
      const monthsMsg =
        allSaved.length > 1
          ? `${allSaved.length} cuotas (Meses ${allSaved.map(p => p.month).join(', ')}) — Total $${Number(amount).toLocaleString('es-AR')}`
          : `Cuota Mes ${month} ($${Number(amount).toLocaleString('es-AR')})`
      showToast(`Pago registrado para ${st ? `${st.first_name} ${st.last_name}` : 'alumno'}: ${monthsMsg}`)
    } catch (err) {
      throw new Error(err.message || 'Error al guardar el pago en el servidor')
    }
  }

  const handleDeletePayment = async (paymentId, studentId, month) => {
    try {
      await deleteCooperadoraPago(paymentId)

      setPayments((prev) => {
        const studentCurrent = { ...(prev[studentId] || {}) }
        delete studentCurrent[month]
        return {
          ...prev,
          [studentId]: studentCurrent,
        }
      })

      showToast(`Pago de cuota eliminado correctamente.`)
    } catch (err) {
      throw new Error(err.message || 'Error al anular el pago en el servidor')
    }
  }

  // ── 3. Manejo de Movimientos de Buffet ────────────────────────────────────
  const handleSaveBuffetMovement = async (movementData) => {
    try {
      const res = await createBuffetMovement(movementData)
      if (res.data) {
        setBuffetRecords((prev) => [res.data, ...prev])
      }
      showToast(
        `Movimiento de buffet registrado con éxito: $${Number(movementData.monto).toLocaleString('es-AR')}`
      )
    } catch (err) {
      throw new Error(err.message || 'Error al guardar el movimiento de buffet')
    }
  }

  const handleDeleteBuffetRecord = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro de buffet?')) return
    try {
      await deleteBuffetMovement(id)
      setBuffetRecords((prev) => prev.filter((r) => r.id !== id))
      showToast('Registro de buffet eliminado de la base de datos.')
    } catch (err) {
      showToast(`Error al eliminar registro: ${err.message}`)
    }
  }

  // ── 4. Filtros y Búsquedas ────────────────────────────────────────────────
  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterCurso('')
    setFilterBuffetTipo('')
  }

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchTerm.toLowerCase().trim()
      const matchesSearch =
        q === '' ||
        (s.first_name && s.first_name.toLowerCase().includes(q)) ||
        (s.last_name && s.last_name.toLowerCase().includes(q)) ||
        (s.dni && String(s.dni).includes(q)) ||
        (s.course_name && s.course_name.toLowerCase().includes(q))

      const matchesCurso = filterCurso === '' || s.course_name === filterCurso

      return matchesSearch && matchesCurso
    })
  }, [students, searchTerm, filterCurso])

  const filteredBuffetRecords = useMemo(() => {
    return buffetRecords.filter((r) => {
      const q = searchTerm.toLowerCase().trim()
      const matchesSearch =
        q === '' ||
        (r.detalle && r.detalle.toLowerCase().includes(q)) ||
        (r.observaciones && r.observaciones.toLowerCase().includes(q))

      const matchesTipo = filterBuffetTipo === '' || r.tipo === filterBuffetTipo

      return matchesSearch && matchesTipo
    })
  }, [buffetRecords, searchTerm, filterBuffetTipo])

  const uniqueCourses = useMemo(() => {
    return [...new Set(students.map((s) => s.course_name).filter(Boolean))].sort()
  }, [students])

  // ── 5. Métricas y KPIs ────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    let totalCooperadora = 0
    let alumnosConPagos = 0
    const currentMonth = new Date().getMonth() + 1
    let cuotasMesActual = 0

    students.forEach((s) => {
      const studentMap = payments[s.id] || {}
      let hasAny = false
      Object.keys(studentMap).forEach((m) => {
        if (studentMap[m]?.pagado) {
          totalCooperadora += Number(studentMap[m].monto || 0)
          hasAny = true
          if (Number(m) === currentMonth) {
            cuotasMesActual += Number(studentMap[m].monto || 0)
          }
        }
      })
      if (hasAny) alumnosConPagos++
    })

    const totalIngresosBuffet = buffetRecords
      .filter((r) => r.tipo !== 'egreso')
      .reduce((acc, r) => acc + Number(r.monto || 0), 0)
    const totalEgresosBuffet = buffetRecords
      .filter((r) => r.tipo === 'egreso')
      .reduce((acc, r) => acc + Number(r.monto || 0), 0)
    const balanceBuffet = totalIngresosBuffet - totalEgresosBuffet

    return {
      totalCooperadora,
      balanceBuffet,
      totalGeneral: totalCooperadora + balanceBuffet,
      alumnosConPagos,
      totalAlumnos: students.length,
      cuotasMesActual,
    }
  }, [students, payments, buffetRecords])

  // ── 6. Exportación CSV Real ───────────────────────────────────────────────
  const handleExportCSV = () => {
    if (activeTab === 'alumnos') {
      const headers = ['ID,Apellido,Nombre,DNI,Curso,Cuotas Pagadas,Total Abonado ($)']
      const rows = students.map((s) => {
        const studentMap = payments[s.id] || {}
        const totalPaid = Object.keys(studentMap).filter((m) => studentMap[m]?.pagado).length
        const totalAmount = Object.values(studentMap).reduce(
          (acc, p) => acc + (p?.pagado ? Number(p.monto || 0) : 0),
          0
        )
        return `"${s.id}","${s.last_name || ''}","${s.first_name || ''}","${s.dni || ''}","${s.course_name || ''}",${totalPaid},${totalAmount}`
      })
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `Cooperadora_Alumnos_${selectedYear}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showToast(`Archivo "Cooperadora_Alumnos_${selectedYear}.csv" descargado con éxito.`)
    } else {
      const headers = ['ID,Fecha,Tipo,Detalle,Observaciones,Monto ($)']
      const rows = buffetRecords.map((r) => {
        return `"${r.id}","${r.fecha}","${r.tipo}","${(r.detalle || '').replace(/"/g, '""')}","${(r.observaciones || '').replace(/"/g, '""')}",${r.monto}`
      })
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `Cooperadora_Buffet_${selectedYear}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showToast(`Archivo "Cooperadora_Buffet_${selectedYear}.csv" descargado con éxito.`)
    }
  }

  // ── 7. Control de Acceso ──────────────────────────────────────────────────
  const hasAccess = COOPERADORA_ALLOWED_ROLES.includes(rawRole)

  if (!hasAccess && rawRole !== '') {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/60 p-8 text-center font-roboto">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="font-nunito font-extrabold text-2xl text-slate-800 dark:text-slate-100">
          Acceso Restringido
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          La sección de <strong>Cooperadora y Buffet</strong> está reservada para personal directivo, regencia, secretaría y preceptoría.
        </p>
        <div className="mt-6">
          <Link
            to="/admin/cursos"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white font-nunito font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Volver a Cursos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28 font-roboto relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-custom-gris-oscuro text-white border border-custom-celeste px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in text-sm">
          <CheckCircle className="h-4.5 w-4.5 text-custom-amarillo animate-pulse shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-custom-gris-claro hover:text-white ml-2 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <h2 className="font-nunito font-extrabold text-3xl text-custom-azul-oscuro dark:text-custom-celeste tracking-tight flex items-center gap-2.5">
            <Wallet className="h-8 w-8 text-custom-azul-oscuro dark:text-custom-celeste" />
            Cooperadora y Buffet
          </h2>
          <p className="text-sm font-medium text-custom-gris-claro dark:text-slate-400 mt-1">
            Gestión en tiempo real de aportes de cooperadora de alumnos y caja de buffet — Ciclo Lectivo {selectedYear}.
          </p>
        </div>

        {/* Action Buttons & Year Selector */}
        <div className="flex flex-wrap items-center gap-3 no-print">
          {/* Selector de Ciclo Lectivo */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-custom-gris-claro/20 dark:border-slate-800 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Calendar className="h-4 w-4 text-custom-celeste" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-extrabold text-custom-azul-oscuro dark:text-custom-celeste focus:outline-none cursor-pointer"
              aria-label="Seleccionar ciclo lectivo"
            >
              {[currentSystemYear - 1, currentSystemYear, currentSystemYear + 1].map((y) => (
                <option key={y} value={y}>
                  Ciclo {y}
                </option>
              ))}
            </select>
          </div>

          <Tooltip text="Recargar datos desde el servidor" position="bottom">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 border-2 border-custom-azul-oscuro/25 dark:border-custom-celeste/40 text-custom-azul-oscuro dark:text-custom-celeste hover:bg-custom-azul-oscuro/5 dark:hover:bg-custom-celeste/10 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              aria-label="Actualizar datos"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </Tooltip>

          <Tooltip text="Imprimir o generar PDF" position="bottom">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-custom-azul-oscuro/25 dark:border-custom-celeste/40 text-custom-azul-oscuro dark:text-custom-celeste hover:border-custom-azul-oscuro dark:hover:border-custom-celeste hover:bg-custom-azul-oscuro/5 dark:hover:bg-custom-celeste/10 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
              aria-label="Imprimir listado"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </button>
          </Tooltip>

          <Tooltip text="Descargar nómina en formato CSV" position="bottom">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 border-2 border-custom-azul-oscuro/25 dark:border-custom-celeste/40 text-custom-azul-oscuro dark:text-custom-celeste hover:border-custom-azul-oscuro dark:hover:border-custom-celeste hover:bg-custom-azul-oscuro/5 dark:hover:bg-custom-celeste/10 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
              aria-label="Exportar CSV"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </Tooltip>

          {activeTab === 'buffet' ? (
            <Tooltip text="Registrar un ingreso o egreso en el buffet" position="bottom">
              <button
                onClick={() => setIsBuffetDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white hover:shadow-md cursor-pointer"
                aria-label="Nuevo movimiento de buffet"
              >
                <Plus className="h-4 w-4 text-custom-amarillo" />
                Nuevo Registro
              </button>
            </Tooltip>
          ) : (
            <Tooltip text="Seleccioná un alumno para cargar su cuota" position="bottom">
              <button
                onClick={() => {
                  if (students.length > 0) setSelectedStudentForDrawer(students[0])
                }}
                disabled={students.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white hover:shadow-md cursor-pointer disabled:opacity-50"
                aria-label="Registrar cuota"
              >
                <Plus className="h-4 w-4 text-custom-amarillo" /> Cargar Pago
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={fetchData}
            className="font-bold underline hover:opacity-80 cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cooperadora"
          value={`$${kpis.totalCooperadora.toLocaleString('es-AR')}`}
          icon={Wallet}
          trend="+12%"
          trendType="up"
          colorClass="border-custom-azul-oscuro"
          iconColorClass="text-custom-azul-oscuro bg-custom-azul-oscuro/10"
          description={`recaudado en ${selectedYear}`}
          tooltip="Monto total abonado por los alumnos en cuotas de cooperadora"
        />

        <StatCard
          title="Caja Buffet (Neto)"
          value={`$${kpis.balanceBuffet.toLocaleString('es-AR')}`}
          icon={ShoppingBag}
          trend="+8%"
          trendType="up"
          colorClass="border-emerald-500"
          iconColorClass="text-emerald-600 bg-emerald-500/10"
          description="ingresos menos gastos"
          tooltip="Balance neto disponible en la caja de la cantina institucional"
        />

        <StatCard
          title="Alumnos Colaboradores"
          value={`${kpis.alumnosConPagos} / ${kpis.totalAlumnos}`}
          icon={Users}
          trend={`${Math.round((kpis.alumnosConPagos / (kpis.totalAlumnos || 1)) * 100)}%`}
          trendType="up"
          colorClass="border-custom-celeste"
          iconColorClass="text-custom-celeste bg-custom-celeste/10"
          description="alumnos con aportes"
          tooltip="Proporción de alumnos que registran al menos una cuota paga este año"
        />

        <StatCard
          title="Total General Acumulado"
          value={`$${kpis.totalGeneral.toLocaleString('es-AR')}`}
          icon={DollarSign}
          trend="+15%"
          trendType="up"
          colorClass="border-custom-amarillo"
          iconColorClass="text-yellow-600 bg-custom-amarillo/10"
          description="cooperadora + buffet"
          tooltip="Total recaudado acumulado entre cuotas de alumnos y buffet"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between no-print">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('alumnos')}
            className={`flex items-center gap-2.5 px-5 py-3 font-nunito font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'alumnos'
                ? 'border-custom-azul-oscuro dark:border-custom-celeste text-custom-azul-oscuro dark:text-custom-celeste'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="h-4.5 w-4.5" />
            Cuotas de Alumnos (Cooperadora)
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
              {students.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('buffet')}
            className={`flex items-center gap-2.5 px-5 py-3 font-nunito font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'buffet'
                ? 'border-custom-azul-oscuro dark:border-custom-celeste text-custom-azul-oscuro dark:text-custom-celeste'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            Registros de Buffet
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
              {buffetRecords.length}
            </span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 p-4 space-y-4 no-print transition-colors">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Text Input Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-gris-claro dark:text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'alumnos'
                  ? 'Buscar alumno por nombre, DNI o curso…'
                  : 'Buscar por detalle o concepto de buffet…'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 font-medium transition-colors"
              aria-label="Buscar"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gris-claro dark:text-slate-400 hover:text-custom-gris-oscuro dark:hover:text-slate-200 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Select Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto flex-1 max-w-md">
            {activeTab === 'alumnos' ? (
              <select
                value={filterCurso}
                onChange={(e) => setFilterCurso(e.target.value)}
                className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
                aria-label="Filtrar por Curso"
              >
                <option value="">Curso: Todos los cursos</option>
                {uniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={filterBuffetTipo}
                onChange={(e) => setFilterBuffetTipo(e.target.value)}
                className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
                aria-label="Filtrar por Tipo de Registro"
              >
                <option value="">Tipo: Todos</option>
                <option value="ingreso">Solo Ingresos / Ventas</option>
                <option value="egreso">Solo Gastos / Insumos</option>
              </select>
            )}

            {/* Clear Filters Button */}
            {(searchTerm !== '' || filterCurso !== '' || filterBuffetTipo !== '') && (
              <Tooltip text="Restablecer todos los filtros" position="bottom">
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/60 transition-colors justify-center cursor-pointer"
                >
                  <FilterX className="h-3.5 w-3.5" />
                  Limpiar Filtros
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'alumnos' ? (
        <CooperadoraAlumnosTable
          alumnos={filteredStudents}
          payments={payments}
          loading={loading}
          onSelectStudent={(student) => setSelectedStudentForDrawer(student)}
          currentYear={selectedYear}
        />
      ) : (
        <CooperadoraBuffetTable
          registros={filteredBuffetRecords}
          onDeleteRegistro={handleDeleteBuffetRecord}
          onOpenNewModal={() => setIsBuffetDrawerOpen(true)}
        />
      )}

      {/* Drawer: Student Cooperadora Payment Details & Form */}
      <CooperadoraPagoDrawer
        student={selectedStudentForDrawer}
        isOpen={Boolean(selectedStudentForDrawer)}
        onClose={() => setSelectedStudentForDrawer(null)}
        payments={payments}
        onSavePayment={handleSavePayment}
        onDeletePayment={handleDeletePayment}
        currentYear={selectedYear}
        studentsList={students}
        onSelectStudent={(student) => setSelectedStudentForDrawer(student)}
      />

      {/* Drawer: Buffet Movement Registration */}
      <CooperadoraBuffetDrawer
        isOpen={isBuffetDrawerOpen}
        onClose={() => setIsBuffetDrawerOpen(false)}
        onSave={handleSaveBuffetMovement}
      />
    </div>
  )
}
