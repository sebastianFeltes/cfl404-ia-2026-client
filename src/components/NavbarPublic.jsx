import React, { useState } from 'react';
import { GraduationCap, Menu, X, BookOpen } from 'lucide-react';

/**
 * NavbarPublic — barra de navegación para el módulo público de Cursos.
 * Muestra:
 *   • Banner de inscripciones con selector de perfil de visitante (aspirante, alumno, docente, empresa)
 *   • Logo institucional con enlace al hero
 *   • Navegación de escritorio
 *   • Menú hamburguesa responsive para mobile
 */
export default function NavbarPublic({ selectedRole, setSelectedRole }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles = [
    { id: 'aspirante', label: 'Futuro Estudiante' },
    { id: 'alumno', label: 'Alumno / Cursante' },
    { id: 'docente', label: 'Docente / Instructor' },
    { id: 'empresa', label: 'Empresa / Institución' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#166193] text-white shadow-lg transition-all duration-300">
      {/* Top Banner / Role Switcher */}
      <div className="bg-[#1D1E1C] text-gray-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FDEA14] animate-pulse"></span>
            <span>Módulo de Cursos — Inscripciones Abiertas Segunda Etapa (Julio - Diciembre)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 hidden md:inline">Vista de Perfil:</span>
            <div className="flex bg-[#585856]/40 p-0.5 rounded-md">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                    selectedRole === r.id
                      ? 'bg-[#37ACDE] text-white font-bold shadow-sm'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand / Logo */}
          <a href="#hero" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#FDEA14] rounded-lg p-1">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#166193] shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight font-['Roboto_Flex'] text-white">
                  CFP <span className="text-[#FDEA14]">Nº 404</span>
                </span>
                <span className="text-[10px] bg-[#37ACDE] text-white font-semibold px-1.5 py-0.5 rounded uppercase">
                  Cursos
                </span>
              </div>
              <span className="text-xs text-gray-200 font-['Nunito'] font-medium">
                Módulo de Oferta Educativa
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 font-['Nunito'] text-sm font-semibold">
            <a href="#hero" className="hover:text-[#FDEA14] transition-colors py-1 border-b-2 border-transparent hover:border-[#FDEA14]">
              Inicio
            </a>
            <a href="#cursos" className="hover:text-[#FDEA14] transition-colors py-1 border-b-2 border-transparent hover:border-[#FDEA14] flex items-center gap-1 text-[#FDEA14]">
              <BookOpen className="w-4 h-4 text-[#FDEA14]" />
              Catálogo de Cursos
            </a>
          </nav>

          {/* Action CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#cursos"
              className="bg-[#FDEA14] hover:bg-yellow-300 text-[#1D1E1C] font-bold px-4 py-2.5 rounded-lg text-sm transition-all transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 focus:ring-2 focus:ring-white"
            >
              <BookOpen className="w-4 h-4" />
              Ver Oferta Educativa
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir Menú"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg text-gray-100 hover:text-white hover:bg-[#37ACDE]/30 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#166193] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 font-['Nunito'] animate-fadeIn">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold hover:bg-white/10"
          >
            Inicio
          </a>
          <a
            href="#cursos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold hover:bg-white/10 text-[#FDEA14]"
          >
            Oferta Educativa / Cursos (15 Cursos)
          </a>
        </div>
      )}
    </header>
  );
}
