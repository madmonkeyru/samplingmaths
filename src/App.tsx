import { useState, useEffect } from 'react';
import { User, PracticeConfig, TestSession } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/layout/Header';
import { LandingPage } from './components/pages/LandingPage';
import { TestShell } from './components/test/TestShell';
import { ResultsPage } from './components/results/ResultsPage';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'test' | 'results'>('landing');
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
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      <Header
        currentUser={currentUser}
        onUserChanged={setCurrentUser}
        onNavigateHome={() => setCurrentView('landing')}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            currentUser={currentUser}
            onStartSimulation={handleStartSimulation}
            onStartPractice={handleStartPractice}
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
            onGoHome={() => setCurrentView('landing')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
