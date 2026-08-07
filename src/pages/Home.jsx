import { NavLink } from 'react-router'
import { Building2, Users, ShieldAlert, ChevronRight } from 'lucide-react'

function Home() {
    const modules = [
        {
            title: "Sección Institucional",
            description: "Conocé las estadísticas de nuestra institución y accedé a los descuentos exclusivos en los Comercios Adheridos de Berisso.",
            path: "/institucional",
            icon: Building2,
            badge: "Completado",
            badgeColor: "bg-green-100 text-green-800"
        },
        {
            title: "Asociación Cooperadora",
            description: "Información sobre la cooperadora escolar, datos bancarios para donaciones y envío de comprobantes de transferencia.",
            path: "/cooperadora",
            icon: Users,
            badge: "Completado",
            badgeColor: "bg-green-100 text-green-800"
        },
        {
            title: "Preferencias de Cookies",
            description: "Configuración de privacidad y cookies para una experiencia segura y personalizada en el sitio del CFL 404.",
            path: "/cookies",
            icon: ShieldAlert,
            badge: "Próximamente",
            badgeColor: "bg-blue-100 text-blue-800"
        }
    ];

    return (
        <div className="flex-grow bg-gray-50 font-roboto">
            {/* Hero / Welcome */}
            <div className="bg-gradient-to-br from-custom-azul-oscuro to-custom-celeste text-white py-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="bg-custom-amarillo/20 text-custom-amarillo font-nunito font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-custom-amarillo/30">
                        Portal de Rediseño - CFL 404
                    </span>
                    <h1 className="font-nunito font-extrabold text-3xl sm:text-5xl mt-4 mb-6 leading-tight tracking-tight">
                        Módulos de Desarrollo
                    </h1>
                    <p className="text-white/95 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Bienvenido al espacio de trabajo. Aquí se encuentran los accesos directos a las secciones asignadas a nuestro equipo de desarrollo.
                    </p>
                </div>
            </div>

            {/* List of Modules */}
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-6">
                    {modules.map((mod, idx) => (
                        <div 
                            key={idx}
                            className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm hover:shadow-md hover:border-custom-celeste/20 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start"
                        >
                            <div className="w-12 h-12 rounded-xl bg-custom-celeste/10 text-custom-celeste flex items-center justify-center flex-shrink-0">
                                <mod.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h3 className="font-nunito font-bold text-lg text-custom-gris-oscuro">
                                        {mod.title}
                                    </h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mod.badgeColor}`}>
                                        {mod.badge}
                                    </span>
                                </div>
                                <p className="text-sm text-custom-gris-claro leading-relaxed mb-4">
                                    {mod.description}
                                </p>
                                <NavLink 
                                    to={mod.path}
                                    className="inline-flex items-center gap-1 text-sm font-bold text-custom-azul-oscuro hover:text-custom-celeste transition-colors cursor-pointer group"
                                >
                                    Ir a la sección
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home