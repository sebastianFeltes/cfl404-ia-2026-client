import React, { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router'
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  FilterX, 
  X, 
  AlertCircle 
} from 'lucide-react'
import StatCard from '../components/StatCard'
import NuevoCursoModal from '../components/NuevoCursoModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { fetchCourses, addCourseService, removeCourseService } from '../services/coursesService'

const COLS = [
  { label: 'Curso', width: '28%', align: 'left' },
  { label: 'Categoría', width: '14%', align: 'left' },
  { label: 'Horario y Días', width: '22%', align: 'left' },
  { label: 'Horas / Cupos', width: '16%', align: 'left' },
  { label: 'Estado', width: '12%', align: 'left' },
  { label: 'Acciones', width: '8%', align: 'right' }
]

export default function CursosAdmin() {
  const context = useOutletContext()
  const puedeEditar = context?.puedeEditar ?? true

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Pagination States
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  // Modals & Triggers
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [deleteCourse, setDeleteCourse] = useState(null)
  const [viewCourse, setViewCourse] = useState(null)

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Load courses on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchCourses()
      setCourses(data)
      setLoading(false)
    }
    loadData()
  }, [])

  // Filters logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch = searchLower === '' ||
        course.name.toLowerCase().includes(searchLower) ||
        (course.category && course.category.toLowerCase().includes(searchLower)) ||
        (course.staff && course.staff.toLowerCase().includes(searchLower))

      const matchesStage = filterStage === '' || course.stageKey === filterStage
      const matchesCategory = filterCategory === '' || course.category === filterCategory
      const matchesStatus = filterStatus === '' || course.status?.id === Number(filterStatus)

      return matchesSearch && matchesStage && matchesCategory && matchesStatus
    })
  }, [courses, searchTerm, filterStage, filterCategory, filterStatus])

  // Reset page when filters change
  useEffect(() => {
    setPaginaActual(1)
  }, [searchTerm, filterStage, filterCategory, filterStatus])

  // Pagination slice
  const paginatedCourses = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina
    return filteredCourses.slice(inicio, inicio + itemsPorPagina)
  }, [filteredCourses, paginaActual, itemsPorPagina])

  const totalPaginas = Math.ceil(filteredCourses.length / itemsPorPagina)

  // KPIs dynamic calculation
  const kpis = useMemo(() => {
    const total = courses.length
    const activos = courses.filter(c => c.status?.id === 1 || c.status?.id === 2).length
    const vacantesTotales = courses.reduce((acc, curr) => acc + (curr.detail?.quota || 0), 0)
    const horasTotales = courses.reduce((acc, curr) => acc + (curr.detail?.hour_quantity || 0), 0)

    return { total, activos, vacantesTotales, horasTotales }
  }, [courses])

  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterStage('')
    setFilterCategory('')
    setFilterStatus('')
    showToast('Filtros restablecidos correctamente.')
  }

  // Create or Update course
  const handleSaveCourse = async (courseData) => {
    if (courseData.id) {
      // Edit
      setCourses(prev => prev.map(c => c.id === courseData.id ? courseData : c))
      showToast(`Curso "${courseData.name}" actualizado correctamente.`)
    } else {
      // Add
      const nextId = courses.length > 0 ? Math.max(...courses.map(c => typeof c.id === 'number' ? c.id : 0)) + 1 : 101
      const newCourse = {
        ...courseData,
        id: nextId
      }
      await addCourseService(newCourse)
      setCourses(prev => [newCourse, ...prev])
      showToast(`Nuevo curso "${newCourse.name}" agregado con éxito a la base de datos.`)
    }
  }

  // Confirm delete course
  const handleDeleteConfirm = async () => {
    if (!deleteCourse) return
    await removeCourseService(deleteCourse.id)
    setCourses(prev => prev.filter(c => c.id !== deleteCourse.id))
    showToast(`Se ha eliminado el curso "${deleteCourse.name}".`)
    setDeleteCourse(null)
  }

  const isAnyFilterActive = searchTerm !== '' || filterStage !== '' || filterCategory !== '' || filterStatus !== ''

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-roboto relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white border border-custom-celeste px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-xs">
          <AlertCircle className="h-4.5 w-4.5 text-[#FDEA14] animate-pulse" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2 font-nunito">
        <div>
          <h2 className="font-roboto font-extrabold text-3xl text-slate-900 dark:text-slate-100 tracking-tight">
            Gestión de Cursos y Oferta Educativa
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Administración interna de la oferta formativa, vacantes, asignaciones e inscripciones.
          </p>
        </div>

        {puedeEditar && (
          <button
            onClick={() => { setEditingCourse(null); setIsAddOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 bg-[#166193] hover:bg-[#166193]/90 text-white shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#FDEA14]" />
            + Nuevo Curso
          </button>
        )}
      </div>

      {/* KPI Cards (Alumnos style with StatCard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-nunito">
        <StatCard 
          title="Total Cursos"
          value={loading ? '...' : kpis.total}
          icon={BookOpen}
          trend="+5%"
          trendType="up"
          colorClass="border-[#166193]"
          iconColorClass="text-[#166193] bg-[#166193]/10"
          description="ofertas registradas"
        />
        <StatCard 
          title="Cursos Activos"
          value={loading ? '...' : kpis.activos}
          icon={CheckCircle2}
          trend="+10%"
          trendType="up"
          colorClass="border-[#37A6DE]"
          iconColorClass="text-[#37A6DE] bg-[#37A6DE]/10"
          description="con vacantes o abiertos"
        />
        <StatCard 
          title="Cupos Disponibles"
          value={loading ? '...' : kpis.vacantesTotales}
          icon={Users}
          trend="Disponibles"
          trendType="neutral"
          colorClass="border-emerald-500"
          iconColorClass="text-emerald-600 bg-emerald-500/10"
          description="vacantes en comisión"
        />
        <StatCard 
          title="Horas Cátedra"
          value={loading ? '...' : `${kpis.horasTotales} hs`}
          icon={Clock}
          trend="Plan de Estudio"
          trendType="neutral"
          colorClass="border-amber-500"
          iconColorClass="text-amber-600 bg-amber-500/10"
          description="dictado institucional"
        />
      </div>

      {/* TopBar / Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-4 space-y-4 font-nunito">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar curso, categoría o docente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 focus:outline-none focus:border-[#166193]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters Selects */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto flex-1 max-w-2xl">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-[#166193] cursor-pointer"
            >
              <option value="">Etapa: Todas</option>
              <option value="segunda">Segunda Etapa</option>
              <option value="primera">Primera Etapa</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-[#166193] cursor-pointer"
            >
              <option value="">Categoría: Todas</option>
              <option value="Oficios">Oficios</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Emprendimiento">Emprendimiento</option>
              <option value="Servicios">Servicios</option>
              <option value="Administración">Administración</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-[#166193] cursor-pointer"
            >
              <option value="">Estado: Todos</option>
              <option value="1">Cupos disponibles</option>
              <option value="2">Últimos cupos</option>
              <option value="3">Cupo completo</option>
              <option value="4">Finalizado</option>
            </select>
          </div>

          {/* Reset Filters */}
          {isAnyFilterActive && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold border border-red-200 transition-colors w-full lg:w-auto justify-center cursor-pointer"
            >
              <FilterX className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}

        </div>
      </div>

      {/* Main Table Card (InstructoresTabla style) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden font-nunito">
        
        {/* Table Header */}
        <div className="flex items-center px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {COLS.map((col) => (
            <div
              key={col.label}
              style={{ width: col.width }}
              className={`text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold ${
                col.align === 'right' ? 'text-right' : 'text-left'
              }`}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">Cargando cursos desde la base de datos...</div>
        ) : paginatedCourses.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">No se encontraron cursos registrados.</div>
        ) : (
          <div className="flex flex-col">
            {paginatedCourses.map((course) => (
              <div
                key={course.id}
                className="group flex items-center px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Curso Name & Image */}
                <div style={{ width: COLS[0].width }} className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/Herreria.webp';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate hover:text-[#166193] cursor-pointer" onClick={() => setViewCourse(course)}>
                      {course.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {course.stage || 'Segunda Etapa'}
                    </p>
                  </div>
                </div>

                {/* Categoría */}
                <div style={{ width: COLS[1].width }}>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {course.category}
                  </span>
                </div>

                {/* Horario y Días */}
                <div style={{ width: COLS[2].width }}>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {course.schedule}
                  </span>
                </div>

                {/* Horas / Cupos */}
                <div style={{ width: COLS[3].width }}>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {course.detail?.hour_quantity || 120} hs cátedra
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Cupo: {course.detail?.quota ?? 0} vacantes
                  </p>
                </div>

                {/* Estado Badge */}
                <div style={{ width: COLS[4].width }}>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${course.status?.color}`}>
                    {course.status?.label}
                  </span>
                </div>

                {/* Acciones */}
                <div style={{ width: COLS[5].width }} className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => setViewCourse(course)}
                    title="Ver detalle del curso"
                    className="p-1.5 rounded-md text-slate-400 hover:text-[#166193] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Eye size={15} />
                  </button>

                  {puedeEditar && (
                    <>
                      <button
                        onClick={() => { setEditingCourse(course); setIsAddOpen(true); }}
                        title="Editar curso"
                        className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => setDeleteCourse(course)}
                        title="Eliminar / Quitar curso"
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Mostrar</span>
            <select
              value={itemsPorPagina}
              onChange={(e) => {
                setItemsPorPagina(Number(e.target.value))
                setPaginaActual(1)
              }}
              className="h-7 px-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>por página</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span>
              Mostrando <strong>{filteredCourses.length === 0 ? 0 : (paginaActual - 1) * itemsPorPagina + 1}</strong> a{' '}
              <strong>{Math.min(paginaActual * itemsPorPagina, filteredCourses.length)}</strong> de{' '}
              <strong>{filteredCourses.length}</strong> resultados
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Agregar / Editar Curso */}
      <NuevoCursoModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleSaveCourse}
        initialData={editingCourse}
      />

      {/* Modal: Confirmación de Eliminación de Curso */}
      {deleteCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-nunito animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 dark:bg-red-950/50 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-roboto">
                ¿Eliminar Curso?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ¿Está seguro de que desea eliminar el curso <strong>"{deleteCourse.name}"</strong> de la base de datos institucional? Esta acción removerá el registro de la oferta educativa.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md cursor-pointer"
              >
                Sí, Eliminar Curso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Drawer: Ver Ficha Completa del Curso */}
      {viewCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-nunito animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setViewCourse(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <img
                src={viewCourse.image}
                alt={viewCourse.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {viewCourse.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-roboto mt-0.5">
                  {viewCourse.name}
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p><strong>Descripción:</strong> {viewCourse.detail?.description || 'Sin descripción.'}</p>
              <p><strong>Horarios:</strong> {viewCourse.schedule}</p>
              <p><strong>Carga Horaria:</strong> {viewCourse.detail?.hour_quantity || 120} hs ({viewCourse.detail?.classes_quantity || 32} clases)</p>
              <p><strong>Vacantes Disponibles:</strong> {viewCourse.detail?.quota || 0}</p>
              <p><strong>Requisito de Título:</strong> {viewCourse.detail?.title_required || 'Primario completo'}</p>
              <p><strong>Aval Institucional:</strong> {viewCourse.detail?.endorsement_by || 'CFP 404 Berisso'}</p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewCourse(null)}
                className="px-4 py-2 bg-[#166193] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
