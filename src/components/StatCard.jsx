import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import Tooltip from './Tooltip'

/**
 * StatCard — tarjeta de KPI numérico.
 * Recibe un `tooltip` opcional para mostrar contexto adicional al hacer hover.
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
      className={`bg-white rounded-xl shadow-xs border-l-4 ${colorClass} p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default w-full`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-custom-gris-claro uppercase tracking-wider font-roboto">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-custom-gris-oscuro font-nunito tracking-tight">
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
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs gap-1.5">
        {trendType === 'up' && (
          <span className="flex items-center gap-0.5 font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </span>
        )}
        {trendType === 'down' && (
          <span className="flex items-center gap-0.5 font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">
            <ArrowDownRight className="h-3 w-3" />
            {trend}
          </span>
        )}
        {trendType === 'neutral' && (
          <span className="flex items-center gap-0.5 font-bold text-custom-gris-claro bg-gray-50 px-1.5 py-0.5 rounded-md">
            <Minus className="h-3 w-3" />
            {trend}
          </span>
        )}
        <span className="text-custom-gris-claro font-medium">{description}</span>
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
