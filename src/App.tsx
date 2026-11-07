import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { PracticeConfig, TestSession } from './types';
import { storageService } from './services/storageService';
import { programManifest } from './services/programCatalog';
import type { createSession } from './services/learningSession';
import { validSession } from './services/sessionStorageMetadata';
import { WizardProvider } from './components/onboarding/wizardStore';
import { LearnerProvider, useLearner } from './context/LearnerContext';
import { ActivityContext } from './components/layout/ActivityContext';
import { PublicShell } from './components/layout/PublicShell';
import { LearnerShell } from './components/layout/LearnerShell';
import { EntryLandingPage } from './components/pages/EntryLandingPage';

import { FeedbackState } from './components/common/FeedbackState';
import { Dialog } from './components/common/Dialog';
import { PaywallModal } from './components/common/PaywallModal';
import { canStartLegacyActivity } from './services/practiceAccess';
import { useSubscriptionCapabilities } from './hooks/useCapabilities';
import { type AppRoute, readRoute, routeHash } from './services/navigation';
const OfficialCalendar = lazy(() => import('./components/knowledge/OfficialCalendar').then(module => ({ default: module.OfficialCalendar })));
const SubjectHubPage = lazy(() => import('./components/pages/LandingPage').then(module => ({ default: module.SubjectHubPage })));
const TestShell = lazy(() => import('./components/test/TestShell').then(module => ({ default: module.TestShell })));
const ResultsPage = lazy(() => import('./components/results/ResultsPage').then(module => ({ default: module.ResultsPage })));
const FrameworkHubPage = lazy(() => import('./components/pages/FrameworkHubPage').then(module => ({ default: module.FrameworkHubPage })));
const ContextControls = lazy(() => import('./components/pages/FrameworkHubPage').then(module => ({ default: module.ContextControls })));
const ExamReviewPage = lazy(() => import('./components/pages/ExamReviewPage').then(module => ({ default: module.ExamReviewPage })));
const GenericSubjectHubPage = lazy(() => import('./components/pages/GenericSubjectHubPage').then(module => ({ default: module.GenericSubjectHubPage })));
const HelperPage = lazy(() => import('./components/onboarding/HelperPage').then(module => ({ default: module.HelperPage })));
const ReadinessWizard = lazy(() => import('./components/onboarding/ReadinessWizard').then(module => ({ default: module.ReadinessWizard })));
const BxmLearningHub = lazy(() => import('./features/bxm-integration/BxmLearningHub').then(module => ({ default: module.BxmLearningHub })));
const AboutFaqPage = lazy(() => import('./components/pages/AboutFaqPage').then(module => ({ default: module.AboutFaqPage })));
const WelcomePage = lazy(() => import('./components/pages/WelcomePage').then(module => ({ default: module.WelcomePage })));

export function App() {
  return (
    <WizardProvider>
      <LearnerProvider>
        <AppContent />
      </LearnerProvider>
    </WizardProvider>
  );
}

