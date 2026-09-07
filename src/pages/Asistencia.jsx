import { ClipboardCheck } from 'lucide-react'

export default function Asistencia() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-custom-azul-oscuro/10 text-custom-azul-oscuro flex items-center justify-center">
          <ClipboardCheck size={20} strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 font-roboto">Asistencia</h1>
      </div>
      <p className="text-sm text-slate-500">
        El registro y seguimiento de asistencia estará disponible en esta sección.
      </p>
    </div>
  )
}
