import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: '¿Los cursos son completamente gratuitos?',
    answer:
      'Sí, todos nuestros cursos son 100% gratuitos. El CFL 404 es una institución pública que ofrece formación laboral sin ningún costo para los participantes. Solo es necesario presentar la documentación requerida al momento de la inscripción.',
  },
  {
    id: 2,
    question: '¿Cómo me inscribo en un curso?',
    answer:
      'Podés inscribirte de forma presencial en nuestra sede o a través del formulario disponible en nuestra sección de cursos. Una vez enviada la solicitud, recibirás una confirmación por correo electrónico con los próximos pasos y la documentación necesaria.',
  },
  {
    id: 3,
    question: '¿Los cursos tienen certificado al finalizar?',
    answer:
      'Sí. Al completar satisfactoriamente un curso, recibís un certificado oficial avalado por el Ministerio de Trabajo, con validez nacional. El certificado acredita los conocimientos y habilidades adquiridos durante la formación.',
  },
  {
    id: 4,
    question: '¿Puedo anotarme en más de un curso a la vez?',
    answer:
      'Depende de la disponibilidad de horarios y cupos en cada curso. En muchos casos es posible combinar cursadas que no se superpongan en días y horarios. Te recomendamos consultar con nuestro equipo para encontrar la combinación que mejor se adapte a tu situación.',
  },
  {
    id: 5,
    question: '¿Los cursos son presenciales, virtuales o mixtos?',
    answer:
      'Ofrecemos cursos en las tres modalidades según la temática y la demanda. Algunos talleres prácticos requieren asistencia presencial, mientras que otros se dictan de forma virtual o en formato mixto. En la descripción de cada curso encontrarás la modalidad específica.',
  },
]

export default function FAQ() {
  const [openIds, setOpenIds] = useState([])

  const toggle = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <section
      id="faq"
      className="relative py-24 md:py-32 bg-white overflow-hidden"
      aria-label="Preguntas frecuentes"
    >
      {/* Partícula decorativa */}
      <div
        className="absolute -top-8 right-[10%] w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(22,97,147,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-0 left-[5%] w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(253,234,20,0.08) 0%, transparent 70%)',
          filter: 'blur(32px)',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{
              fontFamily: '"Nunito", sans-serif',
              color: '#166193',
              background: 'rgba(22,97,147,0.08)',
              border: '1px solid rgba(22,97,147,0.15)',
            }}
          >
            Preguntas frecuentes
          </span>
          <h2
            className="text-[#1D1E1C] leading-tight"
            style={{
              fontFamily: '"Roboto Flex", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              letterSpacing: '-0.02em',
            }}
          >
            Todo lo que necesitás{' '}
            <span style={{ color: '#166193' }}>saber</span>
          </h2>
          <p
            className="mt-3 text-[#585856] text-base max-w-xl mx-auto"
            style={{ fontFamily: '"Nunito", sans-serif' }}
          >
            Respondemos las dudas más comunes sobre nuestros cursos y el proceso de inscripción.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIds.includes(faq.id)
            return (
              <div
                key={faq.id}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  border: isOpen
                    ? '1.5px solid rgba(22,97,147,0.35)'
                    : '1.5px solid rgba(0,0,0,0.08)',
                  boxShadow: isOpen
                    ? '0 8px 32px rgba(22,97,147,0.10)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  background: isOpen ? 'rgba(22,97,147,0.02)' : '#ffffff',
                }}
              >
                {/* Question button */}
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group cursor-pointer"
                  aria-expanded={isOpen}
                  id={`faq-btn-${faq.id}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Número */}
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={{
                        fontFamily: '"Nunito", sans-serif',
                        background: isOpen ? '#166193' : 'rgba(22,97,147,0.10)',
                        color: isOpen ? '#fff' : '#166193',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      className="font-semibold text-[0.95rem] md:text-base transition-colors duration-200"
                      style={{
                        fontFamily: '"Nunito", sans-serif',
                        color: isOpen ? '#166193' : '#1D1E1C',
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Chevron */}
                  <span
                    className="flex-shrink-0 transition-transform duration-300"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: isOpen ? '#166193' : '#585856',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                {/* Answer — animated */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div
                      className="px-6 pb-5 pt-0"
                      style={{ paddingLeft: 'calc(1.5rem + 1.75rem + 1rem)' }}
                    >
                      <p
                        className="text-[#585856] text-sm md:text-[0.95rem] leading-relaxed"
                        style={{ fontFamily: '"Nunito", sans-serif' }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA inferior */}
        <div className="mt-12 text-center">
          <p
            className="text-[#585856] text-sm"
            style={{ fontFamily: '"Nunito", sans-serif' }}
          >
            ¿Tenés otra consulta?{' '}
            <a
              href="#contacto"
              className="font-bold underline underline-offset-2 transition-colors duration-200 hover:text-[#1e7ab8]"
              style={{ color: '#166193' }}
            >
              Contactanos
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
