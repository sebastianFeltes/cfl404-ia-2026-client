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
  Award,
  Sparkles,
  Clock,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { mapDbRoleToUi, roleLabel } from '../utils/roles'
import StatCard from '../components/StatCard'

import ModuleSummaryCard from '../components/dashboard/ModuleSummaryCard'
import DashboardQuickActions from '../components/dashboard/DashboardQuickActions'
import DashboardAlerts from '../components/dashboard/DashboardAlerts'

import { fetchCourses } from '../services/coursesService'
import { getCooperadoraPagos, getBuffetMovements } from '../services/cooperadoraService'
import { GET } from '../services/api'

// Helper para detectar postulantes
const isPostulante = (student) => {
  if (!student) return false
  const role = String(student.role_name || '').toLowerCase()
  const status = String(student.status || '').toLowerCase()
  return (
    Boolean(student.is_aspirante) ||
    role === 'postulante' ||
    role === 'aspirante' ||
    student.status_id === 3 ||
    status === 'pendiente' ||
    status === 'postulante' ||
    status === 'aspirante'
  )
}

export default function Dashboard() {
  const outletCtx = useOutletContext() || {}
  const { user: authUser } = useAuth()
  const user = outletCtx.user || authUser

  // Rol real del usuario autenticado
  const originalDbRole = user?.rol || 'director'
  const originalRoleUi = mapDbRoleToUi(originalDbRole)

  const activeRole = originalRoleUi

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
  const [myEnrollments, setMyEnrollments] = useState([])
  const [myTickets, setMyTickets] = useState([])

  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Sincronizar datos desde APIs del sistema
  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    const currentYear = new Date().getFullYear()

    try {
      const [coursesRes, studentsRes, instructorsRes, coopPagosRes, buffetRes, turnoRes] =
        await Promise.allSettled([
          fetchCourses(),
          GET('/api/v1/alumnos'),
          GET('/api/v1/instructores'),
          getCooperadoraPagos(currentYear),
          getBuffetMovements({ year: currentYear }),
          GET('/api/v1/preinscripciones/turno'),
        ])

      // 1. Cursos
      if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value)) {
        setCourses(coursesRes.value)
      } else {
        setCourses([])
      }

      if (studentsRes.status === 'fulfilled' && Array.isArray(studentsRes.value?.data)) {
        setStudents(studentsRes.value.data)
      } else {
        setStudents([])
      }

      if (instructorsRes.status === 'fulfilled' && Array.isArray(instructorsRes.value?.data)) {
        setInstructors(instructorsRes.value.data)
      } else {
        setInstructors([])
      }

      // 4. Cooperadora & Buffet
      let totalCuotas = 0
      let aportantes = 0
      let buffetNeto = 0
      let movs = []

      if (coopPagosRes.status === 'fulfilled' && coopPagosRes.value) {
        const pMap = coopPagosRes.value.paymentsMap || {}
        aportantes = 0
        Object.values(pMap).forEach((cuotas) => {
          let paid = false
          Object.values(cuotas || {}).forEach((pago) => {
            if (!pago?.pagado) return
            totalCuotas += Number(pago.monto ?? pago.amount ?? 0)
            paid = true
          })
          if (paid) aportantes += 1
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

      setCooperadoraData({
        totalRecaudado: totalCuotas,
        alumnosAportantes: aportantes,
        balanceBuffet: buffetNeto,
        movimientosRecientes: movs.slice(0, 4),
      })

      if (turnoRes.status === 'fulfilled' && turnoRes.value) {
        setMyEnrollments(Array.isArray(turnoRes.value.enrollments) ? turnoRes.value.enrollments : [])
        setMyTickets(Array.isArray(turnoRes.value.tickets) ? turnoRes.value.tickets : [])
      } else {
        setMyEnrollments([])
        setMyTickets([])
      }

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

    const runningIds = new Set([1, 8, 9, 10])
    const cursosActivos = courses.filter((c) => runningIds.has(Number(c.statusId ?? c.status?.id)))
    const cupoTotal = courses.reduce((acc, c) => acc + Number(c.quota ?? c.detail?.quota ?? 0), 0)
    const cupoDisponible = courses.reduce((acc, c) => acc + Number(c.availableQuota ?? 0), 0)
    const cupoOcupado = Math.max(0, cupoTotal - cupoDisponible)
    const pctOcupacionCursos = cupoTotal > 0 ? Math.round((cupoOcupado / cupoTotal) * 100) : 0

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
      postulantesCount: postulantes.length,
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
          title: 'Ciclo lectivo',
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
    const mine = courses.filter((course) => user?.id && String(course.instructorId) === String(user.id))
    const studentsMine = mine.reduce((acc, course) => acc + Number(course.enrolledCount || 0), 0)
    const hoursMine = mine.reduce((acc, course) => acc + Number(course.detail?.hour_quantity || 0), 0)
    const waiting = myTickets.filter((ticket) => ticket.status === 'esperando').length
    const ready = myTickets.filter((ticket) => ticket.status === 'listo').length
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
            tooltip: 'Personas con rol postulante o estado pendiente',
          },
          {
            title: 'Alumnos regulares',
            value: loading ? '...' : metrics.alumnosTotal,
            icon: Users,
            trend: `${metrics.alumnosActivos} activos`,
            trendType: 'neutral',
            colorClass: 'border-emerald-500',
            iconColorClass: 'text-emerald-600 bg-emerald-500/10',
            description: 'matrícula sin postulantes',
            tooltip: 'Alumnos cargados en el sistema, sin contar postulantes',
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
            tooltip: 'Cupo menos inscripciones que ocupan lugar',
          },
          {
            title: 'Cursos en oferta',
            value: loading ? '...' : metrics.cursosActivos,
            icon: ClipboardCheck,
            trend: `${metrics.cursosTotal} en el catálogo`,
            trendType: 'neutral',
            colorClass: 'border-[#166193]',
            iconColorClass: 'text-[#166193] bg-[#166193]/10',
            description: 'abiertos o con cupo',
            tooltip: 'Cursos activos, con inscripción abierta, últimos cupos o cupo completo',
          },
        ]
      case 'instructor':
        return [
          {
            title: 'Mis Cursos Asignados',
            value: loading ? '...' : mine.length,
            icon: BookOpen,
            trend: 'A tu cargo',
            trendType: 'neutral',
            colorClass: 'border-[#166193]',
            iconColorClass: 'text-[#166193] bg-[#166193]/10',
            description: 'cursos donde sos instructor',
            tooltip: 'Cursos cuyo instructor es tu usuario',
          },
          {
            title: 'Estudiantes a Cargo',
            value: loading ? '...' : studentsMine,
            icon: Users,
            trend: 'ocupan cupo',
            trendType: 'neutral',
            colorClass: 'border-[#37A6DE]',
            iconColorClass: 'text-[#166193] bg-[#37A6DE]/15',
            description: 'inscriptos en tus cursos',
            tooltip: 'Inscripciones que ocupan cupo en tus cursos',
          },
          {
            title: 'Horas cátedra',
            value: loading ? '...' : `${hoursMine} hs`,
            icon: Award,
            trend: 'del programa',
            trendType: 'neutral',
            colorClass: 'border-amber-500',
            iconColorClass: 'text-amber-600 bg-amber-500/10',
            description: 'suma de tus cursos',
            tooltip: 'Suma de las horas cátedra cargadas en el detalle de tus cursos',
          },
        ]
      case 'estudiante':
      case 'estudiantes':
      case 'alumno':
      case 'alumnos':
      case 'postulante':
        return [
          {
            title: 'Cursos inscriptos',
            value: loading ? '...' : myEnrollments.length,
            icon: BookOpen,
            trend: myEnrollments.length ? 'Con cupo' : 'Sin inscripción',
            trendType: 'neutral',
            colorClass: 'border-[#166193]',
            iconColorClass: 'text-[#166193] bg-[#166193]/10',
            description: 'preinscripciones confirmadas',
            tooltip: 'Cursos en los que ocupás un cupo',
          },
          {
            title: 'En espera',
            value: loading ? '...' : waiting,
            icon: Clock,
            trend: ready ? `${ready} listo para confirmar` : 'Sin turno listo',
            trendType: ready ? 'up' : 'neutral',
            colorClass: 'border-amber-500',
            iconColorClass: 'text-amber-600 bg-amber-500/10',
            description: 'turnos de la cola',
            tooltip: 'Pedidos de preinscripción que todavía no ocupan cupo',
          },
          {
            title: 'Estado del legajo',
            value: loading ? '...' : (user?.estado || '—'),
            icon: FileText,
            trend: user?.rol || '',
            trendType: 'neutral',
            colorClass: 'border-[#37A6DE]',
            iconColorClass: 'text-[#166193] bg-[#37A6DE]/15',
            description: 'según tu usuario',
            tooltip: 'Estado guardado en tu ficha',
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
            trend: `${metrics.alumnosAportantes} aportantes`,
            trendType: 'neutral',
            colorClass: 'border-amber-500',
            iconColorClass: 'text-amber-600 bg-amber-500/10',
            description: `cuotas y buffet, ${new Date().getFullYear()}`,
            tooltip: 'Total recaudado acumulado entre cuotas de alumnos y buffet',
          },
        ]
    }
  }, [activeRole, loading, metrics, courses, user, myEnrollments, myTickets])

  const firstName = user?.nombres?.trim() || 'Directivo/a'
  const currentRoleLabel = roleLabel(user?.rol)

  return (
    <div className="max-w-[1400px] w-full mx-auto font-nunito space-y-5 sm:space-y-7 pb-10 sm:pb-14 animate-fade-in">
      {/* ── 1. ENCABEZADO INSTITUCIONAL DEL DASHBOARD ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 pt-1">
        <div className="space-y-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-custom-azul-oscuro/10 dark:bg-custom-celeste/15 text-custom-azul-oscuro dark:text-custom-celeste flex items-center justify-center shadow-xs shrink-0">
              <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-bold text-custom-azul-oscuro dark:text-custom-celeste font-roboto tracking-tight leading-tight">
                  Dashboard
                </h1>
                <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-custom-azul-oscuro text-white shadow-xs">
                  {currentRoleLabel}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                Hola, <span className="font-semibold text-slate-800 dark:text-slate-200">{firstName}</span>. Resumen del CFL Nº 404 de Berisso.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200/80 dark:border-slate-700/60">
            <Calendar size={14} className="text-custom-azul-oscuro dark:text-custom-celeste" />
            <span>Ciclo Lectivo 2026</span>
          </div>

          <button
            type="button"
            onClick={loadDashboardData}
            disabled={loading}
            className="flex flex-1 md:flex-none items-center justify-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer disabled:opacity-60"
            title="Sincronizar métricas con la base de datos"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-custom-celeste' : ''} />
            <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. ALERTAS OPERATIVAS RELEVANTES ── */}
      <DashboardAlerts alerts={alertsForRole} />

      {/* ── 4. TARJETAS DE KPIS PRINCIPALES DEL ROL ── */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 items-stretch">
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
      {['estudiante', 'estudiantes', 'alumno', 'alumnos', 'postulante'].includes(String(activeRole || '').toLowerCase()) ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModuleSummaryCard
            title="Mis preinscripciones"
            subtitle="Cursos que ocupan cupo y turnos de la cola"
            icon={BookOpen}
            iconClass="text-custom-azul-oscuro bg-custom-azul-oscuro/10"
            linkTo="/inscripcion"
            linkLabel="Ver oferta"
            badgeText={user?.estado || 'Sin estado'}
            badgeColor="bg-sky-50 text-[#166193] dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
          >
            <div className="space-y-2">
              {myEnrollments.length === 0 && myTickets.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Todavía no tenés cursos inscriptos ni turnos en espera.
                </p>
              ) : null}
              {myEnrollments.map((item) => (
                <div key={`enr-${item.courseId}`} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{item.courseName || 'Curso'}</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Inscripto · orden {item.position ?? '—'}</p>
                </div>
              ))}
              {myTickets.map((item) => (
                <div key={`ticket-${item.courseId}-${item.status}`} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{item.courseName || 'Curso'}</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {item.status === 'listo' ? 'Listo para confirmar' : `En espera · posición ${item.position ?? '—'}`}
                  </p>
                </div>
              ))}
            </div>
          </ModuleSummaryCard>

          {/* Tarjeta 2 Estudiante: Mi Legajo y Documentación */}
          <ModuleSummaryCard
            title="Tu ficha"
            subtitle="Datos de la cuenta con la que entraste"
            icon={FileText}
            iconClass="text-amber-600 bg-amber-500/10"
            linkTo="/perfil"
            linkLabel="Completar perfil"
            badgeText={user?.rol || 'usuario'}
            badgeColor="bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
          >
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-2 text-sm">
              <p className="text-slate-700 dark:text-slate-200">
                <span className="font-bold">Estado:</span> {user?.estado || 'sin estado'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                La asistencia de cada clase se registra con la credencial en el lector QR. El cotejo de DNI y título se hace en secretaría y no queda marcado en esta pantalla.
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
                  {metrics.alumnosActivos} con estado activo
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
                <span className="text-lg sm:text-xl font-extrabold text-custom-azul-oscuro dark:text-custom-celeste break-words">
                  ${metrics.totalCooperadora.toLocaleString('es-AR')}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {metrics.alumnosAportantes} alumnos colaboradores
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Caja Buffet (Neto)</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-600 break-words">
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
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-nunito">
        <div className="flex items-start gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1 shrink-0" />
          <span className="leading-snug">Sistema conectado al Centro de Formación Laboral Nº 404 · Berisso</span>
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
