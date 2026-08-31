// Archivo: src/components/StudentsTopBar.jsx
import React from "react";
import { 
  Search, 
  Plus, 
  Download, 
  Printer, 
  FilterX, 
  LayoutList, 
  LayoutGrid,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function StudentsTopBar({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroNivel,
  setFiltroNivel,
  totalResultados,
  onNuevo,
  onExportarCSV,
  onResetFiltros,
  puedeEditar = true,
  activeTab = 'alumnos',
  // Modos de visualización
  viewMode = 'table',
  setViewMode,
  // Simulador de estados
  demoState = 'success',
  setDemoState
}) {
  const isPostulantesTab = activeTab === 'postulantes';
  const isAnyFilterActive = busqueda.trim() !== "" || filtroEstado !== "todos" || filtroNivel !== "todos";

  return (
    <div className="flex flex-col gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200 no-print">
      
      {/* Fila Superior: Buscador, Filtros y Acciones Principales */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Controles de Búsqueda y Filtros */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={isPostulantesTab ? "Buscar postulante por nombre, DNI..." : "Buscar alumno por nombre, DNI..."}
              title={isPostulantesTab ? "Buscar por nombre, apellido, DNI o curso solicitado" : "Buscar por nombre, apellido, DNI o email"}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full h-9 pl-8 pr-3 text-xs font-nunito text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A6DE]/30 focus:border-[#37A6DE] transition-all"
            />
          </div>

          {/* Filtro por Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            title="Filtrar por estado"
            className="h-9 pl-3 pr-7 text-xs font-nunito text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A6DE]/30 focus:border-[#37A6DE] transition-all cursor-pointer font-medium"
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
              <>
                <option value="aspirante">Aspirantes / Pendientes</option>
              </>
            )}
          </select>

          {/* Filtro por Nivel Académico */}
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            title="Filtrar por nivel académico"
            className="h-9 pl-3 pr-7 text-xs font-nunito text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A6DE]/30 focus:border-[#37A6DE] transition-all cursor-pointer font-medium"
          >
            <option value="todos">Todos los niveles</option>
            <option value="Secundario">Secundario</option>
            <option value="Terciario">Terciario</option>
            <option value="Universitario">Universitario</option>
          </select>

          {/* Botón limpiar filtros */}
          {isAnyFilterActive && (
            <button
              onClick={onResetFiltros}
              title="Limpiar filtros activos"
              className="flex items-center gap-1 h-9 px-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-lg transition-colors cursor-pointer font-semibold"
            >
              <FilterX size={13} />
              <span>Limpiar</span>
            </button>
          )}

          {/* Contador de Resultados */}
          <span
            title="Total de registros filtrados"
            className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1 font-nunito cursor-default"
          >
            {totalResultados} {isPostulantesTab ? (totalResultados === 1 ? "postulante" : "postulantes") : (totalResultados === 1 ? "alumno" : "alumnos")}
          </span>
        </div>

        {/* Botones de Acción Sobre la Tabla */}
        <div className="flex items-center gap-2">
          {/* Alternador de Visualización (Tabla vs Tarjetas) */}
          {setViewMode && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Vista en Tabla"
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

          {/* Botón Exportar CSV */}
          <button
            onClick={onExportarCSV}
            title="Exportar listado a formato CSV"
            className="flex items-center gap-1.5 h-9 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold font-nunito transition-colors cursor-pointer shadow-xs bg-white dark:bg-slate-900"
          >
            <Download size={14} className="text-[#166193] dark:text-[#37A6DE]" />
            <span>Exportar</span>
          </button>

          {/* Botón Imprimir / PDF */}
          <button
            onClick={() => window.print()}
            title="Imprimir o exportar listado completo a PDF"
            className="flex items-center gap-1.5 h-9 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold font-nunito transition-colors cursor-pointer shadow-xs bg-white dark:bg-slate-900"
          >
            <Printer size={14} />
            <span>Imprimir</span>
          </button>

          {/* Botón Nuevo Registro */}
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

      {/* Fila Inferior Opcional: Selector Rápido de Estados de Demostración */}
      {setDemoState && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-nunito">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Estado visual de datos:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDemoState('success')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                demoState === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CheckCircle size={12} className={demoState === 'success' ? 'text-emerald-600' : ''} />
              <span>Con Datos (Normal)</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoState('loading')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                demoState === 'loading'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#166193] dark:text-[#37A6DE] font-bold border border-blue-200 dark:border-blue-800'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <RefreshCw size={12} className={demoState === 'loading' ? 'animate-spin text-[#166193] dark:text-[#37A6DE]' : ''} />
              <span>Cargando (Loading Skeleton)</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoState('empty')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                demoState === 'empty'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <AlertCircle size={12} className={demoState === 'empty' ? 'text-amber-600' : ''} />
              <span>Vacío (Empty State)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
