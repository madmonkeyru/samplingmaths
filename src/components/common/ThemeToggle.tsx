import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showDropdown?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showDropdown = false }) => {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();

  if (!showDropdown) {
    return (
      <button
        onClick={toggleTheme}
        title={`Cambiar a modo ${effectiveTheme === 'dark' ? 'claro' : 'oscuro'}`}
        aria-label={`Cambiar a modo ${effectiveTheme === 'dark' ? 'claro' : 'oscuro'}`}
        className={`p-2 rounded-xl border-2 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
          effectiveTheme === 'dark'
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:border-indigo-500'
            : 'bg-stone-100 text-stone-900 border-stone-800 hover:bg-amber-50/50 hover:border-indigo-600'
        } ${className}`}
      >
        {effectiveTheme === 'dark' ? (
          <Sun className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <Moon className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-slate-800/80 rounded-xl border-2 border-stone-800 dark:border-slate-700 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        title="Modo Claro"
        aria-label="Modo Claro"
        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[36px] cursor-pointer ${
          theme === 'light'
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        title="Modo Oscuro"
        aria-label="Modo Oscuro"
        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[36px] cursor-pointer ${
          theme === 'dark'
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        title="Modo Sistema"
        aria-label="Modo Sistema"
        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[36px] cursor-pointer ${
          theme === 'system'
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
