// Archivo: src/components/StudentDetailDrawer.jsx
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  User as UserIcon, 
  Globe, 
  Clock, 
  BookOpen, 
  Award, 
  CheckSquare, 
  Square, 
  Pencil, 
  Trash2,
  UserCheck
} from 'lucide-react'
import StudentAvatar from './StudentAvatar'
import BadgeStatus from './BadgeStatus'

export default function StudentDetailDrawer({ 
  student, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onPromote,
  userRole = 'director'
}) {
  const isPostulante = Boolean(student?.is_aspirante) || 
    String(student?.role_name || '').toUpperCase() === 'POSTULANTE' || 
    String(student?.role_name || '').toUpperCase() === 'ASPIRANTE' || 
    student?.status_id === 3 || 
    String(student?.status || '').toUpperCase() === 'PENDIENTE'

  const canEdit = userRole === 'director' || userRole === 'secretaria'
  const canDelete = userRole === 'director'

  const details = student ? {
    address: student.address || student.studentDetail?.address || '—',
    phone: student.phone || student.studentDetail?.phone || '—',
    extra_phone: student.extra_phone || student.studentDetail?.extraPhone || student.extraPhone || '—',
    email: student.email || '—',
    extra_email: student.extra_email || student.studentDetail?.extraEmail || student.extraEmail || '—',
    dob: student.dob || student.studentDetail?.dob || '—',
    gender: student.gender || student.studentDetail?.gender || 'No especificado',
    nacionality: student.nacionality || student.studentDetail?.nacionality || 'Argentina',
    academic_level: student.academic_level || student.studentDetail?.academicLevel || '—',
    enrollment_date: student.enrollment_date || student.createdAt || '—',
    course_name: student.course_name || 'Sin curso asignado',
    has_dni_copy: student.dni_copy ?? true,
    has_form_copy: student.form_copy ?? true,
    has_title_copy: student.title_copy ?? (student.status_id !== 3),
  } : {}

  const estadoTextos = {
    1: 'Estado: Alumno Activo',
    activo: 'Estado: Alumno Activo',
    2: 'Estado: Alumno Inactivo / Egresado',
    inactivo: 'Estado: Alumno Inactivo / Egresado',
    3: 'Estado: Postulante / Documentación pendiente',
    postulante: 'Estado: Postulante (En proceso de admisión)',
    aspirante: 'Estado: Postulante / Aspirante (En proceso)',
  }

  return (
    <AnimatePresence>
      {isOpen && student && (
        <>
          <motion.div
            key="student-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm"
          />

          <motion.aside
            key="student-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[450px] z-50 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200"
            aria-labelledby="student-drawer-title"
          >
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
                <div title={estadoTextos[isPostulante ? 'postulante' : student.status_id] || 'Estado'}>
                  <StudentAvatar 
                    src={student.profile_photo_url} 
                    nombre={student.first_name} 
                    apellido={student.last_name} 
                    estado={isPostulante ? 'postulante' : student.status_id} 
                    size="xl" 
                  />
                </div>
                <div>
                  <h2 id="student-drawer-title" className="text-xl font-semibold text-slate-900 dark:text-slate-100 font-roboto leading-tight">
                    {student.first_name} {student.last_name}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-nunito mt-1 mb-3">
                    {isPostulante ? 'Postulante' : 'Alumno'}
                  </p>
                  <div title={estadoTextos[isPostulante ? 'postulante' : student.status_id] || 'Estado'}>
                    <BadgeStatus status={isPostulante ? 'postulante' : student.status_id} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 font-nunito">
              <dl>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-6 mb-3">
                  Contacto
                </dt>
                <div className="space-y-4">
                  <DataRow icon={MapPin} label="Dirección" value={details.address} title="Dirección de residencia declarada" />
                  <DataRow icon={Phone} label="Teléfono" value={details.phone} title="Número principal de contacto" />
                  <DataRow icon={Phone} label="Teléfono Secundario" value={details.extra_phone} title="Teléfono secundario / alternativo" />
                  <DataRow icon={Mail} label="Email" value={details.email} title="Correo electrónico" />
                  {details.extra_email !== '—' && (
                    <DataRow icon={Mail} label="Email Alternativo" value={details.extra_email} title="Correo electrónico personal" />
                  )}
                </div>

                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-8 mb-3">
                  Personal
                </dt>
                <div className="space-y-4">
                  <DataRow icon={UserIcon} label="DNI" value={student.dni || '—'} title="Documento Nacional de Identidad" />
                  <DataRow icon={Calendar} label="Fecha de Nac." value={details.dob} title="Fecha de nacimiento" />
                  <DataRow icon={UserIcon} label="Género" value={details.gender} title="Género registrado" />
                  <DataRow icon={Globe} label="Nacionalidad" value={details.nacionality} title="País de origen" />
                  <DataRow icon={Clock} label={isPostulante ? 'Fecha de Postulación' : 'Fecha de Inscripción'} value={details.enrollment_date} title="Fecha de alta en el centro" />
                  <DataRow icon={Award} label="Nivel Educativo" value={details.academic_level} title="Nivel de formación alcanzado" />
                </div>
              </dl>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                  <BookOpen size={14} className="text-slate-400 dark:text-slate-500" />
                  {isPostulante ? 'Curso solicitado' : 'Cursos asignados'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span
                    title={isPostulante ? 'Curso solicitado en la preinscripción' : `Curso a cargo de ${student.first_name}`}
                    className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-default"
                  >
                    {details.course_name}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                  <CheckSquare size={14} className="text-slate-400 dark:text-slate-500" />
                  Documentación entregada
                </h3>
                <div className="space-y-3">
                  <DocItem label="Copia DNI (Frente y Dorso)" checked={details.has_dni_copy} />
                  <DocItem label="Ficha de Inscripción Firmada" checked={details.has_form_copy} />
                  <DocItem label="Copia Certificado / Título Secundario" checked={details.has_title_copy} />
                </div>
              </div>

              {canEdit && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  {isPostulante && onPromote && (
                    <button
                      onClick={() => onPromote(student.id)}
                      title="Aprobar documentación y matricular como Alumno regular"
                      className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-medium font-nunito transition-colors cursor-pointer shadow-sm"
                    >
                      <UserCheck size={15} strokeWidth={2} />
                      Matricular como Alumno
                    </button>
                  )}
                  <button
                    onClick={() => { onEdit?.(student.id) }}
                    title="Editar la información de este registro"
                    className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white text-sm font-medium font-nunito transition-colors cursor-pointer shadow-sm"
                  >
                    <Pencil size={15} strokeWidth={2} />
                    {isPostulante ? 'Editar Postulante' : 'Editar Alumno'}
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => { onDelete?.(student.id) }}
                      title="Dar de baja o eliminar este registro"
                      className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium font-nunito transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} strokeWidth={2} />
                      {isPostulante ? 'Eliminar Postulante' : 'Eliminar Alumno'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function DataRow({ icon: Icon, label, value, title }) {
  return (
    <dd title={title} className="flex items-start gap-3 w-full cursor-default">
      <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" strokeWidth={2} />
      <div className="flex-1">
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-200 mt-0.5 leading-tight">{value || '—'}</p>
      </div>
    </dd>
  )
}

function DocItem({ label, checked }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {checked ? (
        <>
          <CheckSquare className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="font-medium text-slate-900 dark:text-slate-200">{label}</span>
        </>
      ) : (
        <>
          <Square className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
          <span className="text-red-600 dark:text-red-400 font-medium">{label} (Pendiente)</span>
        </>
      )}
    </div>
  )
}
