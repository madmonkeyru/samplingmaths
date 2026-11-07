import { LearningConfiguration, AssessmentBriefing } from '../../components/practice/LearningConfiguration';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppRoute, LearningContextReason } from '../../services/navigation';
import { storageService } from '../../services/storageService';
import { FeedbackState } from '../../components/common/FeedbackState';
import { Dialog } from '../../components/common/Dialog';
import { PaywallModal } from '../../components/common/PaywallModal';
import { TextRenderer } from '../../components/common/TextRenderer';
import { FormulasSheet } from '../../components/knowledge/FormulasSheet';
import { BxmDigitalTemario } from '../bxm-learning/components/BxmDigitalTemario';
import { BxmSessionRunnerView, BxmSessionResultBreakdownView } from '../bxm-assessment/components/BxmSessionRunnerView';
import { SessionRunner } from '../bxm-assessment/sessionRunner';
import type { BlueprintSelectionResult, SessionResultExport, DifficultyTier } from '../bxm-assessment/types';
import { BxmPreparationDashboard } from '../bxm-progress/ui/BxmPreparationDashboard';
import { BXM_OFFICIAL_EVIDENCES_FIXTURE as catalog } from '../bxm-progress/ui/evidenceCatalogFixture';
import { accessService } from '../../services/accessService';
import { useSubscriptionCapabilities } from './capabilities';
import { BxmLearningStore } from './learningStore';
import { inventory, lessons, policyFor, preparePresentation, sampleLessonKeys, selectActivity, type ActivityRequest } from './providers';
import { computeEvidenceMasteryRecords } from '../bxm-progress/domain/masteryEngine';
import { PlanDeNivelacionView } from '../../components/results/PlanDeNivelacionView';
import { generateRemediationPlanFromSessionResult } from '../../services/remediationEngine';
import { RecommendationCard } from '../../components/common/RecommendationCard';
import { deriveCanonicalRecommendation } from '../bxm-progress/recommendations/recommendationsEngine';
import type { CanonicalRecommendation } from '../../types/recommendation';
import { telemetryService } from '../../services/telemetryService';
import { persistenceService } from '../../services/persistenceService';

