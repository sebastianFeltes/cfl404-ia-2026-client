import React, { useState, useEffect } from 'react'
import { X, BookPlus, AlertCircle } from 'lucide-react'
import { courseSchema } from '../schemas/courseSchema'

const CATEGORIES = ['Oficios', 'Tecnología', 'Emprendimiento', 'Servicios', 'Administración']

export default function NuevoCursoModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Oficios',
    stageKey: 'segunda',
    stage: 'Segunda Etapa (Julio - Diciembre)',
    schedule: 'Lunes y Miércoles 18:00 - 21:00 hs',
    quota: 20,
    hour_quantity: 120,
    classes_quantity: 32,
    staff: 'Docente CFL 404',
    statusId: 1,
    description: ''
  })

  // State to hold field validation errors from Zod
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setErrors({})
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || '',
        category: initialData.category || 'Oficios',
        stageKey: initialData.stageKey || 'segunda',
        stage: initialData.stage || 'Segunda Etapa (Julio - Diciembre)',
        schedule: initialData.schedule || '',
        quota: initialData.detail?.quota || 20,
        hour_quantity: initialData.detail?.hour_quantity || 120,
        classes_quantity: initialData.detail?.classes_quantity || 32,
        staff: initialData.staff || 'Docente CFL 404',
        statusId: initialData.status?.id || 1,
        description: initialData.detail?.description || ''
      })
    } else {
      setFormData({
        name: '',
        category: 'Oficios',
        stageKey: 'segunda',
        stage: 'Segunda Etapa (Julio - Diciembre)',
        schedule: 'Lunes y Miércoles 18:00 - 21:00 hs',
        quota: 20,
        hour_quantity: 120,
        classes_quantity: 32,
        staff: 'Docente CFL 404',
        statusId: 1,
        description: ''
      })
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for edited field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmitForm = (e) => {
    e.preventDefault()

    // Validar con Zod
    const validationResult = courseSchema.safeParse(formData)

    if (!validationResult.success) {
      const formattedErrors = {}
      validationResult.error.errors.forEach(err => {
        const fieldName = err.path[0]
        formattedErrors[fieldName] = err.message
      })
      setErrors(formattedErrors)
      return
    }

    const validatedData = validationResult.data

    const statusMap = {
      1: { id: 1, label: 'Cupos disponibles', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400', badgeColor: 'bg-emerald-500' },
      2: { id: 2, label: 'Últimos cupos', color: 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400', badgeColor: 'bg-amber-500' },
      3: { id: 3, label: 'Cupo completo', color: 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-400', badgeColor: 'bg-rose-500' },
      4: { id: 4, label: 'Curso finalizado', color: 'bg-gray-500/10 text-gray-700 border-gray-300 dark:text-gray-400', badgeColor: 'bg-gray-500' }
    }

    const payload = {
      ...formData,
      ...validatedData,
      stage: validatedData.stageKey === 'segunda' ? 'Segunda Etapa (Julio - Diciembre)' : 'Primera Etapa (Marzo - Julio)',
      status: statusMap[validatedData.statusId] || statusMap[1],
      image: '/images/Herreria.webp',
      detail: {
        description: validatedData.description,
        quota: Number(validatedData.quota),
        total_quota: Number(validatedData.quota) + 5,
        hour_quantity: Number(validatedData.hour_quantity),
        classes_quantity: Number(validatedData.classes_quantity),
        title_required: 'Primario Completo',
        endorsement_by: 'CFP N°404 Berisso'
      }
    }

    setErrors({})
    onSubmit(payload)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-nunito">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#166193]/10 text-[#166193] dark:text-[#37A6DE]">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-roboto">
                {formData.id ? 'Editar Curso' : 'Registrar Nuevo Curso'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete la información con validación de esquema Zod.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitForm} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Nombre del Curso */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre del Curso *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Armador de Tableros Eléctricos"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#166193]'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoría / Rubro
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#166193] cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Etapa Cursada */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Etapa Lectiva
              </label>
              <select
                name="stageKey"
                value={formData.stageKey}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#166193] cursor-pointer"
              >
                <option value="segunda">Segunda Etapa (Julio - Diciembre)</option>
                <option value="primera">Primera Etapa (Marzo - Julio)</option>
              </select>
            </div>

            {/* Horario y Días */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Horario / Días *
              </label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="Ej. Martes y Jueves 18:00 - 21:00 hs"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none ${
                  errors.schedule ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#166193]'
                }`}
              />
              {errors.schedule && (
                <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.schedule}
                </p>
              )}
            </div>

            {/* Cupos / Vacantes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cupo de Vacantes *
              </label>
              <input
                type="number"
                name="quota"
                value={formData.quota}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none ${
                  errors.quota ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#166193]'
                }`}
              />
              {errors.quota && (
                <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.quota}
                </p>
              )}
            </div>

            {/* Horas Cátedra */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Horas Cátedra *
              </label>
              <input
                type="number"
                name="hour_quantity"
                value={formData.hour_quantity}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none ${
                  errors.hour_quantity ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#166193]'
                }`}
              />
              {errors.hour_quantity && (
                <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.hour_quantity}
                </p>
              )}
            </div>

            {/* Estado del Curso */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Estado de Inscripción
              </label>
              <select
                name="statusId"
                value={formData.statusId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#166193] cursor-pointer"
              >
                <option value={1}>Cupos disponibles</option>
                <option value={2}>Últimos cupos</option>
                <option value={3}>Cupo completo</option>
                <option value={4}>Curso finalizado</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Descripción Detallada *
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Resumen del programa de estudio, contenidos y perfil profesional de egreso..."
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none ${
                  errors.description ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#166193]'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#166193] hover:bg-[#166193]/90 rounded-lg shadow-md transition-all cursor-pointer"
            >
              {formData.id ? 'Guardar Cambios' : 'Crear Curso'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
