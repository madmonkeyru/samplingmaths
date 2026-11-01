import React from 'react';
import { Calendar } from 'lucide-react';

interface ConvocatoriaBadgeProps {
  convocatoriaId?: string;
  className?: string;
}

export const ConvocatoriaBadge: React.FC<ConvocatoriaBadgeProps> = ({
  convocatoriaId = '2026-c2',
  className = '',
}) => {
  const formattedText = convocatoriaId === '2026-c1' ? 'Convocatoria 01-2026' : 'Convocatoria 02-2026';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 text-[11px] font-bold rounded-lg  shadow-2xs ${className}`}
      title={`Período oficial de evaluación: ${formattedText}`}
    >
      <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
      <span>{formattedText}</span>
    </span>
  );
};
