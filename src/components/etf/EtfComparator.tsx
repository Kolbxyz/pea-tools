import React, { useState, useMemo } from 'react';
import { PEA_ETFS } from '../../data/etfs';
import { Search, Copy, Check } from 'lucide-react';
import { formatExactCurrency } from '../../utils/formatters';

export const EtfComparator: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('Tous');
  const [copiedIsin, setCopiedIsin] = useState<string | null>(null);
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);

  const categories = ['Tous', 'Monde', 'S&P 500 / USA', 'Europe', 'Émergents'];
  const issuers = ['Tous', 'BlackRock (iShares)', 'Amundi', 'BNP Paribas Easy'];

  const filteredEtfs = useMemo(() => {
    return PEA_ETFS.filter((etf) => {
      const matchSearch =
        etf.ticker.toLowerCase().includes(search.toLowerCase()) ||
        etf.name.toLowerCase().includes(search.toLowerCase()) ||
        etf.isin.toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === 'Tous' || etf.category === selectedCategory;
      const matchIssuer = selectedIssuer === 'Tous' || etf.issuer === selectedIssuer;

      return matchSearch && matchCategory && matchIssuer;
    });
  }, [search, selectedCategory, selectedIssuer]);

  const copyToClipboard = (isin: string) => {
    navigator.clipboard.writeText(isin);
    setCopiedIsin(isin);
    setTimeout(() => setCopiedIsin(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-claude-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par ticker, nom, ISIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-xs text-claude-text dark:text-claude-darkText placeholder-claude-muted focus:outline-none focus:ring-1 focus:ring-claude-accent"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-xs text-claude-text dark:text-claude-darkText focus:outline-none focus:ring-1 focus:ring-claude-accent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'Tous' ? 'Tous les indices' : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedIssuer}
              onChange={(e) => setSelectedIssuer(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-xs text-claude-text dark:text-claude-darkText focus:outline-none focus:ring-1 focus:ring-claude-accent"
            >
              {issuers.map((iss) => (
                <option key={iss} value={iss}>
                  {iss === 'Tous' ? 'Tous les émetteurs' : iss}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEtfs.map((etf) => {
          const isExpanded = expandedTicker === etf.ticker;
          return (
            <div
              key={etf.ticker}
              className="claude-card bg-claude-card dark:bg-claude-darkCard p-4 border border-claude-border dark:border-claude-darkBorder flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="font-mono font-bold text-base text-claude-text dark:text-claude-darkText">
                      {etf.ticker}
                    </span>
                    <h3 className="text-xs text-claude-muted dark:text-claude-darkMuted mt-0.5 line-clamp-1">
                      {etf.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => copyToClipboard(etf.isin)}
                    className="claude-btn flex items-center space-x-1 px-2 py-1 text-[11px] font-mono rounded border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg hover:bg-claude-hover dark:hover:bg-claude-darkHover text-claude-muted dark:text-claude-darkMuted"
                    title="Copier le code ISIN"
                  >
                    <span>{etf.isin}</span>
                    {copiedIsin === etf.isin ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 my-2.5 p-2 rounded-lg bg-claude-bg dark:bg-claude-darkBg border border-claude-border/50 dark:border-claude-darkBorder/50 text-xs">
                  <div>
                    <div className="text-[10px] text-claude-muted">Frais (TER)</div>
                    <div className="font-mono font-semibold">
                      {etf.ter.toFixed(2)} %
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-claude-muted">Prix part</div>
                    <div className="font-mono font-semibold">
                      ~{formatExactCurrency(etf.sharePriceApprox)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-claude-muted">Type</div>
                    <div className="font-mono text-[11px]">
                      {etf.replicationType.includes('Swap') ? 'Swap' : 'Physique'}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-claude-muted dark:text-claude-darkMuted leading-relaxed">
                  {etf.description}
                </p>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-claude-border/60 dark:border-claude-darkBorder/60 space-y-1.5 text-xs">
                    <div>
                      <span className="font-medium text-claude-text dark:text-claude-darkText">Indice : </span>
                      <span className="text-claude-muted font-mono">{etf.indexTracked}</span>
                    </div>
                    <div>
                      <span className="font-medium text-claude-text dark:text-claude-darkText">Émetteur : </span>
                      <span className="text-claude-muted">{etf.issuer}</span>
                    </div>
                    <div className="text-claude-muted pt-1">
                      {etf.keyAdvantage}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-claude-border/40 dark:border-claude-darkBorder/40 text-xs">
                <button
                  onClick={() => setExpandedTicker(isExpanded ? null : etf.ticker)}
                  className="claude-btn text-claude-accent hover:underline font-medium"
                >
                  {isExpanded ? 'Fermer' : 'Détails'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEtfs.length === 0 && (
        <div className="text-center py-8 bg-claude-card dark:bg-claude-darkCard rounded-xl border border-claude-border dark:border-claude-darkBorder">
          <p className="text-xs text-claude-muted">Aucun résultat.</p>
        </div>
      )}
    </div>
  );
};
