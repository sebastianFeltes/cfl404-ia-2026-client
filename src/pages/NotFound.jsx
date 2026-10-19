import { useEffect } from 'react'
import { Link } from 'react-router'

export default function NotFound() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Página no encontrada · CFL 404'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#f3f7fb] text-custom-gris-oscuro dark:bg-slate-950 dark:text-slate-100 flex flex-col items-center justify-center px-6 py-16 font-nunito">
      <img
        src="/logo_texto_hero.svg"
        alt="Centro de Formación Laboral N.º 404 de Berisso"
        className="h-28 sm:h-36 w-auto object-contain"
      />

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-custom-celeste">
        N.º
      </p>
      <p className="font-roboto font-black leading-none text-[5.5rem] sm:text-[8rem] text-custom-azul-oscuro dark:text-custom-celeste tracking-tight">
        404
      </p>
      <span className="mt-3 block h-1.5 w-16 rounded-full bg-custom-amarillo" aria-hidden="true" />

      <h1 className="mt-8 max-w-md text-center text-lg sm:text-xl font-extrabold leading-snug">
        No hay una página del CFL 404 en esta dirección.
      </h1>

      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-custom-azul-oscuro px-6 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#124f78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-azul-oscuro"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
