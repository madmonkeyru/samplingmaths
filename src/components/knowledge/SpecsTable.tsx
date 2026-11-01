import React, { useState, useEffect } from 'react';
import { DomainArea } from '../../types';
import { knowledgeService } from '../../services/knowledgeService';
import { TextRenderer } from '../common/TextRenderer';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Award,
  Layers,
  Filter,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react';

interface SpecsTableProps {
  onStartPracticeByItems?: (itemIds: number[], title: string) => void;
}

export const SpecsTable: React.FC<SpecsTableProps> = ({ onStartPracticeByItems }) => {
  const [activeTab, setActiveTab] = useState<DomainArea | 'all'>('all');

  // Collapsible state
  // Blocks default to expanded (collapsedBlocks[blockId] = false)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({});
  // Option A requirement: Affirmations default to collapsed (expandedAffirmations[affKey] = false)
  const [expandedAffirmations, setExpandedAffirmations] = useState<Record<string, boolean>>({});
  // Question IDs detail per evidence defaults to collapsed
  const [expandedEvidences, setExpandedEvidences] = useState<Record<string, boolean>>({});

  const blocks = knowledgeService.getSpecificationBlocks();

  const toggleBlock = (blockId: string) => {
    setCollapsedBlocks((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  };

  const toggleAffirmation = (affKey: string) => {
    setExpandedAffirmations((prev) => ({
      ...prev,
      [affKey]: !prev[affKey],
    }));
  };

  const toggleEvidence = (evCode: string) => {
    setExpandedEvidences((prev) => ({
      ...prev,
      [evCode]: !prev[evCode],
    }));
  };

  // Helper to determine if all affirmations are expanded
  const allAffKeys = blocks.flatMap((b) => b.affirmations.map((a) => `${b.id}_${a.affirmation}`));
  const isAllExpanded =
    blocks.every((b) => !collapsedBlocks[b.id]) &&
    allAffKeys.every((key) => expandedAffirmations[key]);

  const handleGlobalToggle = () => {
    if (isAllExpanded) {
      // Collapse all
      const newBlocksState: Record<string, boolean> = {};
      blocks.forEach((b) => {
        newBlocksState[b.id] = true;
      });
      setCollapsedBlocks(newBlocksState);
      setExpandedAffirmations({});
    } else {
      // Expand all
      setCollapsedBlocks({});
      const newAffState: Record<string, boolean> = {};
      allAffKeys.forEach((key) => {
        newAffState[key] = true;
      });
      setExpandedAffirmations(newAffState);
    }
  };

  const scrollToBlock = (blockId: string) => {
    setActiveTab('all');
    // Ensure block is expanded if collapsed
    if (collapsedBlocks[blockId]) {
      setCollapsedBlocks((prev) => ({ ...prev, [blockId]: false }));
    }
    setTimeout(() => {
      const el = document.getElementById(`block-${blockId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const filteredBlocks = blocks.filter(
    (b) => activeTab === 'all' || b.id === activeTab
  );

  const totalExamItems = blocks.reduce((sum, b) => sum + b.totalPoints, 0);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="ui-surface rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              <h2 className="text-lg font-semibold text-stone-900 dark:text-slate-100 ">
                Tabla de Especificaciones BXM (Convocatoria 02-2026)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 font-bold leading-relaxed">
              Distribución oficial de criterios de evaluación, afirmaciones, evidencias y puntuación asignada para el examen de Bachillerato por Madurez Suficiente.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-stone-100 dark:bg-slate-800/80 px-4 py-3 rounded-xl ">
            <div>
              <span className="text-[10px] font-semibold uppercase text-stone-500 dark:text-slate-400 block">Total de Ítems / Puntos</span>
              <span className="text-base font-semibold text-stone-900 dark:text-slate-100">{totalExamItems} Puntos</span>
            </div>
          </div>
        </div>

        {/* Global Controls & Domain Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase text-stone-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 stroke-[2.5]" /> Filtros:
            </span>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[36px] cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
            >
              Todas las Áreas
            </button>
            <button
              onClick={() => setActiveTab('geometry')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[36px] cursor-pointer ${
                activeTab === 'geometry'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
            >
              Geometría
            </button>
            <button
              onClick={() => setActiveTab('functions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[36px] cursor-pointer ${
                activeTab === 'functions'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
            >
              Relaciones y Álgebra
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[36px] cursor-pointer ${
                activeTab === 'statistics'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
            >
              Estadística y Probabilidad
            </button>
          </div>

          {/* Global Accordion Toggle */}
          <button
            onClick={handleGlobalToggle}
            className="px-3.5 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-900 dark:text-slate-100 font-semibold rounded-xl text-xs  flex items-center gap-1.5 transition min-h-[36px] cursor-pointer ml-auto"
            title={isAllExpanded ? 'Colapsar todas las secciones' : 'Expandir todas las secciones'}
          >
            {isAllExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                <span>Colapsar Todo</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                <span>Expandir Todo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sticky Quick-Jump Navigation Bar */}
      <div className="sticky top-14 z-20 bg-stone-100/90 dark:bg-slate-900/90 backdrop-blur-md border border-stone-200 dark:border-slate-800 rounded-xl p-2.5 shadow-xs flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => scrollToBlock('geometry')}
            className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-stone-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold rounded-lg text-xs  transition shrink-0 cursor-pointer"
          >
            Geometría (23 pts)
          </button>
          <button
            onClick={() => scrollToBlock('functions')}
            className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-stone-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold rounded-lg text-xs  transition shrink-0 cursor-pointer"
          >
            Relaciones y Álgebra (25 pts)
          </button>
          <button
            onClick={() => scrollToBlock('statistics')}
            className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-stone-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold rounded-lg text-xs  transition shrink-0 cursor-pointer"
          >
            Estadística y Probabilidad (12 pts)
          </button>
        </div>
      </div>

      {/* Specifications Blocks Display */}
      <div className="space-y-6">
        {filteredBlocks.map((block) => {
          const isBlockCollapsed = !!collapsedBlocks[block.id];

          return (
            <div
              key={block.id}
              id={`block-${block.id}`}
              className="ui-surface rounded-2xl overflow-hidden shadow-xs scroll-mt-28"
            >
              {/* Level 1: Block Header Accordion Button */}
              <button
                onClick={() => toggleBlock(block.id)}
                className="w-full bg-stone-900 dark:bg-slate-800 text-white px-5 py-4 flex items-center justify-between gap-3 border-b border-stone-200 dark:border-slate-700 transition hover:bg-stone-850 dark:hover:bg-slate-750 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1 rounded-lg bg-stone-800 dark:bg-slate-700 text-indigo-400">
                    {isBlockCollapsed ? (
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>
                  <Layers className="w-5 h-5 stroke-[2.5] shrink-0 text-indigo-400" />
                  <div>
                    <span className="text-[10px] font-semibold tracking-widest text-indigo-400 uppercase block">
                      ÁREA OFICIAL #{block.id === 'geometry' ? '1' : block.id === 'functions' ? '2' : '3'}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold truncate">
                      {block.block}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-3 py-1 bg-stone-800 dark:bg-slate-900 text-stone-100 dark:text-slate-100 rounded-xl text-xs font-semibold border border-stone-700 dark:border-slate-700">
                    {block.totalPoints} Puntos ({block.affirmations.length} Afirmaciones)
                  </span>
                </div>
              </button>

              {/* Block Content (Affirmations) */}
              {!isBlockCollapsed && (
                <div className="p-4 sm:p-6 space-y-6">
                  {block.affirmations.map((aff) => {
                    const affKey = `${block.id}_${aff.affirmation}`;
                    const isAffExpanded = !!expandedAffirmations[affKey];
                    const affTotalItems = aff.evidences.reduce((s, e) => s + e.points, 0);
                    const allAffItemIds = aff.evidences.flatMap((e) => e.item_ids);

                    return (
                      <div
                        key={aff.affirmation}
                        className="space-y-4 rounded-xl border-l-4 border-indigo-500/80 dark:border-indigo-400/80 pl-3 sm:pl-5 py-1"
                      >
                        {/* Level 2: Affirmation Accordion Banner */}
                        <div className="bg-stone-50/90 dark:bg-slate-800/60 p-4 rounded-xl border border-stone-200/90 dark:border-slate-700/80 space-y-3">
                          <div
                            onClick={() => toggleAffirmation(affKey)}
                            className="flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none group"
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <button
                                type="button"
                                className="mt-0.5 p-1 rounded-md bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0"
                              >
                                {isAffExpanded ? (
                                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                                )}
                              </button>

                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-semibold uppercase bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md  tracking-wider">
                                    Afirmación {aff.affirmation}
                                  </span>
                                  <span className="text-xs font-bold text-stone-500 dark:text-slate-400">
                                    • {aff.evidences.length} Criterios
                                  </span>
                                </div>
                                <div className="text-sm font-semibold text-stone-900 dark:text-slate-100 leading-snug">
                                  <TextRenderer content={aff.affirmation_desc} />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                              <span className="text-xs font-semibold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg  text-stone-800 dark:text-slate-200">
                                {affTotalItems} pts
                              </span>

                              {onStartPracticeByItems && allAffItemIds.length > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStartPracticeByItems(
                                      allAffItemIds,
                                      `Práctica - Afirmación ${aff.affirmation}`
                                    );
                                  }}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs min-h-[34px] cursor-pointer"
                                  title="Practicar todos los ítems de esta afirmación"
                                >
                                  <PlayCircle className="w-4 h-4 stroke-[2.5]" />
                                  <span className="hidden sm:inline">Practicar Afirmación</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Level 3: Evidences List (Stepped Indented View) */}
                        {isAffExpanded && (
                          <div className="pl-2 sm:pl-4 space-y-2 border-l-2 border-stone-200 dark:border-slate-700/80 ml-2 sm:ml-3">
                            <span className="text-[11px] font-semibold uppercase text-stone-500 dark:text-slate-400 block tracking-wider pl-1">
                              Evidencias y Criterios Evaluados:
                            </span>

                            <div className="divide-y divide-stone-200 dark:divide-slate-800 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/60 shadow-2xs">
                              {aff.evidences.map((ev) => {
                                const isEvExpanded = !!expandedEvidences[ev.evidence];

                                return (
                                  <div
                                    key={ev.evidence}
                                    className="transition hover:bg-stone-50/70 dark:hover:bg-slate-800/40"
                                  >
                                    <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                        <span className="px-2.5 py-1 bg-stone-100 dark:bg-slate-800  rounded-lg text-xs font-semibold text-stone-900 dark:text-slate-100 shrink-0">
                                          Evidencia {ev.evidence}
                                        </span>
                                        <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-slate-200 pt-0.5 leading-relaxed">
                                          <TextRenderer content={ev.evidence_desc} />
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-slate-800">
                                        <span className="text-xs font-semibold text-stone-600 dark:text-slate-400">
                                          {ev.points} ítem{ev.points === 1 ? '' : 's'}
                                        </span>

                                        {onStartPracticeByItems && ev.item_ids.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              onStartPracticeByItems(
                                                ev.item_ids,
                                                `Práctica - Evidencia ${ev.evidence}`
                                              )
                                            }
                                            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-900 dark:text-slate-100 font-semibold rounded-lg text-xs flex items-center gap-1  transition min-h-[32px] cursor-pointer"
                                            title="Practicar preguntas de este criterio"
                                          >
                                            <PlayCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                                            <span>Practicar</span>
                                          </button>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => toggleEvidence(ev.evidence)}
                                          className="p-1.5 text-stone-500 dark:text-slate-400 hover:text-stone-950 dark:hover:text-white rounded-lg transition min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                                          title="Ver preguntas asignadas"
                                        >
                                          {isEvExpanded ? (
                                            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Expanded Question IDs detail */}
                                    {isEvExpanded && (
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
                                              className="px-2.5 py-1 bg-white dark:bg-slate-900  rounded-lg text-stone-900 dark:text-slate-100 font-semibold"
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
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
