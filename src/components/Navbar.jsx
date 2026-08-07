import React from 'react'
import { Menu } from 'lucide-react'
import Tooltip from './Tooltip'

/**
 * Metadatos de rol: color de borde, insignia y avatar simulado de Google OAuth.
 */
const ROLE_META = {
  director: {
    label: 'Director',
    username: 'godmode',
    borderColor: 'ring-red-500',
    badgeBg: 'bg-red-600 text-white',
    dotColor: 'bg-green-500',
    // Foto de avatar de cuenta de Google simulada
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  secretaria: {
    label: 'Secretaría',
    username: 'sec.admin',
    borderColor: 'ring-custom-celeste',
    badgeBg: 'bg-custom-celeste text-white',
    dotColor: 'bg-green-500',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  docente: {
    label: 'Docente',
    username: 'docente01',
    borderColor: 'ring-custom-gris-claro',
    badgeBg: 'bg-custom-gris-oscuro text-white',
    dotColor: 'bg-green-500',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
}

/**
 * Navbar — barra superior del dashboard.
 * Muestra:
 *   • Botón para colapsar/expandir el Sidebar
 *   • Selector de rol (simulador de permisos RBAC)
 *   • Foto de perfil del usuario (proveniente de Google OAuth), con el bordado de color de rol,
 *     el indicador de estado (punto verde) y la insignia del rol integrada sobre la foto de perfil.
 */
function Navbar({ sidebarOpen, setSidebarOpen, userRole, setUserRole }) {
  const meta = ROLE_META[userRole] || ROLE_META.director

  return (
    <header
      className="h-16 bg-white border-b border-custom-gris-claro/10 flex items-center justify-between px-6 sticky top-0 z-20 font-roboto shadow-xs shrink-0"
      role="banner"
    >
      {/* ── Izquierda: toggle sidebar & título ── */}
      <div className="flex items-center gap-3">
        <Tooltip text={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'} position="bottom">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-custom-gris-oscuro hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            aria-label={sidebarOpen ? 'Colapsar menú lateral' : 'Expandir menú lateral'}
          >
            <Menu className="h-5 w-5" />
          </button>
        </Tooltip>

        <span className="text-xs font-bold text-custom-gris-claro/70 uppercase tracking-widest hidden md:block select-none">
          Panel Administrativo · CFL N°404
        </span>
      </div>

      {/* ── Derecha: selector de rol + avatar de perfil ── */}
      <div className="flex items-center gap-5">

        {/* Selector de rol (simulador RBAC) */}
        <Tooltip text="Cambiar rol simulado" position="bottom">
          <div className="flex items-center gap-2">
            <label
              htmlFor="role-selector"
              className="text-[10px] font-extrabold text-custom-gris-claro uppercase tracking-widest cursor-pointer hidden sm:block"
            >
              Simular Rol:
            </label>
            <select
              id="role-selector"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="py-1.5 pl-2.5 pr-6 border border-custom-gris-claro/20 rounded-xl text-xs bg-gray-50 text-custom-gris-oscuro font-bold focus:outline-none focus:border-custom-azul-oscuro cursor-pointer"
            >
              <option value="director">Director</option>
              <option value="secretaria">Secretaría</option>
              <option value="docente">Docente</option>
            </select>
          </div>
        </Tooltip>

        {/* Separador */}
        <div className="w-px h-8 bg-custom-gris-claro/15" />

        {/* Avatar de Google OAuth con Rol integrado en la foto y Punto de Estado */}
        <Tooltip
          text={`Cuenta Google: ${meta.username}@cfl404.edu.ar · Rol: ${meta.label} · Estado: En línea`}
          position="bottom"
        >
          <div className="flex items-center gap-3 cursor-pointer group">
            {/* Foto de perfil con bordado de rol y badge */}
            <div className="relative">
              {/* Foto de perfil con ring bordado */}
              <div className={`h-10 w-10 rounded-full ring-2 ring-offset-2 ${meta.borderColor} overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                <img
                  src={meta.photoUrl}
                  alt={`Foto de Google de ${meta.username}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Punto de estado en línea (verde) sobre la foto */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 ${meta.dotColor} rounded-full border-2 border-white shadow-xs`}
                title="Estado: En línea"
              />
            </div>

            {/* Datos de usuario y badge de Rol pegado a la foto */}
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-xs font-extrabold text-custom-gris-oscuro font-nunito truncate max-w-[120px]">
                {meta.username}
              </span>
              <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded-full mt-0.5 ${meta.badgeBg}`}>
                {meta.label}
              </span>
            </div>
          </div>
        </Tooltip>
      </div>
    </header>
  )
}

export default Navbar
