import { useEffect, useState } from 'react'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { GET } from '../services/api'

const SOCIAL = [
  ['instagram', 'Instagram'],
  ['facebook', 'Facebook'],
  ['youtube', 'YouTube'],
  ['tiktok', 'TikTok'],
  ['twitterX', 'X'],
  ['whatsapp', 'WhatsApp'],
]

export default function Contactos() {
  const [contacto, setContacto] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    GET('/api/mobile/contacto-publico')
      .then(setContacto)
      .catch((err) => setError(err.message || 'No se pudo cargar el contacto'))
  }, [])

  if (error) {
    return <p className="p-12 text-center text-custom-gris-claro font-nunito">{error}</p>
  }
  if (!contacto) {
    return <p className="p-12 text-center text-custom-gris-claro font-nunito">Cargando contacto…</p>
  }

  const redes = SOCIAL.filter(([key]) => contacto.social?.[key])

  return (
    <div className="flex-grow bg-gray-50 pb-16 font-roboto">
      <div className="bg-custom-azul-oscuro text-white py-10 px-4 text-center">
        <h1 className="font-nunito font-extrabold text-3xl">{contacto.institutionName || 'CFL 404'}</h1>
        <p className="mt-2 text-white/80">{contacto.city}</p>
      </div>
      <div className="max-w-2xl mx-auto px-4 -mt-6 flex flex-col gap-4">
        <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 space-y-4">
          <p className="flex items-start gap-3 text-custom-gris-oscuro"><MapPin className="w-5 h-5 text-custom-celeste shrink-0" /> {contacto.address}</p>
          <p className="flex items-start gap-3 text-custom-gris-oscuro"><Clock className="w-5 h-5 text-custom-celeste shrink-0" /> {contacto.schedule}</p>
          <a className="flex items-start gap-3 text-custom-azul-oscuro font-semibold" href={contacto.phoneRaw || `tel:${contacto.phone}`}><Phone className="w-5 h-5 text-custom-celeste shrink-0" /> {contacto.phone}</a>
          <a className="flex items-start gap-3 text-custom-azul-oscuro font-semibold" href={`mailto:${contacto.email}`}><Mail className="w-5 h-5 text-custom-celeste shrink-0" /> {contacto.email}</a>
        </section>
        {redes.length > 0 && (
          <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <h2 className="font-nunito font-extrabold text-xl text-custom-azul-oscuro mb-4">Redes</h2>
            <div className="flex flex-wrap gap-3">
              {redes.map(([key, label]) => (
                <a key={key} href={contacto.social[key]} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-custom-celeste/10 text-custom-azul-oscuro font-semibold text-sm">
                  {label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
