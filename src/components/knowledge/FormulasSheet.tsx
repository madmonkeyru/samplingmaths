import React, { useState } from 'react';
import { DomainArea } from '../../types';
import { knowledgeService } from '../../services/knowledgeService';
import { TextRenderer } from '../common/TextRenderer';
import { BookOpen, Filter, Info } from 'lucide-react';

export const FormulasSheet: React.FC = () => {
  const [activeArea, setActiveArea] = useState<DomainArea | 'all'>('all');

  const categories = knowledgeService.getFormulas(activeArea);

  return (
    <div className="space-y-6">
      {/* Formula Sheet Header */}
      <div className="ui-surface rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              <h2 className="text-lg font-semibold text-stone-900 dark:text-slate-100 ">
                Fórmulas y Simbología Oficial del Examen
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 font-bold leading-relaxed">
              Fórmulas matemáticas completas provistas en la hoja de anexos del examen BXM para Geometría, Relaciones y Álgebra, y Estadística y Probabilidad.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-200 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase text-stone-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 stroke-[2.5]" /> Área del Examen:
          </span>
          <button
            onClick={() => setActiveArea('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[36px] cursor-pointer ${
              activeArea === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            Todas las Áreas
          </button>
          <button
            onClick={() => setActiveArea('geometry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[36px] cursor-pointer ${
              activeArea === 'geometry'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            Geometría
          </button>
          <button
            onClick={() => setActiveArea('functions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[36px] cursor-pointer ${
              activeArea === 'functions'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            Relaciones y Álgebra
          </button>
          <button
            onClick={() => setActiveArea('statistics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[36px] cursor-pointer ${
              activeArea === 'statistics'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            Estadística y Probabilidad
          </button>
        </div>
      </div>

      {/* Formula Categories Grid */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="ui-surface rounded-2xl overflow-hidden shadow-xs space-y-4 p-5 sm:p-6"
          >
            <div className="border-b border-stone-200 dark:border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-semibold text-stone-900 dark:text-slate-100 ">
                {cat.title}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              {cat.formulas.map((form, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-stone-50/80 dark:bg-slate-800/50 border border-stone-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-slate-100 block">
                      {form.name}
                    </span>

                    {/* KaTeX Equation Display Box */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl  text-center text-sm font-bold my-2 text-stone-900 dark:text-slate-100 shadow-2xs overflow-x-auto">
                      <TextRenderer inline content={`$${form.latex}$`} />
                    </div>

                    <p className="text-xs font-semibold text-stone-700 dark:text-slate-300 leading-relaxed">
                      {form.description}
                    </p>
                  </div>

                  {/* Variables & Notes Legend */}
                  {form.variables && form.variables.length > 0 && (
                    <div className="pt-2 border-t border-stone-200 dark:border-slate-700/80 text-[11px] font-medium space-y-1">
                      <span className="font-semibold text-stone-900 dark:text-slate-100 uppercase tracking-wider block text-[10px]">
                        Donde:
                      </span>
                      {form.variables.map((v, vIdx) => (
                        <div key={vIdx} className="flex items-center gap-2 text-stone-700 dark:text-slate-300">
                          <span className="font-semibold text-stone-900 dark:text-slate-100 font-mono">
                            {v.symbol}:
                          </span>
                          <span>{v.meaning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Helpful Hint */}
      <div className="bg-stone-100 dark:bg-slate-800/80  rounded-2xl p-4 flex items-start gap-3 text-xs font-bold text-stone-800 dark:text-slate-200">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.5] shrink-0 mt-0.5" />
        <p>
          Recuerda que durante las sesiones de prueba o simulación puedes acceder rápidamente a este formulario desde el botón <strong>"Fórmulas"</strong> ubicado en el encabezado superior.
        </p>
      </div>
    </div>
  );
};
