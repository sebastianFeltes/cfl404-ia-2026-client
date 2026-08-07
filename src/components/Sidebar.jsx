// Archivo: src/components/Sidebar.jsx
import { NavLink } from "react-router";
import { Users, Book, GraduationCap, BarChart2 } from "lucide-react";

const navItems = [
  { label: "Profesores", icon: Users, path: "/instructores", title: "Gestión de docentes e instructores" },
  { label: "Cursos", icon: Book, path: "/cursos", title: "Gestión de ofertas formativas" },
  { label: "Alumnos", icon: GraduationCap, path: "/alumnos", title: "Matrícula y nómina de estudiantes" },
  { label: "Reportes", icon: BarChart2, path: "/reportes", title: "Estadísticas y reportes de gestión" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 transition-colors duration-200">
      {/* Logo */}
      <div
        title="Centro de Formación Laboral Nº404 · Berisso"
        className="h-16 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800 shrink-0 cursor-pointer"
      >
        <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 dark:bg-white dark:p-0.5">
          <img
            src="/logo_texto_hero.svg"
            alt="CFL 404 Berisso"
            className="h-full w-full object-cover block"
          />
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[12px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight">Centro de</span>
          <span className="text-[12px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight">Formación Laboral</span>
          <span className="text-[12px] font-bold text-[#166193] dark:text-[#37A6DE] uppercase tracking-wide font-nunito leading-tight">Nº404 · Berisso</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="px-6 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-nunito">
          Menú
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            title={item.title}
            className={({ isActive }) =>
              `mx-3 px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-nunito transition-colors ${
                isActive
                  ? "bg-slate-100 dark:bg-slate-800 text-[#166193] dark:text-[#37A6DE] font-medium"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 font-normal"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
