import { useState, useCallback } from 'react'
import { Copy, Check, Info, Landmark, ChevronRight } from 'lucide-react'
import Tooltip from '../components/Tooltip'

// ─── Datos de la Cooperadora ─────────────────────────────────────────────────
const DATOS_BANCARIOS = {
    banco: 'Banco Provincia de Buenos Aires',
    alias: 'coop.cfl.404',
    cbu: '0140032801503305438550',
    cuit: '30-71753985-7',
}

const WHATSAPP_NUMERO = '5492213192360'
const WHATSAPP_MENSAJE =
    'Hola, me contacto para enviar el comprobante de transferencia para la Cooperadora del CFL 404.'

// ─── Componente Toast ─────────────────────────────────────────────────────────
function Toast({ visible }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-custom-gris-oscuro text-white text-sm font-nunito font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ${
                visible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <Check className="w-4 h-4 text-custom-celeste flex-shrink-0" />
            ¡Copiado al portapapeles!
        </div>
    )
}

// ─── Fila de Dato Bancario Copiable ──────────────────────────────────────────
function CopyRow({ label, value, onCopy }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            onCopy()
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // fallback silencioso
        }
    }, [value, onCopy])

    return (
        <div className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-custom-gris-claro uppercase tracking-widest mb-0.5">
                    {label}
                </span>
                <span className="font-nunito font-bold text-custom-azul-oscuro text-sm sm:text-base break-all leading-snug">
                    {value}
                </span>
            </div>
            <button
                onClick={handleCopy}
                aria-label={`Copiar ${label}`}
                className="flex-shrink-0 p-2.5 rounded-xl bg-custom-celeste/10 text-custom-celeste hover:bg-custom-celeste/20 active:scale-90 transition-all duration-150 cursor-pointer"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        </div>
    )
}

