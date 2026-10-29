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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-1"
          >
            <div className="p-2.5 bg-white text-zinc-950 rounded-xl group-hover:bg-zinc-200 transition font-black">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wide uppercase">MEP‑EA‑01</h1>
              <p className="text-[11px] text-zinc-400 font-medium">Simulador BXM Matemáticas (02-2026)</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-100">
                  <UserIcon className="w-4 h-4 text-zinc-300" />
                  <span>{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="p-1.5 text-zinc-400 hover:text-white transition rounded-lg hover:bg-zinc-800"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-white text-zinc-950 font-bold text-xs rounded-xl hover:bg-zinc-200 transition shadow-xs focus:ring-2 focus:ring-white"
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
