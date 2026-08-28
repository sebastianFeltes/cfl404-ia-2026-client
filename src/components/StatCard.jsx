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
      className={`bg-white dark:bg-slate-900 rounded-xl shadow-xs border-l-4 ${colorClass} border-y border-r border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default w-full`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-custom-gris-claro dark:text-slate-400 uppercase tracking-wider font-roboto">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-custom-gris-oscuro dark:text-slate-100 font-nunito tracking-tight">
            {value}
          </p>
        </div>
        {IconComponent && (
          <div className={`p-2.5 rounded-lg ${iconColorClass}`}>
            <IconComponent className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Trend indicators */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center text-xs gap-1.5">
        {trendType === 'up' && (
          <span className="flex items-center gap-0.5 font-bold text-green-600 bg-green-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </span>
        )}
        {trendType === 'down' && (
          <span className="flex items-center gap-0.5 font-bold text-red-500 bg-red-50 dark:bg-red-950/60 dark:text-red-400 px-1.5 py-0.5 rounded-md">
            <ArrowDownRight className="h-3 w-3" />
            {trend}
          </span>
        )}
        {trendType === 'neutral' && (
          <span className="flex items-center gap-0.5 font-bold text-custom-gris-claro dark:text-slate-400 bg-gray-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
            <Minus className="h-3 w-3" />
            {trend}
          </span>
        )}
        <span className="text-custom-gris-claro dark:text-slate-400 font-medium">{description}</span>
      </div>
    </div>
  )

  return tooltip ? (
    <Tooltip text={tooltip} position="bottom">
      {card}
    </Tooltip>
  ) : card
}

export default StatCard
