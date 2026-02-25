import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useGetBadges, useGetBattleLog } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import BadgeDisplay from '../components/BadgeDisplay';
import { PIKACHU, GYM_LEADERS } from '../data/pokemonData';
import { ArrowLeft, Trophy, Zap, Star } from 'lucide-react';

export default function TrainerProfile() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: badges = [] } = useGetBadges();
  const { data: battleLog = [] } = useGetBattleLog();

  const trainerName = profile?.trainerName || 'Ash';
  const starterPokemon = (() => {
    try {
      const s = sessionStorage.getItem('starterPokemon');
      return s ? JSON.parse(s) : PIKACHU;
    } catch {
      return PIKACHU;
    }
  })();

  const wins = battleLog.filter((_, i) => i % 2 === 0).length;
  const totalBattles = battleLog.length;

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #1A1A2E 100%)' }}
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate({ to: '/game' })}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-anime text-3xl text-electric-yellow tracking-wide">TRAINER CARD</h1>
        </div>

        {/* Trainer card */}
        <div
          className="rounded-2xl overflow-hidden border-2 border-electric-yellow/30 mb-6"
          style={{
            background: 'linear-gradient(135deg, #1a2744 0%, #0d1b2a 100%)',
            boxShadow: '0 0 30px rgba(255,215,0,0.15)',
          }}
        >
          {/* Card header */}
          <div className="bg-gradient-to-r from-electric-yellow/20 to-transparent px-6 py-4 flex items-center gap-4">
            <img
              src="/assets/generated/ash-trainer.dim_300x400.png"
              alt="Ash"
              className="w-20 h-28 object-contain drop-shadow-xl"
            />
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Pokémon Trainer</p>
              <h2 className="font-anime text-4xl text-electric-yellow tracking-wide">{trainerName}</h2>
              {identity && (
                <p className="text-white/30 text-xs mt-1 font-mono">
                  {identity.getPrincipal().toString().slice(0, 20)}...
                </p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
            <div className="p-4 text-center">
              <div className="text-electric-yellow font-anime text-2xl">{badges.length}</div>
              <div className="text-white/50 text-xs font-bold">BADGES</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-green-400 font-anime text-2xl">{wins}</div>
              <div className="text-white/50 text-xs font-bold">WINS</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-white font-anime text-2xl">{totalBattles}</div>
              <div className="text-white/50 text-xs font-bold">BATTLES</div>
            </div>
          </div>
        </div>

        {/* Partner Pokemon */}
        <div className="anime-card p-4 mb-4 flex items-center gap-4">
          <div className="pokemon-idle">
            {starterPokemon.sprite?.startsWith('/') ? (
              <img
                src={starterPokemon.sprite}
                alt={starterPokemon.name}
                className="w-20 h-20 object-contain"
                style={{ filter: `drop-shadow(0 0 10px ${starterPokemon.color || '#FFD700'})` }}
              />
            ) : (
              <div className="text-5xl w-20 h-20 flex items-center justify-center">
                {starterPokemon.sprite}
              </div>
            )}
          </div>
          <div>
            <p className="text-white/50 text-xs font-bold">PARTNER POKÉMON</p>
            <h3 className="font-anime text-2xl text-white">{starterPokemon.name}</h3>
            <div className="flex gap-3 mt-1">
              <span className="text-xs text-white/60">ATK <strong className="text-red-400">{starterPokemon.attack}</strong></span>
              <span className="text-xs text-white/60">DEF <strong className="text-blue-400">{starterPokemon.defense}</strong></span>
              <span className="text-xs text-white/60">SPD <strong className="text-green-400">{starterPokemon.speed}</strong></span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-4">
          <BadgeDisplay />
        </div>

        {/* Badge panel image */}
        <div className="anime-card p-3 mb-4">
          <img
            src="/assets/generated/badges-panel.dim_512x128.png"
            alt="Badges"
            className="w-full h-16 object-contain"
          />
        </div>

        {/* Battle history */}
        {battleLog.length > 0 && (
          <div className="anime-card p-4">
            <h3 className="text-electric-yellow font-anime text-xl mb-3">⚔️ BATTLE HISTORY</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {battleLog.slice(0, 20).map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2"
                >
                  <span className="text-white/40 text-xs font-mono">#{i + 1}</span>
                  <span className="text-white/70 text-sm flex-1">{log}</span>
                  <span className={`text-xs font-bold ${i % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {i % 2 === 0 ? 'WIN' : 'LOSS'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="anime-card p-4 mt-4">
          <h3 className="text-electric-yellow font-anime text-xl mb-3">🏆 ACHIEVEMENTS</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Zap className="w-5 h-5" />, label: 'First Battle', earned: totalBattles > 0, color: '#FFD700' },
              { icon: <Trophy className="w-5 h-5" />, label: 'First Win', earned: wins > 0, color: '#FFD700' },
              { icon: <Star className="w-5 h-5" />, label: 'Badge Collector', earned: badges.length >= 4, color: '#FFD700' },
              { icon: <Trophy className="w-5 h-5" />, label: 'Gym Champion', earned: badges.length >= 8, color: '#FFD700' },
            ].map((ach) => (
              <div
                key={ach.label}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  ach.earned
                    ? 'border-yellow-400/50 bg-yellow-400/10'
                    : 'border-white/10 bg-white/5 opacity-40 grayscale'
                }`}
              >
                <div style={{ color: ach.earned ? ach.color : '#666' }}>{ach.icon}</div>
                <span className="text-white text-sm font-bold">{ach.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
