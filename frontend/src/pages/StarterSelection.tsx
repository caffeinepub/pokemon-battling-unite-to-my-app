import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { STARTER_POKEMON, LocalPokemon } from '../data/pokemonData';
import AnimatedPokemon from '../components/AnimatedPokemon';

export default function StarterSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<LocalPokemon | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (pokemon: LocalPokemon) => {
    setSelected(pokemon);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    // Store selected pokemon in sessionStorage
    sessionStorage.setItem('starterPokemon', JSON.stringify(selected));
    setTimeout(() => {
      navigate({ to: '/game' });
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1A1A2E 50%, #16213E 100%)',
      }}
    >
      {/* Background sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 16 + 8}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {confirmed ? (
        <div className="text-center fade-in-up z-10">
          <div className="text-8xl mb-6 pokemon-bounce">
            {selected?.sprite.startsWith('/') ? (
              <img src={selected.sprite} alt={selected.name} className="w-32 h-32 mx-auto object-contain" />
            ) : (
              selected?.sprite
            )}
          </div>
          <p className="text-electric-yellow font-anime text-4xl mb-2 tracking-wide">
            {selected?.name} chose you!
          </p>
          <p className="text-white text-xl">Get ready for adventure, Ash!</p>
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-electric-yellow rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-8 z-10 fade-in-up">
            <h1 className="text-electric-yellow font-anime text-4xl md:text-5xl tracking-wide mb-2">
              CHOOSE YOUR PARTNER!
            </h1>
            <p className="text-white/70 text-lg">
              Which Pokémon will join Ash on his journey?
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 z-10 max-w-4xl w-full">
            {STARTER_POKEMON.map((pokemon) => {
              const isSelected = selected?.id === pokemon.id;
              const isPikachu = pokemon.id === 25;

              return (
                <button
                  key={pokemon.id}
                  onClick={() => handleSelect(pokemon)}
                  className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isSelected
                      ? 'border-electric-yellow bg-electric-yellow/20 shadow-electric'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  {isPikachu && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                      ⭐ BEST
                    </div>
                  )}

                  <AnimatedPokemon
                    sprite={pokemon.sprite.startsWith('/') ? pokemon.sprite : pokemon.sprite}
                    name={pokemon.name}
                    size="lg"
                    animation={isSelected ? 'bounce' : 'idle'}
                    isImage={pokemon.sprite.startsWith('/')}
                    color={pokemon.color}
                  />

                  <h3
                    className="font-anime text-xl mt-2 tracking-wide"
                    style={{ color: pokemon.color }}
                  >
                    {pokemon.name}
                  </h3>

                  <div className="flex gap-1 mt-1">
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

                  <div className="mt-2 grid grid-cols-3 gap-1 w-full text-center">
                    <div>
                      <div className="text-white/50 text-xs">ATK</div>
                      <div className="text-white font-bold text-sm">{pokemon.attack}</div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">DEF</div>
                      <div className="text-white font-bold text-sm">{pokemon.defense}</div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">SPD</div>
                      <div className="text-white font-bold text-sm">{pokemon.speed}</div>
                    </div>
                  </div>

                  {isPikachu && (
                    <div className="mt-2 text-xs text-electric-yellow font-bold text-center">
                      ⚡ STRONGEST STARTER!
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-8 z-10 fade-in-up text-center">
              <p className="text-white/70 mb-4">
                You chose{' '}
                <span className="font-bold" style={{ color: selected.color }}>
                  {selected.name}
                </span>
                !
              </p>
              <button
                onClick={handleConfirm}
                className="bg-electric-yellow text-dark-navy font-anime text-2xl px-10 py-4 rounded-2xl hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-electric anime-btn"
              >
                ⚡ I CHOOSE YOU!
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
