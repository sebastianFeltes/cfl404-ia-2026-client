import React, { useState, useMemo } from 'react'
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
import StatusController from '../components/StatusController'
import Tooltip from '../components/Tooltip'

import InstructorDetailDrawer from '../components/instructores/InstructorDetailDrawer'
import InstructorFormDrawer from '../components/instructores/InstructorFormDrawer'
import InstructorDeleteModal from '../components/instructores/InstructorDeleteModal'

const INITIAL_MOCK_INSTRUCTORS = [
  {
    id: 201,
    first_name: 'Valentina',
    last_name: 'Rivadeneira',
    email: 'v.rivadeneira@cfl404.edu.ar',
    dni: '28.741.562',
    status_id: 1, // Activo
    role_name: 'Instructora Senior',
    phone: '+54 11 4523-8871',
    academic_level: 'Universitario',
    specialty: 'Diseño & Frontend',
    course_name: 'HTML & CSS Avanzado',
    assigned_courses: ['HTML & CSS Avanzado', 'React con Vite', 'Diseño UI/UX'],
    hire_date: '15/03/2021',
    address: 'Av. Corrientes 3421, CABA',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 202,
    first_name: 'Martín',
    last_name: 'Echevarría',
    email: 'm.echevarria@cfl404.edu.ar',
    dni: '31.098.441',
    status_id: 1, // Activo
    role_name: 'Instructor Principal',
    phone: '+54 11 3318-5590',
    academic_level: 'Universitario',
    specialty: 'Programación & IA',
    course_name: 'Python para IA',
    assigned_courses: ['Python para IA', 'Data Science & Machine Learning'],
    hire_date: '01/08/2020',
    address: 'Laprida 908, Córdoba Capital',
    profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 203,
    first_name: 'Camila',
    last_name: 'Bustamante',
    email: 'c.bustamante@cfl404.edu.ar',
    dni: '35.227.109',
    status_id: 1, // Activo
    role_name: 'Instructora Titular',
    phone: '+54 351 422-6643',
    academic_level: 'Terciario',
    specialty: 'Bases de Datos & Backend',
    course_name: 'SQL & APIs REST',
    assigned_courses: ['SQL Avanzado', 'APIs REST & Node.js'],
    hire_date: '10/01/2022',
    address: 'Belgrano 550, Rosario',
    profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 204,
    first_name: 'Rodrigo',
    last_name: 'Salcedo',
    email: 'r.salcedo@cfl404.edu.ar',
    dni: '26.553.874',
    status_id: 3, // Licencia
    role_name: 'Instructor Senior',
    phone: '+54 11 2244-7731',
    academic_level: 'Posgrado',
    specialty: 'Cloud & DevOps',
    course_name: 'Docker & Kubernetes',
    assigned_courses: ['Docker & Kubernetes', 'AWS Cloud Solutions'],
    hire_date: '20/05/2019',
    address: 'San Martín 1200, Mendoza',
    profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 205,
    first_name: 'Luciana',
    last_name: 'Petrovitch',
    email: 'l.petrovitch@cfl404.edu.ar',
    dni: '38.441.227',
    status_id: 2, // Inactivo
    role_name: 'Instructora',
    phone: '+54 11 5567-2298',
    academic_level: 'Terciario',
    specialty: 'Diseño UX/UI',
    course_name: 'Figma & Design Systems',
    assigned_courses: ['Figma Avanzado', 'Design Systems & Accesibilidad'],
    hire_date: '28/02/2023',
    address: 'Hipólito Yrigoyen 780, La Plata',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
  }
]

