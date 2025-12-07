import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Language } from '../types';
import { translations } from '../translations';

interface GaugeProps {
  score: number; // 0 to 100
  lang: Language;
}

const Gauge: React.FC<GaugeProps> = ({ score, lang }) => {
  const t = translations[lang];

  // Create data for the semi-circle gauge
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  // Color interpolation based on score
  let color = '#22c55e'; // Green
  let text = t.status['Undervalued'];
  
  if (score > 40) { color = '#eab308'; text = t.status['Fair']; } // Yellow
  if (score > 60) { color = '#f97316'; text = t.status['Overvalued']; } // Orange
  if (score > 80) { color = '#ef4444'; text = t.status['Extreme Bubble']; } // Red

  const cx = "50%";
  const cy = "100%";
  // Needle angle calculation
  const angle = 180 - (score / 100) * 180;

  return (
    <div className="relative flex flex-col items-center justify-center h-48 w-full">
        <div className="w-full h-full max-w-[300px] aspect-[2/1] overflow-hidden relative">
             <ResponsiveContainer width="100%" height="200%">
                <PieChart>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={data}
                        cx={cx}
                        cy={cy}
                        innerRadius="60%"
                        outerRadius="100%"
                        stroke="none"
                    >
                        <Cell fill={color} />
                        <Cell fill="#334155" /> 
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            {/* Needle */}
            <div 
                className="absolute bottom-0 left-1/2 w-full h-full origin-bottom transform -translate-x-1/2 transition-transform duration-1000 ease-out z-10"
                style={{ 
                    transform: `rotate(${angle}deg) translateX(-50%)`,
                    transformOrigin: 'bottom center',
                    width: '4px',
                    height: '50%', // length of needle relative to container
                    background: 'none',
                    position: 'absolute'
                }}
            >
                {/* The visual needle part */}
                <div className="w-[4px] h-[100%] bg-slate-200 absolute bottom-0 left-[-2px] origin-bottom" style={{ height: '95%'}}></div>
            </div>
             {/* Center pivot */}
             <div className="absolute bottom-[-10px] left-1/2 w-4 h-4 bg-slate-200 rounded-full transform -translate-x-1/2 z-20"></div>
        </div>
        
        <div className="mt-4 text-center">
            <div className="text-4xl font-bold text-slate-100">{score}</div>
            <div className="text-sm font-semibold tracking-wider uppercase" style={{ color }}>{text}</div>
        </div>
    </div>
  );
};

export default Gauge;
