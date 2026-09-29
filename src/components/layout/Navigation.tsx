import React from 'react';
import { Calculator, BarChart3, Scale } from 'lucide-react';

export type TabType = 'dca' | 'etfs' | 'legislation';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dca' as TabType, label: 'Simulateur DCA', icon: Calculator },
    { id: 'etfs' as TabType, label: 'Comparateur ETF', icon: BarChart3 },
    { id: 'legislation' as TabType, label: 'Réglementation & Fiscalité', icon: Scale },
  ];

  return (
    <div className="flex border-b border-claude-border dark:border-claude-darkBorder mb-8 overflow-x-auto no-scrollbar">
      <div className="flex space-x-1 p-1 bg-claude-hover/60 dark:bg-claude-darkHover/60 rounded-xl border border-claude-border dark:border-claude-darkBorder">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`claude-btn flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-claude-card dark:bg-claude-darkCard text-claude-text dark:text-claude-darkText shadow-sm border border-claude-border/80 dark:border-claude-darkBorder'
                  : 'text-claude-muted dark:text-claude-darkMuted hover:text-claude-text dark:hover:text-claude-darkText'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-claude-accent' : ''}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
