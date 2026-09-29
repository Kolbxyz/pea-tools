import React, { useState } from 'react';
import { PEA_LEGISLATION } from '../../data/legislation';
import { Scale, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const LegalGuide: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-claude-card dark:bg-claude-darkCard p-5 rounded-xl border border-claude-border dark:border-claude-darkBorder">
        <h2 className="text-base font-semibold text-claude-text dark:text-claude-darkText mb-1 flex items-center gap-2">
          <Scale className="w-5 h-5 text-claude-accent" />
          Réglementation &amp; Cas Particuliers Réels du PEA
        </h2>
        <p className="text-xs text-claude-muted dark:text-claude-darkMuted leading-relaxed">
          Le Plan d'Épargne en Actions (PEA) est régi par le <strong>Code monétaire et financier (Art. L. 221-30 et suivants)</strong>, 
          le <strong>Code général des impôts (Art. 150-0 A)</strong> et réformé en profondeur par la <strong>Loi Pacte (2019)</strong>.
          Voici la synthèse exacte de vos droits, plafonds et cas particuliers d'exonération.
        </p>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-claude-border/50 dark:border-claude-darkBorder/50 text-xs">
          <div className="p-3 rounded-lg bg-claude-bg dark:bg-claude-darkBg border border-claude-border/60 dark:border-claude-darkBorder/60">
            <div className="font-semibold text-claude-text dark:text-claude-darkText">Règle des 5 Ans</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">0 % d'impôt sur le revenu</div>
            <p className="text-[11px] text-claude-muted mt-1">Seuls les prélèvements sociaux (17,2 %) s'appliquent sur les plus-values retirées.</p>
          </div>

          <div className="p-3 rounded-lg bg-claude-bg dark:bg-claude-darkBg border border-claude-border/60 dark:border-claude-darkBorder/60">
            <div className="font-semibold text-claude-text dark:text-claude-darkText">Plafonnement Loi Pacte</div>
            <div className="text-claude-accent font-medium mt-0.5">Max 0,50 % par ordre</div>
            <p className="text-[11px] text-claude-muted mt-1">Interdiction légale pour les courtiers de facturer plus de 0,50 % en ligne.</p>
          </div>

          <div className="p-3 rounded-lg bg-claude-bg dark:bg-claude-darkBg border border-claude-border/60 dark:border-claude-darkBorder/60">
            <div className="font-semibold text-claude-text dark:text-claude-darkText">Plafonds de Versement</div>
            <div className="text-claude-text dark:text-claude-darkText font-medium mt-0.5">150 000 € (ou 20 000 €)</div>
            <p className="text-[11px] text-claude-muted mt-1">Ne concerne que les dépôts. Les plus-values peuvent croître sans aucune limite.</p>
          </div>
        </div>
      </div>

      {/* Detailed Articles Accordion */}
      <div className="space-y-3">
        {PEA_LEGISLATION.map((item, idx) => {
          const isOpen = expandedIndex === idx;
          return (
            <div
              key={item.title}
              className="claude-card bg-claude-card dark:bg-claude-darkCard border-claude-border dark:border-claude-darkBorder overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between hover:bg-claude-hover/40 dark:hover:bg-claude-darkHover/40 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-claude-bg dark:bg-claude-darkBg border border-claude-border dark:border-claude-darkBorder text-claude-muted">
                      {item.reference}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-claude-text dark:text-claude-darkText mt-1">
                    {item.title}
                  </h3>
                </div>
                <div className="claude-btn p-1 text-claude-muted">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-claude-border/50 dark:border-claude-darkBorder/50 space-y-3 text-xs leading-relaxed">
                  <div className="p-3 rounded-lg bg-claude-bg/60 dark:bg-claude-darkBg/60 border border-claude-border/40">
                    <strong className="text-claude-text dark:text-claude-darkText block mb-1">Résumé légal :</strong>
                    <p className="text-claude-muted dark:text-claude-darkMuted">{item.summary}</p>
                  </div>

                  <div>
                    <strong className="text-claude-text dark:text-claude-darkText block mb-1">Impact pratique pour l'investisseur :</strong>
                    <p className="text-claude-muted dark:text-claude-darkMuted">{item.impactPratique}</p>
                  </div>

                  {item.specialCases && item.specialCases.length > 0 && (
                    <div className="pt-2">
                      <strong className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-2 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Cas particuliers réels &amp; exceptions légales :
                      </strong>
                      <ul className="space-y-1.5 pl-4 list-disc text-claude-muted dark:text-claude-darkMuted">
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
