import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Inicio', href: '#' },
  { label: 'Institucional', href: '#institucional' },
  { label: 'Contacto', href: '#contacto' },
  { label: 'Cooperadora', href: '#cooperadora' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled || menuOpen
        ? 'bg-[#166193]/85 backdrop-blur-md shadow-lg shadow-[#166193]/30'
        : 'bg-transparent'
        }`}
      style={{ transition: 'background-color 0.4s ease, box-shadow 0.4s ease' }}
    >
      <nav className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">

        {/* Nav links - desktop (Perfectly Centered) */}
        <ul className="hidden md:flex items-center justify-center gap-4 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative px-4 py-2 font-nunito text-[15px] font-medium text-white/90 hover:text-white transition-colors duration-200 group"
                style={{ fontFamily: '"Nunito", sans-serif' }}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FDEA14] rounded-full transition-all duration-300 group-hover:w-4/5" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex-1 md:hidden" />

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <a
            href="#registro"
            id="btn-registrate"
            className="relative px-5 py-2.5 rounded-xl border-2 border-[#FDEA14] text-[#FDEA14] font-nunito font-semibold text-base tracking-wide overflow-hidden group transition-all duration-250 hover:text-[#1D1E1C] hover:shadow-lg hover:shadow-[#FDEA14]/25 active:scale-[0.97]"
            style={{
              fontFamily: '"Nunito", sans-serif',
              color: 'rgba(255,255,255,0.85)',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(253,234,20,0.25)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <span className="relative z-10 group-hover:text-[#1D1E1C]">Regístrate</span>
            <span className="absolute inset-0 bg-[#FDEA14] translate-y-full group-hover:translate-y-0 transition-transform duration-250 rounded-[10px]" />
          </a>
        </div>

        {/* Hamburger - mobile */}
        <button
          id="btn-menu-mobile"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 cursor-pointer"
        >
          <span
            className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''
              }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        style={{
          background: 'rgba(22, 97, 147, 0.97)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <ul className="flex flex-col px-6 pb-6 pt-2 gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-nunito text-base font-medium text-white/90 hover:text-[#FDEA14] border-b border-white/10 transition-colors duration-200"
                style={{ fontFamily: '"Nunito", sans-serif' }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-4 flex justify-center">
            <a
              href="#registro"
              onClick={() => setMenuOpen(false)}
              className="group relative inline-block text-center px-8 py-2.5 rounded-xl border-2 border-[#FDEA14] text-[#FDEA14] font-nunito font-semibold text-base overflow-hidden transition-all duration-250 active:scale-[0.97]"
              style={{ fontFamily: '"Nunito", sans-serif' }}
            >
              <span className="relative z-10 group-hover:text-[#1D1E1C] transition-colors duration-250">Regístrate</span>
              <span className="absolute inset-0 bg-[#FDEA14] translate-y-full group-hover:translate-y-0 transition-transform duration-250 rounded-[10px]" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
