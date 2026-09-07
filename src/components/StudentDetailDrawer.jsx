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
  Check
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

  // Token de asistencia generado a partir del ID y Email del alumno
  const attendanceToken = student 
    ? `CFL404-ATT-${student.id}-${btoa(unescape(encodeURIComponent(student.email || student.id))).slice(0, 16)}` 
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
    course_name: student.course_name || 'Sin curso asignado',
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
        {/* Header con estilo uniforme */}
        <div className="bg-white dark:bg-slate-900 px-7 pt-7 pb-5 border-b border-slate-100 dark:border-slate-800/80 relative shrink-0">
          <button
            onClick={onClose}
            title="Cerrar panel de detalles"
            aria-label="Cerrar"
            className="absolute top-5 right-5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-1.5 transition-all focus:outline-none cursor-pointer"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-4">
            <div title={estadoTextos[student.status_id] || 'Estado'}>
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
              <p className="text-xs text-slate-500 dark:text-slate-400 font-nunito mt-1 mb-2">
                {isPostulante ? 'ID Postulante: ' : 'ID Alumno: '}
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">#{student.id}</span>
              </p>
              <div className="flex items-center gap-2">
                <BadgeStatus status={isPostulante ? 'postulante' : student.status_id} />
                {student.is_present && !isPostulante && (
                  <span className="text-[10px] bg-[#37A6DE]/15 text-[#166193] dark:text-[#37A6DE] px-2 py-0.5 rounded font-bold uppercase">
                    Presente Hoy
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable details content */}
        <div className="flex-1 overflow-y-auto px-7 py-6 font-nunito space-y-6">
          <dl className="space-y-6">
            
            {/* Sección: Personal (Bloque Superior) */}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <UserIcon size={14} className="text-[#166193] dark:text-[#37A6DE]" /> 
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
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <Phone size={14} className="text-[#166193] dark:text-[#37A6DE]" /> 
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
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <BookOpen size={14} className={isPostulante ? "text-amber-600 dark:text-amber-400" : "text-[#166193] dark:text-[#37A6DE]"} /> 
                {isPostulante ? 'Curso Solicitado en Preinscripción' : 'Información de Cursada'}
              </dt>
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 space-y-3.5">
                <DataRow 
                  icon={BookOpen} 
                  label={isPostulante ? "Curso Elegido" : "Curso Asignado"} 
                  value={details.course_name} 
                  title="Curso solicitado o asignado" 
                  highlight
                />
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <DataRow 
                    icon={Clock} 
                    label={isPostulante ? "Fecha de Postulación" : "Fecha Inscripción"} 
                    value={details.enrollment_date} 
                    title="Fecha de registro inicial" 
                  />
                  <DataRow 
                    icon={Award} 
                    label="Nivel Educativo" 
                    value={details.academic_level} 
                    title="Nivel de formación alcanzado" 
                  />
                </div>
              </div>
            </div>

            {/* Sección: Documentación Presentada */}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <CheckSquare size={14} className="text-[#166193] dark:text-[#37A6DE]" /> 
                Documentación Entregada (Papeles Físicos)
              </dt>
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/80 space-y-2">
                <DocItem label="Copia DNI (Frente y Dorso)" checked={details.has_dni_copy} />
                <DocItem label="Ficha de Inscripción Firmada" checked={details.has_form_copy} />
                <DocItem label="Copia Certificado / Título Secundario" checked={details.has_title_copy} />
              </div>
              {isPostulante && (
                <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-2.5 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 leading-relaxed space-y-1">
                  <p className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                    Verificar que los datos sean Reales
                  </p>
                  <p>
                    Doble verificación (digital y física): corrobora que el postulante haya presentado físicamente la documentación requerida antes de matricularlo. Recién al confirmar su pase a alumno regular se generará su <strong>Token de Asistencia</strong> (ID + Email).
                  </p>
                </div>
              )}
            </div>

          </dl>
        </div>

        {/* Footer Actions — En la card de ver datos personales solo va el botón Imprimir QR */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-col gap-2.5 shrink-0 no-print">
          
          {/* Botón Promover a Alumno para Postulantes */}
          {isPostulante && canEdit && onPromote && (
            <button
              onClick={() => onPromote(student.id)}
              title="Aprobar documentación y matricular como Alumno regular del centro"
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
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
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-[#166193] hover:bg-[#124f78] dark:bg-[#166193] dark:hover:bg-[#1a74aa] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <QrCode size={16} className="text-[#FDEA14]" />
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
                  <div className="p-2 bg-[#166193]/10 text-[#166193] dark:text-[#37A6DE] rounded-lg">
                    <QrCode size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-tight">
                      Código QR de Asistencia
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      CFL N° 404 • Berisso
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Token de Asistencia (ID + Email)
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono">
                    <span className="truncate text-slate-600 dark:text-slate-300">{attendanceToken}</span>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="text-slate-400 hover:text-[#166193] dark:hover:text-[#37A6DE] shrink-0 p-1"
                      title="Copiar token"
                    >
                      {copiedToken ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-[#166193] hover:bg-[#124f78] text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} />
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

function DataRow({ icon: Icon, label, value, title, highlight = false }) {
  return (
    <dd title={title} className="flex items-start gap-2.5 w-full cursor-default">
      <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{label}</p>
        <p className={`text-xs mt-0.5 leading-tight truncate ${
          highlight 
            ? 'font-bold text-[#166193] dark:text-[#37A6DE]' 
            : 'font-semibold text-slate-900 dark:text-slate-200'
        }`}>
          {value || '—'}
        </p>
      </div>
    </dd>
  )
}

function DocItem({ label, checked }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {checked ? (
        <>
          <CheckSquare className="h-4 w-4 text-[#37A6DE] shrink-0" />
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
