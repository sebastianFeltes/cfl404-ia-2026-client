import React from 'react'
import { X, Calendar, Phone, Mail, MapPin, Award, CheckSquare, Square, Download, Printer } from 'lucide-react'
import BadgeStatus from './BadgeStatus'

function StudentDetailDrawer({ student, isOpen, onClose, onExport }) {
  if (!student) return null

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-30 bg-custom-gris-oscuro/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer slide-over container */}
      <section 
        className={`fixed inset-y-0 right-0 z-45 w-full max-w-md bg-white shadow-2xl border-l border-custom-gris-claro/10 flex flex-col h-full transition-transform duration-300 ease-in-out transform font-roboto ${
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
            <div className="h-16 w-16 rounded-full bg-white text-custom-azul-oscuro flex items-center justify-center text-2xl font-extrabold font-nunito shadow-md border-2 border-custom-celeste">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <div>
              <h2 id="drawer-title" className="font-nunito font-extrabold text-xl leading-tight">
                {student.first_name} {student.last_name}
              </h2>
              <p className="text-xs text-custom-celeste font-semibold mt-0.5">
                ID Alumno: #{student.id}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <BadgeStatus status={student.status_id} />
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-bold uppercase">
                  {student.role_name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable details area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section: Academic Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro uppercase tracking-widest border-b border-gray-100 pb-1 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-custom-celeste" />
              Detalle Académico
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div>
                <p className="text-[10px] text-custom-gris-claro font-bold uppercase">Curso Inscrito</p>
                <p className="text-sm font-extrabold text-custom-azul-oscuro mt-0.5">{student.course_name || 'Ninguno'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100">
                <div>
                  <p className="text-[10px] text-custom-gris-claro font-bold uppercase">Fecha Inscripción</p>
                  <p className="text-xs text-custom-gris-oscuro font-bold mt-0.5">{student.enrollment_date || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-custom-gris-claro font-bold uppercase">Nivel Académico</p>
                  <p className="text-xs text-custom-gris-oscuro font-bold mt-0.5 capitalize">{student.academic_level || 'No registrado'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: General Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro uppercase tracking-widest border-b border-gray-100 pb-1 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-custom-celeste" />
              Datos de Contacto
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-custom-gris-claro shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-custom-gris-claro">Dirección</p>
                  <p className="text-custom-gris-oscuro font-bold mt-0.5">Calle Falsa 123, Berisso</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-custom-gris-claro shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-custom-gris-claro">Teléfono Principal</p>
                  <p className="text-custom-gris-oscuro font-bold mt-0.5 font-mono">{student.phone || 'Sin número'}</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-custom-gris-claro shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-custom-gris-claro">Email Principal</p>
                  <p className="text-custom-gris-oscuro font-bold mt-0.5">{student.email}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Section: Secondary Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro uppercase tracking-widest border-b border-gray-100 pb-1 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-custom-celeste" />
              Datos Personales
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold text-custom-gris-claro">DNI</p>
                <p className="text-custom-gris-oscuro font-bold mt-0.5 font-mono">{student.dni}</p>
              </div>
              <div>
                <p className="font-semibold text-custom-gris-claro">Fecha Nacimiento</p>
                <p className="text-custom-gris-oscuro font-bold mt-0.5">14/05/2002</p>
              </div>
              <div>
                <p className="font-semibold text-custom-gris-claro">Nacionalidad</p>
                <p className="text-custom-gris-oscuro font-bold mt-0.5">Argentino</p>
              </div>
              <div>
                <p className="font-semibold text-custom-gris-claro">Género</p>
                <p className="text-custom-gris-oscuro font-bold mt-0.5">Masculino</p>
              </div>
            </div>
          </div>

          {/* Section: Documents Copies Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro uppercase tracking-widest border-b border-gray-100 pb-1 flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-custom-celeste" />
              Documentación Presentada
            </h3>
            <div className="space-y-2.5 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-custom-gris-oscuro">
                <CheckSquare className="h-4.5 w-4.5 text-custom-celeste shrink-0" />
                <span>Copia DNI Físico / Digital</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-custom-gris-oscuro">
                <CheckSquare className="h-4.5 w-4.5 text-custom-celeste shrink-0" />
                <span>Ficha de Inscripción Firmada</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-custom-gris-claro">
                {/* Simulation: Sofia or suspended student has not delivered secondary title copy yet */}
                {student.status_id === 3 ? (
                  <>
                    <Square className="h-4.5 w-4.5 text-custom-gris-claro shrink-0" />
                    <span className="line-through text-red-500">Copia Título Secundario (Faltante)</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4.5 w-4.5 text-custom-celeste shrink-0" />
                    <span>Copia Título Secundario</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions panel */}
        <div className="p-4 border-t border-custom-gris-claro/10 bg-gray-50 flex items-center gap-3 shrink-0">
          <button
            onClick={() => onExport && onExport(student.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-custom-amarillo" />
            Descargar Ficha
          </button>
          
          <button
            onClick={() => window.print()}
            className="p-2 border border-custom-gris-claro/30 text-custom-gris-oscuro hover:bg-gray-100 rounded-lg"
            title="Imprimir Ficha de Alumno"
            aria-label="Imprimir Ficha de Alumno"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  )
}

export default StudentDetailDrawer
