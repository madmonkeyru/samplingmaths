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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            {initialMode === 'area' ? <Layers className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {initialMode === 'area' ? 'Práctica por Área' : 'Práctica por Tema'}
          </h2>
        </div>

        <form onSubmit={handleStart} className="space-y-4">
          {/* Area Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Área temática</label>
            <select
              value={selectedArea}
              onChange={(e) => {
                const area = e.target.value as DomainArea;
                setSelectedArea(area);
                setSelectedTopic('all');
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="geometry">Geometría (23 ítems)</option>
              <option value="functions">Relaciones y Álgebra (25 ítems)</option>
              <option value="statistics">Estadística y Probabilidad (12 ítems)</option>
            </select>
          </div>

          {/* Topic Selector (if mode is topic) */}
          {initialMode === 'topic' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tema específico</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad de preguntas</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 'all'].map((count) => (
                <button
                  type="button"
                  key={String(count)}
                  onClick={() => setItemCount(count as number | 'all')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    itemCount === count
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {count === 'all' ? 'Todas' : `${count}`}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Config */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                Temporizador
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTimer}
                  onChange={(e) => setEnableTimer(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
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
                  className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">minutos</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow transition flex items-center justify-center gap-2 mt-4"
          >
            <Play className="w-4 h-4 fill-current" />
            Iniciar práctica
          </button>
        </form>
      </div>
    </div>
  );
};
