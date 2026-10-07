import { NavLink, Link } from 'react-router'
import { PanelLeftClose, PanelLeftOpen, Scale, Shield } from 'lucide-react'
import Tooltip from './Tooltip'
import { useAuth } from '../context/AuthContext'
import { canonicalRole } from '../utils/roles'
import { sectionPath, sectionTitle, sectionsForRole } from './appNavigation'

const YEAR = new Date().getFullYear()

function BrandMark({ className = 'h-9 w-9' }) {
  return (
    <div className={`${className} rounded-full overflow-hidden shrink-0 bg-white`}>
      <img
        src="/logo_texto_hero.svg"
        alt="CFL 404 Berisso"
        className="h-full w-full object-cover block"
      />
    </div>
  )
}

export default function Sidebar({ isOpen = true, onToggle }) {
  const open = onToggle !== undefined ? isOpen : true
  const { user } = useAuth()
  const role = canonicalRole(user?.rol)
  const visibleNavItems = sectionsForRole(role)

  return (
    <aside
      className={`
        relative flex flex-col h-screen shrink-0 sticky top-0 z-30
        bg-custom-azul-oscuro text-white
        border-r border-black/5
        shadow-[6px_0_18px_rgba(15,23,42,0.28)]
        transition-all duration-300 ease-in-out overflow-visible
        ${open ? 'w-64' : 'w-[72px]'}
      `}
      aria-label="Navegación principal"
    >
      {onToggle && (
        <Tooltip
          text={open ? 'Comprimir menú' : 'Expandir menú'}
          position="right"
          className="absolute top-4 -right-3 z-40"
        >
          <button
            type="button"
            onClick={onToggle}
            aria-label={open ? 'Comprimir barra lateral' : 'Expandir barra lateral'}
            className="h-7 w-7 rounded-full bg-white text-custom-azul-oscuro shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
          >
            {open ? (
              <PanelLeftClose size={14} strokeWidth={2.2} />
            ) : (
              <PanelLeftOpen size={14} strokeWidth={2.2} />
            )}
          </button>
        </Tooltip>
      )}

      <div
        className={`h-16 flex items-center border-b border-white/10 shrink-0 ${
          open ? 'justify-start px-3.5' : 'justify-center px-0'
        }`}
      >
        {open ? (
          <div
            title="Centro de Formación Laboral Nº404 · Berisso"
            className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden"
          >
            <BrandMark />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[11px] font-bold text-white uppercase tracking-wide font-nunito leading-tight truncate">
                Centro de
              </span>
              <span className="text-[11px] font-bold text-white uppercase tracking-wide font-nunito leading-tight truncate">
                Formación Laboral
              </span>
              <span className="text-[11px] font-bold text-white uppercase tracking-wide font-nunito leading-tight truncate">
                Nº404 · Berisso
              </span>
            </div>
          </div>
        ) : (
          <BrandMark className="h-9 w-9" />
        )}
      </div>

      <nav
        className={`flex-1 py-3 flex flex-col overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          open ? 'gap-0.5 items-stretch px-2' : 'gap-1 items-center px-0'
        }`}
        aria-label="Menú principal"
      >
        <p
          className={`px-4 mb-2 text-[11px] font-semibold text-white/50 uppercase tracking-wider font-nunito ${
            open ? 'opacity-100' : 'hidden'
          }`}
        >
          Menú
        </p>

        {visibleNavItems.map((item) => (
          <Tooltip
            key={item.label}
            text={open ? '' : item.label}
            position="right"
            className={open ? 'flex w-full' : 'flex w-full justify-center'}
          >
            <NavLink
              to={sectionPath(item, role)}
              title={open ? sectionTitle(item, role) : undefined}
              className={({ isActive }) =>
                `rounded-lg flex items-center text-sm font-nunito transition-colors ${
                  open ? 'px-3 py-2.5 gap-3 w-full' : 'h-10 w-10 justify-center'
                } ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white font-normal'
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
                  {open && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          </Tooltip>
        ))}
      </nav>

      <footer
        className={`shrink-0 border-t border-white/10 ${open ? 'px-4 py-3' : 'px-2 py-3'}`}
        aria-label="Información legal"
      >
        {open ? (
          <>
            <nav className="flex items-center gap-2 text-[11px] font-semibold">
              <Link
                to="/terminos-condiciones"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                TyC
              </Link>
              <span className="text-white/30" aria-hidden="true">
                ·
              </span>
              <Link
                to="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                Privacidad
              </Link>
            </nav>
            <p className="mt-1.5 text-[10px] text-white/45 font-nunito leading-snug">
              © {YEAR} CFL 404. Todos los derechos reservados.
            </p>
          </>
        ) : (
          <div className="flex w-full flex-col items-center gap-2">
            <Tooltip text="Términos y condiciones" position="right">
              <Link
                to="/terminos-condiciones"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Términos y condiciones"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Scale size={16} strokeWidth={1.8} />
              </Link>
            </Tooltip>
            <Tooltip text="Privacidad" position="right">
              <Link
                to="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Política de privacidad"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Shield size={16} strokeWidth={1.8} />
              </Link>
            </Tooltip>
            <Tooltip text={`© ${YEAR} CFL 404`} position="right">
              <span className="text-[10px] font-bold text-white/45 select-none">©</span>
            </Tooltip>
          </div>
        )}
      </footer>
    </aside>
  )
}
