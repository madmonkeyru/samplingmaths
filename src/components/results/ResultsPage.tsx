import React, { useEffect, useState } from 'react';
import type { TestSession, Item, Attempt } from '../../types';
import { dataService } from '../../services/dataService';
import { storageService } from '../../services/storageService';
import { TextRenderer } from '../common/TextRenderer';
import { VisualRenderer } from '../visuals/VisualRenderer';
import { GroupVisual } from '../visuals/GroupVisual';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Clock,
  TrendingUp,
  Sparkles,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ListFilter,
} from 'lucide-react';

interface ResultsPageProps {
  session: TestSession;
  onRetry: () => void;
  onNewTest: () => void;
  onGoHome: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  session,
  onRetry,
  onNewTest,
  onGoHome,
}) => {
  const [expandedSolutions, setExpandedSolutions] = useState<Record<number, boolean>>({});
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect'>('all');

  const items: Item[] = session.itemIds
    .map((id) => dataService.getItemById(id))
    .filter((it): it is Item => it !== undefined);

  let correctCount = 0;
  items.forEach((item) => {
    const res = session.responses[item.id];
    if (res?.selectedOption === item.correct_answer) {
      correctCount++;
    }
  });

  const totalItems = items.length;
  const scorePercentage = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;

  const [attempts, setAttempts] = useState<Attempt[]>(() => storageService.getAttempts());

  // Persist attempt on load
  useEffect(() => {
    const attempt: Attempt = {
      id: session.sessionId,
      userId: session.userId,
      timestamp: new Date().toISOString(),
      mode: session.config.mode,
      scopeText:
        session.config.mode === 'simulation'
          ? 'Simulación Completa (60 ítems)'
          : `Práctica (${session.config.area || 'General'})`,
      scorePercentage,
      correctCount,
      totalItems,
      durationSeconds: session.elapsedSeconds,
      responses: session.responses,
    };

    storageService.saveAttempt(attempt);
    setAttempts(storageService.getAttempts());
  }, []);

  const toggleSolution = (itemId: number) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  const getOptionArray = (item: Item): { letter: 'A' | 'B' | 'C' | 'D'; text: string }[] => {
    if (Array.isArray(item.options)) {
      return item.options.map((opt: any) => ({
        letter: opt.letter || 'A',
        text: typeof opt === 'string' ? opt : opt.text || '',
      }));
    }
    return (['A', 'B', 'C', 'D'] as const).map((letKey) => ({
      letter: letKey,
      text: (item.options as Record<string, string>)[letKey] || '',
    }));
  };

  return (
    <div className="results-page max-w-5xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-8 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* First Time User Encouragement Banner */}
      {attempts.length <= 1 && (
        <div className="bg-zinc-950 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 text-white rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <Sparkles className="w-5 h-5 text-white shrink-0" />
          <p className="text-xs sm:text-sm font-extrabold">
            Sigue practicando y te diremos cómo vas.
          </p>
        </div>
      )}

      {/* Results Summary Header */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-800 rounded-2xl p-5 sm:p-8 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white dark:text-zinc-950 font-black text-xl sm:text-2xl shadow-xs border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-950 dark:bg-zinc-100 shrink-0"
          >
            {scorePercentage}%
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider block text-zinc-600 dark:text-zinc-400">
              Resultados
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight truncate">
              {scorePercentage >= 70 ? '¡Buen Trabajo!' : 'Sigue Practicando'}
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-1 sm:mt-1.5">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] text-emerald-600 dark:text-emerald-400 shrink-0" /> {correctCount} Correctas
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] text-rose-600 dark:text-rose-400 shrink-0" /> {totalItems - correctCount} Incorrectas
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" /> {formatDuration(session.elapsedSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto pt-3 md:pt-0 border-t-2 md:border-t-0 border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onRetry}
            className="flex-1 md:flex-initial px-3.5 sm:px-4 py-2.5 sm:py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition border-2 border-zinc-900 dark:border-zinc-700 min-h-[44px] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span>Reintentar</span>
          </button>
          <button
            onClick={onNewTest}
            className="flex-1 md:flex-initial px-3.5 sm:px-4 py-2.5 sm:py-3 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition border-2 border-zinc-950 dark:border-zinc-100 shadow-xs min-h-[44px] cursor-pointer"
          >
            <Award className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span>Nueva Práctica</span>
          </button>
          <button
            onClick={onGoHome}
            aria-label="Inicio"
            className="p-2.5 sm:p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 rounded-xl transition border-2 border-zinc-900 dark:border-zinc-700 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 cursor-pointer"
            title="Inicio"
          >
            <Home className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Performance Graph */}
      {attempts.length >= 2 && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-zinc-900 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 stroke-[2.5] text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-black uppercase tracking-tight">Desempeño</h3>
            </div>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Últimos {Math.min(attempts.length, 10)} intentos
            </span>
          </div>

          <div className="h-44 flex items-end gap-2.5 sm:gap-3 pt-6 border-b-2 border-zinc-900 dark:border-zinc-800 pb-2">
            {attempts.slice(0, 10).reverse().map((att, idx) => {
              const score = att.scorePercentage;
              const barColor =
                score >= 80
                  ? 'bg-emerald-600 dark:bg-emerald-500'
                  : score >= 65
                  ? 'bg-indigo-600 dark:bg-indigo-500'
                  : score >= 50
                  ? 'bg-amber-600 dark:bg-amber-500'
                  : 'bg-rose-600 dark:bg-rose-500';

              return (
                <div key={att.id || idx} className="flex-1 h-full flex flex-col justify-end items-center group">
                  {/* Score badge above bar */}
                  <span className="text-[10px] sm:text-[11px] font-black text-zinc-700 dark:text-zinc-300 opacity-80 group-hover:opacity-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-1 shrink-0">
                    {score}%
                  </span>

                  {/* Relative bar track */}
                  <div className="w-full flex-1 flex items-end justify-center">
                    <div
                      className={`w-full max-w-[48px] ${barColor} rounded-t-md transition-all duration-300 group-hover:brightness-110 border-x-2 border-t-2 border-zinc-900 dark:border-zinc-700 shadow-2xs`}
                      style={{ height: `${Math.max(8, score)}%` }}
                    />
                  </div>

                  {/* Attempt label */}
                  <span className="text-[10px] sm:text-[11px] text-zinc-700 dark:text-zinc-400 font-extrabold mt-1.5 shrink-0">
                    #{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Item Review Section with Global View vs. Detail View */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
        {selectedItemIndex === null ? (
          /* ================= GLOBAL VIEW ================= */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-zinc-900 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 stroke-[2.5] text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  Preguntas
                </h3>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold ml-1">
                  ({items.length} ítems)
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-2xs font-extrabold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  Todas ({items.length})
                </button>
                <button
                  onClick={() => setFilterMode('correct')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    filterMode === 'correct'
                      ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Correctas ({correctCount})
                </button>
                <button
                  onClick={() => setFilterMode('incorrect')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    filterMode === 'incorrect'
                      ? 'bg-rose-600 text-white shadow-2xs font-extrabold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Incorrectas ({totalItems - correctCount})
                </button>
              </div>
            </div>

            {/* Questions Navigator Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2 sm:gap-2.5">
              {items.map((item, idx) => {
                const userResp = session.responses[item.id];
                const isAnswered = !!userResp?.selectedOption;
                const isCorrect = userResp?.selectedOption === item.correct_answer;

                if (filterMode === 'correct' && !isCorrect) return null;
                if (filterMode === 'incorrect' && isCorrect) return null;

                let btnStyles = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-zinc-500';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-black';
                  } else {
                    btnStyles = 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-500 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-black';
                  }
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemIndex(idx)}
                    title={`Pregunta ${idx + 1}: ${isCorrect ? 'Correcta' : 'Incorrecta'}`}
                    className={`relative h-11 w-full rounded-xl text-xs sm:text-sm font-extrabold border-2 flex items-center justify-center transition cursor-pointer shadow-2xs ${btnStyles}`}
                  >
                    <span>{idx + 1}</span>
                    <span className="absolute -top-1 -right-1">
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-white dark:fill-zinc-900" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 fill-white dark:fill-zinc-900" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Legend & Instructions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400">
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                Haz clic en cualquier número para ver el detalle de la pregunta, tus respuestas y la solución paso a paso.
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500" />
                  Correcta
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-rose-100 dark:bg-rose-950/60 border-2 border-rose-500" />
                  Incorrecta
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= DETAIL VIEW ================= */
          (() => {
            const currentIdx = selectedItemIndex;
            const currentItem = items[currentIdx];
            if (!currentItem) return null;

            const userResp = session.responses[currentItem.id];
            const isCorrect = userResp?.selectedOption === currentItem.correct_answer;
            const group = currentItem.group_id ? dataService.getGroupById(currentItem.group_id) : null;
            const isExpanded = expandedSolutions[currentItem.id] !== false; // expanded by default in single item view

            return (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Detail View Top Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-zinc-900 dark:border-zinc-800">
                  <button
                    onClick={() => setSelectedItemIndex(null)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Volver a la vista general</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentIdx === 0}
                      onClick={() => setSelectedItemIndex(Math.max(0, currentIdx - 1))}
                      className="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                      <span className="hidden sm:inline">Anterior</span>
                    </button>

                    <span className="px-3 py-2 rounded-xl text-xs font-black bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950">
                      Pregunta {currentIdx + 1} de {items.length}
                    </span>

                    <button
                      disabled={currentIdx === items.length - 1}
                      onClick={() => setSelectedItemIndex(Math.min(items.length - 1, currentIdx + 1))}
                      className="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <span className="hidden sm:inline">Siguiente</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Question Details Card */}
                <div
                  className={`rounded-2xl p-5 sm:p-6 border-2 space-y-4 ${
                    isCorrect
                      ? 'border-emerald-500/60 bg-emerald-50/15 dark:bg-emerald-950/10'
                      : 'border-rose-500/60 bg-rose-50/15 dark:bg-rose-950/10'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center text-white dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-100 border-2 border-zinc-950 dark:border-zinc-100 shrink-0">
                        {currentIdx + 1}
                      </span>
                      <div className="min-w-0 flex flex-col">
                        <span className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
                          {currentItem.spec?.block ? `${currentItem.spec.block}` : currentItem.area} • {currentItem.topic || currentItem.area}
                        </span>
                        {currentItem.spec?.evidence_desc && (
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 leading-snug">
                            {currentItem.spec.evidence}: {currentItem.spec.evidence_desc}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {isCorrect ? (
                        <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-xl border border-emerald-700 flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Correcta
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black rounded-xl border border-rose-700 flex items-center gap-1 shadow-2xs">
                          <XCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Incorrecta
                        </span>
                      )}
                    </div>
                  </div>

                  {group && <GroupVisual group={group} />}

                  <div className="text-sm font-bold leading-relaxed text-zinc-900 dark:text-zinc-100">
                    <TextRenderer content={currentItem.stem} />
                  </div>

                  {!group && currentItem.visual_spec && (
                    <VisualRenderer spec={currentItem.visual_spec} itemId={currentItem.id} />
                  )}

                  {/* Options Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {getOptionArray(currentItem).map((opt) => {
                      const isUserSelected = userResp?.selectedOption === opt.letter;
                      const isCorrectAnswer = currentItem.correct_answer === opt.letter;

                      let optionStyle = 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200';
                      if (isCorrectAnswer) {
                        optionStyle = 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-extrabold ring-1 ring-emerald-500';
                      } else if (isUserSelected && !isCorrectAnswer) {
                        optionStyle = 'border-rose-600 dark:border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 font-extrabold line-through';
                      }

                      return (
                        <div
                          key={opt.letter}
                          className={`p-3.5 rounded-xl border-2 text-xs flex items-start gap-2.5 font-bold transition ${optionStyle}`}
                        >
                          <span className="font-black shrink-0">{opt.letter})</span>
                          <div className="flex-1">
                            <TextRenderer content={opt.text} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Solution */}
                  <div className="pt-3 border-t-2 border-zinc-200 dark:border-zinc-800">
                    <button
                      onClick={() => toggleSolution(currentItem.id)}
                      className="flex items-center gap-1.5 text-xs font-black hover:opacity-80 transition min-h-[36px] cursor-pointer text-indigo-700 dark:text-indigo-400"
                    >
                      <span>{isExpanded ? 'Ocultar explicación' : 'Ver solución paso a paso'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 bg-zinc-50 dark:bg-zinc-800/60 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl space-y-2 text-xs font-medium">
                        <div className="font-black uppercase mb-1 text-zinc-900 dark:text-zinc-100">Explicación Oficial:</div>
                        {currentItem.solution_steps.map((step, sIdx) => (
                          <div key={sIdx} className="leading-relaxed bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                            • <TextRenderer content={typeof step === 'string' ? step : step.explanation} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};
