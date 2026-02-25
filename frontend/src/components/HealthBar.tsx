import React from 'react';
import { ELEMENT_COLORS, ElementType } from '../data/monsterData';

interface HealthBarProps {
  name: string;
  current: number;
  max: number;
  element: ElementType;
  isEnemy?: boolean;
}

export default function HealthBar({ name, current, max, element, isEnemy = false }: HealthBarProps) {
  const safeMax = max > 0 ? max : 1;
  const safeCurrent = Math.max(0, Math.min(current, safeMax));
  const pct = (safeCurrent / safeMax) * 100;
  const color = ELEMENT_COLORS[element];

  const barColor = pct > 50 ? color : pct > 25 ? '#f1c40f' : '#ff4757';

  return (
    <div className="rounded-lg border border-white/20 p-2.5 min-w-[160px]"
      style={{ background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-white font-semibold text-sm truncate max-w-[100px]">{name}</span>
        {isEnemy && (
          <span className="text-xs px-1.5 py-0.5 rounded font-bold uppercase"
            style={{ background: `${color}30`, color }}>
            {element.slice(0, 3)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}80` }}
          />
        </div>
        <span className="text-xs text-white/60 shrink-0 font-mono">
          {safeCurrent}/{safeMax}
        </span>
      </div>
    </div>
  );
}
