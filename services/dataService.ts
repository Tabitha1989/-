import { MetricData, Language } from '../types';
import { translations } from '../translations';

// Helper to generate a date string YYYY-MM
const getDate = (monthsAgo: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toISOString().slice(0, 7); // YYYY-MM
};

// Helper to generate a realistic trend with cycles (to simulate 20 years history)
const generateTrend = (
  start: number, 
  end: number, 
  steps: number, 
  volatility: number,
  cycleAmp: number = 0 // Amplitude of the business cycle
): number[] => {
  const data: number[] = [];
  
  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1); // 0 to 1
    
    // Linear base trend
    const trend = start + (end - start) * progress;
    
    // Cyclical component (approx 3 major cycles over the 20 years)
    // Math.PI * 6 ensures 3 full sine waves
    const cycle = Math.sin(progress * Math.PI * 6) * cycleAmp;
    
    // Random noise
    const noise = (Math.random() - 0.5) * volatility;
    
    const value = trend + cycle + noise;
    data.push(Number(value.toFixed(2)));
  }
  return data;
};

// Returns the raw data structure with English defaults
export const getMarketMetrics = (): MetricData[] => {
  const steps = 240; // 20 years of data (12 months * 20)

  // 1. Buffett Indicator
  // Trend: Upwards from 80% to 195%, with heavy cycles
  const buffettHistory = generateTrend(80, 195, steps, 5, 25).map((val, i) => ({
    date: getDate(steps - 1 - i),
    value: Math.max(0, val)
  }));

  const buffettIndicator: MetricData = {
    id: 'buffett',
    name: 'Buffett Indicator', 
    description: 'Ratio of Total US Stock Market Capitalization to US GDP.',
    currentValue: buffettHistory[buffettHistory.length - 1].value,
    unit: '%',
    status: 'Extreme Bubble',
    history: buffettHistory,
    thresholds: { fair: 100, overvalued: 140, extreme: 170 },
    benchmark: { value: 142, label: 'Dotcom Peak (2000)' }
  };

  // 2. Shiller P/E
  // Trend: 24 to 35, cycles
  const peHistory = generateTrend(24, 35, steps, 2, 8).map((val, i) => ({
    date: getDate(steps - 1 - i),
    value: Math.max(0, val)
  }));

  const shillerPE: MetricData = {
    id: 'shiller',
    name: 'Shiller P/E Ratio',
    description: 'Price-to-Earnings ratio based on average inflation-adjusted earnings from the previous 10 years.',
    currentValue: peHistory[peHistory.length - 1].value,
    unit: 'x',
    status: 'Overvalued',
    history: peHistory,
    thresholds: { fair: 20, overvalued: 30, extreme: 38 },
    benchmark: { value: 44.19, label: 'Dotcom Peak (2000)' }
  };

  // 3. Dividend Yield
  // Trend: Downwards from 2.5% to 1.35% (Inverse bubble indicator)
  const yieldHistory = generateTrend(2.5, 1.35, steps, 0.1, 0.4).map((val, i) => ({
    date: getDate(steps - 1 - i),
    value: Math.max(0.5, val)
  }));

  const dividendYield: MetricData = {
    id: 'yield',
    name: 'S&P 500 Dividend Yield',
    description: 'The dividend return on investment for the S&P 500.',
    currentValue: yieldHistory[yieldHistory.length - 1].value,
    unit: '%',
    status: 'Overvalued',
    history: yieldHistory,
    thresholds: { fair: 2.5, overvalued: 1.8, extreme: 1.4 },
    benchmark: { value: 1.11, label: 'Dotcom Low (2000)' }
  };

  // 4. Margin Debt
  // Trend: 5% growth to 12% growth, but swings wildy (-20 to +40)
  const marginHistory = generateTrend(5, 12, steps, 5, 20).map((val, i) => ({
    date: getDate(steps - 1 - i),
    value: val
  }));

  const marginDebt: MetricData = {
    id: 'margin',
    name: 'Margin Debt Growth',
    description: 'Year-over-year growth in margin debt.',
    currentValue: marginHistory[marginHistory.length - 1].value,
    unit: '%',
    status: 'Fair',
    history: marginHistory,
    thresholds: { fair: 10, overvalued: 20, extreme: 40 },
    benchmark: { value: 20, label: 'Danger Zone (>20%)' }
  };

  // 5. Fear & Greed
  // Trend: 45 to 78, high volatility
  const fearHistory = generateTrend(50, 78, steps, 15, 15).map((val, i) => ({
    date: getDate(steps - 1 - i),
    value: Math.max(0, Math.min(100, val))
  }));

  const fearGreed: MetricData = {
    id: 'fear_greed',
    name: 'Fear & Greed Index',
    description: 'A compilation of 7 indicators measuring market sentiment.',
    currentValue: fearHistory[fearHistory.length - 1].value,
    unit: '/ 100',
    status: 'Overvalued',
    history: fearHistory,
    thresholds: { fair: 50, overvalued: 75, extreme: 90 },
    benchmark: { value: 50, label: 'Neutral (50)' }
  };

  // 6. Nasdaq 100 Deviation
  // Trend: 5% to 25%, cycles
  const ndxHistory = generateTrend(5, 25, steps, 3, 12).map((val, i) => ({
    date: getDate(steps - 1 - i),
    value: val
  }));

  const ndxDeviation: MetricData = {
    id: 'ndx_deviation',
    name: 'Nasdaq 100 Deviation',
    description: 'Percentage deviation from 200-day moving average.',
    currentValue: ndxHistory[ndxHistory.length - 1].value,
    unit: '%',
    status: 'Overvalued',
    history: ndxHistory,
    thresholds: { fair: 15, overvalued: 20, extreme: 30 },
    benchmark: { value: 60, label: 'Dotcom Peak Deviation' }
  };

  // 7. Put/Call Ratio
  // Low value = Greed (Risk), High Value = Fear (Safety)
  // Trend: 0.9 down to 0.55
  const pcHistory = generateTrend(0.95, 0.55, steps, 0.1, 0.2).map((val, i) => ({
    date: getDate(steps - 1 - i),
    value: Math.max(0.3, val)
  }));

  const putCallRatio: MetricData = {
    id: 'put_call',
    name: 'Put/Call Ratio',
    description: 'Ratio of put options to call options volume.',
    currentValue: pcHistory[pcHistory.length - 1].value,
    unit: '',
    status: 'Extreme Bubble',
    history: pcHistory,
    thresholds: { fair: 1.0, overvalued: 0.7, extreme: 0.6 }, // Note: Logic is inverted for calculation
    benchmark: { value: 0.9, label: 'Historical Avg' }
  };

  // 8. IPO Activity
  // Trend: Cyclical, currently high
  const ipoHistory = generateTrend(15, 35, steps, 5, 20).map((val, i) => ({
    date: getDate(steps - 1 - i),
    value: Math.max(0, Math.round(val))
  }));

  const ipoHeat: MetricData = {
    id: 'ipo_heat',
    name: 'IPO Market Activity',
    description: 'Monthly count of new listings and speculative fervor.',
    currentValue: ipoHistory[ipoHistory.length - 1].value,
    unit: 'Deals',
    status: 'Overvalued',
    history: ipoHistory,
    thresholds: { fair: 20, overvalued: 30, extreme: 50 },
    benchmark: { value: 50, label: 'Market Cycle Peak' }
  };

  return [buffettIndicator, shillerPE, dividendYield, marginDebt, fearGreed, ndxDeviation, putCallRatio, ipoHeat];
};

