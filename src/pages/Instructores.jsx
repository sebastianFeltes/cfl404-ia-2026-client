import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useOutletContext } from 'react-router'
import { 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  Search, 
  Download, 
  UserPlus, 
  X,
  AlertCircle,
  FilterX,
  Printer,
  ShieldCheck,
  Eye,
  ShieldX,
  Crown,
  UserCog,
  BookUser,
  ClipboardList,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import InstructoresDataTable from '../components/instructores/InstructoresDataTable'
import Tooltip from '../components/Tooltip'

import InstructorDetailDrawer from '../components/instructores/InstructorDetailDrawer'
import InstructorFormDrawer from '../components/instructores/InstructorFormDrawer'
import InstructorDeleteModal from '../components/instructores/InstructorDeleteModal'

import { GET, POST, PUT } from '../services/api'
import { CRUD_ROLES, READ_ONLY_ROLES, NO_ACCESS_ROLES, canCrud, canRead } from '../utils/roles'

const API_INSTRUCTORES = '/api/v1/instructores'
const API_ROLES = '/api/v1/roles'

// ── Configuración visual de roles ──────────────────────────────────────────
const ROLE_CONFIG = {
  GOD: {
    label: 'Dios del Sistema',
    icon: Crown,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800/60',
    badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
    access: 'CRUD completo',
    accessIcon: ShieldCheck,
    accessColor: 'text-yellow-600',
  },
  ADMIN: {
    label: 'Administrador',
    icon: UserCog,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/60',
    badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300',
    access: 'CRUD completo',
    accessIcon: ShieldCheck,
    accessColor: 'text-violet-600',
  },
  DIRECTOR: {
    label: 'Director/a',
    icon: ShieldCheck,
    color: 'text-custom-azul-oscuro dark:text-custom-celeste',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    access: 'CRUD completo',
    accessIcon: ShieldCheck,
    accessColor: 'text-blue-600',
  },
  REGENTE: {
    label: 'Regente',
    icon: ClipboardList,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60',
    badge: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
    access: 'CRUD completo',
    accessIcon: ShieldCheck,
    accessColor: 'text-teal-600',
  },
  SECRETARIA: {
    label: 'Secretaría',
    icon: Eye,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
    badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300',
    access: 'Solo lectura',
    accessIcon: Eye,
    accessColor: 'text-sky-600',
  },
  PRECEPTORIA: {
    label: 'Preceptoría',
    icon: BookUser,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
    badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
    access: 'Solo lectura',
    accessIcon: Eye,
    accessColor: 'text-indigo-600',
  },
}

const NO_ACCESS_CONFIG = {
  icon: ShieldX,
  color: 'text-red-500 dark:text-red-400',
  bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60',
}

function RoleBadge({ userRole }) {
  const config = ROLE_CONFIG[userRole]
  if (!config) return null

  const RoleIcon = config.icon
  const AccessIcon = config.accessIcon

  return (
    <Tooltip text={`Rol: ${config.label} — ${config.access}`} position="bottom">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${config.bg}`}>
        <RoleIcon className={`h-3.5 w-3.5 ${config.color}`} />
        <span className={config.color}>{config.label}</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <AccessIcon className={`h-3.5 w-3.5 ${config.accessColor}`} />
        <span className={config.accessColor}>{config.access}</span>
      </div>
    </Tooltip>
  )
}

function NoAccessBanner({ userRole }) {
  const labels = {
    INSTRUCTOR: 'Instructor/a',
    ALUMNO: 'Alumno/a',
    POSTULANTE: 'Postulante',
  }
  const label = labels[userRole] || userRole

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-5">
      <div className="p-5 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-800/60 shadow-sm">
        <ShieldX className="h-16 w-16 text-red-400 dark:text-red-500 mx-auto" />
      </div>
      <div>
        <h3 className="font-nunito font-extrabold text-2xl text-custom-gris-oscuro dark:text-slate-100 mb-2">
          Acceso Restringido
        </h3>
        <p className="text-sm text-custom-gris-claro dark:text-slate-400 max-w-sm">
          El rol <span className="font-bold text-red-500">{label}</span> no tiene permisos
          para visualizar la sección de Instructores.
        </p>
        <p className="text-xs text-custom-gris-claro dark:text-slate-500 mt-2">
          Contactá al Director o Administrador para solicitar acceso.
        </p>
      </div>
    </div>
  )
}

function Instructores() {
  // Access shared role metadata from layout context
  const { userRole } = useOutletContext() || {}

  // ── Permisos según rol ────────────────────────────────────
  const hasAccess = canRead(userRole)
  const hasCrud   = canCrud(userRole)

  // Main CRUD Instructors State List (now from API)
  const [instructors, setInstructors] = useState([])
  const [courses, setCourses] = useState([])

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('') 

  // Modals & Sliding Drawer triggers
  const [viewInstructor, setViewInstructor] = useState(null)
  const [editInstructor, setEditInstructor] = useState(null)
  const [deleteInstructor, setDeleteInstructor] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Toast Notification Simulation
  const [toastMessage, setToastMessage] = useState(null)
  // Submitting lock — prevents double-submit while async request is in-flight
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // ── Fetch instructores from API ──────────────────────────
  const fetchInstructors = useCallback(async () => {
    if (!hasAccess) return
    try {
      setLoading(true)
      setError(null)
      const response = await GET(API_INSTRUCTORES)
      setInstructors(response.data || [])
    } catch (err) {
      setError(err.message || 'Error al obtener los instructores')
      console.error('Error fetching instructores:', err)
    } finally {
      setLoading(false)
    }
  }, [hasAccess])

  // ── Fetch cursos from API (para asignar a instructores) ──
  const fetchCoursesList = useCallback(async () => {
    if (!hasAccess) return
    try {
      const response = await GET('/courses')
      if (Array.isArray(response)) {
        setCourses(response)
      }
    } catch (err) {
      console.warn('Error fetching courses list:', err)
    }
  }, [hasAccess])

  // Initial data load
  useEffect(() => {
    if (!hasAccess) {
      setLoading(false)
      return
    }
    fetchInstructors()
    fetchCoursesList()
  }, [fetchInstructors, fetchCoursesList, hasAccess])

  // Handle resets
  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterEstado('')
    showToast('Filtros restablecidos correctamente.')
  }

  // Filter + sort: Activos (1) → En Licencia (3) → Inactivos/de baja (2) siempre al final
  const filteredInstructors = useMemo(() => {
    const STATUS_SORT_ORDER = { 1: 0, 3: 1, 2: 2 }

    const filtered = instructors.filter((instructor) => {
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch = searchLower === '' || 
        instructor.first_name.toLowerCase().includes(searchLower) ||
        instructor.last_name.toLowerCase().includes(searchLower) ||
        instructor.email.toLowerCase().includes(searchLower) ||
        instructor.dni.includes(searchLower) ||
        (instructor.assigned_courses && instructor.assigned_courses.some(c => (typeof c === 'string' ? c : c.name || '').toLowerCase().includes(searchLower))) ||
        (instructor.course_name && instructor.course_name.toLowerCase().includes(searchLower))

      const matchesEstado = filterEstado === '' || String(instructor.status_id) === filterEstado

      return matchesSearch && matchesEstado
    })

    // Sort: Activos → En Licencia → Inactivos (inactivos siempre al final)
    return filtered.sort((a, b) => {
      const orderA = STATUS_SORT_ORDER[a.status_id] ?? 1
      const orderB = STATUS_SORT_ORDER[b.status_id] ?? 1
      return orderA - orderB
    })
  }, [instructors, searchTerm, filterEstado])

  // Count overall KPIs dynamically based on current state list
  const kpis = useMemo(() => {
    const total = instructors.length
    const activos = instructors.filter(i => i.status_id === 1).length
    const inactivos = instructors.filter(i => i.status_id === 2).length
    const licencia = instructors.filter(i => i.status_id === 3).length

    return { total, activos, inactivos, licencia }
  }, [instructors])

  // Unique role names for the filter dropdown (derived from real data)
  const uniqueRoles = useMemo(() => {
    const roleNames = [...new Set(instructors.map(i => i.role_name).filter(Boolean))]
    return roleNames.sort()
  }, [instructors])

  // CRUD event callbacks
  const handleView = (id) => {
    const instructor = instructors.find(i => i.id === id)
    setViewInstructor(instructor)
  }

  const handleEdit = (id) => {
    if (!hasCrud) return
    const instructor = instructors.find(i => i.id === id)
    setEditInstructor(instructor)
  }

  const handleDeleteTrigger = (id) => {
    if (!hasCrud) return
    const instructor = instructors.find(i => i.id === id)
    setDeleteInstructor(instructor)
  }

  // Submitting changes (Add or Edit) — connected to API
  const handleFormSubmit = async (data) => {
    if (!hasCrud || isSubmitting) return
    setIsSubmitting(true)
    try {
      if (data.id) {
        // Edit operation
        const response = await PUT(API_INSTRUCTORES, data, data.id)
        // Update the local state with the API response
        setInstructors(prev => prev.map(i => i.id === data.id ? response.data : i))
        showToast(`Docente "${response.data.first_name} ${response.data.last_name}" actualizado en el listado.`)
        setEditInstructor(null)
      } else {
        // Add operation
        const response = await POST(API_INSTRUCTORES, data)
        // Prepend the new instructor from API response
        setInstructors(prev => [response.data, ...prev])
        showToast(`Nuevo instructor "${response.data.first_name} ${response.data.last_name}" agregado con éxito.`)
        setIsAddOpen(false)
      }
    } catch (err) {
      showToast(`Error: ${err.message}`)
      console.error('Error submitting form:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Confirm "deletion" (soft delete: status_id -> 2 Inactivo)
  const handleDeleteConfirm = async (id) => {
    if (!hasCrud) return
    try {
      const response = await PUT(API_INSTRUCTORES, { status_id: 2 }, id)
      setInstructors(prev => prev.map(i => i.id === id ? response.data : i))
      const inst = response.data
      showToast(`Se ha dado de baja el registro de "${inst.first_name} ${inst.last_name}".`)
      setDeleteInstructor(null)
    } catch (err) {
      showToast(`Error al dar de baja: ${err.message}`)
      console.error('Error deactivating instructor:', err)
    }
  }

  // File simulations
  const handleExportList = () => {
    showToast('Exportación del cuerpo docente iniciada: Descargando archivo "Instructores_CFL404.csv"...')
  }

  const handleExportIndividual = (id) => {
    const inst = instructors.find(i => i.id === id)
    if (!inst) return
    showToast(`Generando Ficha de Docente PDF para: ${inst.first_name} ${inst.last_name}...`)
  }

  const isAnyFilterActive = searchTerm !== '' || filterEstado !== ''

  // ── Sin acceso: mostrar banner bloqueado ──────────────────
  if (!hasAccess) {
    return <NoAccessBanner userRole={userRole} />
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28 font-roboto relative">
      {/* Toast Alert popup banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[9999] bg-custom-gris-oscuro text-white border border-custom-celeste px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in text-sm">
          <AlertCircle className="h-4.5 w-4.5 text-custom-amarillo animate-pulse" />
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

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button 
            onClick={fetchInstructors} 
            className="text-xs font-bold bg-red-100 dark:bg-red-900/60 hover:bg-red-200 dark:hover:bg-red-800/80 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <h2 className="font-nunito font-extrabold text-3xl text-custom-azul-oscuro dark:text-custom-celeste tracking-tight">
            Cuerpo Docente
          </h2>
          <p className="text-sm font-medium text-custom-gris-claro dark:text-slate-400 mt-1">
            Gestión de instructores, asignación de cursos técnicos y datos de contacto institucional.
          </p>
        </div>
        
        {/* Main Action buttons */}
        <div className="flex items-center gap-3 no-print">

          {/* Badge de rol activo */}
          <RoleBadge userRole={userRole} />

          <Tooltip text="Imprimir o exportar listado a PDF" position="bottom">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-custom-azul-oscuro/25 dark:border-custom-celeste/40 text-custom-azul-oscuro dark:text-custom-celeste hover:border-custom-azul-oscuro dark:hover:border-custom-celeste hover:bg-custom-azul-oscuro/5 dark:hover:bg-custom-celeste/10 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
              aria-label="Imprimir listado completo"
            >
              <Printer className="h-4 w-4" />
              Imprimir / PDF
            </button>
          </Tooltip>

          <Tooltip text="Descargar listado en CSV" position="bottom">
            <button
              onClick={handleExportList}
              className="flex items-center gap-2 px-4 py-2 border-2 border-custom-azul-oscuro/25 dark:border-custom-celeste/40 text-custom-azul-oscuro dark:text-custom-celeste hover:border-custom-azul-oscuro dark:hover:border-custom-celeste hover:bg-custom-azul-oscuro/5 dark:hover:bg-custom-celeste/10 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
              aria-label="Exportar listado completo"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </Tooltip>
          
          {hasCrud && (
            <Tooltip text="Registrar un nuevo instructor en la institución" position="bottom">
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white hover:shadow-md cursor-pointer"
                aria-label="Agregar nuevo instructor"
              >
                <UserPlus className="h-4 w-4 text-custom-amarillo" />
                + Nuevo Instructor
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Instructores"
          value={kpis.total}
          icon={Users}
          trend="+5%"
          trendType="up"
          colorClass="border-custom-azul-oscuro"
          iconColorClass="text-custom-azul-oscuro bg-custom-azul-oscuro/10"
          description="registrados en la institución"
          tooltip="Total de instructores registrados en la institución"
        />
        <StatCard 
          title="Docentes Activos"
          value={kpis.activos}
          icon={UserCheck}
          trend="+10%"
          trendType="up"
          colorClass="border-custom-celeste"
          iconColorClass="text-custom-celeste bg-custom-celeste/10"
          description="dictando cursos actualmente"
          tooltip="Docentes activos dictando cursos formativos actualmente"
        />
        <StatCard 
          title="En Licencia"
          value={kpis.licencia}
          icon={AlertTriangle}
          trend="0%"
          trendType="neutral"
          colorClass="border-custom-amarillo"
          iconColorClass="text-yellow-600 bg-custom-amarillo/10"
          description="ausencias justificadas"
          tooltip="Docentes en uso de licencia justificada o médica"
        />
        <StatCard 
          title="Docentes Inactivos"
          value={kpis.inactivos}
          icon={UserX}
          trend="-1%"
          trendType="down"
          colorClass="border-custom-gris-claro"
          iconColorClass="text-custom-gris-claro bg-custom-gris-claro/10"
          description="dados de baja / sin cursos"
          tooltip="Docentes dados de baja o sin carga horaria activa"
        />
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 p-4 space-y-4 no-print transition-colors">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Text Input Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-gris-claro dark:text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar por nombre, DNI o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 font-medium transition-colors"
              aria-label="Buscar instructores"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gris-claro dark:text-slate-400 hover:text-custom-gris-oscuro dark:hover:text-slate-200 cursor-pointer"
                title="Limpiar búsqueda"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Select Dropdown Filters */}
          <div className="w-full lg:w-72">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              title="Filtrar docentes por estado laboral"
              className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
              aria-label="Filtrar por Estado"
            >
              <option value="">Estado: Todos los Estados</option>
              <option value="1">Docentes Activos</option>
              <option value="3">En Licencia</option>
              <option value="2">Inactivos / De Baja</option>
            </select>
          </div>

          {/* Clear Filters indicator */}
          {isAnyFilterActive && (
            <Tooltip text="Restablecer todos los filtros" position="bottom">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/60 transition-colors w-full lg:w-auto justify-center cursor-pointer"
                aria-label="Limpiar todos los filtros"
              >
                <FilterX className="h-3.5 w-3.5" />
                Limpiar
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Main Instructors Data Table */}
      <InstructoresDataTable 
        instructores={filteredInstructors}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteTrigger}
        onResetFilters={handleResetFilters}
        onAddInstructor={() => setIsAddOpen(true)}
        userRole={userRole}
        hasCrud={hasCrud}
      />

      {/* Drawer: Detailed view panel */}
      <InstructorDetailDrawer 
        instructor={viewInstructor}
        isOpen={!!viewInstructor}
        onClose={() => setViewInstructor(null)}
        onExport={handleExportIndividual}
        onEdit={(id) => {
          setViewInstructor(null)
          handleEdit(id)
        }}
        hasCrud={hasCrud}
      />

      {/* Drawer: Form — unified Add / Edit (single mount eliminates scroll-lock conflict — BUG-13) */}
      {(isAddOpen || !!editInstructor) && (
        <InstructorFormDrawer 
          instructor={editInstructor}
          isOpen={isAddOpen || !!editInstructor}
          onClose={() => {
            setIsAddOpen(false)
            setEditInstructor(null)
          }}
          onSubmit={handleFormSubmit}
          userRole={userRole}
          hasCrud={hasCrud}
          courses={courses}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Modal: Delete Confirmation Dialog */}
      <InstructorDeleteModal 
        instructor={deleteInstructor}
        isOpen={!!deleteInstructor}
        onClose={() => setDeleteInstructor(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default Instructores
