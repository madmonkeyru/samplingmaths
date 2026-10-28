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
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:bg-blue-500 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-tight">MEP‑EA‑01</h1>
              <p className="text-xs text-slate-400">Simulador de Matemáticas BXM (02-2026)</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span>{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="text-slate-400 hover:text-red-400 transition ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-xs"
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
