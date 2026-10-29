import React, { useState } from 'react';
import { User } from '../../types';
import { storageService } from '../../services/storageService';
import { AuthModal } from '../auth/AuthModal';
import { BookOpen, User as UserIcon, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onUserChanged: (user: User | null) => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onUserChanged, onNavigateHome }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    onUserChanged(null);
  };

  return (
    <>
      <header className="bg-zinc-950 text-white border-b-2 border-zinc-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-1 min-h-[44px]"
          >
            <div className="p-2 sm:p-2.5 bg-white text-zinc-950 rounded-xl group-hover:bg-zinc-200 transition font-black shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm sm:text-base tracking-wide uppercase truncate">MEP‑EA‑01</h1>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">Simulador BXM (02-2026)</p>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-zinc-900 px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-zinc-800 min-h-[44px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-100 max-w-[110px] sm:max-w-[160px] truncate">
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-300 shrink-0" />
                  <span className="truncate">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                  className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-zinc-800 min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-3.5 sm:px-4 py-2 bg-white text-zinc-950 font-bold text-xs rounded-xl hover:bg-zinc-200 transition shadow-xs focus:ring-2 focus:ring-white min-h-[44px] flex items-center justify-center"
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
