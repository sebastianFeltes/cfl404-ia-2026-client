import React, { useState, useEffect } from 'react'
import { X, Save, UserPlus, Pencil } from 'lucide-react'

const INITIAL_FORM_STATE = {
  first_name: '',
  last_name: '',
  email: '',
  dni: '',
  status_id: 1, // Default Activo
  role_name: 'Instructor Titular',
  phone: '',
  academic_level: 'Universitario',
  specialty: '',
  course_name: '',
  hire_date: ''
}

function InstructorFormDrawer({ instructor, isOpen, onClose, onSubmit, userRole }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const isReadOnly = userRole === 'instructor' || userRole === 'secretaria'

  // Update form data when instructor prop changes (Edit vs Add)
  useEffect(() => {
    if (instructor) {
      setFormData({
        id: instructor.id,
        first_name: instructor.first_name || '',
        last_name: instructor.last_name || '',
        email: instructor.email || '',
        dni: instructor.dni || '',
        status_id: Number(instructor.status_id) || 1,
        role_name: instructor.role_name || 'Instructor Titular',
        phone: instructor.phone || '',
        academic_level: instructor.academic_level || 'Universitario',
        specialty: instructor.specialty || '',
        course_name: instructor.course_name || '',
        hire_date: instructor.hire_date || instructor.enrollment_date || new Date().toLocaleDateString('es-AR')
      })
    } else {
      setFormData({
        ...INITIAL_FORM_STATE,
        hire_date: new Date().toLocaleDateString('es-AR')
      })
    }
  }, [instructor, isOpen])

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
        aria-labelledby="form-drawer-title"
        aria-hidden={!isOpen}
      >
        {/* Header section with theme colors */}
        <div className="p-6 bg-custom-gris-oscuro dark:bg-slate-950 text-white relative shrink-0 border-b border-white/5 dark:border-slate-800">
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
              {instructor ? <Pencil className="h-5 w-5 text-custom-amarillo" /> : <UserPlus className="h-5 w-5 text-custom-amarillo" />}
            </div>
            <div>
              <h2 id="form-drawer-title" className="font-nunito font-extrabold text-lg leading-tight text-white">
                {instructor ? 'Modificar Registro de Instructor' : 'Registrar Nuevo Instructor'}
              </h2>
              <p className="text-xs text-custom-gris-claro dark:text-slate-400 font-semibold mt-0.5">
                {instructor ? `Editando registro ID #${instructor.id}` : 'Alta institucional en cuerpo docente'}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form id="instructor-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Ej. Martín"
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Ej. Echevarría"
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* DNI & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dni" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                required
                value={formData.dni}
                onChange={handleChange}
                placeholder="Ej. 31.098.441"
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej. 11-3318-5590"
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
              Email Institucional <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="m.echevarria@cfl404.edu.ar"
              className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
            />
          </div>

          {/* Specialty & Course */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="specialty" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Especialidad
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Ej. Programación & IA"
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="course_name" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Curso Principal
              </label>
              <input
                type="text"
                id="course_name"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                placeholder="Ej. Python para IA"
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Role & Academic Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="role_name" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Categoría Docente
              </label>
              <select
                id="role_name"
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 transition-colors"
              >
                <option value="Instructor Titular">Instructor Titular</option>
                <option value="Instructor Senior">Instructor Senior</option>
                <option value="Instructor Principal">Instructor Principal</option>
                <option value="Ayudante de Cátedra">Ayudante de Cátedra</option>
              </select>
            </div>

            <div>
              <label htmlFor="academic_level" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                Nivel Académico
              </label>
              <select
                id="academic_level"
                name="academic_level"
                value={formData.academic_level}
                onChange={handleChange}
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-white dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 transition-colors"
              >
                <option value="Secundario">Secundario</option>
                <option value="Terciario">Terciario</option>
                <option value="Universitario">Universitario</option>
                <option value="Posgrado">Posgrado / Maestría</option>
              </select>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1.5">
              Estado del Docente
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <label className={`flex items-center justify-center p-2.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                formData.status_id === 1 ? 'border-custom-celeste bg-custom-celeste/10 dark:bg-custom-celeste/20 text-custom-azul-oscuro dark:text-custom-celeste' : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-custom-gris-claro dark:text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="status_id"
                  value="1"
                  checked={formData.status_id === 1}
                  onChange={handleChange}
                  className="sr-only"
                />
                Activo
              </label>

              <label className={`flex items-center justify-center p-2.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                formData.status_id === 3 ? 'border-custom-amarillo bg-custom-amarillo/20 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400' : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-custom-gris-claro dark:text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="status_id"
                  value="3"
                  checked={formData.status_id === 3}
                  onChange={handleChange}
                  className="sr-only"
                />
                Licencia
              </label>

              <label className={`flex items-center justify-center p-2.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                formData.status_id === 2 ? 'border-custom-gris-claro bg-custom-gris-claro/10 dark:bg-slate-800 text-custom-gris-claro dark:text-slate-400' : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-custom-gris-claro dark:text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="status_id"
                  value="2"
                  checked={formData.status_id === 2}
                  onChange={handleChange}
                  className="sr-only"
                />
                Inactivo
              </label>
            </div>
          </div>
        </form>

        {/* Footer with Submit button */}
        <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-custom-gris-claro/30 dark:border-slate-700 text-custom-gris-oscuro dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            form="instructor-form"
            disabled={isReadOnly}
            className="flex items-center gap-1.5 px-4 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 text-custom-amarillo" />
            {instructor ? 'Guardar Cambios' : 'Registrar Instructor'}
          </button>
        </div>
      </section>
    </>
  )
}

export default InstructorFormDrawer
