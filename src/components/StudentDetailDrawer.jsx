// Archivo: src/components/StudentDetailDrawer.jsx
import React, { useState } from 'react'
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
  Printer, 
  UserCheck,
  QrCode,
  ShieldAlert,
  Copy,
  Check,
  GraduationCap,
  DoorOpen,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { Link } from 'react-router'
import StudentAvatar from './StudentAvatar'
import BadgeStatus from './BadgeStatus'

export default function StudentDetailDrawer({ 
  student, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onPromote,
  onExport,
  userRole = 'director'
}) {
  const isPostulante = Boolean(student?.is_aspirante) || 
    String(student?.role_name || '').toUpperCase() === 'POSTULANTE' || 
    String(student?.role_name || '').toUpperCase() === 'ASPIRANTE' || 
    student?.status_id === 3 || 
    String(student?.status || '').toUpperCase() === 'PENDIENTE'

  const canEdit = userRole === 'director' || userRole === 'secretaria'
  const canDelete = userRole === 'director'

  const [showQrModal, setShowQrModal] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)

  // Token de asistencia generado a partir del ID del alumno
  const attendanceToken = student 
    ? (student.attendance_token || `CFL404-ATT-${student.id}`) 
    : ''
  const qrUrl = student 
    ? `http://localhost:5173/admin/asistencia/scan?token=${encodeURIComponent(attendanceToken)}&id=${student.id}` 
    : ''
  const qrImgSrc = student 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrUrl)}&margin=8` 
    : ''

  const handleCopyToken = () => {
    if (!attendanceToken) return
    navigator.clipboard?.writeText(attendanceToken)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  const details = student ? {
    address: student.address || student.studentDetail?.address || 'Calle 122 y 60, Berisso',
    phone: student.phone || student.studentDetail?.phone || '—',
    extra_phone: student.extra_phone || student.studentDetail?.extraPhone || student.extraPhone || '—',
    email: student.email || '—',
    extra_email: student.extra_email || student.studentDetail?.extraEmail || student.extraEmail || '—',
    dob: student.dob || student.studentDetail?.dob || '14/05/2002',
    gender: student.gender || student.studentDetail?.gender || 'No especificado',
    nacionality: student.nacionality || student.studentDetail?.nacionality || 'Argentina',
    academic_level: student.academic_level || student.studentDetail?.academicLevel || 'Secundario Completo',
    enrollment_date: student.enrollment_date || student.createdAt || '10/03/2026',
    course_name: student.course_name || student.course || 'Sin curso asignado',
    instructor_name: student.instructor_name || (student.course_name && student.course_name !== 'Sin curso asignado' ? 'Prof. Carlos Benítez' : 'A designar'),
    course_schedule: student.course_schedule || (student.course_name && student.course_name !== 'Sin curso asignado' ? '17:30 a 20:45 hs' : 'A confirmar'),
    classroom_name: student.classroom_name || (student.course_name && student.course_name !== 'Sin curso asignado' ? 'Aula 1 (Planta Baja)' : 'Sin aula asignada'),
    course_days: student.course_days || (student.course_name && student.course_name !== 'Sin curso asignado' ? 'Lunes, Miércoles y Viernes' : 'A coordinar'),
    max_absences: student.max_absences ?? 5,
    attendance_status: student.is_present ? 'Presente en aula' : (student.asistencia || 'Regular'),
    has_dni_copy: student.dni_copy ?? true,
    has_form_copy: student.form_copy ?? true,
    has_title_copy: student.title_copy ?? (student.status_id !== 3),
  } : {}

  const estadoTextos = {
    1: 'Estado: Alumno Activo',
    activo: 'Estado: Alumno Activo',
    presente: 'Estado: Alumno Presente hoy',
    aspirante: 'Estado: Postulante / Aspirante (En proceso)',
    postulante: 'Estado: Postulante (En proceso de admisión)',
    2: 'Estado: Alumno Inactivo / Egresado',
    inactivo: 'Estado: Alumno Inactivo / Egresado',
    3: 'Estado: Postulante / Documentación pendiente',
    suspendido: 'Estado: Suspendido / Documentación pendiente',
  }

  return (
    <AnimatePresence>
      {isOpen && student && (
        <>
          {/* Backdrop */}
          <motion.div
            key="student-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.aside
            key="student-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[460px] z-50 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200"
            aria-labelledby="student-drawer-title"
          >
        {/* Header con estilo Cooperadora */}
        <div className="p-6 bg-custom-azul-oscuro text-white relative shrink-0">
          <button
            onClick={onClose}
            title="Cerrar panel de detalles"
            aria-label="Cerrar"
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-4 mt-1">
            <div title={estadoTextos[student.status_id] || 'Estado'}>
              <StudentAvatar 
                src={student.profile_photo_url} 
                nombre={student.first_name} 
                apellido={student.last_name} 
                estado={isPostulante ? 'postulante' : student.status_id} 
                size="xl" 
              />
            </div>
            <div className="min-w-0 flex-1 pr-6">
              <h2 id="student-drawer-title" className="font-nunito font-extrabold text-xl leading-tight text-white truncate">
                {student.first_name} {student.last_name}
              </h2>
              <p className="text-xs text-custom-celeste font-nunito mt-1 mb-2">
                {isPostulante ? 'ID Postulante: ' : 'ID Alumno: '}
                <span className="font-mono font-bold text-white">#{student.id}</span>
              </p>
              <div className="flex items-center gap-2">
                <BadgeStatus status={isPostulante ? 'postulante' : student.status_id} />
                {student.is_present && !isPostulante && (
                  <span className="text-[10px] bg-custom-amarillo text-custom-gris-oscuro px-2 py-0.5 rounded-full font-nunito font-bold uppercase tracking-wide">
                    Presente Hoy
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable details content */}
        <div className="flex-1 overflow-y-auto px-7 py-6 font-roboto space-y-6">
          <dl className="space-y-6">
            
            {/* Sección: Personal (Bloque Superior) */}
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-custom-gris-claro dark:text-slate-400 font-nunito mb-3 flex items-center gap-1.5">
                <UserIcon size={14} className="text-custom-azul-oscuro dark:text-custom-celeste" /> 
                Datos Personales
              </dt>
              <div className="grid grid-cols-2 gap-3">
                <DataRow icon={UserIcon} label="DNI" value={student.dni} title="Documento Nacional de Identidad" />
                <DataRow icon={Calendar} label="Fecha de Nacimiento" value={details.dob} title="Fecha de nacimiento" />
                <DataRow icon={Globe} label="Nacionalidad" value={details.nacionality} title="País de nacionalidad" />
                <DataRow icon={UserIcon} label="Género" value={details.gender} title="Género declarado" />
              </div>
            </div>

            {/* Sección: Contacto */}
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-custom-gris-claro dark:text-slate-400 font-nunito mb-3 flex items-center gap-1.5">
                <Phone size={14} className="text-custom-azul-oscuro dark:text-custom-celeste" /> 
                Contacto y Ubicación
              </dt>
              <div className="space-y-3">
                <DataRow icon={MapPin} label="Dirección de Residencia" value={details.address} title="Domicilio del alumno" />
                <DataRow icon={Phone} label="Teléfono Principal" value={details.phone} title="Teléfono primario" />
                <DataRow icon={Phone} label="Teléfono de Emergencia / Alternativo" value={details.extra_phone} title="Contacto alternativo" />
                <DataRow icon={Mail} label="Correo Electrónico" value={details.email} title="Email del estudiante" />
                {details.extra_email !== '—' && (
                  <DataRow icon={Mail} label="Email Alternativo" value={details.extra_email} title="Email complementario" />
                )}
              </div>
            </div>

            {/* Sección: Cursada / Detalle Académico */}
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-custom-gris-claro dark:text-slate-400 font-nunito mb-3 flex items-center gap-1.5">
                <BookOpen size={14} className={isPostulante ? "text-amber-600 dark:text-amber-400" : "text-custom-azul-oscuro dark:text-custom-celeste"} /> 
                {isPostulante ? 'Curso Solicitado en Preinscripción' : 'Información de Cursada'}
              </dt>
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 space-y-3.5">
                <DataRow 
                  icon={BookOpen} 
                  label={isPostulante ? "Curso Elegido" : "Curso Asignado"} 
                  value={details.course_name} 
                  title="Ir al curso correspondiente" 
                  highlight
                  href={details.course_name && details.course_name !== 'Sin curso asignado' ? `/admin/cursos?search=${encodeURIComponent(details.course_name)}` : null}
                />

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <DataRow 
                    icon={GraduationCap} 
                    label="Docente a Cargo" 
                    value={details.instructor_name} 
                    title="Instructor responsable del curso" 
                  />
                  <DataRow 
                    icon={DoorOpen} 
                    label="Aula Asignada" 
                    value={details.classroom_name} 
                    title="Espacio físico asignado en sede" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <DataRow 
                    icon={Calendar} 
                    label="Días de Cursada" 
                    value={details.course_days} 
                    title="Días de clase presencial" 
                  />
                  <DataRow 
                    icon={Clock} 
                    label="Horario" 
                    value={details.course_schedule} 
                    title="Franja horaria del curso" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <DataRow 
                    icon={AlertCircle} 
                    label="Inasistencias Máx." 
                    value={details.max_absences ? `Hasta ${details.max_absences} faltas` : 'Régimen estándar'} 
                    title="Límite máximo de faltas permitidas" 
                  />
                  <DataRow 
                    icon={Clock} 
                    label={isPostulante ? "Fecha de Postulación" : "Fecha Inscripción"} 
                    value={details.enrollment_date} 
                    title="Fecha de registro inicial" 
                  />
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <DataRow 
                    icon={Award} 
                    label="Nivel Educativo Declarado" 
                    value={details.academic_level} 
                    title="Nivel de formación alcanzado" 
                  />
                </div>
              </div>
            </div>

            {/* Sección: Documentación Presentada */}
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-custom-gris-claro dark:text-slate-400 font-nunito mb-3 flex items-center gap-1.5">
                <CheckSquare size={14} className="text-custom-azul-oscuro dark:text-custom-celeste" /> 
                Documentación Entregada (Papeles Físicos)
              </dt>
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/80 space-y-2">
                <DocItem label="Copia DNI (Frente y Dorso)" checked={details.has_dni_copy} />
                <DocItem label="Ficha de Inscripción Firmada" checked={details.has_form_copy} />
                <DocItem label="Copia Certificado / Título Secundario" checked={details.has_title_copy} />
              </div>
              {isPostulante && (
                <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-2.5 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 leading-relaxed space-y-1 font-nunito">
                  <p className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                    Verificar que los datos sean Reales
                  </p>
                  <p>
                    Doble verificación (digital y física): corrobora que el postulante haya presentado físicamente la documentación requerida antes de matricularlo. Recién al confirmar su pase a alumno regular se generará su <strong>Token de Asistencia</strong> (ID del Alumno).
                  </p>
                </div>
              )}
            </div>

          </dl>
        </div>

        {/* Footer Actions — En la card de ver datos personales solo va el botón Imprimir QR */}
        <div className="p-5 border-t border-custom-gris-claro/10 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-col gap-2.5 shrink-0 no-print">
          
          {/* Botón Promover a Alumno para Postulantes */}
          {isPostulante && canEdit && onPromote && (
            <button
              onClick={() => onPromote(student.id)}
              title="Aprobar documentación y matricular como Alumno regular del centro"
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-nunito font-bold transition-all cursor-pointer shadow-xs"
            >
              <UserCheck size={16} />
              Aprobar y Matricular como Alumno
            </button>
          )}

          {/* Único botón en el legajo del alumno: Imprimir QR */}
          {!isPostulante && (
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              title="Generar e imprimir Código QR de Asistencia del Alumno"
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white text-xs font-nunito font-bold transition-all cursor-pointer shadow-xs"
            >
              <QrCode size={16} className="text-custom-amarillo" />
              Imprimir QR
            </button>
          )}
        </div>
      </motion.aside>

      {/* Modal: Credencial e Impresión de Código QR de Asistencia */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 font-nunito">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQrModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl z-10 text-center p-6 space-y-4"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="p-2 bg-custom-azul-oscuro/10 text-custom-azul-oscuro dark:text-custom-celeste rounded-lg">
                    <QrCode size={18} />
                  </div>
                  <div>
                    <h3 className="font-nunito font-extrabold text-sm text-custom-azul-oscuro dark:text-custom-celeste leading-tight">
                      Código QR de Asistencia
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-nunito">
                      CFL N° 404 • Berisso
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tarjeta de Alumno + QR */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-3">
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 font-roboto">
                    {student.first_name} {student.last_name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-nunito">
                    DNI: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{student.dni}</span> | {details.course_name}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner flex flex-col items-center justify-center">
                  <img
                    src={qrImgSrc}
                    alt={`Código QR Asistencia ${student.first_name} ${student.last_name}`}
                    className="w-44 h-44 rounded-lg object-contain"
                  />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">
                    ID #{student.id} • Scan de Asistencia
                  </span>
                </div>

                {/* Token Box */}
                <div className="text-left space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-nunito">
                    Token de Asistencia (ID del Alumno)
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono">
                    <span className="truncate text-slate-600 dark:text-slate-300">{attendanceToken}</span>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="text-slate-400 hover:text-custom-azul-oscuro dark:hover:text-custom-celeste shrink-0 p-1 cursor-pointer"
                      title="Copiar token"
                    >
                      {copiedToken ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-2 pt-1 font-nunito">
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} className="text-custom-amarillo" />
                  Imprimir Credencial
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )}
</AnimatePresence>
  )
}

function DataRow({ icon: Icon, label, value, title, highlight = false, href = null }) {
  return (
    <dd title={title} className="flex items-start gap-2.5 w-full cursor-default">
      <Icon className="w-3.5 h-3.5 text-custom-azul-oscuro dark:text-custom-celeste mt-0.5 shrink-0" strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-nunito leading-tight">{label}</p>
        {href ? (
          <Link
            to={href}
            className={`text-xs mt-0.5 leading-tight truncate flex items-center gap-1 hover:underline hover:text-[#37A6DE] transition-colors group/row ${
              highlight 
                ? 'font-bold font-nunito text-custom-azul-oscuro dark:text-custom-celeste' 
                : 'font-semibold text-slate-800 dark:text-slate-200'
            }`}
          >
            <span className="truncate">{value || '—'}</span>
            <ExternalLink size={11} className="shrink-0 text-custom-celeste opacity-80 group-hover/row:opacity-100 group-hover/row:translate-x-0.5 transition-all" />
          </Link>
        ) : (
          <p className={`text-xs mt-0.5 leading-tight truncate ${
            highlight 
              ? 'font-bold font-nunito text-custom-azul-oscuro dark:text-custom-celeste' 
              : 'font-semibold text-slate-800 dark:text-slate-200'
          }`}>
            {value || '—'}
          </p>
        )}
      </div>
    </dd>
  )
}

function DocItem({ label, checked }) {
  return (
    <div className="flex items-center gap-2 text-xs font-nunito">
      {checked ? (
        <>
          <CheckSquare className="h-4 w-4 text-custom-celeste shrink-0" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span>
        </>
      ) : (
        <>
          <Square className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
          <span className="text-red-500 dark:text-red-400 font-medium">{label} (Pendiente)</span>
        </>
      )}
    </div>
  )
}
