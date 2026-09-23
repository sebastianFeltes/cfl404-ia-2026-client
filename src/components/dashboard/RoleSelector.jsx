import React from 'react'
import { Shield, FileCheck, GraduationCap, BookOpen, RotateCcw } from 'lucide-react'

const ROLES = [
  {
    id: 'director',
    label: 'Directivo',
    desc: 'Visión institucional y finanzas',
    icon: Shield,
    color: 'border-[#166193] text-[#166193] bg-[#166193]/10',
  },
  {
    id: 'secretaria',
    label: 'Secretaría',
    desc: 'Matrícula, trámites y asistencia',
    icon: FileCheck,
    color: 'border-[#37A6DE] text-[#166193] bg-[#37A6DE]/15',
  },
  {
    id: 'instructor',
    label: 'Docente',
    desc: 'Cursos a cargo y alumnos',
    icon: BookOpen,
    color: 'border-emerald-500 text-emerald-700 bg-emerald-500/10',
  },
  {
    id: 'estudiante',
    label: 'Estudiante',
    desc: 'Cursada, presentismo y legajo',
    icon: GraduationCap,
    color: 'border-amber-500 text-amber-700 bg-amber-500/10',
  },
]

export default function RoleSelector({
  activeRole,
  onRoleChange,
  originalRole,
  isSimulated,
  onResetOriginal,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs font-nunito flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-roboto">
          Vista por Rol:
        </span>
        {isSimulated && (
          <span className="text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-600/40 animate-pulse">
            Modo Simulación
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
        {ROLES.map((role) => {
          const Icon = role.icon
          const isActive = activeRole === role.id

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onRoleChange(role.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-custom-azul-oscuro text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              title={role.desc}
            >
              <Icon size={14} className={isActive ? 'text-custom-amarillo' : 'opacity-70'} />
              <span>{role.label}</span>
            </button>
          )
        })}

        {isSimulated && (
          <button
            type="button"
            onClick={onResetOriginal}
            title={`Volver a mi rol original (${originalRole})`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto sm:ml-1"
          >
            <RotateCcw size={12} />
            <span>Restablecer</span>
          </button>
        )}
      </div>
    </div>
  )
}
