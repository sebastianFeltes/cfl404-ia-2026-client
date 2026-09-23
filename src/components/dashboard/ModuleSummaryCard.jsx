import React from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

export default function ModuleSummaryCard({
  title,
  subtitle,
  icon: Icon,
  iconClass = 'text-custom-azul-oscuro bg-custom-azul-oscuro/10',
  linkTo,
  linkLabel = 'Ver módulo completo',
  badgeText,
  badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  children,
  className = '',
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between w-full h-full ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`p-2.5 rounded-xl shrink-0 ${iconClass}`}>
                <Icon size={20} strokeWidth={2} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-roboto">
                  {title}
                </h3>
                {badgeText && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${badgeColor}`}
                  >
                    {badgeText}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-nunito mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {linkTo && (
            <Link
              to={linkTo}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-custom-azul-oscuro dark:text-custom-celeste hover:underline hover:opacity-85 transition-opacity shrink-0 cursor-pointer"
            >
              <span>{linkLabel}</span>
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 font-nunito">{children}</div>
      </div>

      {/* Mobile-only bottom link */}
      {linkTo && (
        <div className="sm:hidden pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
          <Link
            to={linkTo}
            className="flex items-center justify-between text-xs font-bold text-custom-azul-oscuro dark:text-custom-celeste"
          >
            <span>{linkLabel}</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}
