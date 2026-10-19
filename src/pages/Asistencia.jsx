import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useOutletContext } from 'react-router'
import {
  ClipboardCheck,
  ShieldX,
  Users,
  CalendarDays,
  BookOpen,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import AttendanceGrid from '../components/asistencia/AttendanceGrid'
import { GET, PATCH } from '../services/api'
import { canonicalRole, canReadAttendance } from '../utils/roles'

const API_COURSES = '/api/attendance/courses'

function NoAccessBanner({ userRole }) {
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
          Tu rol no tiene permisos para visualizar la planilla de asistencia.
        </p>
      </div>
    </div>
  )
}

export default function Asistencia() {
  const { user, userRole } = useOutletContext() || {}
  const accessRole = canonicalRole(user?.rol || userRole)
  const hasAccess = canReadAttendance(accessRole)
  const canMark = ['god', 'director', 'regente', 'secretaria', 'preceptoria'].includes(accessRole)

  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [gridData, setGridData] = useState(null)
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingGrid, setLoadingGrid] = useState(false)
  const [error, setError] = useState(null)

  const fetchCourses = useCallback(async () => {
    if (!hasAccess) return
    try {
      setLoadingCourses(true)
      setError(null)
      const response = await GET(API_COURSES)
      const list = response.data || []
      setCourses(list)
      if (list.length > 0 && !selectedCourseId) {
        setSelectedCourseId(list[0].id)
      }
    } catch (err) {
      setError(err.message || 'Error al cargar cursos')
    } finally {
      setLoadingCourses(false)
    }
  }, [hasAccess, selectedCourseId])

  const fetchGrid = useCallback(async (courseId) => {
    if (!hasAccess || !courseId) return
    try {
      setLoadingGrid(true)
      setError(null)
      const response = await GET(`/api/attendance/course/${courseId}`)
      setGridData(response)
    } catch (err) {
      setError(err.message || 'Error al cargar asistencia del curso')
      setGridData(null)
    } finally {
      setLoadingGrid(false)
    }
  }, [hasAccess])

  const handleMark = async (student, date, code) => {
    if (!selectedCourseId || !student.user_course_id) return
    try {
      await PATCH(`/api/attendance/course/${selectedCourseId}/mark`, {
        userCourseId: student.user_course_id,
        date,
        code,
      })
      await fetchGrid(selectedCourseId)
    } catch (err) {
      setError(err.message || 'No se pudo corregir la asistencia')
    }
  }

  useEffect(() => {
    if (!hasAccess) {
      setLoadingCourses(false)
      return
    }
    fetchCourses()
  }, [fetchCourses, hasAccess])

  useEffect(() => {
    if (selectedCourseId) fetchGrid(selectedCourseId)
  }, [selectedCourseId, fetchGrid])

  const kpis = useMemo(() => {
    const students = gridData?.students || []
    const dates = gridData?.dates || []
    const totalRecords = students.reduce(
      (acc, student) => acc + Object.keys(student.records || {}).length,
      0,
    )
    const presentCount = students.reduce((acc, student) => {
      return acc + Object.values(student.records || {}).filter((code) => code === 'P').length
    }, 0)

    return {
      students: students.length,
      sessions: dates.length,
      records: totalRecords,
      presentCount,
    }
  }, [gridData])

  if (!hasAccess) {
    return <NoAccessBanner userRole={accessRole} />
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28 font-roboto relative">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => {
              fetchCourses()
              if (selectedCourseId) fetchGrid(selectedCourseId)
            }}
            className="text-xs font-bold bg-red-100 dark:bg-red-900/60 hover:bg-red-200 dark:hover:bg-red-800/80 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <h2 className="font-nunito font-extrabold text-3xl text-custom-azul-oscuro dark:text-custom-celeste tracking-tight">
            Asistencia
          </h2>
          <p className="text-sm font-medium text-custom-gris-claro dark:text-slate-400 mt-1">
            Planilla de presentismo por curso. Los códigos se registran automáticamente desde el lector QR.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 no-print">
        <StatCard
          title="Alumnos del curso"
          value={kpis.students}
          icon={Users}
          colorClass="border-[#166193]"
          iconColorClass="text-[#166193] bg-[#166193]/10"
          description="inscriptos activos"
        />
        <StatCard
          title="Fechas registradas"
          value={kpis.sessions}
          icon={CalendarDays}
          colorClass="border-[#37A6DE]"
          iconColorClass="text-[#166193] bg-[#37A6DE]/15"
          description="días con toma de asistencia"
        />
        <StatCard
          title="Registros totales"
          value={kpis.records}
          icon={ClipboardCheck}
          colorClass="border-emerald-500"
          iconColorClass="text-emerald-600 bg-emerald-500/10"
          description="marcaciones en la planilla"
        />
        <StatCard
          title="Presentes (P)"
          value={kpis.presentCount}
          icon={BookOpen}
          colorClass="border-emerald-500"
          iconColorClass="text-emerald-600 bg-emerald-500/10"
          description="en todo el historial visible"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 p-4">
        <label htmlFor="course-select" className="block text-xs font-bold text-custom-gris-oscuro dark:text-slate-200 mb-2">
          Curso
        </label>
        <select
          id="course-select"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          disabled={loadingCourses || courses.length === 0}
          className="w-full md:w-96 p-2.5 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
        >
          {loadingCourses && <option value="">Cargando cursos…</option>}
          {!loadingCourses && courses.length === 0 && <option value="">Sin cursos activos</option>}
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.student_count} alumnos)
            </option>
          ))}
        </select>
      </div>

      <AttendanceGrid
        dates={gridData?.dates || []}
        students={gridData?.students || []}
        loading={loadingGrid || loadingCourses}
        onMark={canMark ? handleMark : undefined}
      />
    </div>
  )
}
