// Archivo: src/components/instructores/InstructorAvatar.jsx
import { useState } from "react";

const estadoRing = {
  activo: "ring-2 ring-emerald-500 dark:ring-emerald-400",
  licencia: "ring-2 ring-amber-500 dark:ring-amber-400",
  inactivo: "ring-2 ring-red-500 dark:ring-red-400",
};

export default function InstructorAvatar({ src, nombre, estado, size = "md" }) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  const sizeClass = sizes[size] ?? sizes.md;
  const initials = nombre ? nombre.charAt(0).toUpperCase() : "?";
  const ringClass = estado ? (estadoRing[estado] ?? "") : "";

  if (error || !src) {
    return (
      <div
        className={`${sizeClass} rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 transition-all ${ringClass}`}
      >
        <span className="text-slate-500 dark:text-slate-400 font-medium font-nunito">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={nombre}
      onError={() => setError(true)}
      className={`${sizeClass} rounded-lg object-cover flex-shrink-0 transition-all ${ringClass}`}
    />
  );
}
