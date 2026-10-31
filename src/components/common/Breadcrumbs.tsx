import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Navegación estructural" className={`flex items-center text-xs font-bold text-stone-600 dark:text-slate-400 ${className}`}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1 || item.active;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="font-extrabold text-stone-900 dark:text-slate-100 flex items-center gap-1" aria-current="page">
                  {isFirst && <Home className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  disabled={!item.onClick}
                  className={`flex items-center gap-1 transition rounded px-1 py-0.5 ${
                    item.onClick
                      ? 'hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500'
                      : 'text-stone-500 dark:text-slate-500 cursor-default'
                  }`}
                >
                  {isFirst && <Home className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400 shrink-0" />}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
