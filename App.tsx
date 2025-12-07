import React, { useEffect, useState } from 'react';
import MetricCard from './components/MetricCard';
import Gauge from './components/Gauge';
import AnalysisPanel from './components/AnalysisPanel';
import { getMarketMetrics, calculateOverallScore, translateMetrics } from './services/dataService';
import { MetricData, Language } from './types';
import { translations } from './translations';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [rawData, setRawData] = useState<MetricData[]>([]);
  const [displayMetrics, setDisplayMetrics] = useState<MetricData[]>([]);
  const [score, setScore] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const t = translations[lang];

  useEffect(() => {
    // Simulate fetching data (generated once on mount)
    const data = getMarketMetrics();
    setRawData(data);
    setScore(calculateOverallScore(data));
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    if (rawData.length > 0) {
      setDisplayMetrics(translateMetrics(rawData, lang));
    }
  }, [lang, rawData]);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const formattedDate = lastUpdated.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
               B
             </div>
             <div className="flex flex-col">
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                  {t.appTitle}<span className="text-blue-500">{t.appTitleSuffix}</span>
                </h1>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 sm:hidden">
                   {formattedDate.split(' ')[0]}
                </span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Desktop Timestamp */}
             <div className="hidden sm:flex flex-col items-end text-xs text-slate-400">
                <span className="font-mono text-blue-400 opacity-90">{t.lastUpdated}: {formattedDate}</span>
                <span className="text-[10px] opacity-60">{t.dataInfo}</span>
             </div>

             <button 
                onClick={toggleLang}
                className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors border border-slate-600"
             >
                {lang === 'en' ? '中文' : 'English'}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Section: Gauge & AI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Gauge Card */}
          <div className="lg:col-span-1 bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            <h2 className="text-slate-100 font-semibold mb-4 text-center z-10">{t.riskScoreTitle}</h2>
            <div className="z-10">
                <Gauge score={score} lang={lang} />
            </div>
            <p className="text-center text-xs text-slate-500 mt-2 z-10">
              {t.riskScoreDesc}
            </p>
          </div>

          {/* AI Analysis Panel */}
          <div className="lg:col-span-2">
             <AnalysisPanel metrics={displayMetrics} overallScore={score} lang={lang} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-white">{t.keyIndicators}</h2>
            {/* Mobile-only subtle timestamp hint for grid */}
            <span className="text-[10px] text-slate-600 font-mono sm:hidden">
               {formattedDate}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} lang={lang} />
            ))}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="border-t border-slate-800 pt-8 mt-12 text-center text-slate-600 text-sm">
          <p>
            <strong>{t.disclaimerTitle}</strong> {t.disclaimerText}
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;