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
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-zinc-900 dark:text-zinc-100 stroke-[2.5]" />
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                Tabla de Especificaciones BXM (Convocatoria 02-2026)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-bold leading-relaxed">
              Distribución oficial de criterios de evaluación, afirmaciones, evidencias y puntuación asignada para el examen de Bachillerato por Madurez Suficiente.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl border-2 border-zinc-900 dark:border-zinc-700">
            <Award className="w-6 h-6 text-zinc-950 dark:text-zinc-100 stroke-[2.5]" />
            <div>
              <span className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 block">Total de Ítems / Puntos</span>
              <span className="text-base font-black text-zinc-900 dark:text-zinc-100">{totalExamItems} Puntos</span>
            </div>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t-2 border-zinc-900 dark:border-zinc-800">
          <span className="text-xs font-black uppercase text-zinc-600 dark:text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 stroke-[2.5]" /> Filtrar Área:
          </span>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition min-h-[36px] cursor-pointer ${
              activeTab === 'all'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Todas las Áreas
          </button>
          <button
            onClick={() => setActiveTab('geometry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition min-h-[36px] cursor-pointer ${
              activeTab === 'geometry'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
          >
            1. Geometría
          </button>
          <button
            onClick={() => setActiveTab('functions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition min-h-[36px] cursor-pointer ${
              activeTab === 'functions'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
          >
            2. Relaciones y Álgebra
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 transition min-h-[36px] cursor-pointer ${
              activeTab === 'statistics'
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
          >
            3. Estadística y Probabilidad
          </button>
        </div>
      </div>

      {/* Specifications Blocks Table Display */}
      <div className="space-y-8">
        {filteredBlocks.map((block) => (
          <div
            key={block.id}
            className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-xs"
          >
            {/* Block Header */}
            <div className="bg-zinc-950 dark:bg-zinc-800 text-white p-4 sm:p-5 flex items-center justify-between gap-3 border-b-2 border-zinc-900 dark:border-zinc-700">
              <div className="flex items-center gap-3 min-w-0">
                <Layers className="w-5 h-5 stroke-[2.5] shrink-0 text-white" />
                <h3 className="text-base sm:text-lg font-black tracking-wide uppercase truncate">
                  {block.block}
                </h3>
              </div>
              <div className="px-3 py-1 bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white rounded-xl text-xs font-black shrink-0 border border-zinc-200 dark:border-zinc-700">
                {block.totalPoints} Ítems / Puntos
              </div>
            </div>

            {/* Block Affirmations */}
            <div className="divide-y-2 divide-zinc-900 dark:divide-zinc-800">
              {block.affirmations.map((aff) => {
                const affTotalItems = aff.evidences.reduce((s, e) => s + e.points, 0);
                const allAffItemIds = aff.evidences.flatMap((e) => e.item_ids);

                return (
                  <div key={aff.affirmation} className="p-4 sm:p-6 space-y-4">
                    {/* Affirmation Row Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-50 dark:bg-zinc-800/60 p-3.5 rounded-xl border-2 border-zinc-900 dark:border-zinc-700">
                      <div className="space-y-1 min-w-0">
                        <span className="text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-400 block tracking-wider">
                          Afirmación ({aff.affirmation})
                        </span>
                        <div className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                          <TextRenderer content={aff.affirmation_desc} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <span className="text-xs font-bold bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-900 dark:border-zinc-700">
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
                            className="px-3 py-1.5 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black rounded-lg text-xs flex items-center gap-1.5 transition border border-zinc-950 dark:border-zinc-100 hover:opacity-90 min-h-[36px] cursor-pointer"
                            title="Practicar todos los ítems de esta afirmación"
                          >
                            <PlayCircle className="w-4 h-4 stroke-[2.5]" />
                            <span>Practicar Afirmación</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Evidences Table / List */}
                    <div className="space-y-2.5 pt-1">
                      <span className="text-[11px] font-black uppercase text-zinc-500 dark:text-zinc-400 block tracking-wider pl-1">
                        Evidencias y Criterios Evaluados:
                      </span>

                      <div className="space-y-2">
                        {aff.evidences.map((ev) => {
                          const isExpanded = !!expandedEvidences[ev.evidence];

                          return (
                            <div
                              key={ev.evidence}
                              className="border-2 border-zinc-900 dark:border-zinc-700 rounded-xl overflow-hidden transition bg-white dark:bg-zinc-900"
                            >
                              <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                  <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-lg text-xs font-black text-zinc-900 dark:text-zinc-100 shrink-0">
                                    {ev.evidence}
                                  </span>
                                  <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 pt-0.5 leading-normal">
                                    <TextRenderer content={ev.evidence_desc} />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800">
                                  <span className="text-xs font-black text-zinc-700 dark:text-zinc-300">
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
                                      className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-extrabold rounded-lg text-xs flex items-center gap-1 border border-zinc-900 dark:border-zinc-700 transition min-h-[32px] cursor-pointer"
                                      title="Practicar preguntas de este criterio"
                                    >
                                      <PlayCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                                      <span>Practicar</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => toggleExpand(ev.evidence)}
                                    className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-lg transition min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
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
                                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/70 border-t-2 border-zinc-900 dark:border-zinc-700 text-xs font-bold space-y-2">
                                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                    <CheckCircle2 className="w-4 h-4 text-zinc-950 dark:text-zinc-100 stroke-[2.5]" />
                                    <span>
                                      Ítems del banco asociados a este criterio ({ev.item_ids.length}):
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ev.item_ids.map((id) => (
                                      <span
                                        key={id}
                                        className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 font-extrabold"
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