interface Props { userId: string; route: AppRoute; onNavigate: (route: AppRoute) => void; onOfficialSimulation: () => void }
interface Pending { request: ActivityRequest; selection: BlueprintSelectionResult; seed: number }
export function BxmLearningHub({ userId, route, onNavigate, onOfficialSimulation }: Props) {
  const capabilities = useSubscriptionCapabilities();
  const store = useMemo(() => new BxmLearningStore(userId), [userId]);
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState(store.lastError);
  const [paywall, setPaywall] = useState(false);
  const [showOfficialBriefing, setShowOfficialBriefing] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState(route.evidenceKey || [...sampleLessonKeys][0]);
  const [practiceCount, setPracticeCount] = useState(5);
  useEffect(() => { if (route.evidenceKey) setSelectedEvidence(route.evidenceKey); }, [route.evidenceKey]);
  const [difficulty, setDifficulty] = useState<DifficultyTier | undefined>();
  const [runner, setRunner] = useState<SessionRunner | null>(() => {
    const saved = store.getActive();
    return saved && saved.sessionId === route.sessionId && route.tab === 'assessment' ? SessionRunner.restore(saved) : null;
  });
  // Canonical tabs: 'inicio' (aliasing legacy 'diagnostic' for backward-compatible deep links), 'temario', 'practice', 'simulation'
  const tab = route.tab || 'inicio';
  const activePillar = useMemo<'inicio' | 'aprender' | 'practicar' | 'simular'>(() => {
    if (tab === 'temario') return 'aprender';
    if (tab === 'practice') return 'practicar';
    if (tab === 'simulation') return 'simular';
    return 'inicio';
  }, [tab]);

  const go = useCallback((nextTab: string, evidenceKey?: string, sessionId?: string, contextReason?: LearningContextReason) => onNavigate({
    view: 'learning', programId: 'bxm', subjectId: 'matematicas', convocatoriaId: '2026-c2', tab: nextTab, evidenceKey, sessionId, contextReason, sourceSessionId: ['temario', 'practice'].includes(nextTab) ? route.sourceSessionId : undefined,
  }), [onNavigate, route.sourceSessionId]);
  useEffect(() => { store.reconcile(); if (store.lastError) setMessage(store.lastError); }, [store]);
  const persist = useCallback((current: SessionRunner) => {
    if (!store.saveActive(current)) setMessage(store.lastError);
  }, [store]);
  const finish = useCallback((result: SessionResultExport) => {
    const saved = store.complete(result);
    setMessage(saved ? '' : store.lastError);
    setRevision(value => value + 1);
    setRunner(null);

    // M7 & M8 Integration: record attempt and emit learning/assessment telemetry
    try {
      persistenceService.saveAttempt({
        attempt_id: `att_${result.sessionId}`,
        session_id: result.sessionId,
        learner_id: userId,
        program_id: 'bxm',
        subject_id: 'matematica',
        activity_type: result.kind === 'mock_exam' ? 'mock_exam' : result.kind === 'diagnostic' ? 'diagnostic' : 'practice',
        score_percentage: result.firstResponseScorePercentage,
        correct_count: result.firstResponseCorrectCount,
        total_questions: result.totalActualItems,
        time_spent_seconds: result.durationSeconds,
        completed_at: result.completedAt || new Date().toISOString(),
      });

      if (result.kind === 'diagnostic') {
        telemetryService.trackActivation('diagnostic_completed', {
          score_percentage: result.firstResponseScorePercentage,
          total_questions: result.totalActualItems,
          attempt_id: result.sessionId,
        });
      } else if (result.kind === 'mock_exam') {
        telemetryService.trackAssessment('simulation_completed', {
          score_percentage: result.firstResponseScorePercentage,
          total_questions: result.totalActualItems,
          attempt_id: result.sessionId,
        });
      } else {
        telemetryService.trackLearning('practice_completed', {
          score_percentage: result.firstResponseScorePercentage,
          total_questions: result.totalActualItems,
          attempt_id: result.sessionId,
        });
      }
    } catch {
      // Non-blocking telemetry and persistence
    }

    go('result', undefined, result.sessionId);
  }, [store, go, userId]);
  const active = store.getActive();
  const result = store.getResult(route.sessionId);
  const events = store.progress.getEvents();
  const practicePreview = selectActivity({ kind: 'evidence_practice', evidenceKey: selectedEvidence, difficulty, itemCount: Number.isInteger(practiceCount) && practiceCount > 0 && practiceCount <= 100 ? practiceCount : 5 }, 0, events.map(event => event.itemId));

  const allow = (feature: Parameters<typeof capabilities.canAccess>[0]) => {
    if (accessService.can(feature)) return true;
    setPaywall(true);
    return false;
  };
  function request(requested: ActivityRequest) {
    const source = result || store.getResult(route.sourceSessionId);
    if (requested.evidenceKey && source) requested = { ...requested, sourceSessionId: source.sessionId, rootSessionId: source.learningContext?.rootSessionId || source.sessionId };
    if (requested.kind !== 'diagnostic' && !allow(requested.generated ? 'isomorphic_practice_drills' : requested.kind === 'mock_exam' ? 'configurable_mock_sessions' : 'extended_authored_practice')) return;
    if (active) { setMessage('Tienes una actividad guardada. Reanúdala o descártala antes de iniciar otra.'); return; }
    const seed = crypto.getRandomValues(new Uint32Array(1))[0];
    const selection = selectActivity(requested, seed, events.map(e => e.itemId), events.flatMap(e => e.familyId ? [e.familyId] : []));
    if (!selection.items.length) { setMessage('No hay ejercicios disponibles con esta selección. Elige otra evidencia o dificultad.'); return; }
    setPending({ request: requested, selection, seed });
  }
  function begin() {
    if (!pending) return;
    // Recheck permissions when the preflight is accepted, including a tier change.
    if (pending.request.kind !== 'diagnostic' && !allow(pending.request.generated ? 'isomorphic_practice_drills' : pending.request.kind === 'mock_exam' ? 'configurable_mock_sessions' : 'extended_authored_practice')) return;
    const next = new SessionRunner({ sessionId: `bxm-${crypto.randomUUID()}`, items: preparePresentation(pending.selection.items, pending.seed, store.getExposedItemIds()),
      policy: { ...policyFor(pending.request.kind), ...(pending.request.sourceSessionId && pending.request.rootSessionId && pending.request.evidenceKey ? { learningContext: { sourceSessionId: pending.request.sourceSessionId, rootSessionId: pending.request.rootSessionId, evidenceKey: pending.request.evidenceKey } } : {}) }, shortfalls: pending.selection.shortfalls, benchmarkExposed: pending.selection.benchmarkExposed });
    persist(next); setRunner(next); setPending(null); setMessage(store.lastError);

    // M8 Telemetry: session start
    try {
      if (pending.request.kind === 'diagnostic') {
        telemetryService.trackActivation('diagnostic_started', { attempt_id: next.sessionId });
      } else if (pending.request.kind === 'mock_exam') {
        telemetryService.trackAssessment('simulation_started', { attempt_id: next.sessionId });
      } else {
        telemetryService.trackLearning('practice_started', { attempt_id: next.sessionId, evidence_id: pending.request.evidenceKey });
      }
    } catch {
      // Non-blocking telemetry
    }

    go('assessment', pending.request.evidenceKey, next.sessionId);
  }
  function resume() {
    if (!active) return;
    if (active.policy.kind !== 'diagnostic' && !allow(active.policy.kind === 'mock_exam' ? 'configurable_mock_sessions' : 'extended_authored_practice')) return;
    try { const restored = SessionRunner.restore(active); setRunner(restored); go('assessment', undefined, active.sessionId); }
    catch { setMessage('No se pudo reanudar este intento. El registro se conserva para su revisión.'); }
  }
  function openLesson(key: string, reason?: LearningContextReason) { onNavigate({ view: 'learning', programId: 'bxm', subjectId: 'matematicas', convocatoriaId: '2026-c2', tab: 'temario', evidenceKey: key, contextReason: reason, sourceSessionId: result?.sessionId || route.sourceSessionId }); }
  const results = store.getResults();
  const loopOrigin = result?.learningContext ? store.getResult(result.learningContext.rootSessionId) : undefined;
  const legacy = storageService.getContextAttempts({ programId: 'bxm', subjectId: 'matematicas', convocatoriaId: '2026-c2' }, userId);

  // Compute prioritized canonical recommendation from learner state & results using recommendationsEngine
  const canonicalHomeRecommendation = useMemo<CanonicalRecommendation>(() => {
    const masteryRecords = computeEvidenceMasteryRecords(catalog, events, new Date());
    return deriveCanonicalRecommendation({
      evidenceRecords: masteryRecords,
      events,
      completions: store.getCompletions(),
      hasCompletedDiagnostic: events.some(e => e.sessionKind === 'diagnostic') || results.some(r => r.kind === 'diagnostic'),
      availableLessons: lessons.map(l => ({ evidenceKey: l.evidenceKey })),
      availableInventory: inventory,
    });
  }, [events, results, store]);

  // Compute recommendation for results action surface using recommendationsEngine
  const canonicalResultRecommendation = useMemo<CanonicalRecommendation | null>(() => {
    if (!result || !result.evidenceBreakdowns) return null;
    const measuredBreakdowns = Object.values(result.evidenceBreakdowns).filter(e => e.totalItems > 0);
    if (!measuredBreakdowns.length) return null;

    // Prioritize evidence with errors in first response (lowest accuracy first)
    const sorted = measuredBreakdowns.filter(evidence => evidence.correctFirstResponseCount < evidence.totalItems).sort((a, b) => {
      const accA = a.totalItems > 0 ? a.correctFirstResponseCount / a.totalItems : 1;
      const accB = b.totalItems > 0 ? b.correctFirstResponseCount / b.totalItems : 1;
      if (accA !== accB) return accA - accB;
      return (b.totalItems - b.correctFirstResponseCount) - (a.totalItems - a.correctFirstResponseCount);
    });

    const target = sorted[0];
    if (!target) return null;
    const masteryRecords = computeEvidenceMasteryRecords(catalog, events, new Date());
    return deriveCanonicalRecommendation({
      evidenceRecords: masteryRecords,
      events,
      completions: store.getCompletions(),
      hasCompletedDiagnostic: true,
      pendingRemediationEvidenceKey: target.evidenceId,
      availableLessons: lessons.map(l => ({ evidenceKey: l.evidenceKey })),
      availableInventory: inventory,
      sourceActivityKind: result.kind,
    });
  }, [result, events, store]);

  const handleRecommendationAction = (rec: CanonicalRecommendation, isSecondary = false) => {
    const action = isSecondary ? rec.cta.secondaryAction : rec.cta.action;
    const targetId = isSecondary ? rec.cta.secondaryTargetId : rec.cta.targetId;

    if (!action) return;

    switch (action) {
      case 'diagnostic':
        request({ kind: 'diagnostic' });
        break;
      case 'lesson':
        if (targetId) {
          openLesson(
            targetId,
            rec.reason === 'simulation_weakness'
              ? 'simulation_weakness'
              : rec.reason === 'diagnostic_weakness'
              ? 'diagnostic_weakness'
              : rec.reason === 'remediation_pending'
              ? 'remediation'
              : rec.reason === 'retest_available'
              ? 'remediation_retest'
              : undefined
          );
        } else {
          go('temario');
        }
        break;
      case 'practice':
        if (targetId) {
          request({ kind: 'evidence_practice', evidenceKey: targetId });
        } else {
          go('practice');
        }
        break;
      case 'remediation':
        if (targetId) {
          request({ kind: 'evidence_practice', evidenceKey: targetId });
        } else {
          go('practice');
        }
        break;
      case 'simulation':
        if (targetId === 'official-reference') {
          onOfficialSimulation();
        } else {
          request({ kind: 'mock_exam' });
        }
        break;
      case 'retest':
        if (targetId) {
          request({ kind: 'retest', evidenceKey: targetId });
        } else {
          go('practice');
        }
        break;
      default:
        go('practice');
    }
  };

  // Compute remediation plan for mock_exam or diagnostic results
  const remediationPlan = useMemo(() => {
    if (!result || !['mock_exam', 'diagnostic'].includes(result.kind) || !result.itemSnapshots?.length) return null;
    try {
      return generateRemediationPlanFromSessionResult(result);
    } catch {
      return null;
    }
  }, [result]);

  // Compute post-practice mastery eligibility for single-evidence practice
  const practiceMasteryStatus = useMemo(() => {
    if (!result || result.kind !== 'evidence_practice' || !events.length) return null;
    const targetKey = Object.keys(result.evidenceBreakdowns)[0];
    if (!targetKey) return null;
    const masteryRecords = computeEvidenceMasteryRecords(catalog, events, new Date());
    const targetRecord = masteryRecords.find(r => r.evidenceKey === targetKey);
    const hasEnoughFamilies = (targetRecord?.qualifyingFamiliesCount || 0) >= (targetRecord?.minRequiredFamilies || 5);
    const isMastered = targetRecord?.status === 'mastered';
    return {
      evidenceKey: targetKey,
      record: targetRecord,
      isEligibleForMasteryCheck: isMastered || hasEnoughFamilies,
      qualifyingCount: targetRecord?.qualifyingFamiliesCount || 0,
      minRequired: targetRecord?.minRequiredFamilies || 5,
    };
  }, [result, events]);

  // Compute retest outcome and mastery recovery state
  const retestRecoveryStatus = useMemo(() => {
    if (!result || result.kind !== 'retest' || !events.length) return null;
    const targetKey = Object.keys(result.evidenceBreakdowns)[0];
    if (!targetKey) return null;
    const masteryRecords = computeEvidenceMasteryRecords(catalog, events, new Date());
    const targetRecord = masteryRecords.find(r => r.evidenceKey === targetKey);
    const accuracy = targetRecord?.accuracyPercentage ?? result.firstResponseScorePercentage;
    const isRecovered = result.firstResponseScorePercentage >= 75;
    return {
      evidenceKey: targetKey,
      evidenceCode: result.evidenceBreakdowns[targetKey]?.evidenceCode || 'A',
      domain: result.evidenceBreakdowns[targetKey]?.domain || 'geometry',
      retestScore: result.firstResponseScorePercentage,
      overallAccuracy: accuracy,
      status: targetRecord?.status || 'insufficient_data',
      statusLabel: targetRecord?.statusLabelEs || 'Datos insuficientes',
      isRecovered,
      qualifyingCount: targetRecord?.qualifyingFamiliesCount || 0,
    };
  }, [result, events]);

  return <div className="learning-workspace page-width py-4 sm:py-6 space-y-4 sm:space-y-5 min-w-0" data-revision={revision}>
    {tab !== 'assessment' && (
      /* Standard compact header for navigation tabs */
      <header className="learning-intro space-y-3">
        <div className="space-y-1">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Matemáticas BXM
          </h1>
          <p className="hidden sm:block text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Aprende, practica y comprueba tu avance a tu ritmo.
          </p>
        </div>
        <nav aria-label="Aprendizaje BXM" className="learning-nav">
          {([
            ['inicio', 'Inicio', 'inicio'],
            ['aprender', 'Aprender', 'temario'],
            ['practicar', 'Practicar', 'practice'],
            ['simular', 'Simular', 'simulation'],
          ] as const).map(([pillarId, label, targetTab]) => {
            const isCurrent = activePillar === pillarId;
            return (
              <button
                key={pillarId}
                aria-current={isCurrent ? 'page' : undefined}
                className="learning-nav-link"
                onClick={() => go(targetTab)}
              >
                {label}
              </button>
            );
          })}
          <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-1 shrink-0" />
          <button
            aria-current={tab === 'progress' || tab === 'path' ? 'page' : undefined}
            className={`text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg whitespace-nowrap shrink-0 font-medium transition-colors ${
              tab === 'progress' || tab === 'path'
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
            onClick={() => go('progress')}
          >
            Mi preparación
          </button>
          <button className="text-link text-xs whitespace-nowrap shrink-0 ml-1" onClick={() => onNavigate({ view: 'hub', programId: 'bxm', subjectId: 'matematicas', convocatoriaId: '2026-c2' })}>Volver a Matemáticas</button>
        </nav>
      </header>
    )}
    {message && <div role="alert" className="feedback-panel space-y-2"><p>{message}</p>{store.lastError && <button className="secondary-button" onClick={() => { store.retrySave(); setMessage(store.lastError); }}>Reintentar guardado</button>}</div>}
    {active && tab !== 'assessment' && <section className="feedback-panel"><h2>Actividad de aprendizaje guardada</h2><p>{active.items.length} preguntas. {active.deadline ? 'El tiempo sigue corriendo al salir.' : 'Sin límite de tiempo.'}</p><div className="action-row"><button className="primary-button" onClick={resume}>Reanudar aprendizaje</button><button className="secondary-button" onClick={() => setDiscard(true)}>Descartar actividad</button></div></section>}
    {(tab === 'diagnostic' || tab === 'inicio') && <div className="space-y-5">
      {/* Tu preparación & Siguiente paso Dashboard */}
      {(() => {
        const masteryRecords = computeEvidenceMasteryRecords(catalog, events, new Date());
        const measured = masteryRecords.filter(r => r.totalQualifyingCount > 0);
        const weak = masteryRecords.filter(r => r.status === 'needs_reinforcement');
        const inProgress = masteryRecords.filter(r => r.status === 'in_progress');
        const mastered = masteryRecords.filter(r => r.status === 'mastered');
        const lastResult = results[0];

        return <div className="preparation-home">
          <section className="space-y-5 min-w-0">
            <RecommendationCard recommendation={canonicalHomeRecommendation} onPrimaryAction={rec => handleRecommendationAction(rec, false)} onSecondaryAction={rec => handleRecommendationAction(rec, true)} variant="hero" />
            <section className="preparation-summary space-y-3">
              <h2 className="text-xl font-semibold">Tu preparación</h2>
              <p className="muted">{events.length ? `Has trabajado en ${measured.length} de las 71 habilidades del programa.` : 'Tu avance aparecerá después de tu primera actividad.'}</p>
              {events.length > 0 && <div className="mastery-summary"><span><strong>{mastered.length}</strong> Dominadas</span><span><strong>{inProgress.length}</strong> En progreso</span><span><strong>{weak.length}</strong> Necesita práctica</span></div>}
              <button className="text-link" onClick={() => go('progress')}>Ver mi progreso</button>
            </section>
            <section className="space-y-2 border-t border-stone-200 dark:border-stone-800 pt-4">
              <h2 className="text-base font-semibold">¿Cuánto tiempo tienes para estudiar hoy?</h2>
              <div className="study-options">
                <button className="tertiary-button" onClick={() => request({ kind: 'evidence_practice', evidenceKey: canonicalHomeRecommendation.targetId && inventory[canonicalHomeRecommendation.targetId] ? canonicalHomeRecommendation.targetId : [...sampleLessonKeys][0] })}><strong>15 min</strong><span>Reforzar una habilidad</span></button>
                <button className="tertiary-button" onClick={() => results.length ? go('practice') : request({ kind: 'diagnostic' })}><strong>30 min</strong><span>Sesión de práctica</span></button>
                <button className="tertiary-button" onClick={() => go('simulation')}><strong>45-60 min</strong><span>Simulacro de práctica</span></button>
              </div>
            </section>
          </section>
          <aside className="preparation-secondary space-y-5">
            <section className="space-y-2">
              <h2 className="text-base font-semibold">Última actividad</h2>
              {lastResult ? <><p>{lastResult.kind === 'diagnostic' ? 'Diagnóstico' : lastResult.kind === 'mock_exam' ? 'Simulacro de práctica' : 'Sesión de práctica'}</p><p className="muted">{new Date(lastResult.completedAt).toLocaleDateString('es-CR', { timeZone: 'America/Costa_Rica' })} · {lastResult.firstResponseCorrectCount}/{lastResult.totalActualItems} correctas</p><button className="text-link" onClick={() => go('result', undefined, lastResult.sessionId)}>Ver resultado</button></> : <><p className="muted">Todavía no tienes resultados. El diagnóstico te ayuda a descubrir qué conviene reforzar.</p><button className="text-link" onClick={() => request({ kind: 'diagnostic' })}>Hacer diagnóstico</button></>}
            </section>
            <section className="space-y-2 border-t border-stone-200 dark:border-stone-800 pt-4"><h2 className="text-base font-semibold">Simulación de referencia</h2><p className="muted">60 preguntas · 150 minutos. Un ensayo independiente basado en el examen de referencia del MEP.</p><button className="text-link" onClick={() => setShowOfficialBriefing(true)}>Examen oficial de referencia · 60 preguntas</button></section>
          </aside>
        </div>;
      })()}
    </div>}
    {tab === 'temario' && <BxmDigitalTemario
      key={route.evidenceKey || 'catalog'}
      initialEvidenceKey={route.evidenceKey}
      contextReason={route.contextReason}
      completedLessonIds={store.getCompletedLessons().map(l => l.lessonId)}
      onMarkLessonCompleted={lessonId => {
        store.recordLessonCompletion(lessonId);
        setRevision(value => value + 1);
      }}
      onEvidenceChange={key => go('temario', key)}
      capabilities={{ isPremium: capabilities.getTier() === 'premium' }}
      callbacks={{
        onRequestDiagnostic: () => request({ kind: 'diagnostic' }),
        onStartTargetedPractice: key => request({ kind: 'evidence_practice', evidenceKey: key }),
        onMicroQuizAnswered: activity => {
          if (!activity.eventId) return;
          if (!store.recordActivity({ ...activity, eventId: activity.eventId })) setMessage(store.lastError);
          setRevision(value => value + 1);
        },
      }}
    />}
    {tab === 'practice' && <section className="ui-surface p-5 rounded-2xl space-y-4">
      <h2 className="text-xl font-semibold">Práctica por habilidad</h2>
      <LearningConfiguration
        scope={<label>Habilidad<select aria-label="Habilidad" value={selectedEvidence} onChange={event => setSelectedEvidence(event.target.value)}>
          {catalog.map(evidence => <option key={evidence.key} value={evidence.key}>{{ geometry: 'Geometría', functions: 'Funciones', statistics: 'Estadística' }[evidence.domain]} · {evidence.description}</option>)}
        </select></label>}
        difficulty={{ value: difficulty, onChange: setDifficulty, label: 'Dificultad de práctica' }}
        quantity={{ value: practiceCount, onChange: value => setPracticeCount(Number(value)) }}
        summary={{ requested: practiceCount, actual: practiceCount > 0 && practiceCount <= 100 ? practicePreview.totalSelected : 0, scope: catalog.find(evidence => evidence.key === selectedEvidence)?.description || selectedEvidence, difficulty }}
        onSubmit={() => { if (Number.isInteger(practiceCount) && practiceCount > 0 && practiceCount <= 100) request({ kind: 'evidence_practice', evidenceKey: selectedEvidence, difficulty, itemCount: practiceCount }); }}
        submitLabel="Preparar práctica"
      />
      <details><summary className="text-link">Más opciones de práctica</summary><div className="action-row">
        <button className="secondary-button" onClick={() => request({ kind: 'mastery_check', evidenceKey: selectedEvidence })}>Comprobar aprendizaje</button>
        <button className="secondary-button" onClick={() => request({ kind: 'retest', evidenceKey: selectedEvidence })}>Comprobar mi avance</button>
        <button className="secondary-button" onClick={() => request({ kind: 'evidence_practice', evidenceKey: selectedEvidence, generated: true })}>Practicar variantes</button>
      </div></details>
      <button className="text-link" onClick={() => openLesson(selectedEvidence)}>Ver esta evidencia en el temario</button>
    </section>}
    {tab === 'simulation' && <section className="space-y-6">
      <div className="ui-surface p-6 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
            Modalidades de evaluación
          </span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Simulación de Examen BXM</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
          Diseñamos dos experiencias con propósitos pedagógicos diferentes: utiliza el <strong>Simulacro de Práctica</strong> para detectar tus oportunidades de mejora con retroalimentación, o la prueba oficial para medir tu condición general en las condiciones exactas del MEP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Modalidad A: Simulacro formativo de autor */}
        <article className="ui-surface p-6 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/20 flex flex-col justify-between gap-5 shadow-xs">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                Práctica guiada
              </span>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 font-mono">
                20 preguntas · 30 min
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Simulacro de práctica</h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                Diseñado para practicar y detectar oportunidades de mejora antes de la prueba real.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 list-disc list-inside">
              <li>Muestra representativa de Geometría, Funciones y Estadística.</li>
              <li>Al finalizar genera tu <strong>Plan de Nivelación</strong> personalizado.</li>
              <li>Recibe una recomendación para seguir mejorando.</li>
              <li>Permite calibrar y registrar tu dominio de habilidades.</li>
            </ul>
          </div>
          <button className="primary-button w-full cursor-pointer py-2.5 text-xs font-black uppercase tracking-wider" onClick={() => request({ kind: 'mock_exam' })}>
            Iniciar Simulacro Formativo
          </button>
        </article>

        {/* Modalidad B: Simulación oficial de referencia */}
        <article className="ui-surface p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 flex flex-col justify-between gap-5 shadow-xs">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
                Simulación oficial de referencia
              </span>
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400 font-mono">
                60 preguntas · 150 min
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Simulación de referencia</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                Basado en el formato de referencia oficial del MEP para medir tu preparación integral.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 list-disc list-inside">
              <li>Prueba completa e íntegra de la Convocatoria Oficial 2026-c2.</li>
              <li>100% gratuita y libre de límites para todos los estudiantes.</li>
              <li>Su resultado se muestra por separado de tus prácticas de aprendizaje.</li>
              <li>Recomendada como ensayo general previo al examen formal del MEP.</li>
            </ul>
          </div>
          <button className="secondary-button w-full cursor-pointer py-2.5 text-xs font-bold" onClick={() => setShowOfficialBriefing(true)}>
            Iniciar Examen Oficial (60 ítems)
          </button>
        </article>
      </div>
    </section>}
    {(tab === 'progress' || tab === 'path') && (accessService.can('longitudinal_mastery_dashboard')
      ? <BxmPreparationDashboard key={tab} initialTab={tab === 'path' ? 'queue' : 'overview'} events={events} completions={store.getCompletions()} capabilityProvider={capabilities} availableInventoryByEvidence={inventory} availableLessonKeys={lessons.map(l => l.evidenceKey)}
        canonicalRecommendation={canonicalHomeRecommendation} onRecommendationAction={handleRecommendationAction}
        onNavigateToLesson={openLesson} onNavigateToPractice={(key, tier) => request({ kind: 'evidence_practice', evidenceKey: key, difficulty: tier as DifficultyTier })} onOpenUpgradeModal={() => setPaywall(true)} />
      : <section className="feedback-panel space-y-3"><h2>Seguimiento personalizado Premium</h2><p>El diagnóstico, sus resultados básicos y una lección completa por área siguen disponibles gratis.</p><button className="primary-button" onClick={() => setPaywall(true)}>Ver opciones Premium</button></section>)}
    {tab === 'assessment' && (runner && runner.policy.kind !== 'diagnostic' && !accessService.can(runner.policy.kind === 'mock_exam' ? 'configurable_mock_sessions' : 'extended_authored_practice') ? <section className="feedback-panel"><h2>Práctica Pro</h2><p>El intento guardado se conserva. Activa Pro para continuar esta actividad.</p><button className="primary-button" onClick={() => setPaywall(true)}>Ver planes</button></section> : runner && runner.sessionId === route.sessionId ? <BxmSessionRunnerView key={runner.sessionId} runner={runner} onFinish={finish} onStateChange={persist} onExit={() => go('diagnostic')} formulaSheet={<FormulasSheet />} />
      : <section className="feedback-panel"><h2>Actividad no disponible en este perfil</h2><p>Busca el intento guardado o inicia otra actividad.</p><button onClick={() => go('diagnostic')}>Volver al diagnóstico</button></section>)}
    {tab === 'result' && (result ? <>
      <BxmSessionResultBreakdownView result={result} onExit={() => go('diagnostic')} />
      {result.learningContext && <section className="workspace-section" aria-label="Seguimiento del refuerzo">
        <h2>Seguimiento de esta habilidad</h2>
        {(() => { const before = loopOrigin?.evidenceBreakdowns[result.learningContext.evidenceKey]; const after = result.evidenceBreakdowns[result.learningContext.evidenceKey]; return before && after ? <p>Evaluación de origen: {before.correctFirstResponseCount}/{before.totalItems} correctas. Este intento: {after.correctFirstResponseCount}/{after.totalItems}. Las muestras pueden tener preguntas distintas o repetidas.</p> : <p>El resultado de origen no está disponible en este perfil. Puedes continuar con esta habilidad.</p>; })()}
        {loopOrigin && <button className="text-link" onClick={() => go('result', undefined, loopOrigin.sessionId)}>Ver resultado de origen</button>}
      </section>}

      {/* Actionable Launchpad: Lo que ya dominas vs Lo que necesitas reforzar */}
      {(() => {
        const measured = Object.values(result.evidenceBreakdowns).filter(e => e.totalItems > 0);
        const mastered = measured.filter(e => (e.correctFirstResponseCount / e.totalItems) >= 0.75);
        const inProgress = measured.filter(e => {
          const acc = e.correctFirstResponseCount / e.totalItems;
          return acc >= 0.60 && acc < 0.75;
        });
        const needReinforcement = measured.filter(e => (e.correctFirstResponseCount / e.totalItems) < 0.60);

        const domainNames: Record<string, string> = {
          geometry: 'Geometría',
          functions: 'Funciones y Álgebra',
          statistics: 'Estadística y Probabilidad',
        };

        return (
          <section className="ui-surface p-5 sm:p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-800 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {result.kind === 'mock_exam' ? 'Análisis del Simulacro Formativo' : result.kind === 'diagnostic' ? 'Diagnóstico de habilidades' : 'Análisis de esta actividad'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                {result.kind === 'mock_exam' ? 'Resultados del Simulacro: ¿Dónde estás y qué sigue?' : result.kind === 'diagnostic' ? 'Tu diagnóstico: ¿dónde estás y qué sigue?' : result.kind === 'retest' ? 'Tu comprobación: ¿qué sigue?' : 'Tu práctica: ¿qué sigue?'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                {result.kind === 'mock_exam'
                  ? '¿Cómo te fue? → ¿Qué debes mejorar? → ¿Qué haces ahora? Revisa tus fortalezas y tu plan de nivelación recomendado.'
                  : 'Revisa las fortalezas y las habilidades por reforzar en este intento. El dominio acumulado se consulta en Mi preparación.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Columna A: Lo que ya dominas */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold">✓</span>
                  <span>Fortalezas en este intento ({mastered.length})</span>
                </div>
                {mastered.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                    {mastered.map(m => {
                      const acc = Math.round((m.correctFirstResponseCount / m.totalItems) * 100);
                      return (
                        <li key={m.evidenceId} className="flex items-center justify-between">
                          <span className="font-medium">{catalog.find(item => item.key === m.evidenceId)?.description || domainNames[m.domain] || 'Habilidad evaluada'}</span>
                          <span>{acc}% en este intento</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    Continúa practicando para ampliar la evidencia de aprendizaje; este resumen solo refleja las preguntas evaluadas.
                  </p>
                )}
              </div>

              {/* Columna B: Necesitas reforzar */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                  <span>⚠</span>
                  <span>Necesitas reforzar ({needReinforcement.length + inProgress.length})</span>
                </div>
                {needReinforcement.length + inProgress.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                    {[...needReinforcement, ...inProgress].map(m => {
                      const acc = Math.round((m.correctFirstResponseCount / m.totalItems) * 100);
                      return (
                        <li key={m.evidenceId} data-evidence-key={m.evidenceId} className="flex flex-wrap gap-2 items-center justify-between">
                          <span className="font-medium">{catalog.find(item => item.key === m.evidenceId)?.description || domainNames[m.domain] || 'Habilidad evaluada'}</span>
                          <span>{acc}% en este intento</span>
                          <button className="secondary-button" onClick={() => request({ kind: 'evidence_practice', evidenceKey: m.evidenceId })}>Practicar esta habilidad</button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    ¡Excelente! No se detectaron debilidades críticas en esta sesión.
                  </p>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Prominent Decision Card: Tu siguiente paso recomendado (derived from canonical recommendation engine) */}
      {canonicalResultRecommendation && (
        <section className="space-y-2">
          <RecommendationCard
            recommendation={canonicalResultRecommendation}
            onPrimaryAction={(rec) => handleRecommendationAction(rec, false)}
            onSecondaryAction={(rec) => handleRecommendationAction(rec, true)}
            variant="hero"
          />
        </section>
      )}

      {/* Plan de Nivelación: Rendered when a mock_exam or diagnostic yields areas needing remediation */}
      {remediationPlan && remediationPlan.topPriorityDrilldowns.length > 0 && (
        <PlanDeNivelacionView
          plan={remediationPlan}
          onLaunchRemediationPractice={() => go('practice')}
          onLaunchGuidedPractice={key => request({ kind: 'evidence_practice', evidenceKey: key })}
          evidenceLabel={key => catalog.find(evidence => evidence.key === key)?.description || key}
        />
      )}

      {/* Retest Recovery and Mastery Update Card */}
      {retestRecoveryStatus && (
        <section className={`ui-surface p-5 sm:p-6 rounded-2xl border-2 space-y-3 min-w-0 overflow-hidden ${
          retestRecoveryStatus.isRecovered
            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
            : 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${retestRecoveryStatus.isRecovered ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <h2 className={`text-xs font-black uppercase tracking-wider ${
              retestRecoveryStatus.isRecovered ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'
            }`}>
              Tu avance después del refuerzo
            </h2>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {retestRecoveryStatus.isRecovered
                ? `¡Has reforzado esta habilidad! (${retestRecoveryStatus.retestScore}%)`
                : `Comprobación completada (${retestRecoveryStatus.retestScore}%) · Continúa reforzando`}
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              {retestRecoveryStatus.isRecovered
                ? `Has superado el 75% en esta comprobación. Estado acumulado: ${retestRecoveryStatus.statusLabel}. Un resultado aislado no certifica dominio; también se requiere variedad de familias y respuestas sin ayudas.`
                : `Tu precisión acumulada es ${retestRecoveryStatus.overallAccuracy}%. Te recomendamos realizar otra práctica o repasar el tema en el temario.`}
            </p>
          </div>
          <div className="action-row pt-1">
            <button className="primary-button" onClick={() => go('progress')}>
              Ver mi preparación actualizada
            </button>
            {!retestRecoveryStatus.isRecovered && (
              <button className="secondary-button" onClick={() => request({ kind: 'evidence_practice', evidenceKey: retestRecoveryStatus.evidenceKey })}>
                Volver a practicar
              </button>
            )}
          </div>
        </section>
      )}

      {result.kind === 'evidence_practice' && Object.keys(result.evidenceBreakdowns)[0] && <section className="workspace-section" aria-label="Siguiente paso del refuerzo">
        <h2>Comprueba tu avance sin ayudas</h2><p>Después del repaso, realiza una comprobación de esta misma habilidad. Las preguntas repetidas se identifican; un único resultado no certifica dominio.</p>
        <button className="primary-button" onClick={() => request({ kind: 'retest', evidenceKey: Object.keys(result.evidenceBreakdowns)[0] })}>Comprobar mi avance sin ayudas</button>
      </section>}
      {/* Post-practice Mastery Eligibility Decision */}
      {practiceMasteryStatus && (
        <section className="ui-surface p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Comprobación de Dominio</h2>
          {practiceMasteryStatus.isEligibleForMasteryCheck ? (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 font-medium">
                ¡Excelente práctica! Has alcanzado el criterio para comprobar tu dominio en esta evidencia.
              </p>
              <button className="primary-button" onClick={() => request({ kind: 'mastery_check', evidenceKey: practiceMasteryStatus.evidenceKey })}>
                Comprobar dominio ahora
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Llevas {practiceMasteryStatus.qualifyingCount} de {practiceMasteryStatus.minRequired} familias evaluadas. Continúa reforzando antes de la comprobación de dominio.
              </p>
              <button className="secondary-button" onClick={() => request({ kind: 'evidence_practice', evidenceKey: practiceMasteryStatus.evidenceKey })}>
                Seguir practicando esta evidencia
              </button>
            </div>
          )}
        </section>
      )}

      <section className="ui-surface p-5 rounded-2xl space-y-3"><h2 className="text-xl font-semibold">Detalle por habilidad</h2><p>Solo las habilidades evaluadas tienen un resultado.</p>
        {Object.values(result.evidenceBreakdowns).map(e => <div key={e.evidenceId} className="flex flex-wrap gap-3 items-center"><span>{catalog.find(item => item.key === e.evidenceId)?.description || 'Habilidad evaluada'}: {e.correctFirstResponseCount}/{e.totalItems}</span><button className="text-link" onClick={() => openLesson(e.evidenceId)}>Repasar este tema</button>{e.correctFirstResponseCount < e.totalItems && <button className="secondary-button" onClick={() => request({ kind: 'evidence_practice', evidenceKey: e.evidenceId })}>Practicar esta habilidad</button>}</div>)}
        <div className="action-row pt-2">
          <button className="secondary-button" onClick={() => go('progress')}>Ver mi preparación</button>
          <button className="secondary-button" onClick={() => downloadResult(result)}>Descargar resultado</button>
        </div>
      </section>
      <ResultReview result={result} onExpose={id => { if (!store.markExposed(id)) setMessage(store.lastError); }} />
    </> : <FeedbackState title="Este resultado no está disponible" description="Vuelve a tu preparación para consultar tus actividades o iniciar una nueva." action={<button className="secondary-button" onClick={() => go('inicio')}>Volver a mi preparación</button>} />)}
    {tab === 'progress' && <section className="ui-surface p-5 rounded-2xl space-y-3">
      <h2 className="text-xl font-semibold">Resultados de aprendizaje de este perfil</h2>
      {!results.length && <p>Aún no hay resultados de aprendizaje.</p>}
      {results.map(r => <div className="flex flex-wrap gap-3" key={r.sessionId}><span>{new Date(r.completedAt).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })} · {r.firstResponseCorrectCount}/{r.totalActualItems}</span><button className="text-link" onClick={() => go('result', undefined, r.sessionId)}>Revisar aprendizaje</button></div>)}
      <p>Comprobaciones de lección: {store.getActivities().length}. Se registran como actividad; no certifican dominio.</p>
      {legacy.length > 0 && <><p>{legacy.length} registros anteriores se conservan en el historial de referencia.</p><button className="secondary-button" onClick={() => { store.progress.importLegacyBaselineAttempts(); const report = store.progress.lastImport; setMessage(`Importados: ${report.imported}; solo resumen: ${report.summaryOnly}; omitidos: ${report.skipped}. Los registros antiguos no cuentan para dominio.`); setRevision(value => value+1); }}>Importar historial anterior de este perfil</button></>}
    </section>}
    {pending && <AssessmentBriefing title="Antes de comenzar la actividad" onClose={() => setPending(null)}
      summary={{ requested: pending.selection.totalRequested, actual: pending.selection.totalSelected,
        scope: pending.request.evidenceKey ? catalog.find(evidence => evidence.key === pending.request.evidenceKey)?.description || pending.request.evidenceKey : 'Todo el programa',
        difficulty: pending.request.difficulty, timerMinutes: policyFor(pending.request.kind).enableTimer ? policyFor(pending.request.kind).timeLimitMinutes : undefined }}
      onStart={begin} startLabel={pending.selection.isPartial ? 'Aceptar actividad limitada' : 'Comenzar actividad'}>
      <p>{policyFor(pending.request.kind).mode === 'exam' ? `${policyFor(pending.request.kind).timeLimitMinutes} minutos; sin pistas ni corrección antes de entregar.` : 'Sin cronómetro; con explicación y reintentos.'}</p>
      {pending.selection.isPartial && <p role="status">Cobertura limitada: no hay suficientes preguntas para completar esta selección. Puedes aceptar una actividad más corta.</p>}
      <p>{new Set(pending.selection.items.map(i => i.evidenceId)).size} habilidades del programa en esta actividad.</p>
      <p>{pending.selection.items.filter(i => events.some(e => e.itemId === String(i.id) || (!!i.familyId && e.familyId === i.familyId))).length} preguntas son similares a otras que ya practicaste.</p>
      <p>Contenido de autor con controles automáticos; revisión matemática humana pendiente. La nota es un indicador de estudio, no una predicción oficial.</p>
    </AssessmentBriefing>}
    {discard && <Dialog title="¿Descartar la actividad de aprendizaje?" onClose={() => setDiscard(false)}><p>No se registrará un resultado; se conservan las exposiciones a explicaciones ya mostradas.</p><button className="primary-button" onClick={() => { const ok = store.discardActive(); setRunner(null); setDiscard(false); setMessage(ok ? '' : store.lastError); setRevision(value => value+1); go('diagnostic'); }}>Sí, descartar actividad</button></Dialog>}
    {showOfficialBriefing && (
      <AssessmentBriefing
        title="Preparación para la simulación de referencia (60 ítems)"
        onClose={() => setShowOfficialBriefing(false)}
        summary={{ requested: 60, actual: 60, scope: 'Todo el programa', timerMinutes: 150 }}
        startLabel="Comenzar Simulación Oficial (150 min)"
        onStart={() => { setShowOfficialBriefing(false); onOfficialSimulation(); }}
      >
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20 space-y-1.5">
            <span className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide text-[11px] block">
              Condiciones Reales del Examen MEP
            </span>
            <p className="text-xs leading-relaxed">
              Estás a punto de iniciar la <strong>Simulación Oficial de Referencia</strong> correspondiente a la convocatoria 2026-c2.
              Esta evaluación consta de <strong>60 preguntas</strong> con un temporizador estricto de <strong>150 minutos (2 horas y media)</strong>.
            </p>
          </div>

          {(() => {
            const records = computeEvidenceMasteryRecords(catalog, events, new Date());
            const masteredCount = records.filter(r => r.status === 'mastered').length;
            const inProgressCount = records.filter(r => r.status === 'in_progress').length;
            const needsWorkCount = records.filter(r => r.status === 'needs_reinforcement').length;
            return (
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider">
                  Estado de tu preparación actual
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 block">{masteredCount}</span>
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium">Dominadas</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                    <span className="text-lg font-black text-amber-700 dark:text-amber-300 block">{inProgressCount}</span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-400 font-medium">En progreso</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                    <span className="text-lg font-black text-rose-700 dark:text-rose-300 block">{needsWorkCount}</span>
                    <span className="text-[10px] text-rose-800 dark:text-rose-400 font-medium">Necesitan práctica</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 italic">
                  {needsWorkCount > 0
                    ? 'Recomendación: Puedes repasar las áreas con oportunidad de mejora antes del ensayo general o continuar para medir tu preparación integral.'
                    : 'Listo para medir tu preparación integral bajo condiciones de examen.'}
                </p>
              </div>
            );
          })()}

          <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 list-disc list-inside">
            <li>El benchmark no contamina ni sobreescribe tus registros de dominio de autor.</li>
            <li>Asegúrate de disponer de 150 minutos continuos sin interrupciones.</li>
            <li>Calculadora no programable. Consulta las condiciones del material de referencia.</li>
          </ul>

        </div>
      </AssessmentBriefing>
    )}
    <PaywallModal isOpen={paywall} onClose={() => setPaywall(false)} />
  </div>;
}
function ResultReview({ result, onExpose }: { result: SessionResultExport; onExpose: (id: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  return <section className="ui-surface p-5 rounded-2xl space-y-3"><h2 className="text-xl font-semibold">Revisión y explicación</h2>{result.itemSnapshots.map((item, index) => <article className="border rounded-xl p-3 min-w-0" key={item.id}>
    <button className="text-link" aria-expanded={open === String(item.id)} onClick={() => { setOpen(String(item.id)); onExpose(String(item.id)); }}>Revisar pregunta {index+1}</button>
    {open === String(item.id) && <div className="space-y-3"><TextRenderer content={item.stem} /><p>Respuesta correcta: {item.correctAnswer}</p><TextRenderer content={Array.isArray(item.options) ? item.options.find(o => o.letter === item.correctAnswer)?.text : item.options[item.correctAnswer]} />
      {item.solutionSteps?.map((step, i) => <TextRenderer key={i} content={typeof step === 'string' ? step : step.explanation} />)}</div>}
  </article>)}</section>;
}
function downloadResult(result: SessionResultExport) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = `bxm-${result.sessionId}.json`; link.click(); URL.revokeObjectURL(url);
}
