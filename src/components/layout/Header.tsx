import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="border-b border-claude-border dark:border-claude-darkBorder bg-claude-card dark:bg-claude-darkCard sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="font-semibold text-base tracking-tight text-claude-text dark:text-claude-darkText">
          PEA Hub
        </span>

        <button
          onClick={toggleDarkMode}
          className="claude-btn p-1.5 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-claude-muted dark:text-claude-darkMuted hover:text-claude-text dark:hover:text-claude-darkText flex items-center justify-center"
          aria-label="Thème clair / sombre"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
        </button>
      </div>
    </header>
  );
};
