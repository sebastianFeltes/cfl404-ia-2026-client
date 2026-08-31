import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useOutletContext } from 'react-router'
import { 
  Users, 
  UserCheck, 
  CheckCircle2, 
  GraduationCap, 
  AlertCircle,
  X
} from 'lucide-react'
import { GET, POST, PUT, DELETE } from '../services/api'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import StudentCardView from '../components/StudentCardView'
import StudentsTopBar from '../components/StudentsTopBar'
import StatusController from '../components/StatusController'
import StudentDetailDrawer from '../components/StudentDetailDrawer'
import StudentFormDrawer from '../components/StudentFormDrawer'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

const INITIAL_MOCK_STUDENTS = [
  {
    id: 101,
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan.perez@gmail.com',
    extra_email: 'jperez.trabajo@outlook.com',
    dni: '34.567.890',
    status_id: 1, // Activo
    is_present: true,
    is_aspirante: false,
    role_name: 'Alumno',
    phone: '11-4567-8901',
    extra_phone: '11-4567-0099',
    address: 'Calle 12 N° 450, Berisso',
    dob: '12/04/1998',
    gender: 'Masculino',
    nacionality: 'Argentina',
    academic_level: 'Secundario',
    course_name: 'Operador de PC',
    enrollment_date: '10/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: true
  },
  {
    id: 102,
    first_name: 'María',
    last_name: 'González',
    email: 'maria.g@hotmail.com',
    extra_email: 'mgonzalez@gmail.com',
    dni: '36.123.456',
    status_id: 1, // Activo
    is_present: true,
    is_aspirante: false,
    role_name: 'Alumno',
    phone: '11-5555-1234',
    extra_phone: '11-5555-4321',
    address: 'Av. Montevideo 1240, Berisso',
    dob: '25/08/1995',
    gender: 'Femenino',
    nacionality: 'Argentina',
    academic_level: 'Terciario',
    course_name: 'Programador Web',
    enrollment_date: '12/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: true
  },
  {
    id: 103,
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    email: 'carlos.rod@yahoo.com',
    extra_email: 'carlos.rdz@empresa.com',
    dni: '32.987.654',
    status_id: 2, // Inactivo
    is_present: false,
    is_aspirante: false,
    role_name: 'Egresado',
    phone: '11-9876-5432',
    extra_phone: '11-9876-1122',
    address: 'Calle 8 N° 890, Ensenada',
    dob: '03/11/1990',
    gender: 'Masculino',
    nacionality: 'Argentina',
    academic_level: 'Secundario',
    course_name: 'Electricista Matriculado',
    enrollment_date: '15/01/2025',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: true
  },
  {
    id: 104,
    first_name: 'Ana',
    last_name: 'Martínez',
    email: 'ana.mtz@gmail.com',
    extra_email: 'ana.disenadora@gmail.com',
    dni: '40.111.222',
    status_id: 1, // Activo
    is_present: true,
    is_aspirante: false,
    role_name: 'Alumno',
    phone: '11-2222-3333',
    extra_phone: '11-2222-7777',
    address: 'Calle 168 y 18, Berisso',
    dob: '19/02/2001',
    gender: 'Femenino',
    nacionality: 'Argentina',
    academic_level: 'Universitario',
    course_name: 'Diseño Gráfico Digital',
    enrollment_date: '05/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: true
  },
  {
    id: 105,
    first_name: 'Luis',
    last_name: 'Fernández',
    email: 'luis.fer@outlook.com',
    extra_email: 'lfer_contacto@gmail.com',
    dni: '38.444.555',
    status_id: 3, // Suspendido
    is_present: false,
    is_aspirante: false,
    role_name: 'Alumno',
    phone: '11-3333-4444',
    extra_phone: '11-3333-8888',
    address: 'Calle 25 N° 340, La Plata',
    dob: '08/07/1997',
    gender: 'Masculino',
    nacionality: 'Argentina',
    academic_level: 'Secundario',
    course_name: 'Operador de PC',
    enrollment_date: '10/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: false
  },
  {
    id: 106,
    first_name: 'Laura',
    last_name: 'Gómez',
    email: 'laura.g@gmail.com',
    extra_email: 'laurita_g@gmail.com',
    dni: '42.666.777',
    status_id: 1, // Activo
    is_present: false,
    is_aspirante: true, // Aspirante
    role_name: 'Aspirante',
    phone: '11-6666-7777',
    extra_phone: '11-6666-2211',
    address: 'Calle 60 N° 110, Berisso',
    dob: '14/09/2003',
    gender: 'Femenino',
    nacionality: 'Argentina',
    academic_level: 'Terciario',
    course_name: 'Programador Web',
    enrollment_date: '01/06/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: false,
    title_copy: true
  },
  {
    id: 107,
    first_name: 'Miguel',
    last_name: 'Sánchez',
    email: 'miguel.s@gmail.com',
    extra_email: 'msanchez_taller@gmail.com',
    dni: '30.888.999',
    status_id: 2, // Inactivo
    is_present: false,
    is_aspirante: false,
    role_name: 'Egresado',
    phone: '11-7777-8888',
    extra_phone: '11-7777-3344',
    address: 'Calle 13 N° 612, Berisso',
    dob: '30/03/1987',
    gender: 'Masculino',
    nacionality: 'Argentina',
    academic_level: 'Universitario',
    course_name: 'Electricista Matriculado',
    enrollment_date: '20/06/2024',
    profile_photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: true
  },
  {
    id: 108,
    first_name: 'Sofía',
    last_name: 'Díaz',
    email: 'sofia.diaz@gmail.com',
    extra_email: 'sofia_diaz99@hotmail.com',
    dni: '45.000.111',
    status_id: 3, // Suspendido
    is_present: false,
    is_aspirante: false,
    role_name: 'Alumno',
    phone: '11-8888-9999',
    extra_phone: '11-8888-0011',
    address: 'Calle 157 N° 920, Berisso',
    dob: '17/12/2004',
    gender: 'Femenino',
    nacionality: 'Argentina',
    academic_level: 'Secundario',
    course_name: 'Diseño Gráfico Digital',
    enrollment_date: '14/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: false
  },
  {
    id: 109,
    first_name: 'Esteban',
    last_name: 'Quispe',
    email: 'esteban.quispe@gmail.com',
    extra_email: 'esteban.q@outlook.com',
    dni: '41.234.567',
    status_id: 1, // Activo
    is_present: true,
    is_aspirante: false,
    role_name: 'Alumno',
    phone: '11-4411-2233',
    extra_phone: '11-4411-9988',
    address: 'Calle 7 N° 1205, Ensenada',
    dob: '05/01/2000',
    gender: 'Masculino',
    nacionality: 'Argentina',
    academic_level: 'Secundario',
    course_name: 'Operador de PC',
    enrollment_date: '10/03/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: true
  },
  {
    id: 110,
    first_name: 'Florencia',
    last_name: 'Morales',
    email: 'flor.morales@gmail.com',
    extra_email: 'florencia.m@gmail.com',
    dni: '43.789.012',
    status_id: 1, // Activo
    is_present: false,
    is_aspirante: true, // Aspirante
    role_name: 'Aspirante',
    phone: '11-9900-1122',
    extra_phone: '11-9900-3344',
    address: 'Calle 22 N° 780, Berisso',
    dob: '22/06/2002',
    gender: 'Femenino',
    nacionality: 'Argentina',
    academic_level: 'Secundario',
    course_name: 'Diseño Gráfico Digital',
    enrollment_date: '02/06/2026',
    profile_photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    dni_copy: true,
    form_copy: true,
    title_copy: true
  }
]

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

