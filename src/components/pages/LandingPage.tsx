import React, { useState } from 'react';
import { User, Attempt, PracticeConfig } from '../../types';
import { storageService } from '../../services/storageService';
import { PracticeConfigModal } from '../practice/PracticeConfigModal';
import { Award, Layers, Target, Clock, History, ArrowRight } from 'lucide-react';

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

  const attempts: Attempt[] = storageService.getAttempts();
  const perfLevel = storageService.calculatePerformanceLevel(attempts);

  return (
    <div className="landing-page max-w-7xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-8 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Welcome Banner */}
      <div className="bg-zinc-950 dark:bg-zinc-900 text-white border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-5 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-2.5 sm:px-3 py-1 bg-zinc-800 dark:bg-zinc-800/80 text-zinc-200 text-[10px] sm:text-xs font-bold rounded-full border border-zinc-700 mb-2.5 sm:mb-3 uppercase tracking-wider">
            Bachillerato por Madurez Suficiente — Convocatoria 02-2026
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight uppercase leading-tight">
            Preparación Oficial de Matemáticas MEP
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed font-medium">
            Simula la prueba completa de 60 ítems con gráficos vectoriales dinámicos o práctica temas específicos con explicaciones paso a paso.
          </p>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-black text-base sm:text-lg border-2 border-zinc-900 dark:border-zinc-100 shadow-xs shrink-0">
            {perfLevel.scoreAverage}%
          </div>
          <div>
            <h3 className="text-xs sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100">Indicador de Rendimiento</h3>
            <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
              {attempts.length === 0
                ? 'Aún no has completado prácticas o simulaciones.'
                : `Basado en tus últimos ${Math.min(attempts.length, 5)} intentos (${perfLevel.description}).`}
            </p>
          </div>
        </div>

        {attempts.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-zinc-900 dark:border-zinc-700 self-start sm:self-auto shrink-0">
            <Award className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
            <span>Total Intentos: {attempts.length}</span>
          </div>
        )}
      </div>

      {/* Mode Entry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Simulation Test */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xs transition flex flex-col justify-between group">
          <div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl flex items-center justify-center mb-3.5 sm:mb-4 group-hover:scale-105 transition border-2 border-zinc-900 dark:border-zinc-100">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 mb-1">Prueba de Simulación</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Examen completo de 60 ítems cronometrado (150 min), respetando la distribución oficial por áreas.
            </p>
          </div>
          <button
            onClick={onStartSimulation}
            className="mt-5 sm:mt-6 w-full py-3 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition border-2 border-zinc-900 dark:border-zinc-100 min-h-[44px] cursor-pointer"
          >
            <span>Iniciar Simulación</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Practice by Area */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xs transition flex flex-col justify-between group">
          <div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex items-center justify-center mb-3.5 sm:mb-4 group-hover:scale-105 transition border-2 border-zinc-900 dark:border-zinc-700">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 mb-1">Práctica por Área</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Selecciona Geometría, Relaciones y Álgebra, o Estadística para reforzar tu dominio por bloque.
            </p>
          </div>
          <button
            onClick={() => setPracticeModalMode('area')}
            className="mt-5 sm:mt-6 w-full py-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border-2 border-zinc-900 dark:border-zinc-700 transition min-h-[44px] cursor-pointer"
          >
            <span>Configurar Área</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Practice by Topic */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xs transition flex flex-col justify-between group">
          <div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex items-center justify-center mb-3.5 sm:mb-4 group-hover:scale-105 transition border-2 border-zinc-900 dark:border-zinc-700">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 mb-1">Práctica por Tema</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Enfócate en temas específicos como Circunferencia, Función Cuadrática o Diagramas de Venn.
            </p>
          </div>
          <button
            onClick={() => setPracticeModalMode('topic')}
            className="mt-5 sm:mt-6 w-full py-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border-2 border-zinc-900 dark:border-zinc-700 transition min-h-[44px] cursor-pointer"
          >
            <span>Configurar Tema</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      {/* Recent Attempts Panel */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3.5 sm:mb-4 pb-2 border-b-2 border-zinc-900 dark:border-zinc-800">
          <History className="w-5 h-5 text-zinc-900 dark:text-zinc-100 shrink-0" />
          <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100 uppercase">Historial de Intentos Recientes</h3>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl px-3">
            Aún no has realizado ningún intento. ¡Comienza con una práctica o simulación!
          </div>
        ) : (
          <div className="divide-y-2 divide-zinc-100 dark:divide-zinc-800">
            {attempts.slice(0, 5).map((att) => (
              <div key={att.id} className="py-3 flex items-center justify-between text-xs gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-zinc-900 dark:text-zinc-100 truncate">{att.scopeText}</div>
                  <div className="text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 text-[11px] truncate">
                    {new Date(att.timestamp).toLocaleDateString('es-CR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100 block leading-none">
                      {att.scorePercentage}%
                    </span>
                    <div className="text-zinc-600 dark:text-zinc-400 text-[10px] sm:text-[11px] font-bold mt-0.5">
                      {att.correctCount} / {att.totalItems} aciertos
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
