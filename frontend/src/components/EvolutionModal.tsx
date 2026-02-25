import React, { useState } from 'react';
import { LocalPokemon, EVOLUTION_STONES } from '../data/pokemonData';
import { useEvolvePokemon } from '../hooks/useQueries';

interface EvolutionModalProps {
  pokemon: LocalPokemon;
  stoneName: string;
  onConfirm: (evolved: LocalPokemon) => void;
  onCancel: () => void;
}

export default function EvolutionModal({ pokemon, stoneName, onConfirm, onCancel }: EvolutionModalProps) {
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionComplete, setEvolutionComplete] = useState(false);
  const evolveMutation = useEvolvePokemon();

  const stone = EVOLUTION_STONES.find((s) => s.name === stoneName);

  const evolvedPokemon: LocalPokemon = {
    ...pokemon,
    name: pokemon.evolvesTo || pokemon.name + ' (Evolved)',
    attack: Math.floor(pokemon.attack * 1.3),
    defense: Math.floor(pokemon.defense * 1.3),
    speed: Math.floor(pokemon.speed * 1.2),
    hp: Math.floor(pokemon.hp * 1.2),
    maxHp: Math.floor(pokemon.maxHp * 1.2),
    level: pokemon.level + 10,
  };

  const handleConfirm = async () => {
    setIsEvolving(true);
    try {
      await evolveMutation.mutateAsync();
    } catch {
      // Continue with local evolution
    }
    setTimeout(() => {
      setEvolutionComplete(true);
      setTimeout(() => onConfirm(evolvedPokemon), 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="max-w-sm w-full mx-4 bg-gradient-to-b from-purple-900 to-black border-2 border-purple-500 rounded-2xl overflow-hidden">
        <div className="bg-purple-700 px-4 py-3 text-center">
          <h2 className="text-white font-anime text-2xl tracking-wide">EVOLUTION!</h2>
        </div>

        <div className="p-6">
          {!isEvolving ? (
            <>
              <div className="flex items-center justify-around mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-2 pokemon-idle">{pokemon.sprite}</div>
                  <p className="text-white font-bold">{pokemon.name}</p>
                  <p className="text-white/60 text-xs">ATK: {pokemon.attack}</p>
                  <p className="text-white/60 text-xs">DEF: {pokemon.defense}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">{stone?.emoji || '💎'}</div>
                  <div className="text-white text-2xl">→</div>
                  <p className="text-white/60 text-xs">{stoneName}</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-2 pokemon-float">{pokemon.sprite}</div>
                  <p className="text-white font-bold">{evolvedPokemon.name}</p>
                  <p className="text-green-400 text-xs">ATK: {evolvedPokemon.attack} ↑</p>
                  <p className="text-green-400 text-xs">DEF: {evolvedPokemon.defense} ↑</p>
                </div>
              </div>

              <p className="text-white/80 text-sm text-center mb-6">
                Use <span className="text-yellow-400 font-bold">{stoneName}</span> to evolve{' '}
                <span className="font-bold" style={{ color: pokemon.color }}>{pokemon.name}</span>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-anime text-lg py-3 rounded-xl transition-colors"
                >
                  ✨ EVOLVE!
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-anime text-lg py-3 rounded-xl transition-colors"
                >
                  NOT NOW
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div
                className={`text-8xl mb-4 ${evolutionComplete ? 'pokemon-bounce' : 'evolution-glow'}`}
              >
                {evolutionComplete ? pokemon.sprite : '✨'}
              </div>
              <p className="text-white font-anime text-xl">
                {evolutionComplete
                  ? `${evolvedPokemon.name} is ready!`
                  : `${pokemon.name} is evolving...`}
              </p>
              {!evolutionComplete && (
                <div className="mt-4 flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
