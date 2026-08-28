function TerminosCondiciones() {
    const sections = [
        { id: 'aceptacion', label: 'Aceptación de los términos' },
        { id: 'uso-sitio', label: 'Uso del sitio' },
        { id: 'propiedad-intelectual', label: 'Propiedad intelectual' },
        { id: 'limitacion', label: 'Limitación de responsabilidad' },
        { id: 'modificaciones', label: 'Modificaciones' },
    ]

    return (
        <div className="flex-grow bg-gray-50 pb-16 font-roboto">
            {/* Hero / Banner Superior */}
            <div className="bg-gradient-to-r from-custom-azul-oscuro via-[#1d74ad] to-custom-celeste text-white py-16 px-4 text-center flex flex-col items-center justify-center">
                <div className="max-w-4xl mx-auto">
                    <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in">
                        Leé atentamente los términos y condiciones que regulan el uso de nuestro sitio web y los servicios que ofrece el CFL 404.
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
                            Términos y Condiciones
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
                    <div id="aceptacion" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            1. Aceptación de los términos
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            Al acceder y utilizar el sitio web del Centro de Formación Laboral N.º 404 (CFL 404), aceptás cumplir con los presentes Términos y Condiciones de uso. Si no estás de acuerdo con alguno de estos términos, te pedimos que te abstengas de utilizar nuestros servicios digitales.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            Estos términos son aplicables a todos los usuarios del sitio, ya sean alumnos, docentes, personal administrativo o visitantes. El CFL 404 se reserva el derecho de actualizar estos términos en cualquier momento, siendo responsabilidad del usuario revisarlos periódicamente.
                        </p>
                    </div>

                    {/* Sección 2 */}
                    <div id="uso-sitio" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            2. Uso del sitio
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            El acceso a este sitio web es de carácter público e institucional. Los usuarios se comprometen a utilizar el sitio y sus contenidos de forma lícita, sin incurrir en actividades que puedan dañar, inutilizar o deteriorar el sitio o impedir su normal uso por parte de otros usuarios.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            Queda prohibido el uso del sitio para fines ilícitos, fraudulentos o contrarios a los presentes términos. También se prohíbe el acceso no autorizado a sistemas informáticos, la distribución de contenido malicioso y cualquier acción que comprometa la seguridad o integridad de la plataforma.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            El uso del panel administrativo está restringido exclusivamente al personal autorizado del CFL 404. El acceso mediante credenciales de otro usuario, o el intento de obtener acceso no autorizado, constituye una violación grave de estos términos y puede derivar en acciones legales.
                        </p>
                    </div>

                    {/* Sección 3 */}
                    <div id="propiedad-intelectual" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            3. Propiedad intelectual
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            Todos los contenidos disponibles en este sitio web, incluyendo textos, imágenes, logotipos, íconos, diseño gráfico y código fuente, son propiedad del CFL 404 o de sus respectivos autores y están protegidos por las leyes de propiedad intelectual vigentes en la República Argentina.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            Queda expresamente prohibida la reproducción, distribución, modificación, comunicación pública o cualquier otro uso de los contenidos del sitio sin la autorización previa y por escrito del CFL 404. El uso de los contenidos con fines educativos o institucionales podrá ser autorizado mediante solicitud formal a la institución.
                        </p>
                    </div>

                    {/* Sección 4 */}
                    <div id="limitacion" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            4. Limitación de responsabilidad
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            El CFL 404 no garantiza la disponibilidad continua del sitio ni la ausencia de errores en los contenidos publicados. La información disponible en el sitio tiene carácter orientativo y puede estar sujeta a cambios sin previo aviso.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            La institución no se responsabiliza por los daños o perjuicios que puedan derivarse del acceso, uso o imposibilidad de uso del sitio, ni de los contenidos de sitios web de terceros que puedan estar enlazados desde nuestra plataforma. El acceso a enlaces externos es responsabilidad exclusiva del usuario.
                        </p>
                    </div>

                    {/* Sección 5 */}
                    <div id="modificaciones" className="scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            5. Modificaciones
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            El CFL 404 se reserva el derecho de modificar, actualizar o eliminar los presentes Términos y Condiciones en cualquier momento y sin previo aviso. Los cambios entrarán en vigor desde el momento de su publicación en el sitio web.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            Se recomienda a los usuarios revisar periódicamente este documento. El uso continuado del sitio web después de la publicación de cambios implica la aceptación de los nuevos términos. Para consultas o dudas respecto a los presentes términos, podés contactarnos en <strong className="text-custom-gris-oscuro">cfp404berisso@abc.gob.ar</strong>.
                        </p>
                    </div>

                </section>
            </div>
        </div>
    )
}

export default TerminosCondiciones
