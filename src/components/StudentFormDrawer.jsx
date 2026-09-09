import React, { useState, useEffect } from 'react'
import { 
  X, 
  Save, 
  UserPlus, 
  Pencil, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Globe, 
  UserX,
  ShieldAlert,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

const INITIAL_FORM_STATE = {
  first_name: '',
  last_name: '',
  email: '',
  extra_email: '',
  dni: '',
  status_id: 1, // Default Activo
  role_name: 'Alumno',
  phone: '',
  extra_phone: '',
  address: '',
  dob: '',
  gender: 'Masculino',
  nacionality: 'Argentina',
  academic_level: 'Secundario',
  course_name: '',
  enrollment_date: ''
}

function StudentFormDrawer({ student, isOpen, onClose, onSubmit, onDelete, userRole, initialRole = 'Alumno' }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [showEmailChangeConfirm, setShowEmailChangeConfirm] = useState(false)
  const isReadOnly = userRole !== 'director' && userRole !== 'secretaria'

  // Update form data when student prop changes (Edit vs Add)
  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id,
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        extra_email: student.extra_email || student.studentDetail?.extraEmail || student.extraEmail || '',
        dni: student.dni || '',
        status_id: Number(student.status_id) || 1,
        role_name: student.role_name || (student.is_aspirante ? 'Postulante' : 'Alumno'),
        phone: student.phone || student.studentDetail?.phone || '',
        extra_phone: student.extra_phone || student.studentDetail?.extraPhone || student.extraPhone || '',
        address: student.address || student.studentDetail?.address || '',
        dob: student.dob || student.studentDetail?.dob || '',
        gender: student.gender || student.studentDetail?.gender || 'Masculino',
        nacionality: student.nacionality || student.studentDetail?.nacionality || 'Argentina',
        academic_level: student.academic_level || student.studentDetail?.academicLevel || 'Secundario',
        course_name: student.course_name || '',
        enrollment_date: student.enrollment_date || new Date().toLocaleDateString('es-AR')
      })
    } else {
      const defaultRole = initialRole === 'Postulante' ? 'Postulante' : 'Alumno'
      setFormData({
        ...INITIAL_FORM_STATE,
        role_name: defaultRole,
        status_id: defaultRole === 'Postulante' ? 3 : 1,
        enrollment_date: new Date().toLocaleDateString('es-AR')
      })
    }
  }, [student, isOpen, initialRole])

  useEffect(() => {
    setShowEmailChangeConfirm(false)
  }, [isOpen, student])

  const isEmailChanged = Boolean(
    student?.id && 
    student?.email && 
    formData.email?.trim().toLowerCase() !== student.email.trim().toLowerCase()
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status_id' ? Number(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isReadOnly) return

    // Al editar el email de un alumno existente, advertir y solicitar confirmación de cambio de acceso
    if (isEmailChanged && !showEmailChangeConfirm) {
      setShowEmailChangeConfirm(true)
      return
    }

    onSubmit(formData)
    setShowEmailChangeConfirm(false)
  }

  const handleConfirmEmailChange = () => {
    onSubmit(formData)
    setShowEmailChangeConfirm(false)
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-30 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer slide-over container */}
      <section 
        className={`fixed inset-y-0 right-0 z-45 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-custom-gris-claro/10 dark:border-slate-800 flex flex-col h-full transition-transform duration-300 ease-in-out transform font-roboto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-labelledby="form-drawer-title"
        aria-hidden={!isOpen}
      >
        {/* Header section with theme colors */}
        <div className="p-6 bg-custom-azul-oscuro text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Cerrar formulario"
            aria-label="Cerrar formulario"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 mt-1">
            <div className="p-2.5 bg-white/15 rounded-lg text-white shadow-sm border border-white/20 shrink-0">
              {student ? <Pencil className="h-5 w-5 text-custom-amarillo" /> : <UserPlus className="h-5 w-5 text-custom-amarillo" />}
            </div>
            <div className="min-w-0 pr-6">
              <h2 id="form-drawer-title" className="font-nunito font-extrabold text-lg leading-tight text-white truncate">
                {student 
                  ? (formData.role_name === 'Postulante' ? 'Modificar Registro de Postulante' : 'Modificar Registro de Alumno') 
                  : (formData.role_name === 'Postulante' ? 'Registrar Nuevo Postulante' : 'Registrar Nuevo Alumno')}
              </h2>
              <p className="text-xs text-custom-celeste font-medium mt-0.5">
                {student ? `Editando registro ID #${student.id}` : (formData.role_name === 'Postulante' ? 'Carga de aspirante a curso' : 'Alta inicial en base de datos')}
              </p>
            </div>
          </div>
        </div>

        {/* Form elements container */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-roboto">
            
            {/* Display message if read-only */}
            {isReadOnly && (
              <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-800 rounded-xl p-3 font-semibold font-nunito">
                * Tu rol actual no tiene permisos para crear o modificar registros (Modo solo lectura).
              </div>
            )}

            {/* Field: Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Nombre</label>
                <input 
                  type="text" 
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                  placeholder="Ej: Juan"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Apellido</label>
                <input 
                  type="text" 
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                  placeholder="Ej: Pérez"
                />
              </div>
            </div>

            {/* Field: DNI y Rol */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">DNI</label>
                <input 
                  type="text" 
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-mono font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                  placeholder="Ej: 34.567.890"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Rol de Alumno</label>
                <select 
                  name="role_name"
                  value={formData.role_name}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors cursor-pointer"
                >
                  <option value="Alumno">Alumno</option>
                  <option value="Egresado">Egresado</option>
                  <option value="Postulante">Postulante</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 my-2" />

            {/* Subtítulo: Datos Personales y Domicilio */}
            <h3 className="text-[11px] font-extrabold text-custom-azul-oscuro dark:text-custom-celeste uppercase tracking-wider flex items-center gap-1.5 font-nunito">
              <MapPin className="h-3.5 w-3.5" />
              Datos Personales y Domicilio
            </h3>

            {/* Field: Fecha de Nacimiento y Género */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Fecha de Nacimiento</label>
                <input 
                  type="text" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                  placeholder="Ej: 14/05/2002"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Género</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors cursor-pointer"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="No binario">No binario</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Field: Domicilio y Nacionalidad */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Domicilio / Dirección</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                placeholder="Ej: Calle 12 N° 450, Berisso"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Nacionalidad</label>
              <input 
                type="text" 
                name="nacionality"
                value={formData.nacionality}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                placeholder="Ej: Argentina"
              />
            </div>

            <hr className="border-slate-100 dark:border-slate-800 my-2" />

            {/* Subtítulo: Contacto y Emergencia */}
            <h3 className="text-[11px] font-extrabold text-custom-azul-oscuro dark:text-custom-celeste uppercase tracking-wider flex items-center gap-1.5 font-nunito">
              <Phone className="h-3.5 w-3.5" />
              Contacto y Emergencia
            </h3>

            {/* Field: Email Principal (Acceso al Sistema) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito flex items-center justify-between">
                <span>Email Principal (Acceso al Sistema)</span>
                {student?.id && (
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal lowercase">
                    cuenta de inicio de sesión
                  </span>
                )}
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isReadOnly}
                required
                className={`w-full p-2 border rounded-lg text-xs font-semibold focus:outline-none transition-colors ${
                  isEmailChanged 
                    ? 'border-amber-400 dark:border-amber-600 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100 focus:border-amber-500' 
                    : 'border-custom-gris-claro/20 dark:border-slate-700 bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 focus:border-custom-azul-oscuro dark:focus:border-custom-celeste'
                }`}
                placeholder="Ej: juan.perez@gmail.com"
              />

              {/* Cartel Informativo al Editar el Email de un Alumno */}
              {isEmailChanged && (
                <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-xl space-y-2 text-xs animate-fadeIn">
                  <div className="flex items-start gap-2 text-amber-800 dark:text-amber-200">
                    <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-[11px] uppercase tracking-wide font-nunito">
                        Aviso de Cambio de Acceso al Sistema
                      </h4>
                      <p className="text-[11px] text-amber-900/90 dark:text-amber-300 font-nunito mt-0.5 leading-relaxed">
                        Al cambiar este correo, <strong>se modificará la cuenta con la que el alumno ingresa a la plataforma</strong> (por ejemplo, si perdió el acceso a su cuenta de Google o cambió de casilla).
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/60 text-[10px] space-y-1 font-nunito text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-slate-400 line-through truncate max-w-[150px]">{student.email}</span>
                      <ArrowRight size={11} className="text-amber-500 shrink-0" />
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[150px]">{formData.email}</span>
                    </div>
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed">
                      🛡️ <strong>Consistencia asegurada:</strong> Todos los datos de su legajo, asistencias registradas y cursos asignados quedan guardados y vinculados al nuevo email, evitando que pierda su historial académico.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Email Alternativo (Opcional)</label>
              <input 
                type="email" 
                name="extra_email"
                value={formData.extra_email}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                placeholder="Ej: jperez.trabajo@outlook.com"
              />
            </div>

            {/* Field: Teléfono Principal y Teléfono de Emergencia */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Teléfono Principal</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                  placeholder="Ej: 11-4567-8901"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Teléfono Emergencia</label>
                <input 
                  type="text" 
                  name="extra_phone"
                  value={formData.extra_phone}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors"
                  placeholder="Ej: 11-4567-0099"
                />
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 my-4" />

            {/* Academic Info Headers */}
            <h3 className="text-[11px] font-extrabold text-custom-azul-oscuro dark:text-custom-celeste uppercase tracking-wider font-nunito">
              Información Curricular
            </h3>

            {/* Field: Curso Inscrito */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Curso a Asignar</label>
              <select 
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                disabled={isReadOnly}
                required
                className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors cursor-pointer"
              >
                <option value="">-- Seleccionar Curso --</option>
                <option value="Operador de PC">Operador de PC</option>
                <option value="Programador Web">Programador Web</option>
                <option value="Electricista Matriculado">Electricista Matriculado</option>
                <option value="Diseño Gráfico Digital">Diseño Gráfico Digital</option>
              </select>
            </div>

            {/* Field: Estado Académico e Nivel Académico */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Estado en Institución</label>
                <select 
                  name="status_id"
                  value={formData.status_id}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors cursor-pointer"
                >
                  <option value="1">Activo</option>
                  <option value="2">Inactivo</option>
                  <option value="3">Suspendido</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito">Nivel Académico Máx.</label>
                <select 
                  name="academic_level"
                  value={formData.academic_level}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 font-semibold focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste transition-colors cursor-pointer"
                >
                  <option value="Secundario">Secundario Completo</option>
                  <option value="Terciario">Terciario</option>
                  <option value="Universitario">Universitario</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Submit Actions — "Dar de Baja" a la izquierda y "Guardar Cambios" a la derecha */}
          <div className="p-4 border-t border-custom-gris-claro/10 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
            {student && (userRole === 'director' || userRole === 'secretaria') ? (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onDelete?.(student.id)
                }}
                className="px-3.5 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-xs font-nunito font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                title="Dar de baja este alumno"
              >
                <UserX className="h-3.5 w-3.5" />
                Dar de Baja
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isReadOnly}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-nunito font-bold transition-all cursor-pointer ml-auto ${
                isReadOnly 
                  ? 'bg-custom-gris-claro text-white opacity-50 cursor-not-allowed' 
                  : 'bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white shadow-xs'
              }`}
            >
              <Save className="h-4 w-4 text-custom-amarillo" />
              {student ? 'Guardar Cambios' : (formData.role_name === 'Postulante' ? 'Registrar Postulante' : 'Guardar Alumno')}
            </button>
          </div>
        </form>
      </section>

      {/* Modal de Confirmación al Cambiar el Email de Acceso */}
      {showEmailChangeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-nunito animate-fadeIn">
          <div 
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity"
            onClick={() => setShowEmailChangeConfirm(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl z-10 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 leading-tight">
                  ¿Confirmar cambio de acceso del alumno?
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                  Actualización de Cuenta y Consistencia de Legajo
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Vas a cambiar el correo de inicio de sesión de <strong>{student?.first_name} {student?.last_name}</strong>:
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 uppercase font-bold">Email Anterior:</span>
                <span className="font-mono text-slate-500 line-through truncate max-w-[200px]">{student?.email}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 dark:text-slate-300 uppercase font-bold">Nuevo Email:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">{formData.email}</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <p className="leading-snug">
                <strong>Datos seguros y consistentes:</strong> Si el alumno perdió el acceso a su cuenta Google anterior, este cambio le permitirá ingresar con su nueva cuenta sin perder sus asistencias, calificaciones ni su legajo histórico.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowEmailChangeConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Volver y Revisar
              </button>
              <button
                type="button"
                onClick={handleConfirmEmailChange}
                className="flex-1 py-2.5 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save size={14} className="text-custom-amarillo" />
                Confirmar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StudentFormDrawer
