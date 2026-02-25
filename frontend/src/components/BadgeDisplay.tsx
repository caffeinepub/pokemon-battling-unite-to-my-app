import React from 'react';
import { ELEMENT_COLORS, ElementType } from '../data/monsterData';

interface DojoInfo {
  id: string;
  name: string;
  element: ElementType;
  sealName: string;
}

interface BadgeDisplayProps {
  earnedCount: number;
  dojos: DojoInfo[];
}

const ELEMENT_EMOJIS: Record<ElementType, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  wind: '💨',
  lightning: '⚡',
  shadow: '🌑',
};

export default function BadgeDisplay({ earnedCount, dojos }: BadgeDisplayProps) {
  return (
    <div className="rounded-xl border border-white/10 p-4"
      style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bangers text-xl text-white tracking-wide">DOJO SEALS</h3>
        <span className="text-white/40 text-sm font-semibold">{earnedCount} / {dojos.length}</span>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {dojos.map((dojo, idx) => {
          const earned = idx < earnedCount;
          const color = ELEMENT_COLORS[dojo.element];
          return (
            <div
              key={dojo.id}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                earned ? '' : 'opacity-30 grayscale'
              }`}
              style={{
                borderColor: earned ? `${color}50` : 'rgba(255,255,255,0.1)',
                background: earned ? `${color}15` : 'rgba(255,255,255,0.03)',
                boxShadow: earned ? `0 0 10px ${color}30` : 'none',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all"
                style={{
                  borderColor: earned ? color : '#444',
                  background: earned ? `${color}25` : '#222',
                }}
              >
                {earned ? ELEMENT_EMOJIS[dojo.element] : '⭕'}
              </div>
              <span className="text-xs text-center leading-tight font-semibold"
                style={{ color: earned ? color : 'rgba(255,255,255,0.3)' }}>
                {dojo.sealName.replace(' Seal', '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
