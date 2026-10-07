import React from 'react'

const CODE_STYLES = {
  P: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  T: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  M: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300',
  A: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300',
  J: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  F: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

function formatDateLabel(dateKey) {
  const [year, month, day] = dateKey.split('-')
  return `${day}/${month}/${year.slice(2)}`
}

export default function AttendanceGrid({ dates, students, loading }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-custom-gris-claro/10 dark:border-slate-800 p-12 text-center">
        <div className="w-8 h-8 border-4 border-custom-celeste border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-custom-gris-claro dark:text-slate-400">Cargando planilla de asistencia…</p>
      </div>
    )
  }

  if (!students?.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-custom-gris-claro/10 dark:border-slate-800 p-12 text-center">
        <p className="text-sm text-custom-gris-claro dark:text-slate-400">
          No hay alumnos inscriptos en este curso.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs">
          <thead>
            <tr className="bg-custom-azul-oscuro text-white text-xs font-bold uppercase tracking-wider border-b border-custom-azul-oscuro">
              <th className="sticky left-0 z-10 bg-custom-azul-oscuro text-white text-left px-4 py-3 font-bold min-w-[180px]">
                Alumno/a
              </th>
              {dates.map((dateKey) => (
                <th
                  key={dateKey}
                  className="px-3 py-3 font-bold text-white text-center whitespace-nowrap min-w-[72px]"
                  title={dateKey}
                >
                  {formatDateLabel(dateKey)}
                </th>
              ))}
              {dates.length === 0 && (
                <th className="px-3 py-3 font-bold text-white text-center">
                  Sin registros
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                className={`border-b border-custom-gris-claro/10 dark:border-slate-800/80 ${
                  index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/60 dark:bg-slate-950/40'
                }`}
              >
                <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5 font-semibold text-custom-gris-oscuro dark:text-slate-100 whitespace-nowrap">
                  {student.last_name}, {student.first_name}
                </td>
                {dates.map((dateKey) => {
                  const code = student.records?.[dateKey]
                  return (
                    <td key={`${student.id}-${dateKey}`} className="px-3 py-2.5 text-center">
                      {code ? (
                        <span
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-md font-extrabold text-[11px] ${
                            CODE_STYLES[code] || 'bg-slate-100 text-slate-700'
                          }`}
                          title={code}
                        >
                          {code}
                        </span>
                      ) : (
                        <span className="text-custom-gris-claro dark:text-slate-600">—</span>
                      )}
                    </td>
                  )
                })}
                {dates.length === 0 && (
                  <td className="px-3 py-2.5 text-center text-custom-gris-claro dark:text-slate-600">—</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-custom-gris-claro/10 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex flex-wrap gap-3 text-[11px] text-custom-gris-claro dark:text-slate-400">
        <span><strong className="text-emerald-700 dark:text-emerald-400">P</strong> Presente</span>
        <span><strong className="text-amber-700 dark:text-amber-400">T</strong> Tarde</span>
        <span><strong className="text-orange-700 dark:text-orange-400">M</strong> Media falta</span>
        <span><strong className="text-red-700 dark:text-red-400">A</strong> Ausente</span>
        <span><strong className="text-blue-700 dark:text-blue-400">J</strong> Justificado</span>
        <span><strong className="text-slate-600 dark:text-slate-400">F</strong> Feriado</span>
      </div>
    </div>
  )
}
