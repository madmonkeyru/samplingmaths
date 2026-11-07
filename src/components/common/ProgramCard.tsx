import React from 'react';
import { ProgramInfo } from '../../types';
import { ArrowRight, Calculator, Ban } from 'lucide-react';

interface ProgramCardProps {
  program: ProgramInfo;
  isMvp?: boolean;
  onSelect: (programId: string) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  isMvp = false,
  onSelect,
}) => {
  const description = program.id === 'bxm'
    ? 'Una prueba por asignatura.'
    : program.description;

  return (
    <a href={'#/programas/' + program.id + '?convocatoria=2026-c2'}
      onClick={event => { if (!event.ctrlKey && !event.metaKey) { event.preventDefault(); onSelect(program.id); } }}
      className={`group relative text-left ui-surface ui-lift rounded-2xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between ${isMvp ? 'program-featured' : ''}`}
    >
      <div>
        {/* {isMvp && (
          <div className="flex items-center gap-2 mb-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-300/40">
              <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Práctica disponible
            </span>
          </div>
        )} */}

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-['Outfit']">
          {program.name}
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
          {description}
        </p>

        {/* Metadata Details */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle,#e7e2d8)] dark:border-[var(--border-subtle,#3d3733)] grid grid-cols-2 gap-2 text-sm font-semibold">
          <div className="text-stone-700 dark:text-stone-300">
            <span>Mínimo: {program.passingScore} pts</span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
            {program.calculatorAllowed ? (
              <>
                <Calculator className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Por materia</span>
              </>
            ) : (
              <>
                <Ban className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-amber-700 dark:text-amber-300">Sin Calc</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        <span>{'Ver asignaturas y estructura'}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
};
