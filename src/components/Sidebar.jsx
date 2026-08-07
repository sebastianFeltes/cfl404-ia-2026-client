import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck, 
  Users, 
  School, 
  Settings, 
  ShieldCheck 
} from 'lucide-react'
import Tooltip from './Tooltip'

function Sidebar({ isOpen = true, logoUrl }) {
  const [logoFailed, setLogoFailed] = useState(false)

  const menuGroups = [
    {
      title: 'Principal',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '#', active: false, tooltip: 'Ir al panel principal' }
      ]
    },
    {
      title: 'Gestión',
      items: [
        { name: 'Alumnos',         icon: GraduationCap, path: '#', active: true,  tooltip: 'Gestión de alumnos e inscripciones' },
        { name: 'Cursos',          icon: BookOpen,       path: '#', active: false, tooltip: 'Administración de cursos' },
        { name: 'Asistencia',      icon: CalendarCheck,  path: '#', active: false, tooltip: 'Control de asistencia' },
        { name: 'Personal (Staff)',icon: Users,           path: '#', active: false, tooltip: 'Gestión del personal docente y no docente' },
        { name: 'Aulas',           icon: School,          path: '#', active: false, tooltip: 'Administración de aulas y espacios' }
      ]
    },
    {
      title: 'Sistema',
      items: [
        { name: 'Configuración', icon: Settings,   path: '#', active: false, tooltip: 'Configuración general del sistema' },
        { name: 'Roles',         icon: ShieldCheck, path: '#', active: false, tooltip: 'Gestión de roles y permisos de usuarios' }
      ]
    }
  ]

  return (
    <aside 
      className={`bg-custom-gris-oscuro text-white flex flex-col h-screen sticky top-0 border-r border-custom-gris-claro/20 font-roboto transition-all duration-300 ease-in-out shrink-0 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
      aria-label="Navegación principal"
    >
      {/* ── Brand Header — Logo CFL N°404 ── */}
      <div className="px-3 py-3 border-b border-custom-gris-claro/20 bg-custom-azul-oscuro flex items-center justify-center h-20 shrink-0 overflow-hidden">
        {isOpen ? (
          logoUrl && !logoFailed ? (
            <img 
              src={logoUrl} 
              alt="Logo CFL N°404" 
              className="w-full h-full object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="flex items-center gap-3 w-full px-2">
              <div className="p-1 bg-white rounded-lg flex items-center justify-center shadow-md shrink-0 w-9 h-9">
                <GraduationCap className="h-6 w-6 text-custom-azul-oscuro" />
              </div>
              <div className="truncate">
                <h1 className="font-nunito font-extrabold text-sm leading-tight uppercase tracking-wider text-white truncate">
                  CFL N°404
                </h1>
                <p className="text-[10px] text-custom-celeste font-semibold tracking-wider truncate">
                  Formación Laboral
                </p>
              </div>
            </div>
          )
        ) : (
          /* En modo colapsado: Isotipo / Logo cuadrado centrado */
          <Tooltip text="CFL N°404 - Formación Laboral" position="right">
            <div className="p-2 bg-white rounded-xl flex items-center justify-center shadow-md w-10 h-10 cursor-pointer">
              <GraduationCap className="h-6 w-6 text-custom-azul-oscuro" />
            </div>
          </Tooltip>
        )}
      </div>

      {/* ── Navigation Links ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {/* Título de sección solo visible cuando está expandido */}
            {isOpen && (
              <h2 className="text-[10px] font-extrabold text-custom-gris-claro/70 uppercase tracking-widest px-3 pb-1">
                {group.title}
              </h2>
            )}
            
            <nav className="space-y-1" aria-label={`Menú de ${group.title}`}>
              {group.items.map((item) => {
                const IconComponent = item.icon
                return (
                  <Tooltip key={item.name} text={item.name} position="right">
                    <a
                      href={item.path}
                      className={`flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                        isOpen ? 'px-3 py-2.5 gap-3 justify-start' : 'p-3 justify-center'
                      } ${
                        item.active
                          ? 'bg-custom-azul-oscuro text-white shadow-md'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                      aria-current={item.active ? 'page' : undefined}
                    >
                      {/* Active indicator bar */}
                      {item.active && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-custom-amarillo rounded-r-full" />
                      )}
                      <IconComponent 
                        className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          item.active ? 'text-custom-amarillo' : 'text-custom-celeste/80'
                        }`} 
                        aria-hidden="true"
                      />
                      {/* Nombre del ítem solo en modo expandido */}
                      {isOpen && <span className="truncate">{item.name}</span>}
                    </a>
                  </Tooltip>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="p-3 border-t border-custom-gris-claro/15 text-center bg-black/15 shrink-0">
        {isOpen ? (
          <>
            <p className="text-[10px] text-custom-gris-claro/60 font-medium truncate">
              CFL N°404 · Panel de Control
            </p>
            <p className="text-[9px] text-custom-celeste/50 mt-0.5">
              v3.0 · Boceto RBAC
            </p>
          </>
        ) : (
          <span className="text-[9px] font-mono text-custom-celeste/60">v3.0</span>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
