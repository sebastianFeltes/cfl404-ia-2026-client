import { AlertCircle, CheckCircle2, Clock, X } from 'lucide-react'

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    panel: 'bg-emerald-950 text-emerald-50 border-emerald-400',
    iconClass: 'text-emerald-300',
    button: 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300',
  },
  warning: {
    icon: Clock,
    panel: 'bg-amber-950 text-amber-50 border-amber-400',
    iconClass: 'text-amber-300',
    button: 'bg-amber-400 text-amber-950 hover:bg-amber-300',
  },
  error: {
    icon: AlertCircle,
    panel: 'bg-rose-950 text-rose-50 border-rose-400',
    iconClass: 'text-rose-300',
    button: 'bg-rose-400 text-rose-950 hover:bg-rose-300',
  },
}

export default function EnrollmentAlert({ alert, onClose }) {
  if (!alert?.message) return null
  const variant = VARIANTS[alert.type] || VARIANTS.error
  const Icon = variant.icon

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="enrollment-alert-title"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${variant.panel}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <Icon className={`mt-0.5 h-6 w-6 shrink-0 ${variant.iconClass}`} />
          <div className="min-w-0 flex-1">
            <h3 id="enrollment-alert-title" className="font-['Roboto_Flex'] text-base font-extrabold">
              {alert.title}
            </h3>
            <p className="mt-1 text-sm font-medium leading-relaxed">{alert.message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-white/70 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`mt-4 w-full cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold ${variant.button}`}
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
