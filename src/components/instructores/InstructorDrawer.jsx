// Archivo: src/components/instructores/InstructorDrawer.jsx
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Phone, Mail, Calendar, User as UserIcon, Globe, Clock, BookOpen, Pencil, Trash2 } from "lucide-react";
import InstructorAvatar from "./InstructorAvatar";
import InstructorBadge from "./InstructorBadge";

export default function InstructorDrawer({ instructor, onClose, onEliminar, puedeEditar = true }) {
  if (!instructor) return null;

  const details = {
    address: instructor.direccion || "—",
    phone: instructor.telefono || "—",
    extra_phone: instructor.extra_phone || "—",
    extra_email: instructor.emailAlt || "—",
    dob: instructor.fechaNacimiento || "—",
    gender: instructor.genero || "No especificado",
    nacionality: instructor.nacionalidad || "Argentina",
    created_at: instructor.fechaIngreso || "—",
  };

  const estadoTextos = {
    activo: "Estado: Activo",
    licencia: "Estado: En Licencia",
    inactivo: "Estado: Inactivo",
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-[450px] z-50 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200"
      >
        {/* Cabecera */}
        <div className="bg-white dark:bg-slate-900 px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800/80 relative shrink-0">
          <button
            onClick={onClose}
            title="Cerrar panel de detalles"
            aria-label="Cerrar"
            className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-1 transition-all focus:outline-none cursor-pointer"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-5">
            <div title={estadoTextos[instructor.estado] || "Docente Activo"}>
              <InstructorAvatar src={instructor.avatar} nombre={instructor.nombre} estado={instructor.estado} size="xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 font-roboto leading-tight">
                {instructor.nombre} {instructor.apellido}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-nunito mt-1 mb-3">
                {instructor.rol}
              </p>
              <div title={estadoTextos[instructor.estado] || "Estado del docente"}>
                <InstructorBadge estado={instructor.estado} />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 font-nunito">
          <dl>
            {/* Contacto */}
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-6 mb-3">
              Contacto
            </dt>
            <div className="space-y-4">
              <DataRow icon={MapPin} label="Dirección" value={details.address} title="Dirección de residencia declarada" />
              <DataRow icon={Phone} label="Teléfono" value={details.phone} title="Número principal de contacto" />
              <DataRow icon={Phone} label="Teléfono Secundario" value={details.extra_phone} title="Teléfono secundario / alternativo" />
              <DataRow icon={Mail} label="Email Alternativo" value={details.extra_email} title="Correo electrónico personal" />
            </div>

            {/* Personal */}
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-8 mb-3">
              Personal
            </dt>
            <div className="space-y-4">
              <DataRow icon={Calendar} label="Fecha de Nac." value={formatFecha(details.dob)} title="Fecha de nacimiento" />
              <DataRow icon={UserIcon} label="Género" value={details.gender} title="Género registrado" />
              <DataRow icon={Globe} label="Nacionalidad" value={details.nacionality} title="País de origen" />
              <DataRow icon={Clock} label="Fecha de Ingreso" value={formatFecha(details.created_at)} title="Fecha de alta en el centro" />
            </div>
          </dl>

          {/* Cursos */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
              <BookOpen size={14} className="text-slate-400 dark:text-slate-500" /> Cursos asignados
            </h3>
            <div className="flex flex-wrap gap-2">
              {instructor.cursos?.map((curso) => (
                <span
                  key={curso}
                  title={`Curso a cargo de ${instructor.nombre}`}
                  className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-default"
                >
                  {curso}
                </span>
              ))}
            </div>
          </div>

          {/* Acciones de Edición/Baja (Sólo si puedeEditar es true) */}
          {puedeEditar && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <button
                onClick={() => { /* TODO: abrir edición */ }}
                title="Editar la información de este instructor"
                className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white text-sm font-medium font-nunito transition-colors cursor-pointer shadow-sm"
              >
                <Pencil size={15} strokeWidth={2} />
                Editar Instructor
              </button>
              <button
                onClick={() => { onEliminar?.(instructor); onClose(); }}
                title="Dar de baja o eliminar este instructor"
                className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium font-nunito transition-colors cursor-pointer"
              >
                <Trash2 size={15} strokeWidth={2} />
                Eliminar Instructor
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function DataRow({ icon: Icon, label, value, title }) {
  return (
    <dd title={title} className="flex items-start gap-3 w-full cursor-default">
      <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" strokeWidth={2} />
      <div className="flex-1">
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-200 mt-0.5 leading-tight">{value}</p>
      </div>
    </dd>
  );
}

function formatFecha(isoStr) {
  if (!isoStr || isoStr === "—") return "—";
  const parts = isoStr.split("-");
  if (parts.length !== 3) return isoStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}
