const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/cfl404berisso/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/cfl404berisso',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://twitter.com/cfl404berisso',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/channel/UC6S14E5C0nE2ey8poEq8AZQ/featured',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://api.whatsapp.com/send?phone=5492213192360',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="relative w-full overflow-hidden"
      aria-label="Pie de página – Contacto"
    >
      {/* ── Separador superior decorativo ── */}
      <div
        className="h-[3px] w-full"
        style={{
          background: 'linear-gradient(90deg, #166193 0%, #37A6DE 35%, #FDEA14 65%, #166193 100%)',
        }}
      />

      {/* ── Fondo con gradiente ── */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(180deg, #166193 0%, #0f4d76 40%, #1D1E1C 100%)',
        }}
      >
        {/* Blur decorativo sutil */}
        <div
          className="absolute top-12 left-[10%] w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(55,166,222,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-20 right-[5%] w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(253,234,20,0.04) 0%, transparent 70%)',
            filter: 'blur(32px)',
          }}
        />

        {/* ── Contenido principal ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">

            {/* ═══ Columna 1 — Logo + Institución ═══ */}
            <div className="flex flex-col items-start gap-4">
              {/* Logo */}
              <a href="#" className="block group" aria-label="Inicio">
                <img
                  src="/logo_texto_hero.svg"
                  alt="CFL 404 Logo"
                  className="w-36 lg:w-44 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  style={{
                    filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))',
                  }}
                />
              </a>
              <p
                className="text-white/70 text-xs leading-relaxed max-w-xs"
                style={{ fontFamily: '"Nunito", sans-serif' }}
              >
                Centro de Formación Laboral N.º 404 de Berisso. Cursos gratuitos con certificación oficial.
              </p>
            </div>

            {/* ═══ Columna 2 — Contacto + Redes ═══ */}
            <div className="flex flex-col items-start gap-6">
              <h3
                className="text-white font-bold text-lg tracking-wide"
                style={{ fontFamily: '"Roboto Flex", sans-serif' }}
              >
                Contacto
              </h3>

              {/* Teléfono */}
              <div className="relative group/tooltip flex flex-col items-start">
                <a
                  href="tel:08003480111"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#FDEA14]/40 group-hover:bg-[#FDEA14]/5 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-[#37A6DE]" aria-hidden="true">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: '"Nunito", sans-serif' }}
                  >
                    0800-348-0111
                  </span>
                </a>
              </div>

              {/* Email */}
              <div className="relative group/tooltip flex flex-col items-start">
                <a
                  href="mailto:cfp404berisso@abc.gob.ar"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#FDEA14]/40 group-hover:bg-[#FDEA14]/5 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-[#37A6DE]" aria-hidden="true">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: '"Nunito", sans-serif' }}
                  >
                    cfp404berisso@abc.gob.ar
                  </span>
                </a>
              </div>

              {/* Redes Sociales */}
              <div className="mt-2">
                <h4
                  className="text-white/50 text-xs font-semibold tracking-[0.15em] uppercase mb-3"
                  style={{ fontFamily: '"Nunito", sans-serif' }}
                >
                  Seguinos
                </h4>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <div key={social.name} className="relative group/tooltip flex flex-col items-center">
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-[#FDEA14] hover:border-[#FDEA14]/50 hover:bg-[#FDEA14]/8 hover:shadow-[0_0_16px_rgba(253,234,20,0.15)] transition-all duration-300 active:scale-95"
                      >
                        {social.icon}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ Columna 3 — Ubicación / Mapa ═══ */}
            <div className="flex flex-col items-start gap-3.5 w-full">
              <h3
                className="text-white font-bold text-lg tracking-wide"
                style={{ fontFamily: '"Roboto Flex", sans-serif' }}
              >
                Ubicación
              </h3>

              {/* Dirección */}
              <div className="flex items-start gap-2.5 text-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4.5 h-4.5 mt-0.5 text-[#37A6DE] shrink-0"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p
                    className="text-white/90 text-xs font-medium leading-snug"
                    style={{ fontFamily: '"Nunito", sans-serif' }}
                  >
                    Calle La Portada N.º 4120 (Acceso 4 al Puerto)
                  </p>
                  <p
                    className="text-white/60 text-xs leading-snug"
                    style={{ fontFamily: '"Nunito", sans-serif' }}
                  >
                    Berisso, Buenos Aires, Argentina
                  </p>
                </div>
              </div>

              {/* Mapa embebido */}
              <div className="relative group/tooltip w-full">
                <div className="w-full rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-black/20">
                  <iframe
                    title="Ubicación CFL 404 Berisso"
                    src="https://maps.google.com/maps?q=Calle%20La%20Portada%204120%20Berisso&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="180"
                    style={{
                      border: 0,
                      filter: 'grayscale(0.3) contrast(1.1) brightness(0.85)',
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block"
                  />
                </div>
                {/* Tooltip */}
                <span className="absolute top-2 right-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                  <span className="bg-[#1D1E1C]/90 backdrop-blur-md text-white/90 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xl border border-white/15 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#37A6DE] animate-pulse" />
                    Google Maps interactivo
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Copyright bar ── */}
        <div className="relative z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p
              className="text-white/40 text-xs font-medium tracking-wide"
              style={{ fontFamily: '"Nunito", sans-serif' }}
            >
              © {new Date().getFullYear()} CFL 404 — Todos los derechos reservados.
            </p>
            <p
              className="text-white/30 text-xs"
              style={{ fontFamily: '"Nunito", sans-serif' }}
            >
              Formación laboral para el futuro.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
