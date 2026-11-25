import { useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { canonicalRole } from '../utils/roles'

const DASHBOARD_ROLES = ['god', 'admin', 'director', 'regente', 'secretaria', 'preceptoria', 'instructor', 'alumno', 'postulante']

export default function NotFound() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const role = canonicalRole(user?.rol)
  const destination = !isAuthenticated
    ? { to: '/', label: 'Volver al inicio' }
    : DASHBOARD_ROLES.includes(role)
      ? { to: '/admin/dashboard', label: 'Ir al dashboard' }
      : { to: '/perfil', label: 'Volver a mi perfil' }

  useEffect(() => {
    const previous = document.title
    document.title = 'Página no encontrada · CFL 404'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#f3f7fb] text-custom-gris-oscuro flex flex-col items-center justify-center px-6 py-16 font-nunito">
      <Link
        to={destination.to}
        className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-custom-azul-oscuro"
        aria-label={destination.label}
      >
        <img
          src="/logo_texto_hero.svg"
          alt="Centro de Formación Laboral N.º 404 de Berisso"
          className="h-28 sm:h-36 w-auto object-contain"
        />
      </Link>

      <p className="mt-10 font-roboto font-black leading-none text-[5.5rem] sm:text-[8rem] text-custom-azul-oscuro tracking-tight">
        404
      </p>
      <span className="mt-3 block h-1.5 w-16 rounded-full bg-custom-amarillo" aria-hidden="true" />

      <h1 className="mt-8 max-w-md text-center text-lg sm:text-xl font-extrabold leading-snug">
        No hay una página del CFL 404 en esta dirección.
      </h1>
      <p className="mt-3 max-w-sm text-center text-sm text-custom-gris-claro">
        El logo también te lleva de vuelta.
      </p>

      {!isLoading && (
        <Link
          to={destination.to}
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-custom-azul-oscuro px-6 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#124f78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-azul-oscuro"
        >
          {destination.label}
        </Link>
      )}
    </main>
  )
}
