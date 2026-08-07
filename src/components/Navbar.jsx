import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, ChevronDown, Menu, X, LogOut, User, BookOpen, GraduationCap, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Navbar({ onToggleMobileMenu, isMobileMenuOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-custom-azul-oscuro text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand logo & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            title="Abrir menú"
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center cursor-pointer group relative" onClick={() => navigate('/perfil')}>
            <img src="/logo_texto_hero.svg" alt="CFL N°404" className="h-14 w-auto object-contain" />
            <div className="absolute top-full mt-2 left-0 hidden group-hover:block bg-custom-gris-oscuro text-white text-[11px] font-medium py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none z-50">
              Ir a Inicio / Mi Perfil
            </div>
          </div>
        </div>

        {/* Right: Notifications & User profile */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button
              title="Notificaciones"
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-blue-100 hover:text-white"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-custom-amarillo rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-custom-amarillo rounded-full"></span>
            </button>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-custom-gris-oscuro text-white text-[11px] font-medium py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none z-50">
              Ver notificaciones
            </div>
          </div>

          {/* User profile dropdown button */}
          <div className="relative group">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-left"
            >
              <img
                src={user?.fotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'}
                alt={user?.nombres}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white/40 shadow-sm"
              />
              <div className="hidden sm:block leading-tight text-xs">
                <p className="font-bold tracking-wide uppercase text-white font-nunito">{user?.nombres} {user?.apellidos}</p>
                <p className="text-blue-200 text-[11px] font-roboto font-light">{user?.nombres} {user?.apellidos}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-200" />
            </button>
            <div className="absolute top-full mt-2 right-0 hidden group-hover:block bg-custom-gris-oscuro text-white text-[11px] font-medium py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none z-50">
              Menú de usuario
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 text-custom-gris-oscuro border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-100 bg-slate-50/50">
                  <p className="text-xs font-semibold text-custom-gris-claro">Sesión iniciada como</p>
                  <p className="text-sm font-bold text-custom-azul-oscuro truncate">{user?.correo}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/perfil');
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 font-nunito transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-custom-celeste" /> Mi Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 font-nunito transition-colors cursor-pointer border-t border-gray-100 mt-1"
                >
                  <LogOut className="w-4 h-4" /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
