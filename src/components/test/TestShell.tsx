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

  // Timer Countdown and Auto-save
  useEffect(() => {
    if (items.length === 0) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (config.enableTimer) {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinalSubmit();
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
      <div className="max-w-4xl mx-auto p-8 text-center text-zinc-900 font-bold">
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
    <div className="test-shell min-h-[calc(100vh-65px)] bg-zinc-100 flex flex-col">
      {/* Test Shell Header */}
      <div className="bg-white border-b-2 border-zinc-900 sticky top-14 z-30 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="lg:hidden p-2 text-zinc-900 hover:bg-zinc-100 rounded-xl border border-zinc-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Abrir navegador de ítems"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <div className="text-sm font-black text-zinc-900">
                Pregunta {currentIndex + 1} de {items.length}
              </div>
              <div className="text-xs text-zinc-600 font-bold uppercase tracking-wider">
                {currentItem.topic || currentItem.area}
              </div>
            </div>
          </div>

          {/* Progress Bar & Timer */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end w-36">
              <div className="text-[11px] font-black text-zinc-800 mb-1">
                Progreso: {progressPct}% ({answeredCount}/{items.length})
              </div>
              <div className="w-full h-2.5 bg-zinc-200 rounded-full border border-zinc-900 overflow-hidden">
                <div
                  className="h-full bg-zinc-950 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsFormulaOpen(true)}
              className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 border-2 border-zinc-900 transition min-h-[44px]"
              title="Ver fórmulas del examen"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Fórmulas</span>
            </button>

            {config.enableTimer && (
              <div
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border-2 border-zinc-900 min-h-[44px] ${
                  timeLeftSeconds < 300
                    ? 'bg-zinc-950 text-white border-zinc-950 animate-pulse'
                    : 'bg-zinc-100 text-zinc-950'
                }`}
              >
                <Clock className="w-4 h-4 stroke-[2.5]" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => setIsConfirmOpen(true)}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition border-2 border-zinc-950 min-h-[44px]"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>Finalizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex gap-6">
        {/* Navigation Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r-2 border-zinc-900 p-4 flex flex-col transform transition-transform lg:static lg:translate-x-0 ${
            isNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-zinc-900">
            <h3 className="font-black text-sm text-zinc-900 uppercase tracking-wide flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-900" />
              Navegador de Ítems
            </h3>
            <button
              onClick={() => setIsNavOpen(false)}
              className="lg:hidden p-2 text-zinc-900 hover:bg-zinc-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-900 mb-3 gap-1 text-[11px] font-bold">
            <button
              onClick={() => setNavFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-center transition min-h-[36px] ${
                navFilter === 'all' ? 'bg-zinc-950 text-white' : 'text-zinc-700 hover:text-zinc-950'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setNavFilter('unanswered')}
              className={`flex-1 py-1.5 rounded-lg text-center transition min-h-[36px] ${
                navFilter === 'unanswered' ? 'bg-zinc-950 text-white' : 'text-zinc-700 hover:text-zinc-950'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setNavFilter('answered')}
              className={`flex-1 py-1.5 rounded-lg text-center transition min-h-[36px] ${
                navFilter === 'answered' ? 'bg-zinc-950 text-white' : 'text-zinc-700 hover:text-zinc-950'
              }`}
            >
              Listas
            </button>
            <button
              onClick={() => setNavFilter('flagged')}
              className={`flex-1 py-1.5 rounded-lg text-center transition min-h-[36px] ${
                navFilter === 'flagged' ? 'bg-zinc-950 text-white' : 'text-zinc-700 hover:text-zinc-950'
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

              let btnClass = 'bg-white border-zinc-900 text-zinc-900 hover:bg-zinc-100';
              if (isAnswered) btnClass = 'bg-zinc-950 text-white border-zinc-950 font-black';
              if (isCurrent) btnClass += ' ring-4 ring-zinc-950 ring-offset-1';

              return (
                <button
                  key={it.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsNavOpen(false);
                  }}
                  className={`relative h-11 w-11 rounded-xl text-xs font-bold border-2 flex items-center justify-center transition ${btnClass}`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-zinc-950 border-2 border-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigator Legend */}
          <div className="mt-3 pt-3 border-t-2 border-zinc-900 text-[11px] text-zinc-800 font-bold space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-zinc-950 border border-zinc-950 shrink-0" />
              <span>Respondida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-white border-2 border-zinc-900 shrink-0" />
              <span>Sin responder</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-zinc-950 border border-white shrink-0" />
              <span>Marcada para revisión</span>
            </div>
          </div>
        </aside>

        {/* Question Area */}
        <main className="flex-1 bg-white rounded-2xl border-2 border-zinc-900 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            {/* Question Bar Header */}
            <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-3">
              <span className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                {currentItem.evidence ? `Evidencia: ${currentItem.evidence}` : 'Opción Múltiple'}
              </span>

              <button
                onClick={handleToggleFlag}
                title="Atajo de teclado: F o M"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition min-h-[44px] ${
                  flaggedItems[currentItem.id]
                    ? 'bg-zinc-950 border-zinc-950 text-white'
                    : 'bg-zinc-100 border-zinc-900 text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                <Flag className="w-4 h-4 fill-current" />
                <span>{flaggedItems[currentItem.id] ? 'Marcada [F]' : 'Marcar revisión [F]'}</span>
              </button>
            </div>

            {/* Shared Group Visual Context (FR-S-06) */}
            {group && <GroupVisual group={group} />}

            {/* Question Stem */}
            <div className="text-base text-zinc-900 leading-relaxed font-bold">
              <TextRenderer content={currentItem.stem} />
            </div>

            {/* Question Direct Visual */}
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
                    className="px-4 py-2.5 bg-zinc-950 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 border-2 border-zinc-950 transition min-h-[44px]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Verificar respuesta y ver explicación</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl border-2 border-zinc-900 space-y-3 bg-zinc-50">
                    <div className="flex items-center gap-2 font-black text-sm">
                      {responses[currentItem.id]?.selectedOption === currentItem.correct_answer ? (
                        <div className="flex items-center gap-2 text-zinc-900">
                          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                          <span>¡Respuesta Correcta! (Opción {currentItem.correct_answer})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-zinc-900">
                          <XCircle className="w-5 h-5 stroke-[2.5]" />
                          <span>Respuesta Incorrecta. La opción correcta es {currentItem.correct_answer}.</span>
                        </div>
                      )}
                    </div>

                    {currentItem.solution_steps && currentItem.solution_steps.length > 0 && (
                      <div className="pt-2 border-t-2 border-zinc-900 text-xs space-y-2">
                        <span className="font-black text-zinc-900 uppercase tracking-wider block text-[11px]">
                          Solución paso a paso:
                        </span>
                        {currentItem.solution_steps.map((step, sIdx) => (
                          <div key={sIdx} className="bg-white p-3 rounded-lg border-2 border-zinc-900 font-medium">
                            {typeof step === 'string' ? (
                              <TextRenderer content={step} />
                            ) : (
                              <div>
                                <span className="font-extrabold text-zinc-900">{step.title}: </span>
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

                let optionContainerStyle = 'border-zinc-900 hover:bg-zinc-50 bg-white text-zinc-900';
                if (selected) {
                  optionContainerStyle = 'border-zinc-950 bg-zinc-950 text-white font-bold';
                } else if (isEliminated) {
                  optionContainerStyle = 'border-zinc-300 bg-zinc-100 text-zinc-400 opacity-60';
                }

                return (
                  <div key={opt.letter} className="relative flex items-center gap-2">
                    <button
                      onClick={() => handleSelectOption(opt.letter)}
                      className={`w-full text-left p-4 rounded-xl border-2 flex items-start gap-3.5 transition min-h-[52px] ${optionContainerStyle}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition border-2 ${
                          selected
                            ? 'bg-white text-zinc-950 border-white'
                            : isEliminated
                            ? 'bg-zinc-200 text-zinc-400 border-zinc-300 line-through'
                            : 'bg-zinc-100 text-zinc-900 border-zinc-900'
                        }`}
                        title={`Presiona ${opt.letter} o ${getOptionArray(currentItem).findIndex(o => o.letter === opt.letter) + 1}`}
                      >
                        {opt.letter}
                      </span>
                      <div className={`text-sm pt-1 leading-normal flex-1 font-bold ${isEliminated ? 'line-through' : ''}`}>
                        <TextRenderer content={opt.text} />
                      </div>
                    </button>

                    <button
                      onClick={(e) => handleToggleEliminate(e, opt.letter)}
                      title={isEliminated ? 'Restaurar opción' : 'Descartar opción'}
                      className={`p-3 rounded-xl border-2 transition shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        isEliminated
                          ? 'text-zinc-950 bg-zinc-200 border-zinc-900'
                          : 'text-zinc-600 border-zinc-300 hover:border-zinc-900 hover:text-zinc-950'
                      }`}
                    >
                      <EyeOff className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t-2 border-zinc-900 mt-8">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-950 font-extrabold rounded-xl text-xs flex items-center gap-2 border-2 border-zinc-900 transition min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Anterior</span>
            </button>

            <button
              disabled={currentIndex === items.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1))}
              className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-30 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 border-2 border-zinc-950 transition min-h-[44px]"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Keyboard Shortcuts Hint Bar */}
          <div className="hidden sm:flex items-center justify-center gap-4 pt-4 text-[11px] text-zinc-600 font-bold">
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-zinc-100 border-2 border-zinc-900 rounded text-zinc-950 text-[10px] font-black">A–D</kbd>
              responder
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-zinc-100 border-2 border-zinc-900 rounded text-zinc-950 text-[10px] font-black">F</kbd>
              marcar revisión
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-zinc-100 border-2 border-zinc-900 rounded text-zinc-950 text-[10px] font-black">←</kbd>
              <kbd className="px-2 py-0.5 bg-zinc-100 border-2 border-zinc-900 rounded text-zinc-950 text-[10px] font-black">→</kbd>
              navegar
            </span>
          </div>
        </main>
      </div>

      {/* Formula Reference Modal */}
      {isFormulaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border-2 border-zinc-900 shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b-2 border-zinc-900 flex items-center justify-between bg-zinc-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-zinc-900 stroke-[2.5]" />
                <h3 className="text-base font-black text-zinc-900 uppercase">Simbología y Fórmulas del Examen (BXM)</h3>
              </div>
              <button
                onClick={() => setIsFormulaOpen(false)}
                className="p-2 text-zinc-900 hover:bg-zinc-200 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-900 font-medium">
              {/* Geometria */}
              <div className="space-y-3">
                <h4 className="font-black text-zinc-900 border-b-2 border-zinc-900 pb-1 uppercase tracking-wide text-xs">
                  Geometría y Circunferencia
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Ecuación de la Circunferencia:</span>
                    <TextRenderer content="$(x - h)^2 + (y - k)^2 = r^2$" />
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Área y Perímetro del Círculo:</span>
                    <TextRenderer content="$A = \pi r^2 \quad | \quad P = 2\pi r$" />
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Polígono Regular (Suma de Ángulos Int.):</span>
                    <TextRenderer content="$S_i = 180^\circ (n - 2)$" />
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Área Regular / Apotema:</span>
                    <TextRenderer content="$A = \frac{P \cdot a}{2}$" />
                  </div>
                </div>
              </div>

              {/* Funciones y Algebra */}
              <div className="space-y-3">
                <h4 className="font-black text-zinc-900 border-b-2 border-zinc-900 pb-1 uppercase tracking-wide text-xs">
                  Funciones y Álgebra
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Función Lineal:</span>
                    <TextRenderer content="$f(x) = mx + b \quad (m = \frac{y_2 - y_1}{x_2 - x_1})$" />
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Vértice de Parábola (Cuadrática):</span>
                    <TextRenderer content="$V = \left( -\frac{b}{2a}, -\frac{\Delta}{4a} \right), \quad \Delta = b^2 - 4ac$" />
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Función Exponencial y Logarítmica:</span>
                    <TextRenderer content="$f(x) = a^x \iff f^{-1}(x) = \log_a(x)$" />
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Interés Compuesto:</span>
                    <TextRenderer content="$C(t) = C_0 (1 + i)^t$" />
                  </div>
                </div>
              </div>

              {/* Estadistica y Probabilidad */}
              <div className="space-y-3">
                <h4 className="font-black text-zinc-900 border-b-2 border-zinc-900 pb-1 uppercase tracking-wide text-xs">
                  Estadística y Probabilidad
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">
                      Media Aritmética (<TextRenderer inline content="$\bar{x}$" />):
                    </span>
                    <TextRenderer content="$\bar{x} = \frac{\sum x_i}{n}$" />
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1">
                    <span className="font-black block text-zinc-900">Recorrido Intercuartílico (RIC):</span>
                    <TextRenderer content="$RIC = Q_3 - Q_1$" />
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border-2 border-zinc-900 space-y-1 sm:col-span-2">
                    <span className="font-black block text-zinc-900">Probabilidad Laplace:</span>
                    <TextRenderer content="$P(A) = \frac{\text{Casos favorables}}{\text{Casos posibles}}$" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t-2 border-zinc-900 bg-zinc-100 text-right">
              <button
                onClick={() => setIsFormulaOpen(false)}
                className="px-5 py-2.5 bg-zinc-950 text-white font-extrabold rounded-xl text-xs border-2 border-zinc-950 min-h-[44px]"
              >
                Cerrar Fórmulas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border-2 border-zinc-900 shadow-2xl">
            <div className="w-12 h-12 bg-zinc-100 text-zinc-950 rounded-full border-2 border-zinc-900 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 uppercase">¿Entregar la prueba?</h3>
              <p className="text-xs text-zinc-700 font-bold mt-1">
                Has respondido {answeredCount} de {items.length} preguntas.
                {items.length - answeredCount > 0 && (
                  <span className="block text-zinc-900 font-black mt-1">
                    Atención: Quedan {items.length - answeredCount} preguntas sin responder.
                  </span>
                )}
                {flaggedCount > 0 && (
                  <span className="block text-zinc-800 mt-1">
                    Tienes {flaggedCount} pregunta{flaggedCount === 1 ? '' : 's'} marcada{flaggedCount === 1 ? '' : 's'} para revisión.
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-extrabold rounded-xl text-xs border-2 border-zinc-900 min-h-[44px]"
              >
                Seguir respondiendo
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold rounded-xl text-xs border-2 border-zinc-950 min-h-[44px]"
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
