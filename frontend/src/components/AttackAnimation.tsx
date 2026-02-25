import React from 'react';
import { ElementType, ELEMENT_COLORS } from '../data/monsterData';

interface AttackAnimationProps {
  element: ElementType;
  fromPlayer: boolean;
}

const ELEMENT_EMOJIS: Record<ElementType, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  wind: '💨',
  lightning: '⚡',
  shadow: '🌑',
};

export default function AttackAnimation({ element, fromPlayer }: AttackAnimationProps) {
  const color = ELEMENT_COLORS[element];
  const emoji = ELEMENT_EMOJIS[element];

  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
      style={{
        animation: fromPlayer
          ? 'dashAttack 0.4s ease-in-out'
          : 'dashAttack 0.4s ease-in-out reverse',
      }}
    >
      <div className="relative">
        <span
          className="text-4xl md:text-5xl"
          style={{
            filter: `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 24px ${color})`,
            animation: 'evolutionPulse 0.3s ease-in-out infinite',
          }}
        >
          {emoji}
        </span>
        {/* Impact rings */}
        <div
          className="absolute inset-0 rounded-full border-2 energy-ring"
          style={{ borderColor: color }}
        />
        <div
          className="absolute inset-0 rounded-full border-2 energy-ring"
          style={{ borderColor: color, animationDelay: '0.2s' }}
        />
      </div>
    </div>
  );
}
