import { useState } from 'react'
import { Search, MapPin, Tag, X, Phone, Check, Award, GraduationCap, Building2, Users2 } from 'lucide-react'
import { stats, comercios } from '../utils/mockData'
import Tooltip from '../components/Tooltip'

function Institucional() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedComercio, setSelectedComercio] = useState(null)

    // Filter businesses based on search input (name or category/rubro)
    const filteredComercios = comercios.filter(comercio => {
        const query = searchQuery.toLowerCase().trim()
        if (!query) return true
        return (
            comercio.nombre.toLowerCase().includes(query) ||
            comercio.rubro.toLowerCase().includes(query)
        );
    });

    // Helper to get initials for business avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Helper to map stats id to lucide icon
    const getStatIcon = (id) => {
        switch (id) {
            case 1:
                return <GraduationCap className="w-8 h-8 text-custom-celeste animate-pulse" />;
            case 2:
                return <Users2 className="w-8 h-8 text-custom-celeste animate-pulse" />;
            case 3:
                return <Building2 className="w-8 h-8 text-custom-celeste animate-pulse" />;
            case 4:
                return <Award className="w-8 h-8 text-custom-celeste animate-pulse" />;
            default:
                return <Award className="w-8 h-8 text-custom-celeste" />;
        }
    };

    const handleOpenModal = (comercio) => {
        setSelectedComercio(comercio);
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const handleCloseModal = () => {
        setSelectedComercio(null);
        document.body.style.overflow = 'unset'; // Unlock background scroll
    };

    const handleWhatsAppClick = (comercio) => {
        const text = encodeURIComponent(`Hola ${comercio.nombre}, me contacto desde la web de CFL 404. Quería consultar sobre el beneficio del ${comercio.descuento} y su catálogo.`);
        window.open(`https://wa.me/${comercio.telefono}?text=${text}`, '_blank');
    };

    return (
        <div className="flex-grow bg-gray-50 pb-16 font-roboto">
            {/* Hero / Banner Superior */}
            <div className="bg-gradient-to-r from-custom-azul-oscuro via-[#1d74ad] to-custom-celeste text-white py-10 px-4 text-center flex flex-col items-center justify-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
                    <div className="bg-white/95 rounded-2xl p-4 sm:p-5 shadow-lg border border-white/20 max-w-[90%] sm:max-w-md transition-transform hover:scale-[1.02]">
                        <img 
                            src="/logo_texto_lado.svg" 
                            alt="Centro de Formación Laboral Nº 404 Berisso" 
                            className="h-14 sm:h-16 md:h-20 w-auto object-contain mx-auto"
                        />
                    </div>
                    <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Conocé más sobre nuestro Centro de Formación Laboral Nº 404 de Berisso, nuestro impacto en la comunidad y los beneficios exclusivos para nuestros alumnos.
                    </p>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="max-w-4xl mx-auto px-4 -mt-6">
                
                {/* 1. SECCIÓN DE ESTADÍSTICAS */}
                <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 mb-10">
                    <div className="text-center mb-8">
                        <h2 className="font-nunito font-extrabold text-2xl text-custom-azul-oscuro tracking-tight">
                            Nuestra Trayectoria en Cifras
                        </h2>
                        <div className="h-1 w-16 bg-custom-celeste mx-auto mt-2 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {stats.map((stat) => (
                            <div 
                                key={stat.id} 
                                className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-custom-celeste/20 hover:bg-custom-celeste/[0.02] hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-custom-celeste/10 rounded-2xl group-hover:bg-custom-celeste/20 transition-colors">
                                    {getStatIcon(stat.id)}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="font-nunito font-extrabold text-3xl text-custom-azul-oscuro leading-none">
                                        {stat.value}
                                    </span>
                                    <span className="font-nunito font-bold text-sm text-custom-gris-oscuro mt-1">
                                        {stat.label}
                                    </span>
                                    <span className="text-xs text-custom-gris-claro mt-1 leading-snug">
                                        {stat.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. SECCIÓN DE COMERCIOS ADHERIDOS */}
                <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                    <div className="text-center mb-6">
                        <h2 className="font-nunito font-extrabold text-2xl sm:text-3xl text-custom-azul-oscuro tracking-tight">
                            Comercios Adheridos
                        </h2>
                        <p className="text-sm text-custom-gris-claro mt-2 max-w-md mx-auto">
                            Presentando tu constancia de alumno regular o credencial docente, podés acceder a descuentos exclusivos en estos comercios de Berisso.
                        </p>
                        <div className="h-1 w-16 bg-custom-celeste mx-auto mt-3 rounded-full" />
                    </div>

                    {/* Buscador */}
                    <div className="relative mb-8 max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Buscar comercio por nombre o rubro..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-custom-gris-oscuro placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-custom-azul-oscuro/20 focus:border-custom-azul-oscuro focus:bg-white transition-all shadow-inner"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Lista de Comercios */}
                    <div className="flex flex-col gap-6">
                        {filteredComercios.length > 0 ? (
                            filteredComercios.map((comercio) => (
                                <div 
                                    key={comercio.id}
                                    className="relative flex flex-col p-5 bg-white border border-gray-150 rounded-2xl shadow-xs hover:shadow-md hover:border-custom-celeste/30 transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Discount Ribbon/Badge */}
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-custom-amarillo text-custom-gris-oscuro font-nunito font-black text-xs px-3 py-1.5 rounded-bl-xl border-l border-b border-gray-100 shadow-sm flex items-center gap-1">
                                            <Tag className="w-3.5 h-3.5" />
                                            {comercio.descuento}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* Shop Avatar */}
                                        <div className="w-12 h-12 bg-custom-azul-oscuro/5 text-custom-azul-oscuro font-nunito font-extrabold text-sm flex items-center justify-center rounded-xl flex-shrink-0 border border-custom-azul-oscuro/10">
                                            {getInitials(comercio.nombre)}
                                        </div>

                                        <div className="flex flex-col pt-0.5 pr-20">
                                            <h3 className="font-nunito font-bold text-lg text-custom-gris-oscuro group-hover:text-custom-azul-oscuro transition-colors leading-snug">
                                                {comercio.nombre}
                                            </h3>
                                            <span className="text-xs font-semibold text-custom-celeste uppercase tracking-wider mt-0.5">
                                                {comercio.rubro.split(',')[0]}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-custom-gris-claro text-sm mt-2">
                                                <MapPin className="w-4 h-4 text-custom-gris-claro/70 flex-shrink-0" />
                                                <span className="truncate">{comercio.direccion}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Action Button */}
                                    <Tooltip text="Ver productos y descuentos de este comercio">
                                        <button
                                            onClick={() => handleOpenModal(comercio)}
                                            className="w-full mt-2 bg-custom-azul-oscuro text-white font-nunito font-extrabold text-sm py-3 px-4 rounded-xl hover:bg-custom-azul-oscuro/95 active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:shadow-md"
                                        >
                                            VER CATÁLOGO
                                        </button>
                                    </Tooltip>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <h4 className="font-nunito font-bold text-gray-600">No encontramos resultados</h4>
                                <p className="text-xs text-gray-400 mt-1">
                                    Probá buscando por otro término o rubro.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. SECCIÓN DE UBICACIÓN (MAPA) */}
                <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 mt-10">
                    <div className="text-center mb-6">
                        <h2 className="font-nunito font-extrabold text-2xl text-custom-azul-oscuro tracking-tight">
                            Nuestra Ubicación
                        </h2>
                        <p className="text-sm text-custom-gris-claro mt-2">
                            Te esperamos en nuestra sede central de Berisso.
                        </p>
                        <div className="h-1 w-16 bg-custom-celeste mx-auto mt-2 rounded-full" />
                    </div>
                    
                    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm aspect-video sm:aspect-auto sm:h-[400px]">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6546.912837233276!2d-57.8910297!3d-34.8698835!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e435f9b7efcb%3A0xa325f7c395690ce8!2sCentro%20de%20Formaci%C3%B3n%20Laboral%20N%C2%B0404%20Berisso!5e0!3m2!1ses-419!2sar!4v1785799295092!5m2!1ses-419!2sar" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="Mapa de ubicación del CFL 404 Berisso"
                        ></iframe>
                    </div>
                </section>
            </div>

            {/* MODAL DETALLE / BOTTOM SHEET */}
            {selectedComercio && (
                <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                        onClick={handleCloseModal}
                    />

                    {/* Modal Content */}
                    <div 
                        className="relative w-full max-h-[85vh] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl p-6 border border-gray-100 flex flex-col md:max-w-md md:max-h-[90vh] transition-all duration-300 transform translate-y-0 scale-100 overflow-y-auto animate-slide-up md:animate-scale-in"
                    >
                        {/* Close button */}
                        <button 
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-90 transition-all z-10 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Logo & Category */}
                        <div className="flex items-center gap-4 mt-2 mb-6">
                            <div className="w-14 h-14 bg-custom-azul-oscuro text-white font-nunito font-black text-lg flex items-center justify-center rounded-2xl shadow-md border border-white/20">
                                {getInitials(selectedComercio.nombre)}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-nunito font-extrabold text-xl text-custom-gris-oscuro pr-8 leading-tight">
                                    {selectedComercio.nombre}
                                </h3>
                                <span className="text-xs font-bold text-custom-celeste uppercase tracking-wider mt-0.5">
                                    {selectedComercio.rubro}
                                </span>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-2 text-custom-gris-claro text-sm mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <MapPin className="w-4 h-4 text-custom-celeste flex-shrink-0" />
                            <span className="font-medium">{selectedComercio.direccion}, Berisso</span>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h4 className="font-nunito font-bold text-sm text-custom-gris-oscuro uppercase tracking-wider mb-2">
                                Sobre el Comercio
                            </h4>
                            <p className="text-sm text-custom-gris-claro leading-relaxed font-light">
                                {selectedComercio.descripcion}
                            </p>
                        </div>

                        {/* Discount Coupon Box */}
                        <div className="mb-6 p-5 bg-custom-amarillo/10 border-2 border-dashed border-custom-amarillo/50 rounded-2xl text-center relative overflow-hidden">
                            <div className="absolute -left-3 -top-3 w-6 h-6 bg-white rounded-full border border-dashed border-custom-amarillo/30" />
                            <div className="absolute -right-3 -top-3 w-6 h-6 bg-white rounded-full border border-dashed border-custom-amarillo/30" />
                            <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-white rounded-full border border-dashed border-custom-amarillo/30" />
                            <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-white rounded-full border border-dashed border-custom-amarillo/30" />

                            <span className="text-xs font-black text-custom-azul-oscuro uppercase tracking-widest block mb-1">
                                Beneficio Exclusivo CFL 404
                            </span>
                            <span className="font-nunito font-black text-4xl text-custom-azul-oscuro tracking-tight block my-2">
                                {selectedComercio.descuento}
                            </span>
                            <p className="text-xs text-custom-gris-oscuro font-medium leading-relaxed max-w-[90%] mx-auto mt-2">
                                {selectedComercio.descuentoDetalle}
                            </p>
                        </div>

                        {/* Catalog / Products */}
                        <div className="mb-6 flex-grow">
                            <h4 className="font-nunito font-bold text-sm text-custom-gris-oscuro uppercase tracking-wider mb-3">
                                Líneas del Catálogo
                            </h4>
                            <ul className="flex flex-col gap-2">
                                {selectedComercio.catalogo.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-sm text-custom-gris-claro">
                                        <div className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-custom-celeste/10 flex items-center justify-center text-custom-celeste">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="font-light">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* WhatsApp Contact CTA */}
                        <Tooltip text="Abre WhatsApp para contactar al comercio">
                            <button
                                onClick={() => handleWhatsAppClick(selectedComercio)}
                                className="w-full bg-[#25D366] text-white font-nunito font-extrabold text-base py-3.5 px-4 rounded-xl hover:bg-[#20ba59] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Phone className="w-5 h-5 fill-current" />
                                Contactar por WhatsApp
                            </button>
                        </Tooltip>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Institucional
