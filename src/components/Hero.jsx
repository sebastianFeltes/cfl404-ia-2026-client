import { Link } from 'react-router'
import hombre from '../assets/hombre_soldando.webp'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center justify-center overflow-hidden -mt-16"
      aria-label="Sección principal"
    >
      {/* ── Fondo de color base ── */}
      <div className="absolute inset-0 bg-[#1D1E1C]" />

      {/* ── Gradiente de fusión foto → oscuro (izquierda → derecha) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(43, 46, 40, 0) 35%, rgba(29,30,28,0.75) 60%, rgba(29,30,28,0.98) 82%)',
        }}
      />

      {/* ── Gradiente inferior (fade toward next section) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(29,30,28,0.8))',
        }}
      />

      {/* ── Foto del hombre soldando – fondo izquierdo ── */}
      <div className="absolute left-0 top-0 bottom-0 w-full md:w-[65%] lg:w-[70%] pointer-events-none select-none">
        <img
          src={hombre}
          alt="Hombre soldando"
          aria-hidden="true"
          className="h-full w-screen lg:object-right object-cover object-[60%_25%] md:object-[75%_center] opacity-85 md:opacity-100"
          loading="eager"
        />
        {/* Overlay graduado: suave en mobile para resaltar al soldador, lateral en desktop */}
        <div
          className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#1D1E1C] via-[#1D1E1C]/60 md:via-[#1D1E1C]/65 to-transparent"
        />
      </div>

      {/* ── Partículas decorativas (círculos blur) ── */}
      <div
        className="absolute top-1/4 right-[8%] w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(55,166,222,0.12) 0%, transparent 70%)',
          filter: 'blur(32px)',
        }}
      />
      <div
        className="absolute bottom-1/3 right-[20%] w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(253,234,20,0.07) 0%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      {/* ── Logo en el Hero (Desktop: Izquierda al medio / levemente más arriba) ── */}
      <div className="hidden md:block absolute md:left-12 lg:left-16 md:top-[42%] md:-translate-y-1/2 z-20 pointer-events-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <a href="#" className="block group" aria-label="Inicio">
          <img
            src="/logo_texto_hero.svg"
            alt="CFL 404 Logo"
            className="md:w-56 lg:w-72 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            style={{
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.85))',
            }}
          />
        </a>
      </div>

      {/* ── Contenido principal ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-14 sm:pt-18 md:pt-20 pb-28 md:pb-20 flex justify-center md:justify-end">
        <div className="max-w-xl lg:max-w-2xl w-full flex flex-col items-center md:items-end text-center md:text-right">

          {/* Logo en Mobile (Centrado justo arriba del título) */}
          <div className="block md:hidden mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <a href="#" className="block group" aria-label="Inicio">
              <img
                src="/logo_texto_hero.svg"
                alt="CFL 404 Logo"
                className="w-32 sm:w-40 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                style={{
                  filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.85))',
                }}
              />
            </a>
          </div>

          {/* Headline principal */}
          <h1
            className="font-roboto text-white leading-tight mb-5 animate-fade-in-up md:-mt-28"
            style={{
              fontFamily: '"Roboto Flex", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.85rem, 4.5vw, 3.2rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              animationDelay: '0.2s',
            }}
          >
            Educación para{' '}
            <span
              className="relative inline-block"
              style={{ color: '#37A6DE' }}
            >
              el presente.
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(to right, #37A6DE, transparent)' }}
              />
            </span>
            <br />
            <span style={{ color: '#FDEA14' }}>Trabajo</span>{' '}
            para el futuro.
          </h1>


          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-end animate-fade-in-up" style={{ animationDelay: '0.5s' }}>

            {/* Primario — gradiente azul con acento amarillo */}
            <a
              href="#cursos"
              id="btn-hero-cursos"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-nunito font-bold text-base tracking-wide whitespace-nowrap overflow-hidden transition-all duration-250 hover:shadow-2xl hover:shadow-[#166193]/50 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                fontFamily: '"Nunito", sans-serif',
                background: 'linear-gradient(135deg, #166193 0%, #1e7ab8 60%, #37A6DE 100%)',
                color: '#fff',
                boxShadow: '0 4px 18px rgba(22,97,147,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              {/* Shine sweep on hover */}
              <span
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
                }}
              />
              <span className="relative z-10">Ver cursos</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="relative z-10 w-4.5 h-4.5 transition-transform duration-250 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            {/* Secundario — glassmorphism con borde amarillo suave */}
            <Link
              to="/institucional"
              id="btn-hero-institucional"
              className="group relative inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-nunito font-semibold text-base tracking-wide whitespace-nowrap transition-all duration-250 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                fontFamily: '"Nunito", sans-serif',
                color: 'rgba(255,255,255,0.85)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(253,234,20,0.25)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.border = '1.5px solid rgba(253,234,20,0.65)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(253,234,20,0.12), 0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                e.currentTarget.style.border = '1.5px solid rgba(253,234,20,0.25)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
              }}
            >
              Conocenos
            </Link>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator (Más compacto) ── */}
      <a
        href="#cursos"
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 group text-white/50 hover:text-white transition-colors duration-300 cursor-pointer"
        aria-label="Desplazarse hacia abajo"
      >
        <span
          className="font-nunito text-[9.5px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 group-hover:text-[#37A6DE]"
          style={{ fontFamily: '"Nunito", sans-serif' }}
        >
          Desplázate
        </span>

        {/* Icono de Mouse Cápsula compacto */}
        <div className="relative w-4.5 h-7.5 rounded-full border-[1.5px] border-white/30 group-hover:border-[#37A6DE] transition-colors duration-300 flex justify-center p-1 shadow-sm">
          <div className="w-0.75 h-1.5 bg-[#37A6DE] rounded-full animate-scroll-wheel" />
        </div>

        {/* Flecha indicadora hacia abajo */}
        <div className="flex flex-col items-center -mt-0.5 animate-bounce-down">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3 h-3 text-[#37A6DE]"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </a>
    </section>
  )
}
