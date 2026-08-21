function Privacidad() {
    const sections = [
        { id: 'introduccion', label: 'Introducción' },
        { id: 'datos-recopilamos', label: 'Datos que recopilamos' },
        { id: 'uso-informacion', label: 'Uso de la información' },
        { id: 'seguridad', label: 'Seguridad de los datos' },
        { id: 'derechos', label: 'Derechos del usuario' },
    ]

    return (
        <div className="flex-grow bg-gray-50 pb-16 font-roboto">
            {/* Hero / Banner Superior */}
            <div className="bg-gradient-to-r from-custom-azul-oscuro via-[#1d74ad] to-custom-celeste text-white py-16 px-4 text-center flex flex-col items-center justify-center">
                <div className="max-w-4xl mx-auto">
                    <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in">
                        Tu privacidad es importante para nosotros. Aquí encontrás toda la información sobre cómo recopilamos, usamos y protegemos tus datos personales.
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
                            Política de Privacidad
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
                    <div id="introduccion" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            1. Introducción
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            El Centro de Formación Laboral N.º 404 (CFL 404), con sede en la ciudad de Berisso, provincia de Buenos Aires, Argentina, se compromete a proteger la privacidad y los datos personales de todos los usuarios que interactúan con su sitio web y plataforma institucional.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            La presente Política de Privacidad describe qué información recopilamos, cómo la utilizamos y las medidas que tomamos para protegerla. Al utilizar nuestros servicios digitales, aceptás los términos descritos en este documento, de conformidad con la Ley N.º 25.326 de Protección de Datos Personales de la República Argentina.
                        </p>
                    </div>

                    {/* Sección 2 */}
                    <div id="datos-recopilamos" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            2. Datos que recopilamos
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            <strong className="text-custom-gris-oscuro">Datos de registro:</strong> Cuando un alumno o docente crea una cuenta en la plataforma, recopilamos nombre completo, DNI, dirección de correo electrónico y número de teléfono de contacto. Estos datos son necesarios para gestionar la relación institucional.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            <strong className="text-custom-gris-oscuro">Datos de navegación:</strong> Recopilamos de forma automática información técnica como la dirección IP, el tipo de navegador, el sistema operativo y las páginas visitadas dentro de nuestra plataforma. Esta información es utilizada únicamente con fines estadísticos y de mejora del servicio.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            <strong className="text-custom-gris-oscuro">Datos académicos:</strong> En el marco del registro y seguimiento de alumnos, podemos almacenar información referida a cursos inscriptos, asistencia y estado de cursada. Estos datos son de carácter estrictamente institucional.
                        </p>
                    </div>

                    {/* Sección 3 */}
                    <div id="uso-informacion" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            3. Uso de la información
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            La información recopilada es utilizada exclusivamente para los siguientes fines: gestión y administración institucional, comunicaciones relacionadas con el CFL 404 (inscripciones, novedades, etc.), mejora de la experiencia del usuario en la plataforma y cumplimiento de obligaciones legales.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            No compartimos, vendemos ni cedemos tus datos personales a terceros con fines comerciales. Podemos compartir información con organismos oficiales de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires cuando sea requerido por ley o normativa vigente.
                        </p>
                    </div>

                    {/* Sección 4 */}
                    <div id="seguridad" className="mb-8 scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            4. Seguridad de los datos
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos personales contra el acceso no autorizado, la divulgación, la alteración o la destrucción. Esto incluye el uso de protocolos de comunicación seguros (HTTPS) y el acceso restringido a los datos por parte del personal autorizado.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            Sin embargo, ningún sistema de transmisión de datos por Internet es completamente seguro. Si detectás alguna vulnerabilidad o uso indebido de tus datos, te pedimos que nos lo comuniques de inmediato a través de nuestros canales oficiales de contacto.
                        </p>
                    </div>

                    {/* Sección 5 */}
                    <div id="derechos" className="scroll-mt-24">
                        <h3 className="font-nunito font-bold text-lg text-custom-azul-oscuro mb-3 pb-2 border-b border-gray-100">
                            5. Derechos del usuario
                        </h3>
                        <p className="text-sm text-custom-gris-claro leading-relaxed mb-3">
                            De acuerdo con la Ley N.º 25.326 de Protección de Datos Personales, tenés derecho a: acceder a tus datos personales, rectificar datos incorrectos o desactualizados, solicitar la supresión de tus datos cuando ya no sean necesarios, y oponerte al tratamiento de tus datos en ciertos casos.
                        </p>
                        <p className="text-sm text-custom-gris-claro leading-relaxed">
                            Para ejercer cualquiera de estos derechos, podés contactarnos a través de nuestro correo electrónico oficial: <strong className="text-custom-gris-oscuro">cfp404berisso@abc.gob.ar</strong>. La Agencia de Acceso a la Información Pública actúa como órgano de control de la Ley N.º 25.326 y tiene la atribución de atender denuncias y reclamos relacionados con el tratamiento de datos personales.
                        </p>
                    </div>

                </section>
            </div>
        </div>
    )
}

export default Privacidad
