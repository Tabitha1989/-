import React, { useState } from 'react';
import { MetricData, Language } from '../types';
import { analyzeMarket } from '../services/geminiService';
import { translations } from '../translations';

interface AnalysisPanelProps {
  metrics: MetricData[];
  overallScore: number;
  lang: Language;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ metrics, overallScore, lang }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const t = translations[lang];

  const handleAnalysis = async () => {
    setLoading(true);
    // Passing lang to the service so Gemini knows which language to reply in
    const result = await analyzeMarket(metrics, overallScore, lang);
    setAnalysis(result);
    setLoading(false);
  };

  // Clear analysis when language changes so user knows to regenerate in new language
  React.useEffect(() => {
    setAnalysis('');
  }, [lang]);

  // Simple formatter to handle basic markdown headers and newlines for display
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-xl font-bold text-blue-400 mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={i} className="text-lg font-semibold text-blue-300 mt-3 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc text-slate-300 mb-1">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2"></div>;
      }
      // Bold text handling (simple regex for **text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="text-slate-300 leading-relaxed mb-1">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-500/30 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>

      <div className="flex justify-between items-center mb-4 relative z-10 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-blue-400">✦</span> {t.aiTitle}
        </h2>
        <button
          onClick={handleAnalysis}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            loading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {loading ? t.analyzingBtn : analysis ? t.refreshBtn : t.analyzeBtn}
        </button>
      </div>

      <div className="min-h-[150px] text-slate-300 text-sm relative z-10">
        {!analysis && !loading && (
          <div className="flex flex-col items-center justify-center h-full py-8 text-slate-500">
            <p>{t.clickToAnalyze}</p>
          </div>
        )}
        
        {loading && (
           <div className="space-y-3 animate-pulse py-4">
             <div className="h-4 bg-slate-700 rounded w-3/4"></div>
             <div className="h-4 bg-slate-700 rounded w-full"></div>
             <div className="h-4 bg-slate-700 rounded w-5/6"></div>
             <div className="h-4 bg-slate-700 rounded w-2/3"></div>
           </div>
        )}

        {analysis && !loading && (
          <div className="prose prose-invert max-w-none">
            {formatText(analysis)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
