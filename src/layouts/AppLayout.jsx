import { useState } from 'react'
import { Outlet, NavLink } from 'react-router'
import { Menu, X, Home, Building2, GraduationCap, Users, Mail } from 'lucide-react'
import Tooltip from '../components/Tooltip'

function AppLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navItems = [
        { path: '/', label: 'Inicio', icon: Home, tooltip: 'Ir a Inicio' },
        { path: '/institucional', label: 'Institucional', icon: Building2, tooltip: 'Ver sección Institucional' },
        { path: '/cursos', label: 'Cursos', icon: GraduationCap, tooltip: 'Ver oferta de Cursos' },
        { path: '/cooperadora', label: 'Cooperadora', icon: Users, tooltip: 'Ir a la Cooperadora' },
        { path: '/contactos', label: 'Contactos', icon: Mail, tooltip: 'Ver datos de Contacto' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-roboto text-custom-gris-oscuro">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-custom-azul-oscuro text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Tooltip text="CFL 404 – Centro de Formación Laboral">
                        <NavLink to="/" className="flex items-center active:scale-95 transition-transform" onClick={closeMenu}>
                            <img 
                                src="/logo_texto_hero.svg" 
                                alt="Centro de Formación Laboral Nº 404 / Berisso" 
                                className="h-10 sm:h-12 w-auto object-contain bg-white rounded-full p-0.5 border border-white/20 shadow-sm animate-fade-in"
                            />
                        </NavLink>
                    </Tooltip>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Tooltip key={item.path} text={item.tooltip}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 font-nunito font-semibold text-sm transition-all py-1.5 px-3 rounded-lg hover:bg-white/10 ${
                                            isActive 
                                                ? 'text-custom-amarillo bg-white/5 shadow-inner' 
                                                : 'text-white/80 hover:text-white'
                                        }`
                                    }
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </NavLink>
                            </Tooltip>
                        ))}
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <button 
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none transition-colors active:scale-90"
                        aria-label="Abrir menú de navegación"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Drawer / Sidebar */}
            <div 
                className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
                    isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop Blur/Dark Overlay */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                    onClick={closeMenu}
                />

                {/* Drawer Content */}
                <div 
                    className={`absolute right-4 top-4 w-72 max-w-[85vw] bg-[#1a6fa8] text-white rounded-2xl shadow-2xl p-6 border border-white/10 flex flex-col transition-all duration-300 transform ${
                        isMenuOpen ? 'translate-x-0 translate-y-0 scale-100' : 'translate-x-10 -translate-y-10 scale-90 opacity-0'
                    }`}
                >
                    {/* Close Button */}
                    <div className="flex justify-end mb-6">
                        <button 
                            onClick={closeMenu}
                            className="p-2 rounded-full hover:bg-white/10 active:scale-90 transition-all text-white/80 hover:text-white"
                            aria-label="Cerrar menú de navegación"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex flex-col gap-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 font-nunito font-bold text-lg p-3 rounded-xl transition-all active:scale-[0.98] ${
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
                    </nav>

                    {/* Micro information / branding in menu */}
                    <div className="mt-auto pt-10 text-center border-t border-white/10 text-white/60 text-xs">
                        <p className="font-nunito">CFL Nº 404 Berisso</p>
                        <p className="mt-1">Educación Pública y Gratuita</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-custom-gris-oscuro text-custom-blanco py-6 mt-auto border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-nunito text-gray-400">
                        Contacto: <a href="mailto:cooperadora@cfl404.edu.ar" className="text-custom-celeste hover:underline transition-colors">cooperadora@cfl404.edu.ar</a>
                    </p>
                    <p className="text-xs font-nunito text-gray-500 mt-2">
                        © {new Date().getFullYear()} CFL 404. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default AppLayout