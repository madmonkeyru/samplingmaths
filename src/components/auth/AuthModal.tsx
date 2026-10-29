import React, { useState } from 'react';
import { User } from '../../types';
import { storageService } from '../../services/storageService';
import { X, UserCheck, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChanged: (user: User | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onUserChanged }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const user: User = {
      id: `u-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
    };

    storageService.setCurrentUser(user);
    onUserChanged(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-3.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border-2 border-zinc-900 shadow-2xl max-w-md w-full p-5 sm:p-6 relative my-auto">
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 text-zinc-900 hover:bg-zinc-100 p-2 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b-2 border-zinc-900 pb-3">
          <div className="p-2.5 bg-zinc-950 text-white rounded-xl border-2 border-zinc-900">
            {isRegister ? <UserCheck className="w-5 h-5 stroke-[2.5]" /> : <LogIn className="w-5 h-5 stroke-[2.5]" />}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-zinc-900 uppercase">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-black text-zinc-900 mb-1.5 uppercase">Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-3.5 py-2.5 border-2 border-zinc-900 rounded-xl text-xs font-bold bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 min-h-[44px]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-zinc-900 mb-1.5 uppercase">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="estudiante@mep.cr"
              className="w-full px-3.5 py-2.5 border-2 border-zinc-900 rounded-xl text-xs font-bold bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-zinc-900 mb-1.5 uppercase">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border-2 border-zinc-900 rounded-xl text-xs font-bold bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 min-h-[44px]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold rounded-xl text-xs border-2 border-zinc-950 shadow-xs transition min-h-[44px] flex items-center justify-center mt-2"
          >
            {isRegister ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-zinc-700 font-bold">
          {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta aún?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-zinc-950 font-black underline hover:text-zinc-700 transition py-1"
          >
            {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};
