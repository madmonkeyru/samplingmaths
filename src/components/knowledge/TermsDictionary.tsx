import React, { useState } from 'react';
import { DomainArea } from '../../types';
import { knowledgeService } from '../../services/knowledgeService';
import { TextRenderer } from '../common/TextRenderer';
import { Search, BookOpen, Tag, Code, Check } from 'lucide-react';

export const TermsDictionary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState<DomainArea | 'all'>('all');

  const terms = knowledgeService.getTerms(searchQuery, activeDomain);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              <h2 className="text-lg font-black text-stone-900 dark:text-slate-100 uppercase tracking-wide">
                Diccionario de Términos y Conceptos Matemáticos
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 font-bold leading-relaxed">
              Glosario especializado de conceptos, simbología y definiciones clave evaluadas en el programa oficial de Bachillerato por Madurez Suficiente.
            </p>
          </div>
        </div>

        {/* Search & Domain Filter Row */}
        <div className="grid md:grid-cols-3 gap-3 pt-1">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar concepto (ej: Circunferencia, Discriminante, Cuartiles)..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition min-h-[44px]"
            />
          </div>

          {/* Area Select */}
          <div>
            <select
              value={activeDomain}
              onChange={(e) => setActiveDomain(e.target.value as DomainArea | 'all')}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition min-h-[44px] cursor-pointer"
            >
              <option value="all">Todas las Áreas</option>
              <option value="geometry">1. Geometría</option>
              <option value="functions">2. Relaciones y Álgebra</option>
              <option value="statistics">3. Estadística y Probabilidad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dictionary Entries List */}
      {terms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-stone-400 dark:text-slate-500 mx-auto stroke-[2]" />
          <h3 className="font-black text-base text-stone-900 dark:text-slate-100 uppercase">
            No se encontraron términos
          </h3>
          <p className="text-xs text-stone-600 dark:text-slate-400 font-bold">
            Intenta buscar con otros términos o cambia el filtro de área.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5">
          {terms.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs transition hover:border-stone-300 dark:hover:border-slate-700"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-slate-800 pb-3">
                <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-slate-100 tracking-wide uppercase">
                  {item.term}
                </h3>
                <span className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border border-stone-200 dark:border-slate-700 rounded-xl text-xs font-black self-start sm:self-auto">
                  {item.blockName}
                </span>
              </div>

              {/* Definition */}
              <div className="text-xs sm:text-sm text-stone-800 dark:text-slate-200 font-medium leading-relaxed">
                <TextRenderer content={item.definition} />
              </div>

              {/* Key Formulas */}
              {item.keyFormulas && item.keyFormulas.length > 0 && (
                <div className="bg-stone-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-stone-200/80 dark:border-slate-700/80 space-y-2">
                  <span className="text-[11px] font-black uppercase text-stone-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 stroke-[2.5]" /> Fórmulas / Expresiones clave:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {item.keyFormulas.map((f, fIdx) => (
                      <div
                        key={fIdx}
                        className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 text-xs font-bold text-stone-900 dark:text-slate-100"
                      >
                        <TextRenderer inline content={`$${f}$`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              {item.examples && item.examples.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-black uppercase text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Ejemplos de aplicación:
                  </span>
                  {item.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="text-xs font-semibold text-stone-700 dark:text-slate-300 pl-2.5 border-l-2 border-indigo-600 dark:border-indigo-400"
                    >
                      <TextRenderer content={ex} />
                    </div>
                  ))}
                </div>
              )}

              {/* Related Evidences */}
              {item.relatedEvidence && item.relatedEvidence.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-slate-800/80 text-[11px] font-bold text-stone-500 dark:text-slate-400">
                  <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Criterios MEP asociados: {item.relatedEvidence.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
