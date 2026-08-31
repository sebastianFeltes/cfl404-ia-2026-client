// Archivo: src/components/StudentCardView.jsx
import React from 'react'
import StudentAvatar from './StudentAvatar'
import ActionButtons from './ActionButtons'
import BadgeStatus from './BadgeStatus'
import { Mail, Phone, BookOpen, Calendar, MapPin, Inbox, Plus } from 'lucide-react'

function isPostulanteCheck(student) {
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

export default function StudentCardView({
  students = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onPromote,
  onResetFilters,
  onAddStudent,
  userRole = 'director',
  activeTab = 'alumnos',
  paginaActual = 1,
  itemsPorPagina = 10,
  setPaginaActual,
  setItemsPorPagina,
  totalResultados = 0,
  isPrintMode = false
}) {
  const isPostulantesTab = activeTab === 'postulantes'
  const canCreate = userRole === 'director' || userRole === 'secretaria'
  const totalPaginas = Math.ceil(totalResultados / itemsPorPagina) || 1
  const skeletonCards = Array(6).fill(null)

  return (
    <div className="w-full bg-slate-50/50 dark:bg-slate-900/50 p-5 font-nunito transition-colors duration-200">
      
      {/* Loading Skeleton Cards */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skeletonCards.map((_, index) => (
            <div 
              key={`skeleton-card-${index}`} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Cards Grid Success */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {students.map((student) => {
            const isStudentPostulante = isPostulanteCheck(student)
            return (
              <div
                key={student.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#37A6DE]/50 dark:hover:border-[#37A6DE]/40 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Header de la Tarjeta */}
                <div>
                  <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div 
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          onView && onView(student.id)
                        }}
                        title="Ver expediente completo"
                      >
                        <StudentAvatar
                          src={student.profile_photo_url}
                          nombre={student.first_name}
                          apellido={student.last_name}
                          estado={isStudentPostulante ? 'postulante' : student.status_id}
                          size="md"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 
                          onClick={(e) => {
                            e.stopPropagation()
                            onView && onView(student.id)
                          }}
                          className="font-bold text-slate-900 dark:text-slate-100 font-nunito hover:text-[#166193] dark:hover:text-[#37A6DE] cursor-pointer transition-colors leading-snug truncate"
                        >
                          {student.first_name} {student.last_name}
                        </h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                          DNI: {student.dni || '—'}
                        </p>
                      </div>
                    </div>

                    <BadgeStatus status={isStudentPostulante ? 'postulante' : student.status_id} />
                  </div>

                  {/* Info Content */}
                  <div className="py-3.5 space-y-2.5 text-xs">
                    {/* Curso */}
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <BookOpen size={14} className="text-[#166193] dark:text-[#37A6DE] shrink-0" />
                      <span className="font-semibold truncate">
                        {student.course_name || 'Sin curso asignado'}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{student.email || '—'}</span>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span className="font-mono tabular-nums">{student.phone || 'Sin teléfono'}</span>
                    </div>

                    {/* Fecha de Inscripción */}
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
                      <Calendar size={13} className="text-slate-400 shrink-0" />
                      <span>{isStudentPostulante ? 'Postulación:' : 'Inscrito:'} {student.enrollment_date || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onView && onView(student.id)
                    }}
                    className="text-xs font-bold text-[#166193] dark:text-[#37A6DE] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Ver Ficha →
                  </button>

                  <ActionButtons
                    studentId={student.id}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onPromote={onPromote}
                    isPostulante={isStudentPostulante}
                    userRole={userRole}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && students.length === 0 && (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-3 shadow-inner">
            <Inbox className="h-10 w-10" aria-hidden="true" />
          </div>
          <h3 className="font-nunito font-extrabold text-base text-slate-800 dark:text-slate-200 mb-1">
            {isPostulantesTab ? 'No se encontraron postulantes' : 'No se encontraron alumnos'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 font-nunito">
            {isPostulantesTab
              ? 'No hay solicitudes o preinscripciones de postulantes que coincidan con la búsqueda.'
              : 'No hay registros de alumnos regulares que coincidan con los criterios de búsqueda o filtros actuales.'}
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetFilters}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
            {canCreate && (
              <button
                onClick={() => onAddStudent && onAddStudent(isPostulantesTab ? 'Postulante' : 'Alumno')}
                className={`px-3.5 py-1.5 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                  isPostulantesTab 
                    ? 'bg-[#37A6DE] hover:bg-[#2c91c4] dark:bg-[#37A6DE] dark:hover:bg-[#2c91c4]' 
                    : 'bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa]'
                }`}
              >
                <Plus className="h-3.5 w-3.5 text-[#FDEA14]" />
                {isPostulantesTab ? 'Nuevo Postulante' : 'Nuevo Alumno'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && totalResultados > 0 && !isPrintMode && (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between px-5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 no-print text-xs gap-3">
          
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Mostrar</span>
            <select
              value={itemsPorPagina}
              onChange={(e) => {
                setItemsPorPagina && setItemsPorPagina(Number(e.target.value))
                setPaginaActual && setPaginaActual(1)
              }}
              title="Cantidad de alumnos por página"
              className="h-7 px-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer font-medium"
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={24}>24</option>
            </select>
            <span>por página</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span>
              Mostrando <strong>{totalResultados === 0 ? 0 : (paginaActual - 1) * itemsPorPagina + 1}</strong> a{" "}
              <strong>{Math.min(paginaActual * itemsPorPagina, totalResultados)}</strong> de{" "}
              <strong>{totalResultados}</strong> resultados
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaginaActual && setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                title="Página anterior"
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual && setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                title="Página siguiente"
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
