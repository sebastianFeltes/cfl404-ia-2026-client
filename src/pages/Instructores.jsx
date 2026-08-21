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
  Printer
} from 'lucide-react'
import StatCard from '../components/StatCard'
import InstructoresDataTable from '../components/instructores/InstructoresDataTable'
import Tooltip from '../components/Tooltip'

import InstructorDetailDrawer from '../components/instructores/InstructorDetailDrawer'
import InstructorFormDrawer from '../components/instructores/InstructorFormDrawer'
import InstructorDeleteModal from '../components/instructores/InstructorDeleteModal'

import { GET, POST, PUT } from '../services/api'

const API_INSTRUCTORES = '/api/v1/instructores'
const API_ROLES = '/api/v1/roles'

function Instructores() {
  // Access shared role metadata from layout context
  const { userRole } = useOutletContext()

  // Main CRUD Instructors State List (now from API)
  const [instructors, setInstructors] = useState([])
  const [roles, setRoles] = useState([])

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('') 
  const [filterRol, setFilterRol] = useState('')

  // Modals & Sliding Drawer triggers
  const [viewInstructor, setViewInstructor] = useState(null)
  const [editInstructor, setEditInstructor] = useState(null)
  const [deleteInstructor, setDeleteInstructor] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Toast Notification Simulation
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // ── Fetch instructores from API ──────────────────────────
  const fetchInstructors = useCallback(async () => {
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
  }, [])

  // ── Fetch roles from API (for the form select) ──────────
  const fetchRoles = useCallback(async () => {
    try {
      const response = await GET(API_ROLES)
      setRoles(response.data || [])
    } catch (err) {
      console.error('Error fetching roles:', err)
    }
  }, [])

  // Initial data load
  useEffect(() => {
    fetchInstructors()
    fetchRoles()
  }, [fetchInstructors, fetchRoles])

  // Handle resets
  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterEstado('')
    setFilterRol('')
    showToast('Filtros restablecidos correctamente.')
  }

  // Filter Logic based on interactive select/search values
  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch = searchLower === '' || 
        instructor.first_name.toLowerCase().includes(searchLower) ||
        instructor.last_name.toLowerCase().includes(searchLower) ||
        instructor.email.toLowerCase().includes(searchLower) ||
        instructor.dni.includes(searchLower)

      const matchesEstado = filterEstado === '' || instructor.status_id === Number(filterEstado)
      const matchesRol = filterRol === '' || instructor.role_name === filterRol

      return matchesSearch && matchesEstado && matchesRol
    })
  }, [instructors, searchTerm, filterEstado, filterRol])

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
    const instructor = instructors.find(i => i.id === id)
    setEditInstructor(instructor)
  }

  const handleDeleteTrigger = (id) => {
    const instructor = instructors.find(i => i.id === id)
    setDeleteInstructor(instructor)
  }

  // Submitting changes (Add or Edit) — connected to API
  const handleFormSubmit = async (data) => {
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
    }
  }

  // Confirm "deletion" (soft delete: status_id -> 2 Inactivo)
  const handleDeleteConfirm = async (id) => {
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
    showToast(`Generando Ficha de Docente PDF para: ${inst.first_name} ${inst.last_name}...`)
  }

  const isAnyFilterActive = searchTerm !== '' || filterEstado !== '' || filterRol !== ''
  const canCreate = userRole === 'director'

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28 font-roboto relative">
      {/* Toast Alert popup banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-custom-gris-oscuro text-white border border-custom-celeste px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in text-sm">
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
          
          {canCreate && (
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
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto flex-1 max-w-xl">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              title="Filtrar docentes por estado laboral"
              className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
              aria-label="Filtrar por Estado"
            >
              <option value="">Estado: Todos</option>
              <option value="1">Activo</option>
              <option value="3">En Licencia</option>
              <option value="2">Inactivo</option>
            </select>

            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              title="Filtrar docentes por rol"
              className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
              aria-label="Filtrar por Rol"
            >
              <option value="">Rol: Todos</option>
              {uniqueRoles.map((roleName) => (
                <option key={roleName} value={roleName}>{roleName}</option>
              ))}
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
      />

      {/* Drawer: Detailed view panel */}
      <InstructorDetailDrawer 
        instructor={viewInstructor}
        isOpen={!!viewInstructor}
        onClose={() => setViewInstructor(null)}
        onExport={handleExportIndividual}
      />

      {/* Drawer: Form to Register a New Instructor */}
      <InstructorFormDrawer 
        instructor={null}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleFormSubmit}
        userRole={userRole}
        roles={roles}
      />

      {/* Drawer: Form to Edit an Existing Instructor */}
      <InstructorFormDrawer 
        instructor={editInstructor}
        isOpen={!!editInstructor}
        onClose={() => setEditInstructor(null)}
        onSubmit={handleFormSubmit}
        userRole={userRole}
        roles={roles}
      />

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
