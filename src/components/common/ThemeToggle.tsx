import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { effectiveTheme, toggleTheme } = useTheme();

  const isDark = effectiveTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      className={`relative p-2.5 rounded-xl border-2 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
        isDark
          ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:border-amber-400 hover:text-amber-200'
          : 'bg-stone-100 text-stone-900 border-stone-800 hover:bg-amber-100/70 hover:border-indigo-600 hover:text-indigo-700'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 stroke-[2.5] transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 stroke-[2.5] transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};
