// Archivo: src/pages/Instructores.jsx
import { useState, useMemo } from "react";
import { useOutletContext } from "react-router";
import { instructores as mockInstructores } from "../components/instructores/mockData";
import TopBar from "../components/instructores/TopBar";
import InstructoresTabla from "../components/instructores/InstructoresTabla";
import InstructorDrawer from "../components/instructores/InstructorDrawer";
import NuevoInstructorDrawer from "../components/instructores/NuevoInstructorDrawer";

export default function Instructores() {
  const context = useOutletContext();
  const puedeEditar = context?.puedeEditar ?? true;

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [seleccionado, setSeleccionado] = useState(null);
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [listaInstructores, setListaInstructores] = useState(mockInstructores);

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  // Lista filtrada
  const filtrados = useMemo(() => {
    let lista = [...listaInstructores];
    if (filtroEstado !== "todos") {
      lista = lista.filter((i) => i.estado === filtroEstado);
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (i) =>
          i.nombre.toLowerCase().includes(q) ||
          i.apellido.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.dni.includes(q)
      );
    }
    return lista;
  }, [busqueda, filtroEstado, listaInstructores]);

  // Resetear página al filtrar o buscar
  useMemo(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // Lista segmentada para pantalla
  const paginados = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    return filtrados.slice(inicio, inicio + itemsPorPagina);
  }, [filtrados, paginaActual, itemsPorPagina]);

  const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);

  const handleGuardar = (nuevoInstructor) => {
    const nuevo = {
      ...nuevoInstructor,
      id: Date.now(),
      avatar: null,
    };
    setListaInstructores((prev) => [...prev, nuevo]);
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto font-nunito">
      {/* Encabezado de página */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 font-roboto transition-colors">
          Cuerpo Docente
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          Gestión de instructores y asignaciones
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden transition-colors duration-200">
        <TopBar
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          totalResultados={filtrados.length}
          onNuevo={() => setNuevoOpen(true)}
          puedeEditar={puedeEditar}
        />
        
        {/* Tabla en Pantalla (Paginada y con Acciones) */}
        <div className="no-print">
          <InstructoresTabla
            instructores={paginados}
            onSeleccionar={setSeleccionado}
            onEditar={(inst) => setSeleccionado(inst)}
            puedeEditar={puedeEditar}
          />
        </div>

        {/* Tabla para Impresión (Completa de 100+ elementos y limpia de controles) */}
        <div className="print-only">
          <InstructoresTabla
            instructores={filtrados}
            onSeleccionar={() => {}}
            onEditar={() => {}}
            puedeEditar={false}
          />
        </div>

        {/* Controles de Paginación (Sólo en Pantalla) */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 no-print text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Mostrar</span>
            <select
              value={itemsPorPagina}
              onChange={(e) => {
                setItemsPorPagina(Number(e.target.value));
                setPaginaActual(1);
              }}
              title="Cantidad de instructores a mostrar por página"
              className="h-7 px-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>por página</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span>
              Mostrando <strong>{filtrados.length === 0 ? 0 : (paginaActual - 1) * itemsPorPagina + 1}</strong> a{" "}
              <strong>{Math.min(paginaActual * itemsPorPagina, filtrados.length)}</strong> de{" "}
              <strong>{filtrados.length}</strong> resultados
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                title="Ir a la página anterior"
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                title="Ir a la página siguiente"
                className="h-7 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      <InstructorDrawer
        instructor={seleccionado}
        onClose={() => setSeleccionado(null)}
        onEliminar={(inst) => {
          if (window.confirm(`¿Eliminar a ${inst.nombre} ${inst.apellido}?`)) {
            setListaInstructores((prev) => prev.filter((i) => i.id !== inst.id));
          }
        }}
        puedeEditar={puedeEditar}
      />

      <NuevoInstructorDrawer
        open={nuevoOpen}
        onClose={() => setNuevoOpen(false)}
        onGuardar={handleGuardar}
      />
    </div>
  );
}
