// Archivo: src/layouts/DashboardLayout.jsx
import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { User, Bell, Sun, Moon, ChevronDown, Check, ShieldCheck, ClipboardList, GraduationCap } from "lucide-react";
import Sidebar from "../components/Sidebar";

const ROLES_MOCK = [
  {
    id: "director",
    label: "Director",
    usuario: "Carlos Benítez",
    email: "c.benitez@cfl404.edu.ar",
    icon: ShieldCheck,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
  },
  {
    id: "secretaria",
    label: "Secretaría",
    usuario: "Ana María López",
    email: "a.lopez@cfl404.edu.ar",
    icon: ClipboardList,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  },
  {
    id: "instructor",
    label: "Instructor",
    usuario: "Martín Echevarría",
    email: "m.echevarria@cfl404.edu.ar",
    icon: GraduationCap,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  },
];

export default function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [rolActivo, setRolActivo] = useState(() => {
    const savedRole = localStorage.getItem("userRole");
    return ROLES_MOCK.find((r) => r.id === savedRole) || ROLES_MOCK[0];
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRol = (rol) => {
    setRolActivo(rol);
    localStorage.setItem("userRole", rol.id);
    setMenuOpen(false);
  };

  const IconoRol = rolActivo.icon;

  return (
    <div className="flex h-screen w-screen max-w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-nunito transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div className="flex-1 flex flex-col min-w-0 max-w-full h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-end px-8 shrink-0 z-20 transition-colors duration-200">
          <div className="flex items-center gap-4">
            {/* Toggle Modo Oscuro */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              aria-label="Toggle tema"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {darkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Notificaciones */}
            <button
              title="Notificaciones de la institución"
              aria-label="Notificaciones"
              className="relative text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-1"
            >
              <Bell size={18} strokeWidth={1.8} />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Selector de Rol y Perfil */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                title="Cambiar rol activo"
                className="flex items-center gap-3 p-1.5 pl-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex flex-col text-right leading-tight min-w-[90px]">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-nunito">
                    {rolActivo.usuario}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {rolActivo.label}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-lg bg-[#166193]/10 dark:bg-[#37A6DE]/10 flex items-center justify-center text-[#166193] dark:text-[#37A6DE] shrink-0">
                  <IconoRol size={16} strokeWidth={2} />
                </div>

                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Menú Desplegable de Roles */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden font-nunito animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Seleccionar Rol Activo
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Simulación de permisos en el sistema
                    </p>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {ROLES_MOCK.map((rol) => {
                      const ItemIcon = rol.icon;
                      const isSelected = rol.id === rolActivo.id;
                      return (
                        <button
                          key={rol.id}
                          onClick={() => handleSelectRol(rol)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-100 dark:bg-slate-800/80 font-medium"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${rol.badgeColor}`}>
                              <ItemIcon size={15} strokeWidth={2} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {rol.label}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {rol.usuario}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <Check size={16} className="text-[#166193] dark:text-[#37A6DE] shrink-0 ml-2" strokeWidth={2.5} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <Outlet context={{ rolActivo, userRole: rolActivo?.id, puedeEditar: rolActivo?.id === "director" }} />
        </main>
      </div>
    </div>
  );
}
