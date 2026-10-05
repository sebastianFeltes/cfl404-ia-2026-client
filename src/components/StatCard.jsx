import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import Tooltip from './Tooltip'

/**
 * StatCard — tarjeta de KPI numérico con soporte para Light y Dark Mode.
 */
function StatCard({ 
  title, 
  value, 
  icon: IconComponent, 
  trend, 
  trendType = 'neutral', 
  colorClass = 'border-custom-azul-oscuro',
  iconColorClass = 'text-custom-azul-oscuro bg-custom-azul-oscuro/10',
  description,
  tooltip
}) {
  const card = (
    <div 
      className={`bg-white dark:bg-slate-900 rounded-xl shadow-xs border-l-4 ${colorClass} border-y border-r border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default w-full h-full min-h-[140px]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <p 
            className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wide font-roboto truncate"
            title={title}
          >
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-custom-gris-oscuro dark:text-slate-100 font-nunito tracking-tight truncate">
            {value}
          </p>
        </div>
        {IconComponent && (
          <div className={`p-2.5 rounded-lg shrink-0 ${iconColorClass}`}>
            <IconComponent className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Trend indicators */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center text-xs gap-1.5 min-w-0 overflow-hidden">
        {trendType === 'up' && (
          <span className="inline-flex items-center gap-0.5 font-bold text-green-600 bg-green-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap">
            <ArrowUpRight className="h-3 w-3 shrink-0" />
            {trend}
          </span>
        )}
        {trendType === 'down' && (
          <span className="inline-flex items-center gap-0.5 font-bold text-red-500 bg-red-50 dark:bg-red-950/60 dark:text-red-400 px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap">
            <ArrowDownRight className="h-3 w-3 shrink-0" />
            {trend}
          </span>
        )}
        {trendType === 'neutral' && (
          <span className="inline-flex items-center gap-0.5 font-bold text-custom-gris-claro dark:text-slate-400 bg-gray-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap">
            <Minus className="h-3 w-3 shrink-0" />
            {trend}
          </span>
        )}
        {description && (
          <span className="text-custom-gris-claro dark:text-slate-400 font-medium truncate min-w-0" title={description}>
            {description}
          </span>
        )}
      </div>
    </div>
  )

  return tooltip ? (
    <Tooltip text={tooltip} position="bottom" className="w-full h-full flex flex-col items-stretch">
      {card}
    </Tooltip>
  ) : card
}

export default StatCard