function Instructores() {
  // Access shared role metadata from layout context
  const { userRole } = useOutletContext()

  // Main CRUD Instructors State List
  const [instructors, setInstructors] = useState(INITIAL_MOCK_INSTRUCTORS)

  // Demo state controller ('success', 'loading', 'empty')
  const [demoState, setDemoState] = useState('success')

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('') 
  const [filterRol, setFilterRol] = useState('')
  const [filterEspecialidad, setFilterEspecialidad] = useState('')

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

  // Handle resets
  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterEstado('')
    setFilterRol('')
    setFilterEspecialidad('')
    showToast('Filtros restablecidos correctamente.')
  }

  // Filter Logic based on interactive select/search values
  const filteredInstructors = useMemo(() => {
    if (demoState === 'empty') return []
    
    return instructors.filter((instructor) => {
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch = searchLower === '' || 
        instructor.first_name.toLowerCase().includes(searchLower) ||
        instructor.last_name.toLowerCase().includes(searchLower) ||
        instructor.email.toLowerCase().includes(searchLower) ||
        instructor.dni.includes(searchLower)

      const matchesEstado = filterEstado === '' || instructor.status_id === Number(filterEstado)
      const matchesRol = filterRol === '' || instructor.role_name === filterRol
      const matchesEspecialidad = filterEspecialidad === '' || instructor.specialty === filterEspecialidad

      return matchesSearch && matchesEstado && matchesRol && matchesEspecialidad
    })
  }, [instructors, demoState, searchTerm, filterEstado, filterRol, filterEspecialidad])

  // Count overall KPIs dynamically based on current state list
  const kpis = useMemo(() => {
    const total = instructors.length
    const activos = instructors.filter(i => i.status_id === 1).length
    const inactivos = instructors.filter(i => i.status_id === 2).length
    const licencia = instructors.filter(i => i.status_id === 3).length

    return { total, activos, inactivos, licencia }
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

  // Submitting changes (Add or Edit)
  const handleFormSubmit = (data) => {
    if (data.id) {
      // Edit operation
      setInstructors(prev => prev.map(i => i.id === data.id ? { ...i, ...data } : i))
      showToast(`Docente "${data.first_name} ${data.last_name}" actualizado en el listado.`)
      setEditInstructor(null)
    } else {
      // Add operation
      const nextId = instructors.length > 0 ? Math.max(...instructors.map(i => i.id)) + 1 : 201
      const newInstructor = {
        ...data,
        id: nextId,
        assigned_courses: [data.course_name].filter(Boolean)
      }
      setInstructors(prev => [newInstructor, ...prev])
      showToast(`Nuevo instructor "${newInstructor.first_name} ${newInstructor.last_name}" agregado con éxito.`)
      setIsAddOpen(false)
    }
  }

  // Confirm deletion
  const handleDeleteConfirm = (id) => {
    const inst = instructors.find(i => i.id === id)
    setInstructors(prev => prev.filter(i => i.id !== id))
    showToast(`Se ha dado de baja el registro de "${inst.first_name} ${inst.last_name}".`)
    setDeleteInstructor(null)
  }

  // File simulations
  const handleExportList = () => {
    showToast('Exportación del cuerpo docente iniciada: Descargando archivo "Instructores_CFL404.csv"...')
  }

  const handleExportIndividual = (id) => {
    const inst = instructors.find(i => i.id === id)
    showToast(`Generando Ficha de Docente PDF para: ${inst.first_name} ${inst.last_name}...`)
  }

  const isAnyFilterActive = searchTerm !== '' || filterEstado !== '' || filterRol !== '' || filterEspecialidad !== ''
  const canCreate = userRole === 'director'

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-roboto relative">
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
          <Tooltip text="Imprimir o exportar listado a PDF" position="left">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-custom-azul-oscuro/25 dark:border-custom-celeste/40 text-custom-azul-oscuro dark:text-custom-celeste hover:border-custom-azul-oscuro dark:hover:border-custom-celeste hover:bg-custom-azul-oscuro/5 dark:hover:bg-custom-celeste/10 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
              aria-label="Imprimir listado completo"
            >
              <Printer className="h-4 w-4" />
              Imprimir / PDF
            </button>
          </Tooltip>

          <Tooltip text="Descargar listado en CSV" position="left">
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
            <Tooltip text="Registrar un nuevo instructor en la institución" position="left">
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
          value={demoState === 'empty' ? 0 : kpis.total}
          icon={Users}
          trend="+5%"
          trendType="up"
          colorClass="border-custom-azul-oscuro"
          iconColorClass="text-custom-azul-oscuro bg-custom-azul-oscuro/10"
          description="registrados en la institución"
        />
        <StatCard 
          title="Docentes Activos"
          value={demoState === 'empty' ? 0 : kpis.activos}
          icon={UserCheck}
          trend="+10%"
          trendType="up"
          colorClass="border-custom-celeste"
          iconColorClass="text-custom-celeste bg-custom-celeste/10"
          description="dictando cursos actualmente"
        />
        <StatCard 
          title="En Licencia"
          value={demoState === 'empty' ? 0 : kpis.licencia}
          icon={AlertTriangle}
          trend="0%"
          trendType="neutral"
          colorClass="border-custom-amarillo"
          iconColorClass="text-yellow-600 bg-custom-amarillo/10"
          description="ausencias justificadas"
        />
        <StatCard 
          title="Docentes Inactivos"
          value={demoState === 'empty' ? 0 : kpis.inactivos}
          icon={UserX}
          trend="-1%"
          trendType="down"
          colorClass="border-custom-gris-claro"
          iconColorClass="text-custom-gris-claro bg-custom-gris-claro/10"
          description="dados de baja / sin cursos"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gris-claro dark:text-slate-400"
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
              className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
              aria-label="Filtrar por Estado"
            >
              <option value="">Estado: Todos</option>
              <option value="1">Activo</option>
              <option value="3">En Licencia</option>
              <option value="2">Inactivo</option>
            </select>

            <select
              value={filterEspecialidad}
              onChange={(e) => setFilterEspecialidad(e.target.value)}
              className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
              aria-label="Filtrar por Especialidad"
            >
              <option value="">Especialidad: Todas</option>
              <option value="Diseño & Frontend">Diseño & Frontend</option>
              <option value="Programación & IA">Programación & IA</option>
              <option value="Bases de Datos & Backend">Bases de Datos & Backend</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Diseño UX/UI">Diseño UX/UI</option>
            </select>
          </div>

          {/* Clear Filters indicator */}
          {isAnyFilterActive && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/60 transition-colors w-full lg:w-auto justify-center cursor-pointer"
              aria-label="Limpiar todos los filtros"
            >
              <FilterX className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Main Instructors Data Table */}
      <InstructoresDataTable 
        instructores={filteredInstructors}
        loading={demoState === 'loading'}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteTrigger}
        onResetFilters={handleResetFilters}
        onAddInstructor={() => setIsAddOpen(true)}
        userRole={userRole}
      />

      {/* Floating simulator control */}
      <StatusController 
        currentState={demoState}
        onChangeState={setDemoState}
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
      />

      {/* Drawer: Form to Edit an Existing Instructor */}
      <InstructorFormDrawer 
        instructor={editInstructor}
        isOpen={!!editInstructor}
        onClose={() => setEditInstructor(null)}
        onSubmit={handleFormSubmit}
        userRole={userRole}
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
