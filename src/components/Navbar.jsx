import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { roleLabel } from '../utils/roles'
import { safeImageSrc } from '../utils/safeImageUrl'

/**
 * Navbar — barra superior del panel autenticado.
 * Azul institucional, texto blanco. El nombre abre un menú con perfil y logout.
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const displayName = [user?.nombres, user?.apellidos].filter(Boolean).join(' ') || 'Usuario'
  const displayRole = roleLabel(user?.rol)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return

    const onPointer = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="h-16 bg-custom-azul-oscuro border-b border-white/10 flex items-center justify-between px-6 md:px-8 shrink-0 z-20 font-nunito"
      role="banner"
    >
      <span className="text-xs font-bold text-white/70 uppercase tracking-widest hidden md:block select-none">
        Panel administrativo · CFL N°404
      </span>
      <span className="md:hidden" aria-hidden="true" />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Menú de cuenta"
          className="flex items-center gap-3 p-1.5 pl-2.5 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="flex flex-col text-right leading-tight min-w-[90px]">
            <span className="text-sm font-semibold text-white truncate max-w-[160px]">
              {displayName}
            </span>
            <span className="text-[11px] font-medium text-white/70">
              {displayRole}
            </span>
          </div>

          {safeImageSrc(user?.fotoUrl) ? (
            <img
              src={safeImageSrc(user.fotoUrl)}
              alt=""
              className="w-8 h-8 rounded-lg object-cover shrink-0 ring-1 ring-white/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0">
              <User size={16} strokeWidth={2} />
            </div>
          )}

          <ChevronDown
            size={16}
            strokeWidth={2}
            className={`text-white/70 shrink-0 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 overflow-hidden"
          >
            <Link
              to="/perfil"
              role="menuitem"
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-custom-azul-oscuro transition-colors"
            >
              <User size={16} strokeWidth={2} className="shrink-0 text-slate-400" />
              Mi perfil
            </Link>
            <div className="my-1 h-px bg-slate-100" />
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut size={16} strokeWidth={2} className="shrink-0" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
