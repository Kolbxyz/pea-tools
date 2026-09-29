import React, { useState, useMemo } from 'react';
import type { DcaSimulationParams, PeaCategory } from '../../types/finance';
import { runDcaSimulation } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { DcaChart } from './DcaChart';

export const DcaSimulator: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<number>(18);
  const [initialCapital, setInitialCapital] = useState<number>(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(200);
  const [durationYears, setDurationYears] = useState<number>(15);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState<number>(8.0);
  const [etfTer, setEtfTer] = useState<number>(0.25);
  const [brokerFeePercent, setBrokerFeePercent] = useState<number>(0.0);
  const [inflationRate, setInflationRate] = useState<number>(0.0);
  const [peaCategory, setPeaCategory] = useState<PeaCategory>('jeune');

  const params: DcaSimulationParams = useMemo(() => ({
    currentAge,
    initialCapital,
    monthlyDeposit,
    durationYears,
    expectedAnnualReturn,
    etfTer,
    brokerFeePercent,
    inflationRate,
    peaCategory,
  }), [currentAge, initialCapital, monthlyDeposit, durationYears, expectedAnnualReturn, etfTer, brokerFeePercent, inflationRate, peaCategory]);

  const result = useMemo(() => runDcaSimulation(params), [params]);

  const percentOfCeiling = Math.min(100, Math.round((result.totalDeposited / result.activeCeiling) * 100));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-claude-card dark:bg-claude-darkCard p-5 rounded-xl border border-claude-border dark:border-claude-darkBorder space-y-4">
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-claude-muted dark:text-claude-darkMuted block mb-2">
                Type de PEA
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPeaCategory('jeune')}
                  className={`claude-btn p-2.5 text-left rounded-lg border text-xs ${
                    peaCategory === 'jeune'
                      ? 'border-claude-accent bg-claude-accent/5 dark:bg-claude-accent/10 font-medium text-claude-text dark:text-claude-darkText'
                      : 'border-claude-border dark:border-claude-darkBorder text-claude-muted hover:bg-claude-hover dark:hover:bg-claude-darkHover'
                  }`}
                >
                  <div className="font-semibold text-sm">PEA Jeune</div>
                  <div className="text-[11px] text-claude-muted">20k € puis 150k € à 25 ans</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPeaCategory('classique')}
                  className={`claude-btn p-2.5 text-left rounded-lg border text-xs ${
                    peaCategory === 'classique'
                      ? 'border-claude-accent bg-claude-accent/5 dark:bg-claude-accent/10 font-medium text-claude-text dark:text-claude-darkText'
                      : 'border-claude-border dark:border-claude-darkBorder text-claude-muted hover:bg-claude-hover dark:hover:bg-claude-darkHover'
                  }`}
                >
                  <div className="font-semibold text-sm">PEA Classique</div>
                  <div className="text-[11px] text-claude-muted">Plafond: 150k €</div>
                </button>
              </div>
            </div>

            {/* Current Age Input */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-medium text-claude-text dark:text-claude-darkText">Votre âge actuel</span>
                <span className="font-mono font-semibold">{currentAge} ans</span>
              </div>
              <input
                type="range"
                min="18"
                max={peaCategory === 'jeune' ? 25 : 65}
                step="1"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full accent-claude-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-claude-muted font-mono mt-0.5">
                <span>18 ans</span>
                {peaCategory === 'jeune' && (
                  <span className="text-claude-accent">Bascule automatique à 25 ans vers 150 000 €</span>
                )}
                <span>{peaCategory === 'jeune' ? '25 ans' : '65 ans'}</span>
              </div>
            </div>

            {/* Initial Capital */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-medium text-claude-text dark:text-claude-darkText">Capital initial</span>
                <span className="font-mono font-semibold">{formatCurrency(initialCapital)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="100"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full accent-claude-accent cursor-pointer"
              />
            </div>

            {/* Monthly Deposit - UP TO 5 000 € */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-medium text-claude-text dark:text-claude-darkText">Versement mensuel (DCA)</span>
                <span className="font-mono font-semibold">{formatCurrency(monthlyDeposit)} / mois</span>
              </div>
              <input
                type="range"
                min="20"
                max="5000"
                step="20"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full accent-claude-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-claude-muted font-mono mt-0.5">
                <span>20 €</span>
                <span>1 000 €</span>
                <span>5 000 €</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-medium text-claude-text dark:text-claude-darkText">Durée</span>
                <span className="font-mono font-semibold">
                  {durationYears} ans (jusqu'à {currentAge + durationYears} ans)
                </span>
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
                <span>5 ans (exonéré IR)</span>
                <span>35 ans</span>
              </div>
            </div>

            {/* Market parameters */}
            <div className="pt-2 border-t border-claude-border/60 dark:border-claude-darkBorder/60 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-claude-text dark:text-claude-darkText">Rendement annuel</span>
                  <span className="font-mono font-semibold">{expectedAnnualReturn}%</span>
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
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-claude-text dark:text-claude-darkText block mb-1">Frais ETF (TER)</span>
                  <select
                    value={etfTer}
                    onChange={(e) => setEtfTer(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-xs font-mono"
                  >
                    <option value={0.25}>0,25 % (WPEA)</option>
                    <option value={0.38}>0,38 % (CW8)</option>
                    <option value={0.15}>0,15 % (ESE)</option>
                    <option value={0.10}>0,10 % (SX5E)</option>
                  </select>
                </div>
                <div>
                  <span className="text-claude-text dark:text-claude-darkText block mb-1">Courtage</span>
                  <select
                    value={brokerFeePercent}
                    onChange={(e) => setBrokerFeePercent(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-claude-border dark:border-claude-darkBorder bg-claude-bg dark:bg-claude-darkBg text-xs font-mono"
                  >
                    <option value={0.0}>0,0 % (Offre 0€)</option>
                    <option value={0.2}>0,2 %</option>
                    <option value={0.5}>0,5 % (Plafond légal)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-claude-text dark:text-claude-darkText">Inflation</span>
                  <span className="font-mono text-claude-muted">{inflationRate}%</span>
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
                      {rate === 0 ? '0%' : `${rate}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ceiling state */}
          <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-claude-text dark:text-claude-darkText">
                Dépôts cumulés / Plafond ({formatCurrency(result.activeCeiling)})
              </span>
              <span className="font-mono font-semibold">
                {formatCurrency(result.totalDeposited)}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-claude-border dark:border-claude-darkBorder overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  result.isPeaCeilingReached ? 'bg-amber-500' : 'bg-claude-accent'
                }`}
                style={{ width: `${percentOfCeiling}%` }}
              />
            </div>
            <div className="text-[11px] text-claude-muted dark:text-claude-darkMuted flex justify-between">
              <span>
                {result.conversionAgeReachedYear !== null
                  ? `Bascule à 25 ans (An ${result.conversionAgeReachedYear}) vers plafond de 150 000 €`
                  : `Reste à déposer : ${formatCurrency(Math.max(0, result.activeCeiling - result.totalDeposited))}`}
              </span>
              <span>{percentOfCeiling}%</span>
            </div>
          </div>
        </div>

        {/* Results & Chart Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-claude-muted dark:text-claude-darkMuted">
                Capital Net
              </div>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(result.netFinalValue)}
              </div>
              <div className="text-[10px] text-claude-muted mt-1">
                Net de prélèvements
              </div>
            </div>

            <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-claude-muted dark:text-claude-darkMuted">
                Total Versé
              </div>
              <div className="text-xl font-bold font-mono text-claude-text dark:text-claude-darkText mt-1">
                {formatCurrency(result.totalDeposited)}
              </div>
              <div className="text-[10px] text-claude-muted mt-1">
                Dépôts
              </div>
            </div>

            <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-claude-accent">
                Plus-Values
              </div>
              <div className="text-xl font-bold font-mono text-claude-accent mt-1">
                +{formatCurrency(result.grossGains)}
              </div>
              <div className="text-[10px] text-claude-muted mt-1">
                x{(result.grossFinalValue / Math.max(1, result.totalDeposited)).toFixed(1)}
              </div>
            </div>
          </div>

          <DcaChart timeline={result.timeline} />

          <div className="bg-claude-card dark:bg-claude-darkCard p-4 rounded-xl border border-claude-border dark:border-claude-darkBorder">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 border-r-0 sm:border-r border-claude-border/50 dark:border-claude-darkBorder/50 pr-0 sm:pr-4">
                <div className="flex justify-between">
                  <span className="text-claude-muted">Impôt sur le Revenu :</span>
                  <span className="font-mono font-semibold">
                    {durationYears >= 5 ? '0 € (Exonéré)' : `${formatCurrency(result.incomeTax)} (12,8% PFU)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-claude-muted">Prélèvements Sociaux (17,2%) :</span>
                  <span className="font-mono font-medium">
                    -{formatCurrency(result.socialContributions)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-claude-muted">Frais d'ordre estimés :</span>
                  <span className="font-mono text-claude-muted">
                    {formatCurrency(result.totalFeesPaid)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-claude-muted">Équivalent Livret (3%) :</span>
                  <span className="font-mono font-semibold text-stone-600 dark:text-stone-400">
                    {formatCurrency(result.equivalentLivretAValue)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Différentiel net PEA :</span>
                  <span className="font-mono font-bold">
                    +{formatCurrency(Math.max(0, result.netFinalValue - result.equivalentLivretAValue))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
