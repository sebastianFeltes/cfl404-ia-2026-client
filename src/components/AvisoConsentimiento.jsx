import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { X } from 'lucide-react'

const STORAGE_KEY = 'cfl404_cookies_consent'

/**
 * AvisoConsentimiento — Aviso de consentimiento fijo en la parte inferior de la pantalla.
 * - Se muestra solo si el usuario no ha tomado una decisión previa (guardada en localStorage).
 * - "Aceptar" guarda consent=true y oculta el aviso.
 * - "Rechazar" guarda consent=false y oculta el aviso.
 * - Animación slide-up al aparecer.
 *
 * Nota: el nombre evita las palabras "Cookie"/"Banner" en el archivo porque los
 * bloqueadores de anuncios cortan esas URLs (net::ERR_BLOCKED_BY_CLIENT).
 */
function AvisoConsentimiento() {
    const [visible, setVisible] = useState(false)
    const [hiding, setHiding] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            // Pequeño delay para que la animación de entrada se vea bien
            const timer = setTimeout(() => setVisible(true), 600)
            return () => clearTimeout(timer)
        }
    }, [])

    const dismiss = (accepted) => {
        setHiding(true)
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted, date: new Date().toISOString() }))
            setVisible(false)
            setHiding(false)
        }, 350)
    }

    if (!visible) return null

    return (
        <div
            role="dialog"
            aria-label="Aviso de cookies"
            aria-live="polite"
            className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-350 ease-in-out ${
                hiding ? 'translate-y-full' : 'translate-y-0'
            }`}
            style={{
                animation: !hiding ? 'slideUpBanner 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' : undefined,
            }}
        >
            {/* Contenido del aviso */}
            <div className="bg-custom-azul-oscuro px-4 py-4 sm:py-3 shadow-2xl">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">

                    {/* Texto */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white/90 text-sm leading-relaxed font-roboto">
                            Usamos cookies para mejorar tu experiencia en el sitio del CFL 404.
                            Consultá nuestra{' '}
                            <Link
                                to="/cookies"
                                className="text-custom-celeste underline underline-offset-2 hover:text-white transition-colors font-medium"
                            >
                                Política de Cookies
                            </Link>
                            {' '}para más información.
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto flex-shrink-0">
                        <button
                            onClick={() => dismiss(false)}
                            className="flex-1 sm:flex-none font-nunito font-bold text-sm px-4 py-2.5 rounded-xl border border-white/25 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/40 active:scale-[0.97] transition-all cursor-pointer"
                        >
                            Rechazar cookies
                        </button>
                        <button
                            onClick={() => dismiss(true)}
                            className="flex-1 sm:flex-none font-nunito font-extrabold text-sm px-4 py-2.5 rounded-xl bg-custom-amarillo text-custom-gris-oscuro hover:bg-yellow-300 active:scale-[0.97] transition-all shadow-md cursor-pointer"
                        >
                            Aceptar cookies
                        </button>
                    </div>

                    {/* Botón cerrar — mobile */}
                    <button
                        onClick={() => dismiss(false)}
                        aria-label="Cerrar aviso de cookies"
                        className="absolute top-3 right-3 sm:hidden p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Keyframe definido inline para mayor compatibilidad */}
            <style>{`
                @keyframes slideUpBanner {
                    from { transform: translateY(100%); }
                    to   { transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default AvisoConsentimiento
