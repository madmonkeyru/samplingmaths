import React, { useState } from 'react';
import { SpecsTable } from './SpecsTable';
import { TermsDictionary } from './TermsDictionary';
import { FormulasSheet } from './FormulasSheet';
import { dataService } from '../../services/dataService';
import { FileText, BookOpen, Calculator, ArrowLeft, Ban } from 'lucide-react';

interface ResourceLibraryPageProps {
  initialTab?: 'specs' | 'terms' | 'formulas';
  onGoHome: () => void;
  onStartPracticeByItems?: (itemIds: number[], title: string) => void;
}

export const ResourceLibraryPage: React.FC<ResourceLibraryPageProps> = ({
  initialTab = 'specs',
  onGoHome,
  onStartPracticeByItems,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'terms' | 'formulas'>(
    initialTab
  );

  const activeProgram = dataService.getCurrentProgram();
  const isCalcAllowed = dataService.isCalculatorAllowed();
  const convocatoria = dataService.getCurrentConvocatoriaId() || '2026-c2';

  return (
    <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 py-6 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ui-surface rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-900 dark:text-slate-100 rounded-xl  transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Volver al inicio"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-semibold text-stone-900 dark:text-slate-100 ">
                {activeProgram?.id === 'bxm'
                  ? 'Biblioteca de Conocimiento y Recursos BXM'
                  : `Biblioteca de Conocimiento y Recursos: ${activeProgram?.name || 'BXM'}`}
              </h1>
              {!isCalcAllowed && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                  <Ban className="w-3 h-3" /> Sin Calculadora
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 dark:text-slate-400 font-bold">
              Costa Rica Educación Abierta MEP — Convocatoria {convocatoria === '2026-c1' ? '01-2026' : '02-2026'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-100 dark:bg-slate-800 p-1.5 rounded-xl  gap-1 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Especificaciones</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>Diccionario</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'formulas'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4 stroke-[2.5]" />
            <span>Fórmulas</span>
          </button>
        </div>
      </div>

      {/* Dynamic Tab Body */}
      <main>
        {activeTab === 'specs' && (
          <SpecsTable onStartPracticeByItems={onStartPracticeByItems} />
        )}
        {activeTab === 'terms' && <TermsDictionary />}
        {activeTab === 'formulas' && <FormulasSheet />}
      </main>
    </div>
  );
};