export const translateMetrics = (metrics: MetricData[], lang: Language): MetricData[] => {
  return metrics.map(m => {
    // @ts-ignore - indexing via string id
    const t = translations[lang].metrics[m.id];
    return {
      ...m,
      name: t ? t.name : m.name,
      description: t ? t.desc : m.description,
      benchmark: {
        ...m.benchmark,
        label: t && t.benchmarkLabel ? t.benchmarkLabel : m.benchmark.label
      }
    };
  });
};

export const calculateOverallScore = (metrics: MetricData[]): number => {
  let totalScore = 0;
  
  metrics.forEach(m => {
    let score = 0;
    
    // Inverse Metrics: Lower is riskier (Bubble)
    if (m.id === 'yield' || m.id === 'put_call') {
        if (m.currentValue > m.thresholds.fair) score = 20; // Safe
        else if (m.currentValue < m.thresholds.extreme) score = 95; // Extreme Risk
        else score = 70; // Elevated Risk
    } 
    // Direct Metrics: Higher is riskier (Bubble)
    else {
        if (m.currentValue < m.thresholds.fair) score = 30; // Safe
        else if (m.currentValue > m.thresholds.extreme) score = 95; // Extreme Risk
        else score = 70; // Elevated Risk
    }
    totalScore += score;
  });

  return Math.min(100, Math.round(totalScore / metrics.length));
};