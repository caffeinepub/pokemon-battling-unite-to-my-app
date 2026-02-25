import React from 'react';
import { LocalPokemon } from '../data/pokemonData';

interface PokemonBattleSpriteProps {
  pokemon: LocalPokemon;
  side: 'player' | 'opponent';
  animState: 'idle' | 'attack' | 'hit' | 'faint' | 'dodge';
  position?: { x: number; y: number };
}

export default function PokemonBattleSprite({
  pokemon,
  side,
  animState,
  position,
}: PokemonBattleSpriteProps) {
  const isPlayer = side === 'player';

  const getAnimClass = () => {
    switch (animState) {
      case 'idle': return 'pokemon-idle';
      case 'attack': return 'shake';
      case 'hit': return 'shake';
      case 'faint': return 'opacity-30 grayscale transition-all duration-500';
      case 'dodge': return 'transition-transform duration-200';
      default: return 'pokemon-idle';
    }
  };

  const isImageSprite = pokemon.sprite.startsWith('/');

  return (
    <div
      className={`relative flex flex-col items-center ${getAnimClass()}`}
      style={position ? { transform: `translate(${position.x}px, ${position.y}px)` } : undefined}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-0 w-16 h-3 rounded-full opacity-30 blur-sm"
        style={{ background: '#000' }}
      />

      {/* Pokemon sprite */}
      <div
        className="relative"
        style={{
          transform: isPlayer ? 'scaleX(-1)' : 'scaleX(1)',
          filter: animState === 'hit' ? 'brightness(2) saturate(0)' : 'none',
        }}
      >
        {isImageSprite ? (
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-32 h-32 object-contain drop-shadow-2xl"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div
            className="w-32 h-32 flex items-center justify-center text-7xl drop-shadow-2xl"
            style={{
              filter: `drop-shadow(0 0 8px ${pokemon.color})`,
            }}
          >
            {pokemon.sprite}
          </div>
        )}
      </div>

      {/* Name tag */}
      <div
        className="mt-1 px-2 py-0.5 rounded text-xs font-bold text-white"
        style={{ background: pokemon.color + 'CC' }}
      >
        {pokemon.name}
      </div>
    </div>
  );
}
