import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  name: string;
  level: number;
  side: 'player' | 'opponent';
}

export default function HealthBar({ current, max, name, level, side }: HealthBarProps) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const barClass = pct > 50 ? 'hp-bar-green' : pct > 20 ? 'hp-bar-yellow' : 'hp-bar-red';

  return (
    <div
      className={`bg-black/70 border-2 border-white/20 rounded-xl p-3 min-w-[200px] ${
        side === 'player' ? 'text-left' : 'text-right'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-anime text-white text-lg tracking-wide">{name}</span>
        <span className="text-white/70 text-xs font-bold">Lv.{level}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/70 text-xs font-bold">HP</span>
        <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden border border-white/20">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="text-white/60 text-xs mt-1 font-bold">
        {current}/{max}
      </div>
    </div>
  );
}
