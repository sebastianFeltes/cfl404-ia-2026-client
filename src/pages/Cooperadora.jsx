import { useState, useCallback, useEffect } from 'react'
import { Copy, Check, Info, Landmark, ChevronRight } from 'lucide-react'
import Tooltip from '../components/Tooltip'
import { GET } from '../services/api'

// ─── Componente Toast ─────────────────────────────────────────────────────────
function Toast({ visible, message, ok }) {
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
            <Check className={`w-4 h-4 flex-shrink-0 ${ok ? 'text-custom-celeste' : 'text-red-300'}`} />
            {message}
        </div>
    )
}

async function copyText(value) {
    const text = String(value ?? '').trim()
    if (!text) throw new Error('No hay un dato para copiar')
    if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return
    }
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.appendChild(area)
    area.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(area)
    if (!copied) throw new Error('No se pudo copiar')
}

// ─── Fila de Dato Bancario Copiable ──────────────────────────────────────────
function CopyRow({ label, value, onCopy, onError }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(async () => {
        try {
            await copyText(value)
            setCopied(true)
            onCopy()
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            setCopied(false)
            onError(error.message || 'No se pudo copiar')
        }
    }, [value, onCopy, onError])

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
    const [toast, setToast] = useState({ visible: false, message: '', ok: true })
    const [toastTimer, setToastTimer] = useState(null)
    const [bank, setBank] = useState(null)
    const [monthlyAmount, setMonthlyAmount] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        GET('/api/mobile/cooperadora-publica')
            .then((data) => {
                setBank(data.bank || null)
                setMonthlyAmount(data.monthlyAmount ?? null)
            })
            .catch((err) => setError(err.message || 'No se pudieron cargar los datos bancarios'))
    }, [])

    const showToast = useCallback((message, ok) => {
        if (toastTimer) clearTimeout(toastTimer)
        setToast({ visible: true, message, ok })
        const timer = setTimeout(() => setToast((current) => ({ ...current, visible: false })), 2000)
        setToastTimer(timer)
    }, [toastTimer])

    const handleCopy = useCallback(() => {
        showToast('¡Copiado al portapapeles!', true)
    }, [showToast])

    const handleCopyError = useCallback((message) => {
        showToast(message, false)
    }, [showToast])

    const handleWhatsApp = () => {
        const texto = encodeURIComponent(bank?.whatsappMessage || '')
        window.open(`https://wa.me/${bank?.whatsappNumber || ''}?text=${texto}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="flex-grow bg-gray-50 pb-16 font-roboto">

            {/* ── Banner Superior ────────────────────────────────────────── */}
            <div className="bg-custom-azul-oscuro text-white py-10 px-4 text-center">
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
                            {bank?.banco || '—'}
                        </span>
                    </div>

                    {/* Filas copiables */}
                    <div className="flex flex-col">
                        <CopyRow label="ALIAS" value={bank?.alias || ''} onCopy={handleCopy} onError={handleCopyError} />
                        <CopyRow label="CBU"   value={bank?.cbu || ''}   onCopy={handleCopy} onError={handleCopyError} />
                        <CopyRow label="CUIT" value={bank?.cuit || ''} onCopy={handleCopy} onError={handleCopyError} />
                        {monthlyAmount != null && (
                            <p className="pt-3 text-sm text-custom-gris-claro">Cuota sugerida: ${Number(monthlyAmount).toLocaleString('es-AR')}</p>
                        )}
                        {error && <p className="pt-3 text-sm text-red-600">{error}</p>}
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
            </div>

            {/* ── Toast Global ──────────────────────────────────────────── */}
            <Toast visible={toast.visible} message={toast.message} ok={toast.ok} />
        </div>
    )
}

export default Cooperadora
