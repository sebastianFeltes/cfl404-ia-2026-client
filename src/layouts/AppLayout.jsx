import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router'
import { Menu, X, Home, Building2, GraduationCap, Users, Mail, LogIn } from 'lucide-react'
import Footer from '../components/Footer'

/**
 * AppLayout — layout público del sitio institucional del CFL 404.
 * Navbar transparente en el top, opaco al hacer scroll.
 * Footer persistente en todas las páginas públicas.
 */
function AppLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Detectar scroll para cambiar navbar de transparente → opaco
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const closeMenu = () => setIsMenuOpen(false)

    const navItems = [
        { path: '/',              label: 'Inicio',        icon: Home,          tooltip: 'Ir a Inicio',               end: true  },
        { path: '/institucional', label: 'Institucional', icon: Building2,     tooltip: 'Ver sección Institucional',  end: false },
        { path: '/cursos',        label: 'Cursos',        icon: GraduationCap, tooltip: 'Ver oferta de Cursos',       end: false },
        { path: '/cooperadora',   label: 'Cooperadora',   icon: Users,         tooltip: 'Ir a la Cooperadora',        end: false },
        { path: '/contactos',     label: 'Contactos',     icon: Mail,          tooltip: 'Ver datos de Contacto',      end: false },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-roboto text-custom-gris-oscuro">

            {/* ── Navbar ── */}
            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                    scrolled
                        ? 'bg-custom-azul-oscuro/95 backdrop-blur-md shadow-lg'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                    {/* Logo */}
                    <NavLink to="/" className="flex items-center active:scale-95 transition-transform" onClick={closeMenu}>
                        <img
                            src="/logo_texto_hero.svg"
                            alt="Centro de Formación Laboral Nº 404 / Berisso"
                            className="h-10 sm:h-12 w-auto object-contain bg-white/10 rounded-full p-0.5 border border-white/20 shadow-sm"
                        />
                    </NavLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 font-nunito font-semibold text-sm transition-all duration-200 py-1.5 px-3 rounded-lg hover:bg-white/15 ${
                                        isActive
                                            ? 'text-custom-amarillo bg-white/10'
                                            : 'text-white/85 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        ))}

                        {/* Separador + link Login */}
                        <div className="w-px h-5 bg-white/25 mx-2" />
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `flex items-center gap-2 font-nunito font-bold text-sm transition-all duration-200 py-1.5 px-4 rounded-lg border ${
                                    isActive
                                        ? 'bg-custom-amarillo text-custom-gris-oscuro border-custom-amarillo'
                                        : 'text-white border-white/30 hover:bg-white/15 hover:border-white/50'
                                }`
                            }
                        >
                            <LogIn className="w-4 h-4" />
                            Ingresar
                        </NavLink>
                    </nav>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-white/15 focus:outline-none transition-colors active:scale-90"
                        aria-label="Abrir menú de navegación"
                        aria-expanded={isMenuOpen}
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            <div
                className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
                    isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={closeMenu}
                />

                {/* Drawer panel */}
                <div
                    className={`absolute right-4 top-4 w-72 max-w-[85vw] bg-custom-azul-oscuro text-white rounded-2xl shadow-2xl p-6 border border-white/10 flex flex-col transition-all duration-300 transform ${
                        isMenuOpen
                            ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                            : 'translate-x-10 -translate-y-10 scale-90 opacity-0'
                    }`}
                >
                    {/* Close */}
                    <div className="flex justify-end mb-5">
                        <button
                            onClick={closeMenu}
                            className="p-2 rounded-full hover:bg-white/10 active:scale-90 transition-all text-white/80 hover:text-white"
                            aria-label="Cerrar menú"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Nav items */}
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 font-nunito font-bold text-base p-3 rounded-xl transition-all active:scale-[0.98] ${
                                        isActive
                                            ? 'bg-custom-amarillo text-custom-gris-oscuro shadow-lg'
                                            : 'hover:bg-white/10 text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {item.label}
                            </NavLink>
                        ))}

                        {/* Login */}
                        <div className="border-t border-white/10 mt-2 pt-3">
                            <NavLink
                                to="/login"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 font-nunito font-bold text-base p-3 rounded-xl transition-all active:scale-[0.98] ${
                                        isActive
                                            ? 'bg-custom-amarillo text-custom-gris-oscuro shadow-lg'
                                            : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`
                                }
                            >
                                <LogIn className="w-5 h-5 flex-shrink-0" />
                                Ingresar al sistema
                            </NavLink>
                        </div>
                    </nav>

                    {/* Branding */}
                    <div className="mt-auto pt-8 text-center border-t border-white/10 text-white/50 text-xs">
                        <p className="font-nunito">CFL Nº 404 Berisso</p>
                        <p className="mt-0.5">Educación Pública y Gratuita</p>
                    </div>
                </div>
            </div>

            {/* ── Contenido de página ── */}
            {/* pt-16 compensa el navbar fixed (64px). El Hero de Home lo sobreescribe con min-h-dvh */}
            <main className="flex-grow flex flex-col pt-16">
                <Outlet />
            </main>

            {/* ── Footer persistente ── */}
            <Footer />
        </div>
    )
}

export default AppLayout