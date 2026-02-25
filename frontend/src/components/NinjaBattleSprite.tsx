import React from 'react';

interface SpriteMonster {
  name: string;
  element?: string;
  sprite?: string;
  color?: string;
}

interface NinjaBattleSpriteProps {
  pokemon?: SpriteMonster;
  isPlayer: boolean;
  isAttacking?: boolean;
  isDodging?: boolean;
}

const elementEmoji: Record<string, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  wind: '💨',
  lightning: '⚡',
  dark: '🌑',
};

export default function NinjaBattleSprite({
  pokemon,
  isPlayer,
  isAttacking = false,
  isDodging = false,
}: NinjaBattleSpriteProps) {
  if (!pokemon) return null;

  const sprite = pokemon.sprite || '';
  const color = pokemon.color || '#ef4444';
  const name = pokemon.name || 'Unknown';
  const element = pokemon.element || 'fire';

  const translateX = isAttacking ? (isPlayer ? 20 : -20) : isDodging ? (isPlayer ? -25 : 25) : 0;
  const translateY = isDodging ? -10 : 0;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: '72px',
        height: '72px',
        minWidth: '64px',
        minHeight: '64px',
        transform: `translate(${translateX}px, ${translateY}px)`,
        transition: 'transform 0.3s ease',
        willChange: 'transform',
      }}
    >
      {/* Glow aura */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-md"
        style={{ background: color, willChange: 'opacity' }}
      />

      {/* Sprite or emoji fallback */}
      {sprite ? (
        <img
          src={sprite}
          alt={name}
          className="relative z-10 w-14 h-14 object-contain"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, imageRendering: 'pixelated' }}
          draggable={false}
        />
      ) : (
        <div
          className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-3xl"
          style={{ background: `${color}33`, border: `2px solid ${color}66` }}
        >
          {elementEmoji[element] || '🥷'}
        </div>
      )}

      {/* Element badge */}
      <div
        className="absolute -bottom-1 -right-1 z-20 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
        style={{ background: `${color}22`, borderColor: `${color}88` }}
      >
        {elementEmoji[element] || '🥷'}
      </div>
    </div>
  );
}
