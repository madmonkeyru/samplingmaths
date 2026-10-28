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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30 mb-3">
            Bachillerato por Madurez Suficiente — Convocatoria 02-2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Preparación Oficial de Matemáticas MEP
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Simula la prueba completa de 60 ítems con gráfico vectorial dinámico o práctica temas específicos con explicaciones paso a paso.
          </p>
        </div>
      </div>

      {/* Performance Indicator (FR-W-03) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
            style={{ backgroundColor: perfLevel.color }}
          >
            {perfLevel.scoreAverage}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Indicador de Rendimiento</h3>
            <p className="text-xs text-slate-500">
              {attempts.length === 0
                ? 'Aún no has completado prácticas o simulaciones.'
                : `Basado en tus últimos ${Math.min(attempts.length, 5)} intentos (${perfLevel.description}).`}
            </p>
          </div>
        </div>

        {attempts.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Total Intentos: {attempts.length}</span>
          </div>
        )}
      </div>

      {/* Mode Entry Cards (FR-W-01) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simulation Test */}
        <div className="bg-white border border-slate-200 hover:border-blue-500/50 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Prueba de Simulación</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Examen completo de 60 ítems cronometrado (150 min), respetando la distribución oficial por áreas.
            </p>
          </div>
          <button
            onClick={onStartSimulation}
            className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <span>Iniciar Simulación</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Practice by Area */}
        <div className="bg-white border border-slate-200 hover:border-indigo-500/50 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Práctica por Área</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Selecciona Geometría, Relaciones y Álgebra, o Estadística para reforzar tu dominio por bloque.
            </p>
          </div>
          <button
            onClick={() => setPracticeModalMode('area')}
            className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <span>Configurar Área</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Practice by Topic */}
        <div className="bg-white border border-slate-200 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Práctica por Tema</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enfócate en temas específicos como Circunferencia, Función Cuadrática o Diagramas de Venn.
            </p>
          </div>
          <button
            onClick={() => setPracticeModalMode('topic')}
            className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <span>Configurar Tema</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Attempts Panel (FR-W-02) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-slate-600" />
          <h3 className="text-base font-bold text-slate-800">Historial de Intentos Recientes</h3>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            Aún no has realizado ningún intento. ¡Comienza con una práctica o simulación!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {attempts.slice(0, 5).map((att) => (
              <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{att.scopeText}</div>
                  <div className="text-slate-400 mt-0.5">
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
                    <span className="font-extrabold text-sm text-slate-800">
                      {att.scorePercentage}%
                    </span>
                    <div className="text-slate-500 text-[10px]">
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
