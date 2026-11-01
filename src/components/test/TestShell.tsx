import React, { useState, useEffect } from 'react';
import type { Item, TestSession, ItemResponse, PracticeConfig } from '../../types';
import { dataService } from '../../services/dataService';
import { storageService } from '../../services/storageService';
import { TextRenderer } from '../common/TextRenderer';
import { VisualRenderer } from '../visuals/VisualRenderer';
import { GroupVisual } from '../visuals/GroupVisual';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Menu,
  X,
  BookOpen,
  CheckCircle2,
  XCircle,
  Ban,
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
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
    config.timerDurationMinutes * 60
  );
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isFormulaOpen, setIsFormulaOpen] = useState<boolean>(false);
  const [navFilter, setNavFilter] = useState<'all' | 'unanswered' | 'answered' | 'flagged'>('all');
  const [showPracticeExplanation, setShowPracticeExplanation] = useState<Record<number, boolean>>({});

  const isCalculatorAllowed = dataService.isCalculatorAllowed();
  const currentProgram = dataService.getCurrentProgram();

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (key === 'escape') {
        setIsNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, currentIndex, isConfirmOpen]);

  // Initialize Items
  useEffect(() => {
    let pool: Item[] = [];
    if (config.mode === 'simulation') {
      pool = dataService.getSimulationItems(config.setId || 'set_1');
    } else if (config.mode === 'area' && config.area && config.area !== 'all') {
      pool = dataService.getItemsByArea(config.area, config.setId);
    } else if (config.mode === 'topic' && config.topic && config.topic !== 'all') {
      pool = dataService.getItemsByTopic(config.topic, config.setId);
    } else {
      pool = dataService.getItemsBySet(config.setId || 'all');
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
      <div className="max-w-4xl mx-auto p-8 text-center text-zinc-900 dark:text-zinc-100 font-bold">
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
    <div className="test-shell min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors">
      {/* Test Shell Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 sm:top-14 z-30 px-3.5 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="lg:hidden p-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Abrir navegador de ítems"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  Pregunta {currentIndex + 1} de {items.length}
                </span>
                {!isCalculatorAllowed && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                    <Ban className="w-2.5 h-2.5" /> Sin Calc
                  </span>
                )}
              </div>
              <div className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider truncate">
                {currentItem.topic || currentItem.area} ({currentProgram?.name || 'BXM'})
              </div>
            </div>
          </div>

          {/* Progress Bar & Timer & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Theme Toggle Button for Mobile and Desktop */}
            <ThemeToggle className="shrink-0" />

            <div className="hidden md:flex flex-col items-end w-32 shrink-0">
              <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                {progressPct}% ({answeredCount}/{items.length})
              </div>
              <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <div
                  className="h-full bg-zinc-950 dark:bg-zinc-100 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsFormulaOpen(true)}
              className="px-3 sm:px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 transition min-h-[44px] cursor-pointer"
              title="Ver fórmulas del examen"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span className="hidden sm:inline">Fórmulas</span>
            </button>

            {config.enableTimer && (
              <div
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 min-h-[44px] ${
                  timeLeftSeconds < 300
                    ? 'bg-zinc-950 text-white dark:bg-red-950 dark:text-red-100 dark:border-red-600 animate-pulse'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
                <span className="text-[11px] sm:text-xs">{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => setIsConfirmOpen(true)}
              className="px-3.5 sm:px-4 py-2 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition min-h-[44px] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
              <span className="hidden xs:inline sm:inline">Finalizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto w-full px-3.5 sm:px-6 py-4 sm:py-6 flex-1 flex gap-6 relative">
        {/* Mobile Backdrop Overlay for Drawer */}
        {isNavOpen && (
          <div
            onClick={() => setIsNavOpen(false)}
            className="fixed inset-0 bg-zinc-950/60 z-35 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Navigation Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col transform transition-transform lg:static lg:translate-x-0 lg:sticky lg:top-[124px] lg:self-start lg:max-h-[calc(100vh-140px)] lg:w-72 lg:shrink-0 lg:border lg:rounded-2xl lg:shadow-xs ${
            isNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button for Mobile Drawer only */}
          <div className="lg:hidden flex items-center justify-end pb-2 mb-2">
            <button
              onClick={() => setIsNavOpen(false)}
              className="p-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Cerrar navegador de ítems"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 mb-3 gap-1 text-[11px] font-bold">
            <button
              onClick={() => setNavFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-center transition min-h-[36px] cursor-pointer ${
                navFilter === 'all'
                  ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setNavFilter('unanswered')}
              className={`flex-1 py-1.5 rounded-lg text-center transition min-h-[36px] cursor-pointer ${
                navFilter === 'unanswered'
                  ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setNavFilter('answered')}
              className={`flex-1 py-1.5 rounded-lg text-center transition min-h-[36px] cursor-pointer ${
                navFilter === 'answered'
                  ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              Listas
            </button>
            <button
              onClick={() => setNavFilter('flagged')}
              className={`flex-1 py-1.5 rounded-lg text-center transition min-h-[36px] cursor-pointer ${
                navFilter === 'flagged'
                  ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              Marcadas
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 overflow-y-auto flex-1 max-h-[calc(100vh-280px)] p-1.5">
            {items.map((it, idx) => {
              const isAnswered = !!responses[it.id]?.selectedOption;
              const isFlagged = !!flaggedItems[it.id];
              const isCurrent = idx === currentIndex;

              if (navFilter === 'unanswered' && isAnswered) return null;
              if (navFilter === 'answered' && !isAnswered) return null;
              if (navFilter === 'flagged' && !isFlagged) return null;

              let btnClass = 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700';
              if (isAnswered) btnClass = 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-200 dark:border-zinc-700 font-semibold';
              if (isCurrent) btnClass += ' ring-2 ring-indigo-600 dark:ring-indigo-400 ring-offset-1 dark:ring-offset-zinc-900 font-semibold';

              return (
                <button
                  key={it.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsNavOpen(false);
                  }}
                  className={`relative h-10 w-10 rounded-xl text-xs font-bold border flex items-center justify-center transition cursor-pointer ${btnClass}`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-zinc-950 dark:bg-yellow-400 border border-white dark:border-zinc-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigator Legend */}
          <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-800 dark:text-zinc-200 font-bold space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-zinc-950 dark:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 shrink-0" />
              <span>Respondida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0" />
              <span>Sin responder</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-zinc-950 dark:bg-yellow-400 border border-white dark:border-zinc-900 shrink-0" />
              <span>Marcada para revisión</span>
            </div>
          </div>
        </aside>

        {/* Question Area */}
        <main className="flex-1 ui-surface rounded-2xl p-4 sm:p-8 shadow-xs flex flex-col justify-between max-w-full overflow-hidden">
          <div className="space-y-5 sm:space-y-6">
            {/* Question Bar Header */}
            <div className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="min-w-0 flex flex-col">
                <span className="text-[11px] sm:text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider truncate">
                  {currentItem.spec?.block ? `${currentItem.spec.block}` : currentItem.area}
                </span>
                {currentItem.spec?.evidence_desc && (
                  <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mt-0.5 leading-tight">
                    {currentItem.spec.evidence}: {currentItem.spec.evidence_desc}
                  </span>
                )}
              </div>

              <button
                onClick={handleToggleFlag}
                title="Atajo de teclado: F o M"
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold border transition min-h-[44px] shrink-0 cursor-pointer ${
                  flaggedItems[currentItem.id]
                    ? 'bg-zinc-950 dark:bg-zinc-100 border-zinc-200 dark:border-zinc-700 text-white dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Flag className="w-4 h-4 fill-current shrink-0" />
                <span className="hidden xs:inline">{flaggedItems[currentItem.id] ? 'Marcada [F]' : 'Marcar [F]'}</span>
                <span className="xs:hidden">{flaggedItems[currentItem.id] ? 'Marcada' : 'Marcar'}</span>
              </button>
            </div>

            {/* Shared Group Visual Context */}
            {group && <GroupVisual group={group} />}

            {/* Question Stem */}
            <div className="text-base text-zinc-900 dark:text-zinc-100 leading-relaxed font-bold">
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
                    className="px-4 py-2.5 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold rounded-xl text-xs flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 transition min-h-[44px] cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white dark:text-zinc-950" />
                    <span>Verificar respuesta y ver explicación</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3 bg-zinc-50 dark:bg-zinc-800/60">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      {responses[currentItem.id]?.selectedOption === currentItem.correct_answer ? (
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                          <span>¡Respuesta Correcta! (Opción {currentItem.correct_answer})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                          <XCircle className="w-5 h-5 stroke-[2.5]" />
                          <span>Respuesta Incorrecta. La opción correcta es {currentItem.correct_answer}.</span>
                        </div>
                      )}
                    </div>

                    {currentItem.solution_steps && currentItem.solution_steps.length > 0 && (
                      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs space-y-2">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block text-[11px]">
                          Solución paso a paso:
                        </span>
                        {currentItem.solution_steps.map((step, sIdx) => (
                          <div key={sIdx} className="bg-white dark:bg-zinc-900 p-3 rounded-lg font-medium">
                            {typeof step === 'string' ? (
                              <TextRenderer content={step} />
                            ) : (
                              <div>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{step.title}: </span>
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

            {/* Answer Options Selector */}
            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
              {getOptionArray(currentItem).map((opt) => {
                const selected = responses[currentItem.id]?.selectedOption === opt.letter;

                let optionContainerStyle = 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100';
                if (selected) {
                  optionContainerStyle = 'border-zinc-200 dark:border-zinc-700 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold';
                }

                return (
                  <button
                    key={opt.letter}
                    onClick={() => handleSelectOption(opt.letter)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border flex items-start gap-2.5 sm:gap-3.5 transition min-h-[52px] cursor-pointer ${optionContainerStyle}`}
                  >
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 transition border ${
                        selected
                          ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white border-white dark:border-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700'
                      }`}
                      title={`Presiona ${opt.letter} o ${getOptionArray(currentItem).findIndex(o => o.letter === opt.letter) + 1}`}
                    >
                      {opt.letter}
                    </span>
                    <div className="text-xs sm:text-sm pt-0.5 sm:pt-1 leading-normal flex-1 font-bold">
                      <TextRenderer content={opt.text} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-5 sm:pt-8 border-t border-zinc-200 dark:border-zinc-800 mt-6 sm:mt-8 gap-3">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 sm:px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 text-zinc-950 dark:text-zinc-100 font-semibold rounded-xl text-xs flex items-center gap-1.5 sm:gap-2 border border-zinc-200 dark:border-zinc-700 transition min-h-[44px] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span>Anterior</span>
            </button>

            <button
              disabled={currentIndex === items.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1))}
              className="px-4 sm:px-5 py-2.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-30 text-white dark:text-zinc-950 font-semibold rounded-xl text-xs flex items-center gap-1.5 sm:gap-2 border border-zinc-200 dark:border-zinc-700 transition min-h-[44px] cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] shrink-0" />
            </button>
          </div>

          {/* Keyboard Shortcuts Hint Bar */}
          <div className="hidden sm:flex items-center justify-center gap-4 pt-4 text-[11px] text-zinc-600 dark:text-zinc-400 font-bold">
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-950 dark:text-zinc-100 text-[10px] font-semibold">A–D</kbd>
              responder
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-950 dark:text-zinc-100 text-[10px] font-semibold">F</kbd>
              marcar revisión
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-950 dark:text-zinc-100 text-[10px] font-semibold">←</kbd>
              <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-950 dark:text-zinc-100 text-[10px] font-semibold">→</kbd>
              navegar
            </span>
          </div>
        </main>
      </div>

      {/* Formula Reference Modal */}
      {isFormulaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between bg-zinc-100 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
                <h3 className="text-base font-semibold ">
                  {currentProgram?.id === 'bxm'
                    ? 'Simbología y Fórmulas del Examen (BXM)'
                    : `Simbología y Fórmulas (${currentProgram?.name || 'BXM'})`}
                </h3>
              </div>
              <button
                onClick={() => setIsFormulaOpen(false)}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm font-medium">
              {/* Geometria */}
              <div className="space-y-3">
                <h4 className="font-semibold border-b border-zinc-200 dark:border-zinc-700 pb-1 text-xs">
                  Geometría
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Ecuación de la Circunferencia:</span>
                    <TextRenderer content="$(x - h)^2 + (y - k)^2 = r^2$" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Área y Perímetro del Círculo:</span>
                    <TextRenderer content="$A = \pi r^2 \quad | \quad P = 2\pi r$" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Polígono Regular (Suma de Ángulos Int.):</span>
                    <TextRenderer content="$S_i = 180^\circ (n - 2)$" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Área Regular / Apotema:</span>
                    <TextRenderer content="$A = \frac{P \cdot a}{2}$" />
                  </div>
                </div>
              </div>

              {/* Funciones y Algebra */}
              <div className="space-y-3">
                <h4 className="font-semibold border-b border-zinc-200 dark:border-zinc-700 pb-1 text-xs">
                  Funciones y Álgebra
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Función Lineal:</span>
                    <TextRenderer content="$f(x) = mx + b \quad (m = \frac{y_2 - y_1}{x_2 - x_1})$" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Vértice de Parábola (Cuadrática):</span>
                    <TextRenderer content="$V = \left( -\frac{b}{2a}, -\frac{\Delta}{4a} \right), \quad \Delta = b^2 - 4ac$" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Función Exponencial y Logarítmica:</span>
                    <TextRenderer content="$f(x) = a^x \iff f^{-1}(x) = \log_a(x)$" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Interés Compuesto:</span>
                    <TextRenderer content="$C(t) = C_0 (1 + i)^t$" />
                  </div>
                </div>
              </div>

              {/* Estadistica y Probabilidad */}
              <div className="space-y-3">
                <h4 className="font-semibold border-b border-zinc-200 dark:border-zinc-700 pb-1 text-xs">
                  Estadística y Probabilidad
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">
                      Media Aritmética (<TextRenderer inline content="$\bar{x}$" />):
                    </span>
                    <TextRenderer content="$\bar{x} = \frac{\sum x_i}{n}$" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block">Recorrido Intercuartílico (RIC):</span>
                    <TextRenderer content="$RIC = Q_3 - Q_1$" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl space-y-1 sm:col-span-2">
                    <span className="font-semibold block">Probabilidad Laplace:</span>
                    <TextRenderer content="$P(A) = \frac{\text{Casos favorables}}{\text{Casos posibles}}$" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-right">
              <button
                onClick={() => setIsFormulaOpen(false)}
                className="px-5 py-2.5 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 min-h-[44px] cursor-pointer"
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
          <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border border-zinc-200 dark:border-zinc-700 shadow-2xl">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold ">¿Entregar la prueba?</h3>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-bold mt-1">
                Has respondido {answeredCount} de {items.length} preguntas.
                {items.length - answeredCount > 0 && (
                  <span className="block text-zinc-900 dark:text-zinc-100 font-semibold mt-1">
                    Atención: Quedan {items.length - answeredCount} preguntas sin responder.
                  </span>
                )}
                {flaggedCount > 0 && (
                  <span className="block text-zinc-800 dark:text-zinc-200 mt-1">
                    Tienes {flaggedCount} pregunta{flaggedCount === 1 ? '' : 's'} marcada{flaggedCount === 1 ? '' : 's'} para revisión.
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 min-h-[44px] cursor-pointer"
              >
                Seguir respondiendo
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 min-h-[44px] cursor-pointer"
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
