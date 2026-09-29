import React, { useState, useMemo } from 'react';
import type { DcaSimulationParams, PeaCategory } from '../../types/finance';
import { runDcaSimulation, PEA_CEILINGS } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { DcaChart } from './DcaChart';
import { AlertTriangle, CheckCircle2, SlidersHorizontal, ShieldCheck } from 'lucide-react';

export const DcaSimulator: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState<number>(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(200);
  const [durationYears, setDurationYears] = useState<number>(15);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState<number>(8.0);
  const [etfTer, setEtfTer] = useState<number>(0.25); // default WPEA TER
  const [brokerFeePercent, setBrokerFeePercent] = useState<number>(0.0); // 0% or 0.5% max Pacte
  const [inflationRate, setInflationRate] = useState<number>(0.0);
  const [peaCategory, setPeaCategory] = useState<PeaCategory>('jeune');

  const params: DcaSimulationParams = useMemo(() => ({
    initialCapital,
    monthlyDeposit,
    durationYears,
    expectedAnnualReturn,
    etfTer,
    brokerFeePercent,
    inflationRate,
    peaCategory,
  }), [initialCapital, monthlyDeposit, durationYears, expectedAnnualReturn, etfTer, brokerFeePercent, inflationRate, peaCategory]);

  const result = useMemo(() => runDcaSimulation(params), [params]);

  const ceiling = PEA_CEILINGS[peaCategory];
  const percentOfCeiling = Math.min(100, Math.round((result.totalDeposited / ceiling) * 100));

  // Quick Presets
  const applyPreset = (preset: 'etudiant' | 'standard' | 'agressif') => {
    if (preset === 'etudiant') {
      setInitialCapital(500);
      setMonthlyDeposit(100);
      setDurationYears(10);
      setPeaCategory('jeune');
      setExpectedAnnualReturn(8.0);
    } else if (preset === 'standard') {
      setInitialCapital(2000);
      setMonthlyDeposit(300);
      setDurationYears(15);
      setPeaCategory('classique');
      setExpectedAnnualReturn(8.0);
    } else if (preset === 'agressif') {
      setInitialCapital(5000);
      setMonthlyDeposit(600);
      setDurationYears(20);
      setPeaCategory('classique');
      setExpectedAnnualReturn(8.5);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
        <div>
          <h2 className="text-base font-semibold text-claude-text dark:text-claude-darkText flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-claude-accent" />
            Paramètres du Simulateur DCA
          </h2>
          <p className="text-xs text-claude-muted dark:text-claude-darkMuted mt-0.5">
            Calcul actuariel exact déduisant les frais de gestion d'ETF et intégrant les plafonds légaux du PEA.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-claude-muted dark:text-claude-darkMuted mr-1">Préréglages :</span>
          <button
            onClick={() => applyPreset('etudiant')}
            className="claude-btn px-2.5 py-1 text-xs rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg hover:bg-claude-hover dark:hover:bg-claude-darkHover"
          >
            Jeune (100 €/m)
          </button>
          <button
            onClick={() => applyPreset('standard')}
            className="claude-btn px-2.5 py-1 text-xs rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg hover:bg-claude-hover dark:hover:bg-claude-darkHover"
          >
            Standard (300 €/m)
          </button>
          <button
            onClick={() => applyPreset('agressif')}
            className="claude-btn px-2.5 py-1 text-xs rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg hover:bg-claude-hover dark:hover:bg-claude-darkHover"
          >
            Long Terme (600 €/m)
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-claude-card dark:bg-claude-darkCard p-5 rounded-xl border border-claude-border dark:border-claude-darkBorder space-y-5">
            {/* Category: PEA Jeune vs Classique */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-claude-muted dark:text-claude-darkMuted block mb-2">
                Type de PEA &amp; Plafond Légal
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPeaCategory('jeune')}
                  className={`claude-btn p-2.5 text-left rounded-lg border text-xs transition-all ${
                    peaCategory === 'jeune'
                      ? 'border-claude-accent bg-claude-accent/5 dark:bg-claude-accent/10 text-claude-text dark:text-claude-darkText font-medium'
                      : 'border-claude-border dark:border-claude-darkBorder text-claude-muted dark:text-claude-darkMuted hover:bg-claude-hover dark:hover:bg-claude-darkHover'
                  }`}
                >
                  <div className="font-semibold text-sm">PEA Jeune</div>
                  <div className="text-[11px] text-claude-muted mt-0.5">Plafond : 20 000 €</div>
                  <div className="text-[10px] text-claude-accent mt-0.5">Rattaché fiscalement</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPeaCategory('classique')}
                  className={`claude-btn p-2.5 text-left rounded-lg border text-xs transition-all ${
                    peaCategory === 'classique'
                      ? 'border-claude-accent bg-claude-accent/5 dark:bg-claude-accent/10 text-claude-text dark:text-claude-darkText font-medium'
                      : 'border-claude-border dark:border-claude-darkBorder text-claude-muted dark:text-claude-darkMuted hover:bg-claude-hover dark:hover:bg-claude-darkHover'
                  }`}
                >
                  <div className="font-semibold text-sm">PEA Classique</div>
                  <div className="text-[11px] text-claude-muted mt-0.5">Plafond : 150 000 €</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Foyer fiscal propre</div>
                </button>
              </div>
            </div>

            {/* Slider 1: Capital Initial */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-claude-text dark:text-claude-darkText">Capital Initial</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-claude-bg dark:bg-claude-darkBg border border-claude-border dark:border-claude-darkBorder rounded">
                  {formatCurrency(initialCapital)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.min(ceiling, 20000)}
                step="100"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full accent-claude-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-claude-muted font-mono mt-0.5">
                <span>0 €</span>
                <span>{formatCurrency(Math.min(ceiling, 20000))}</span>
              </div>
            </div>

            {/* Slider 2: Versement Mensuel */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-claude-text dark:text-claude-darkText">Versement Mensuel (DCA)</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-claude-bg dark:bg-claude-darkBg border border-claude-border dark:border-claude-darkBorder rounded">
                  {formatCurrency(monthlyDeposit)} / mois
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="2000"
                step="10"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full accent-claude-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-claude-muted font-mono mt-0.5">
                <span>20 €</span>
                <span>500 €</span>
                <span>2 000 €</span>
              </div>
            </div>

            {/* Slider 3: Durée (années) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-claude-text dark:text-claude-darkText">Durée d'investissement</span>
                <div className="flex items-center space-x-1.5">
                  {durationYears >= 5 ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> 0% IR
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3" /> PFU 30%
                    </span>
                  )}
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-claude-bg dark:bg-claude-darkBg border border-claude-border dark:border-claude-darkBorder rounded">
                    {durationYears} ans
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full accent-claude-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-claude-muted font-mono mt-0.5">
                <span>1 an</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">5 ans (déblocage fiscal)</span>
                <span>35 ans</span>
              </div>
            </div>

            {/* Collapsible Advanced Parameters */}
            <div className="pt-2 border-t border-claude-border/60 dark:border-claude-darkBorder/60 space-y-3">
              <div className="text-xs font-semibold text-claude-muted dark:text-claude-darkMuted uppercase tracking-wider">
                Hypothèses de Marché &amp; Frais
              </div>

              {/* Expected Return */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-claude-text dark:text-claude-darkText">Rendement brut moyen espéré</span>
                  <span className="font-mono font-semibold">{expectedAnnualReturn}% / an</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="12.0"
                  step="0.5"
                  value={expectedAnnualReturn}
                  onChange={(e) => setExpectedAnnualReturn(Number(e.target.value))}
                  className="w-full accent-claude-accent cursor-pointer"
                />
                <div className="text-[10px] text-claude-muted flex justify-between font-mono">
                  <span>3% (prudent)</span>
                  <span>8% (historique MSCI World)</span>
                  <span>12% (optimiste)</span>
                </div>
              </div>

              {/* ETF TER Fees */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-claude-text dark:text-claude-darkText block mb-1">Frais ETF (TER)</span>
                  <select
                    value={etfTer}
                    onChange={(e) => setEtfTer(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-claude-text dark:text-claude-darkText text-xs font-mono"
                  >
                    <option value={0.25}>0,25 % (WPEA iShares)</option>
                    <option value={0.38}>0,38 % (CW8 Amundi)</option>
                    <option value={0.15}>0,15 % (ESE S&P 500)</option>
                    <option value={0.10}>0,10 % (Euro Stoxx 50)</option>
                  </select>
                </div>
                <div>
                  <span className="text-claude-text dark:text-claude-darkText block mb-1">Frais d'ordre courtier</span>
                  <select
                    value={brokerFeePercent}
                    onChange={(e) => setBrokerFeePercent(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-claude-text dark:text-claude-darkText text-xs font-mono"
                  >
                    <option value={0.0}>0,0 % (Offre partenaire)</option>
                    <option value={0.2}>0,2 % (Courtier low cost)</option>
                    <option value={0.5}>0,5 % (Plafond légal Loi Pacte)</option>
                  </select>
                </div>
              </div>

              {/* Inflation Toggle */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-claude-text dark:text-claude-darkText">Simulation Inflation</span>
                  <span className="font-mono text-claude-muted">{inflationRate}% / an</span>
                </div>
                <div className="flex gap-2">
                  {[0, 1.5, 2.0, 3.0].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setInflationRate(rate)}
                      className={`claude-btn flex-1 py-1 text-xs rounded border ${
                        inflationRate === rate
                          ? 'border-claude-accent bg-claude-accent/10 font-semibold text-claude-text dark:text-claude-darkText'
                          : 'border-claude-border dark:border-claude-darkBorder text-claude-muted hover:bg-claude-hover dark:hover:bg-claude-darkHover'
                      }`}
                    >
                      {rate === 0 ? 'Brut' : `${rate}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PEA Ceiling Indicator Card */}
          <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-claude-text dark:text-claude-darkText flex items-center gap-1.5">
                {result.isPeaCeilingReached ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
                Jauge Plafond Versement ({peaCategory === 'jeune' ? '20k €' : '150k €'})
              </span>
              <span className="font-mono font-semibold">
                {formatCurrency(result.totalDeposited)} / {formatCurrency(ceiling)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-claude-border/50 dark:bg-claude-darkBorder/50 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  result.isPeaCeilingReached ? 'bg-amber-500' : 'bg-claude-accent'
                }`}
                style={{ width: `${percentOfCeiling}%` }}
              />
            </div>
            {result.isPeaCeilingReached ? (
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                ⚠️ Plafond de versement légal atteint au bout de {Math.floor((result.monthsToReachCeiling || 0) / 12)} ans. Les versements sont automatiquement stoppés, mais votre capital continue de fructifier sans limite !
              </p>
            ) : (
              <p className="text-[11px] text-claude-muted dark:text-claude-darkMuted">
                Il vous reste <strong>{formatCurrency(ceiling - result.totalDeposited)}</strong> de marge de versement avant d'atteindre le plafond.
              </p>
            )}
          </div>
        </div>

        {/* Results & Chart Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Net in Pocket */}
            <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/[0.02]">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                Net dans la poche
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-claude-text dark:text-claude-darkText mt-1">
                {formatCurrency(result.netFinalValue)}
              </div>
              <div className="text-[10px] text-claude-muted mt-1">
                Après prélèvements sociaux (17,2 %)
              </div>
            </div>

            {/* Total Deposited */}
            <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-claude-muted dark:text-claude-darkMuted">
                Total Versé
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-claude-text dark:text-claude-darkText mt-1">
                {formatCurrency(result.totalDeposited)}
              </div>
              <div className="text-[10px] text-claude-muted mt-1">
                Votre effort d'épargne réel
              </div>
            </div>

            {/* Capital Gains */}
            <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder col-span-2 sm:col-span-1">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-claude-accent">
                Plus-Values Générées
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-claude-accent mt-1">
                +{formatCurrency(result.grossGains)}
              </div>
              <div className="text-[10px] text-claude-muted mt-1">
                Multiplicateur x{(result.grossFinalValue / Math.max(1, result.totalDeposited)).toFixed(1)}
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <DcaChart timeline={result.timeline} />

          {/* Fiscal & Comparison Summary */}
          <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-claude-muted dark:text-claude-darkMuted mb-3 flex items-center justify-between">
              <span>Bilan Fiscal &amp; Comparatif Réel</span>
              <span className="text-[11px] font-normal text-claude-muted">Réglementation Art. L. 221-30 CMF</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 border-r-0 sm:border-r border-claude-border/50 dark:border-claude-darkBorder/50 pr-0 sm:pr-4">
                <div className="flex justify-between">
                  <span className="text-claude-muted">Impôt sur le Revenu (IR) :</span>
                  <span className={`font-mono font-semibold ${durationYears >= 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                    {durationYears >= 5 ? '0 € (Exonéré 0%)' : formatCurrency(result.incomeTax) + ' (12,8% PFU)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-claude-muted">Prélèvements Sociaux (17,2%) :</span>
                  <span className="font-mono font-medium text-claude-text dark:text-claude-darkText">
                    -{formatCurrency(result.socialContributions)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-claude-muted">Frais d'ordres cumulés :</span>
                  <span className="font-mono text-claude-muted">
                    {result.totalFeesPaid === 0 ? '0 € (Offre partenaire)' : `~${formatCurrency(result.totalFeesPaid)}`}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-claude-muted">Équivalent sur Livret A (à 3%) :</span>
                  <span className="font-mono font-semibold text-stone-600 dark:text-stone-400">
                    {formatCurrency(result.equivalentLivretAValue)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Gain supplémentaire en Bourse :</span>
                  <span className="font-mono font-bold">
                    +{formatCurrency(Math.max(0, result.netFinalValue - result.equivalentLivretAValue))}
                  </span>
                </div>
                <div className="text-[11px] text-claude-muted leading-tight mt-1">
                  Sur {durationYears} ans, le PEA génère {formatCurrency(Math.max(0, result.netFinalValue - result.equivalentLivretAValue))} de plus que les livrets sécurisés.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
