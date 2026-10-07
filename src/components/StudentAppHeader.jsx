import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { canonicalRole, roleLabel } from '../utils/roles'
import { safeImageSrc } from '../utils/safeImageUrl'
import { sectionPath, sectionTitle, sectionsForRole } from './appNavigation'

export default function StudentAppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const role = canonicalRole(user?.rol)
  const visibleNavItems = sectionsForRole(role)
  const displayName = [user?.nombres, user?.apellidos].filter(Boolean).join(' ') || 'Usuario'
  const displayRole = roleLabel(user?.rol)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    closeMenu()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header
        className="h-16 bg-custom-azul-oscuro border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-30 font-nunito"
        role="banner"
      >
        <Link
          to="/admin/dashboard"
          className="flex items-center min-w-0 active:scale-[0.98] transition-transform"
          aria-label="Ir al inicio"
        >
          <img
            src="/logo_texto_hero.svg"
            alt="Centro de Formación Laboral Nº 404 / Berisso"
            className="h-10 w-auto object-contain bg-white/10 rounded-full p-0.5 border border-white/20"
          />
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-colors active:scale-95"
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
          aria-controls="menu-alumno"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </header>

      {createPortal(
      <div
        className={`fixed inset-0 z-50 ${menuOpen ? '' : 'pointer-events-none'}`}
        inert={!menuOpen ? true : undefined}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />

        <div
          id="menu-alumno"
          role="dialog"
          aria-modal={menuOpen}
          aria-label="Menú de navegación"
          className={`absolute right-3 top-3 w-72 max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-custom-azul-oscuro text-white rounded-2xl shadow-2xl p-5 border border-white/10 flex flex-col transition-transform duration-200 ${
            menuOpen ? 'translate-x-0' : 'translate-x-[120%]'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3 min-w-0">
              {safeImageSrc(user?.fotoUrl) ? (
                <img
                  src={safeImageSrc(user.fotoUrl)}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight truncate">{displayName}</p>
                <p className="text-[11px] font-semibold text-white/70 mt-0.5">{displayRole}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-white/10 active:scale-90 transition-all text-white/80 hover:text-white shrink-0"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5" aria-label="Secciones">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={sectionPath(item, role)}
                end={item.id === 'dashboard'}
                title={sectionTitle(item, role)}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 font-nunito font-bold text-base p-3 rounded-xl transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-custom-amarillo text-custom-gris-oscuro shadow-lg'
                      : 'hover:bg-white/10 text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </NavLink>
            ))}

            <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-1.5">
              <NavLink
                to="/perfil"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 font-nunito font-bold text-base p-3 rounded-xl transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-custom-amarillo text-custom-gris-oscuro shadow-lg'
                      : 'hover:bg-white/10 text-white'
                  }`
                }
              >
                <User className="w-5 h-5 shrink-0" />
                Mi perfil
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 font-nunito font-bold text-base p-3 rounded-xl text-left hover:bg-white/10 text-white active:scale-[0.98] transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </nav>

          <div className="mt-6 pt-4 text-center border-t border-white/10 text-white/50 text-xs">
            <p className="font-nunito">CFL Nº 404 Berisso</p>
            <p className="mt-0.5">Educación Pública y Gratuita</p>
          </div>
        </div>
      </div>,
      document.body,
      )}
    </>
  )
}
