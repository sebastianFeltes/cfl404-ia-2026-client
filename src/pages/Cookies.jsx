function Cookies() {
    const sections = [
        { id: 'que-son', label: '¿Qué son las cookies?' },
        { id: 'tipos', label: 'Tipos de cookies que usamos' },
        { id: 'terceros', label: 'Cookies de terceros' },
        { id: 'gestion', label: 'Cómo gestionar las cookies' },
        { id: 'contacto', label: 'Contacto' },
    ]

    return (
        <div className="flex-grow bg-gray-50 pb-16 font-roboto">
            {/* Hero / Banner Superior */}
            <div className="bg-gradient-to-r from-custom-azul-oscuro via-[#1d74ad] to-custom-celeste text-white py-16 px-4 text-center flex flex-col items-center justify-center">
                <div className="max-w-4xl mx-auto">
                    <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in">
                        Conocé cómo utilizamos las cookies en nuestro sitio web y de qué manera podés gestionarlas según tus preferencias.
                    </p>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="max-w-4xl mx-auto px-4 -mt-6">

                {/* Card Principal */}
                <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 mb-10">

                    {/* Encabezado + Fecha */}
                    <div className="text-center mb-8">
                        <h2 className="font-nunito font-extrabold text-2xl sm:text-3xl text-custom-azul-oscuro tracking-tight">
                            Política de Cookies
                        </h2>
                        <div className="h-1 w-16 bg-custom-celeste mx-auto mt-2 rounded-full" />
                        <p className="text-xs text-custom-gris-claro mt-3">
                            Última actualización: 19 de agosto de 2026
                        </p>
                    </div>

                    {/* Índice de Navegación */}
                    <nav className="mb-10 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <h3 className="font-nunito font-bold text-sm text-custom-gris-oscuro uppercase tracking-wider mb-3">
                            Contenido
                        </h3>
                        <ol className="flex flex-col gap-2">
                            {sections.map((section, index) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className="flex items-center gap-2.5 text-sm text-custom-azul-oscuro hover:text-custom-celeste transition-colors font-medium group"
                                    >
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-custom-celeste/10 text-custom-celeste text-xs flex items-center justify-center font-bold group-hover:bg-custom-celeste group-hover:text-white transition-all">
                                            {index + 1}
                                        </span>
                                        {section.label}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    {/* Sección 1 */}
                    <div id="que-son" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            1. ¿Qué son las cookies?
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (computadora, tablet o celular) cuando los visitás. Sirven para que el sitio recuerde información sobre tu visita, como tus preferencias de idioma u otras configuraciones.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            En el Centro de Formación Laboral N.º 404 de Berisso utilizamos cookies para mejorar la experiencia de navegación de nuestros usuarios, asegurar el correcto funcionamiento del sitio y entender mejor cómo se utiliza nuestra plataforma.
                        </p>
                    </div>

                    {/* Sección 2 */}
                    <div id="tipos" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            2. Tipos de cookies que usamos
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            <strong className="text-custom-gris-oscuro">Cookies esenciales:</strong> Son necesarias para que el sitio web funcione correctamente. Sin ellas, algunos servicios no estarían disponibles. Estas cookies no recopilan información personal identificable.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            <strong className="text-custom-gris-oscuro">Cookies de sesión:</strong> Se crean temporalmente en tu dispositivo mientras navegás por el sitio y se eliminan automáticamente cuando cerrás el navegador. Se utilizan para mantener tu sesión activa dentro de la plataforma.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            <strong className="text-custom-gris-oscuro">Cookies de rendimiento:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio recopilando información de forma anónima. Esto nos permite mejorar el funcionamiento del sitio y la experiencia general del usuario.
                        </p>
                    </div>

                    {/* Sección 3 */}
                    <div id="terceros" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            3. Cookies de terceros
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            Nuestro sitio puede incluir contenido o funcionalidades proporcionadas por terceros, como mapas embebidos de Google Maps o botones de redes sociales. Estos servicios pueden instalar sus propias cookies en tu dispositivo.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            No tenemos control sobre las cookies de terceros. Te recomendamos revisar las políticas de privacidad de cada servicio para obtener más información sobre cómo gestionan tus datos. El uso de dichos servicios externos está sujeto a sus propios términos y condiciones.
                        </p>
                    </div>

                    {/* Sección 4 */}
                    <div id="gestion" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            4. Cómo gestionar las cookies
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            Podés configurar tu navegador para rechazar todas las cookies o para que te avise cuando se envíe una. Sin embargo, si desactivás las cookies, es posible que algunas partes de nuestro sitio no funcionen correctamente.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            La mayoría de los navegadores te permiten gestionar tus preferencias de cookies a través de sus configuraciones. A continuación te indicamos cómo acceder a estas opciones en los navegadores más comunes:
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            <strong className="text-custom-gris-oscuro">Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios. <strong className="text-custom-gris-oscuro">Mozilla Firefox:</strong> Opciones → Privacidad y seguridad. <strong className="text-custom-gris-oscuro">Safari:</strong> Preferencias → Privacidad. Para dispositivos móviles, revisá la configuración del navegador instalado.
                        </p>
                    </div>

                    {/* Sección 5 */}
                    <div id="contacto" className="scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            5. Contacto
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            Si tenés preguntas sobre nuestra política de cookies o sobre el uso de tus datos personales, podés comunicarte con nosotros a través de los siguientes medios:
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            <strong className="text-custom-gris-oscuro">Correo electrónico:</strong> cfp404berisso@abc.gob.ar<br />
                            <strong className="text-custom-gris-oscuro">Teléfono:</strong> 0800-348-0111<br />
                            <strong className="text-custom-gris-oscuro">Dirección:</strong> Calle La Portada N.º 4120 (Acceso 4 al Puerto), Berisso, Buenos Aires, Argentina.
                        </p>
                    </div>

                </section>
            </div>
        </div>
    )
}

export default Cookies
