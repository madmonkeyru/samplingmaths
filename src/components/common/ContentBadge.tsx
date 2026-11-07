import React from 'react';
import { ShieldCheck, BookOpen, User } from 'lucide-react';
import type { ContentProvenance } from '../../types/access';

export interface ContentBadgeProps {
  provenance: ContentProvenance;
  className?: string;
  showIcon?: boolean;
}

const PROVENANCE_CONFIG: Record<
  ContentProvenance,
  {
    label: string;
    icon: React.ComponentType<{ className?: string; size?: number; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    style: string;
  }
> = {
  official: {
    label: 'MEP · Oficial',
    icon: ShieldCheck,
    style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  },
  authored: {
    label: 'MEP-EA · Formativo',
    icon: BookOpen,
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  },
  'learner-generated': {
    label: 'Tu registro privado',
    icon: User,
    style: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
  },
};

export const ContentBadge: React.FC<ContentBadgeProps> = ({
  provenance,
  className = '',
  showIcon = true,
}) => {
  const config = PROVENANCE_CONFIG[provenance];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.style} ${className}`}
      data-provenance={provenance}
    >
      {showIcon && <Icon size={13} className="shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};
