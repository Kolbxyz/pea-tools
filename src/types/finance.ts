export type PeaCategory = 'classique' | 'jeune';

export interface DcaSimulationParams {
  initialCapital: number;
  monthlyDeposit: number;
  durationYears: number;
  expectedAnnualReturn: number;
  etfTer: number;
  brokerFeePercent: number;
  inflationRate: number;
  peaCategory: PeaCategory;
  currentAge: number; // e.g. 18 to 25
}

export interface YearSimulationPoint {
  year: number;
  month: number;
  age: number;
  totalDeposited: number;
  grossValue: number;
  netValueAfterTaxes: number;
  realPurchasingPower: number;
  totalFeesPaid: number;
  activeCeiling: number;
  peaCeilingReached: boolean;
}

export interface DcaSimulationResult {
  timeline: YearSimulationPoint[];
  totalDeposited: number;
  grossFinalValue: number;
  grossGains: number;
  socialContributions: number;
  incomeTax: number;
  netFinalValue: number;
  totalFeesPaid: number;
  activeCeiling: number;
  isPeaCeilingReached: boolean;
  conversionAgeReachedYear: number | null; // year when PEA Jeune converted to Classique
  equivalentLivretAValue: number;
}

export interface EtfInfo {
  ticker: string;
  name: string;
  isin: string;
  issuer: 'BlackRock (iShares)' | 'Amundi' | 'BNP Paribas Easy' | 'Autre';
  indexTracked: string;
  ter: number;
  replicationType: 'Synthétique (Swap)' | 'Physique';
  distributionPolicy: 'Capitalisant' | 'Distribuant';
  sharePriceApprox: number;
  currency: string;
  peaEligible: boolean;
  category: 'Monde' | 'S&P 500 / USA' | 'Europe' | 'Émergents' | 'Tech / Sectoriel';
  description: string;
  keyAdvantage: string;
}

export interface LegalArticle {
  title: string;
  reference: string;
  summary: string;
  impactPratique: string;
  specialCases?: string[];
  officialSourceUrl?: string;
}
