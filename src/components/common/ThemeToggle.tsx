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
            ? 'bg-zinc-800 text-yellow-400 border-zinc-700 hover:bg-zinc-700'
            : 'bg-zinc-100 text-zinc-900 border-zinc-900 hover:bg-zinc-200'
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
    <div className={`flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        title="Modo Claro"
        aria-label="Modo Claro"
        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[36px] ${
          theme === 'light'
            ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        title="Modo Oscuro"
        aria-label="Modo Oscuro"
        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[36px] ${
          theme === 'dark'
            ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        title="Modo Sistema"
        aria-label="Modo Sistema"
        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 min-h-[36px] ${
          theme === 'system'
            ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
