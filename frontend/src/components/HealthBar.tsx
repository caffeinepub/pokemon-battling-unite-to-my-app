import React from 'react';

interface HealthBarProps {
  name: string;
  element: string;
  current: number;
  max: number;
  isDanger?: boolean;
}

const elementColors: Record<string, string> = {
  fire: '#ef4444',
  water: '#3b82f6',
  earth: '#a16207',
  wind: '#10b981',
  lightning: '#eab308',
  shadow: '#8b5cf6',
};

export default function HealthBar({ name, element, current, max, isDanger }: HealthBarProps) {
  const safeCurrent = typeof current === 'number' && !isNaN(current) ? Math.max(0, current) : 0;
  const safeMax = typeof max === 'number' && !isNaN(max) && max > 0 ? max : 1;
  const percentage = Math.min(100, Math.max(0, (safeCurrent / safeMax) * 100));

  const getBarColor = () => {
    if (isDanger) return 'bg-red-600';
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const elementColor = elementColors[element?.toLowerCase()] || '#6b7280';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span
          className="text-sm font-bold tracking-wide"
          style={{ fontFamily: 'Bangers, cursive', color: elementColor, letterSpacing: '0.05em' }}
        >
          {name}
        </span>
        <span className="text-xs text-gray-300 font-mono">
          {safeCurrent}/{safeMax}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()} ${isDanger ? 'danger-health-bar' : ''}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
