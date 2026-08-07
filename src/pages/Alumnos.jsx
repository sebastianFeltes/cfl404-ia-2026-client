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
  FilterX
} from 'lucide-react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import StatusController from '../components/StatusController'
import Tooltip from '../components/Tooltip'

// New sub-components V3
import StudentDetailDrawer from '../components/StudentDetailDrawer'
import StudentFormDrawer from '../components/StudentFormDrawer'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

const INITIAL_MOCK_STUDENTS = [
  {
    id: 101,
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan.perez@gmail.com',
    dni: '34.567.890',
    status_id: 1, // Activo
    role_name: 'Alumno',
    phone: '11-4567-8901',
    academic_level: 'Secundario',
    course_name: 'Operador de PC',
    enrollment_date: '10/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 102,
    first_name: 'María',
    last_name: 'González',
    email: 'maria.g@hotmail.com',
    dni: '36.123.456',
    status_id: 1, // Activo
    role_name: 'Alumno',
    phone: '11-5555-1234',
    academic_level: 'Terciario',
    course_name: 'Programador Web',
    enrollment_date: '12/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 103,
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    email: 'carlos.rod@yahoo.com',
    dni: '32.987.654',
    status_id: 2, // Inactivo
    role_name: 'Egresado',
    phone: '11-9876-5432',
    academic_level: 'Secundario',
    course_name: 'Electricista Matriculado',
    enrollment_date: '15/01/2025',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 104,
    first_name: 'Ana',
    last_name: 'Martínez',
    email: 'ana.mtz@gmail.com',
    dni: '40.111.222',
    status_id: 1, // Activo
    role_name: 'Alumno',
    phone: '11-2222-3333',
    academic_level: 'Universitario',
    course_name: 'Diseño Gráfico Digital',
    enrollment_date: '05/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 105,
    first_name: 'Luis',
    last_name: 'Fernández',
    email: 'luis.fer@outlook.com',
    dni: '38.444.555',
    status_id: 3, // Suspendido
    role_name: 'Alumno',
    phone: '11-3333-4444',
    academic_level: 'Secundario',
    course_name: 'Operador de PC',
    enrollment_date: '10/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 106,
    first_name: 'Laura',
    last_name: 'Gómez',
    email: 'laura.g@gmail.com',
    dni: '42.666.777',
    status_id: 1, // Activo
    role_name: 'Postulante',
    phone: '11-6666-7777',
    academic_level: 'Terciario',
    course_name: 'Programador Web',
    enrollment_date: '01/06/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 107,
    first_name: 'Miguel',
    last_name: 'Sánchez',
    email: 'miguel.s@gmail.com',
    dni: '30.888.999',
    status_id: 2, // Inactivo
    role_name: 'Egresado',
    phone: '11-7777-8888',
    academic_level: 'Universitario',
    course_name: 'Electricista Matriculado',
    enrollment_date: '20/06/2024',
    profile_photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 108,
    first_name: 'Sofía',
    last_name: 'Díaz',
    email: 'sofia.diaz@gmail.com',
    dni: '45.000.111',
    status_id: 3, // Suspendido
    role_name: 'Alumno',
    phone: '11-8888-9999',
    academic_level: 'Secundario',
    course_name: 'Diseño Gráfico Digital',
    enrollment_date: '14/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
]

function Alumnos() {
  // Access shared role metadata from layout context
  const { userRole } = useOutletContext()

  // Main CRUD Students State List
  const [students, setStudents] = useState(INITIAL_MOCK_STUDENTS)

  // Demo state controller ('success', 'loading', 'empty')
  const [demoState, setDemoState] = useState('success')

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('') 
  const [filterRol, setFilterRol] = useState('')
  const [filterNivel, setFilterNivel] = useState('')

  // Modals & Sliding Drawer triggers
  const [viewStudent, setViewStudent] = useState(null)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteStudent, setDeleteStudent] = useState(null)
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
    setFilterNivel('')
    showToast('Filtros restablecidos correctamente.')
  }

  // Filter Logic based on interactive select/search values
  const filteredStudents = useMemo(() => {
    if (demoState === 'empty') return []
    
    return students.filter((student) => {
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch = searchLower === '' || 
        student.first_name.toLowerCase().includes(searchLower) ||
        student.last_name.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.dni.includes(searchLower)

      const matchesEstado = filterEstado === '' || student.status_id === Number(filterEstado)
      const matchesRol = filterRol === '' || student.role_name === filterRol
      const matchesNivel = filterNivel === '' || student.academic_level === filterNivel

      return matchesSearch && matchesEstado && matchesRol && matchesNivel
    })
  }, [students, demoState, searchTerm, filterEstado, filterRol, filterNivel])

  // Count overall KPIs dynamically based on the current state list
  const kpis = useMemo(() => {
    const total = students.length
    const activos = students.filter(s => s.status_id === 1).length
    const inactivos = students.filter(s => s.status_id === 2).length
    const suspendidos = students.filter(s => s.status_id === 3).length

    return { total, activos, inactivos, suspendidos }
  }, [students])

  // CRUD event callbacks
  const handleView = (id) => {
    const student = students.find(s => s.id === id)
    setViewStudent(student)
  }

  const handleEdit = (id) => {
    const student = students.find(s => s.id === id)
    setEditStudent(student)
  }

  const handleDeleteTrigger = (id) => {
    const student = students.find(s => s.id === id)
    setDeleteStudent(student)
  }

  // Submitting changes (Add or Edit)
  const handleFormSubmit = (data) => {
    if (data.id) {
      // Edit operation
      setStudents(prev => prev.map(s => s.id === data.id ? data : s))
      showToast(`Alumno "${data.first_name} ${data.last_name}" actualizado en el listado.`)
      setEditStudent(null)
    } else {
      // Add operation
      const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 101
      const newStudent = {
        ...data,
        id: nextId
      }
      setStudents(prev => [newStudent, ...prev])
      showToast(`Nuevo alumno "${newStudent.first_name} ${newStudent.last_name}" agregado con éxito.`)
      setIsAddOpen(false)
    }
  }

  // Confirm deletion
  const handleDeleteConfirm = (id) => {
    const s = students.find(student => student.id === id)
    setStudents(prev => prev.filter(student => student.id !== id))
    showToast(`Se ha eliminado el registro de "${s.first_name} ${s.last_name}".`)
    setDeleteStudent(null)
  }

  // File simulations
  const handleExportList = () => {
    showToast('Exportación del listado general iniciada: Descargando archivo "Alumnos_CFL404.csv"...')
  }

  const handleExportIndividual = (id) => {
    const s = students.find(student => student.id === id)
    showToast(`Generando Ficha de Alumno PDF para: ${s.first_name} ${s.last_name}...`)
  }

  const isAnyFilterActive = searchTerm !== '' || filterEstado !== '' || filterRol !== '' || filterNivel !== ''
  const canCreate = userRole === 'director' || userRole === 'secretaria'

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
          <h2 className="font-nunito font-extrabold text-3xl text-custom-azul-oscuro tracking-tight">
            Alumnos
          </h2>
          <p className="text-sm font-medium text-custom-gris-claro mt-1">
            Gestión del alumnado, inscripciones a cursos, estados académicos y datos de contacto de la institución.
          </p>
        </div>
        
        {/* Main Action buttons */}
        <div className="flex items-center gap-3">
          <Tooltip text="Descargar listado filtrado en CSV" position="left">
            <button
              onClick={handleExportList}
              className="flex items-center gap-2 px-4 py-2 border-2 border-custom-azul-oscuro/25 text-custom-azul-oscuro hover:border-custom-azul-oscuro hover:bg-custom-azul-oscuro/5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
              aria-label="Exportar listado completo"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </Tooltip>
          
          {canCreate && (
            <Tooltip text="Registrar un nuevo alumno en la institución" position="left">
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white hover:shadow-md cursor-pointer"
                aria-label="Agregar nuevo alumno"
              >
                <UserPlus className="h-4 w-4 text-custom-amarillo" />
                + Nuevo Alumno
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Alumnos"
          value={demoState === 'empty' ? 0 : kpis.total}
          icon={Users}
          trend="+8%"
          trendType="up"
          colorClass="border-custom-azul-oscuro"
          iconColorClass="text-custom-azul-oscuro bg-custom-azul-oscuro/10"
          description="registrados en sistema"
        />
        <StatCard 
          title="Alumnos Activos"
          value={demoState === 'empty' ? 0 : kpis.activos}
          icon={UserCheck}
          trend="+12%"
          trendType="up"
          colorClass="border-custom-celeste"
          iconColorClass="text-custom-celeste bg-custom-celeste/10"
          description="cursando actualmente"
        />
        <StatCard 
          title="Alumnos Inactivos"
          value={demoState === 'empty' ? 0 : kpis.inactivos}
          icon={UserX}
          trend="-2%"
          trendType="down"
          colorClass="border-custom-gris-claro"
          iconColorClass="text-custom-gris-claro bg-custom-gris-claro/10"
          description="egresados / no activos"
        />
        <StatCard 
          title="Suspendidos"
          value={demoState === 'empty' ? 0 : kpis.suspendidos}
          icon={AlertTriangle}
          trend="0%"
          trendType="neutral"
          colorClass="border-custom-amarillo"
          iconColorClass="text-yellow-600 bg-custom-amarillo/10"
          description="alertas / regularidad"
        />
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white rounded-xl shadow-xs border border-custom-gris-claro/10 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Text Input Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-gris-claro" />
            <input 
              type="text"
              placeholder="Buscar por nombre, DNI o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-custom-gris-claro/20 rounded-lg text-xs text-custom-gris-oscuro focus:outline-none focus:border-custom-azul-oscuro bg-gray-50/50 font-medium"
              aria-label="Buscar alumnos"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gris-claro"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Select Dropdown Filters */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto flex-1 max-w-2xl">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs bg-white text-custom-gris-oscuro font-semibold focus:outline-none focus:border-custom-azul-oscuro cursor-pointer"
              aria-label="Filtrar por Estado"
            >
              <option value="">Estado: Todos</option>
              <option value="1">Activo</option>
              <option value="2">Inactivo</option>
              <option value="3">Suspendido</option>
            </select>

            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs bg-white text-custom-gris-oscuro font-semibold focus:outline-none focus:border-custom-azul-oscuro cursor-pointer"
              aria-label="Filtrar por Rol"
            >
              <option value="">Rol: Todos</option>
              <option value="Alumno">Alumno</option>
              <option value="Egresado">Egresado</option>
              <option value="Postulante">Postulante</option>
            </select>

            <select
              value={filterNivel}
              onChange={(e) => setFilterNivel(e.target.value)}
              className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs bg-white text-custom-gris-oscuro font-semibold focus:outline-none focus:border-custom-azul-oscuro cursor-pointer"
              aria-label="Filtrar por Nivel Académico"
            >
              <option value="">Nivel: Todos</option>
              <option value="Secundario">Secundario</option>
              <option value="Terciario">Terciario</option>
              <option value="Universitario">Universitario</option>
            </select>
          </div>

          {/* Clear Filters indicator */}
          {isAnyFilterActive && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold border border-red-200 transition-colors w-full lg:w-auto justify-center cursor-pointer"
              aria-label="Limpiar todos los filtros"
            >
              <FilterX className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Main Student Data Table */}
      <DataTable 
        students={filteredStudents}
        loading={demoState === 'loading'}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteTrigger}
        onResetFilters={handleResetFilters}
        onAddStudent={() => setIsAddOpen(true)}
        userRole={userRole}
      />

      {/* Floating simulator control */}
      <StatusController 
        currentState={demoState}
        onChangeState={setDemoState}
      />

      {/* Drawer: Detailed view panel */}
      <StudentDetailDrawer 
        student={viewStudent}
        isOpen={!!viewStudent}
        onClose={() => setViewStudent(null)}
        onExport={handleExportIndividual}
      />

      {/* Drawer: Form to Register a New Student */}
      <StudentFormDrawer 
        student={null}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleFormSubmit}
        userRole={userRole}
      />

      {/* Drawer: Form to Edit an Existing Student */}
      <StudentFormDrawer 
        student={editStudent}
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        onSubmit={handleFormSubmit}
        userRole={userRole}
      />

      {/* Modal: Delete Confirmation Dialog */}
      <DeleteConfirmationModal 
        student={deleteStudent}
        isOpen={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default Alumnos
