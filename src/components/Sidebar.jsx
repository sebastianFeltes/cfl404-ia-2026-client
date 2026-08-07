// Archivo: src/components/Sidebar.jsx
import { useState } from 'react'
import { NavLink } from 'react-router'
import {
  Users,
  Book,
  GraduationCap,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Tooltip from './Tooltip'

/**
 * Sidebar — panel lateral de navegación del dashboard.
 *
 * Fusiona:
 *  - Navegación con NavLink de react-router (activa estilos según la ruta actual)
 *  - Modo colapsado (isOpen=false) con isotipo y Tooltip en cada ítem
 *  - Modo expandido (isOpen=true) con texto de etiquetas y logo completo
 *
 * Props:
 *  - isOpen {boolean}         — Estado expandido/colapsado (controlado desde DashboardLayout)
 *  - onToggle {function}      — Callback para alternar el estado (opcional, si se quiere toggle interno)
 */
const navItems = [
  {
    label: 'Profesores',
    icon: Users,
    path: '/instructores',
    title: 'Gestión de docentes e instructores',
  },
  {
    label: 'Cursos',
    icon: Book,
    path: '/cursos',
    title: 'Gestión de ofertas formativas',
  },
  {
    label: 'Alumnos',
    icon: GraduationCap,
    path: '/alumnos',
    title: 'Matrícula y nómina de estudiantes',
  },
  {
    label: 'Reportes',
    icon: BarChart2,
    path: '/reportes',
    title: 'Estadísticas y reportes de gestión',
  },
]

export default function Sidebar({ isOpen = true, onToggle }) {
  // Si no se pasa onToggle, el Sidebar maneja su propio estado de colapso
  const [internalOpen, setInternalOpen] = useState(isOpen)
  const open = onToggle !== undefined ? isOpen : internalOpen
  const toggle = onToggle !== undefined ? onToggle : () => setInternalOpen((v) => !v)

  return (
    <aside
      className={`
        flex flex-col h-screen shrink-0 sticky top-0
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out
        overflow-hidden
        ${open ? 'w-64' : 'w-[72px]'}
      `}
      aria-label="Navegación principal"
    >
      {/* ── Logo / Brand Header ── */}
      <div
        title="Centro de Formación Laboral Nº404 · Berisso"
        className="h-16 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden"
      >
        <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 dark:bg-white dark:p-0.5">
          <img
            src="/logo_texto_hero.svg"
            alt="CFL 404 Berisso"
            className="h-full w-full object-cover block"
          />
        </div>

        {/* Texto del logo — visible solo cuando está expandido */}
        <div
          className={`flex flex-col leading-tight min-w-0 transition-all duration-200 ${
            open ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
          }`}
        >
          <span className="text-[12px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight">
            Centro de
          </span>
          <span className="text-[12px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight">
            Formación Laboral
          </span>
          <span className="text-[12px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight">
            Nº404 · Berisso
          </span>
        </div>
      </div>

      {/* ── Navigation Links ── */}
      <nav
        className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto"
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

        {navItems.map((item) => (
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

      {/* ── Toggle Button (colapsar / expandir) ── */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 flex justify-end">
        <Tooltip text={open ? 'Colapsar menú' : 'Expandir menú'} position="right">
          <button
            onClick={toggle}
            aria-label={open ? 'Colapsar menú lateral' : 'Expandir menú lateral'}
            className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {open ? (
              <ChevronLeft size={18} strokeWidth={2} />
            ) : (
              <ChevronRight size={18} strokeWidth={2} />
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}
