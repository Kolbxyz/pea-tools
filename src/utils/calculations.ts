import type { DcaSimulationParams, DcaSimulationResult, YearSimulationPoint } from '../types/finance';

export const SOCIAL_CONTRIBUTIONS_RATE = 0.172; // 17.2% (CSG, CRDS)
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
    currentAge,
  } = params;

  const totalMonths = durationYears * 12;

  // Net annual rate after deducting ETF TER
  const netAnnualRate = Math.max(0, (expectedAnnualReturn - etfTer) / 100);
  const monthlyRate = Math.pow(1 + netAnnualRate, 1 / 12) - 1;

  // Monthly risk-free rate for Livret A comparison (3% net)
  const livretAMonthlyRate = Math.pow(1 + 0.03, 1 / 12) - 1;

  let currentPortfolioValue = initialCapital;
  let currentLivretAValue = initialCapital;
  let cumulativeDeposits = initialCapital;
  let totalBrokerFees = 0;

  // Conversion tracking: year when PEA Jeune turned 25 and became Classique
  let conversionYear: number | null = null;
  if (peaCategory === 'jeune' && currentAge < 25) {
    const yearsTo25 = 25 - currentAge;
    if (yearsTo25 <= durationYears) {
      conversionYear = yearsTo25;
    }
  }

  const timeline: YearSimulationPoint[] = [];

  const initialCeiling = peaCategory === 'jeune' ? 20000 : 150000;

  timeline.push({
    year: 0,
    month: 0,
    age: currentAge,
    totalDeposited: initialCapital,
    grossValue: initialCapital,
    netValueAfterTaxes: initialCapital,
    realPurchasingPower: initialCapital,
    totalFeesPaid: 0,
    activeCeiling: initialCeiling,
    peaCeilingReached: initialCapital >= initialCeiling,
  });

  for (let m = 1; m <= totalMonths; m++) {
    const simulatedYearsElapsed = Math.floor(m / 12);
    const simulatedCurrentAge = currentAge + simulatedYearsElapsed;

    // Legal ceiling: If PEA Jeune, once 25 years old is reached, ceiling automatically converts to 150k €
    let currentCeiling = 150000;
    if (peaCategory === 'jeune' && simulatedCurrentAge < 25) {
      currentCeiling = 20000;
    }

    // Monthly deposit if ceiling not reached
    let depositThisMonth = 0;
    if (cumulativeDeposits < currentCeiling) {
      const roomLeft = currentCeiling - cumulativeDeposits;
      depositThisMonth = Math.min(monthlyDeposit, roomLeft);
      cumulativeDeposits += depositThisMonth;

      const brokerFee = depositThisMonth * (brokerFeePercent / 100);
      totalBrokerFees += brokerFee;
      currentPortfolioValue += (depositThisMonth - brokerFee);
      currentLivretAValue += depositThisMonth;
    }

    // Compound growth
    currentPortfolioValue *= (1 + monthlyRate);
    currentLivretAValue *= (1 + livretAMonthlyRate);

    // Record yearly point or final month
    if (m % 12 === 0 || m === totalMonths) {
      const yearIndex = Math.round(m / 12);
      const isPast5Years = yearIndex >= 5;

      const grossGains = Math.max(0, currentPortfolioValue - cumulativeDeposits);
      let netValue = currentPortfolioValue;

      if (isPast5Years) {
        // Exonerated from IR, only 17.2% social contributions on gains
        netValue = currentPortfolioValue - grossGains * SOCIAL_CONTRIBUTIONS_RATE;
      } else {
        // Under 5 years: Flat tax 30% on gains
        netValue = currentPortfolioValue - grossGains * (PFU_INCOME_TAX_RATE + SOCIAL_CONTRIBUTIONS_RATE);
      }

      const inflationFactor = Math.pow(1 + inflationRate / 100, yearIndex);
      const realPurchasingPower = netValue / inflationFactor;

      timeline.push({
        year: yearIndex,
        month: m,
        age: currentAge + yearIndex,
        totalDeposited: Math.round(cumulativeDeposits),
        grossValue: Math.round(currentPortfolioValue),
        netValueAfterTaxes: Math.round(netValue),
        realPurchasingPower: Math.round(realPurchasingPower),
        totalFeesPaid: Math.round(totalBrokerFees),
        activeCeiling: currentCeiling,
        peaCeilingReached: cumulativeDeposits >= currentCeiling,
      });
    }
  }

  const finalYearCeiling = (peaCategory === 'jeune' && (currentAge + durationYears) < 25) ? 20000 : 150000;
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
    activeCeiling: finalYearCeiling,
    isPeaCeilingReached: cumulativeDeposits >= finalYearCeiling,
    conversionAgeReachedYear: conversionYear,
    equivalentLivretAValue: Math.round(currentLivretAValue),
  };
}
