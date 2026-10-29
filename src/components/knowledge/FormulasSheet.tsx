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
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-zinc-900 dark:text-zinc-100 stroke-[2.5]" />
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                Fórmulas y Simbología Oficial del Examen
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-bold leading-relaxed">
              Fórmulas matemáticas completas provistas en la hoja de anexos del examen BXM para Geometría, Relaciones y Álgebra, y Estadística y Probabilidad.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-zinc-900 dark:border-zinc-800">
          <span className="text-xs font-black uppercase text-zinc-600 dark:text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 stroke-[2.5]" /> Área del Examen:
          </span>
          <button
            onClick={() => setActiveArea('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition min-h-[36px] cursor-pointer ${
              activeArea === 'all'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Todas las Áreas
          </button>
          <button
            onClick={() => setActiveArea('geometry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition min-h-[36px] cursor-pointer ${
              activeArea === 'geometry'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Geometría
          </button>
          <button
            onClick={() => setActiveArea('functions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition min-h-[36px] cursor-pointer ${
              activeArea === 'functions'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Relaciones y Álgebra
          </button>
          <button
            onClick={() => setActiveArea('statistics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition min-h-[36px] cursor-pointer ${
              activeArea === 'statistics'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Estadística y Probabilidad
          </button>
        </div>
      </div>

      {/* Formula Categories Grid */}
      <div className="space-y-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-xs space-y-4 p-5 sm:p-6"
          >
            <div className="border-b-2 border-zinc-900 dark:border-zinc-800 pb-3">
              <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-wide uppercase">
                {cat.title}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {cat.formulas.map((form, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-zinc-50 dark:bg-zinc-800/60 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 block">
                      {form.name}
                    </span>

                    {/* KaTeX Equation Display Box */}
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 text-center text-sm font-bold my-2 text-zinc-900 dark:text-zinc-100 overflow-x-auto">
                      <TextRenderer inline content={`$${form.latex}$`} />
                    </div>

                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {form.description}
                    </p>
                  </div>

                  {/* Variables & Notes Legend */}
                  {form.variables && form.variables.length > 0 && (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 text-[11px] font-medium space-y-1">
                      <span className="font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block text-[10px]">
                        Donde:
                      </span>
                      {form.variables.map((v, vIdx) => (
                        <div key={vIdx} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <span className="font-black text-zinc-900 dark:text-zinc-100 font-mono">
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
      <div className="bg-zinc-100 dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 flex items-start gap-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
        <Info className="w-5 h-5 text-zinc-950 dark:text-zinc-100 stroke-[2.5] shrink-0 mt-0.5" />
        <p>
          Recuerda que durante las sesiones de prueba o simulación puedes acceder rápidamente a este formulario desde el botón <strong>"Fórmulas"</strong> ubicado en el encabezado superior.
        </p>
      </div>
    </div>
  );
};