// ─── Página Principal Cooperadora ─────────────────────────────────────────────
function Cooperadora() {
    const [toastVisible, setToastVisible] = useState(false)
    const [toastTimer, setToastTimer] = useState(null)

    const handleCopy = useCallback(() => {
        if (toastTimer) clearTimeout(toastTimer)
        setToastVisible(true)
        const timer = setTimeout(() => setToastVisible(false), 2000)
        setToastTimer(timer)
    }, [toastTimer])

    const handleWhatsApp = () => {
        const texto = encodeURIComponent(WHATSAPP_MENSAJE)
        window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="flex-grow bg-gray-50 pb-16 font-roboto">

            {/* ── Banner Superior ────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-custom-azul-oscuro via-[#1d74ad] to-custom-celeste text-white py-10 px-4 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
                    <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in">
                        Apoyá la educación pública y gratuita de Berisso colaborando con nuestra Asociación Cooperadora.
                    </p>
                </div>
            </div>

            {/* ── Contenedor Principal ───────────────────────────────────── */}
            <div className="max-w-2xl mx-auto px-4 -mt-6 flex flex-col gap-6">

                {/* ── 1. Información de la Cooperadora ─────────────────── */}
                <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-11 h-11 bg-custom-celeste/10 rounded-2xl flex items-center justify-center">
                            <Info className="w-5 h-5 text-custom-celeste" />
                        </div>
                        <div>
                            <h2 className="font-nunito font-extrabold text-xl text-custom-azul-oscuro leading-tight">
                                Información de la Cooperadora
                            </h2>
                            <div className="h-0.5 w-10 bg-custom-celeste rounded-full mt-1" />
                        </div>
                    </div>
                    <p className="text-sm sm:text-base text-custom-gris-claro leading-relaxed">
                        ¿Sabías que nuestra Institución cuenta con una Asociación Cooperadora? La misma se encuentra
                        reconocida oficialmente por la{' '}
                        <span className="font-semibold text-custom-gris-oscuro">
                            Dirección de Cooperación Escolar de la Provincia de Buenos Aires
                        </span>
                        .
                    </p>
                    <div className="mt-5 p-4 bg-custom-celeste/5 border border-custom-celeste/20 rounded-2xl">
                        <p className="text-xs sm:text-sm text-custom-gris-claro leading-relaxed">
                            Tu donación contribuye directamente al mantenimiento del edificio, la adquisición de
                            materiales y el bienestar de toda la comunidad educativa del CFL 404.
                        </p>
                    </div>
                </section>

                {/* ── 2. Datos Bancarios ────────────────────────────────── */}
                <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-shrink-0 w-11 h-11 bg-custom-celeste/10 rounded-2xl flex items-center justify-center">
                            <Landmark className="w-5 h-5 text-custom-celeste" />
                        </div>
                        <div>
                            <h2 className="font-nunito font-extrabold text-xl text-custom-azul-oscuro leading-tight">
                                Datos Bancarios para Donaciones
                            </h2>
                            <div className="h-0.5 w-10 bg-custom-celeste rounded-full mt-1" />
                        </div>
                    </div>

                    {/* Banco */}
                    <div className="inline-flex items-center gap-2 bg-custom-azul-oscuro/5 border border-custom-azul-oscuro/10 rounded-xl px-4 py-2 mb-5">
                        <span className="text-xs font-black text-custom-azul-oscuro uppercase tracking-widest">Banco</span>
                        <span className="font-nunito font-bold text-custom-azul-oscuro text-sm">
                            {DATOS_BANCARIOS.banco}
                        </span>
                    </div>

                    {/* Filas copiables */}
                    <div className="flex flex-col">
                        <CopyRow label="ALIAS" value={DATOS_BANCARIOS.alias} onCopy={handleCopy} />
                        <CopyRow label="CBU"   value={DATOS_BANCARIOS.cbu}   onCopy={handleCopy} />
                        {/* CUIT no es copiable */}
                        <div className="flex items-center gap-2 py-3">
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-custom-gris-claro uppercase tracking-widest mb-0.5">
                                    CUIT
                                </span>
                                <span className="font-nunito font-bold text-custom-gris-oscuro text-sm sm:text-base">
                                    {DATOS_BANCARIOS.cuit}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 3. Pasos Siguientes / CTA ─────────────────────────── */}
                <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-11 h-11 bg-custom-amarillo/20 rounded-2xl flex items-center justify-center">
                            <ChevronRight className="w-5 h-5 text-custom-amarillo" />
                        </div>
                        <div>
                            <h2 className="font-nunito font-extrabold text-xl text-custom-azul-oscuro leading-tight">
                                Pasos Siguientes
                            </h2>
                            <div className="h-0.5 w-10 bg-custom-amarillo rounded-full mt-1" />
                        </div>
                    </div>

                    <p className="text-sm sm:text-base text-custom-gris-claro leading-relaxed mb-6">
                        <span className="font-bold text-custom-gris-oscuro">IMPORTANTE:</span>{' '}
                        Por favor, luego de realizar la transferencia, enviá el comprobante mediante WhatsApp al
                        siguiente número para que podamos registrar tu donación.
                    </p>

                    {/* Botón WhatsApp */}
                    <div className="flex justify-center w-full">
                        <Tooltip text="Enviá tu comprobante al +54 9 221-319-2360" className="w-full sm:w-auto">
                            <button
                                id="btn-enviar-comprobante-whatsapp"
                                onClick={handleWhatsApp}
                                className="w-full sm:w-auto min-w-[260px] sm:px-8 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-nunito font-extrabold text-base py-4 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 flex-shrink-0 brightness-0 invert" />
                                Enviar Comprobante
                            </button>
                        </Tooltip>
                    </div>

                    <p className="text-center mt-5 font-nunito italic text-custom-gris-claro text-sm">
                        ¡Muchas gracias!!!
                    </p>
                </section>

                {/* ── Contacto Footer ───────────────────────────────────── */}
                <p className="text-center text-xs text-gray-400 font-nunito pb-2">
                    Contacto:{' '}
                    <a
                        href="mailto:cooperadora@cfl404.edu.ar"
                        className="text-custom-celeste hover:underline transition-colors"
                    >
                        cooperadora@cfl404.edu.ar
                    </a>{' '}
                    | © {new Date().getFullYear()} CFL 404
                </p>
            </div>

            {/* ── Toast Global ──────────────────────────────────────────── */}
            <Toast visible={toastVisible} />
        </div>
    )
}

export default Cooperadora
