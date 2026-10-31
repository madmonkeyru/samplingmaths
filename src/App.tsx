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

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Views: 'landing' (entry flow validation), 'welcome' (program selection portal), 'hub' (subject hub), 'test' (simulation/practice), 'results' (results screen)
  const [currentView, setCurrentView] = useState<'landing' | 'welcome' | 'hub' | 'test' | 'results'>('landing');
  const [activeConfig, setActiveConfig] = useState<PracticeConfig | null>(null);
  const [completedSession, setCompletedSession] = useState<TestSession | null>(null);

  useEffect(() => {
    setCurrentUser(storageService.getCurrentUser());
  }, []);

  const handleStartSimulation = () => {
    const config: PracticeConfig = {
      mode: 'simulation',
      itemCount: 60,
      enableTimer: true,
      timerDurationMinutes: 150,
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

  const handleSelectProgramFromPortal = async (programId: string) => {
    await dataService.setProgram(programId);
    setCurrentView('hub');
  };

  const handleEnterBxmHubDirectly = async () => {
    await dataService.setProgram('bxm');
    setCurrentView('hub');
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">
      <Header
        currentUser={currentUser}
        onUserChanged={setCurrentUser}
        onNavigateHome={() => setCurrentView('landing')}
        currentView={currentView}
        onProgramChange={() => {
          if (currentView !== 'hub') {
            setCurrentView('hub');
          }
        }}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <EntryLandingPage
            onExplorePrograms={() => setCurrentView('welcome')}
            onEnterBxmHub={handleEnterBxmHubDirectly}
          />
        )}

        {currentView === 'welcome' && (
          <WelcomePage
            onSelectProgram={handleSelectProgramFromPortal}
            onEnterMvpMath={handleEnterBxmHubDirectly}
          />
        )}

        {currentView === 'hub' && (
          <SubjectHubPage
            currentUser={currentUser}
            onStartSimulation={handleStartSimulation}
            onStartPractice={handleStartPractice}
            onNavigateHome={() => setCurrentView('welcome')}
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
