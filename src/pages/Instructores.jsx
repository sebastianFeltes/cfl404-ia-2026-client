import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useOutletContext } from 'react-router'
import { 
  Search, 
  UserPlus, 
  X,
  AlertCircle,
  FilterX,
  Printer,
  ShieldX,
  LayoutList,
  LayoutGrid,
  Users,
  UserCheck,
  AlertTriangle,
  UserX,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import InstructoresDataTable from '../components/instructores/InstructoresDataTable'
import InstructorCardView from '../components/instructores/InstructorCardView'
import Tooltip from '../components/Tooltip'

import InstructorDetailDrawer from '../components/instructores/InstructorDetailDrawer'
import InstructorFormDrawer from '../components/instructores/InstructorFormDrawer'
import InstructorDeleteModal from '../components/instructores/InstructorDeleteModal'

import { GET, POST, PUT } from '../services/api'
import { canonicalRole, canCrud, canRead } from '../utils/roles'

const API_INSTRUCTORES = '/api/v1/instructores'

const matchesSearchValue = (value, searchLower) =>
  String(value ?? '').toLowerCase().includes(searchLower)

function NoAccessBanner({ userRole }) {
  const labels = {
    INSTRUCTOR: 'Instructor/a',
    ALUMNO: 'Alumno/a',
    POSTULANTE: 'Postulante',
  }
  const label = labels[canonicalRole(userRole)] || userRole

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
  const { user, userRole } = useOutletContext() || {}
  const accessRole = canonicalRole(user?.rol || userRole)

  // ── Permisos según rol ────────────────────────────────────
  const hasAccess = canRead(accessRole)
  const hasCrud   = canCrud(accessRole)

  // Main CRUD Instructors State List (now from API)
  const [instructors, setInstructors] = useState([])
  const [courses, setCourses] = useState([])

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [viewMode, setViewMode] = useState('table') 

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
      if (import.meta.env.DEV) console.error('Error fetching instructores:', err)
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
    const searchLower = searchTerm.toLowerCase().trim()

    const filtered = instructors.filter((instructor) => {
      const courseNames = Array.isArray(instructor.assigned_courses)
        ? instructor.assigned_courses.map((c) => (typeof c === 'string' ? c : c?.name || c?.title || ''))
        : []

      const matchesSearch = searchLower === '' ||
        matchesSearchValue(instructor.first_name, searchLower) ||
        matchesSearchValue(instructor.last_name, searchLower) ||
        matchesSearchValue(`${instructor.first_name ?? ''} ${instructor.last_name ?? ''}`, searchLower) ||
        matchesSearchValue(instructor.email, searchLower) ||
        matchesSearchValue(instructor.dni, searchLower) ||
        matchesSearchValue(instructor.phone, searchLower) ||
        matchesSearchValue(instructor.course_name, searchLower) ||
        courseNames.some((name) => matchesSearchValue(name, searchLower))

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

  const kpis = useMemo(() => {
    const total = instructors.length
    const activos = instructors.filter((i) => Number(i.status_id) === 1).length
    const licencia = instructors.filter((i) => Number(i.status_id) === 3).length
    const inactivos = instructors.filter((i) => Number(i.status_id) === 2).length
    const pct = (n) => (total === 0 ? '0%' : `${Math.round((n / total) * 100)}%`)

    return {
      total,
      activos,
      licencia,
      inactivos,
      pctActivos: pct(activos),
      pctLicencia: pct(licencia),
      pctInactivos: pct(inactivos),
    }
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
        const row = response?.data ?? response
        if (!row?.id) {
          showToast('No se pudo actualizar el docente')
          return
        }
        setInstructors(prev => prev.map(i => i.id === data.id ? row : i))
        showToast(`Docente "${row.first_name || ''} ${row.last_name || ''}" actualizado en el listado.`)
        setEditInstructor(null)
      } else {
        const response = await POST(API_INSTRUCTORES, data)
        const row = response?.data ?? response
        if (!row?.id) {
          showToast('No se pudo crear el docente')
          return
        }
        setInstructors(prev => [row, ...prev])
        showToast(`Nuevo instructor "${row.first_name || ''} ${row.last_name || ''}" agregado con éxito.`)
        setIsAddOpen(false)
      }
    } catch (err) {
      showToast(`Error: ${err.message}`)
      if (import.meta.env.DEV) console.error('Error submitting form:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Confirm "deletion" (soft delete: status_id -> 2 Inactivo)
  const handleDeleteConfirm = async (id) => {
    if (!hasCrud) return
    try {
      const response = await PUT(API_INSTRUCTORES, { status_id: 2 }, id)
      const inst = response?.data ?? response
      if (!inst?.id) {
        showToast('No se pudo dar de baja el registro')
        return
      }
      setInstructors(prev => prev.map(i => i.id === id ? inst : i))
      showToast(`Se ha dado de baja el registro de "${inst.first_name || ''} ${inst.last_name || ''}".`)
      setDeleteInstructor(null)
    } catch (err) {
      showToast(`Error al dar de baja: ${err.message}`)
      if (import.meta.env.DEV) console.error('Error deactivating instructor:', err)
    }
  }

  const isAnyFilterActive = searchTerm !== '' || filterEstado !== ''

  // ── Sin acceso: mostrar banner bloqueado ──────────────────
  if (!hasAccess) {
    return <NoAccessBanner userRole={accessRole} />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 no-print">
        <StatCard 
          title="Total Instructores"
          value={kpis.total}
          icon={Users}
          trend={kpis.pctActivos}
          trendType="up"
          colorClass="border-[#166193]"
          iconColorClass="text-[#166193] bg-[#166193]/10"
          description="registrados en la institución"
          tooltip="Total general de docentes registrados en el cuerpo docente"
        />
        <StatCard 
          title="Docentes Activos"
          value={kpis.activos}
          icon={UserCheck}
          trend={kpis.pctActivos}
          trendType="up"
          colorClass="border-emerald-500"
          iconColorClass="text-emerald-600 bg-emerald-500/10"
          description="dictando cursos actualmente"
          tooltip="Docentes con estado activo y carga formativa vigente"
        />
        <StatCard 
          title="En Licencia"
          value={kpis.licencia}
          icon={AlertTriangle}
          trend={kpis.pctLicencia}
          trendType="neutral"
          colorClass="border-[#37A6DE]"
          iconColorClass="text-[#166193] bg-[#37A6DE]/15"
          description="ausencias justificadas"
          tooltip="Docentes en uso de licencia justificada o médica"
        />
        <StatCard 
          title="Docentes Inactivos"
          value={kpis.inactivos}
          icon={UserX}
          trend={kpis.pctInactivos}
          trendType={kpis.inactivos > 0 ? 'down' : 'neutral'}
          colorClass="border-[#37A6DE]"
          iconColorClass="text-[#37A6DE] bg-[#37A6DE]/10"
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

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/80 ml-auto lg:ml-0">
            <Tooltip text="Vista en tabla" position="bottom">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Vista en Tabla"
                aria-label="Vista en tabla"
                aria-pressed={viewMode === 'table'}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-[#166193] dark:text-[#37A6DE] shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LayoutList size={15} />
              </button>
            </Tooltip>
            <Tooltip text="Vista en tarjetas" position="bottom">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Vista en Tarjetas / Cuadrícula"
                aria-label="Vista en tarjetas"
                aria-pressed={viewMode === 'grid'}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-[#166193] dark:text-[#37A6DE] shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LayoutGrid size={15} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {viewMode === 'table' && (
        <InstructoresDataTable 
          instructores={filteredInstructors}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onResetFilters={handleResetFilters}
          onAddInstructor={() => setIsAddOpen(true)}
          userRole={accessRole}
          hasCrud={hasCrud}
        />
      )}

      {viewMode === 'grid' && (
        <InstructorCardView
          instructores={filteredInstructors}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onResetFilters={handleResetFilters}
          onAddInstructor={() => setIsAddOpen(true)}
          hasCrud={hasCrud}
        />
      )}

      {/* Drawer: Detailed view panel */}
      <InstructorDetailDrawer 
        instructor={viewInstructor}
        isOpen={!!viewInstructor}
        onClose={() => setViewInstructor(null)}
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
          onDelete={(id) => {
            setIsAddOpen(false)
            setEditInstructor(null)
            handleDeleteTrigger(id)
          }}
          userRole={accessRole}
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
