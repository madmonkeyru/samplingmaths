import React, { useState } from 'react';
import { DomainArea } from '../../types';
import { knowledgeService } from '../../services/knowledgeService';
import { TextRenderer } from '../common/TextRenderer';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Award,
  Layers,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface SpecsTableProps {
  onStartPracticeByItems?: (itemIds: number[], title: string) => void;
}

export const SpecsTable: React.FC<SpecsTableProps> = ({ onStartPracticeByItems }) => {
  const [activeTab, setActiveTab] = useState<DomainArea | 'all'>('all');
  const [expandedEvidences, setExpandedEvidences] = useState<Record<string, boolean>>({});

  const blocks = knowledgeService.getSpecificationBlocks();

  const toggleExpand = (evCode: string) => {
    setExpandedEvidences((prev) => ({
      ...prev,
      [evCode]: !prev[evCode],
    }));
  };

  const filteredBlocks = blocks.filter(
    (b) => activeTab === 'all' || b.id === activeTab
  );

  const totalExamItems = blocks.reduce((sum, b) => sum + b.totalPoints, 0);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              <h2 className="text-lg font-black text-stone-900 dark:text-slate-100 uppercase tracking-wide">
                Tabla de Especificaciones BXM (Convocatoria 02-2026)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 font-bold leading-relaxed">
              Distribución oficial de criterios de evaluación, afirmaciones, evidencias y puntuación asignada para el examen de Bachillerato por Madurez Suficiente.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-stone-100 dark:bg-slate-800/80 px-4 py-3 rounded-xl border border-stone-200 dark:border-slate-700">
            <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
            <div>
              <span className="text-[10px] font-black uppercase text-stone-500 dark:text-slate-400 block">Total de Ítems / Puntos</span>
              <span className="text-base font-black text-stone-900 dark:text-slate-100">{totalExamItems} Puntos</span>
            </div>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-200 dark:border-slate-800">
          <span className="text-xs font-black uppercase text-stone-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 stroke-[2.5]" /> Filtrar Área:
          </span>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition min-h-[36px] cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            Todas las Áreas
          </button>
          <button
            onClick={() => setActiveTab('geometry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition min-h-[36px] cursor-pointer ${
              activeTab === 'geometry'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            1. Geometría
          </button>
          <button
            onClick={() => setActiveTab('functions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition min-h-[36px] cursor-pointer ${
              activeTab === 'functions'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            2. Relaciones y Álgebra
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition min-h-[36px] cursor-pointer ${
              activeTab === 'statistics'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            3. Estadística y Probabilidad
          </button>
        </div>
      </div>

      {/* Specifications Blocks Display */}
      <div className="space-y-6">
        {filteredBlocks.map((block) => (
          <div
            key={block.id}
            className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs"
          >
            {/* Block Header */}
            <div className="bg-stone-900 dark:bg-slate-800 text-white px-5 py-4 flex items-center justify-between gap-3 border-b border-stone-800 dark:border-slate-700">
              <div className="flex items-center gap-3 min-w-0">
                <Layers className="w-5 h-5 stroke-[2.5] shrink-0 text-indigo-400" />
                <h3 className="text-base sm:text-lg font-black tracking-wide uppercase truncate">
                  {block.block}
                </h3>
              </div>
              <div className="px-3 py-1 bg-stone-800 dark:bg-slate-900 text-stone-100 dark:text-slate-100 rounded-xl text-xs font-black shrink-0 border border-stone-700 dark:border-slate-700">
                {block.totalPoints} Ítems / Puntos
              </div>
            </div>

            {/* Block Affirmations */}
            <div className="divide-y divide-stone-200 dark:divide-slate-800">
              {block.affirmations.map((aff) => {
                const affTotalItems = aff.evidences.reduce((s, e) => s + e.points, 0);
                const allAffItemIds = aff.evidences.flatMap((e) => e.item_ids);

                return (
                  <div key={aff.affirmation} className="p-4 sm:p-6 space-y-4">
                    {/* Affirmation Banner Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-stone-50/80 dark:bg-slate-800/50 p-4 rounded-xl border border-stone-200/80 dark:border-slate-700/80">
                      <div className="space-y-1 min-w-0">
                        <span className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 block tracking-wider">
                          Afirmación ({aff.affirmation})
                        </span>
                        <div className="text-sm font-black text-stone-900 dark:text-slate-100">
                          <TextRenderer content={aff.affirmation_desc} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <span className="text-xs font-bold bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-800 dark:text-slate-200">
                          {affTotalItems} pts
                        </span>

                        {onStartPracticeByItems && allAffItemIds.length > 0 && (
                          <button
                            onClick={() =>
                              onStartPracticeByItems(
                                allAffItemIds,
                                `Práctica - Afirmación ${aff.affirmation}`
                              )
                            }
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs min-h-[36px] cursor-pointer"
                            title="Practicar todos los ítems de esta afirmación"
                          >
                            <PlayCircle className="w-4 h-4 stroke-[2.5]" />
                            <span>Practicar Afirmación</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Evidences Clean List (No heavy nested box frames) */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-black uppercase text-stone-500 dark:text-slate-400 block tracking-wider pl-1">
                        Evidencias y Criterios Evaluados:
                      </span>

                      <div className="divide-y divide-stone-200 dark:divide-slate-800 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/60">
                        {aff.evidences.map((ev) => {
                          const isExpanded = !!expandedEvidences[ev.evidence];

                          return (
                            <div
                              key={ev.evidence}
                              className="transition hover:bg-stone-50/60 dark:hover:bg-slate-800/40"
                            >
                              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                  <span className="px-2.5 py-1 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-black text-stone-900 dark:text-slate-100 shrink-0">
                                    {ev.evidence}
                                  </span>
                                  <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-slate-200 pt-0.5 leading-normal">
                                    <TextRenderer content={ev.evidence_desc} />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-slate-800">
                                  <span className="text-xs font-black text-stone-600 dark:text-slate-400">
                                    {ev.points} ítem{ev.points === 1 ? '' : 's'}
                                  </span>

                                  {onStartPracticeByItems && ev.item_ids.length > 0 && (
                                    <button
                                      onClick={() =>
                                        onStartPracticeByItems(
                                          ev.item_ids,
                                          `Práctica - Evidencia ${ev.evidence}`
                                        )
                                      }
                                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-900 dark:text-slate-100 font-extrabold rounded-lg text-xs flex items-center gap-1 border border-stone-300 dark:border-slate-700 transition min-h-[32px] cursor-pointer"
                                      title="Practicar preguntas de este criterio"
                                    >
                                      <PlayCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                                      <span>Practicar</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => toggleExpand(ev.evidence)}
                                    className="p-1.5 text-stone-500 dark:text-slate-400 hover:text-stone-950 dark:hover:text-white rounded-lg transition min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                                    title="Ver preguntas asignadas"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Question IDs detail */}
                              {isExpanded && (
                                <div className="p-3.5 bg-stone-50 dark:bg-slate-800/60 border-t border-stone-200 dark:border-slate-800 text-xs font-bold space-y-2">
                                  <div className="flex items-center gap-2 text-stone-700 dark:text-slate-300">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                                    <span>
                                      Ítems del banco asociados a este criterio ({ev.item_ids.length}):
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ev.item_ids.map((id) => (
                                      <span
                                        key={id}
                                        className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-900 dark:text-slate-100 font-extrabold"
                                      >
                                        Ítem #{id}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
