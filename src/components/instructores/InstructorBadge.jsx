// Archivo: src/components/instructores/InstructorBadge.jsx
const badgeConfig = {
  activo: {
    label: "Activo",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30",
  },
  inactivo: {
    label: "Inactivo",
    classes: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-500/30",
  },
  licencia: {
    label: "Licencia",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-500/30",
  },
};

export default function InstructorBadge({ estado }) {
  const config = badgeConfig[estado] || badgeConfig.activo;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-nunito transition-colors ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
