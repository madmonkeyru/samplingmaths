import React, { useState, useEffect } from 'react';
import { User, Attempt, PracticeConfig, ProgramInfo } from '../../types';
import { storageService } from '../../services/storageService';
import { dataService } from '../../services/dataService';
import { PracticeConfigModal } from '../practice/PracticeConfigModal';
import { EvaluationModulesWidget } from '../practice/EvaluationModulesWidget';
import { QuickStatsBanner } from '../common/QuickStatsBanner';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ConvocatoriaBadge } from '../common/ConvocatoriaBadge';
import { GenericSubjectHubPage } from './GenericSubjectHubPage';
import { routeHash } from '../../services/navigation';
import { SpecsTable } from '../knowledge/SpecsTable';
import { TermsDictionary } from '../knowledge/TermsDictionary';
import { FormulasSheet } from '../knowledge/FormulasSheet';
import {
  Award,
  History,
  Calculator,
  Ban,
  FileText,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';

interface SubjectHubPageProps {
  contextControls?: React.ReactNode;
  currentUser: User | null;
  onNavigateHome?: () => void;
  onStartSimulation: () => void;
  onStartPractice: (config: PracticeConfig) => void;
  onStartPracticeByItems?: (itemIds: number[], title: string) => void;
}

export const SubjectHubPage: React.FC<SubjectHubPageProps> = ({
  contextControls,
  currentUser: _currentUser,
  onNavigateHome,
  onStartSimulation,
  onStartPractice,
  onStartPracticeByItems,
}) => {
  const [practiceModalMode, setPracticeModalMode] = useState<'area' | 'topic' | null>(null);
  const [activeProgram, setActiveProgram] = useState<ProgramInfo | undefined>(dataService.getCurrentProgram());
  const [convocatoria, setConvocatoria] = useState<string>(dataService.getCurrentConvocatoriaId() || '2026-c2');

  // Hub view modes: 'practice' (simulator + evaluation widgets) or 'resources' (integrated specs, terms, formulas)
  const [activeSection, setActiveSection] = useState<'practice' | 'resources'>('practice');
  const [resourceSubTab, setResourceSubTab] = useState<'specs' | 'terms' | 'formulas'>('specs');

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
  const isBxm = activeProgram?.id === 'bxm';

  const breadcrumbs = [
    { label: 'Programas', onClick: () => { window.location.hash = '#/programas'; } },
    { label: activeProgram?.name || 'Programa', onClick: onNavigateHome },
    ...(isBxm ? [{ label: 'Matemáticas', active: true }] : []),
  ];

  if (!isBxm && activeProgram) {
    return <GenericSubjectHubPage program={activeProgram} route={{
      view: 'hub', programId: activeProgram.id, subjectId: dataService.getCurrentSubjectId(),
      moduleId: dataService.getCurrentSubprogramId(), convocatoriaId: convocatoria,
    }} onNavigate={route => { window.location.hash = routeHash(route); }} />;
  }

  return (
    <div className="subject-hub-page max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-6 text-stone-900 dark:text-slate-100 transition-colors">
      {/* 1. Contextual Navigation Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center gap-2">
          <ConvocatoriaBadge convocatoriaId={convocatoria} />
          {!isCalcAllowed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold rounded-lg ">
              <Ban className="w-3 h-3 text-amber-500" />
              Calculadora Prohibida
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 text-[11px] font-bold rounded-lg ">
              <Calculator className="w-3 h-3 text-stone-500" />
              Calculadora Permitida
            </span>
          )}
        </div>
      </div>

      <div className="pt-2 pb-1 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Tu espacio de Matemáticas BXM</h1>
        <p className="text-sm text-stone-600 dark:text-slate-400 max-w-2xl leading-relaxed">Refuerza un tema, consulta una fórmula o pon a prueba lo que sabes. Elige cómo quieres avanzar hoy.</p>
      </div>
      {contextControls}

      {/* 2. Compact Readiness / Quick Stats Banner */}
      <QuickStatsBanner
        attempts={attempts}
        programName={isBxm ? 'Matemáticas BXM (Convocatoria 02-2026)' : activeProgram?.name}
      />

      {/* 3. Section Segmented Switcher inside the Hub: Práctica & Simulación vs. Recursos & Especificaciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 ui-surface rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-slate-100 truncate">
            {isBxm
              ? 'Practicas y Simulaciones de Matemáticas BXM 2026 Convocatoria #2'
              : `Hub Curricular: ${activeProgram?.name || 'Educación Abierta'}`}
          </h2>
        </div>

        {/* Section Tabs */}
        <div className="flex bg-stone-100 dark:bg-slate-800 p-1 rounded-xl gap-1 text-xs font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSection('practice')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[36px] cursor-pointer ${
              activeSection === 'practice'
                ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Módulos de Práctica</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('resources')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1.5 min-h-[36px] cursor-pointer ${
              activeSection === 'resources'
                ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Especificaciones & Recursos</span>
          </button>
        </div>
      </div>

      {/* 4. Section Content */}
      {activeSection === 'practice' ? (
        /* Main Practice & Test Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Combined Practice & Test Modes Widget (7 Cols) */}
          <EvaluationModulesWidget
            onStartSimulation={onStartSimulation}
            onStartPractice={onStartPractice}
          />

          {/* Stacked Performance Indicator & Recent History Widget (5 Cols) */}
          <div className="lg:col-span-5 ui-surface rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            {/* Top Section: Indicador de Rendimiento */}
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-slate-800 mb-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Rendimiento
                </span>

                {attempts.length > 0 && (
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-1 rounded-lg ">
                    {attempts.length} {attempts.length === 1 ? 'intento' : 'intentos'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3.5 bg-amber-50/50 dark:bg-slate-800/50 p-3.5 rounded-xl ">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-semibold text-base  shadow-xs shrink-0">
                  {perfLevel.scoreAverage}%
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-slate-100 truncate">
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
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-200 dark:border-slate-800 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Historial Reciente
                </span>
              </div>

              {attempts.length === 0 ? (
                <div className="text-center py-6 text-xs font-semibold text-stone-500 dark:text-slate-400 bg-stone-100/60 dark:bg-slate-800/40  rounded-xl px-3">
                  Aún no has realizado ningún intento. ¡Comienza con una práctica o simulación!
                </div>
              ) : (
                <div className="divide-y divide-stone-200 dark:divide-slate-800 max-h-[220px] overflow-y-auto pr-1">
                  {attempts.slice(0, 5).map((att) => (
                    <div key={att.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-stone-900 dark:text-slate-100 truncate">
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
                          <span className="font-semibold text-sm text-indigo-700 dark:text-indigo-300 block leading-none">
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
      ) : (
        /* Integrated Specifications & Resources View */
        <div className="space-y-6">
          {/* Subtabs for Resources */}
          <div className="flex bg-stone-100 dark:bg-slate-800 p-1.5 rounded-2xl  gap-1.5 text-xs font-bold w-full sm:w-auto self-start inline-flex">
            <button
              onClick={() => setResourceSubTab('specs')}
              className={`px-4 py-2 rounded-xl text-center transition flex items-center gap-1.5 min-h-[38px] cursor-pointer ${
                resourceSubTab === 'specs'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 stroke-[2.2]" />
              <span>Temario</span>
            </button>

            <button
              onClick={() => setResourceSubTab('terms')}
              className={`px-4 py-2 rounded-xl text-center transition flex items-center gap-1.5 min-h-[38px] cursor-pointer ${
                resourceSubTab === 'terms'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
              <span>Diccionario de Términos</span>
            </button>

            <button
              onClick={() => setResourceSubTab('formulas')}
              className={`px-4 py-2 rounded-xl text-center transition flex items-center gap-1.5 min-h-[38px] cursor-pointer ${
                resourceSubTab === 'formulas'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4 stroke-[2.2]" />
              <span>Fórmulas</span>
            </button>
          </div>

          <div className="ui-surface rounded-3xl p-4 sm:p-6 shadow-xs">
            {resourceSubTab === 'specs' && (
              <SpecsTable onStartPracticeByItems={onStartPracticeByItems} />
            )}
            {resourceSubTab === 'terms' && <TermsDictionary />}
            {resourceSubTab === 'formulas' && <FormulasSheet />}
          </div>
        </div>
      )}

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

// Backwards compatibility alias
export const LandingPage = SubjectHubPage;
