import { useState, useEffect } from 'react';
import { User, PracticeConfig, TestSession } from './types';
import { storageService } from './services/storageService';
import { dataService } from './services/dataService';
import { Header } from './components/layout/Header';
import { WelcomePage } from './components/pages/WelcomePage';
import { SubjectHubPage } from './components/pages/LandingPage';
import { TestShell } from './components/test/TestShell';
import { ResultsPage } from './components/results/ResultsPage';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'welcome' | 'hub' | 'test' | 'results'>('welcome');
  const [activeConfig, setActiveConfig] = useState<PracticeConfig | null>(null);
  const [completedSession, setCompletedSession] = useState<TestSession | null>(null);

  useEffect(() => {
    setCurrentUser(storageService.getCurrentUser());
  }, []);

  const handleSelectProgram = async (programId: string) => {
    await dataService.setProgram(programId);
    setCurrentView('hub');
  };

  const handleEnterMvpMath = async () => {
    await dataService.setProgram('bxm');
    setCurrentView('hub');
  };

  const handleStartSimulation = () => {
    const config: PracticeConfig = {
      mode: 'simulation',
      itemCount: 60,
      enableTimer: true,
      timerDurationMinutes: 150,
      programId: dataService.getCurrentProgramId(),
      convocatoriaId: dataService.getCurrentConvocatoriaId() || '2026-c2',
    };
    setActiveConfig(config);
    setCurrentView('test');
  };

  const handleStartPractice = (config: PracticeConfig) => {
    setActiveConfig(config);
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

  const handleStartPracticeByItems = (itemIds: number[], title: string) => {
    const config: PracticeConfig = {
      mode: 'topic',
      topic: title,
      itemCount: itemIds.length,
      enableTimer: false,
      timerDurationMinutes: 60,
      programId: dataService.getCurrentProgramId(),
      convocatoriaId: dataService.getCurrentConvocatoriaId() || '2026-c2',
    };
    setActiveConfig(config);
    setCurrentView('test');
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-slate-950 text-stone-900 dark:text-slate-100 font-sans flex flex-col transition-colors">
      <Header
        currentUser={currentUser}
        onUserChanged={setCurrentUser}
        onNavigateHome={() => setCurrentView('welcome')}
        currentView={currentView}
        onProgramChange={(_progId) => {
          // If on welcome, let user remain or switch to hub
          if (currentView !== 'welcome' && currentView !== 'test') {
            setCurrentView('hub');
          }
        }}
      />

      <main className="flex-1">
        {currentView === 'welcome' && (
          <WelcomePage
            onSelectProgram={handleSelectProgram}
            onEnterMvpMath={handleEnterMvpMath}
          />
        )}

        {currentView === 'hub' && (
          <SubjectHubPage
            currentUser={currentUser}
            onNavigateHome={() => setCurrentView('welcome')}
            onStartSimulation={handleStartSimulation}
            onStartPractice={handleStartPractice}
            onStartPracticeByItems={handleStartPracticeByItems}
            onSwitchToBxm={handleEnterMvpMath}
          />
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
