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
      {/* First Time User Encouragement Banner */}
      {attempts.length <= 1 && (
        <div className="bg-zinc-950 border-2 border-zinc-900 text-white rounded-2xl p-4.5 flex items-center gap-3 shadow-xs">
          <Sparkles className="w-5 h-5 text-white shrink-0" />
          <p className="text-sm font-extrabold">
            Sigue practicando y te diremos cómo vas.
          </p>
        </div>
      )}

      {/* Results Summary Header */}
      <div className="bg-white border-2 border-zinc-900 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xs border-2 border-zinc-900 bg-zinc-950"
          >
            {scorePercentage}%
          </div>
          <div>
            <span className="text-xs font-black text-zinc-900 uppercase tracking-wider">
              Resultado de la Sesión
            </span>
            <h2 className="text-2xl font-black text-zinc-900 uppercase">
              {scorePercentage >= 70 ? '¡Buen Trabajo!' : 'Sigue Practicando'}
            </h2>
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-700 mt-1.5">
              <span className="flex items-center gap-1 text-zinc-900">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> {correctCount} Correctas
              </span>
              <span className="flex items-center gap-1 text-zinc-600">
                <XCircle className="w-4 h-4 stroke-[2.5]" /> {totalItems - correctCount} Incorrectas
              </span>
              <span className="flex items-center gap-1 text-zinc-700">
                <Clock className="w-4 h-4 stroke-[2.5]" /> {formatDuration(session.elapsedSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onRetry}
            className="flex-1 md:flex-initial px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition border-2 border-zinc-900 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Reintentar</span>
          </button>
          <button
            onClick={onNewTest}
            className="flex-1 md:flex-initial px-4 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition border-2 border-zinc-950 shadow-xs min-h-[44px]"
          >
            <Award className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva Práctica</span>
          </button>
          <button
            onClick={onGoHome}
            className="p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-xl transition border-2 border-zinc-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Inicio"
          >
            <Home className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Performance Graph */}
      {attempts.length >= 2 && (
        <div className="bg-white border-2 border-zinc-900 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-zinc-900">
            <TrendingUp className="w-5 h-5 text-zinc-900 stroke-[2.5]" />
            <h3 className="text-base font-black text-zinc-900 uppercase">Tendencia de Desempeño</h3>
          </div>
          <div className="h-32 flex items-end gap-3 pt-6 border-b-2 border-zinc-900 pb-2">
            {attempts.slice(0, 10).reverse().map((att, idx) => (
              <div key={att.id} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="text-[10px] font-black text-zinc-900 opacity-0 group-hover:opacity-100 transition">
                  {att.scorePercentage}%
                </div>
                <div
                  className="w-full bg-zinc-950 rounded-t-sm transition-all hover:bg-zinc-800 border-x-2 border-t-2 border-zinc-900"
                  style={{ height: `${Math.max(10, att.scorePercentage)}%` }}
                />
                <span className="text-[10px] text-zinc-700 font-bold">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Review List */}
      <div className="space-y-6">
        <h3 className="text-lg font-black text-zinc-900 uppercase">Revisión Detallada de Respuestas</h3>

        {items.map((item, index) => {
          const userResp = session.responses[item.id];
          const isCorrect = userResp?.selectedOption === item.correct_answer;
          const group = item.group_id ? dataService.getGroupById(item.group_id) : null;
          const isExpanded = !!expandedSolutions[item.id];

          return (
            <div
              key={item.id}
              className={`bg-white border-2 rounded-2xl p-6 shadow-xs space-y-4 transition border-zinc-900 ${
                !isCorrect ? 'bg-zinc-50/50' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b-2 border-zinc-900">
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center text-white bg-zinc-950 border-2 border-zinc-950"
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs font-black text-zinc-900 uppercase">
                    {item.topic || item.area}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <span className="px-3 py-1 bg-zinc-950 text-white text-xs font-extrabold rounded-xl border-2 border-zinc-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Correcta
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-950 text-xs font-extrabold rounded-xl border-2 border-zinc-900 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Incorrecta
                    </span>
                  )}
                </div>
              </div>

              {group && <GroupVisual group={group} />}

              <div className="text-sm font-bold text-zinc-900 leading-relaxed">
                <TextRenderer content={item.stem} />
              </div>

              {!group && item.visual_spec && (
                <VisualRenderer spec={item.visual_spec} itemId={item.id} />
              )}

              {/* Options Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {getOptionArray(item).map((opt) => {
                  const isUserSelected = userResp?.selectedOption === opt.letter;
                  const isCorrectAnswer = item.correct_answer === opt.letter;

                  let optionStyle = 'border-zinc-300 bg-white text-zinc-900';
                  if (isCorrectAnswer) optionStyle = 'border-zinc-950 bg-zinc-950 text-white font-bold';
                  else if (isUserSelected && !isCorrectAnswer)
                    optionStyle = 'border-zinc-900 bg-zinc-100 text-zinc-900 line-through';

                  return (
                    <div
                      key={opt.letter}
                      className={`p-3.5 rounded-xl border-2 text-xs flex items-start gap-2.5 font-bold ${optionStyle}`}
                    >
                      <span className="font-black shrink-0">{opt.letter})</span>
                      <div className="flex-1">
                        <TextRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expandable Step-by-Step Solution */}
              <div className="pt-2 border-t-2 border-zinc-900">
                <button
                  onClick={() => toggleSolution(item.id)}
                  className="flex items-center gap-1.5 text-xs font-black text-zinc-950 hover:text-zinc-700 transition min-h-[44px]"
                >
                  <span>{isExpanded ? 'Ocultar explicación' : 'Ver solución paso a paso'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 p-4 bg-zinc-50 border-2 border-zinc-900 rounded-xl space-y-2 text-xs text-zinc-900 font-medium">
                    <div className="font-black text-zinc-900 uppercase mb-1">Explicación Oficial:</div>
                    {item.solution_steps.map((step, sIdx) => (
                      <div key={sIdx} className="leading-relaxed bg-white p-2.5 rounded-lg border-2 border-zinc-900">
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
