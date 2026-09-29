export type PeaCategory = 'classique' | 'jeune';

export interface DcaSimulationParams {
  initialCapital: number;
  monthlyDeposit: number;
  durationYears: number;
  expectedAnnualReturn: number; // in percent (e.g., 8)
  etfTer: number; // in percent (e.g., 0.25)
  brokerFeePercent: number; // in percent (e.g., 0.5 or 0)
  inflationRate: number; // in percent (e.g., 2 or 0)
  peaCategory: PeaCategory;
}

export interface YearSimulationPoint {
  year: number;
  month: number;
  totalDeposited: number;
  grossValue: number;
  netValueAfterTaxes: number;
  realPurchasingPower: number; // adjusted for inflation
  totalFeesPaid: number;
  peaCeilingReached: boolean;
}

export interface DcaSimulationResult {
  timeline: YearSimulationPoint[];
  totalDeposited: number;
  grossFinalValue: number;
  grossGains: number;
  socialContributions: number; // 17.2% of gains
  incomeTax: number; // 0% if >= 5 years, 12.8% if < 5 years
  netFinalValue: number;
  totalFeesPaid: number;
  isPeaCeilingReached: boolean;
  monthsToReachCeiling: number | null;
  equivalentLivretAValue: number; // for baseline comparison (e.g. 3% risk-free)
}

export interface EtfInfo {
  ticker: string;
  name: string;
  isin: string;
  issuer: 'BlackRock (iShares)' | 'Amundi' | 'BNP Paribas Easy' | 'Autre';
  indexTracked: string;
  ter: number; // % annual expense ratio
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
