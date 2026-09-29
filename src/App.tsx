import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import type { TabType } from './components/layout/Navigation';
import { DcaSimulator } from './components/dca/DcaSimulator';
import { EtfComparator } from './components/etf/EtfComparator';
import { LegalGuide } from './components/legislation/LegalGuide';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dca');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-claude-bg dark:bg-claude-darkBg transition-colors duration-200">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'dca' && <DcaSimulator />}
        {activeTab === 'etfs' && <EtfComparator />}
        {activeTab === 'legislation' && <LegalGuide />}
      </main>

      <footer className="border-t border-claude-border dark:border-claude-darkBorder py-6 mt-12 text-xs text-claude-muted dark:text-claude-darkMuted">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            Outil d'information financière indépendant. Les calculs fiscaux et projections ne constituent pas un conseil en investissement.
          </p>
          <p className="font-mono text-[11px] text-claude-muted">
            Sources: CMF Art. L. 221-30, CGI Art. 150-0 A, Décret n° 2020-89
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
