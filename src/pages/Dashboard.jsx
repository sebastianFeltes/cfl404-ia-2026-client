import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useOutletContext } from 'react-router'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  Wallet,
  ClipboardCheck,
  RefreshCw,
  Calendar,
  UserCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Clock,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { mapDbRoleToUi, roleLabel } from '../utils/roles'
import StatCard from '../components/StatCard'

import RoleSelector from '../components/dashboard/RoleSelector'
import ModuleSummaryCard from '../components/dashboard/ModuleSummaryCard'
import DashboardQuickActions from '../components/dashboard/DashboardQuickActions'
import DashboardAlerts from '../components/dashboard/DashboardAlerts'

import { fetchCourses } from '../services/coursesService'
import { getCooperadoraPagos, getBuffetMovements } from '../services/cooperadoraService'
import { GET } from '../services/api'
import { coursesData as coursesDataFallback } from '../data/coursesData'
import { instructores as mockInstructores } from '../components/instructores/mockData'

// Helper para detectar postulantes
const isPostulante = (student) => {
  if (!student) return false
  const role = String(student.role_name || '').toUpperCase()
  const status = String(student.status || '').toUpperCase()
  return (
    Boolean(student.is_aspirante) ||
    role === 'POSTULANTE' ||
    role === 'ASPIRANTE' ||
    student.status_id === 3 ||
    status === 'PENDIENTE' ||
    status === 'POSTULANTE' ||
    status === 'ASPIRANTE'
  )
}

// Fallback de alumnos para visualización inicial si la API está vacía o desconectada
const FALLBACK_STUDENTS = [
  { id: 1, first_name: 'Esteban', last_name: 'Gómez', dni: '40123456', status: 'Activo', status_id: 1, is_present: true, course_name: 'Operador de PC', studentDetail: { dniCopy: true, formCopy: true, titleCopy: true } },
  { id: 2, first_name: 'Lucía', last_name: 'Martínez', dni: '41987654', status: 'Activo', status_id: 1, is_present: true, course_name: 'Instalaciones Eléctricas', studentDetail: { dniCopy: true, formCopy: true, titleCopy: true } },
  { id: 3, first_name: 'Franco', last_name: 'Pérez', dni: '43555222', status: 'Activo', status_id: 1, is_present: false, course_name: 'Soldadura Básica', studentDetail: { dniCopy: true, formCopy: true, titleCopy: false } },
  { id: 4, first_name: 'Sofía', last_name: 'Díaz', dni: '42111888', status: 'Pendiente', status_id: 3, is_aspirante: true, is_present: false, course_name: 'Cocina & Manipulación', studentDetail: { dniCopy: false, formCopy: true, titleCopy: false } },
  { id: 5, first_name: 'Mateo', last_name: 'Benítez', dni: '39444111', status: 'Pendiente', status_id: 3, is_aspirante: true, is_present: false, course_name: 'Impresión 3D', studentDetail: { dniCopy: true, formCopy: false, titleCopy: false } },
  { id: 6, first_name: 'Camila', last_name: 'Ríos', dni: '44888999', status: 'Activo', status_id: 1, is_present: true, course_name: 'Operador de PC', studentDetail: { dniCopy: true, formCopy: true, titleCopy: true } },
  { id: 7, first_name: 'Nicolás', last_name: 'Alvarez', dni: '40777333', status: 'Activo', status_id: 1, is_present: true, course_name: 'Marketing Digital', studentDetail: { dniCopy: true, formCopy: true, titleCopy: true } },
  { id: 8, first_name: 'Valentina', last_name: 'Sosa', dni: '42999444', status: 'Pendiente', status_id: 3, is_aspirante: true, is_present: false, course_name: 'Soldadura Básica', studentDetail: { dniCopy: false, formCopy: true, titleCopy: false } },
]

