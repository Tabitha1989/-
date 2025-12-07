export type Language = 'en' | 'zh';

export interface HistoricalPoint {
  date: string;
  value: number;
}

export interface MetricData {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  unit: string;
  status: 'Undervalued' | 'Fair' | 'Overvalued' | 'Extreme Bubble';
  history: HistoricalPoint[];
  thresholds: {
    fair: number;
    overvalued: number;
    extreme: number;
  };
  benchmark: {
    value: number;
    label: string;
  };
}

export interface MarketState {
  metrics: MetricData[];
  overallScore: number; // 0 to 100
  lastUpdated: string;
}

export enum BubbleRiskLevel {
  LOW = 'Low Risk',
  MODERATE = 'Moderate Risk',
  ELEVATED = 'Elevated Risk',
  HIGH = 'High (Bubble Territory)',
  EXTREME = 'Extreme Bubble'
}