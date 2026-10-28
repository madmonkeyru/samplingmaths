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
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-4 transform transition-transform lg:static lg:translate-x-0 ${
            isNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800">Navegador de Ítems</h3>
            <button onClick={() => setIsNavOpen(false)} className="lg:hidden text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            {items.map((it, idx) => {
              const isAnswered = !!responses[it.id]?.selectedOption;
              const isFlagged = !!flaggedItems[it.id];
              const isCurrent = idx === currentIndex;

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
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                  flaggedItems[currentItem.id]
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Flag className="w-3.5 h-3.5 fill-current" />
                <span>{flaggedItems[currentItem.id] ? 'Marcada' : 'Marcar revisión'}</span>
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

            {/* Answer Options Selector (FR-A-01) */}
            <div className="space-y-3 pt-2">
              {getOptionArray(currentItem).map((opt) => {
                const selected = responses[currentItem.id]?.selectedOption === opt.letter;
                return (
                  <button
                    key={opt.letter}
                    onClick={() => handleSelectOption(opt.letter)}
                    className={`w-full text-left p-4 rounded-xl border-2 flex items-start gap-3.5 transition ${
                      selected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition ${
                        selected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {opt.letter}
                    </span>
                    <div className="text-sm text-slate-800 pt-0.5 leading-normal">
                      <TextRenderer content={opt.text} />
                    </div>
                  </button>
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
        </main>
      </div>

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
