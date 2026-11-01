import React from 'react';
import { Attempt } from '../../types';
import { storageService } from '../../services/storageService';
import { Award, CheckCircle2, Flame, HelpCircle } from 'lucide-react';

interface QuickStatsBannerProps {
  attempts: Attempt[];
  programName?: string;
  className?: string;
}

export const QuickStatsBanner: React.FC<QuickStatsBannerProps> = ({
  attempts,
  programName = 'Matemáticas BXM',
  className = '',
}) => {
  const perfLevel = storageService.calculatePerformanceLevel(attempts);
  const simulationAttempts = attempts.filter((a) => a.scopeText.toLowerCase().includes('simulación'));
  const latestAttempt = attempts[0];

  return (
    <div
      className={`ui-surface rounded-2xl p-4 sm:p-5 shadow-xs ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left summary */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm shrink-0 shadow-2xs">
            {attempts.length > 0 ? `${perfLevel.scoreAverage}%` : '--'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-stone-300 dark:text-slate-600">•</span>
              <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400">
                {programName}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-slate-100">
              {attempts.length === 0
                ? 'Listo para iniciar tu primera práctica'
                : perfLevel.description}
            </h4>
          </div>
        </div>

        {/* Right metrics grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t md:border-t-0 md:border-l border-stone-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-5 text-left">
          {/* Total attempts */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Intentos
            </span>
            <span className="text-sm font-semibold text-stone-900 dark:text-slate-100 mt-0.5">
              {attempts.length}
            </span>
          </div>

          {/* Simulations completed */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Simulacros
            </span>
            <span className="text-sm font-semibold text-stone-900 dark:text-slate-100 mt-0.5">
              {simulationAttempts.length}
            </span>
          </div>

          {/* Latest score or Readiness */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase flex items-center gap-1">
              <Award className="w-3 h-3 text-indigo-500" /> Último
            </span>
            <span className="text-sm font-semibold text-stone-900 dark:text-slate-100 mt-0.5">
              {latestAttempt ? `${latestAttempt.scorePercentage}%` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
