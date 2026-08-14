import React from 'react'
import { X, Calendar, Phone, Mail, MapPin, Award, BookOpen, Clock, Download, Printer, GraduationCap } from 'lucide-react'
import BadgeStatus from '../BadgeStatus'

function InstructorDetailDrawer({ instructor, isOpen, onClose, onExport }) {
  if (!instructor) return null

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-30 bg-custom-gris-oscuro/50 dark:bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer slide-over container */}
      <section 
        className={`fixed inset-y-0 right-0 z-45 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-custom-gris-claro/10 dark:border-slate-800 flex flex-col h-full transition-transform duration-300 ease-in-out transform font-roboto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-labelledby="drawer-title"
        aria-hidden={!isOpen}
      >
        {/* Header section with blue custom background */}
        <div className="p-6 bg-custom-azul-oscuro text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Cerrar panel de detalle"
            aria-label="Cerrar panel de detalle"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4 mt-2">
            {instructor.profile_photo_url ? (
              <img 
                src={instructor.profile_photo_url} 
                alt={`${instructor.first_name} ${instructor.last_name}`}
                className={`h-16 w-16 rounded-full object-cover shadow-md ${
                  instructor.status_id === 1 ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/30' :
                  instructor.status_id === 3 ? 'border-2 border-amber-500 ring-2 ring-amber-500/30' :
                  'border-2 border-red-500 ring-2 ring-red-500/30'
                }`}
              />
            ) : (
              <div className={`h-16 w-16 rounded-full bg-white text-custom-azul-oscuro flex items-center justify-center text-2xl font-extrabold font-nunito shadow-md ${
                instructor.status_id === 1 ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/30' :
                instructor.status_id === 3 ? 'border-2 border-amber-500 ring-2 ring-amber-500/30' :
                'border-2 border-red-500 ring-2 ring-red-500/30'
              }`}>
                {instructor.first_name[0]}{instructor.last_name[0]}
              </div>
            )}
            <div>
              <h2 id="drawer-title" className="font-nunito font-extrabold text-xl leading-tight text-white">
                {instructor.first_name} {instructor.last_name}
              </h2>
              <p className="text-xs text-custom-celeste font-semibold mt-0.5">
                ID Docente: #{instructor.id}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <BadgeStatus status={instructor.status_id === 3 ? 'licencia' : instructor.status_id} />
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-bold uppercase">
                  {instructor.role_name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable details area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section: Especialidad y Cursos Asignados */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-custom-celeste" />
              Especialidad y Cursos
            </h3>
            <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl space-y-3 border border-gray-100/50 dark:border-slate-800/80">
              <div>
                <p className="text-[10px] text-custom-gris-claro dark:text-slate-400 font-bold uppercase">Especialidad Principal</p>
                <p className="text-sm font-extrabold text-custom-azul-oscuro dark:text-custom-celeste mt-0.5">{instructor.specialty || instructor.course_name || 'Docencia Técnica'}</p>
              </div>
              
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                <p className="text-[10px] text-custom-gris-claro dark:text-slate-400 font-bold uppercase mb-2">Cursos a Cargo</p>
                <div className="flex flex-wrap gap-1.5">
                  {instructor.assigned_courses && instructor.assigned_courses.length > 0 ? (
                    instructor.assigned_courses.map((curso, idx) => (
                      <span key={idx} className="text-xs font-bold bg-custom-celeste/10 dark:bg-custom-celeste/15 text-custom-azul-oscuro dark:text-custom-celeste px-2.5 py-1 rounded-md border border-custom-celeste/20 dark:border-custom-celeste/30 flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-custom-celeste" />
                        {curso}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-bold bg-custom-celeste/10 dark:bg-custom-celeste/15 text-custom-azul-oscuro dark:text-custom-celeste px-2.5 py-1 rounded-md border border-custom-celeste/20 dark:border-custom-celeste/30 flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-custom-celeste" />
                      {instructor.course_name || 'Sin cursos asignados'}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] text-custom-gris-claro dark:text-slate-400 font-bold uppercase">Fecha de Ingreso</p>
                  <p className="text-xs text-custom-gris-oscuro dark:text-slate-200 font-bold mt-0.5">{instructor.hire_date || instructor.enrollment_date || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-custom-gris-claro dark:text-slate-400 font-bold uppercase">Nivel Académico</p>
                  <p className="text-xs text-custom-gris-oscuro dark:text-slate-200 font-bold mt-0.5 capitalize">{instructor.academic_level || 'Universitario'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: General Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-custom-celeste" />
              Datos de Contacto
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-custom-gris-claro dark:text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-custom-gris-claro dark:text-slate-400">Dirección</p>
                  <p className="text-custom-gris-oscuro dark:text-slate-200 font-bold mt-0.5">{instructor.address || 'Av. Montevideo y Calle 30, Berisso'}</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-custom-gris-claro dark:text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-custom-gris-claro dark:text-slate-400">Teléfono de Contacto</p>
                  <p className="text-custom-gris-oscuro dark:text-slate-200 font-bold mt-0.5 font-mono">{instructor.phone || 'Sin registrar'}</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-custom-gris-claro dark:text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-custom-gris-claro dark:text-slate-400">Email Institucional</p>
                  <p className="text-custom-gris-oscuro dark:text-slate-200 font-bold mt-0.5">{instructor.email}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Section: Identificación */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-custom-celeste" />
              Documentación y Registro
            </h3>
            <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl flex items-center justify-between text-xs border border-gray-100/50 dark:border-slate-800/80">
              <div>
                <p className="text-[10px] text-custom-gris-claro dark:text-slate-400 font-bold uppercase">Documento Nacional de Identidad</p>
                <p className="font-mono font-bold text-custom-gris-oscuro dark:text-slate-200 mt-0.5">{instructor.dni}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-custom-gris-claro dark:text-slate-400 font-bold uppercase">Estado de Legajo</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Completo / Vigente</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3 shrink-0">
          <button
            onClick={() => onExport && onExport(instructor.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white dark:bg-slate-900 border border-custom-gris-claro/20 dark:border-slate-700 text-custom-gris-oscuro dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4 text-custom-azul-oscuro dark:text-custom-celeste" />
            Descargar Ficha PDF
          </button>
          
          <button
            onClick={() => window.print()}
            className="p-2 border border-custom-gris-claro/20 dark:border-slate-700 text-custom-gris-claro dark:text-slate-400 hover:text-custom-gris-oscuro dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer bg-white dark:bg-slate-900"
            title="Imprimir legajo"
            aria-label="Imprimir legajo"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  )
}

export default InstructorDetailDrawer
