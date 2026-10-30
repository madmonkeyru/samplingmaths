import React, { useState } from 'react';
import { User, Attempt, PracticeConfig } from '../../types';
import { storageService } from '../../services/storageService';
import { PracticeConfigModal } from '../practice/PracticeConfigModal';
import { Award, Layers, Target, Clock, History, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  currentUser: User | null;
  onStartSimulation: () => void;
  onStartPractice: (config: PracticeConfig) => void;
}

type ModeTab = 'simulation' | 'area' | 'topic';

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onStartSimulation,
  onStartPractice,
}) => {
  const [activeTab, setActiveTab] = useState<ModeTab>('simulation');
  const [practiceModalMode, setPracticeModalMode] = useState<'area' | 'topic' | null>(null);

  const attempts: Attempt[] = storageService.getAttempts();
  const perfLevel = storageService.calculatePerformanceLevel(attempts);

  const handleStartTabAction = () => {
    if (activeTab === 'simulation') {
      onStartSimulation();
    } else {
      setPracticeModalMode(activeTab);
    }
  };

  return (
    <div className="landing-page max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-6 text-stone-900 dark:text-slate-100 transition-colors">
      {/* Welcome Banner */}
      <div className="bg-stone-900 dark:bg-slate-900 text-white border-2 border-stone-800 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-indigo-950/80 text-indigo-300 text-[10px] sm:text-xs font-bold rounded-full border border-indigo-800/60 mb-2.5 sm:mb-3 uppercase tracking-wider">
            Bachillerato por Madurez Suficiente — Convocatoria 02-2026
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight uppercase leading-tight text-stone-100">
            Practicas y Simulaciones de Matemáticas BXM 2026 Convocatoria #2
          </h2>
        </div>
      </div>

      {/* Main Grid: Combined Practice/Simulation Widget & Stacked Performance/History Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Combined Practice & Test Modes Widget (7 Cols) */}
        <div className="lg:col-span-7 bg-[#fefcf8] dark:bg-slate-900 border-2 border-stone-800 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col justify-between min-h-[380px]">
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

            {activeTab === 'area' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                    <Layers className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-slate-100">
                      Práctica Enfocada por Área
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed font-medium mt-1">
                      Fortalece un bloque temático en particular: Geometría, Relaciones y Álgebra, o Estadística y Probabilidad según tus necesidades de repaso.
                    </p>
                  </div>
                </div>

                <div className="bg-stone-100/80 dark:bg-slate-800/60 rounded-xl p-3.5 border border-stone-200 dark:border-slate-700 text-xs space-y-1.5 text-stone-700 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Personaliza cantidad de preguntas y tiempo límite opcional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Retroalimentación inmediata de respuestas e explicaciones</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'topic' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-slate-100">
                      Práctica Específica por Tema
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed font-medium mt-1">
                      Selecciona un tema puntual como Circunferencias, Función Cuadrática o Diagramas de Caja para ejercitar objetivos específicos.
                    </p>
                  </div>
                </div>

                <div className="bg-stone-100/80 dark:bg-slate-800/60 rounded-xl p-3.5 border border-stone-200 dark:border-slate-700 text-xs space-y-1.5 text-stone-700 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Ideal para repasar dudas puntuales o reforzar áreas débiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Ajusta cantidad de ejercicios según tu disponibilidad</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleStartTabAction}
            className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition border-2 border-indigo-700 shadow-xs min-h-[44px] cursor-pointer"
          >
            <span>
              {activeTab === 'simulation'
                ? 'Iniciar Simulación'
                : activeTab === 'area'
                ? 'Configurar Práctica por Área'
                : 'Configurar Práctica por Tema'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Stacked Performance Indicator & Recent History Widget (5 Cols) */}
        <div className="lg:col-span-5 bg-[#fefcf8] dark:bg-slate-900 border-2 border-stone-800 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* Top Section: Indicador de Rendimiento */}
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-stone-200 dark:border-slate-800 mb-3.5">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Rendimiento
              </span>

              {attempts.length > 0 && (
                <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800/80">
                  {attempts.length} {attempts.length === 1 ? 'intento' : 'intentos'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3.5 bg-amber-50/50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-amber-200/80 dark:border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base border-2 border-indigo-700 shadow-xs shrink-0">
                {perfLevel.scoreAverage}%
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-slate-100 truncate">
                  {attempts.length === 0 ? 'Sin datos de rendimiento' : perfLevel.description}
                </h4>
                <p className="text-[11px] text-stone-600 dark:text-slate-400 font-medium mt-0.5 leading-snug">
                  {attempts.length === 0
                    ? 'Completa tu primera práctica o simulación para calcular tus métricas.'
                    : `Promedio en los últimos ${Math.min(attempts.length, 5)} intentos.`}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section: Historial de Intentos Recientes */}
          <div className="pt-2">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-stone-200 dark:border-slate-800 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Historial Reciente
              </span>
            </div>

            {attempts.length === 0 ? (
              <div className="text-center py-6 text-xs font-semibold text-stone-500 dark:text-slate-400 bg-stone-100/60 dark:bg-slate-800/40 border-2 border-dashed border-stone-300 dark:border-slate-700 rounded-xl px-3">
                Aún no has realizado ningún intento. ¡Comienza con una práctica o simulación!
              </div>
            ) : (
              <div className="divide-y divide-stone-200 dark:divide-slate-800 max-h-[220px] overflow-y-auto pr-1">
                {attempts.slice(0, 5).map((att) => (
                  <div key={att.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-stone-900 dark:text-slate-100 truncate">
                        {att.scopeText}
                      </div>
                      <div className="text-stone-500 dark:text-slate-400 font-medium mt-0.5 text-[10px] truncate">
                        {new Date(att.timestamp).toLocaleDateString('es-CR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-right">
                      <div>
                        <span className="font-black text-sm text-indigo-700 dark:text-indigo-300 block leading-none">
                          {att.scorePercentage}%
                        </span>
                        <div className="text-stone-500 dark:text-slate-400 text-[10px] font-bold mt-0.5">
                          {att.correctCount} / {att.totalItems} aciertos
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Practice Configuration Modal */}
      {practiceModalMode && (
        <PracticeConfigModal
          isOpen={true}
          initialMode={practiceModalMode}
          onClose={() => setPracticeModalMode(null)}
          onStartSession={onStartPractice}
        />
      )}
    </div>
  );
};
