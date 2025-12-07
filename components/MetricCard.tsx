import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { MetricData, Language } from '../types';
import { translations } from '../translations';

interface MetricCardProps {
  metric: MetricData;
  lang: Language;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, lang }) => {
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const t = translations[lang];

  // Determine color based on status roughly
  let statusColor = 'text-slate-400';
  if (metric.status === 'Fair') statusColor = 'text-green-400';
  if (metric.status === 'Overvalued') statusColor = 'text-orange-400';
  if (metric.status === 'Extreme Bubble') statusColor = 'text-red-500';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-lg text-xs z-50">
          <p className="text-slate-300">{label}</p>
          <p className="text-slate-100 font-bold">
            {payload[0].value} {metric.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm hover:border-slate-600 transition-colors flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-2">
          <h3 className="text-slate-100 font-semibold text-lg">{metric.name}</h3>
          <p className="text-slate-400 text-xs mt-1 overflow-hidden line-clamp-2 min-h-[2.5em]">
            {metric.description}
          </p>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-700 ${statusColor} whitespace-nowrap`}>
          {t.status[metric.status]}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mt-2 mb-2">
        <span className="text-3xl font-bold text-white">{metric.currentValue}</span>
        <span className="text-slate-400 text-sm">{metric.unit}</span>
      </div>

      {/* Comparison Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              className="peer sr-only" 
              checked={showBenchmark} 
              onChange={() => setShowBenchmark(!showBenchmark)}
            />
            <div className="w-8 h-4 bg-slate-700 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform peer-checked:translate-x-4"></div>
          </div>
          <span className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors uppercase tracking-wide">
             {metric.benchmark.label}: <span className="text-slate-200">{metric.benchmark.value}{metric.unit}</span>
          </span>
        </label>
      </div>

      <div className="h-32 w-full mt-auto relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metric.history}>
            <defs>
              <linearGradient id={`color${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="date" 
                hide 
            />
            <YAxis 
                hide 
                domain={['auto', 'auto']} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color${metric.id})`}
            />
            {showBenchmark && (
              <ReferenceLine 
                y={metric.benchmark.value} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                strokeOpacity={0.7}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 flex justify-between text-xs text-slate-500">
        <span>{t.yearsAgo}</span>
        <span>{t.today}</span>
      </div>
    </div>
  );
};

export default MetricCard;