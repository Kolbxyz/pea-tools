import type { DcaSimulationParams, DcaSimulationResult, YearSimulationPoint } from '../types/finance';

export const PEA_CEILINGS = {
  classique: 150000,
  jeune: 20000,
};

export const SOCIAL_CONTRIBUTIONS_RATE = 0.172; // 17.2% (CSG, CRDS, etc.)
export const PFU_INCOME_TAX_RATE = 0.128; // 12.8% (IR portion of 30% Flat Tax)

export function runDcaSimulation(params: DcaSimulationParams): DcaSimulationResult {
  const {
    initialCapital,
    monthlyDeposit,
    durationYears,
    expectedAnnualReturn,
    etfTer,
    brokerFeePercent,
    inflationRate,
    peaCategory,
  } = params;

  const ceiling = PEA_CEILINGS[peaCategory];
  const totalMonths = durationYears * 12;

  // Net annual return after ETF TER
  const netAnnualRate = Math.max(0, (expectedAnnualReturn - etfTer) / 100);
  // Monthly compounding actuarial equivalent rate: (1 + r)^(1/12) - 1
  const monthlyRate = Math.pow(1 + netAnnualRate, 1 / 12) - 1;

  // Monthly risk-free rate for Livret A baseline (approx 3% net / year)
  const livretAMonthlyRate = Math.pow(1 + 0.03, 1 / 12) - 1;

  let currentPortfolioValue = initialCapital;
  let currentLivretAValue = initialCapital;
  let cumulativeDeposits = initialCapital;
  let totalBrokerFees = 0;
  let monthsToCeiling: number | null = null;

  const timeline: YearSimulationPoint[] = [];

  // Initial point at month 0 / year 0
  timeline.push({
    year: 0,
    month: 0,
    totalDeposited: initialCapital,
    grossValue: initialCapital,
    netValueAfterTaxes: initialCapital,
    realPurchasingPower: initialCapital,
    totalFeesPaid: 0,
    peaCeilingReached: initialCapital >= ceiling,
  });

  for (let m = 1; m <= totalMonths; m++) {
    // Determine whether we can deposit this month (cannot exceed PEA deposit ceiling)
    let depositThisMonth = 0;
    if (cumulativeDeposits < ceiling) {
      const roomLeft = ceiling - cumulativeDeposits;
      depositThisMonth = Math.min(monthlyDeposit, roomLeft);
      cumulativeDeposits += depositThisMonth;

      const brokerFee = depositThisMonth * (brokerFeePercent / 100);
      totalBrokerFees += brokerFee;
      // Net money entering market
      currentPortfolioValue += (depositThisMonth - brokerFee);
      currentLivretAValue += depositThisMonth;

      if (cumulativeDeposits >= ceiling && monthsToCeiling === null) {
        monthsToCeiling = m;
      }
    }

    // Capital compounds
    currentPortfolioValue *= (1 + monthlyRate);
    currentLivretAValue *= (1 + livretAMonthlyRate);

    // Record yearly snapshot (or last month)
    if (m % 12 === 0 || m === totalMonths) {
      const yearIndex = Math.round(m / 12);
      const isPast5Years = yearIndex >= 5;

      const grossGains = Math.max(0, currentPortfolioValue - cumulativeDeposits);
      
      // Tax calculation according to PEA age
      let netValue = currentPortfolioValue;
      if (isPast5Years) {
        // Exonerated from IR, only 17.2% social contributions on gains
        const socialTaxes = grossGains * SOCIAL_CONTRIBUTIONS_RATE;
        netValue = currentPortfolioValue - socialTaxes;
      } else {
        // Under 5 years: Flat tax 30% (12.8% IR + 17.2% PS)
        const totalTaxes = grossGains * (PFU_INCOME_TAX_RATE + SOCIAL_CONTRIBUTIONS_RATE);
        netValue = currentPortfolioValue - totalTaxes;
      }

      // Inflation adjustment: Value / (1 + inflation)^years
      const inflationFactor = Math.pow(1 + inflationRate / 100, yearIndex);
      const realPurchasingPower = netValue / inflationFactor;

      timeline.push({
        year: yearIndex,
        month: m,
        totalDeposited: Math.round(cumulativeDeposits),
        grossValue: Math.round(currentPortfolioValue),
        netValueAfterTaxes: Math.round(netValue),
        realPurchasingPower: Math.round(realPurchasingPower),
        totalFeesPaid: Math.round(totalBrokerFees),
        peaCeilingReached: cumulativeDeposits >= ceiling,
      });
    }
  }

  const grossFinalValue = Math.round(currentPortfolioValue);
  const grossGains = Math.max(0, grossFinalValue - cumulativeDeposits);
  const isPast5Years = durationYears >= 5;

  const socialContributions = Math.round(grossGains * SOCIAL_CONTRIBUTIONS_RATE);
  const incomeTax = isPast5Years ? 0 : Math.round(grossGains * PFU_INCOME_TAX_RATE);
  const netFinalValue = grossFinalValue - socialContributions - incomeTax;

  return {
    timeline,
    totalDeposited: Math.round(cumulativeDeposits),
    grossFinalValue,
    grossGains,
    socialContributions,
    incomeTax,
    netFinalValue,
    totalFeesPaid: Math.round(totalBrokerFees),
    isPeaCeilingReached: cumulativeDeposits >= ceiling,
    monthsToReachCeiling: monthsToCeiling,
    equivalentLivretAValue: Math.round(currentLivretAValue),
  };
}
