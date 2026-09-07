import { useOutletContext } from 'react-router'
import { LayoutDashboard } from 'lucide-react'

export default function Dashboard() {
  const { user } = useOutletContext() || {}
  const firstName = user?.nombres?.trim() || 'bienvenido'

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-custom-azul-oscuro/10 text-custom-azul-oscuro flex items-center justify-center">
          <LayoutDashboard size={20} strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 font-roboto">Dashboard</h1>
      </div>
      <p className="text-sm text-slate-500">
        Hola, {firstName}. El resumen operativo del centro se está preparando.
      </p>
    </div>
  )
}
