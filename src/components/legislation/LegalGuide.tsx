import React, { useState } from 'react';
import { PEA_LEGISLATION } from '../../data/legislation';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const LegalGuide: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {PEA_LEGISLATION.map((item, idx) => {
          const isOpen = expandedIndex === idx;
          return (
            <div
              key={item.title}
              className="claude-card bg-claude-card dark:bg-claude-darkCard border border-claude-border dark:border-claude-darkBorder overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-claude-hover/40 dark:hover:bg-claude-darkHover/40 transition-colors"
              >
                <div>
                  <span className="text-[11px] font-mono text-claude-muted block">
                    {item.reference}
                  </span>
                  <h3 className="font-semibold text-sm text-claude-text dark:text-claude-darkText mt-0.5">
                    {item.title}
                  </h3>
                </div>
                <div className="claude-btn p-1 text-claude-muted">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-claude-border/50 dark:border-claude-darkBorder/50 space-y-3 text-xs leading-relaxed">
                  <div>
                    <strong className="text-claude-text dark:text-claude-darkText block mb-1">Règle légale :</strong>
                    <p className="text-claude-muted dark:text-claude-darkMuted">{item.summary}</p>
                  </div>

                  <div>
                    <strong className="text-claude-text dark:text-claude-darkText block mb-1">Application pratique :</strong>
                    <p className="text-claude-muted dark:text-claude-darkMuted">{item.impactPratique}</p>
                  </div>

                  {item.specialCases && item.specialCases.length > 0 && (
                    <div className="pt-1">
                      <strong className="text-claude-text dark:text-claude-darkText block mb-1">
                        Exceptions et cas particuliers :
                      </strong>
                      <ul className="space-y-1 pl-4 list-disc text-claude-muted dark:text-claude-darkMuted">
                        {item.specialCases.map((cas, i) => (
                          <li key={i}>{cas}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
