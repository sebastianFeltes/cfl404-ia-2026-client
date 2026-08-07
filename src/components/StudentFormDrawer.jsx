import React, { useState, useEffect } from 'react'
import { X, Save, UserPlus, Pencil } from 'lucide-react'

const INITIAL_FORM_STATE = {
  first_name: '',
  last_name: '',
  email: '',
  dni: '',
  status_id: 1, // Default Activo
  role_name: 'Alumno',
  phone: '',
  academic_level: 'Secundario',
  course_name: '',
  enrollment_date: ''
}

function StudentFormDrawer({ student, isOpen, onClose, onSubmit, userRole }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const isReadOnly = userRole === 'docente'

  // Update form data when student prop changes (Edit vs Add)
  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id,
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        dni: student.dni || '',
        status_id: Number(student.status_id) || 1,
        role_name: student.role_name || 'Alumno',
        phone: student.phone || '',
        academic_level: student.academic_level || 'Secundario',
        course_name: student.course_name || '',
        enrollment_date: student.enrollment_date || new Date().toLocaleDateString('es-AR')
      })
    } else {
      setFormData({
        ...INITIAL_FORM_STATE,
        enrollment_date: new Date().toLocaleDateString('es-AR')
      })
    }
  }, [student, isOpen])

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
                {student ? 'Modificar Registro de Alumno' : 'Registrar Nuevo Alumno'}
              </h2>
              <p className="text-xs text-custom-gris-claro font-semibold mt-0.5">
                {student ? `Editando registro ID #${student.id}` : 'Alta inicial en base de datos'}
              </p>
            </div>
          </div>
        </div>

        {/* Form elements container */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* Display message if read-only */}
            {isReadOnly && (
              <div className="bg-red-50 text-red-700 text-xs border border-red-200 rounded-lg p-3 font-semibold">
                * Tu rol actual (Docente) es de sólo lectura. No tienes permisos para modificar o crear registros.
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

            {/* Field: Email y Teléfono */}
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
              <label className="text-[10px] font-bold text-custom-gris-claro uppercase tracking-wider">Teléfono de Contacto</label>
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

          {/* Footer Submit Actions */}
          <div className="p-4 border-t border-custom-gris-claro/10 bg-gray-50 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-custom-gris-claro/30 text-custom-gris-oscuro hover:bg-gray-100 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isReadOnly}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isReadOnly 
                  ? 'bg-custom-gris-claro text-white opacity-50 cursor-not-allowed' 
                  : 'bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white shadow-sm'
              }`}
            >
              <Save className="h-4 w-4 text-custom-amarillo" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default StudentFormDrawer