function AppContent() {
  const { learnerId, learner } = useLearner();
  const [route, setRoute] = useState(() => readRoute(window.location.hash));
  const [loadedContext, setLoadedContext] = useState<{ key: string; createSession: typeof createSession } | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [active, setActive] = useState<TestSession | null>(null);
  const [completed, setCompleted] = useState<TestSession | null>(null);
  const [pending, setPending] = useState<PracticeConfig | null>(null);
  const [pendingSource, setPendingSource] = useState<TestSession | null>(null);
  const [discard, setDiscard] = useState(false);
  const [paywall, setPaywall] = useState(false);

  useSubscriptionCapabilities();
  const main = useRef<HTMLElement>(null);
  const userId = learnerId;

  const program = programManifest.programs.find(p => p.id === route.programId);
  const mvp = route.programId === 'bxm' && route.subjectId === 'matematicas' && route.convocatoriaId === '2026-c2';
  const contextKey = [route.programId, route.subjectId, route.moduleId, route.convocatoriaId].join('/');
  const needsContext = !!program && ['framework', 'hub', 'test', 'results', 'learning'].includes(route.view);
  const contextReady = !needsContext || loadedContext?.key === contextKey;
  const review = route.tab === 'review' && route.programId === 'i_ii_ciclo' &&
    route.subjectId === 'matematicas' && route.convocatoriaId === '2026-c2';

  const navigate = (next: AppRoute) => {
    const hash = routeHash(next);
    if (window.location.hash === hash) setRoute(next);
    else window.location.hash = hash;
  };

  useEffect(() => {
    const changed = () => setRoute(readRoute(window.location.hash));
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError('');
    if (!needsContext) return;
    setLoadedContext(null);
    (async () => {
      try {
        const [{ dataService }, { createSession }] = await Promise.all([
          import('./services/dataService'),
          import('./services/learningSession'),
        ]);
        if (cancelled) return;
        await dataService.setProgram(program.id, route.moduleId, route.convocatoriaId, route.subjectId);
        if (!cancelled) setLoadedContext({ key: contextKey, createSession });
      } catch {
        if (!cancelled) setError('No pudimos cargar esta materia. Reintenta o explora los recursos disponibles.');
      }
    })();
    return () => { cancelled = true; };
  }, [needsContext, contextKey, retry]);

  useEffect(() => {
    if (contextReady && route.view === 'hub') {
      try {
        localStorage.setItem('mep_last_subject', routeHash(route));
      } catch {
        // Navigation still works without storage.
      }
    }
    const label = route.view === 'learning'
      ? 'Aprendizaje guiado BXM'
      : route.view === 'test'
      ? 'Prueba en curso'
      : route.view === 'results'
      ? 'Resultados'
      : route.view === 'guide'
      ? 'Guía opcional'
      : route.view === 'calendar'
      ? 'Calendario DGEC'
      : route.view === 'helper'
      ? 'Guía y recursos'
      : route.view === 'about'
      ? 'FAQ y Acerca de'
      : program?.name || 'Educación Abierta';
    document.title = label + ' · MEP-EA-01';
  }, [route.view, route.programId, route.subjectId, route.moduleId, route.convocatoriaId, route.sessionId, route.tab, route.resourceTab, contextReady]);

  const hub = () => navigate({ ...route, view: 'hub', sessionId: undefined, tab: test?.config.reviewDraft || result?.config.reviewDraft ? 'review' : route.tab });
  const saved = storageService.getActiveSession(userId);
  const resumable = validSession(saved, userId) ? saved : null;
  const matchesRoute = (session: TestSession | null) =>
    session &&
    (session.config.programId || 'bxm') === route.programId &&
    (session.config.subjectId || 'matematicas') === route.subjectId &&
    (session.config.convocatoriaId || '2026-c2') === route.convocatoriaId &&
    (session.config.subprogramId || '') === (route.moduleId || '');

  const candidateTest = active && active.sessionId === route.sessionId && active.userId === userId
    ? active
    : resumable?.sessionId === route.sessionId
    ? resumable
    : null;
  const candidateResult = route.view !== 'results'
    ? null
    : completed && completed.sessionId === route.sessionId && completed.userId === userId
    ? completed
    : storageService.getResult(route.sessionId, userId);

  const test = matchesRoute(candidateTest) ? candidateTest : null;
  const result = matchesRoute(candidateResult) ? candidateResult : null;

  function begin(config: PracticeConfig, force = false, source?: TestSession | null) {
    if (!canStartLegacyActivity(config)) { setPaywall(true); return; }
    const context = {
      ...config,
      programId: route.programId || 'bxm',
      subjectId: route.subjectId || 'matematicas',
      subprogramId: route.moduleId,
      convocatoriaId: route.convocatoriaId || '2026-c2',
    };
    if (!force && resumable) { setPending(context); setPendingSource(source || null); return; }
    if (loadedContext?.key !== contextKey) return;
    const session = { ...loadedContext.createSession(context, source?.items, source?.groups), userId };
    if (!session.items?.length) { setError('No hay preguntas disponibles con esta selección.'); return; }
    storageService.saveActiveSession(session);
    setActive(session);
    setPending(null);
    navigate({
      ...route,
      view: 'test',
      sessionId: session.sessionId,
      programId: context.programId,
      subjectId: context.subjectId,
      convocatoriaId: context.convocatoriaId,
    });
  }

  function resume() {
    if (!resumable) return;
    if (!canStartLegacyActivity(resumable.config)) { setPaywall(true); return; }
    setActive(resumable);
    setPending(null);
    navigate({
      view: 'test',
      programId: resumable.config.programId || 'bxm',
      subjectId: resumable.config.subjectId || 'matematicas',
      convocatoriaId: resumable.config.convocatoriaId || '2026-c2',
      moduleId: resumable.config.subprogramId,
      tab: resumable.config.reviewDraft ? 'review' : undefined,
      sessionId: resumable.sessionId,
    });
  }

  const enterMath = () => navigate({ view: 'hub', programId: 'bxm', subjectId: 'matematicas', convocatoriaId: '2026-c2' });

  // Determine whether learner is in study workspace or public exploration
  const isLearnerWorkspace = route.view === 'learning';

  const viewContent = (
    <main id="main-content" ref={main} tabIndex={-1} className="flex-1 outline-none">
      {error && (
        <section className="page-width py-6" role="alert">
          <h1>No se pudo completar la carga</h1>
          <p>{error}</p>
          <div className="action-row">
            <button className="primary-button" onClick={() => setRetry(v => v + 1)}>Reintentar</button>
            <button className="secondary-button" onClick={() => navigate({ view: 'helper', programId: route.programId })}>
              Consultar recursos
            </button>
          </div>
        </section>
      )}

      {!error && (
        <Suspense fallback={<div className="page-width py-6"><FeedbackState busy title="Preparando tu espacio de estudio…" description="Enseguida podrás continuar." /></div>}>
          {['test', 'results'].includes(route.view) && <ActivityContext route={route} />}
          {contextReady && <RouteFocus key={['focus', route.view, contextKey, route.sessionId, route.evidenceKey].join(':')} main={main} />}
          {route.view !== 'test' && route.view !== 'results' && resumable && (
            <section className="resume-banner page-width">
              <div>
                <strong>Tienes un intento guardado</strong>
                <p>{resumable.itemIds.length} preguntas · {resumable.config.enableTimer ? 'El tiempo continúa mientras estás fuera.' : 'Práctica sin límite de tiempo.'}</p>
              </div>
              <div className="action-row">
                <button className="primary-button" onClick={resume}>Reanudar intento</button>
                <button className="secondary-button" onClick={() => setDiscard(true)}>Descartar</button>
              </div>
            </section>
          )}

          {route.view === 'landing' && <EntryLandingPage onOpenHelper={() => navigate({ view: 'helper' })} onExplorePrograms={() => navigate({ view: 'welcome' })} onEnterBxmHub={enterMath} />}
          {route.view === 'welcome' && <WelcomePage onSelectProgram={programId => navigate({ view: 'framework', programId, convocatoriaId: '2026-c2' })} onEnterMvpMath={enterMath} />}
          {route.view === 'calendar' && (
            <div className="page-width py-8 space-y-5">
              <h1 className="text-3xl font-semibold">Calendario DGEC</h1>
              <OfficialCalendar key={routeHash(route)} initialProgram={route.programId} initialConvocatoria={route.convocatoriaId} />
            </div>
          )}
          {route.view === 'about' && <AboutFaqPage onNavigate={navigate} />}
          {route.view === 'helper' && <HelperPage route={route} onNavigate={navigate} />}
          {route.view === 'guide' && <ReadinessWizard onNavigate={navigate} onSkip={() => navigate({ view: 'welcome' })} onExplore={() => navigate({ view: 'helper' })} />}

          {!contextReady && ['framework', 'hub', 'test', 'results', 'learning'].includes(route.view) && (
            <div className="page-width py-6">
              <FeedbackState busy title="Preparando tu materia…" description="Estamos cargando las lecciones y actividades." />
            </div>
          )}

          {contextReady && mvp && route.view === 'learning' && (
            <BxmLearningHub
              key={userId}
              userId={userId}
              route={route}
              onNavigate={navigate}
              onOfficialSimulation={() => begin({ mode: 'simulation', itemCount: 60, enableTimer: true, timerDurationMinutes: 150 })}
            />
          )}

          {contextReady && program && route.view === 'framework' && (
            <FrameworkHubPage program={program} route={route} onNavigate={navigate} />
          )}

          {contextReady && route.view === 'hub' && review && (
            <ExamReviewPage route={route} userId={userId} onStart={config => begin(config)} />
          )}

          {contextReady && program && route.view === 'hub' && !mvp && !review && (
            <GenericSubjectHubPage key={routeHash(route)} program={program} route={route} onNavigate={navigate} onStartPractice={config => begin(config)} />
          )}

          {contextReady && mvp && route.view === 'hub' && (
            <SubjectHubPage
              contextControls={<ContextControls program={program!} route={route} onChange={navigate} />}
              currentUser={learner}
              route={route}
              onNavigate={navigate}
              onStartSimulation={() => begin({ mode: 'simulation', itemCount: 60, enableTimer: true, timerDurationMinutes: 150 })}
              onStartPractice={config => begin(config)}
              onStartPracticeByItems={(itemIds, title) => begin({ mode: 'area', itemIds, title, itemCount: itemIds.length, enableTimer: false, timerDurationMinutes: 30 })}
              onNavigateHome={() => navigate({ ...route, view: 'framework', subjectId: undefined })}
            />
          )}

          {contextReady && route.view === 'test' && (
            test && !canStartLegacyActivity(test.config) ? (
              <section className="page-width py-6">
                <h1>Práctica Pro</h1>
                <p>Esta actividad requiere el plan Pro. El intento guardado se conserva.</p>
                <button className="primary-button" onClick={() => setPaywall(true)}>Ver planes</button>
                <button className="secondary-button" onClick={hub}>Volver a la materia</button>
              </section>
            ) : test ? (
              <TestShell
                key={test.sessionId}
                config={test.config}
                initialSession={test}
                onLeave={hub}
                onFinishTest={session => {
                  setCompleted(session);
                  setActive(null);
                  navigate({ ...route, view: 'results', sessionId: session.sessionId });
                }}
              />
            ) : (
              <section className="page-width p-8">
                <h1>No hay un intento activo para esta dirección</h1>
                <p>Vuelve a tu materia para iniciar o reanudar una práctica.</p>
                <button className="primary-button" onClick={hub}>Volver a la materia</button>
              </section>
            )
          )}

          {contextReady && route.view === 'results' && (
            result ? (
              <ResultsPage
                key={result.sessionId}
                session={result}
                onRetry={() => begin({ ...result.config, itemIds: result.itemIds }, false, result)}
                onNewTest={hub}
                onGoHome={hub}
                onPracticeMissed={config => begin(config, false, result)}
                onPracticeWeakestArea={area => begin({ mode: 'area', area, itemCount: 10, enableTimer: false, timerDurationMinutes: 30 }, false)}
              />
            ) : (
              <section className="page-width p-8">
                <h1>Resultado no disponible en este perfil</h1>
                <p>Los resultados se guardan solo en este navegador.</p>
                <button className="primary-button" onClick={hub}>Volver a la materia</button>
              </section>
            )
          )}
        </Suspense>
      )}
    </main>
  );

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); main.current?.focus(); }}>
        Saltar al contenido
      </a>

      {isLearnerWorkspace ? (
        <LearnerShell currentRoute={route} onNavigate={navigate}>
          {viewContent}
        </LearnerShell>
      ) : (
        <PublicShell
          currentRoute={route}
          onNavigate={navigate}
          onProgramChange={(programId) => {
            const target = programManifest.programs.find(p => p.id === programId);
            const subjectId = target?.subjects.find(s => s.id === route.subjectId)?.id;
            navigate({ view: subjectId ? 'hub' : 'framework', programId, subjectId, convocatoriaId: route.convocatoriaId });
          }}
        >
          {viewContent}
        </PublicShell>
      )}

      <PaywallModal isOpen={paywall} onClose={() => setPaywall(false)} featureTitle="Práctica Pro" />

      {pending && (
        <Dialog title="Ya tienes un intento guardado" onClose={() => setPending(null)}>
          <p>Puedes reanudarlo o descartarlo para comenzar la nueva selección. No se mezclarán sus respuestas.</p>
          <div className="action-row">
            <button className="primary-button" onClick={resume}>Reanudar intento</button>
            <button className="secondary-button" onClick={() => begin(pending, true, pendingSource)}>
              Descartar anterior e iniciar otro
            </button>
          </div>
        </Dialog>
      )}

      {discard && (
        <Dialog title="¿Descartar el intento guardado?" onClose={() => setDiscard(false)}>
          <p>Se eliminarán sus respuestas sin registrar un resultado.</p>
          <button
            className="primary-button"
            onClick={() => {
              storageService.clearActiveSession();
              setActive(null);
              setDiscard(false);
            }}
          >
            Sí, descartar
          </button>
        </Dialog>
      )}
    </div>
  );
}
function RouteFocus({ main }: { main: { current: HTMLElement | null } }) {
  useEffect(() => {
    const heading = main.current?.querySelector<HTMLElement>('h1');
    if (heading) { heading.tabIndex = -1; heading.focus(); }
  }, [main]);
  return null;
}

export default App;
