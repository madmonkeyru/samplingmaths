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
  }, []);

  const attempts = storageService.getAttempts();

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
    <div className="results-page max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* First Time User Encouragement Banner (FR-R-06, FR-U-04) */}
      {attempts.length <= 1 && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-sm font-semibold">
            Sigue practicando y te diremos cómo vas.
          </p>
        </div>
      )}

      {/* Results Summary Header (FR-R-01) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm ${
              scorePercentage >= 70 ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          >
            {scorePercentage}%
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Resultado de la Sesión
            </span>
            <h2 className="text-2xl font-extrabold text-slate-800">
              {scorePercentage >= 70 ? '¡Buen Trabajo!' : 'Sigue Practicando'}
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> {correctCount} Correctas
              </span>
              <span className="flex items-center gap-1 text-red-600 font-semibold">
                <XCircle className="w-4 h-4" /> {totalItems - correctCount} Incorrectas
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-4 h-4" /> {formatDuration(session.elapsedSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* CTAs (FR-R-03, FR-R-04) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onRetry}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
          <button
            onClick={onNewTest}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs"
          >
            <Award className="w-4 h-4" />
            <span>Nueva Práctica</span>
          </button>
          <button
            onClick={onGoHome}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Inicio"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Performance Graph (FR-R-05) */}
      {attempts.length >= 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">Tendencia de Desempeño</h3>
          </div>
          <div className="h-32 flex items-end gap-3 pt-6 border-b border-slate-200 pb-2">
            {attempts.slice(0, 10).reverse().map((att, idx) => (
              <div key={att.id} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition">
                  {att.scorePercentage}%
                </div>
                <div
                  className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                  style={{ height: `${Math.max(10, att.scorePercentage)}%` }}
                />
                <span className="text-[10px] text-slate-400">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Review List (FR-R-02) */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800">Revisión Detallada de Respuestas</h3>

        {items.map((item, index) => {
          const userResp = session.responses[item.id];
          const isCorrect = userResp?.selectedOption === item.correct_answer;
          const group = item.group_id ? dataService.getGroupById(item.group_id) : null;
          const isExpanded = !!expandedSolutions[item.id];

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-6 shadow-xs space-y-4 transition ${
                isCorrect ? 'border-slate-200' : 'border-red-200 bg-red-50/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                      isCorrect ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {item.topic || item.area}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correcta
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Incorrecta
                    </span>
                  )}
                </div>
              </div>

              {group && <GroupVisual group={group} />}

              <div className="text-sm font-medium text-slate-800 leading-relaxed">
                <TextRenderer content={item.stem} />
              </div>

              {!group && item.visual_spec && (
                <VisualRenderer spec={item.visual_spec} itemId={item.id} />
              )}

              {/* Options Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {getOptionArray(item).map((opt) => {
                  const isUserSelected = userResp?.selectedOption === opt.letter;
                  const isCorrectAnswer = item.correct_answer === opt.letter;

                  let optionStyle = 'border-slate-200 bg-white';
                  if (isCorrectAnswer) optionStyle = 'border-emerald-500 bg-emerald-50/60 font-semibold';
                  if (isUserSelected && !isCorrectAnswer)
                    optionStyle = 'border-red-400 bg-red-50 text-red-900';

                  return (
                    <div
                      key={opt.letter}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${optionStyle}`}
                    >
                      <span className="font-bold shrink-0">{opt.letter})</span>
                      <div className="flex-1">
                        <TextRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expandable Step-by-Step Solution */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => toggleSolution(item.id)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  <span>{isExpanded ? 'Ocultar explicación' : 'Ver solución paso a paso'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                    <div className="font-bold text-slate-800 mb-1">Explicación Oficial:</div>
                    {item.solution_steps.map((step, sIdx) => (
                      <div key={sIdx} className="leading-relaxed">
                        • <TextRenderer content={typeof step === 'string' ? step : step.explanation} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
