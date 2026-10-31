import React, { useState, useEffect } from 'react';
import { User, Attempt, PracticeConfig, ProgramInfo } from '../../types';
import { storageService } from '../../services/storageService';
import { dataService } from '../../services/dataService';
import { PracticeConfigModal } from '../practice/PracticeConfigModal';
import { EvaluationModulesWidget } from '../practice/EvaluationModulesWidget';
import { Award, History, Calendar } from 'lucide-react';

interface LandingPageProps {
  currentUser: User | null;
  onStartSimulation: () => void;
  onStartPractice: (config: PracticeConfig) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onStartSimulation,
  onStartPractice,
}) => {
  const [practiceModalMode, setPracticeModalMode] = useState<'area' | 'topic' | null>(null);
  const [activeProgram, setActiveProgram] = useState<ProgramInfo | undefined>(dataService.getCurrentProgram());
  const [convocatoria, setConvocatoria] = useState<string>(dataService.getCurrentConvocatoriaId() || '2026-c2');

  useEffect(() => {
    const updateActiveInfo = () => {
      setActiveProgram(dataService.getCurrentProgram());
      setConvocatoria(dataService.getCurrentConvocatoriaId() || '2026-c2');
    };
    updateActiveInfo();
    const unsubscribe = dataService.subscribe(updateActiveInfo);
    return unsubscribe;
  }, []);

  const attempts: Attempt[] = storageService.getAttempts();
  const perfLevel = storageService.calculatePerformanceLevel(attempts);
  const isCalcAllowed = dataService.isCalculatorAllowed();

  return (
    <div className="landing-page max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-6 text-stone-900 dark:text-slate-100 transition-colors">
      {/* Welcome Banner with Dynamic Program Context */}
      <div className="bg-stone-900 dark:bg-slate-900 text-white border-2 border-stone-800 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2.5 sm:mb-3">
            <span className="inline-block px-3 py-1 bg-indigo-950/80 text-indigo-300 text-[10px] sm:text-xs font-bold rounded-full border border-indigo-800/60 uppercase tracking-wider">
              {activeProgram?.id === 'bxm' ? 'Bachillerato por Madurez Suficiente — Convocatoria 02-2026' : (activeProgram?.name || 'Educación Abierta')}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-800 text-stone-300 text-[10px] sm:text-xs font-semibold rounded-full border border-stone-700">
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>Convocatoria {convocatoria === '2026-c1' ? '01-2026' : '02-2026'}</span>
            </span>
            {!isCalcAllowed && (
              <span className="px-2.5 py-1 bg-amber-950/70 text-amber-300 text-[10px] sm:text-xs font-bold rounded-full border border-amber-800">
                Calculadora Prohibida
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight uppercase leading-tight text-stone-100">
            {activeProgram?.id === 'bxm'
              ? 'Practicas y Simulaciones de Matemáticas BXM 2026 Convocatoria #2'
              : `Prácticas y Simulaciones de ${activeProgram?.name || 'Matemáticas'}`}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-medium mt-2">
            {activeProgram?.description ||
              'Simulación completa con reactivos alineados a la tabla de especificaciones oficial del MEP.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Combined Practice/Simulation Widget & Stacked Performance/History Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Combined Practice & Test Modes Widget (7 Cols) */}
        <EvaluationModulesWidget
          onStartSimulation={onStartSimulation}
          onStartPractice={onStartPractice}
        />

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
