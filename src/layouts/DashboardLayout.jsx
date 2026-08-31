// Archivo: src/layouts/DashboardLayout.jsx
import { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { Bell, LogOut, User } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Tooltip from "../components/Tooltip";
import { useAuth } from "../context/AuthContext";
import { mapDbRoleToUi, roleLabel } from "../utils/roles";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userRole = mapDbRoleToUi(user?.rol);
  const puedeEditar = userRole === "director";
  const displayName = [user?.nombres, user?.apellidos].filter(Boolean).join(" ") || "Usuario";
  const displayRole = roleLabel(user?.rol);

  const outletContext = useMemo(
    () => ({ user, userRole, puedeEditar }),
    [user, userRole, puedeEditar],
  );

  // Asegurar que el modo oscuro esté desactivado en toda la aplicación
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen w-screen max-w-full bg-slate-50 overflow-hidden font-nunito">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div className="flex-1 flex flex-col min-w-0 max-w-full h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <Tooltip text="Notificaciones y avisos del centro" position="bottom">
              <button
                aria-label="Notificaciones"
                className="relative text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
              >
                <Bell size={18} strokeWidth={1.8} />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
            </Tooltip>

            <div className="h-5 w-px bg-slate-200"></div>

            <Link
              to="/perfil"
              className="flex items-center gap-3 p-1.5 pl-2.5 rounded-lg hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
            >
              <div className="flex flex-col text-right leading-tight min-w-[90px]">
                <span className="text-sm font-semibold text-slate-900 font-nunito truncate max-w-[160px]">
                  {displayName}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {displayRole}
                </span>
              </div>

              {user?.fotoUrl ? (
                <img
                  src={user.fotoUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#166193]/10 flex items-center justify-center text-[#166193] shrink-0">
                  <User size={16} strokeWidth={2} />
                </div>
              )}
            </Link>

            <Tooltip text="Cerrar sesión" position="bottom">
              <button
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <LogOut size={18} strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
}