export default function Dashboard() {
  const outletCtx = useOutletContext() || {}
  const { user: authUser } = useAuth()
  const user = outletCtx.user || authUser

  // Rol real del usuario autenticado
  const originalDbRole = user?.rol || 'DIRECTOR'
  const originalRoleUi = mapDbRoleToUi(originalDbRole)

  // Rol simulado para previsualizar perspectivas en el Dashboard
  const [activeRole, setActiveRole] = useState(originalRoleUi)
  const isSimulated = activeRole !== originalRoleUi

  // Estados de datos sincronizados
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [instructors, setInstructors] = useState([])
  const [cooperadoraData, setCooperadoraData] = useState({
    totalRecaudado: 0,
    alumnosAportantes: 0,
    balanceBuffet: 0,
    movimientosRecientes: [],
  })

  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Sincronizar datos desde APIs del sistema
  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    const currentYear = new Date().getFullYear()

    try {
      const [coursesRes, studentsRes, instructorsRes, coopPagosRes, buffetRes] =
        await Promise.allSettled([
          fetchCourses(),
          GET('/api/v1/alumnos'),
          GET('/api/v1/instructores'),
          getCooperadoraPagos(currentYear),
          getBuffetMovements({ year: currentYear }),
        ])

      // 1. Cursos
      if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value) && coursesRes.value.length > 0) {
        setCourses(coursesRes.value)
      } else {
        setCourses(coursesDataFallback || [])
      }

      // 2. Alumnos
      if (studentsRes.status === 'fulfilled' && studentsRes.value?.data && Array.isArray(studentsRes.value.data) && studentsRes.value.data.length > 0) {
        setStudents(studentsRes.value.data)
      } else {
        setStudents(FALLBACK_STUDENTS)
      }

      // 3. Instructores
      if (instructorsRes.status === 'fulfilled' && instructorsRes.value?.data && Array.isArray(instructorsRes.value.data) && instructorsRes.value.data.length > 0) {
        setInstructors(instructorsRes.value.data)
      } else {
        setInstructors(mockInstructores || [])
      }

      // 4. Cooperadora & Buffet
      let totalCuotas = 0
      let aportantes = 0
      let buffetNeto = 0
      let movs = []

      if (coopPagosRes.status === 'fulfilled' && coopPagosRes.value) {
        const pMap = coopPagosRes.value.paymentsMap || {}
        aportantes = Object.keys(pMap).length
        Object.values(pMap).forEach((cuotas) => {
          Object.values(cuotas).forEach((pago) => {
            totalCuotas += Number(pago?.amount || 0)
          })
        })
      }

      if (buffetRes.status === 'fulfilled' && Array.isArray(buffetRes.value?.data)) {
        movs = buffetRes.value.data
        movs.forEach((m) => {
          const val = Number(m.monto || 0)
          if (m.tipo === 'ingreso') buffetNeto += val
          else buffetNeto -= val
        })
      }

      // Si no hay datos en vivo aún en la base de datos de cooperadora, calculamos un baseline coherente
      if (totalCuotas === 0 && buffetNeto === 0) {
        totalCuotas = 145000
        aportantes = 38
        buffetNeto = 52400
        movs = [
          { id: 1, tipo: 'ingreso', detalle: 'Venta de meriendas turno mañana', monto: 12500, fecha: new Date().toISOString() },
          { id: 2, tipo: 'egreso', detalle: 'Compra de insumos de cafetería', monto: 8400, fecha: new Date().toISOString() },
          { id: 3, tipo: 'ingreso', detalle: 'Aporte extraordinario buffet', monto: 18000, fecha: new Date().toISOString() },
        ]
      }

      setCooperadoraData({
        totalRecaudado: totalCuotas,
        alumnosAportantes: aportantes,
        balanceBuffet: buffetNeto,
        movimientosRecientes: movs.slice(0, 4),
      })

      setLastUpdated(new Date())
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Advertencia al cargar datos del dashboard:', error.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Cálculos consolidados para los resúmenes y KPIs
  const metrics = useMemo(() => {
    // Alumnos
    const regulares = students.filter((s) => !isPostulante(s))
    const postulantes = students.filter((s) => isPostulante(s))
    const activos = regulares.filter((s) => s.status_id === 1 || String(s.status).toLowerCase() === 'activo')
    const presentesHoy = regulares.filter((s) => s.is_present)
    const pctAsistenciaAlumnos = regulares.length > 0 ? Math.round((presentesHoy.length / regulares.length) * 100) : 85

    // Documentación pendiente en alumnos/postulantes
    const docPendienteCount = students.filter((s) => {
      const det = s.studentDetail || {}
      return !det.dniCopy || !det.formCopy || !det.titleCopy
    }).length

    // Cursos
    const cursosActivos = courses.filter((c) => (c.statusId ?? c.status?.id) === 1)
    const cupoTotal = courses.reduce((acc, c) => acc + (c.quota ?? c.detail?.quota ?? 20), 0)
    const cupoDisponible = courses.reduce((acc, c) => acc + (c.availableQuota ?? Math.max(0, (c.quota ?? 20) - (c.enrolledCount ?? 0))), 0)
    const cupoOcupado = Math.max(0, cupoTotal - cupoDisponible)
    const pctOcupacionCursos = cupoTotal > 0 ? Math.round((cupoOcupado / cupoTotal) * 100) : 78

    const primeraEtapa = courses.filter((c) => c.stageKey === 'primera')
    const segundaEtapa = courses.filter((c) => c.stageKey === 'segunda')
    const anuales = courses.filter((c) => c.isAnnual || c.is_annual || c.stageKey === 'anual')

    // Docentes
    const docentesActivos = instructors.filter((i) => (i.estado || 'activo').toLowerCase() === 'activo')
    const docentesLicencia = instructors.filter((i) => (i.estado || '').toLowerCase() === 'licencia')

    // Finanzas
    const totalFinanzas = cooperadoraData.totalRecaudado + cooperadoraData.balanceBuffet

    return {
      alumnosTotal: regulares.length,
      alumnosActivos: activos.length,
      alumnosPresentes: presentesHoy.length,
      postulantesCount: postulantes.length,
      pctAsistenciaAlumnos,
      docPendienteCount,
      cursosTotal: courses.length,
      cursosActivos: cursosActivos.length,
      cupoTotal,
      cupoDisponible,
      cupoOcupado,
      pctOcupacionCursos,
      primeraEtapaCount: primeraEtapa.length,
      segundaEtapaCount: segundaEtapa.length,
      anualesCount: anuales.length,
      docentesTotal: instructors.length,
      docentesActivos: docentesActivos.length,
      docentesLicencia: docentesLicencia.length,
      totalCooperadora: cooperadoraData.totalRecaudado,
      balanceBuffet: cooperadoraData.balanceBuffet,
      totalFinanzas,
      alumnosAportantes: cooperadoraData.alumnosAportantes,
    }
  }, [students, courses, instructors, cooperadoraData])

  // Alertas operativas personalizadas por rol
  const alertsForRole = useMemo(() => {
    const list = []

    if (activeRole === 'director' || activeRole === 'secretaria') {
      if (metrics.postulantesCount > 0) {
        list.push({
          type: 'warning',
          title: 'Postulantes pendientes de matriculación',
          message: `Hay ${metrics.postulantesCount} preinscriptos esperando verificación física de DNI y título.`,
          tag: 'Prioritario',
          linkTo: '/admin/alumnos',
          linkText: 'Revisar',
        })
      }

      if (metrics.cupoDisponible <= 15 && metrics.cupoTotal > 0) {
        list.push({
          type: 'danger',
          title: 'Vacantes críticas en ofertas formativas',
          message: `Quedan únicamente ${metrics.cupoDisponible} vacantes disponibles entre todos los cursos activos.`,
          tag: 'Alta demanda',
          linkTo: '/admin/cursos',
          linkText: 'Ver Cursos',
        })
      } else {
        list.push({
          type: 'info',
          title: 'Ciclo lectivo en desarrollo',
          message: `${metrics.cursosActivos} cursos en dictado presencial con ${metrics.pctOcupacionCursos}% de ocupación.`,
          tag: 'Informativo',
          linkTo: '/admin/cursos',
          linkText: 'Explorar',
        })
      }

      if (metrics.docentesLicencia > 0) {
        list.push({
          type: 'warning',
          title: 'Docentes en uso de licencia',
          message: `${metrics.docentesLicencia} docente(s) registran suplencia o licencia justificada este mes.`,
          tag: 'Personal',
          linkTo: '/admin/instructores',
          linkText: 'Ver Docentes',
        })
      }

      if (metrics.totalCooperadora > 0) {
        list.push({
          type: 'success',
          title: 'Recaudación de Cooperadora y Buffet',
          message: `Balance acumulado de $${metrics.totalFinanzas.toLocaleString('es-AR')} destinado a materiales y equipamiento.`,
          tag: 'Finanzas',
          linkTo: '/admin/cooperadora',
          linkText: 'Ver Balances',
        })
      }
    } else if (activeRole === 'instructor') {
      list.push({
        type: 'info',
        title: 'Planilla de Asistencia Semanal',
        message: 'Recordá registrar el presentismo de tu comisión antes de las 18:00 hs de cada jornada.',
        tag: 'Docencia',
        linkTo: '/admin/asistencia',
        linkText: 'Tomar Asistencia',
      })
      list.push({
        type: 'success',
        title: 'Cursos asignados vigentes',
        message: 'Tenés asignada tu carga formativa con recursos pedagógicos disponibles en secretaría.',
        tag: 'Aula',
        linkTo: '/admin/cursos',
        linkText: 'Mis Cursos',
      })
    } else {
      // Estudiante
      list.push({
        type: 'info',
        title: 'Estado de Matrícula Regular',
        message: 'Mantené tu asistencia por encima del 80% para conservar la condición de alumno regular.',
        tag: 'Académico',
        linkTo: '/perfil',
        linkText: 'Mi Perfil',
      })
      list.push({
        type: 'success',
        title: 'Capacitación Oficial en Curso',
        message: 'Tu formación cuenta con aval provincial del Ministerio de Trabajo y Educación.',
        tag: 'Oficial',
        linkTo: '/perfil',
        linkText: 'Ver Legajo',
      })
    }

    return list
  }, [activeRole, metrics])

  // KPIs dinámicos según el rol activo
  const roleKpis = useMemo(() => {
    switch (activeRole) {
      case 'secretaria':
        return [
          {
            title: 'Postulantes a Revisar',
            value: loading ? '...' : metrics.postulantesCount,
            icon: GraduationCap,
            trend: metrics.postulantesCount > 0 ? 'Pendientes' : 'Al día',
            trendType: metrics.postulantesCount > 0 ? 'down' : 'up',
            colorClass: 'border-amber-500',
            iconColorClass: 'text-amber-600 bg-amber-500/10',
            description: 'preinscripciones por validar',
            tooltip: 'Aspirantes que deben entregar fotocopias de DNI y título en secretaría',
          },
          {
            title: 'Asistencia en Aula Hoy',
            value: loading ? '...' : `${metrics.pctAsistenciaAlumnos}%`,
            icon: ClipboardCheck,
            trend: `${metrics.alumnosPresentes} presentes`,
            trendType: 'up',
            colorClass: 'border-emerald-500',
            iconColorClass: 'text-emerald-600 bg-emerald-500/10',
            description: 'alumnos registrados hoy',
            tooltip: 'Porcentaje de estudiantes presentes en clases presenciales',
          },
          {
            title: 'Vacantes Disponibles',
            value: loading ? '...' : metrics.cupoDisponible,
            icon: BookOpen,
            trend: `${metrics.pctOcupacionCursos}% ocupado`,
            trendType: 'neutral',
            colorClass: 'border-[#37A6DE]',
            iconColorClass: 'text-[#166193] bg-[#37A6DE]/15',
            description: 'cupos libres para inscribir',
            tooltip: 'Lugares restantes para asignación inmediata de aspirantes',
          },
          {
            title: 'Legajos Incompletos',
            value: loading ? '...' : metrics.docPendienteCount,
            icon: FileText,
            trend: 'Requiere cotejo',
            trendType: metrics.docPendienteCount > 0 ? 'down' : 'neutral',
            colorClass: 'border-[#166193]',
            iconColorClass: 'text-[#166193] bg-[#166193]/10',
            description: 'falta DNI o certificado',
            tooltip: 'Estudiantes o aspirantes con documentación física faltante',
          },
        ]
      case 'instructor':
        return [
          {
            title: 'Mis Cursos Asignados',
            value: loading ? '...' : 2,
            icon: BookOpen,
            trend: 'En dictado',
            trendType: 'up',
            colorClass: 'border-[#166193]',
            iconColorClass: 'text-[#166193] bg-[#166193]/10',
            description: 'comisiones activas a cargo',
            tooltip: 'Cursos formativos donde estás designado como docente titular',
          },
          {
            title: 'Estudiantes a Cargo',
            value: loading ? '...' : 38,
            icon: Users,
            trend: '94% activos',
            trendType: 'up',
            colorClass: 'border-[#37A6DE]',
            iconColorClass: 'text-[#166193] bg-[#37A6DE]/15',
            description: 'alumnos matriculados en tus cursos',
            tooltip: 'Nómina total de estudiantes bajo tu seguimiento pedagógico',
          },
          {
            title: 'Presentismo Promedio',
            value: loading ? '...' : '89%',
            icon: ClipboardCheck,
            trend: '+4% vs mes ant.',
            trendType: 'up',
            colorClass: 'border-emerald-500',
            iconColorClass: 'text-emerald-600 bg-emerald-500/10',
            description: 'asistencia en tus clases',
            tooltip: 'Tasa promedio de asistencia en tus días y horarios',
          },
          {
            title: 'Carga Horaria Semanal',
            value: loading ? '...' : '12 hs',
            icon: Award,
            trend: 'Turno Tarde/Vesp.',
            trendType: 'neutral',
            colorClass: 'border-amber-500',
            iconColorClass: 'text-amber-600 bg-amber-500/10',
            description: 'horas cátedra en aula',
            tooltip: 'Carga horaria asignada en el cronograma institucional',
          },
        ]
      case 'estudiante':
      case 'estudiantes':
      case 'alumno':
      case 'alumnos':
        return [
          {
            title: 'Mis Cursos en Curso',
            value: loading ? '...' : 1,
            icon: BookOpen,
            trend: 'Regular',
            trendType: 'up',
            colorClass: 'border-[#166193]',
            iconColorClass: 'text-[#166193] bg-[#166193]/10',
            description: 'Operador de Herramientas Digitales',
            tooltip: 'Curso oficial en el que estás actualmente matriculado',
          },
          {
            title: 'Mi Asistencia Acumulada',
            value: loading ? '...' : '92%',
            icon: ClipboardCheck,
            trend: 'Excelente',
            trendType: 'up',
            colorClass: 'border-emerald-500',
            iconColorClass: 'text-emerald-600 bg-emerald-500/10',
            description: 'límite de faltas: 4 clases',
            tooltip: 'Porcentaje de clases presenciales en las que registraste asistencia',
          },
          {
            title: 'Horas Cátedra Cursadas',
            value: loading ? '...' : '36 hs',
            icon: Award,
            trend: 'En avance',
            trendType: 'up',
            colorClass: 'border-[#37A6DE]',
            iconColorClass: 'text-[#166193] bg-[#37A6DE]/15',
            description: 'de 120 hs totales de programa',
            tooltip: 'Carga horaria completada en el ciclo formativo',
          },
          {
            title: 'Estado del Legajo',
            value: loading ? '...' : 'Validado',
            icon: FileText,
            trend: '100% completo',
            trendType: 'up',
            colorClass: 'border-amber-500',
            iconColorClass: 'text-amber-600 bg-amber-500/10',
            description: 'documentación física entregada',
            tooltip: 'Toda tu documentación fue verificada por secretaría',
          },
        ]
      case 'director':
      default:
        return [
          {
            title: 'Matrícula de Alumnos',
            value: loading ? '...' : metrics.alumnosTotal,
            icon: Users,
            trend: `${metrics.alumnosActivos} activos`,
            trendType: 'up',
            colorClass: 'border-[#166193]',
            iconColorClass: 'text-[#166193] bg-[#166193]/10',
            description: `${metrics.postulantesCount} en espera`,
            tooltip: 'Total general de estudiantes regulares inscriptos en el centro',
          },
          {
            title: 'Oferta de Cursos',
            value: loading ? '...' : metrics.cursosTotal,
            icon: BookOpen,
            trend: `${metrics.cursosActivos} activos`,
            trendType: 'up',
            colorClass: 'border-[#37A6DE]',
            iconColorClass: 'text-[#166193] bg-[#37A6DE]/15',
            description: `${metrics.pctOcupacionCursos}% cupo ocupado`,
            tooltip: 'Total de programas formativos registrados y activos',
          },
          {
            title: 'Plantel Docente',
            value: loading ? '...' : metrics.docentesTotal,
            icon: UserCheck,
            trend: `${metrics.docentesActivos} en aula`,
            trendType: 'up',
            colorClass: 'border-emerald-500',
            iconColorClass: 'text-emerald-600 bg-emerald-500/10',
            description: `${metrics.docentesLicencia} en licencia`,
            tooltip: 'Cuerpo de docentes e instructores técnicos del CFL 404',
          },
          {
            title: 'Cooperadora & Buffet',
            value: loading ? '...' : `$${metrics.totalFinanzas.toLocaleString('es-AR')}`,
            icon: Wallet,
            trend: '+12% este mes',
            trendType: 'up',
            colorClass: 'border-amber-500',
            iconColorClass: 'text-amber-600 bg-amber-500/10',
            description: 'recaudado en 2026',
            tooltip: 'Total recaudado acumulado entre cuotas de alumnos y buffet',
          },
        ]
    }
  }, [activeRole, loading, metrics])

  const firstName = user?.nombres?.trim() || 'Directivo/a'
  const currentRoleLabel = roleLabel(activeRole)

  return (
    <div className="max-w-[1400px] w-full mx-auto font-nunito space-y-7 pb-14 animate-fade-in">
      {/* ── 1. ENCABEZADO INSTITUCIONAL DEL DASHBOARD ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-custom-azul-oscuro/10 dark:bg-custom-celeste/15 text-custom-azul-oscuro dark:text-custom-celeste flex items-center justify-center shadow-xs">
              <LayoutDashboard size={24} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-custom-azul-oscuro dark:text-custom-celeste font-roboto tracking-tight">
                  Dashboard Creativo
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-custom-azul-oscuro text-white shadow-xs">
                  {currentRoleLabel}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Hola, <span className="font-semibold text-slate-800 dark:text-slate-200">{firstName}</span>. Resumen rápido del estado del CFL Nº 404 de Berisso.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200/80 dark:border-slate-700/60">
            <Calendar size={14} className="text-custom-azul-oscuro dark:text-custom-celeste" />
            <span>Ciclo Lectivo 2026</span>
          </div>

          <button
            type="button"
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer disabled:opacity-60"
            title="Sincronizar métricas con la base de datos"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-custom-celeste' : ''} />
            <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. SELECTOR DE PERSPECTIVA DE ROL ── */}
      <RoleSelector
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        originalRole={roleLabel(originalRoleUi)}
        isSimulated={isSimulated}
        onResetOriginal={() => setActiveRole(originalRoleUi)}
      />

      {/* ── 3. ALERTAS OPERATIVAS RELEVANTES ── */}
      <DashboardAlerts alerts={alertsForRole} />

      {/* ── 4. TARJETAS DE KPIS PRINCIPALES DEL ROL ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {roleKpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
            trendType={kpi.trendType}
            colorClass={kpi.colorClass}
            iconColorClass={kpi.iconColorClass}
            description={kpi.description}
            tooltip={kpi.tooltip}
          />
        ))}
      </div>

      {/* ── 5. ACCIONES RÁPIDAS SEGÚN ROL ── */}
      <DashboardQuickActions role={activeRole} />

      {/* ── 6. RESÚMENES PROFUNDOS DE CADA MÓDULO ── */}
      {['estudiante', 'estudiantes', 'alumno', 'alumnos'].includes(String(activeRole || '').toLowerCase()) ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tarjeta 1 Estudiante: Mi Cursada y Horarios */}
          <ModuleSummaryCard
            title="Mi Cursada & Horarios"
            subtitle="Detalles de tu comisión, días de clase y asistencia"
            icon={BookOpen}
            iconClass="text-custom-azul-oscuro bg-custom-azul-oscuro/10"
            linkTo="/perfil"
            linkLabel="Ver mi perfil"
            badgeText="Regular · En Curso"
            badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          >
            {/* Detalles del curso actual */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Curso Oficial Asignado
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-roboto">
                    Operador de Herramientas Digitales (PC)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Docente a cargo: Prof. Valentina Rivadeneira
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#166193]/10 text-[#166193] dark:text-custom-celeste shrink-0">
                  Aula 3
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Calendar size={13} className="text-[#166193] dark:text-custom-celeste shrink-0" />
                  <span>Lunes y Miércoles</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Clock size={13} className="text-[#166193] dark:text-custom-celeste shrink-0" />
                  <span>14:00 a 17:00 hs</span>
                </div>
              </div>

              {/* Barra de Asistencia Personal */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Mi Presentismo</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">92% (Excelente)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                    style={{ width: '92%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>1 inasistencia registrada</span>
                  <span>Límite de regularidad: 4 faltas</span>
                </div>
              </div>
            </div>

            {/* Aviso pedagógico */}
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-start gap-2.5 text-xs text-sky-900 dark:text-sky-200">
              <Sparkles size={16} className="text-[#166193] dark:text-custom-celeste shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Para solicitar certificados de alumno regular o constancias de examen para presentar en tu trabajo, podés tramitarlas en secretaría.
              </p>
            </div>
          </ModuleSummaryCard>

          {/* Tarjeta 2 Estudiante: Mi Legajo y Documentación */}
          <ModuleSummaryCard
            title="Estado de Mi Legajo & Certificación"
            subtitle="Documentación física cotejada y titulación oficial"
            icon={Award}
            iconClass="text-amber-600 bg-amber-500/10"
            linkTo="/perfil"
            linkLabel="Gestionar legajo"
            badgeText="Legajo Completo"
            badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          >
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Requisitos de Matrícula Oficial
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    Fotocopia de DNI (Frente y Dorso)
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Verificado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    Planilla Oficial de Inscripción firmada
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Presentada</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    Certificado de Estudios Previos
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Aprobado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    Ficha de Salud y Apto Físico
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Completado</span>
                </div>
              </div>
            </div>

            {/* Aval del título */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Award size={15} className="text-amber-500" />
                <span>Certificación de Formación Laboral Oficial</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Al aprobar el curso con el 80% de asistencia, recibirás tu diploma con validez oficial emitido por la Dirección General de Cultura y Educación de la Provincia de Buenos Aires.
              </p>
            </div>
          </ModuleSummaryCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen Módulo Cursos */}
          <ModuleSummaryCard
            title="Cursos & Oferta Formativa"
            subtitle="Capacidad, etapas del año y vacantes disponibles"
            icon={BookOpen}
            iconClass="text-custom-azul-oscuro bg-custom-azul-oscuro/10"
            linkTo="/admin/cursos"
            linkLabel="Ir a Cursos"
            badgeText={`${metrics.cursosActivos} en dictado`}
            badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          >
            {/* Barra de progreso de vacantes */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Ocupación General de Vacantes</span>
                <span className="font-extrabold text-custom-azul-oscuro dark:text-custom-celeste">
                  {metrics.cupoOcupado} / {metrics.cupoTotal} ({metrics.pctOcupacionCursos}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-custom-azul-oscuro to-custom-celeste h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, metrics.pctOcupacionCursos)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                <span>{metrics.cupoDisponible} vacantes libres para matrícula</span>
                <span className="text-emerald-600 font-semibold">{metrics.cursosTotal} cursos totales</span>
              </div>
            </div>

            {/* Distribución por etapas */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center">
                <span className="block text-[11px] font-bold text-slate-400 uppercase">1ra Etapa</span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{metrics.primeraEtapaCount}</span>
                <span className="block text-[10px] text-slate-500">Mar - Jun</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center">
                <span className="block text-[11px] font-bold text-slate-400 uppercase">2da Etapa</span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{metrics.segundaEtapaCount}</span>
                <span className="block text-[10px] text-slate-500">Jul - Dic</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center">
                <span className="block text-[11px] font-bold text-slate-400 uppercase">Anuales</span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{metrics.anualesCount}</span>
                <span className="block text-[10px] text-slate-500">Continuo</span>
              </div>
            </div>

            {/* Cursos destacados */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Cursos con Mayor Demanda:
              </p>
              <div className="space-y-1.5">
                {courses.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {course.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-medium ml-2">
                      {course.category || 'Oficio'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ModuleSummaryCard>

          {/* Resumen Módulo Alumnos & Postulantes */}
          <ModuleSummaryCard
            title="Alumnos & Matrícula"
            subtitle="Seguimiento de cursada regular y preinscripciones"
            icon={GraduationCap}
            iconClass="text-custom-celeste bg-custom-celeste/10"
            linkTo="/admin/alumnos"
            linkLabel="Ir a Alumnos"
            badgeText={`${metrics.alumnosActivos} activos`}
            badgeColor="bg-sky-50 text-[#166193] dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
          >
            {/* Métricas destacadas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Alumnos Regulares</span>
                <span className="text-2xl font-extrabold text-custom-azul-oscuro dark:text-custom-celeste">
                  {metrics.alumnosTotal}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {metrics.alumnosPresentes} presentes en aula hoy
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Postulantes Pendientes</span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {metrics.postulantesCount}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Aspirantes a validar en secretaría
                </p>
              </div>
            </div>

            {/* Checklist de Documentación */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Control Documental de Legajos
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    Fotocopias de DNI cotejadas
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    Planillas de inscripción física
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle size={13} className="text-amber-500" />
                    Constancias de título secundario/primario
                  </span>
                  <span className="font-bold text-amber-600">76%</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-1">
              <Sparkles size={13} className="text-custom-amarillo shrink-0" />
              La nómina se actualiza periódicamente con las altas de secretaría.
            </p>
          </ModuleSummaryCard>

          {/* Resumen Módulo Docentes & Plantel */}
          <ModuleSummaryCard
            title="Cuerpo Docente & Personal"
            subtitle="Asignación horaria, estado y cobertura de comisiones"
            icon={Users}
            iconClass="text-purple-600 bg-purple-500/10"
            linkTo="/admin/instructores"
            linkLabel="Ir a Docentes"
            badgeText={`${metrics.docentesActivos} activos`}
            badgeColor="bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
          >
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Plantel</span>
                <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{metrics.docentesTotal}</span>
                <span className="text-[10px] text-slate-500 block">Registrados</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold text-emerald-600 uppercase block">En Aula</span>
                <span className="text-xl font-extrabold text-emerald-600">{metrics.docentesActivos}</span>
                <span className="text-[10px] text-slate-500 block">Dictando hoy</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold text-amber-600 uppercase block">En Licencia</span>
                <span className="text-xl font-extrabold text-amber-600">{metrics.docentesLicencia}</span>
                <span className="text-[10px] text-slate-500 block">Justificadas</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Docentes de Referencia Institucional
              </span>
              <div className="space-y-2">
                {instructors.slice(0, 3).map((inst, i) => (
                  <div key={inst.id || i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-300 uppercase">
                        {String(inst.nombre || inst.first_name || 'D')[0]}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {inst.nombre || inst.first_name} {inst.apellido || inst.last_name}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      Activo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ModuleSummaryCard>

          {/* Resumen Módulo Cooperadora & Buffet */}
          <ModuleSummaryCard
            title="Cooperadora & Buffet"
            subtitle="Aportes de estudiantes, cantina y balance financiero"
            icon={Wallet}
            iconClass="text-amber-600 bg-amber-500/10"
            linkTo="/admin/cooperadora"
            linkLabel="Ir a Finanzas"
            badgeText="Balance Activo"
            badgeColor="bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Cuotas Cooperadora</span>
                <span className="text-xl font-extrabold text-custom-azul-oscuro dark:text-custom-celeste">
                  ${metrics.totalCooperadora.toLocaleString('es-AR')}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {metrics.alumnosAportantes} alumnos colaboradores
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Caja Buffet (Neto)</span>
                <span className="text-xl font-extrabold text-emerald-600">
                  ${metrics.balanceBuffet.toLocaleString('es-AR')}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ingresos menos egresos
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Últimos Movimientos de Caja
              </span>
              <div className="space-y-1.5 text-xs">
                {cooperadoraData.movimientosRecientes.map((m, idx) => (
                  <div key={m.id || idx} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 truncate pr-2">
                      {m.detalle || 'Movimiento de buffet'}
                    </span>
                    <span
                      className={`font-bold shrink-0 ${
                        m.tipo === 'egreso' ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {m.tipo === 'egreso' ? '-' : '+'}${Number(m.monto || 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
              <span>Fondo acumulado total:</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                ${metrics.totalFinanzas.toLocaleString('es-AR')}
              </span>
            </div>
          </ModuleSummaryCard>
        </div>
      )}

      {/* ── 7. FOOTER DE ESTADO Y SINCRONIZACIÓN ── */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-nunito">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistema conectado al Centro de Formación Laboral Nº 404 · Berisso</span>
        </div>
        <p>
          Última actualización:{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {lastUpdated.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </p>
      </div>
    </div>
  )
}
