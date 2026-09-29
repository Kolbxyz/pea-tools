import React, { useState, useMemo } from 'react';
import { PEA_ETFS } from '../../data/etfs';
import { Search, Copy, Check, ShieldCheck } from 'lucide-react';
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
      {/* Intro Header */}
      <div className="bg-claude-card dark:bg-claude-darkCard p-5 rounded-xl border border-claude-border dark:border-claude-darkBorder">
        <h2 className="text-base font-semibold text-claude-text dark:text-claude-darkText mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-claude-accent" />
          Répertoire Officiel des ETF Éligibles PEA
        </h2>
        <p className="text-xs text-claude-muted dark:text-claude-darkMuted leading-relaxed">
          Données financières réelles et vérifiées des ETF de référence éligibles au PEA en France (2025/2026).
          Tous les ETF présentés sont <strong>capitalisants</strong> (réinvestissent automatiquement les dividendes sans frottement fiscal).
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-claude-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par ticker (WPEA, CW8), nom ou ISIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-xs text-claude-text dark:text-claude-darkText placeholder-claude-muted focus:outline-none focus:ring-1 focus:ring-claude-accent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-xs text-claude-text dark:text-claude-darkText focus:outline-none focus:ring-1 focus:ring-claude-accent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Catégorie : {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Issuer Filter */}
          <div>
            <select
              value={selectedIssuer}
              onChange={(e) => setSelectedIssuer(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-xs text-claude-text dark:text-claude-darkText focus:outline-none focus:ring-1 focus:ring-claude-accent"
            >
              {issuers.map((iss) => (
                <option key={iss} value={iss}>
                  Émetteur : {iss}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ETF Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEtfs.map((etf) => {
          const isExpanded = expandedTicker === etf.ticker;
          return (
            <div
              key={etf.ticker}
              className="claude-card bg-claude-card dark:bg-claude-darkCard p-5 border-claude-border dark:border-claude-darkBorder hover:border-claude-accent/40 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Ticker, Name, Tag */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-lg text-claude-text dark:text-claude-darkText tracking-tight">
                        {etf.ticker}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-claude-accent/10 text-claude-accent border border-claude-accent/20">
                        {etf.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-medium text-claude-muted dark:text-claude-darkMuted mt-0.5 line-clamp-1">
                      {etf.name}
                    </h3>
                  </div>

                  {/* ISIN Copy Button */}
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

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-lg bg-claude-bg/70 dark:bg-claude-darkBg/70 border border-claude-border/50 dark:border-claude-darkBorder/50 text-xs">
                  <div>
                    <div className="text-[10px] text-claude-muted">Frais annuels (TER)</div>
                    <div className="font-mono font-bold text-claude-text dark:text-claude-darkText">
                      {etf.ter.toFixed(2)} %
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-claude-muted">Prix part approx.</div>
                    <div className="font-mono font-semibold text-claude-text dark:text-claude-darkText">
                      ~{formatExactCurrency(etf.sharePriceApprox)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-claude-muted">Réplication</div>
                    <div className="font-mono font-medium text-[11px] text-claude-muted">
                      {etf.replicationType.includes('Swap') ? 'Swap Synthétique' : 'Physique directe'}
                    </div>
                  </div>
                </div>

                {/* Description and Key Advantage */}
                <p className="text-xs text-claude-muted dark:text-claude-darkMuted leading-relaxed">
                  {etf.description}
                </p>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-claude-border/60 dark:border-claude-darkBorder/60 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-claude-text dark:text-claude-darkText">Indice de référence : </span>
                      <span className="text-claude-muted font-mono">{etf.indexTracked}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-claude-text dark:text-claude-darkText">Émetteur officiel : </span>
                      <span className="text-claude-muted">{etf.issuer}</span>
                    </div>
                    <div className="p-2 rounded bg-claude-accent/5 dark:bg-claude-accent/10 border border-claude-accent/15 text-[11px] text-claude-text dark:text-claude-darkText">
                      <strong>Atout clé : </strong> {etf.keyAdvantage}
                    </div>
                  </div>
                )}
              </div>

              {/* Expand Toggle */}
              <div className="mt-4 pt-2 border-t border-claude-border/40 dark:border-claude-darkBorder/40 flex justify-between items-center text-xs">
                <button
                  onClick={() => setExpandedTicker(isExpanded ? null : etf.ticker)}
                  className="claude-btn text-claude-accent hover:underline flex items-center gap-1 font-medium"
                >
                  {isExpanded ? 'Réduire' : 'Détails & Atout clé'}
                </button>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ 100% Éligible PEA
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEtfs.length === 0 && (
        <div className="text-center py-12 bg-claude-card dark:bg-claude-darkCard rounded-xl border border-claude-border dark:border-claude-darkBorder">
          <p className="text-sm text-claude-muted">Aucun ETF ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
};
