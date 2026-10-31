import React, { useState, useEffect } from 'react';
import { DomainArea, PracticeConfig, ProgramInfo } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Play,
  Layers,
  Target,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Calculator,
  Ban,
} from 'lucide-react';

interface EvaluationModulesWidgetProps {
  onStartSimulation: () => void;
  onStartPractice: (config: PracticeConfig) => void;
}

export const EvaluationModulesWidget: React.FC<EvaluationModulesWidgetProps> = ({
  onStartSimulation,
  onStartPractice,
}) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'area' | 'topic'>('simulation');
  const [activeProgram, setActiveProgram] = useState<ProgramInfo | undefined>(dataService.getCurrentProgram());

  // Practice state
  const [selectedSet, setSelectedSet] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<DomainArea>('geometry');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [itemCount, setItemCount] = useState<number | 'all'>(10);
  const [enableTimer, setEnableTimer] = useState<boolean>(true);
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<string>(
    dataService.getCurrentConvocatoriaId() || '2026-c2'
  );

  useEffect(() => {
    const updateProgram = () => {
      setActiveProgram(dataService.getCurrentProgram());
      setSelectedConvocatoria(dataService.getCurrentConvocatoriaId() || '2026-c2');
    };
    updateProgram();
    const unsubscribe = dataService.subscribe(updateProgram);
    return unsubscribe;
  }, []);

  const sets = dataService.getSets();
  const availableTopics = dataService.getTopicsByArea(selectedArea, selectedSet);

  const geoCount = dataService.getItemsByArea('geometry', selectedSet).length;
  const funcCount = dataService.getItemsByArea('functions', selectedSet).length;
  const statCount = dataService.getItemsByArea('statistics', selectedSet).length;

  const isCalcAllowed = dataService.isCalculatorAllowed();
  const passingScore = dataService.getPassingScore();

  const handleStartPractice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const config: PracticeConfig = {
      mode: activeTab === 'area' ? 'area' : 'topic',
      programId: dataService.getCurrentProgramId(),
      convocatoriaId: selectedConvocatoria,
      setId: selectedSet,
      area: selectedArea,
      topic: activeTab === 'topic' && selectedTopic !== 'all' ? selectedTopic : undefined,
      itemCount: itemCount,
      enableTimer: enableTimer,
      timerDurationMinutes: timerDuration,
    };

    onStartPractice(config);
  };

  return (
    <div className="lg:col-span-7 bg-[#fefcf8] dark:bg-slate-900 border-2 border-stone-800 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header with Title and Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b-2 border-stone-200 dark:border-slate-800 mb-4">
          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-slate-300 truncate">
              Módulos de Evaluación ({activeProgram?.name || 'BXM'})
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-slate-400 font-bold mt-0.5">
              Simulador oficial y banco modular
            </p>
          </div>

          {/* Segmented Control Buttons */}
          <div className="flex bg-stone-100 dark:bg-slate-800 p-1 rounded-xl border border-stone-300 dark:border-slate-700 gap-1 text-xs font-bold w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('simulation')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[34px] cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-indigo-600 text-white font-black shadow-2xs'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Play className="w-3 h-3 stroke-[2.5]" />
              <span>Simulación</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('area')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[34px] cursor-pointer ${
                activeTab === 'area'
                  ? 'bg-indigo-600 text-white font-black shadow-2xs'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3 stroke-[2.5]" />
              <span>Por Área</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('topic')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[34px] cursor-pointer ${
                activeTab === 'topic'
                  ? 'bg-indigo-600 text-white font-black shadow-2xs'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Target className="w-3 h-3 stroke-[2.5]" />
              <span>Por Tema</span>
            </button>
          </div>
        </div>

        {/* Program Constraint Banner */}
        <div className="flex items-center justify-between bg-stone-100/70 dark:bg-slate-800/40 p-2.5 rounded-xl border border-stone-200 dark:border-slate-700/80 text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-4">
          <div className="flex items-center gap-2">
            {isCalcAllowed ? (
              <Calculator className="w-3.5 h-3.5 text-stone-500" />
            ) : (
              <Ban className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>
              {isCalcAllowed
                ? 'Uso de calculadora estándar o científica permitido'
                : 'I y II Ciclo: Uso de calculadora estrictamente prohibido'}
            </span>
          </div>
          <div className="text-indigo-600 dark:text-indigo-400 font-black">
            Nota mínima: {passingScore}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'simulation' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100/60 dark:bg-slate-800/40 p-3 rounded-xl border border-stone-200 dark:border-slate-700/60">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 stroke-[2.2] fill-current" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-slate-100">
                    Simulación Oficial MEP
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed font-medium mt-0.5">
                    Prueba de 60 reactivos con cronómetro oficial de 150 minutos.
                  </p>
                </div>
              </div>

              {/* Convocatoria Selector Repositioned Here */}
              <div className="flex items-center gap-2 self-start sm:self-center bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border-2 border-stone-300 dark:border-slate-600 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[11px] font-bold text-stone-600 dark:text-slate-400">Convocatoria:</span>
                <select
                  value={selectedConvocatoria}
                  onChange={(e) => {
                    setSelectedConvocatoria(e.target.value);
                    dataService.setConvocatoriaId(e.target.value);
                  }}
                  className="bg-transparent text-xs font-black text-stone-900 dark:text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="2026-c2">02-2026</option>
                  <option value="2026-c1">01-2026</option>
                </select>
              </div>
            </div>

            <div className="bg-amber-50/60 dark:bg-slate-800/60 p-3.5 rounded-xl border border-amber-200/70 dark:border-slate-700 space-y-1.5 text-xs text-stone-700 dark:text-slate-300 font-medium">
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
