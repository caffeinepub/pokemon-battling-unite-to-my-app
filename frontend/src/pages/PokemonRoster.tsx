import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { STARTER_POKEMON, EVOLUTION_STONES, LocalPokemon } from '../data/pokemonData';
import EvolutionModal from '../components/EvolutionModal';
import { ArrowLeft, Zap } from 'lucide-react';

export default function PokemonRoster() {
  const navigate = useNavigate();
  const [evolutionTarget, setEvolutionTarget] = useState<LocalPokemon | null>(null);
  const [evolutionStone, setEvolutionStone] = useState<string>('');
  const [roster, setRoster] = useState<LocalPokemon[]>(() => {
    try {
      const stored = sessionStorage.getItem('starterPokemon');
      if (stored) {
        const starter = JSON.parse(stored) as LocalPokemon;
        return [starter];
      }
    } catch {
      // fallback
    }
    return [STARTER_POKEMON[0]];
  });

  // Inventory of stones (simulated)
  const [inventory] = useState(() =>
    EVOLUTION_STONES.map((s) => ({ ...s, quantity: Math.floor(Math.random() * 2) + 1 }))
  );

  const handleEvolve = (pokemon: LocalPokemon, stone: string) => {
    setEvolutionTarget(pokemon);
    setEvolutionStone(stone);
  };

  const handleEvolutionConfirm = (evolved: LocalPokemon) => {
    setRoster((prev) => prev.map((p) => (p.id === evolutionTarget?.id ? evolved : p)));
    if (roster.length === 1) {
      sessionStorage.setItem('starterPokemon', JSON.stringify(evolved));
    }
    setEvolutionTarget(null);
    setEvolutionStone('');
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #1A1A2E 100%)' }}
    >
      {evolutionTarget && (
        <EvolutionModal
          pokemon={evolutionTarget}
          stoneName={evolutionStone}
          onConfirm={handleEvolutionConfirm}
          onCancel={() => { setEvolutionTarget(null); setEvolutionStone(''); }}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate({ to: '/game' })}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-anime text-3xl text-electric-yellow tracking-wide">MY POKÉMON</h1>
        </div>

        {/* Pokemon cards */}
        <div className="space-y-4 mb-8">
          {roster.map((pokemon) => {
            const compatibleStones = inventory.filter(
              (s) => s.compatible.includes(pokemon.name) && s.quantity > 0
            );

            return (
              <div key={pokemon.id} className="anime-card p-4">
                <div className="flex items-start gap-4">
                  {/* Sprite */}
                  <div className="pokemon-idle shrink-0">
                    {pokemon.sprite.startsWith('/') ? (
                      <img
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        className="w-24 h-24 object-contain"
                        style={{ filter: `drop-shadow(0 0 8px ${pokemon.color})` }}
                      />
                    ) : (
                      <div
                        className="w-24 h-24 flex items-center justify-center text-6xl"
                        style={{ filter: `drop-shadow(0 0 8px ${pokemon.color})` }}
                      >
                        {pokemon.sprite}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-anime text-2xl text-white">{pokemon.name}</h2>
                      <span className="text-white/50 text-sm">Lv.{pokemon.level}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {pokemon.type.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full text-white font-bold"
                          style={{ background: pokemon.color + '88' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: 'ATK', value: pokemon.attack, color: '#ef4444' },
                        { label: 'DEF', value: pokemon.defense, color: '#3b82f6' },
                        { label: 'SPD', value: pokemon.speed, color: '#22c55e' },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white/5 rounded-lg p-2 text-center">
                          <div className="text-white/50 text-xs">{stat.label}</div>
                          <div className="font-bold text-lg" style={{ color: stat.color }}>
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/50 text-xs">{pokemon.description}</p>
                  </div>
                </div>

                {/* Moves */}
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p className="text-white/40 text-xs font-bold mb-2">MOVES</p>
                  <div className="grid grid-cols-2 gap-2">
                    {pokemon.moves.map((move) => (
                      <div
                        key={move.name}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg border"
                        style={{ background: move.color + '11', borderColor: move.color + '44' }}
                      >
                        <span>{move.emoji}</span>
                        <div>
                          <div className="text-white text-xs font-bold">{move.name}</div>
                          <div className="text-white/40 text-xs">PWR {move.power}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evolution */}
                {compatibleStones.length > 0 && pokemon.evolvesTo && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-white/40 text-xs font-bold mb-2">EVOLUTION AVAILABLE</p>
                    <div className="flex gap-2 flex-wrap">
                      {compatibleStones.map((stone) => (
                        <button
                          key={stone.id}
                          onClick={() => handleEvolve(pokemon, stone.name)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-purple-500/50 bg-purple-500/10 text-white text-sm font-bold hover:bg-purple-500/20 transition-colors"
                        >
                          <span>{stone.emoji}</span>
                          <span>{stone.name}</span>
                          <span className="text-purple-400">→ {pokemon.evolvesTo}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Battle button */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => navigate({ to: '/battle', search: { opponentId: '0', bgType: 'forest' } })}
                    className="flex items-center gap-2 bg-pikachu-red/80 hover:bg-pikachu-red text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    BATTLE
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Evolution Stones Inventory */}
        <div className="anime-card p-4">
          <h3 className="text-electric-yellow font-anime text-xl mb-3">🪨 EVOLUTION STONES</h3>
          <div className="grid grid-cols-3 gap-3">
            {inventory.map((stone) => (
              <div
                key={stone.id}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                  stone.quantity > 0
                    ? 'border-white/20 bg-white/5'
                    : 'border-white/5 opacity-40'
                }`}
              >
                <span className="text-3xl mb-1">{stone.emoji}</span>
                <span className="text-white text-xs font-bold text-center leading-tight">
                  {stone.name}
                </span>
                <span
                  className="text-xs font-bold mt-1"
                  style={{ color: stone.quantity > 0 ? stone.color : '#666' }}
                >
                  x{stone.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <img
              src="/assets/generated/evolution-stones.dim_512x128.png"
              alt="Evolution Stones"
              className="w-full h-16 object-contain opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
