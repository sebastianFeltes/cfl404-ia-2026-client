// Archivo: src/components/instructores/NuevoInstructorDrawer.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, UserPlus, MapPin, Phone, Mail, Calendar, Briefcase, CreditCard, BookOpen } from "lucide-react";

const CURSOS_DISPONIBLES = [
  "HTML & CSS Avanzado",
  "React con Vite",
  "Diseño UI/UX",
  "Python para IA",
  "Data Science",
  "SQL Avanzado",
  "APIs REST",
  "Docker & Kubernetes",
  "AWS Cloud",
  "Figma Avanzado",
  "Design Systems",
];

const initialForm = {
  nombre: "",
  apellido: "",
  dni: "",
  email: "",
  emailAlt: "",
  telefono: "",
  direccion: "",
  rol: "",
  estado: "activo",
  fechaNacimiento: "",
  fechaIngreso: "",
  cursos: [],
};

export default function NuevoInstructorDrawer({ open, onClose, onGuardar }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleCurso = (curso) => {
    setForm((prev) => ({
      ...prev,
      cursos: prev.cursos.includes(curso)
        ? prev.cursos.filter((c) => c !== curso)
        : [...prev.cursos, curso],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar?.(form);
    setForm(initialForm);
    onClose();
  };

  if (!open) return null;

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
        <div className="bg-white dark:bg-slate-900 px-8 pt-7 pb-5 border-b border-slate-100 dark:border-slate-800/80 relative shrink-0">
          <button
            onClick={onClose}
            title="Cancelar y cerrar formulario"
            aria-label="Cerrar"
            className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-1 transition-all focus:outline-none cursor-pointer"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#166193]/10 dark:bg-[#37A6DE]/10 flex items-center justify-center">
              <UserPlus size={24} className="text-[#166193] dark:text-[#37A6DE]" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 font-roboto leading-tight">
                Nuevo Instructor
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-nunito mt-0.5">
                Completá los datos del instructor
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 pb-8 font-nunito">
          {/* Datos personales */}
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-6 mb-3">
            Datos Personales
          </p>
          <div className="space-y-3">
            <FormField icon={Briefcase} label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} title="Nombre de pila del docente" required />
            <FormField icon={Briefcase} label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} title="Apellido paterno/materno" required />
            <FormField icon={CreditCard} label="DNI" name="dni" value={form.dni} onChange={handleChange} placeholder="Ej: 28.741.562" title="Número de DNI" required />
            <FormField icon={Briefcase} label="Rol / Cargo" name="rol" value={form.rol} onChange={handleChange} placeholder="Ej: Instructor Senior" title="Cargo o categoría docente" />
            <FormField icon={Calendar} label="Fecha de Nacimiento" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} type="date" title="Fecha de nacimiento" />
            <FormField icon={Calendar} label="Fecha de Ingreso" name="fechaIngreso" value={form.fechaIngreso} onChange={handleChange} type="date" title="Fecha de contratación o alta" />

            {/* Estado */}
            <div className="flex items-start gap-3">
              <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-2.5 shrink-0" strokeWidth={2} />
              <div className="flex-1">
                <label className="text-sm text-slate-500 dark:text-slate-400 leading-tight block mb-1">Estado</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  title="Selecciona la condición actual del docente"
                  className="w-full h-9 pl-3 pr-3 text-sm font-nunito text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A6DE]/30 focus:border-[#37A6DE] transition-all appearance-none cursor-pointer"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="licencia">Licencia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-8 mb-3">
            Contacto
          </p>
          <div className="space-y-3">
            <FormField icon={Mail} label="Email Institucional" name="email" value={form.email} onChange={handleChange} type="email" placeholder="ejemplo@cfl404.edu.ar" title="Correo oficial corporativo @cfl404.edu.ar" required />
            <FormField icon={Mail} label="Email Alternativo" name="emailAlt" value={form.emailAlt} onChange={handleChange} type="email" placeholder="ejemplo@gmail.com" title="Correo personal secundario" />
            <FormField icon={Phone} label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+54 11 1234-5678" title="Teléfono móvil o WhatsApp" />
            <FormField icon={MapPin} label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Av. Corrientes 3421, CABA" title="Domicilio de residencia" />
          </div>

          {/* Cursos */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
              <BookOpen size={14} className="text-slate-400 dark:text-slate-500" /> Cursos a asignar
            </h3>
            <div className="flex flex-wrap gap-2">
              {CURSOS_DISPONIBLES.map((curso) => {
                const selected = form.cursos.includes(curso);
                return (
                  <button
                    key={curso}
                    type="button"
                    onClick={() => toggleCurso(curso)}
                    title={selected ? "Haz clic para quitar este curso" : "Haz clic para asignar este curso"}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-all cursor-pointer
                      ${selected
                        ? "bg-[#166193] text-white border-[#166193] dark:bg-[#37A6DE] dark:border-[#37A6DE] dark:text-slate-950 font-semibold"
                        : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#37A6DE] hover:text-[#166193] dark:hover:text-[#37A6DE]"
                      }`}
                  >
                    {curso}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              title="Guardar e incorporar nuevo instructor"
              className="w-full h-10 bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white rounded-lg text-sm font-semibold font-nunito transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={16} strokeWidth={2} />
              Guardar Instructor
            </button>
          </div>
        </form>
      </motion.aside>
    </AnimatePresence>
  );
}

function FormField({ icon: Icon, label, name, value, onChange, type = "text", placeholder = "", title = "", required = false }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-2.5 shrink-0" strokeWidth={2} />
      <div className="flex-1">
        <label className="text-sm text-slate-500 dark:text-slate-400 leading-tight block mb-1">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          title={title}
          required={required}
          className="w-full h-9 px-3 text-sm font-nunito text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A6DE]/30 focus:border-[#37A6DE] transition-all"
        />
      </div>
    </div>
  );
}
