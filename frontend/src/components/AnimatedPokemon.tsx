import React from 'react';

interface AnimatedPokemonProps {
  sprite: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'idle' | 'bounce' | 'float' | 'attack' | 'hit' | 'faint';
  isImage?: boolean;
  color?: string;
  className?: string;
  flipped?: boolean;
}

const sizeMap = {
  sm: 'w-16 h-16 text-4xl',
  md: 'w-24 h-24 text-6xl',
  lg: 'w-32 h-32 text-7xl',
  xl: 'w-48 h-48 text-8xl',
};

const animationMap = {
  idle: 'pokemon-idle',
  bounce: 'pokemon-bounce',
  float: 'pokemon-float',
  attack: 'shake',
  hit: 'shake',
  faint: 'opacity-30 grayscale',
};

export default function AnimatedPokemon({
  sprite,
  name,
  size = 'md',
  animation = 'idle',
  isImage = false,
  color = '#FFD700',
  className = '',
  flipped = false,
}: AnimatedPokemonProps) {
  const sizeClass = sizeMap[size];
  const animClass = animationMap[animation];

  return (
    <div
      className={`relative flex items-center justify-center ${sizeClass} ${animClass} ${className}`}
      style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-xl"
        style={{ background: color }}
      />

      {isImage ? (
        <img
          src={sprite}
          alt={name}
          className="relative z-10 w-full h-full object-contain drop-shadow-lg"
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <span className="relative z-10 select-none" style={{ fontSize: 'inherit' }}>
          {sprite}
        </span>
      )}

      {/* Sparkle particles */}
      {animation === 'idle' && (
        <>
          <div
            className="absolute top-0 right-0 text-xs sparkle-anim"
            style={{ animationDelay: '0s', color }}
          >✨</div>
          <div
            className="absolute bottom-1 left-0 text-xs sparkle-anim"
            style={{ animationDelay: '0.7s', color }}
          >⭐</div>
        </>
      )}
    </div>
  );
}
