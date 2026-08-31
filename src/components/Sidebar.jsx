// Archivo: src/components/Sidebar.jsx
import { NavLink } from 'react-router'
import {
  Users,
  Book,
  GraduationCap,
  BarChart2,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from 'lucide-react'
import { useMemo } from 'react'
import Tooltip from './Tooltip'
import { useAuth } from '../context/AuthContext'
import { mapDbRoleToUi } from '../utils/roles'

/**
 * Sidebar — panel lateral de navegación del dashboard con control RBAC por rol.
 */
const navItems = [
  {
    label: 'Mi Perfil',
    icon: User,
    path: '/perfil',
    title: 'Datos de tu cuenta',
    roles: ['director', 'secretaria', 'instructor', 'estudiante'],
  },
  {
    label: 'Profesores',
    icon: Users,
    path: '/admin/instructores',
    title: 'Gestión de docentes e instructores',
    roles: ['director', 'secretaria'],
  },
  {
    label: 'Cursos',
    icon: Book,
    path: '/admin/cursos',
    title: 'Gestión de ofertas formativas',
    roles: ['director', 'secretaria', 'instructor'],
  },
  {
    label: 'Alumnos',
    icon: GraduationCap,
    path: '/admin/alumnos',
    title: 'Matrícula y nómina de estudiantes',
    roles: ['director', 'secretaria', 'instructor'],
  },
  {
    label: 'Reportes',
    icon: BarChart2,
    path: '/admin/reportes',
    title: 'Estadísticas y reportes de gestión',
    roles: ['director', 'secretaria'],
  },
]

export default function Sidebar({ isOpen = true, onToggle }) {
  const { user } = useAuth()
  const userRole = mapDbRoleToUi(user?.rol)
  const open = onToggle !== undefined ? isOpen : true

  const visibleNavItems = useMemo(() => {
    return navItems.filter((item) => {
      if (item.roles && !item.roles.includes(userRole)) return false
      return true
    })
  }, [userRole])

  return (
    <aside
      className={`
        flex flex-col h-screen shrink-0 sticky top-0 z-30
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-[72px]'}
      `}
      aria-label="Navegación principal"
    >
      {/* ── Logo / Brand Header con Botón de Compresión ── */}
      <div
        className={`h-16 flex items-center border-b border-slate-200 dark:border-slate-800 shrink-0 transition-all duration-300 ${
          open ? 'justify-between px-3.5' : 'justify-center px-2'
        }`}
      >
        {open ? (
          <>
            <div
              title="Centro de Formación Laboral Nº404 · Berisso"
              className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden"
            >
              <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 dark:bg-white dark:p-0.5">
                <img
                  src="/logo_texto_hero.svg"
                  alt="CFL 404 Berisso"
                  className="h-full w-full object-cover block"
                />
              </div>

              <div className="flex flex-col leading-tight min-w-0 transition-all duration-200">
                <span className="text-[11px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight truncate">
                  Centro de
                </span>
                <span className="text-[11px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight truncate">
                  Formación Laboral
                </span>
                <span className="text-[11px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight truncate">
                  Nº404 · Berisso
                </span>
              </div>
            </div>

            {onToggle && (
              <Tooltip text="Comprimir menú" position="bottom">
                <button
                  type="button"
                  onClick={onToggle}
                  title="Comprimir barra lateral"
                  aria-label="Comprimir barra lateral"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                  <PanelLeftClose size={18} strokeWidth={2} />
                </button>
              </Tooltip>
            )}
          </>
        ) : (
          onToggle ? (
            <Tooltip text="Expandir menú" position="right">
              <button
                type="button"
                onClick={onToggle}
                title="Expandir barra lateral"
                aria-label="Expandir barra lateral"
                className="p-2 rounded-lg text-slate-500 hover:text-[#166193] dark:text-slate-400 dark:hover:text-[#37A6DE] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center"
              >
                <PanelLeftOpen size={20} strokeWidth={2} />
              </button>
            </Tooltip>
          ) : (
            <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 dark:bg-white dark:p-0.5">
              <img
                src="/logo_texto_hero.svg"
                alt="CFL 404 Berisso"
                className="h-full w-full object-cover block"
              />
            </div>
          )
        )}
      </div>

      {/* ── Navigation Links ── */}
      <nav
        className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden"
        aria-label="Menú principal"
      >
        {/* Sección label — solo visible en modo expandido */}
        <p
          className={`px-4 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-nunito transition-all duration-200 ${
            open ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden mb-0'
          }`}
        >
          Menú
        </p>

        {visibleNavItems.map((item) => (
          <Tooltip
            key={item.label}
            text={open ? '' : item.label}
            position="right"
          >
            <NavLink
              to={item.path}
              title={item.title}
              className={({ isActive }) =>
                `mx-2 px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-nunito transition-colors ${
                  open ? '' : 'justify-center'
                } ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#166193] dark:text-[#37A6DE] font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 font-normal'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  {/* Label — visible solo en modo expandido */}
                  <span
                    className={`truncate transition-all duration-200 ${
                      open ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </Tooltip>
        ))}
      </nav>
    </aside>
  )
}
