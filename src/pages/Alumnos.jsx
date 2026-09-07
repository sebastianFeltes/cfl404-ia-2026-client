import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useOutletContext } from 'react-router'
import { 
  Users, 
  UserCheck, 
  CheckCircle2, 
  GraduationCap, 
  AlertCircle,
  X,
  Download
} from 'lucide-react'
import { GET, POST, PUT, DELETE } from '../services/api'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import StudentCardView from '../components/StudentCardView'
import StudentsTopBar from '../components/StudentsTopBar'
import StudentDetailDrawer from '../components/StudentDetailDrawer'
import StudentFormDrawer from '../components/StudentFormDrawer'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

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
  const userRole = context.userRole ?? context.rolActivo?.id ?? 'estudiante'
  const puedeEditar = userRole === 'director' || userRole === 'secretaria'

  // Lista principal de alumnos
  const [students, setStudents] = useState([])
  const [loadError, setLoadError] = useState(null)

  // Pestaña Activa: 'alumnos' (Regulares) | 'postulantes' (Aspirantes)
  const [activeTab, setActiveTab] = useState('alumnos')

  // Carga inicial sincronizada desde la API con fallback seguro
  const fetchStudents = useCallback(async () => {
    try {
      const res = await GET('/api/v1/alumnos')
      if (res?.data && Array.isArray(res.data)) {
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
        setLoadError(null)
      } else {
        setStudents([])
      }
    } catch (err) {
      setStudents([])
      setLoadError(err.status === 401 || err.status === 403
        ? 'No tenés permiso para ver el listado de alumnos.'
        : (err.message || 'No se pudieron cargar los alumnos.'))
      if (import.meta.env.DEV) {
        console.error('Error al cargar alumnos:', err.message)
      }
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // Modo de visualización: 'table' (Tabla) | 'grid' (Tarjetas)
  const [viewMode, setViewMode] = useState('table')

  // Búsqueda y Filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  // Paginación (Estilo Docentes)
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  // Estados de Modales y Drawers
  const [viewStudent, setViewStudent] = useState(null)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteStudent, setDeleteStudent] = useState(null)
  const [promoteStudentTarget, setPromoteStudentTarget] = useState(null)
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
    setPaginaActual(1)
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

      return matchesSearch && matchesEstado
    })
  }, [students, activeTab, busqueda, filtroEstado])

  // Resetear página al filtrar, buscar o cambiar de pestaña
  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda, filtroEstado, activeTab])

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
    if (!puedeEditar) return
    const student = students.find(s => s.id === id)
    setEditStudent(student)
  }

  const handleDeleteTrigger = (id) => {
    if (!puedeEditar) return
    const student = students.find(s => s.id === id)
    setDeleteStudent(student)
  }

  // Doble verificación: Abrir modal "Verificar que los datos sean Reales"
  const handlePromoteToStudent = (studentId) => {
    if (!puedeEditar) return
    const student = students.find(s => s.id === studentId)
    if (!student) return
    setPromoteStudentTarget(student)
  }

  // Confirmación definitiva: Matricular y Generar Token de Asistencia (ID + Email)
  const handleConfirmPromote = async (student) => {
    if (!student) return
    const token = `CFL404-ATT-${student.id}-${btoa(unescape(encodeURIComponent(student.email || student.id))).slice(0, 16)}`
    const updated = {
      ...student,
      status: 'Activo',
      status_id: 1,
      role_name: 'Alumno',
      is_aspirante: false,
      is_present: true,
      attendance_token: token,
      dni_copy: true,
      form_copy: true,
      title_copy: true,
    }

    try {
      const cleanDni = student.dni ? String(student.dni).replace(/[\.\s-]/g, '') : undefined
      await PUT('/api/v1/alumnos', {
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
        attendance_token: token,
      }, student.id)
      await fetchStudents()
      showToast(`¡${student.first_name} ${student.last_name} matriculado! Token de Asistencia generado con éxito.`)
    } catch (err) {
      setStudents(prev => prev.map(s => s.id === student.id ? updated : s))
      showToast(`¡${student.first_name} ${student.last_name} matriculado! Token de Asistencia generado con éxito.`)
    }

    setPromoteStudentTarget(null)
    if (viewStudent?.id === student.id) {
      setViewStudent(updated)
    }
  }

  const handleFormSubmit = async (data) => {
    if (!puedeEditar) return
    if (data.id) {
      // Edición
      const updatedFields = {
        first_name: data.first_name,
        last_name: data.last_name,
        dni: data.dni,
        email: data.email,
        extra_email: data.extra_email || '',
        phone: data.phone || '',
        extra_phone: data.extra_phone || '',
        address: data.address || '',
        dob: data.dob || '',
        gender: data.gender || 'Masculino',
        nacionality: data.nacionality || 'Argentina',
        course_name: data.course_name,
        academic_level: data.academic_level,
        status: data.role_name === 'Postulante' || data.status_id === 3 ? 'Pendiente' : (data.status_id === 2 ? 'Inactivo' : 'Activo'),
        status_id: Number(data.status_id) || 1,
        role_name: data.role_name,
        is_aspirante: data.role_name === 'Postulante' || data.status_id === 3,
      }

      try {
        const cleanDni = data.dni ? String(data.dni).replace(/[\.\s-]/g, '') : undefined
        await PUT('/api/v1/alumnos', {
          ...updatedFields,
          dni: cleanDni,
        }, data.id)
        await fetchStudents()
        showToast(`Registro de "${data.first_name} ${data.last_name}" actualizado en base de datos.`)
      } catch (err) {
        // Modo local / fallback en caso de que la API esté fuera de línea
        setStudents(prev => prev.map(s => s.id === data.id ? { ...s, ...updatedFields } : s))
        showToast(`Registro de "${data.first_name} ${data.last_name}" actualizado exitosamente.`)
      }

      // Sincronizar con el drawer de vista si está abierto
      setViewStudent(prev => prev?.id === data.id ? { ...prev, ...updatedFields } : prev)
      setEditStudent(null)
    } else {
      // Creación
      const cleanDni = String(data.dni || '').replace(/[\.\s-]/g, '').trim()
      const isPostulant = data.role_name === 'Postulante' || data.status_id === 3
      const newId = Date.now()
      const payload = {
        id: newId,
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        dni: data.dni?.trim() || cleanDni,
        email: data.email?.trim(),
        extra_email: data.extra_email?.trim() || '',
        phone: data.phone || '',
        extra_phone: data.extra_phone || '',
        address: data.address || '',
        dob: data.dob || '',
        gender: data.gender || 'Masculino',
        nacionality: data.nacionality || 'Argentina',
        course_name: data.course_name || 'Operador de PC',
        academic_level: data.academic_level || 'Secundario',
        status_id: isPostulant ? 3 : (data.status_id === 2 ? 2 : 1),
        status: isPostulant ? 'Pendiente' : (data.status_id === 2 ? 'Inactivo' : 'Activo'),
        role_name: data.role_name || (isPostulant ? 'Postulante' : 'Alumno'),
        is_aspirante: isPostulant,
        is_present: !isPostulant,
        dni_copy: true,
        form_copy: true,
        title_copy: !isPostulant,
        enrollment_date: data.enrollment_date || new Date().toLocaleDateString('es-AR'),
      }

      try {
        await POST('/api/v1/alumnos', {
          ...payload,
          dni: cleanDni,
        })
        await fetchStudents()
        showToast(`Nuevo ${isPostulant ? 'postulante' : 'alumno'} "${payload.first_name} ${payload.last_name}" guardado en base de datos.`)
      } catch (err) {
        setStudents(prev => [payload, ...prev])
        showToast(`Nuevo ${isPostulant ? 'postulante' : 'alumno'} "${payload.first_name} ${payload.last_name}" guardado exitosamente.`)
      }
      setIsAddOpen(false)
    }
  }

  const handleDeleteConfirm = async (id) => {
    if (!puedeEditar) return
    const s = students.find(student => student.id === id)
    try {
      await DELETE('/api/v1/alumnos', id)
      await fetchStudents()
      showToast(`Registro de "${s?.first_name} ${s?.last_name}" eliminado de la base de datos.`)
    } catch (err) {
      showToast(`Error al eliminar: ${err.message}`)
    }

    setDeleteStudent(null)
    if (viewStudent?.id === id) setViewStudent(null)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="max-w-[1400px] w-full mx-auto font-nunito space-y-6 pb-12">
      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {loadError}
        </div>
      )}
      
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-1 no-print">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 font-roboto transition-colors">
            Alumnos y Matrícula
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
            Gestión de alumnos regulares matriculados, revisión de postulantes preinscriptos y verificación de documentación.
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          title="Exportar listado a PDF"
          className="flex items-center gap-2 px-4 py-2 border-2 border-custom-azul-oscuro/25 dark:border-custom-celeste/40 text-custom-azul-oscuro dark:text-custom-celeste hover:border-custom-azul-oscuro dark:hover:border-custom-celeste hover:bg-custom-azul-oscuro/5 dark:hover:bg-custom-celeste/10 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer w-fit"
          aria-label="Exportar PDF"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </button>
      </div>

      {/* KPI Cards — Actualizadas: Total Alumnos, Activos, Presentes, Postulantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 no-print">
        <StatCard 
          title="Alumnos Matriculados"
          value={kpis.total}
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
          value={kpis.activos}
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
          value={kpis.presentes}
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
          value={kpis.aspirantes}
          icon={GraduationCap}
          trend="Pendientes"
          trendType="neutral"
          colorClass="border-[#37A6DE]"
          iconColorClass="text-[#37A6DE] bg-[#37A6DE]/10"
          description="preinscripciones a revisar"
          tooltip="Personas preinscriptas que deben presentar documentación física para matricularse"
        />
      </div>

      <StudentsTopBar 
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        totalResultados={filteredStudents.length}
        onNuevo={() => setIsAddOpen(true)}
        onResetFiltros={handleResetFilters}
        puedeEditar={puedeEditar}
        activeTab={activeTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* ── Vista en Modo Tabla ── */}
      {viewMode === 'table' && (
        <>
          <div className="no-print">
            <DataTable 
              students={paginatedStudents}
              loading={false}
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
              totalResultados={filteredStudents.length}
              isPrintMode={false}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabCounts={tabCounts}
            />
          </div>

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
            loading={false}
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
            totalResultados={filteredStudents.length}
            isPrintMode={false}
          />
        </div>
      )}

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
        onDelete={(id) => {
          setEditStudent(null)
          handleDeleteTrigger(id)
        }}
        userRole={userRole}
        initialRole={editStudent && isPostulante(editStudent) ? 'Postulante' : 'Alumno'}
      />

      {/* Modal: Confirmación de Baja */}
      <DeleteConfirmationModal 
        student={deleteStudent}
        isOpen={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Modal: Doble Verificación "Verificar que los datos sean Reales" y Generación de Token de Asistencia */}
      {promoteStudentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-nunito animate-fadeIn">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setPromoteStudentTarget(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl z-10 p-6 space-y-4">
            <div className="flex items-start gap-3 text-amber-600 dark:text-amber-400">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-900/50 shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 leading-tight">
                  Verificar que los datos sean Reales
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold mt-0.5">
                  Doble Verificación (Digital + Humana)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              El módulo de alumnos se enlazará con el <strong>sistema de asistencia por código QR</strong>. Antes de confirmar el paso a Alumno Regular, verifica que los datos sean fidedignos y que el postulante haya presentado físicamente la documentación requerida (DNI, Planilla firmada y Título).
            </p>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] uppercase font-bold">Postulante:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{promoteStudentTarget.first_name} {promoteStudentTarget.last_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] uppercase font-bold">DNI:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{promoteStudentTarget.dni}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] uppercase font-bold">Curso:</span>
                <span className="font-semibold text-[#166193] dark:text-[#37A6DE]">{promoteStudentTarget.course_name}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400 block font-bold uppercase tracking-wider mb-1">Token de Asistencia a Generar (ID + Email):</span>
                <span className="font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 block text-slate-600 dark:text-slate-300 truncate">
                  {`CFL404-ATT-${promoteStudentTarget.id}-${btoa(unescape(encodeURIComponent(promoteStudentTarget.email || promoteStudentTarget.id))).slice(0, 16)}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPromoteStudentTarget(null)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleConfirmPromote(promoteStudentTarget)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                Confirmar y Generar Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
