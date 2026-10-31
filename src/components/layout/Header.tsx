import React, { useState, useEffect } from 'react';
import { User, ProgramInfo } from '../../types';
import { storageService } from '../../services/storageService';
import { dataService } from '../../services/dataService';
import { AuthModal } from '../auth/AuthModal';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  BookOpen,
  User as UserIcon,
  LogOut,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onUserChanged: (user: User | null) => void;
  onNavigateHome: () => void;
  currentView?: 'landing' | 'welcome' | 'hub' | 'test' | 'results' | 'resources';
  onProgramChange?: (programId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onUserChanged,
  onNavigateHome,
  currentView = 'landing',
  onProgramChange,
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [programs, setPrograms] = useState<ProgramInfo[]>(dataService.getPrograms());
  const [currentProgramId, setCurrentProgramId] = useState<string>(dataService.getCurrentProgramId());
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);

  useEffect(() => {
    setPrograms(dataService.getPrograms());
    setCurrentProgramId(dataService.getCurrentProgramId());
    const unsubscribe = dataService.subscribe(() => {
      setCurrentProgramId(dataService.getCurrentProgramId());
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    onUserChanged(null);
  };

  const handleSelectProgram = async (programId: string) => {
    await dataService.setProgram(programId);
    setCurrentProgramId(programId);
    setIsProgramDropdownOpen(false);
    if (onProgramChange) {
      onProgramChange(programId);
    }
  };

  const isTestView = currentView === 'test';
  // Only display program switcher on hub/dashboard views, not on initial entry landing or welcome pages
  const showProgramSwitcher = currentView === 'hub' || currentView === 'resources';
  const currentProgram = programs.find((p) => p.id === currentProgramId);

  return (
    <>
      <header
        className={`bg-stone-900 dark:bg-slate-900 text-stone-100 border-b-2 border-stone-800 dark:border-slate-800 sticky top-0 z-40 shadow-xs ${
          isTestView ? 'hidden sm:block' : ''
        }`}
      >
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          {/* Brand & Prototype Name */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg p-1 min-h-[44px] cursor-pointer"
              title="Ir al inicio"
            >
              <div className="p-2 sm:p-2.5 bg-indigo-600 text-white rounded-xl group-hover:bg-indigo-500 transition font-black shrink-0 shadow-xs">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm sm:text-base tracking-wider uppercase">MEP-EA-01</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60 hidden xs:inline-block">
                    PROTOTIPO
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium truncate">
                  Educación Abierta Costa Rica
                </p>
              </div>
            </button>

            {/* Macro Curriculum Track Switcher - Only shown on specific views (hub/resources) */}
            {showProgramSwitcher && (
              <div className="relative">
                <button
                  onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800/90 hover:bg-stone-800 text-stone-100 border border-stone-700 rounded-xl text-xs font-bold transition focus:ring-2 focus:ring-indigo-400 cursor-pointer min-h-[38px]"
                  title="Cambiar programa oficial MEP"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[110px] sm:max-w-[150px]">
                    {currentProgram?.name || 'BXM'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                </button>

                {isProgramDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-stone-900 border-2 border-stone-800 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 tracking-wider border-b border-stone-200 dark:border-stone-800">
                      Seleccionar Programa MEP
                    </div>
                    {programs.map((prog) => {
                      const isSelected = prog.id === currentProgramId;
                      return (
                        <button
                          key={prog.id}
                          onClick={() => handleSelectProgram(prog.id)}
                          className={`w-full text-left px-3.5 py-2.5 text-xs transition flex flex-col gap-0.5 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold">{prog.name}</span>
                            {!prog.calculatorAllowed && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                Sin Calc
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] leading-tight ${
                              isSelected ? 'text-indigo-100' : 'text-stone-600 dark:text-stone-300'
                            }`}
                          >
                            {prog.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Controls: Public vs Private Header */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />

            {currentUser ? (
              /* Private Header: Logged in state */
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
              /* Public Header: Guest state */
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
