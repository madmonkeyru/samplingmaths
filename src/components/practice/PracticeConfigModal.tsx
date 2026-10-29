import React, { useState } from 'react';
import { DomainArea, PracticeConfig } from '../../types';
import { dataService } from '../../services/dataService';
import { X, Play, Clock, Target, Layers } from 'lucide-react';

interface PracticeConfigModalProps {
  isOpen: boolean;
  initialMode: 'area' | 'topic';
  onClose: () => void;
  onStartSession: (config: PracticeConfig) => void;
}

export const PracticeConfigModal: React.FC<PracticeConfigModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onStartSession,
}) => {
  const [selectedArea, setSelectedArea] = useState<DomainArea>('geometry');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [itemCount, setItemCount] = useState<number | 'all'>(10);
  const [enableTimer, setEnableTimer] = useState<boolean>(true);
  const [timerDuration, setTimerDuration] = useState<number>(30);

  if (!isOpen) return null;

  const availableTopics = dataService.getTopicsByArea(selectedArea);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const config: PracticeConfig = {
      mode: initialMode,
      area: selectedArea,
      topic: initialMode === 'topic' ? selectedTopic : 'all',
      itemCount,
      enableTimer,
      timerDurationMinutes: timerDuration,
    };
    onStartSession(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-3.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border-2 border-zinc-900 shadow-2xl max-w-lg w-full p-5 sm:p-6 relative my-auto">
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 text-zinc-900 hover:bg-zinc-100 p-2 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-5 border-b-2 border-zinc-900 pb-3">
          <div className="p-2 sm:p-2.5 bg-zinc-950 text-white rounded-xl border-2 border-zinc-900 shrink-0">
            {initialMode === 'area' ? <Layers className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-zinc-900 uppercase">
            {initialMode === 'area' ? 'Práctica por Área' : 'Práctica por Tema'}
          </h2>
        </div>

        <form onSubmit={handleStart} className="space-y-5">
          {/* Area Selector */}
          <div>
            <label className="block text-xs font-black text-zinc-900 mb-1.5 uppercase">Área temática</label>
            <select
              value={selectedArea}
              onChange={(e) => {
                const area = e.target.value as DomainArea;
                setSelectedArea(area);
                setSelectedTopic('all');
              }}
              className="w-full px-3.5 py-2.5 border-2 border-zinc-900 rounded-xl text-xs font-extrabold bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 min-h-[44px]"
            >
              <option value="geometry">Geometría (50 ítems)</option>
              <option value="functions">Relaciones y Álgebra (25 ítems)</option>
              <option value="statistics">Estadística y Probabilidad (12 ítems)</option>
            </select>
          </div>

          {/* Topic Selector */}
          {initialMode === 'topic' && (
            <div>
              <label className="block text-xs font-black text-zinc-900 mb-1.5 uppercase">Tema específico</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-zinc-900 rounded-xl text-xs font-extrabold bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 min-h-[44px]"
              >
                <option value="all">Todos los temas de esta área</option>
                {availableTopics.map((topic, i) => (
                  <option key={i} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Item Count */}
          <div>
            <label className="block text-xs font-black text-zinc-900 mb-1.5 uppercase">Cantidad de preguntas</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 'all'].map((count) => (
                <button
                  type="button"
                  key={String(count)}
                  onClick={() => setItemCount(count as number | 'all')}
                  className={`py-2.5 text-xs font-black rounded-xl border-2 transition min-h-[44px] ${
                    itemCount === count
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {count === 'all' ? 'Todas' : `${count}`}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Config */}
          <div className="pt-3 border-t-2 border-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-zinc-900 uppercase flex items-center gap-1.5">
                <Clock className="w-4 h-4 stroke-[2.5]" />
                Temporizador
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTimer}
                  onChange={(e) => setEnableTimer(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-zinc-200 border-2 border-zinc-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-950 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-zinc-950 after:border-zinc-950 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-950 peer-checked:after:bg-white"></div>
              </label>
            </div>

            {enableTimer && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Number(e.target.value))}
                  className="w-24 px-3 py-2 border-2 border-zinc-900 rounded-xl text-xs font-black text-center focus:outline-none focus:ring-2 focus:ring-zinc-950 min-h-[44px]"
                />
                <span className="text-xs text-zinc-700 font-bold uppercase">minutos</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold rounded-xl text-xs border-2 border-zinc-950 shadow transition flex items-center justify-center gap-2 mt-5 min-h-[44px]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar Práctica</span>
          </button>
        </form>
      </div>
    </div>
  );
};
