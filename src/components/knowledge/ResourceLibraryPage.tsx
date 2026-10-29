import React, { useState } from 'react';
import { SpecsTable } from './SpecsTable';
import { TermsDictionary } from './TermsDictionary';
import { FormulasSheet } from './FormulasSheet';
import { FileText, BookOpen, Calculator, ArrowLeft } from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-6 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="p-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Volver al inicio"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-base sm:text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Biblioteca de Conocimiento y Recursos BXM
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-bold">
              Costa Rica Bachillerato por Madurez Suficiente (Convocatoria 02-2026)
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 gap-1 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Especificaciones</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>Diccionario</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'formulas'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black shadow-xs'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
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
