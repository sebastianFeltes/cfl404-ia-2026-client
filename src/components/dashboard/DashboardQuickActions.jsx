import React from 'react'
import { Link } from 'react-router'
import {
  BookOpen,
  GraduationCap,
  Users,
  Wallet,
  ClipboardCheck,
  Receipt,
  FileCheck2,
  ArrowUpRight,
} from 'lucide-react'

export default function DashboardQuickActions({ role = 'director' }) {
  const getActionsForRole = () => {
    switch (role) {
      case 'secretaria':
        return [
          {
            label: 'Revisar Postulantes',
            desc: 'Validar legajos y documentación pendiente',
            to: '/admin/alumnos',
            icon: GraduationCap,
            color: 'from-[#166193] to-[#37A6DE]',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Planilla de Asistencia',
            desc: 'Verificar presentismo y faltas del día',
            to: '/admin/asistencia',
            icon: ClipboardCheck,
            color: 'from-emerald-600 to-teal-500',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Cobranza Cooperadora',
            desc: 'Registrar cobro de cuotas o buffet',
            to: '/admin/cooperadora',
            icon: Receipt,
            color: 'from-amber-500 to-orange-500',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Oferta y Vacantes',
            desc: 'Consultar cupos disponibles en cursos',
            to: '/admin/cursos',
            icon: BookOpen,
            color: 'from-slate-700 to-slate-900',
            iconBg: 'bg-white/20 text-white',
          },
        ]
      case 'instructor':
        return [
          {
            label: 'Mis Cursos Asignados',
            desc: 'Ver comisiones, horarios y detalles',
            to: '/admin/cursos',
            icon: BookOpen,
            color: 'from-[#166193] to-[#37A6DE]',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Pasar Asistencia',
            desc: 'Cargar presentes y ausentes de mi clase',
            to: '/admin/asistencia',
            icon: ClipboardCheck,
            color: 'from-emerald-600 to-teal-500',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Nómina de Mis Alumnos',
            desc: 'Consultar información de estudiantes',
            to: '/admin/alumnos',
            icon: Users,
            color: 'from-purple-600 to-indigo-600',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Mi Perfil Docente',
            desc: 'Ver y actualizar datos personales',
            to: '/perfil',
            icon: FileCheck2,
            color: 'from-slate-700 to-slate-900',
            iconBg: 'bg-white/20 text-white',
          },
        ]
      case 'estudiante':
      case 'estudiantes':
      case 'alumno':
      case 'alumnos':
        return [
          {
            label: 'Mi Cursada Actual',
            desc: 'Horarios, materias y estado regular',
            to: '/perfil',
            icon: BookOpen,
            color: 'from-[#166193] to-[#37A6DE]',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Oferta de Cursos',
            desc: 'Nuevas propuestas para la 2da etapa',
            to: '/cursos',
            icon: GraduationCap,
            color: 'from-sky-600 to-cyan-500',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Mi Legajo y Datos',
            desc: 'Revisar documentación y constancias',
            to: '/perfil',
            icon: FileCheck2,
            color: 'from-emerald-600 to-teal-500',
            iconBg: 'bg-white/20 text-white',
          },
        ]
      case 'director':
      default:
        return [
          {
            label: 'Cursos y Oferta',
            desc: 'Administrar vacantes, etapas y programas',
            to: '/admin/cursos',
            icon: BookOpen,
            color: 'from-[#166193] to-[#37A6DE]',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Matrícula de Alumnos',
            desc: 'Gestionar nómina, legajos y aspirantes',
            to: '/admin/alumnos',
            icon: GraduationCap,
            color: 'from-sky-600 to-cyan-500',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Plantel Docente',
            desc: 'Instructores activos, licencias y asignación',
            to: '/admin/instructores',
            icon: Users,
            color: 'from-purple-600 to-indigo-600',
            iconBg: 'bg-white/20 text-white',
          },
          {
            label: 'Cooperadora y Finanzas',
            desc: 'Balances de cuotas, buffet y recaudación',
            to: '/admin/cooperadora',
            icon: Wallet,
            color: 'from-amber-500 to-orange-500',
            iconBg: 'bg-white/20 text-white',
          },
        ]
    }
  }

  const actions = getActionsForRole()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-roboto">
          Accesos Rápidos del Módulo
        </h3>
        <span className="text-xs text-slate-400 font-nunito">Operaciones frecuentes</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-nunito">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <Link
              key={action.label}
              to={action.to}
              className="group relative overflow-hidden rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              {/* Background gradient accent indicator */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${action.color}`}
              />

              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm`}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div className="p-1 rounded-full text-slate-400 group-hover:text-custom-azul-oscuro dark:group-hover:text-custom-celeste group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-roboto group-hover:text-custom-azul-oscuro dark:group-hover:text-custom-celeste transition-colors">
                  {action.label}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {action.desc}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
