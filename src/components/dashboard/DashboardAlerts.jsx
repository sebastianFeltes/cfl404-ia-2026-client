import React from 'react'
import { Link } from 'react-router'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react'

export default function DashboardAlerts({ alerts = [] }) {
  if (!alerts || alerts.length === 0) return null

  const getAlertStyles = (type) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          border: 'border-amber-400 dark:border-amber-600',
          bg: 'bg-amber-50/80 dark:bg-amber-950/20',
          text: 'text-amber-900 dark:text-amber-200',
          iconColor: 'text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
        }
      case 'danger':
        return {
          icon: AlertCircle,
          border: 'border-rose-400 dark:border-rose-600',
          bg: 'bg-rose-50/80 dark:bg-rose-950/20',
          text: 'text-rose-900 dark:text-rose-200',
          iconColor: 'text-rose-600 dark:text-rose-400',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
        }
      case 'success':
        return {
          icon: CheckCircle2,
          border: 'border-emerald-400 dark:border-emerald-600',
          bg: 'bg-emerald-50/80 dark:bg-emerald-950/20',
          text: 'text-emerald-900 dark:text-emerald-200',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
        }
      case 'info':
      default:
        return {
          icon: Info,
          border: 'border-[#37A6DE]',
          bg: 'bg-sky-50/80 dark:bg-sky-950/20',
          text: 'text-slate-900 dark:text-slate-200',
          iconColor: 'text-[#166193] dark:text-[#37A6DE]',
          badge: 'bg-sky-100 text-[#166193] dark:bg-sky-900/50 dark:text-sky-300',
        }
    }
  }

  return (
    <div className="space-y-2.5 font-nunito">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-roboto">
          Avisos Operativos del Centro
        </h4>
        <span className="text-[11px] text-slate-400">Actualizado en tiempo real</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map((item, idx) => {
          const style = getAlertStyles(item.type)
          const Icon = style.icon

          return (
            <div
              key={idx}
              className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border-l-4 ${style.border} ${style.bg} border-y border-r border-slate-200/70 dark:border-slate-800/80 transition-all hover:shadow-xs`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <Icon size={18} className={`shrink-0 mt-0.5 ${style.iconColor}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold font-roboto text-slate-900 dark:text-slate-100">
                      {item.title}
                    </span>
                    {item.tag && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${style.badge}`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    {item.message}
                  </p>
                </div>
              </div>

              {item.linkTo && (
                <Link
                  to={item.linkTo}
                  className="shrink-0 text-xs font-bold text-custom-azul-oscuro dark:text-custom-celeste hover:underline flex items-center gap-0.5 mt-0.5"
                  title={item.linkText || 'Ir'}
                >
                  <span className="hidden sm:inline">{item.linkText || 'Ver'}</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
