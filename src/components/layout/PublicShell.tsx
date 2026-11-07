import React, { useState } from 'react';
import { UserRound, Menu } from 'lucide-react';
import { useLearner } from '../../context/LearnerContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Dialog } from '../common/Dialog';
import { AuthModal } from '../auth/AuthModal';
import { PaywallModal } from '../common/PaywallModal';
import { CustomSelect } from '../common/CustomSelect';
import { programManifest } from '../../services/programCatalog';
import { useTheme, type Theme } from '../../context/ThemeContext';
import type { AppRoute } from '../../services/navigation';

export interface PublicShellProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onProgramChange?: (programId: string) => void;
  children: React.ReactNode;
}

export const PublicShell: React.FC<PublicShellProps> = ({ currentRoute, onNavigate, onProgramChange, children }) => {
  const { learner, selectProfile } = useLearner();
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const showProgramSelect = ['framework', 'hub', 'learning', 'resources', 'results'].includes(currentRoute.view);
  const programOptions = programManifest.programs.map((p) => ({ value: p.id, label: p.name }));
  const currentProgramId = currentRoute.programId || programManifest.default_program;

  const publicNavLinks = [
    { label: 'Inicio', href: '#/', active: currentRoute.view === 'landing', onClick: () => onNavigate({ view: 'landing' }) },
    { label: 'Programas', href: '#/programas', active: currentRoute.view === 'welcome', onClick: () => onNavigate({ view: 'welcome' }) },
    { label: 'Calendario', href: '#/calendario', active: currentRoute.view === 'calendar', onClick: () => onNavigate({ view: 'calendar' }) },
    { label: 'Guía y recursos', href: '#/ayuda', active: currentRoute.view === 'helper', onClick: () => onNavigate({ view: 'helper' }) },
    { label: 'Acerca de / FAQ', href: '#/acerca', active: currentRoute.view === 'about', onClick: () => onNavigate({ view: 'about' }) },
  ];

  return (
    <div className="public-shell min-h-screen flex flex-col">
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
              <span className="truncate">Portal Oficial y Recursos</span>
            </div>
          </a>

          <nav aria-label="Navegación pública" className="app-primary-nav items-center gap-1">
            {publicNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.active ? 'page' : undefined}
                className="header-link"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            <button
              className="header-link account-trigger flex items-center gap-1.5"
              aria-label={learner ? `Perfil: ${learner.name}` : 'Perfil'}
              aria-haspopup="dialog"
              onClick={() => setAccountOpen(true)}
            >
              <UserRound size={18} aria-hidden="true" />
              <span className="hidden sm:inline truncate max-w-28">{learner?.name || 'Perfil'}</span>
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
        <Dialog title="Menú de exploración" onClose={() => setSidebarOpen(false)}>
          <nav className="mobile-nav" aria-label="Enlaces de navegación pública">
            {publicNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="header-link block py-2"
                onClick={(e) => {
                  e.preventDefault();
                  link.onClick();
                  setSidebarOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            className="secondary-button mt-4"
            onClick={() => {
              setSidebarOpen(false);
              setAccountOpen(true);
            }}
          >
            {learner ? `Perfil: ${learner.name}` : 'Perfil'}
          </button>
        </Dialog>
      )}

      {accountOpen && (
        <Dialog title="Perfil y preferencias" onClose={() => setAccountOpen(false)}>
          <div className="account-summary flex items-center gap-3 p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
            <UserRound size={28} aria-hidden="true" />
            <div>
              <h3 className="font-semibold">{learner?.name || 'Tu perfil todavía no está configurado'}</h3>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                {learner
                  ? 'Tu preparación en este dispositivo.'
                  : 'Puedes estudiar como invitado o crear un perfil.'}
              </p>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {showProgramSelect && (
              <CustomSelect
                title="Cambiar programa de estudio"
                aria-label="Programa"
                label="Programa"
                value={currentProgramId}
                options={programOptions}
                onChange={(id) => {
                  onProgramChange?.(id);
                  setAccountOpen(false);
                }}
              />
            )}
            <label className="block text-sm font-medium">
              Tema
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
                {learner ? 'Cambiar perfil' : 'Crear perfil'}
              </button>
              <button
                className="text-link"
                onClick={() => {
                  setAccountOpen(false);
                  setPaywallOpen(true);
                }}
              >
                Ver planes
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
                Usar modo invitado
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
