// Archivo: src/components/StudentAvatar.jsx
import React, { useState } from "react";

const estadoRing = {
  1: "ring-2 ring-emerald-500 dark:ring-emerald-400",
  activo: "ring-2 ring-emerald-500 dark:ring-emerald-400",
  presente: "ring-2 ring-[#37A6DE] dark:ring-[#37A6DE]",
  aspirante: "ring-2 ring-indigo-500 dark:ring-indigo-400",
  2: "ring-2 ring-slate-400 dark:ring-slate-500",
  inactivo: "ring-2 ring-slate-400 dark:ring-slate-500",
  3: "ring-2 ring-amber-500 dark:ring-amber-400",
  suspendido: "ring-2 ring-amber-500 dark:ring-amber-400",
};

const estadoDot = {
  1: "bg-emerald-500",
  activo: "bg-emerald-500",
  presente: "bg-[#37A6DE]",
  aspirante: "bg-indigo-500",
  2: "bg-slate-400",
  inactivo: "bg-slate-400",
  3: "bg-amber-500",
  suspendido: "bg-amber-500",
};

const estadoLabels = {
  1: "Activo",
  activo: "Activo",
  presente: "Presente",
  aspirante: "Aspirante",
  2: "Inactivo",
  inactivo: "Inactivo",
  3: "Suspendido",
  suspendido: "Suspendido",
};

export default function StudentAvatar({ 
  src, 
  nombre = "", 
  apellido = "", 
  estado = 1, 
  size = "md",
  showStatusDot = true 
}) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  const dotSizes = {
    sm: "w-2 h-2 bottom-0 right-0",
    md: "w-2.5 h-2.5 bottom-0 right-0 ring-2 ring-white dark:ring-slate-900",
    lg: "w-3.5 h-3.5 bottom-0.5 right-0.5 ring-2 ring-white dark:ring-slate-900",
    xl: "w-4.5 h-4.5 bottom-1 right-1 ring-3 ring-white dark:ring-slate-900",
  };

  const sizeClass = sizes[size] ?? sizes.md;
  const dotSizeClass = dotSizes[size] ?? dotSizes.md;

  const firstInitial = nombre ? nombre.charAt(0).toUpperCase() : "";
  const lastInitial = apellido ? apellido.charAt(0).toUpperCase() : "";
  const initials = `${firstInitial}${lastInitial}` || "?";

  const ringClass = estado ? (estadoRing[estado] ?? estadoRing[String(estado).toLowerCase()] ?? "") : "";
  const dotClass = estado ? (estadoDot[estado] ?? estadoDot[String(estado).toLowerCase()] ?? "bg-slate-400") : "";
  const estadoLabel = estado ? (estadoLabels[estado] ?? estadoLabels[String(estado).toLowerCase()] ?? "Sin estado") : "Sin estado";

  return (
    <div className="relative inline-block flex-shrink-0" title={`Estado del alumno: ${estadoLabel}`}>
      {error || !src ? (
        <div
          className={`${sizeClass} rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 transition-all ${ringClass}`}
        >
          <span className="text-slate-600 dark:text-slate-300 font-bold font-nunito">{initials}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={`${nombre} ${apellido}`}
          onError={() => setError(true)}
          className={`${sizeClass} rounded-lg object-cover flex-shrink-0 transition-all ${ringClass}`}
        />
      )}

      {showStatusDot && (
        <span 
          className={`absolute ${dotSizeClass} rounded-full ${dotClass} transition-all`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
