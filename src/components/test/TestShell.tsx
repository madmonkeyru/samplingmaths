import React, { useState, useEffect } from 'react';
import type { Item, TestSession, ItemResponse, PracticeConfig } from '../../types';
import { dataService } from '../../services/dataService';
import { storageService } from '../../services/storageService';
import { TextRenderer } from '../common/TextRenderer';
import { VisualRenderer } from '../visuals/VisualRenderer';
import { GroupVisual } from '../visuals/GroupVisual';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Menu,
  X,
  EyeOff,
  BookOpen,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface TestShellProps {
  config: PracticeConfig;
  onFinishTest: (session: TestSession) => void;
}

export const TestShell: React.FC<TestShellProps> = ({ config, onFinishTest }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Record<number, ItemResponse>>({});
  const [flaggedItems, setFlaggedItems] = useState<Record<number, boolean>>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<number, Record<string, boolean>>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
    config.timerDurationMinutes * 60
  );
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isFormulaOpen, setIsFormulaOpen] = useState<boolean>(false);
  const [navFilter, setNavFilter] = useState<'all' | 'unanswered' | 'answered' | 'flagged'>('all');
  const [showPracticeExplanation, setShowPracticeExplanation] = useState<Record<number, boolean>>({});

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea or modal is open
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (isConfirmOpen || items.length === 0) return;

      const key = e.key.toLowerCase();

      if (key === 'a' || key === '1') {
        handleSelectOption('A');
      } else if (key === 'b' || key === '2') {
        handleSelectOption('B');
      } else if (key === 'c' || key === '3') {
        handleSelectOption('C');
      } else if (key === 'd' || key === '4') {
        handleSelectOption('D');
      } else if (key === 'arrowleft' || key === '[') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (key === 'arrowright' || key === ']') {
        setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1));
      } else if (key === 'f' || key === 'm') {
        setFlaggedItems((prev) => {
          const curId = items[currentIndex]?.id;
          if (!curId) return prev;
          return { ...prev, [curId]: !prev[curId] };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, currentIndex, isConfirmOpen]);

  // Initialize Items
  useEffect(() => {
    let pool: Item[] = [];
    if (config.mode === 'simulation') {
      pool = dataService.getAllItems();
    } else if (config.area && config.area !== 'all') {
      pool = dataService.getItemsByArea(config.area);
    } else {
      pool = dataService.getAllItems();
    }

    if (config.mode === 'topic' && config.topic && config.topic !== 'all') {
      pool = pool.filter((item) => item.topic === config.topic);
    }

    if (config.itemCount !== 'all') {
      pool = pool.slice(0, Number(config.itemCount));
    }

    setItems(pool);

    // Check for restored active session
    const saved = storageService.getActiveSession();
    if (saved && saved.itemIds.length === pool.length && !saved.isCompleted) {
      setResponses(saved.responses || {});
      setFlaggedItems(saved.flaggedItems || {});
      setCurrentIndex(saved.currentResponseIndex || 0);
      setElapsedSeconds(saved.elapsedSeconds || 0);
      if (config.enableTimer) {
        setTimeLeftSeconds(Math.max(0, config.timerDurationMinutes * 60 - (saved.elapsedSeconds || 0)));
      }
    }
  }, [config]);

  // Timer Countdown and Auto-save (NFR-P-03, NFR-R-01)
  useEffect(() => {
    if (items.length === 0) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (config.enableTimer) {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinalSubmit(); // Auto-submit on expiry (FR-S-03)
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [items, config.enableTimer]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (items.length === 0) return;

    const activeSession: TestSession = {
      sessionId: `session-${Date.now()}`,
      userId: storageService.getCurrentUser()?.id || 'guest',
      config,
      itemIds: items.map((i) => i.id),
      currentResponseIndex: currentIndex,
      responses,
      flaggedItems,
      startTime: new Date().toISOString(),
      elapsedSeconds,
      isCompleted: false,
    };

    storageService.saveActiveSession(activeSession);
  }, [items, currentIndex, responses, flaggedItems, elapsedSeconds]);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-slate-500">
        Cargando preguntas de la prueba...
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const group = currentItem.group_id
    ? dataService.getGroupById(currentItem.group_id)
    : null;

  const handleSelectOption = (letter: 'A' | 'B' | 'C' | 'D') => {
    const isCorrect = letter === currentItem.correct_answer;
    setResponses((prev) => ({
      ...prev,
      [currentItem.id]: {
        itemId: currentItem.id,
        selectedOption: letter,
        isCorrect,
      },
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedItems((prev) => ({
      ...prev,
      [currentItem.id]: !prev[currentItem.id],
    }));
  };

  const handleToggleEliminate = (e: React.MouseEvent, letter: 'A' | 'B' | 'C' | 'D') => {
    e.stopPropagation();
    setEliminatedOptions((prev) => {
      const currentElims = prev[currentItem.id] || {};
      return {
        ...prev,
        [currentItem.id]: {
          ...currentElims,
          [letter]: !currentElims[letter],
        },
      };
    });
  };

  const handleFinalSubmit = () => {
    storageService.clearActiveSession();

    const finalSession: TestSession = {
      sessionId: `session-${Date.now()}`,
      userId: storageService.getCurrentUser()?.id || 'guest',
      config,
      itemIds: items.map((i) => i.id),
      currentResponseIndex: currentIndex,
      responses,
      flaggedItems,
      startTime: new Date().toISOString(),
      elapsedSeconds,
      isCompleted: true,
    };

    onFinishTest(finalSession);
  };

  const answeredCount = Object.keys(responses).length;
  const progressPct = Math.round((answeredCount / items.length) * 100);
  const flaggedCount = Object.values(flaggedItems).filter(Boolean).length;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to extract options as array regardless of JSON shape
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
    <div className="test-shell min-h-[calc(100vh-65px)] bg-slate-100 flex flex-col">
      {/* Test Shell Header */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-30 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              {/* Question Position Indicator (FR-S-10) */}
              <div className="text-sm font-bold text-slate-800">
                Pregunta {currentIndex + 1} de {items.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {currentItem.topic || currentItem.area}
              </div>
            </div>
          </div>

          {/* Progress Bar & Timer */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end w-36">
              <div className="text-[11px] font-semibold text-slate-500 mb-1">
                Progreso: {progressPct}% ({answeredCount}/{items.length})
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsFormulaOpen(true)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 border border-indigo-200 transition"
              title="Ver fórmulas del examen"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fórmulas</span>
            </button>

            {config.enableTimer && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                  timeLeftSeconds < 300
                    ? 'bg-red-100 text-red-700 animate-pulse'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => setIsConfirmOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finalizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex gap-6">
        {/* Navigation Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 p-4 flex flex-col transform transition-transform lg:static lg:translate-x-0 ${
            isNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              Navegador de Ítems
            </h3>
            <button onClick={() => setIsNavOpen(false)} className="lg:hidden text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg mb-3 gap-1 text-[11px] font-semibold">
            <button
              onClick={() => setNavFilter('all')}
              className={`flex-1 py-1 rounded-md text-center transition ${
                navFilter === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setNavFilter('unanswered')}
              className={`flex-1 py-1 rounded-md text-center transition ${
                navFilter === 'unanswered' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setNavFilter('answered')}
              className={`flex-1 py-1 rounded-md text-center transition ${
                navFilter === 'answered' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Listas
            </button>
            <button
              onClick={() => setNavFilter('flagged')}
              className={`flex-1 py-1 rounded-md text-center transition ${
                navFilter === 'flagged' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Marcadas
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 overflow-y-auto flex-1 max-h-[calc(100vh-280px)] pr-1">
            {items.map((it, idx) => {
              const isAnswered = !!responses[it.id]?.selectedOption;
              const isFlagged = !!flaggedItems[it.id];
              const isCurrent = idx === currentIndex;

              if (navFilter === 'unanswered' && isAnswered) return null;
              if (navFilter === 'answered' && !isAnswered) return null;
              if (navFilter === 'flagged' && !isFlagged) return null;

              let btnClass = 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50';
              if (isAnswered) btnClass = 'bg-blue-50 border-blue-400 text-blue-700 font-bold';
              if (isCurrent) btnClass += ' ring-2 ring-blue-600 ring-offset-1';

              return (
                <button
                  key={it.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsNavOpen(false);
                  }}
                  className={`relative h-9 rounded-lg text-xs font-semibold border flex items-center justify-center transition ${btnClass}`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigator Legend */}
          <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-50 border border-blue-400 shrink-0" />
              <span>Respondida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-white border border-slate-300 shrink-0" />
              <span>Sin responder</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shrink-0" />
              <span>Marcada para revisión</span>
            </div>
          </div>
        </aside>

        {/* Question Area */}
        <main className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            {/* Question Bar Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {currentItem.evidence ? `Evidencia: ${currentItem.evidence}` : 'Opción Múltiple'}
              </span>

              <button
                onClick={handleToggleFlag}
                title="Atajo de teclado: F o M"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                  flaggedItems[currentItem.id]
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Flag className="w-3.5 h-3.5 fill-current" />
                <span>{flaggedItems[currentItem.id] ? 'Marcada [F]' : 'Marcar revisión [F]'}</span>
              </button>
            </div>

            {/* Shared Group Visual Context (FR-S-06) */}
            {group && <GroupVisual group={group} />}

            {/* Question Stem */}
            <div className="text-base text-slate-800 leading-relaxed font-medium">
              <TextRenderer content={currentItem.stem} />
            </div>

            {/* Question Direct Visual (if no group or standalone visual) */}
            {!group && currentItem.visual_spec && (
              <VisualRenderer spec={currentItem.visual_spec} itemId={currentItem.id} />
            )}

            {/* Practice Mode Instant Feedback Toggle & Banner */}
            {config.mode !== 'simulation' && responses[currentItem.id]?.selectedOption && (
              <div className="pt-2">
                {!showPracticeExplanation[currentItem.id] ? (
                  <button
                    onClick={() =>
                      setShowPracticeExplanation((prev) => ({ ...prev, [currentItem.id]: true }))
                    }
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs flex items-center gap-2 border border-indigo-200 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>Verificar respuesta y ver explicación</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl border space-y-3 bg-slate-50 border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {responses[currentItem.id]?.selectedOption === currentItem.correct_answer ? (
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>¡Respuesta Correcta! (Opción {currentItem.correct_answer})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-700">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span>Respuesta Incorrecta. La opción correcta es {currentItem.correct_answer}.</span>
                        </div>
                      )}
                    </div>

                    {currentItem.solution_steps && currentItem.solution_steps.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
                        <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                          Solución paso a paso:
                        </span>
                        {currentItem.solution_steps.map((step, sIdx) => (
                          <div key={sIdx} className="bg-white p-2.5 rounded-lg border border-slate-200">
                            {typeof step === 'string' ? (
                              <TextRenderer content={step} />
                            ) : (
                              <div>
                                <span className="font-semibold text-slate-800">{step.title}: </span>
                                <TextRenderer content={step.explanation} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Answer Options Selector (FR-A-01) */}
            <div className="space-y-3 pt-2">
              {getOptionArray(currentItem).map((opt) => {
                const selected = responses[currentItem.id]?.selectedOption === opt.letter;
                const isEliminated = !!eliminatedOptions[currentItem.id]?.[opt.letter];

                let optionContainerStyle = 'border-slate-200 hover:border-slate-300 bg-white';
                if (selected) {
                  optionContainerStyle = 'border-blue-600 bg-blue-50/50 shadow-xs';
                } else if (isEliminated) {
                  optionContainerStyle = 'border-slate-200 bg-slate-50 opacity-60';
                }

                return (
                  <div key={opt.letter} className="relative flex items-center gap-2">
                    <button
                      onClick={() => handleSelectOption(opt.letter)}
                      className={`w-full text-left p-4 rounded-xl border-2 flex items-start gap-3.5 transition ${optionContainerStyle}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition ${
                          selected
                            ? 'bg-blue-600 text-white'
                            : isEliminated
                            ? 'bg-slate-200 text-slate-400 line-through'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                        title={`Presiona ${opt.letter} o ${getOptionArray(currentItem).findIndex(o => o.letter === opt.letter) + 1}`}
                      >
                        {opt.letter}
                      </span>
                      <div className={`text-sm text-slate-800 pt-0.5 leading-normal flex-1 ${isEliminated ? 'line-through text-slate-400' : ''}`}>
                        <TextRenderer content={opt.text} />
                      </div>
                    </button>

                    <button
                      onClick={(e) => handleToggleEliminate(e, opt.letter)}
                      title={isEliminated ? 'Restaurar opción' : 'Descartar opción'}
                      className={`p-2 rounded-lg transition shrink-0 ${
                        isEliminated
                          ? 'text-red-500 bg-red-50 hover:bg-red-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              disabled={currentIndex === items.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1))}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Keyboard Shortcuts Hint Bar */}
          <div className="hidden sm:flex items-center justify-center gap-4 pt-3 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 text-[10px] font-bold">A–D</kbd>
              responder
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 text-[10px] font-bold">F</kbd>
              marcar revisión
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 text-[10px] font-bold">←</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 text-[10px] font-bold">→</kbd>
              navegar
            </span>
          </div>
        </main>
      </div>

      {/* Formula Reference Modal */}
      {isFormulaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-800">Simbología y Fórmulas del Examen (BXM)</h3>
              </div>
              <button
                onClick={() => setIsFormulaOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              {/* Geometria */}
              <div className="space-y-3">
                <h4 className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 uppercase tracking-wide text-xs">
                  Geometría y Circunferencia
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Ecuación de la Circunferencia:</span>
                    <TextRenderer content="$(x - h)^2 + (y - k)^2 = r^2$" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Área y Perímetro del Círculo:</span>
                    <TextRenderer content="$A = \pi r^2 \quad | \quad P = 2\pi r$" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Polígono Regular (Suma de Ángulos Int.):</span>
                    <TextRenderer content="$S_i = 180^\circ (n - 2)$" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Área Regular / Apotema:</span>
                    <TextRenderer content="$A = \frac{P \cdot a}{2}$" />
                  </div>
                </div>
              </div>

              {/* Funciones y Algebra */}
              <div className="space-y-3">
                <h4 className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 uppercase tracking-wide text-xs">
                  Funciones y Álgebra
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Función Lineal:</span>
                    <TextRenderer content="$f(x) = mx + b \quad (m = \frac{y_2 - y_1}{x_2 - x_1})$" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Vértice de Parábola (Cuadrática):</span>
                    <TextRenderer content="$V = \left( -\frac{b}{2a}, -\frac{\Delta}{4a} \right), \quad \Delta = b^2 - 4ac$" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Función Exponencial y Logarítmica:</span>
                    <TextRenderer content="$f(x) = a^x \iff f^{-1}(x) = \log_a(x)$" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Interés Compuesto:</span>
                    <TextRenderer content="$C(t) = C_0 (1 + i)^t$" />
                  </div>
                </div>
              </div>

              {/* Estadistica y Probabilidad */}
              <div className="space-y-3">
                <h4 className="font-bold text-indigo-900 border-b border-indigo-100 pb-1 uppercase tracking-wide text-xs">
                  Estadística y Probabilidad
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">
                      Media Aritmética (<TextRenderer inline content="$\bar{x}$" />):
                    </span>
                    <TextRenderer content="$\bar{x} = \frac{\sum x_i}{n}$" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold block text-slate-800">Recorrido Intercuartilico (RIC):</span>
                    <TextRenderer content="$RIC = Q_3 - Q_1$" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 sm:col-span-2">
                    <span className="font-semibold block text-slate-800">Probabilidad Laplace:</span>
                    <TextRenderer content="$P(A) = \frac{\text{Casos favorables}}{\text{Casos posibles}}$" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setIsFormulaOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs"
              >
                Cerrar Fórmulas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">¿Entregar la prueba?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Has respondido {answeredCount} de {items.length} preguntas.
                {items.length - answeredCount > 0 && (
                  <span className="block text-amber-600 font-semibold mt-1">
                    Atención: Quedan {items.length - answeredCount} preguntas sin responder.
                  </span>
                )}
                {flaggedCount > 0 && (
                  <span className="block text-slate-600 mt-1">
                    Tienes {flaggedCount} pregunta{flaggedCount === 1 ? '' : 's'} marcada{flaggedCount === 1 ? '' : 's'} para revisión.
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Seguir respondiendo
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs"
              >
                Sí, entregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
