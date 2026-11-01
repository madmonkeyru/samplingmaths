import { useState, useEffect } from 'react';
import { User, PracticeConfig, TestSession } from './types';
import { storageService } from './services/storageService';
import { dataService } from './services/dataService';
import { Header } from './components/layout/Header';
import { EntryLandingPage } from './components/pages/EntryLandingPage';
import { WelcomePage } from './components/pages/WelcomePage';
import { SubjectHubPage } from './components/pages/LandingPage';
import { TestShell } from './components/test/TestShell';
import { ResultsPage } from './components/results/ResultsPage';
import { FrameworkHubPage, ContextControls } from './components/pages/FrameworkHubPage';
import { GenericSubjectHubPage } from './components/pages/GenericSubjectHubPage';
import { AppRoute, readRoute, routeHash } from './services/navigation';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Views: 'landing' (entry flow validation), 'welcome' (program selection portal), 'hub' (subject hub), 'test' (simulation/practice), 'results' (results screen)
  const [route, setRoute] = useState<AppRoute>(() => readRoute(window.location.hash));
  const [currentView, setCurrentView] = useState<AppRoute['view'] | 'test' | 'results'>(route.view);
  const [contextReady, setContextReady] = useState(false);
  const navigate = (next: AppRoute) => {
    const hash = routeHash(next);
    if (window.location.hash === hash) setCurrentView(next.view);
    else window.location.hash = hash;
  };
  useEffect(() => {
    const update = () => {
      const next = readRoute(window.location.hash);
      setContextReady(false);
      setRoute(next);
      setCurrentView(next.view);
      setActiveConfig(null);
      setCompletedSession(null);
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    let cancelled = false;
    async function syncContext() {
      setContextReady(false);
      if (route.programId) {
        await dataService.setProgram(route.programId, route.moduleId, route.convocatoriaId);
        if (!cancelled && route.subjectId && dataService.getCurrentSubjectId() !== route.subjectId) {
          await dataService.loadSubject(route.programId, route.subjectId);
        }
      }
      if (!cancelled) setContextReady(true);
    }
    void syncContext();
    return () => { cancelled = true; };
  }, [route]);
  const program = dataService.getPrograms().find(p => p.id === route.programId);
  const isMvp = route.programId === 'bxm' && route.subjectId === 'matematicas' && route.convocatoriaId === '2026-c2';
  const [activeConfig, setActiveConfig] = useState<PracticeConfig | null>(null);
  const [completedSession, setCompletedSession] = useState<TestSession | null>(null);

  useEffect(() => {
    setCurrentUser(storageService.getCurrentUser());
  }, []);

  const handleStartSimulation = () => {
    if (!isMvp || !contextReady) return;
    const config: PracticeConfig = {
      mode: 'simulation',
      itemCount: 60,
      enableTimer: true,
      timerDurationMinutes: 150,
      programId: route.programId,
      subprogramId: route.moduleId,
      convocatoriaId: route.convocatoriaId,
    };
    setActiveConfig(config);
    setCurrentView('test');
  };

  const handleStartPractice = (config: PracticeConfig) => {
    if (!isMvp || !contextReady) return;
    setActiveConfig({ ...config, programId: route.programId, subprogramId: route.moduleId, convocatoriaId: route.convocatoriaId });
    setCurrentView('test');
  };

  const handleFinishTest = (session: TestSession) => {
    setCompletedSession(session);
    setCurrentView('results');
  };

  const handleRetry = () => {
    if (completedSession) {
      setActiveConfig(completedSession.config);
      setCurrentView('test');
    }
  };

  const handleNewTest = () => {
    setActiveConfig(null);
    setCompletedSession(null);
    setCurrentView('hub');
  };

  const handleSelectProgramFromPortal = (programId: string) => {
    navigate({ view: 'framework', programId, convocatoriaId: '2026-c2' });
  };

  const handleEnterBxmHubDirectly = () => {
    navigate({ view: 'hub', programId: 'bxm', subjectId: 'matematicas', convocatoriaId: '2026-c2' });
  };

  return (
    <div className="app-shell min-h-screen font-sans text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">
      <Header
        currentUser={currentUser}
        onUserChanged={setCurrentUser}
        onNavigateHome={() => navigate({ view: 'landing' })}
        currentView={currentView}
        onProgramChange={(programId) => {
          const target = dataService.getPrograms().find(p => p.id === programId);
          const subjectId = target?.subjects.find(s => s.id === route.subjectId)?.id;
          navigate({ view: route.view === 'hub' && subjectId ? 'hub' : 'framework', programId, subjectId, convocatoriaId: route.convocatoriaId });
        }}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <EntryLandingPage
            onExplorePrograms={() => navigate({ view: 'welcome' })}
            onEnterBxmHub={handleEnterBxmHubDirectly}
          />
        )}

        {currentView === 'welcome' && (
          <WelcomePage
            onSelectProgram={handleSelectProgramFromPortal}
            onEnterMvpMath={handleEnterBxmHubDirectly}
          />
        )}

        {currentView === 'framework' && program && contextReady && <FrameworkHubPage program={program} route={route} onNavigate={navigate} />}
        {(currentView === 'hub' || currentView === 'framework') && !contextReady && <p role="status" className="p-8">Cargando programa…</p>}
        {currentView === 'hub' && program && contextReady && !isMvp && <GenericSubjectHubPage key={`${route.programId}/${route.subjectId}/${route.moduleId}/${route.convocatoriaId}`} program={program} route={route} onNavigate={navigate} />}
        {currentView === 'hub' && program && contextReady && isMvp && (
          <>
          <SubjectHubPage
            contextControls={<ContextControls program={program} route={route} onChange={navigate} />}
            currentUser={currentUser}
            onStartSimulation={handleStartSimulation}
            onStartPractice={handleStartPractice}
            onNavigateHome={() => navigate({ ...route, view: 'framework', subjectId: undefined })}
          />
          </>
        )}

        {currentView === 'test' && activeConfig && (
          <TestShell config={activeConfig} onFinishTest={handleFinishTest} />
        )}

        {currentView === 'results' && completedSession && (
          <ResultsPage
            session={completedSession}
            onRetry={handleRetry}
            onNewTest={handleNewTest}
            onGoHome={() => setCurrentView('hub')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
