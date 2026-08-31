import React, { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { 
  X, 
  Save, 
  UserPlus, 
  Pencil, 
  Award, 
  BookOpen, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Image as ImageIcon, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Check, 
  Plus, 
  Lock, 
  ChevronDown, 
  Search, 
  CheckSquare, 
  Square, 
  Trash2 
} from 'lucide-react'
import Tooltip from '../Tooltip'
import BadgeStatus from '../BadgeStatus'
import { canCrud } from '../../utils/roles'

const INITIAL_FORM_STATE = {
  first_name: '',
  last_name: '',
  email: '',
  dni: '',
  status_id: 1, // Default Activo
  role_id: 7,   // Default INSTRUCTOR (ID 7)
  phone: '',
  address: '',
  profile_photo_url: '',
  assigned_course_ids: [],
}

function InstructorFormDrawer({ instructor, isOpen, onClose, onSubmit, userRole, hasCrud = false, courses = [], isSubmitting = false }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [imgError, setImgError] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [courseSearch, setCourseSearch] = useState('')
  const dropdownRef = useRef(null)

  // Lock body scroll when drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Solo los roles con CRUD completo pueden modificar datos generales
  const isReadOnly = !hasCrud

  // Solo los roles 1 (GOD), 2 (ADMIN), 3 (DIRECTOR), 4 (REGENTE) pueden modificar cursos a cargo
  const canEditCourses = useMemo(() => {
    return canCrud(userRole) || [1, 2, 3, 4, '1', '2', '3', '4', 'GOD', 'ADMIN', 'DIRECTOR', 'REGENTE'].includes(userRole)
  }, [userRole])

  // Cerrar desplegable si se hace clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Update form data when instructor prop changes (Edit vs Add)
  useEffect(() => {
    if (instructor) {
      // Obtener los IDs de cursos asignados iniciales
      let initialCourseIds = instructor.assigned_course_ids || []
      if ((!initialCourseIds || initialCourseIds.length === 0) && courses?.length > 0) {
        const names = instructor.assigned_courses || (instructor.course_name ? [instructor.course_name] : [])
        initialCourseIds = courses
          .filter(c => names.includes(c.name))
          .map(c => c.id)
      }

      setFormData({
        id: instructor.id,
        first_name: instructor.first_name || '',
        last_name: instructor.last_name || '',
        email: instructor.email || '',
        dni: instructor.dni || '',
        status_id: Number(instructor.status_id) || 1,
        role_id: Number(instructor.role_id) || 7,
        phone: instructor.phone || '',
        address: instructor.address || '',
        profile_photo_url: instructor.profile_photo_url || '',
        assigned_course_ids: initialCourseIds,
      })
    } else {
      setFormData({ ...INITIAL_FORM_STATE })
    }
    setImgError(false)
    setIsDropdownOpen(false)
    setCourseSearch('')
  }, [instructor, isOpen, courses])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'profile_photo_url') {
      setImgError(false)
    }
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status_id' ? Number(value) : value
    }))
  }

  // Alternar selección de un curso en el desplegable
  const toggleCourse = (courseId) => {
    if (!canEditCourses || isReadOnly) return
    setFormData((prev) => {
      const currentIds = prev.assigned_course_ids || []
      const exists = currentIds.some(id => String(id) === String(courseId))
      return {
        ...prev,
        assigned_course_ids: exists
          ? currentIds.filter(id => String(id) !== String(courseId))
          : [...currentIds, courseId]
      }
    })
  }

  // Quitar un curso individualmente desde las etiquetas de selección activa
  const removeCourse = (courseId, e) => {
    e?.stopPropagation()
    if (!canEditCourses || isReadOnly) return
    setFormData((prev) => ({
      ...prev,
      assigned_course_ids: prev.assigned_course_ids.filter(id => String(id) !== String(courseId))
    }))
  }

  // Deseleccionar todos los cursos
  const handleClearAllAssigned = () => {
    if (!canEditCourses || isReadOnly) return
    setFormData((prev) => ({
      ...prev,
      assigned_course_ids: []
    }))
  }

  // Seleccionar todos los cursos visibles en el filtro de búsqueda
  const handleSelectAllFiltered = () => {
    if (!canEditCourses || isReadOnly) return
    const visibleIds = filteredCourses.map(c => c.id)
    setFormData((prev) => ({
      ...prev,
      assigned_course_ids: Array.from(new Set([...prev.assigned_course_ids, ...visibleIds]))
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isReadOnly) return

    // Sanitizar payload
    const payload = {
      ...formData,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      dni: formData.dni.trim(),
      phone: formData.phone?.trim() || null,
      address: formData.address?.trim() || null,
      profile_photo_url: formData.profile_photo_url?.trim() || null,
      role_id: Number(formData.role_id) || 7, // Siempre INSTRUCTOR
      assigned_course_ids: formData.assigned_course_ids || [],
    }

    onSubmit(payload)
  }

  const initials = useMemo(() => {
    const f = formData.first_name ? formData.first_name[0] : (instructor?.first_name?.[0] || 'D')
    const l = formData.last_name ? formData.last_name[0] : (instructor?.last_name?.[0] || '')
    return `${f}${l}`.toUpperCase()
  }, [formData.first_name, formData.last_name, instructor])

  // Cursos actualmente asignados resueltos con nombre y metadata
  const assignedCoursesList = useMemo(() => {
    const ids = formData.assigned_course_ids || []
    return ids.map(id => {
      const found = courses.find(c => String(c.id) === String(id))
      return {
        id,
        name: found?.name || `Curso ID: ${id}`,
        category: found?.category || null,
        stage: found?.stage || null,
      }
    })
  }, [formData.assigned_course_ids, courses])

  // Filtrar cursos disponibles en el buscador del desplegable
  const filteredCourses = useMemo(() => {
    if (!courses || courses.length === 0) return []
    if (!courseSearch.trim()) return courses
    const term = courseSearch.toLowerCase()
    return courses.filter(c => 
      (c.name || '').toLowerCase().includes(term) ||
      (c.category || '').toLowerCase().includes(term) ||
      (c.stage || '').toLowerCase().includes(term)
    )
  }, [courses, courseSearch])

  if (!isOpen && !instructor) return null

  return createPortal(
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-custom-gris-oscuro/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer slide-over container */}
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-custom-gris-claro/10 dark:border-slate-800 flex flex-col h-screen h-[100dvh] transition-transform duration-300 ease-in-out transform font-roboto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-drawer-title"
        aria-hidden={!isOpen}
      >
        {/* Header section with rich visual parity with View Drawer */}
        <div className="p-6 bg-custom-azul-oscuro text-white relative shrink-0">
          <div className="absolute top-4 right-4">
            <Tooltip text="Cerrar formulario" position="left">
              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar formulario"
              >
                <X className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            {/* Live Avatar Preview */}
            <Tooltip text={formData.profile_photo_url ? "Vista previa de la foto de perfil" : "Avatar con iniciales"} position="bottom">
              {formData.profile_photo_url && !imgError ? (
                <img 
                  src={formData.profile_photo_url} 
                  alt={formData.first_name || 'Docente'}
                  onError={() => setImgError(true)}
                  className={`h-16 w-16 rounded-full object-cover shadow-md shrink-0 transition-all ${
                    formData.status_id === 1 ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/30' :
                    formData.status_id === 3 ? 'border-2 border-amber-500 ring-2 ring-amber-500/30' :
                    'border-2 border-red-500 ring-2 ring-red-500/30'
                  }`}
                />
              ) : (
                <div className={`h-16 w-16 rounded-full bg-white text-custom-azul-oscuro flex items-center justify-center text-2xl font-extrabold font-nunito shadow-md shrink-0 transition-all ${
                  formData.status_id === 1 ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/30' :
                  formData.status_id === 3 ? 'border-2 border-amber-500 ring-2 ring-amber-500/30' :
                  'border-2 border-red-500 ring-2 ring-red-500/30'
                }`}>
                  {initials}
                </div>
              )}
            </Tooltip>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {instructor ? (
                  <Pencil className="h-4 w-4 text-custom-amarillo shrink-0" />
                ) : (
                  <UserPlus className="h-4 w-4 text-custom-amarillo shrink-0" />
                )}
                <h2 id="form-drawer-title" className="font-nunito font-extrabold text-xl leading-tight text-white truncate">
                  {instructor ? `${formData.first_name || instructor.first_name} ${formData.last_name || instructor.last_name}` : 'Registrar Nuevo Instructor'}
                </h2>
              </div>

              <p className="text-xs text-custom-celeste font-semibold mt-0.5">
                {instructor ? `ID Docente: #${instructor.id}` : 'Alta institucional en cuerpo docente'}
              </p>

              {/* Status badge preview */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Tooltip text={`Estado seleccionado: ${formData.status_id === 1 ? 'Activo' : formData.status_id === 3 ? 'En Licencia' : 'Inactivo'}`} position="bottom">
                  <BadgeStatus status={formData.status_id === 3 ? 'licencia' : formData.status_id} />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form 
          id={`instructor-form-${instructor ? 'edit' : 'add'}`} 
          onSubmit={handleSubmit} 
          className="flex-1 overflow-y-auto p-6 space-y-6 text-xs"
        >
          {/* Read-Only Notice if user lacks CRUD */}
          {isReadOnly && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
              <Info className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Tu rol actual tiene permisos de solo lectura. No puedes modificar este registro.</span>
            </div>
          )}

          {/* ── SECCIÓN 1: Identificación y Datos Personales ──────────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-custom-celeste" />
              Identificación y Datos Personales
            </h3>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  disabled={isReadOnly}
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Ej. Martín"
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isReadOnly}
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Ej. Echevarría"
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* DNI & Legajo Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="dni" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Documento Nacional de Identidad (DNI) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  required
                  disabled={isReadOnly}
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="Ej. 31098441"
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-custom-gris-claro dark:text-slate-400 mb-1">
                  Estado de Legajo
                </label>
                <div className="p-2.5 bg-gray-50 dark:bg-slate-950 border border-custom-gris-claro/20 dark:border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Completo / Vigente
                  </span>
                  <span className="text-[10px] text-custom-gris-claro dark:text-slate-500 uppercase font-bold">
                    Verificado
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Photo URL */}
            <div>
              <label htmlFor="profile_photo_url" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1 flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-custom-celeste" />
                URL Foto de Perfil (Opcional)
              </label>
              <input
                type="url"
                id="profile_photo_url"
                name="profile_photo_url"
                disabled={isReadOnly}
                value={formData.profile_photo_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/foto-docente.jpg"
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors font-mono text-[11px] disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <p className="text-[10px] text-custom-gris-claro dark:text-slate-500 mt-1">
                Ingresá un enlace directo a la fotografía institucional para actualizar el carnet y avatar del docente.
              </p>
            </div>
          </div>

          {/* ── SECCIÓN 2: Especialidad y Cursos Asignados ────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-1">
              <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="h-4 w-4 text-custom-celeste" />
                Cursos Asignados y Oferta Formativa
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-custom-azul-oscuro/10 dark:bg-custom-celeste/20 text-custom-azul-oscuro dark:text-custom-celeste">
                {assignedCoursesList.length} asignado(s)
              </span>
            </div>

            {/* Cursos Asignados Actualmente (Chips interactivos con botón 'x' para remover rápido) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-custom-gris-oscuro dark:text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-custom-celeste" />
                  Cursos a cargo del docente ({assignedCoursesList.length})
                </p>
                {canEditCourses && !isReadOnly && assignedCoursesList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllAssigned}
                    className="text-[10px] text-red-500 hover:text-red-700 dark:text-red-400 font-bold hover:underline cursor-pointer transition-colors"
                  >
                    Deseleccionar todos
                  </button>
                )}
              </div>

              {assignedCoursesList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-gray-50 dark:bg-slate-950 rounded-lg border border-custom-gris-claro/20 dark:border-slate-800">
                  {assignedCoursesList.map((curso) => (
                    <div 
                      key={curso.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-custom-celeste/15 dark:bg-custom-celeste/25 text-custom-azul-oscuro dark:text-custom-celeste border border-custom-celeste/30 shadow-2xs group transition-all"
                    >
                      <BookOpen className="h-3 w-3 text-custom-celeste shrink-0" />
                      <span className="truncate max-w-[200px]" title={curso.name}>{curso.name}</span>
                      {canEditCourses && !isReadOnly && (
                        <button
                          type="button"
                          onClick={(e) => removeCourse(curso.id, e)}
                          title={`Quitar ${curso.name}`}
                          className="text-custom-azul-oscuro/60 dark:text-custom-celeste/60 hover:text-red-500 dark:hover:text-red-400 p-0.5 rounded-full hover:bg-white/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-gray-50/60 dark:bg-slate-950/60 rounded-lg border border-dashed border-gray-200 dark:border-slate-800 text-center">
                  <p className="text-xs text-custom-gris-claro dark:text-slate-500 italic">
                    Sin cursos asignados actualmente.
                  </p>
                </div>
              )}
            </div>

            {/* Selector Desplegable de Cursos (Solo roles 1, 2, 3 y 4) */}
            {canEditCourses && !isReadOnly ? (
              <div className="relative" ref={dropdownRef}>
                <label className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1">
                  Asignar Cursos (Desplegable)
                </label>

                {/* Botón disparador del desplegable */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer bg-white dark:bg-slate-950 ${
                    isDropdownOpen 
                      ? 'border-custom-azul-oscuro dark:border-custom-celeste ring-2 ring-custom-celeste/20' 
                      : 'border-custom-gris-claro/30 dark:border-slate-700 hover:border-custom-celeste/60'
                  }`}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <Search className="h-4 w-4 text-custom-celeste shrink-0" />
                    <span className="text-xs font-semibold text-custom-gris-oscuro dark:text-slate-200 truncate">
                      {isDropdownOpen 
                        ? 'Buscando y seleccionando cursos...' 
                        : (assignedCoursesList.length > 0 
                            ? `Modificar asignación (${assignedCoursesList.length} asignados)` 
                            : 'Hacé clic para buscar y seleccionar cursos...')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {courses.length} disponibles
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-custom-azul-oscuro dark:text-custom-celeste' : ''}`} />
                  </div>
                </button>

                {/* Menú Desplegable con buscador integrado */}
                {isDropdownOpen && (
                  <div className="mt-1 w-full bg-white dark:bg-slate-900 border border-custom-gris-claro/30 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
                    
                    {/* Header del desplegable con buscador */}
                    <div className="p-2.5 bg-gray-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 space-y-2">
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          autoFocus
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          placeholder="Buscar curso por nombre o especialidad..."
                          className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste"
                        />
                        {courseSearch && (
                          <button
                            type="button"
                            onClick={() => setCourseSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {/* Barra de herramientas rápida */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-0.5">
                        <span>Mostrando {filteredCourses.length} de {courses.length} cursos</span>
                        {filteredCourses.length > 0 && (
                          <button
                            type="button"
                            onClick={handleSelectAllFiltered}
                            className="font-bold text-custom-azul-oscuro dark:text-custom-celeste hover:underline cursor-pointer"
                          >
                            + Seleccionar visibles
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Lista scrollable de cursos */}
                    <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800/60 p-1">
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((curso) => {
                          const isSelected = formData.assigned_course_ids?.some(id => String(id) === String(curso.id))
                          return (
                            <button
                              key={curso.id}
                              type="button"
                              onClick={() => toggleCourse(curso.id)}
                              className={`w-full p-2 rounded-lg text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-custom-celeste/10 dark:bg-custom-celeste/20 text-custom-azul-oscuro dark:text-custom-celeste font-bold'
                                  : 'hover:bg-gray-100/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {isSelected ? (
                                  <CheckSquare className="h-4 w-4 text-custom-azul-oscuro dark:text-custom-celeste shrink-0" />
                                ) : (
                                  <Square className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs truncate">{curso.name}</p>
                                  {curso.category && (
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate">
                                      Área: {curso.category} {curso.stage ? `• ${curso.stage}` : ''}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {isSelected && (
                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-custom-azul-oscuro/15 dark:bg-custom-celeste/30 text-custom-azul-oscuro dark:text-custom-celeste shrink-0">
                                  Asignado
                                </span>
                              )}
                            </button>
                          )
                        })
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400 italic">
                          No se encontraron cursos que coincidan con &quot;{courseSearch}&quot;.
                        </div>
                      )}
                    </div>

                    {/* Footer del desplegable */}
                    <div className="p-2 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {assignedCoursesList.length} seleccionados
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3 py-1 bg-custom-azul-oscuro text-white dark:bg-custom-celeste dark:text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs hover:opacity-95 cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Listo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Bloque de solo lectura con alerta de permisos */
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span>La modificación y asignación de cursos está restringida a los roles 1, 2, 3 y 4 (Dios, Administrador, Director y Regente).</span>
              </div>
            )}

            {/* Fecha de Registro */}
            <div className="p-3 bg-gray-50/70 dark:bg-slate-950/70 rounded-lg flex items-center justify-between border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                <Calendar className="h-3.5 w-3.5 text-custom-celeste" />
                <span>Fecha de Registro Institucional:</span>
              </div>
              <span className="font-bold text-custom-gris-oscuro dark:text-slate-200 text-xs font-mono">
                {instructor?.created_at ? new Date(instructor.created_at).toLocaleDateString('es-AR') : 'Registro actual'}
              </span>
            </div>
          </div>

          {/* ── SECCIÓN 3: Datos de Contacto ────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-custom-celeste" />
              Datos de Contacto
            </h3>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-custom-celeste" />
                Email Institucional <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isReadOnly}
                value={formData.email}
                onChange={handleChange}
                placeholder="m.echevarria@cfl404.edu.ar"
                className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-medium"
              />
            </div>

            {/* Phone & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-custom-celeste" />
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  disabled={isReadOnly}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej. 11-3318-5590"
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="address" className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-custom-celeste" />
                  Dirección de Residencia
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  disabled={isReadOnly}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ej. Av. Montevideo 1240, Berisso"
                  className="w-full p-2.5 border border-custom-gris-claro/30 dark:border-slate-700 rounded-lg focus:outline-none focus:border-custom-azul-oscuro dark:focus:border-custom-celeste bg-gray-50/50 dark:bg-slate-950 text-custom-gris-oscuro dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* ── SECCIÓN 4: Condición Institucional / Estado Laboral ─────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-custom-celeste" />
              Condición Institucional / Estado Laboral
            </h3>

            {/* Status Selection (Activo, Licencia, Inactivo) */}
            <div>
              <label className="block font-bold text-custom-gris-oscuro dark:text-slate-200 mb-1.5">
                Estado del Docente
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <Tooltip text="Docente activo en funciones académicas" position="top">
                  <label className={`flex items-center justify-center p-2.5 rounded-lg border text-center font-bold cursor-pointer transition-all w-full ${
                    formData.status_id === 1 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20' 
                      : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-custom-gris-claro dark:text-slate-400 hover:border-gray-300'
                  } ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <input
                      type="radio"
                      name="status_id"
                      value="1"
                      disabled={isReadOnly}
                      checked={formData.status_id === 1}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    Activo
                  </label>
                </Tooltip>

                <Tooltip text="Docente con licencia justificada o médica" position="top">
                  <label className={`flex items-center justify-center p-2.5 rounded-lg border text-center font-bold cursor-pointer transition-all w-full ${
                    formData.status_id === 3 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/20' 
                      : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-custom-gris-claro dark:text-slate-400 hover:border-gray-300'
                  } ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <input
                      type="radio"
                      name="status_id"
                      value="3"
                      disabled={isReadOnly}
                      checked={formData.status_id === 3}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    En Licencia
                  </label>
                </Tooltip>

                <Tooltip text="Docente inactivo o dado de baja" position="top">
                  <label className={`flex items-center justify-center p-2.5 rounded-lg border text-center font-bold cursor-pointer transition-all w-full ${
                    formData.status_id === 2 
                      ? 'border-slate-400 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 ring-2 ring-slate-400/20' 
                      : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-custom-gris-claro dark:text-slate-400 hover:border-gray-300'
                  } ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <input
                      type="radio"
                      name="status_id"
                      value="2"
                      disabled={isReadOnly}
                      checked={formData.status_id === 2}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    Inactivo
                  </label>
                </Tooltip>
              </div>
            </div>
          </div>
        </form>

        {/* Footer with Submit button */}
        <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <Tooltip text="Cancelar y descartar cambios" position="top">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-custom-gris-claro/30 dark:border-slate-700 text-custom-gris-oscuro dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </Tooltip>
          
          <Tooltip text={isSubmitting ? 'Guardando...' : instructor ? 'Guardar cambios en el legajo del docente' : 'Dar de alta al nuevo instructor'} position="top">
            <button
              type="submit"
              form={`instructor-form-${instructor ? 'edit' : 'add'}`}
              disabled={isReadOnly || isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-custom-amarillo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-custom-amarillo" />
                  {instructor ? 'Guardar Cambios' : 'Registrar Instructor'}
                </>
              )}
            </button>
          </Tooltip>
        </div>
      </aside>
    </>,
    document.body
  )
}

export default InstructorFormDrawer
