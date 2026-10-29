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
    <div className="landing-page max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-zinc-950 text-white border-2 border-zinc-900 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-zinc-800 text-zinc-200 text-xs font-bold rounded-full border border-zinc-700 mb-3 uppercase tracking-wider">
            Bachillerato por Madurez Suficiente — Convocatoria 02-2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Preparación Oficial de Matemáticas MEP
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed font-medium">
            Simula la prueba completa de 60 ítems con gráficos vectoriales dinámicos o práctica temas específicos con explicaciones paso a paso.
          </p>
        </div>
      </div>

      {/* Performance Indicator (FR-W-03) */}
      <div className="bg-white border-2 border-zinc-900 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-black text-lg border-2 border-zinc-900 shadow-xs">
            {perfLevel.scoreAverage}%
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-zinc-900">Indicador de Rendimiento</h3>
            <p className="text-xs text-zinc-600 font-medium mt-0.5">
              {attempts.length === 0
                ? 'Aún no has completado prácticas o simulaciones.'
                : `Basado en tus últimos ${Math.min(attempts.length, 5)} intentos (${perfLevel.description}).`}
            </p>
          </div>
        </div>

        {attempts.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 bg-zinc-100 px-3.5 py-2 rounded-xl border border-zinc-900">
            <Award className="w-4 h-4 text-zinc-900" />
            <span>Total Intentos: {attempts.length}</span>
          </div>
        )}
      </div>

      {/* Mode Entry Cards (FR-W-01) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simulation Test */}
        <div className="bg-white border-2 border-zinc-900 hover:bg-zinc-50 rounded-2xl p-6 shadow-xs transition flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-zinc-950 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition border-2 border-zinc-900">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-1">Prueba de Simulación</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              Examen completo de 60 ítems cronometrado (150 min), respetando la distribución oficial por áreas.
            </p>
          </div>
          <button
            onClick={onStartSimulation}
            className="mt-6 w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition border-2 border-zinc-900 min-h-[44px]"
          >
            <span>Iniciar Simulación</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Practice by Area */}
        <div className="bg-white border-2 border-zinc-900 hover:bg-zinc-50 rounded-2xl p-6 shadow-xs transition flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition border-2 border-zinc-900">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-1">Práctica por Área</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              Selecciona Geometría, Relaciones y Álgebra, o Estadística para reforzar tu dominio por bloque.
            </p>
          </div>
          <button
            onClick={() => setPracticeModalMode('area')}
            className="mt-6 w-full py-3 bg-white hover:bg-zinc-100 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border-2 border-zinc-900 transition min-h-[44px]"
          >
            <span>Configurar Área</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Practice by Topic */}
        <div className="bg-white border-2 border-zinc-900 hover:bg-zinc-50 rounded-2xl p-6 shadow-xs transition flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition border-2 border-zinc-900">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-1">Práctica por Tema</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              Enfócate en temas específicos como Circunferencia, Función Cuadrática o Diagramas de Venn.
            </p>
          </div>
          <button
            onClick={() => setPracticeModalMode('topic')}
            className="mt-6 w-full py-3 bg-white hover:bg-zinc-100 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border-2 border-zinc-900 transition min-h-[44px]"
          >
            <span>Configurar Tema</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Attempts Panel (FR-W-02) */}
      <div className="bg-white border-2 border-zinc-900 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-zinc-900">
          <History className="w-5 h-5 text-zinc-900" />
          <h3 className="text-base font-black text-zinc-900 uppercase">Historial de Intentos Recientes</h3>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-8 text-xs font-semibold text-zinc-500 bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-xl">
            Aún no has realizado ningún intento. ¡Comienza con una práctica o simulación!
          </div>
        ) : (
          <div className="divide-y-2 divide-zinc-100">
            {attempts.slice(0, 5).map((att) => (
              <div key={att.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-zinc-900">{att.scopeText}</div>
                  <div className="text-zinc-500 font-medium mt-0.5">
                    {new Date(att.timestamp).toLocaleDateString('es-CR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-black text-base text-zinc-900">
                      {att.scorePercentage}%
                    </span>
                    <div className="text-zinc-600 text-[11px] font-bold">
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
