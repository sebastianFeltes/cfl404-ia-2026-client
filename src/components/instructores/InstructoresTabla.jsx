// Archivo: src/components/instructores/InstructoresTabla.jsx
import { Eye, Pencil } from "lucide-react";
import InstructorAvatar from "./InstructorAvatar";

const COLS = [
  { label: "Instructor", width: "28%", align: "left" },
  { label: "DNI", width: "14%", align: "left" },
  { label: "Email Institucional", width: "26%", align: "left" },
  { label: "Teléfono", width: "18%", align: "left" },
  { label: "Acciones", width: "14%", align: "right" },
];

const estadoTextos = {
  activo: "Estado: Activo (Actualmente ejerciendo)",
  licencia: "Estado: En Licencia (Temporalmente ausente)",
  inactivo: "Estado: Inactivo (Dado de baja)",
};

export default function InstructoresTabla({ instructores, onSeleccionar, onEditar, puedeEditar = true }) {
  if (instructores.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400 dark:text-slate-500 font-nunito text-sm">No se encontraron instructores.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="flex items-center px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
        {COLS.map((col) => (
          <div
            key={col.label}
            style={{ width: col.width }}
            className={`text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold font-nunito ${
              col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
            } ${col.label === "Acciones" ? "no-print" : ""}`}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Filas */}
      <div className="flex flex-col">
        {instructores.map((inst) => (
          <div
            key={inst.id}
            className="group flex items-center px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-colors duration-200"
          >
            {/* Instructor */}
            <div style={{ width: COLS[0].width }} className="flex items-center gap-3">
              <div title={estadoTextos[inst.estado] || "Estado: Activo"}>
                <InstructorAvatar src={inst.avatar} nombre={inst.nombre} estado={inst.estado} size="sm" />
              </div>
              <div
                title={`Ver expediente de ${inst.nombre} ${inst.apellido}`}
                className="min-w-0 cursor-pointer"
                onClick={() => onSeleccionar(inst)}
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-nunito truncate hover:text-[#166193] dark:hover:text-[#37A6DE] transition-colors">
                  {inst.nombre} {inst.apellido}
                </p>
                <p className="text-[12px] text-slate-400 dark:text-slate-500 font-nunito truncate mt-0.5">
                  {inst.rol}
                </p>
              </div>
            </div>

            {/* DNI */}
            <div style={{ width: COLS[1].width }}>
              <span
                title="Documento Nacional de Identidad"
                className="text-sm text-slate-500 dark:text-slate-400 font-nunito tabular-nums cursor-default"
              >
                {inst.dni}
              </span>
            </div>

            {/* Email */}
            <div style={{ width: COLS[2].width }}>
              <p
                title={`Correo institucional: ${inst.email}`}
                className="text-sm text-slate-500 dark:text-slate-400 font-nunito truncate cursor-default hover:text-[#166193] dark:hover:text-[#37A6DE] transition-colors"
              >
                {inst.email}
              </p>
            </div>

            {/* Teléfono */}
            <div style={{ width: COLS[3].width }}>
              <span
                title="Teléfono / WhatsApp de contacto"
                className="text-sm text-slate-500 dark:text-slate-400 font-nunito tabular-nums cursor-default"
              >
                {inst.telefono || "—"}
              </span>
            </div>

            {/* Acciones */}
            <div style={{ width: COLS[4].width }} className="flex items-center justify-end gap-1 no-print">
              <button
                onClick={(e) => { e.stopPropagation(); onSeleccionar(inst); }}
                title="Ver expediente completo"
                aria-label="Ver detalles"
                className="p-1.5 rounded-md text-slate-400 dark:text-slate-400 hover:text-[#166193] dark:hover:text-[#37A6DE] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Eye size={15} strokeWidth={2} />
              </button>

              {puedeEditar && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEditar?.(inst); }}
                  title="Editar datos del docente"
                  aria-label="Editar instructor"
                  className="p-1.5 rounded-md text-slate-400 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-all cursor-pointer"
                >
                  <Pencil size={15} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
