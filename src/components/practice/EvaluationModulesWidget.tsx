import React, { useState } from 'react';
import { DomainArea, PracticeConfig } from '../../types';
import { dataService } from '../../services/dataService';
import { Play, Clock, Target, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export interface EvaluationModulesWidgetProps {
  onStartSimulation: () => void;
  onStartPractice: (config: PracticeConfig) => void;
  className?: string;
}

export const EvaluationModulesWidget: React.FC<EvaluationModulesWidgetProps> = ({
  onStartSimulation,
  onStartPractice,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'area' | 'topic'>('simulation');

  // Practice configuration state
  const [selectedSet, setSelectedSet] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<DomainArea>('geometry');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [itemCount, setItemCount] = useState<number | 'all'>(10);
  const [enableTimer, setEnableTimer] = useState<boolean>(true);
  const [timerDuration, setTimerDuration] = useState<number>(30);

  const sets = dataService.getSets();
  const availableTopics = dataService.getTopicsByArea(selectedArea, selectedSet);

  const geoCount = dataService.getItemsByArea('geometry', selectedSet).length;
  const funcCount = dataService.getItemsByArea('functions', selectedSet).length;
  const statCount = dataService.getItemsByArea('statistics', selectedSet).length;

  const handleStartPractice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const config: PracticeConfig = {
      mode: activeTab === 'topic' ? 'topic' : 'area',
      setId: selectedSet,
      area: selectedArea,
      topic: activeTab === 'topic' ? selectedTopic : 'all',
      itemCount,
      enableTimer,
      timerDurationMinutes: timerDuration,
    };
    onStartPractice(config);
  };

  return (
    <div
      className={`lg:col-span-7 bg-[#fefcf8] dark:bg-slate-900 border-2 border-stone-800 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col justify-between min-h-[380px] ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-stone-200 dark:border-slate-800">
          <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center gap-2">
            <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
            Módulos de Evaluación y Práctica
          </span>
        </div>

        {/* Segmented Control Toggle */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-stone-200/80 dark:bg-slate-800/80 rounded-xl border-2 border-stone-300 dark:border-slate-700 mb-6">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`py-2 px-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'simulation'
                ? 'bg-indigo-600 text-white shadow-xs border border-indigo-700'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Simulación</span>
          </button>

          <button
            onClick={() => setActiveTab('area')}
            className={`py-2 px-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'area'
                ? 'bg-indigo-600 text-white shadow-xs border border-indigo-700'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Por Área</span>
          </button>

          <button
            onClick={() => setActiveTab('topic')}
            className={`py-2 px-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'topic'
                ? 'bg-indigo-600 text-white shadow-xs border border-indigo-700'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Por Tema</span>
          </button>
        </div>

        {/* Dynamic Content Details based on Selected Tab */}
        {activeTab === 'simulation' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-slate-100">
                  Prueba de Simulación Oficial
                </h3>
                <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed font-medium mt-1">
                  Examen completo de 60 ítems (preguntas) cronometrado a 150 minutos (2 horas y media).
                </p>
              </div>
            </div>

            <div className="bg-stone-100/80 dark:bg-slate-800/60 rounded-xl p-3.5 border border-stone-200 dark:border-slate-700 text-xs space-y-1.5 text-stone-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>60 ítems distribuidos entre Geometría, Álgebra y Estadística</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Cronómetro oficial de 150 minutos con revisión final</span>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'area' || activeTab === 'topic') && (
          <form onSubmit={handleStartPractice} className="space-y-4 animate-in fade-in duration-200">
            {/* Header description */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                {activeTab === 'area' ? (
                  <Layers className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <Target className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-slate-100">
                  {activeTab === 'area' ? 'Práctica Enfocada por Área' : 'Práctica Específica por Tema'}
                </h3>
                <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed font-medium mt-0.5">
                  {activeTab === 'area'
                    ? 'Selecciona el área temática y ajusta la cantidad de ítems.'
                    : 'Selecciona el área y el tema puntual para ejercitar objetivos concretos.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Set Selector */}
              <div>
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-slate-300 mb-1">
                  Conjunto de Preguntas
                </label>
                <select
                  value={selectedSet}
                  onChange={(e) => {
                    setSelectedSet(e.target.value);
                    setSelectedTopic('all');
                  }}
                  className="w-full px-3 py-2 border-2 border-stone-800 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[40px]"
                >
                  <option value="all">Todos los conjuntos ({dataService.getAllItems().length} ítems)</option>
                  {sets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.total_items} ítems)
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Selector */}
              <div>
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-slate-300 mb-1">
                  Área Temática
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => {
                    const area = e.target.value as DomainArea;
                    setSelectedArea(area);
                    setSelectedTopic('all');
                  }}
                  className="w-full px-3 py-2 border-2 border-stone-800 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[40px]"
                >
                  <option value="geometry">Geometría ({geoCount} ítems)</option>
                  <option value="functions">Relaciones y Álgebra ({funcCount} ítems)</option>
                  <option value="statistics">Estadística y Probabilidad ({statCount} ítems)</option>
                </select>
              </div>
            </div>

            {/* Topic Selector for Topic Mode */}
            {activeTab === 'topic' && (
              <div>
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-slate-300 mb-1">
                  Tema Específico
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-stone-800 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[40px]"
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

            {/* Item Count and Timer Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-200 dark:border-slate-800">
              <div>
                <label className="block text-[11px] font-black uppercase text-stone-700 dark:text-slate-300 mb-1">
                  Preguntas
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[5, 10, 20, 'all'].map((count) => (
                    <button
                      type="button"
                      key={String(count)}
                      onClick={() => setItemCount(count as number | 'all')}
                      className={`py-1.5 text-xs font-extrabold rounded-lg border-2 transition min-h-[36px] cursor-pointer ${
                        itemCount === count
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {count === 'all' ? 'Todas' : `${count}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-black uppercase text-stone-700 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Temporizador
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableTimer}
                      onChange={(e) => setEnableTimer(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 dark:bg-slate-700 border-2 border-stone-700 dark:border-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {enableTimer ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={timerDuration}
                      onChange={(e) => setTimerDuration(Number(e.target.value))}
                      className="w-20 px-2.5 py-1.5 border-2 border-stone-800 dark:border-slate-700 rounded-lg text-xs font-black text-center bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[36px]"
                    />
                    <span className="text-xs text-stone-600 dark:text-slate-400 font-bold uppercase">min</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 dark:text-slate-500 font-medium mt-1">Sin límite de tiempo</p>
                )}
              </div>
            </div>
          </form>
        )}
      </div>

      {activeTab === 'simulation' ? (
        <button
          onClick={onStartSimulation}
          className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition border-2 border-indigo-700 shadow-xs min-h-[44px] cursor-pointer"
        >
          <span>Iniciar Simulación</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      ) : (
        <button
          onClick={() => handleStartPractice()}
          className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition border-2 border-indigo-700 shadow-xs min-h-[44px] cursor-pointer"
        >
          <span>
            {activeTab === 'area'
              ? 'Iniciar Práctica por Área'
              : 'Iniciar Práctica por Tema'}
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      )}
    </div>
  );
};
