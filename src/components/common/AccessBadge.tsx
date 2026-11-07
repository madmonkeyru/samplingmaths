import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { accessService } from '../../services/accessService';
import type { ProductCapability } from '../../services/capabilityModel';

export interface AccessBadgeProps {
  capability?: ProductCapability;
  isProOnly?: boolean;
  className?: string;
}

export const AccessBadge: React.FC<AccessBadgeProps> = ({
  capability,
  isProOnly,
  className = '',
}) => {
  const isAllowed = capability ? accessService.can(capability) : !isProOnly;
  const isGated = !isAllowed;

  if (isGated) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800 ${className}`}
        title="Requiere suscripción activa Plan Pro"
      >
        <Lock size={12} className="shrink-0" aria-hidden="true" />
        <span>PRO</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 ${className}`}
    >
      <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
      <span>Incluido</span>
    </span>
  );
};
