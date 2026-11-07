import React, { useState } from 'react';
import { UserRound, Menu, BookOpen, PenTool, Award, BarChart2, Home } from 'lucide-react';
import { useLearner } from '../../context/LearnerContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Dialog } from '../common/Dialog';
import { AuthModal } from '../auth/AuthModal';
import { PaywallModal } from '../common/PaywallModal';
import { useTheme, type Theme } from '../../context/ThemeContext';
import type { AppRoute } from '../../services/navigation';

export interface LearnerShellProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  children: React.ReactNode;
}

export const LearnerShell: React.FC<LearnerShellProps> = ({ currentRoute, onNavigate, children }) => {
  const { learner, selectProfile } = useLearner();
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // 4 Core Academic Pillars + Mi progreso as defined in Frontend Architecture Analysis
  const learnerPillars = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: Home,
      active: currentRoute.tab === 'inicio' || currentRoute.tab === 'diagnostic' || (!currentRoute.tab && currentRoute.view === 'learning'),
      onClick: () =>
        onNavigate({
          ...currentRoute,
          view: 'learning',
          tab: 'inicio',
          evidenceKey: undefined,
          sessionId: undefined,
        }),
    },
    {
      id: 'aprender',
      label: 'Aprender',
      icon: BookOpen,
      active: currentRoute.tab === 'temario',
      onClick: () =>
        onNavigate({
          ...currentRoute,
          view: 'learning',
          tab: 'temario',
          evidenceKey: undefined,
          sessionId: undefined,
        }),
    },
    {
      id: 'practicar',
      label: 'Practicar',
      icon: PenTool,
      active: currentRoute.tab === 'practice',
      onClick: () =>
        onNavigate({
          ...currentRoute,
          view: 'learning',
          tab: 'practice',
          evidenceKey: undefined,
          sessionId: undefined,
        }),
    },
    {
      id: 'simular',
      label: 'Simular',
      icon: Award,
      active: currentRoute.tab === 'simulation',
      onClick: () =>
        onNavigate({
          ...currentRoute,
          view: 'learning',
          tab: 'simulation',
          evidenceKey: undefined,
          sessionId: undefined,
        }),
    },
    {
      id: 'progreso',
      label: 'Mi progreso',
      icon: BarChart2,
      active: currentRoute.tab === 'progress',
      onClick: () =>
        onNavigate({
          ...currentRoute,
          view: 'learning',
          tab: 'progress',
          evidenceKey: undefined,
          sessionId: undefined,
        }),
    },
  ];

  return (
    <div className="learner-shell min-h-screen flex flex-col">
      <header className="ui-header app-header">
        <div className="page-width flex items-center justify-between gap-3 py-2">
          <a
            href="#/"
            className="brand-link min-w-0"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                onNavigate({ view: 'landing' });
              }
            }}
          >
            <img className="brand-logo" src="/logo_yiguirro_cr_high_fidelity.svg" alt="Yigüirro de Costa Rica" />
            <div className="min-w-0">
              <strong className="text-sm">MEP-EA-01</strong>
              <span className="truncate">Espacio de Estudio · Matemáticas BXM</span>
            </div>
          </a>

          <nav aria-label="Pilares de aprendizaje" className="app-primary-nav items-center gap-1">
            {learnerPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <button
                  key={pillar.id}
                  onClick={pillar.onClick}
                  aria-current={pillar.active ? 'page' : undefined}
                  className="header-link"
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{pillar.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            <button
              className="header-link account-trigger"
              aria-label={learner ? `Espacio de ${learner.name}` : 'Mi espacio'}
              aria-haspopup="dialog"
              onClick={() => setAccountOpen(true)}
            >
              <UserRound size={18} aria-hidden="true" />
              <span className="hidden sm:inline truncate max-w-28">{learner ? learner.name : 'Mi espacio'}</span>
            </button>

            <button
              className="header-link mobile-menu-trigger"
              aria-label="Abrir menú"
              aria-haspopup="dialog"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">{children}</div>

      {sidebarOpen && (
        <Dialog title="Navegación de estudio" onClose={() => setSidebarOpen(false)}>
          <nav className="mobile-nav space-y-1" aria-label="Pilares de estudio">
            {learnerPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <button
                  key={pillar.id}
                  onClick={() => {
                    pillar.onClick();
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-md text-left font-medium ${
                    pillar.active ? 'bg-amber-100 dark:bg-amber-950 text-amber-900' : ''
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{pillar.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-stone-200 dark:border-stone-800 pt-3 mt-4">
            <button
              className="secondary-button w-full"
              onClick={() => {
                setSidebarOpen(false);
                setAccountOpen(true);
              }}
            >
              {learner ? `Perfil: ${learner.name}` : 'Gestionar mi espacio'}
            </button>
          </div>
        </Dialog>
      )}

      {accountOpen && (
        <Dialog title="Mi espacio de estudio" onClose={() => setAccountOpen(false)}>
          <div className="account-summary flex items-center gap-3 p-3 bg-amber-50 dark:bg-stone-800 rounded-lg border border-amber-200 dark:border-stone-700">
            <UserRound size={28} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <div>
              <h3 className="font-semibold">{learner?.name || 'Modo invitado (sin perfil)'}</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {learner
                  ? 'Tus diagnósticos, simulacros y lecciones están vinculados a este perfil local.'
                  : 'Tus intentos actuales se guardan temporalmente en este navegador.'}
              </p>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <label className="block text-sm font-medium">
              Tema de visualización
              <select
                className="mt-1 block w-full p-2 border rounded-md dark:bg-stone-800"
                aria-label="Tema"
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
              >
                <option value="system">Sistema</option>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </label>
            <div className="action-row flex gap-2">
              <button
                className="primary-button"
                onClick={() => {
                  setAccountOpen(false);
                  setAuthOpen(true);
                }}
              >
                {learner ? 'Cambiar perfil' : 'Guardar perfil de estudio'}
              </button>
              <button
                className="text-link"
                onClick={() => {
                  setAccountOpen(false);
                  setPaywallOpen(true);
                }}
              >
                Ver planes Pro
              </button>
            </div>
            {learner && (
              <button
                className="text-link text-red-600 dark:text-red-400 text-sm mt-2"
                onClick={() => {
                  selectProfile(null);
                  setAccountOpen(false);
                }}
              >
                Cerrar sesión de perfil (modo invitado)
              </button>
            )}
          </div>
        </Dialog>
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onUserChanged={(u) => selectProfile(u)}
      />
      <PaywallModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
};
