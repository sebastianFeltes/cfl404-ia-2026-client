import React, { useState, useEffect } from 'react'
import { X, Save, UserPlus, Pencil, MapPin, Phone, Mail, Calendar, User, Globe, UserX } from 'lucide-react'

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
    onSubmit(formData)
  }

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
        aria-labelledby="form-drawer-title"
        aria-hidden={!isOpen}
      >
        {/* Header section with theme colors */}
        <div className="p-6 bg-custom-gris-oscuro text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/85 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Cerrar formulario"
            aria-label="Cerrar formulario"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2.5 bg-custom-azul-oscuro rounded-lg text-white shadow-md">
              {student ? <Pencil className="h-5 w-5 text-custom-amarillo" /> : <UserPlus className="h-5 w-5 text-custom-amarillo" />}
            </div>
            <div>
              <h2 id="form-drawer-title" className="font-nunito font-extrabold text-lg leading-tight">
                {student 
                  ? (formData.role_name === 'Postulante' ? 'Modificar Registro de Postulante' : 'Modificar Registro de Alumno') 
                  : (formData.role_name === 'Postulante' ? 'Registrar Nuevo Postulante' : 'Registrar Nuevo Alumno')}
              </h2>
              <p className="text-xs text-custom-gris-claro font-semibold mt-0.5">
                {student ? `Editando registro ID #${student.id}` : (formData.role_name === 'Postulante' ? 'Carga de aspirante a curso' : 'Alta inicial en base de datos')}
              </p>
            </div>
          </div>
        </div>

        {/* Form elements container */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* Display message if read-only */}
            {isReadOnly && (
              <div className="bg-amber-50 text-amber-800 text-xs border border-amber-200 rounded-lg p-3 font-semibold">
                * Tu rol actual no tiene permisos para crear o modificar registros (Modo solo lectura).
              </div>
            )}

            {/* Field: Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Nombre</label>
                <input 
                  type="text" 
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                  placeholder="Ej: Juan"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Apellido</label>
                <input 
                  type="text" 
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                  placeholder="Ej: Pérez"
                />
              </div>
            </div>

            {/* Field: DNI y Rol */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">DNI</label>
                <input 
                  type="text" 
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-mono font-semibold"
                  placeholder="Ej: 34.567.890"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Rol de Alumno</label>
                <select 
                  name="role_name"
                  value={formData.role_name}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs bg-white focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                >
                  <option value="Alumno">Alumno</option>
                  <option value="Egresado">Egresado</option>
                  <option value="Postulante">Postulante</option>
                </select>
              </div>
            </div>

            <hr className="border-gray-100 my-2" />

            {/* Subtítulo: Datos Personales y Domicilio */}
            <h3 className="text-[11px] font-extrabold text-custom-celeste uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Datos Personales y Domicilio
            </h3>

            {/* Field: Fecha de Nacimiento y Género */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Fecha de Nacimiento</label>
                <input 
                  type="text" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                  placeholder="Ej: 14/05/2002"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Género</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs bg-white focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
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
              <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Domicilio / Dirección</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                placeholder="Ej: Calle 12 N° 450, Berisso"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Nacionalidad</label>
              <input 
                type="text" 
                name="nacionality"
                value={formData.nacionality}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                placeholder="Ej: Argentina"
              />
            </div>

            <hr className="border-gray-100 my-2" />

            {/* Subtítulo: Contacto y Emergencia */}
            <h3 className="text-[11px] font-extrabold text-custom-celeste uppercase tracking-widest flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Contacto y Emergencia
            </h3>

            {/* Field: Email Principal y Alternativo */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Email Principal</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isReadOnly}
                required
                className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                placeholder="Ej: juan.perez@gmail.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Email Alternativo (Opcional)</label>
              <input 
                type="email" 
                name="extra_email"
                value={formData.extra_email}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                placeholder="Ej: jperez.trabajo@outlook.com"
              />
            </div>

            {/* Field: Teléfono Principal y Teléfono de Emergencia */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Teléfono Principal</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                  placeholder="Ej: 11-4567-8901"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Teléfono Emergencia</label>
                <input 
                  type="text" 
                  name="extra_phone"
                  value={formData.extra_phone}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                  placeholder="Ej: 11-4567-0099"
                />
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* Academic Info Headers */}
            <h3 className="text-[11px] font-extrabold text-custom-celeste uppercase tracking-widest">
              Información Curricular
            </h3>

            {/* Field: Curso Inscrito */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Curso a Asignar</label>
              <select 
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                disabled={isReadOnly}
                required
                className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs bg-white focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
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
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Estado en Institución</label>
                <select 
                  name="status_id"
                  value={formData.status_id}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs bg-white focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                >
                  <option value="1">Activo</option>
                  <option value="2">Inactivo</option>
                  <option value="3">Suspendido</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Nivel Académico Máx.</label>
                <select 
                  name="academic_level"
                  value={formData.academic_level}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full p-2 border border-custom-gris-claro/20 rounded-lg text-xs bg-white focus:outline-none focus:border-custom-azul-oscuro text-custom-gris-oscuro font-semibold"
                >
                  <option value="Secundario">Secundario Completo</option>
                  <option value="Terciario">Terciario</option>
                  <option value="Universitario">Universitario</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Submit Actions — "Dar de Baja" a la izquierda y "Guardar Cambios" a la derecha */}
          <div className="p-4 border-t border-custom-gris-claro/10 bg-gray-50 flex items-center justify-between gap-3 shrink-0">
            {student && (userRole === 'director' || userRole === 'secretaria') ? (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onDelete?.(student.id)
                }}
                className="px-3.5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                title="Dar de baja este alumno"
              >
                <UserX className="h-3.5 w-3.5" />
                Dar de Baja
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isReadOnly}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ml-auto ${
                isReadOnly 
                  ? 'bg-custom-gris-claro text-white opacity-50 cursor-not-allowed' 
                  : 'bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white shadow-sm'
              }`}
            >
              <Save className="h-4 w-4 text-custom-amarillo" />
              {student ? 'Guardar Cambios' : (formData.role_name === 'Postulante' ? 'Registrar Postulante' : 'Guardar Alumno')}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default StudentFormDrawer
