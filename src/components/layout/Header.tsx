import React, { useState } from 'react';
import { User } from '../../types';
import { storageService } from '../../services/storageService';
import { AuthModal } from '../auth/AuthModal';
import { ThemeToggle } from '../common/ThemeToggle';
import { BookOpen, User as UserIcon, LogOut, Library } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onUserChanged: (user: User | null) => void;
  onNavigateHome: () => void;
  onNavigateResources?: () => void;
  currentView?: 'landing' | 'test' | 'results' | 'resources';
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onUserChanged,
  onNavigateHome,
  onNavigateResources,
  currentView,
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    onUserChanged(null);
  };

  const isTestView = currentView === 'test';

  return (
    <>
      <header
        className={`bg-stone-900 dark:bg-slate-900 text-stone-100 border-b-2 border-stone-800 dark:border-slate-800 sticky top-0 z-40 shadow-xs ${
          isTestView ? 'hidden sm:block' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg p-1 min-h-[44px] cursor-pointer"
          >
            <div className="p-2 sm:p-2.5 bg-indigo-600 text-white rounded-xl group-hover:bg-indigo-500 transition font-black shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm sm:text-base tracking-wide uppercase truncate">MEP‑EA‑01</h1>
              <p className="text-[10px] sm:text-[11px] text-amber-200/80 font-medium truncate">Simulador BXM (02-2026)</p>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateResources && !isTestView && (
              <button
                onClick={onNavigateResources}
                className={`px-3 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition border-2 border-stone-700 dark:border-slate-700 min-h-[44px] cursor-pointer ${
                  currentView === 'resources'
                    ? 'bg-amber-100 text-stone-950 font-black border-amber-300'
                    : 'bg-stone-800/90 text-stone-200 hover:bg-stone-800 hover:text-white hover:border-indigo-500'
                }`}
                title="Tabla de Especificaciones, Diccionario y Fórmulas"
              >
                <Library className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden md:inline">Especificaciones & Recursos</span>
              </button>
            )}

            <ThemeToggle showDropdown />

            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-stone-800 dark:bg-slate-800 px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-stone-700 dark:border-slate-700 min-h-[44px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-100 max-w-[110px] sm:max-w-[160px] truncate">
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 shrink-0" />
                  <span className="truncate">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                  className="p-2 text-stone-400 hover:text-white transition rounded-lg hover:bg-stone-700 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-3.5 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-xs focus:ring-2 focus:ring-indigo-400 min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUserChanged={onUserChanged}
      />
    </>
  );
};
