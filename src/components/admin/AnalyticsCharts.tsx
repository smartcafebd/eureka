import React from 'react';

// Modern, lightweight interactive chart components without external heavy dependencies
export const BarChartSimple: React.FC<{
  data: { label: string; value: number; color?: string; secondaryValue?: number }[];
  height?: number;
  currency?: boolean;
}> = ({ data, height = 180, currency = true }) => {
  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0)), 1);

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 sm:gap-3 w-full" style={{ height }}>
        {data.map((item, idx) => {
          const heightPct = Math.round((item.value / maxValue) * 100);
          const secHeightPct = item.secondaryValue ? Math.round((item.secondaryValue / maxValue) * 100) : 0;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-gray-900 text-white text-[11px] rounded px-2 py-1 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                <span className="font-semibold">{item.label}:</span>{' '}
                {currency ? `৳${item.value.toLocaleString()}` : item.value}
                {item.secondaryValue !== undefined && (
                  <span className="block text-amber-300">
                    Cost: {currency ? `৳${item.secondaryValue.toLocaleString()}` : item.secondaryValue}
                  </span>
                )}
              </div>

              {/* Bars */}
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div
                  className={`w-full max-w-[28px] rounded-t transition-all duration-500 ${
                    item.color || 'bg-amber-600 group-hover:bg-amber-500'
                  }`}
                  style={{ height: `${Math.max(4, heightPct)}%` }}
                />
                {item.secondaryValue !== undefined && (
                  <div
                    className="w-full max-w-[28px] rounded-t bg-stone-300 group-hover:bg-stone-400 transition-all duration-500"
                    style={{ height: `${Math.max(4, secHeightPct)}%` }}
                  />
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center group-hover:text-gray-900 font-medium">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DonutProgress: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#d97706',
  label,
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold text-gray-900">{label || `${Math.round(percentage)}%`}</span>
        {sublabel && <span className="text-[10px] text-gray-500 uppercase tracking-wider">{sublabel}</span>}
      </div>
    </div>
  );
};

export const MiniSparkline: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#16a34a' }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};
