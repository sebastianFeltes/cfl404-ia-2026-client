import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactSection({ onSendContactMessage }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Consulta General', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSendContactMessage) {
      onSendContactMessage(form);
    }
  };

  return (
    <section id="contacto" className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6 font-['Nunito']">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#37ACDE]">
                Atención al Estudiante & Consultas
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-['Roboto_Flex'] text-[#1D1E1C] mt-1">
                Contacto Institucional
              </h2>
              <p className="text-sm text-[#585856] mt-2 leading-relaxed">
                ¿Tenés dudas sobre inscripciones, equivalencias o requisitos de ingreso? Contactate directamente con la secretaría del centro.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#166193]/10 flex items-center justify-center text-[#166193] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#585856]">Sede Central</h4>
                  <p className="text-sm font-semibold text-[#1D1E1C]">Av. Colón 1234, Bahía Blanca</p>
                  <p className="text-xs text-gray-500">Buenos Aires, Argentina</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#166193]/10 flex items-center justify-center text-[#166193] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#585856]">Teléfono de Secretaría</h4>
                  <p className="text-sm font-semibold text-[#1D1E1C]">(0291) 455-6789</p>
                  <p className="text-xs text-gray-500">WhatsApp Oficial: +54 9 291 412-3456</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#166193]/10 flex items-center justify-center text-[#166193] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#585856]">Horarios de Atención</h4>
                  <p className="text-sm font-semibold text-[#1D1E1C]">Lunes a Viernes 08:00 a 21:00 hs</p>
                  <p className="text-xs text-gray-500">Atención presencial y telefónica</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 font-['Nunito']">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1D1E1C] font-['Roboto_Flex']">
                    ¡Mensaje Enviado con Éxito!
                  </h3>
                  <p className="text-sm text-[#585856] max-w-md mx-auto">
                    Gracias por comunicarte con el CFP 404. La secretaría académica responderá tu consulta a la brevedad en tu correo electrónico.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-[#166193] text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-[#1D1E1C] font-['Roboto_Flex'] mb-2">
                    Formulario de Contacto Directo
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#585856] mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#585856] mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="juan@ejemplo.com"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#585856] mb-1">
                      Motivo de Consulta
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193]"
                    >
                      <option value="Consulta General">Consulta sobre Inscripciones</option>
                      <option value="Requisitos">Requisitos de Titulación</option>
                      <option value="Empresas">Empresas & Convenios de Pasantías</option>
                      <option value="Docentes">Postulación Docente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#585856] mb-1">
                      Mensaje / Detalle *
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Escribí tu mensaje aquí..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#166193] hover:bg-[#124d77] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Consulta a Secretaría</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
