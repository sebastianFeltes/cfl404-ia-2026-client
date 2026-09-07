// Archivo: src/components/StudentsTopBar.jsx
import React from "react";
import { 
  Search, 
  Plus, 
  FilterX, 
  LayoutList, 
  LayoutGrid,
} from "lucide-react";

export default function StudentsTopBar({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  totalResultados,
  onNuevo,
  onResetFiltros,
  puedeEditar = true,
  activeTab = 'alumnos',
  viewMode = 'table',
  setViewMode,
}) {
  const isPostulantesTab = activeTab === 'postulantes';
  const isAnyFilterActive = busqueda.trim() !== "" || filtroEstado !== "todos";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 p-4 space-y-4 no-print transition-colors">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-gris-claro dark:text-slate-400" />
          <input
            type="text"
            placeholder={isPostulantesTab ? "Buscar postulante por nombre, DNI..." : "Buscar alumno por nombre, DNI..."}
            title={isPostulantesTab ? "Buscar por nombre, apellido, DNI o curso solicitado" : "Buscar por nombre, apellido, DNI o email"}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 font-medium transition-colors"
            aria-label={isPostulantesTab ? "Buscar postulantes" : "Buscar alumnos"}
          />
        </div>

        <div className="w-full lg:w-72">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            title="Filtrar por estado"
            className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-200 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste cursor-pointer transition-colors"
            aria-label="Filtrar por Estado"
          >
            <option value="todos">Todos los estados</option>
            {!isPostulantesTab && (
              <>
                <option value="activo">Activos</option>
                <option value="presente">Presentes Hoy</option>
                <option value="inactivo">Inactivos / Egresados</option>
                <option value="suspendido">Suspendidos</option>
              </>
            )}
            {isPostulantesTab && (
              <option value="aspirante">Aspirantes / Pendientes</option>
            )}
          </select>
        </div>

        {isAnyFilterActive && (
          <button
            onClick={onResetFiltros}
            title="Limpiar filtros activos"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/60 transition-colors w-full lg:w-auto justify-center cursor-pointer"
            aria-label="Limpiar todos los filtros"
          >
            <FilterX className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}

        <span
          title="Total de registros filtrados"
          className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-nunito cursor-default whitespace-nowrap"
        >
          {totalResultados} {isPostulantesTab ? (totalResultados === 1 ? "postulante" : "postulantes") : (totalResultados === 1 ? "alumno" : "alumnos")}
        </span>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          {setViewMode && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Vista en Tabla"
                aria-label="Vista en tabla"
                aria-pressed={viewMode === 'table'}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-[#166193] dark:text-[#37A6DE] shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LayoutList size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Vista en Tarjetas / Cuadrícula"
                aria-label="Vista en tarjetas"
                aria-pressed={viewMode === 'grid'}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-[#166193] dark:text-[#37A6DE] shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          )}

          {puedeEditar && (
            <button
              onClick={onNuevo}
              title={isPostulantesTab ? "Registrar un nuevo alumno postulante" : "Registrar un nuevo alumno en la institución"}
              className={`flex items-center gap-1.5 h-9 px-3.5 text-white rounded-lg text-xs font-bold font-nunito transition-colors cursor-pointer shadow-xs ${
                isPostulantesTab 
                  ? 'bg-[#37A6DE] hover:bg-[#2c91c4] dark:bg-[#37A6DE] dark:hover:bg-[#2c91c4]' 
                  : 'bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa]'
              }`}
            >
              <Plus size={15} strokeWidth={2.5} className="text-[#FDEA14]" />
              {isPostulantesTab ? 'Nuevo Postulante' : 'Nuevo Alumno'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
