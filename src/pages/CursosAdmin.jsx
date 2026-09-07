import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useOutletContext } from 'react-router'
import {
  BookOpen,
  CheckCircle2,
  Users,
  Search,
  Plus,
  Eye,
  Pencil,
  FilterX,
  X,
  AlertCircle,
  Calendar,
  Printer,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import Tooltip from '../components/Tooltip'
import CourseFormDrawer from '../components/cursos/CourseFormDrawer'
import CourseDetailDrawer from '../components/cursos/CourseDetailDrawer'
import CourseDeleteModal from '../components/cursos/CourseDeleteModal'
import {
  fetchCourses,
  fetchFamilies,
  fetchDays,
  fetchInstructorsForCourses,
  addCourseService,
  updateCourseService,
  deactivateCourseService,
} from '../services/coursesService'
import { courseMatchesStage, getCourseStageFromDates, toDateInputValue } from '../utils/courseStage'
import { canCrud } from '../utils/roles'

const COLS = [
  { label: 'Curso', width: '26%', align: 'left' },
  { label: 'Familia', width: '12%', align: 'left' },
  { label: 'Instructor', width: '16%', align: 'left' },
  { label: 'Horario y Días', width: '18%', align: 'left' },
  { label: 'Cupos', width: '10%', align: 'left' },
  { label: 'Estado', width: '10%', align: 'left' },
  { label: 'Acciones', width: '8%', align: 'right' },
]

export default function CursosAdmin() {
  const context = useOutletContext()
  const puedeEditar = canCrud(context?.user?.rol || context?.userRole)

  const [courses, setCourses] = useState([])
  const [families, setFamilies] = useState([])
  const [days, setDays] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterFamily, setFilterFamily] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [deleteCourse, setDeleteCourse] = useState(null)
  const [viewCourse, setViewCourse] = useState(null)
  const [printCourse, setPrintCourse] = useState(null)

  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [coursesData, familiesData, daysData, instructorsData] = await Promise.all([
        fetchCourses(),
        fetchFamilies(),
        fetchDays(),
        fetchInstructorsForCourses(),
      ])
      setCourses(coursesData)
      setFamilies(familiesData)
      setDays(daysData)
      setInstructors(instructorsData)
    } catch (error) {
      showToast(error.message || 'No se pudieron cargar los cursos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    const handleAfterPrint = () => setPrintCourse(null)
    window.addEventListener('afterprint', handleAfterPrint)
    return () => window.removeEventListener('afterprint', handleAfterPrint)
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchLower = searchTerm.toLowerCase().trim()
      const familyName = course.family?.name || course.category || ''
      const instructorName = course.instructorName || course.staff || ''
      const matchesSearch = searchLower === '' ||
        (course.name || '').toLowerCase().includes(searchLower) ||
        familyName.toLowerCase().includes(searchLower) ||
        instructorName.toLowerCase().includes(searchLower) ||
        (course.sponsor?.name && course.sponsor.name.toLowerCase().includes(searchLower))

      const matchesStage = courseMatchesStage(course, filterStage)
      const matchesFamily = filterFamily === '' || String(course.familyId) === String(filterFamily) || familyName === filterFamily
      const matchesStatus = filterStatus === '' || Number(course.statusId || course.status?.id) === Number(filterStatus)

      return matchesSearch && matchesStage && matchesFamily && matchesStatus
    })
  }, [courses, searchTerm, filterStage, filterFamily, filterStatus])

  useEffect(() => {
    setPaginaActual(1)
  }, [searchTerm, filterStage, filterFamily, filterStatus])

  const paginatedCourses = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina
    return filteredCourses.slice(inicio, inicio + itemsPorPagina)
  }, [filteredCourses, paginaActual, itemsPorPagina])

  const totalPaginas = Math.ceil(filteredCourses.length / itemsPorPagina) || 1

  const kpis = useMemo(() => {
    const total = courses.length
    const activos = courses.filter((c) => Number(c.statusId || c.status?.id) === 1).length
    const vacantesTotales = courses.reduce((acc, curr) => acc + (curr.availableQuota ?? curr.detail?.quota ?? 0), 0)
    const primeraCount = courses.filter((c) => courseMatchesStage(c, 'primera')).length
    const segundaCount = courses.filter((c) => courseMatchesStage(c, 'segunda')).length
    return { total, activos, vacantesTotales, primeraCount, segundaCount }
  }, [courses])

  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterStage('')
    setFilterFamily('')
    setFilterStatus('')
    showToast('Filtros restablecidos correctamente.')
  }

  const handleSaveCourse = async (courseData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      if (courseData.id) {
        const updated = await updateCourseService(courseData.id, courseData)
        setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        showToast(`Curso "${updated.name}" actualizado correctamente.`)
        setEditingCourse(null)
      } else {
        const created = await addCourseService(courseData)
        setCourses((prev) => [created, ...prev])
        showToast(`Nuevo curso "${created.name}" agregado con éxito.`)
        setIsAddOpen(false)
      }
    } catch (error) {
      showToast(error.message || 'No se pudo guardar el curso')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeactivateConfirm = async () => {
    const target = deleteCourse
    if (!target) return
    try {
      const updated = await deactivateCourseService(target.id)
      setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      showToast(`Se dio de baja el curso "${updated.name}".`)
      setDeleteCourse(null)
      setViewCourse(null)
      setEditingCourse(null)
    } catch (error) {
      showToast(error.message || 'No se pudo dar de baja el curso')
    }
  }

  const handlePrintList = () => {
    setPrintCourse(null)
    setTimeout(() => window.print(), 50)
  }

  const isAnyFilterActive = searchTerm !== '' || filterStage !== '' || filterFamily !== '' || filterStatus !== ''
  const printSource = printCourse ? [printCourse] : filteredCourses

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-roboto relative">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white border border-custom-celeste px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-xs no-print">
          <AlertCircle className="h-4.5 w-4.5 text-[#FDEA14] animate-pulse" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="print-only mb-4">
        <h1 className="text-xl font-extrabold text-slate-900">
          {printCourse ? `Ficha de curso — ${printCourse.name}` : 'Oferta educativa CFL 404'}
        </h1>
        <p className="text-xs text-slate-500">
          {printCourse
            ? `Familia: ${printCourse.family?.name || printCourse.category || '—'} · Instructor: ${printCourse.instructorName || printCourse.staff}`
            : `${filteredCourses.length} cursos · generado ${new Date().toLocaleDateString('es-AR')}`}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2 font-nunito no-print">
        <div>
          <h2 className="font-roboto font-extrabold text-3xl text-slate-900 dark:text-slate-100 tracking-tight">
            Gestión de Cursos y Oferta Educativa
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Familias, instructores, etapas lectivas (marzo-julio / julio-diciembre) y vacantes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip text="Imprimir o exportar el listado filtrado a PDF" position="bottom">
            <button
              onClick={handlePrintList}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-custom-azul-oscuro/25 text-custom-azul-oscuro hover:bg-custom-azul-oscuro/5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Exportar PDF
            </button>
          </Tooltip>
          {puedeEditar && (
            <button
              onClick={() => { setEditingCourse(null); setIsAddOpen(true) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 bg-[#166193] hover:bg-[#166193]/90 text-white shadow-md hover:shadow-lg cursor-pointer"
            >
              <Plus className="h-4 w-4 text-[#FDEA14]" />
              + Agregar Curso
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-nunito no-print">
        <StatCard
          title="Total de Cursos"
          value={loading ? '...' : kpis.total}
          icon={BookOpen}
          trend="Base de Datos"
          trendType="up"
          colorClass="border-[#166193]"
          iconColorClass="text-[#166193] bg-[#166193]/10"
          description="ofertas registradas"
        />
        <StatCard
          title="Cursos Activos"
          value={loading ? '...' : kpis.activos}
          icon={CheckCircle2}
          trend="Estado ACTIVO"
          trendType="up"
          colorClass="border-[#37A6DE]"
          iconColorClass="text-[#37A6DE] bg-[#37A6DE]/10"
          description="en dictado"
        />
        <StatCard
          title="Cupos Disponibles"
          value={loading ? '...' : kpis.vacantesTotales}
          icon={Users}
          trend="Vacantes"
          trendType="neutral"
          colorClass="border-emerald-500"
          iconColorClass="text-emerald-600 bg-emerald-500/10"
          description="cupo menos inscriptos"
        />
        <StatCard
          title="Segunda Etapa"
          value={loading ? '...' : `${kpis.segundaCount} cursos`}
          icon={Calendar}
          trend="Julio - Diciembre"
          trendType="neutral"
          colorClass="border-amber-500"
          iconColorClass="text-amber-600 bg-amber-500/10"
          description={`${kpis.primeraCount} en primera etapa`}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-2 font-nunito no-print">
        <span className="text-xs font-bold text-slate-500 px-3 uppercase tracking-wider">Filtrar por Etapa:</span>
        {[
          { key: '', label: `Todas las Etapas (${courses.length})` },
          { key: 'segunda', label: 'Segunda etapa (Julio - Diciembre)' },
          { key: 'primera', label: 'Primera etapa (Marzo - Julio)' },
          { key: 'anual', label: 'Anual / Dictado Continuo' },
        ].map((tab) => (
          <button
            key={tab.key || 'all'}
            onClick={() => setFilterStage(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStage === tab.key
                ? 'bg-[#166193] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-4 space-y-4 font-nunito no-print">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por curso, familia, instructor o patrocinador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 focus:outline-none focus:border-[#166193]"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto flex-1 max-w-lg">
            <select
              value={filterFamily}
              onChange={(e) => setFilterFamily(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-[#166193] cursor-pointer"
            >
              <option value="">Familia: Todas</option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>{family.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-[#166193] cursor-pointer"
            >
              <option value="">Estado: Todos</option>
              <option value="1">Activo</option>
              <option value="2">Inactivo</option>
              <option value="3">Pendiente</option>
              <option value="4">Finalizado</option>
            </select>
          </div>

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

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden font-nunito no-print">
        <div className="flex items-center px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold no-print">
          {COLS.map((col) => (
            <div
              key={col.label}
              style={{ width: col.width }}
              className={`text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300 ${
                col.align === 'right' ? 'text-right' : 'text-left'
              }`}
            >
              {col.label}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">Cargando cursos desde la base de datos...</div>
        ) : paginatedCourses.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">No se encontraron cursos con los filtros seleccionados.</div>
        ) : (
          <div className="flex flex-col">
            {paginatedCourses.map((course) => {
              const stage = getCourseStageFromDates(course)
              return (
                <div
                  key={course.id}
                  className="group flex items-center px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div style={{ width: COLS[0].width }} className="min-w-0 pr-2">
                    <p
                      className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug hover:text-[#166193] cursor-pointer"
                      onClick={() => setViewCourse(course)}
                    >
                      {course.name}
                    </p>
                    <span className="text-[10px] font-semibold text-[#166193] bg-[#166193]/10 px-1.5 py-0.5 rounded inline-block mt-0.5">
                      {stage?.label || course.stage || 'Sin etapa'}
                    </span>
                  </div>

                  <div style={{ width: COLS[1].width }}>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {course.family?.name || course.category || '—'}
                    </span>
                  </div>

                  <div style={{ width: COLS[2].width }} className="text-xs text-slate-600 dark:text-slate-300 font-medium pr-2 truncate">
                    {course.instructorName || course.staff || 'Sin instructor'}
                  </div>

                  <div style={{ width: COLS[3].width }} className="text-xs text-slate-600 dark:text-slate-300 font-medium pr-2">
                    {course.schedule}
                  </div>

                  <div style={{ width: COLS[4].width }}>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {course.availableQuota ?? course.detail?.quota ?? 0} vacantes
                    </span>
                  </div>

                  <div style={{ width: COLS[5].width }}>
                    <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-full border shadow-2xs whitespace-nowrap ${course.status?.color}`}>
                      {course.status?.label}
                    </span>
                  </div>

                  <div style={{ width: COLS[6].width }} className="flex items-center justify-end gap-1 no-print">
                    <button
                      onClick={() => setViewCourse(course)}
                      title="Ver detalle del curso"
                      className="p-1.5 rounded-md text-slate-400 hover:text-[#166193] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Eye size={15} />
                    </button>
                    {puedeEditar && (
                      <button
                        onClick={() => { setIsAddOpen(false); setEditingCourse(course) }}
                        title="Editar curso"
                        className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs no-print">
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
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-50 cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas || filteredCourses.length === 0}
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-50 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="print-only">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left border-b py-2">Curso</th>
              <th className="text-left border-b py-2">Familia</th>
              <th className="text-left border-b py-2">Instructor</th>
              <th className="text-left border-b py-2">Etapa</th>
              <th className="text-left border-b py-2">Horario</th>
              <th className="text-left border-b py-2">Cupos</th>
              <th className="text-left border-b py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {printSource.map((course) => (
              <tr key={course.id}>
                <td className="py-1.5 border-b">{course.name}</td>
                <td className="py-1.5 border-b">{course.family?.name || course.category || '—'}</td>
                <td className="py-1.5 border-b">{course.instructorName || course.staff}</td>
                <td className="py-1.5 border-b">{getCourseStageFromDates(course)?.label || course.stage}</td>
                <td className="py-1.5 border-b">{course.schedule}</td>
                <td className="py-1.5 border-b">{course.availableQuota ?? 0}</td>
                <td className="py-1.5 border-b">{course.status?.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {printCourse && (
          <div className="mt-4 space-y-1 text-sm">
            <p><strong>Inicio:</strong> {toDateInputValue(printCourse.startDate || printCourse.start_date)}</p>
            <p><strong>Fin:</strong> {toDateInputValue(printCourse.endDate || printCourse.end_time)}</p>
            <p><strong>Descripción:</strong> {printCourse.detail?.description}</p>
            <p><strong>Aval:</strong> {printCourse.detail?.endorsement_by}</p>
          </div>
        )}
      </div>

      {(isAddOpen || !!editingCourse) && (
        <CourseFormDrawer
          course={editingCourse}
          isOpen={isAddOpen || !!editingCourse}
          onClose={() => {
            setIsAddOpen(false)
            setEditingCourse(null)
          }}
          onSubmit={handleSaveCourse}
          onDeactivate={(course) => {
            setIsAddOpen(false)
            setEditingCourse(null)
            setDeleteCourse(course)
          }}
          families={families}
          instructors={instructors}
          days={days}
          isSubmitting={isSubmitting}
          isReadOnly={!puedeEditar}
        />
      )}

      <CourseDetailDrawer
        course={viewCourse}
        isOpen={!!viewCourse}
        onClose={() => setViewCourse(null)}
        onEdit={(course) => {
          setViewCourse(null)
          setEditingCourse(course)
        }}
        onDeactivate={(course) => {
          setViewCourse(null)
          setDeleteCourse(course)
        }}
        hasCrud={puedeEditar}
      />

      <CourseDeleteModal
        course={deleteCourse}
        isOpen={!!deleteCourse}
        onClose={() => setDeleteCourse(null)}
        onConfirm={handleDeactivateConfirm}
      />
    </div>
  )
}
