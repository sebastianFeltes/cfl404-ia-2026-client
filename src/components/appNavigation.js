import {
  Users,
  Book,
  GraduationCap,
  LayoutDashboard,
  ClipboardCheck,
  Wallet,
  Settings2,
  QrCode,
} from 'lucide-react'
import { canonicalRole } from '../utils/roles'

/** Dirección del centro. admin sigue acá hasta retirarlo de la base. */
const DIRECTION_ROLES = ['god', 'director', 'regente', 'admin']
const SECRETARIA_ROLES = ['secretaria', 'preceptoria']
const QR_ROLES = ['god', 'contralor']

export const navSections = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
    title: 'Resumen del centro',
    roles: null,
  },
  {
    id: 'asistencia',
    label: 'Asistencia',
    icon: ClipboardCheck,
    path: '/admin/asistencia',
    title: 'Registro y seguimiento de asistencia',
    roles: [...DIRECTION_ROLES, ...SECRETARIA_ROLES, 'instructor'],
  },
  {
    id: 'qr',
    label: 'Lector QR',
    icon: QrCode,
    path: '/qr',
    title: 'Pantalla de ingreso con lector QR',
    roles: QR_ROLES,
  },
  {
    id: 'instructores',
    label: 'Instructores',
    icon: Users,
    path: '/admin/instructores',
    title: 'Gestión de docentes e instructores',
    roles: DIRECTION_ROLES,
  },
  {
    id: 'cursos',
    label: 'Cursos',
    icon: Book,
    path: '/admin/cursos',
    title: 'Gestión de ofertas formativas',
    roles: [...DIRECTION_ROLES, 'instructor', 'alumno', 'postulante'],
  },
  {
    id: 'alumnos',
    label: 'Alumnos',
    icon: GraduationCap,
    path: '/admin/alumnos',
    title: 'Matrícula y nómina de estudiantes',
    roles: [...DIRECTION_ROLES, ...SECRETARIA_ROLES],
  },
  {
    id: 'cooperadora',
    label: 'Cooperadora',
    icon: Wallet,
    path: '/admin/cooperadora',
    title: 'Gestión de pagos de cooperadora y buffet',
    roles: [...DIRECTION_ROLES, ...SECRETARIA_ROLES],
  },
  {
    id: 'config',
    label: 'Configuración',
    icon: Settings2,
    path: '/admin/configuracion',
    title: 'Ajustes del sistema, cooperadora y patrocinadores',
    roles: ['god', 'director', 'regente'],
  },
]

export function isLearnerRole(role) {
  const normalized = canonicalRole(role)
  return normalized === 'alumno' || normalized === 'postulante'
}

export function sectionsForRole(role) {
  if (role === 'contralor') {
    return navSections.filter((section) => section.id === 'qr')
  }
  return navSections.filter((section) => section.roles === null || section.roles.includes(role))
}

export function sectionPath(section, role) {
  if (section.id === 'cursos' && (role === 'alumno' || role === 'postulante')) {
    return '/inscripcion'
  }
  return section.path
}

export function sectionTitle(section, role) {
  if (section.id === 'cursos' && (role === 'alumno' || role === 'postulante')) {
    return 'Inscripción a la oferta de cursos'
  }
  return section.title
}