export default function Alumnos() {
  const context = useOutletContext() || {}
  const userRole = context.userRole ?? context.rolActivo?.id ?? 'director'
  const puedeEditar = userRole === 'director' || userRole === 'secretaria'

  // Lista principal de alumnos
  const [students, setStudents] = useState(INITIAL_MOCK_STUDENTS)

  // Pestaña Activa: 'alumnos' (Regulares) | 'postulantes' (Aspirantes)
  const [activeTab, setActiveTab] = useState('alumnos')

  // Carga inicial sincronizada desde la API con fallback seguro
  const fetchStudents = useCallback(async () => {
    try {
      const res = await GET('/api/alumnos')
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const apiStudents = res.data.map(item => {
          const roleUpper = String(item.role_name || '').toUpperCase()
          const statusUpper = String(item.status || '').toUpperCase()
          const isAsp = Boolean(item.is_aspirante) || roleUpper === 'POSTULANTE' || roleUpper === 'ASPIRANTE' || item.status_id === 3 || statusUpper === 'PENDIENTE'
          return {
            ...item,
            status_id: item.status === 'Inactivo' ? 2 : isAsp ? 3 : 1,
            is_present: item.is_present ?? !isAsp,
            is_aspirante: isAsp,
            role_name: item.role_name ?? (isAsp ? 'Postulante' : 'Alumno'),
            dni_copy: item.studentDetail?.dniCopy ?? true,
            form_copy: item.studentDetail?.formCopy ?? true,
            title_copy: item.studentDetail?.titleCopy ?? (!isAsp),
            academic_level: item.studentDetail?.academicLevel ?? 'Secundario',
            course_name: item.course || 'Sin curso',
          }
        })
        setStudents(apiStudents)
      }
    } catch (err) {
      console.log('Modo local / Mock activo:', err.message)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // Modo de visualización: 'table' (Tabla) | 'grid' (Tarjetas)
  const [viewMode, setViewMode] = useState('table')

  // Controlador de demostración de estados ('success', 'loading', 'empty')
  const [demoState, setDemoState] = useState('success')

  // Búsqueda y Filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroNivel, setFiltroNivel] = useState('todos')

  // Paginación (Estilo Docentes)
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  // Estados de Modales y Drawers
  const [viewStudent, setViewStudent] = useState(null)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteStudent, setDeleteStudent] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Toast / Notificaciones
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Restablecer filtros
  const handleResetFilters = () => {
    setBusqueda('')
    setFiltroEstado('todos')
    setFiltroNivel('todos')
    setPaginaActual(1)
    setDemoState('success')
    showToast('Filtros restablecidos correctamente.')
  }

  // Contadores por pestaña
  const tabCounts = useMemo(() => {
    const totalAlumnos = students.filter(s => !isPostulante(s)).length
    const totalPostulantes = students.filter(s => isPostulante(s)).length
    return { alumnos: totalAlumnos, postulantes: totalPostulantes }
  }, [students])

  // Filtrado de alumnos
  const filteredStudents = useMemo(() => {
    if (demoState === 'empty') return []

    return students.filter((student) => {
      // Separación por pestaña: Alumnos vs Postulantes
      const studentIsPostulante = isPostulante(student)
      if (activeTab === 'alumnos' && studentIsPostulante) return false
      if (activeTab === 'postulantes' && !studentIsPostulante) return false

      // Filtro de texto
      const searchLower = busqueda.toLowerCase().trim()
      const matchesSearch = searchLower === '' ||
        student.first_name?.toLowerCase().includes(searchLower) ||
        student.last_name?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.dni?.includes(searchLower) ||
        student.course_name?.toLowerCase().includes(searchLower)

      // Filtro de estado
      let matchesEstado = true
      if (filtroEstado === 'activo') {
        matchesEstado = student.status_id === 1 && !studentIsPostulante
      } else if (filtroEstado === 'presente') {
        matchesEstado = !!student.is_present && !studentIsPostulante
      } else if (filtroEstado === 'aspirante' || filtroEstado === 'postulante') {
        matchesEstado = studentIsPostulante
      } else if (filtroEstado === 'inactivo') {
        matchesEstado = student.status_id === 2
      } else if (filtroEstado === 'suspendido') {
        matchesEstado = student.status_id === 3
      }

      // Filtro de nivel académico
      const matchesNivel = filtroNivel === 'todos' || student.academic_level === filtroNivel

      return matchesSearch && matchesEstado && matchesNivel
    })
  }, [students, demoState, activeTab, busqueda, filtroEstado, filtroNivel])

  // Resetear página al filtrar, buscar o cambiar de pestaña
  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda, filtroEstado, filtroNivel, demoState, activeTab])

  // Segmentación paginada para la tabla en pantalla
  const paginatedStudents = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina
    return filteredStudents.slice(inicio, inicio + itemsPorPagina)
  }, [filteredStudents, paginaActual, itemsPorPagina])

  // Cálculo de KPIs
  const kpis = useMemo(() => {
    const alumnosRegulares = students.filter(s => !isPostulante(s))
    const total = alumnosRegulares.length
    const activos = alumnosRegulares.filter(s => s.status_id === 1).length
    const presentes = alumnosRegulares.filter(s => s.is_present).length
    const postulantes = students.filter(s => isPostulante(s)).length

    return { total, activos, presentes, aspirantes: postulantes }
  }, [students])

  // Callbacks de CRUD
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

  // Matricular / Promover a Alumno regular
  const handlePromoteToStudent = async (studentId) => {
    const student = students.find(s => s.id === studentId)
    if (!student) return
    try {
      const cleanDni = student.dni ? String(student.dni).replace(/[\.\s-]/g, '') : undefined
      await PUT('/api/alumnos', {
        first_name: student.first_name,
        last_name: student.last_name,
        dni: cleanDni,
        email: student.email,
        phone: student.phone,
        course_name: student.course_name,
        academic_level: student.academic_level,
        status: 'Activo',
        status_id: 1,
        role_name: 'Alumno',
      }, studentId)
      await fetchStudents()
      showToast(`¡${student.first_name} ${student.last_name} fue matriculado como Alumno regular exitosamente!`)
      setViewStudent(null)
    } catch (err) {
      showToast(`Error al matricular alumno: ${err.message}`)
    }
  }

  const handleFormSubmit = async (data) => {
    if (data.id) {
      // Edición
      try {
        const cleanDni = data.dni ? String(data.dni).replace(/[\.\s-]/g, '') : undefined
        await PUT('/api/alumnos', {
          first_name: data.first_name,
          last_name: data.last_name,
          dni: cleanDni,
          email: data.email,
          phone: data.phone,
          course_name: data.course_name,
          academic_level: data.academic_level,
          status: data.role_name === 'Postulante' || data.status_id === 3 ? 'Pendiente' : (data.status_id === 2 ? 'Inactivo' : 'Activo'),
          role_name: data.role_name,
        }, data.id)
        await fetchStudents()
        showToast(`Registro de "${data.first_name} ${data.last_name}" actualizado en base de datos.`)
        setEditStudent(null)
      } catch (err) {
        showToast(`Error al actualizar: ${err.message}`)
      }
    } else {
      // Creación
      try {
        const cleanDni = String(data.dni || '').replace(/[\.\s-]/g, '').trim()
        const isPostulant = data.role_name === 'Postulante' || data.status_id === 3
        const payload = {
          first_name: data.first_name?.trim(),
          last_name: data.last_name?.trim(),
          dni: cleanDni,
          email: data.email?.trim(),
          phone: data.phone || '',
          course_name: data.course_name || 'Operador de PC',
          academic_level: data.academic_level || 'Secundario',
          status: isPostulant ? 'Pendiente' : (data.status_id === 2 ? 'Inactivo' : 'Activo'),
          role_name: data.role_name || (isPostulant ? 'Postulante' : 'Alumno'),
        }

        await POST('/api/alumnos', payload)
        await fetchStudents()
        showToast(`Nuevo ${isPostulant ? 'postulante' : 'alumno'} "${payload.first_name} ${payload.last_name}" guardado exitosamente.`)
        setIsAddOpen(false)
      } catch (err) {
        showToast(`Error al registrar: ${err.message}`)
      }
    }
  }

  const handleDeleteConfirm = async (id) => {
    const s = students.find(student => student.id === id)
    try {
      await DELETE('/api/alumnos', id)
      await fetchStudents()
      showToast(`Registro de "${s?.first_name} ${s?.last_name}" eliminado de la base de datos.`)
    } catch (err) {
      showToast(`Error al eliminar: ${err.message}`)
    }

    setDeleteStudent(null)
    if (viewStudent?.id === id) setViewStudent(null)
  }

  // Exportación CSV
  const handleExportCSV = () => {
    const headers = "ID,Nombre,Apellido,DNI,Email,Teléfono,Curso,Rol,Estado\n"
    const rows = filteredStudents.map(s => 
      `"${s.id}","${s.first_name}","${s.last_name}","${s.dni}","${s.email}","${s.phone || ''}","${s.course_name || ''}","${s.role_name || ''}","${s.status_id === 1 ? 'Activo' : s.status_id === 2 ? 'Inactivo' : 'Pendiente'}"`
    ).join("\n")
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${activeTab === 'postulantes' ? 'Postulantes' : 'Alumnos'}_CFL404_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exportación CSV completada con éxito.')
  }

  const handleExportIndividual = (id) => {
    const s = students.find(student => student.id === id)
    showToast(`Generando Ficha Académica PDF para: ${s?.first_name} ${s?.last_name}...`)
  }

  return (
    <div className="max-w-[1400px] w-full mx-auto font-nunito space-y-6 pb-12">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1E1C] text-white border border-[#37A6DE] px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <AlertCircle className="h-4 w-4 text-[#FDEA14] shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Encabezado de Página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 font-roboto transition-colors">
            Alumnos y Matrícula
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
            Gestión de alumnos regulares matriculados, revisión de postulantes preinscriptos y verificación de documentación.
          </p>
        </div>
      </div>

      {/* KPI Cards — Actualizadas: Total Alumnos, Activos, Presentes, Postulantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Alumnos Matriculados"
          value={demoState === 'empty' ? 0 : kpis.total}
          icon={Users}
          trend="+8%"
          trendType="up"
          colorClass="border-[#166193]"
          iconColorClass="text-[#166193] bg-[#166193]/10"
          description="con documentación validada"
          tooltip="Total general de alumnos regulares inscriptos con legajo completo"
        />
        <StatCard 
          title="Alumnos Activos"
          value={demoState === 'empty' ? 0 : kpis.activos}
          icon={UserCheck}
          trend="+12%"
          trendType="up"
          colorClass="border-emerald-500"
          iconColorClass="text-emerald-600 bg-emerald-500/10"
          description="cursando con regularidad"
          tooltip="Alumnos con cursada vigente y asistencia regular"
        />
        <StatCard 
          title="Alumnos Presentes"
          value={demoState === 'empty' ? 0 : kpis.presentes}
          icon={CheckCircle2}
          trend="85%"
          trendType="up"
          colorClass="border-[#37A6DE]"
          iconColorClass="text-[#166193] bg-[#37A6DE]/15"
          description="asistencia en aula hoy"
          tooltip="Alumnos que registraron presencia en sus respectivas clases"
        />
        <StatCard 
          title="Alumnos Postulantes"
          value={demoState === 'empty' ? 0 : kpis.aspirantes}
          icon={GraduationCap}
          trend="Pendientes"
          trendType="neutral"
          colorClass="border-[#37A6DE]"
          iconColorClass="text-[#37A6DE] bg-[#37A6DE]/10"
          description="preinscripciones a revisar"
          tooltip="Personas preinscriptas que deben presentar documentación física para matricularse"
        />
      </div>

      {/* Card Principal: TopBar + Visualización (Tabla o Tarjetas) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-xl overflow-hidden transition-colors duration-200">
        
        {/* TopBar sobre la tabla con selector de modo de vista y simulador */}
        <StudentsTopBar 
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          filtroNivel={filtroNivel}
          setFiltroNivel={setFiltroNivel}
          totalResultados={demoState === 'empty' ? 0 : filteredStudents.length}
          onNuevo={() => setIsAddOpen(true)}
          onExportarCSV={handleExportCSV}
          onResetFiltros={handleResetFilters}
          puedeEditar={puedeEditar}
          activeTab={activeTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          demoState={demoState}
          setDemoState={setDemoState}
        />

        {/* ── Vista en Modo Tabla ── */}
        {viewMode === 'table' && (
          <>
            {/* Tabla en Pantalla (Paginada) con Pestañas Alumnos vs Postulantes */}
            <div className="no-print">
              <DataTable 
                students={paginatedStudents}
                loading={demoState === 'loading'}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteTrigger}
                onPromote={handlePromoteToStudent}
                onResetFilters={handleResetFilters}
                onAddStudent={() => setIsAddOpen(true)}
                userRole={userRole}
                paginaActual={paginaActual}
                itemsPorPagina={itemsPorPagina}
                setPaginaActual={setPaginaActual}
                setItemsPorPagina={setItemsPorPagina}
                totalResultados={demoState === 'empty' ? 0 : filteredStudents.length}
                isPrintMode={false}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabCounts={tabCounts}
              />
            </div>

            {/* Tabla para Impresión / PDF (Completa) */}
            <div className="print-only">
              <DataTable 
                students={filteredStudents}
                loading={false}
                onView={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                onPromote={() => {}}
                onResetFilters={() => {}}
                onAddStudent={() => {}}
                userRole={userRole}
                paginaActual={1}
                itemsPorPagina={filteredStudents.length}
                setPaginaActual={() => {}}
                setItemsPorPagina={() => {}}
                totalResultados={filteredStudents.length}
                isPrintMode={true}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabCounts={tabCounts}
              />
            </div>
          </>
        )}

        {/* ── Vista en Modo Tarjetas / Grid ── */}
        {viewMode === 'grid' && (
          <div className="no-print">
            <StudentCardView 
              students={paginatedStudents}
              loading={demoState === 'loading'}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteTrigger}
              onPromote={handlePromoteToStudent}
              onResetFilters={handleResetFilters}
              onAddStudent={() => setIsAddOpen(true)}
              userRole={userRole}
              activeTab={activeTab}
              paginaActual={paginaActual}
              itemsPorPagina={itemsPorPagina}
              setPaginaActual={setPaginaActual}
              setItemsPorPagina={setItemsPorPagina}
              totalResultados={demoState === 'empty' ? 0 : filteredStudents.length}
              isPrintMode={false}
            />
          </div>
        )}

      </div>

      {/* Drawer: Detalle Personal y Académico del Alumno (Estilo Docentes) */}
      <StudentDetailDrawer 
        student={viewStudent}
        isOpen={!!viewStudent}
        onClose={() => setViewStudent(null)}
        onEdit={(id) => {
          setViewStudent(null)
          handleEdit(id)
        }}
        onDelete={(id) => {
          handleDeleteTrigger(id)
        }}
        onPromote={handlePromoteToStudent}
        onExport={handleExportIndividual}
        userRole={userRole}
      />

      {/* Drawer: Formulario de Alta de Nuevo Alumno / Postulante */}
      <StudentFormDrawer 
        student={null}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleFormSubmit}
        userRole={userRole}
        initialRole={activeTab === 'postulantes' ? 'Postulante' : 'Alumno'}
      />

      {/* Drawer: Formulario de Edición de Alumno Existente */}
      <StudentFormDrawer 
        student={editStudent}
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        onSubmit={handleFormSubmit}
        userRole={userRole}
        initialRole={editStudent && isPostulante(editStudent) ? 'Postulante' : 'Alumno'}
      />

      {/* Modal: Confirmación de Eliminación */}
      <DeleteConfirmationModal 
        student={deleteStudent}
        isOpen={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
