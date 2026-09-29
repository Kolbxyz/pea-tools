import React from 'react';
import { Moon, Sun, TrendingUp } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="border-b border-claude-border dark:border-claude-darkBorder bg-claude-card dark:bg-claude-darkCard sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-claude-accent/10 dark:bg-claude-accent/20 text-claude-accent flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg tracking-tight text-claude-text dark:text-claude-darkText">
                PEA Hub
              </span>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-claude-hover dark:bg-claude-darkHover text-claude-muted dark:text-claude-darkMuted border border-claude-border dark:border-claude-darkBorder">
                Données Réelles
              </span>
            </div>
            <p className="text-xs text-claude-muted dark:text-claude-darkMuted hidden sm:block">
              Simulateur DCA, Répertoire ETF &amp; Droit fiscal français
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className="claude-btn p-2 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-claude-muted dark:text-claude-darkMuted hover:text-claude-text dark:hover:text-claude-darkText hover:bg-claude-hover dark:hover:bg-claude-darkHover flex items-center justify-center"
            title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            aria-label="Basculer le mode sombre"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
