import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetBadges, useSaveCallerUserProfile } from '../hooks/useQueries';
import { OPPONENT_POKEMON, GYM_LEADERS, PIKACHU } from '../data/pokemonData';
import TeamRocketEncounter from '../components/TeamRocketEncounter';
import { Sword, Map, Star, Zap, Shield } from 'lucide-react';

export default function GameHome() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: badges = [] } = useGetBadges();
  const saveProfile = useSaveCallerUserProfile();

  const [showRocket, setShowRocket] = useState(false);
  const [showNameSetup, setShowNameSetup] = useState(false);
  const [nameInput, setNameInput] = useState('Ash');

  const isAuthenticated = !!identity;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  // Show profile setup if needed
  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && profile === null) {
      setShowNameSetup(true);
    }
  }, [isAuthenticated, profileLoading, isFetched, profile]);

  // Random Team Rocket encounter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() < 0.15) {
        setShowRocket(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveProfile = async () => {
    await saveProfile.mutateAsync({ trainerName: nameInput || 'Ash' });
    setShowNameSetup(false);
  };

  const handleQuickBattle = () => {
    const idx = Math.floor(Math.random() * OPPONENT_POKEMON.length);
    navigate({ to: '/battle', search: { opponentId: String(idx), bgType: 'forest' } });
  };

  const trainerName = profile?.trainerName || 'Ash';
  const starterPokemon = (() => {
    try {
      const s = sessionStorage.getItem('starterPokemon');
      return s ? JSON.parse(s) : PIKACHU;
    } catch {
      return PIKACHU;
    }
  })();

  if (!isAuthenticated) return null;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #1A1A2E 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-5 bg-electric-yellow blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-5 bg-electric-blue blur-3xl" />
      </div>

      {/* Profile setup modal */}
      {showNameSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="max-w-sm w-full mx-4 bg-gradient-to-b from-gray-900 to-black border-2 border-electric-yellow rounded-2xl p-6">
            <div className="text-center mb-6">
              <img
                src="/assets/generated/professor-oak.dim_300x400.png"
                alt="Professor Oak"
                className="w-24 h-32 object-contain mx-auto mb-3 pokemon-idle"
              />
              <h2 className="text-electric-yellow font-anime text-2xl">WELCOME, TRAINER!</h2>
              <p className="text-white/70 text-sm mt-2">
                Your trainer name is set to <strong className="text-electric-yellow">Ash</strong>!
              </p>
            </div>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Trainer name"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center font-bold text-lg mb-4 focus:outline-none focus:border-electric-yellow"
            />
            <button
              onClick={handleSaveProfile}
              disabled={saveProfile.isPending}
              className="w-full bg-electric-yellow text-dark-navy font-anime text-xl py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-60 anime-btn"
            >
              {saveProfile.isPending ? 'Saving...' : "LET'S GO!"}
            </button>
          </div>
        </div>
      )}

      {/* Team Rocket encounter */}
      {showRocket && (
        <TeamRocketEncounter
          onBattle={() => {
            setShowRocket(false);
            navigate({ to: '/battle', search: { opponentId: '2', bgType: 'forest' } });
          }}
          onFlee={() => setShowRocket(false)}
        />
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Trainer header */}
        <div className="flex items-center gap-4 mb-6 fade-in-up">
          <div className="relative">
            <img
              src="/assets/generated/ash-trainer.dim_300x400.png"
              alt="Ash"
              className="w-20 h-28 object-contain drop-shadow-xl"
            />
          </div>
          <div>
            <p className="text-white/60 text-sm font-bold">TRAINER</p>
            <h1 className="text-electric-yellow font-anime text-3xl tracking-wide">{trainerName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(badges.length, 8) }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-electric-yellow border border-yellow-600 text-xs flex items-center justify-center">
                    🏅
                  </div>
                ))}
              </div>
              <span className="text-white/50 text-xs">{badges.length}/8 badges</span>
            </div>
          </div>
        </div>

        {/* Partner Pokemon */}
        <div className="anime-card p-4 mb-4 flex items-center gap-4 fade-in-up">
          <div className="pokemon-idle">
            {starterPokemon.sprite?.startsWith('/') ? (
              <img
                src={starterPokemon.sprite}
                alt={starterPokemon.name}
                className="w-20 h-20 object-contain"
                style={{ filter: `drop-shadow(0 0 8px ${starterPokemon.color || '#FFD700'})` }}
              />
            ) : (
              <div className="text-5xl w-20 h-20 flex items-center justify-center">
                {starterPokemon.sprite}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white/50 text-xs font-bold">PARTNER</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white font-bold"
                style={{ background: (starterPokemon.color || '#FFD700') + '88' }}
              >
                {starterPokemon.type?.[0] || 'Electric'}
              </span>
            </div>
            <h2 className="font-anime text-2xl text-white">{starterPokemon.name}</h2>
            <div className="flex gap-3 mt-1">
              <span className="text-xs text-white/60">ATK <strong className="text-white">{starterPokemon.attack}</strong></span>
              <span className="text-xs text-white/60">DEF <strong className="text-white">{starterPokemon.defense}</strong></span>
              <span className="text-xs text-white/60">SPD <strong className="text-white">{starterPokemon.speed}</strong></span>
            </div>
          </div>
          <button
            onClick={handleQuickBattle}
            className="bg-pikachu-red text-white font-anime text-lg px-4 py-3 rounded-xl hover:bg-red-500 transition-colors anime-btn flex items-center gap-2"
          >
            <Sword className="w-4 h-4" />
            BATTLE!
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => navigate({ to: '/story' })}
            className="anime-card p-4 flex flex-col items-center gap-2 hover:border-electric-yellow/60 transition-all hover:scale-105 active:scale-95"
          >
            <Map className="w-8 h-8 text-electric-blue" />
            <span className="font-anime text-white text-lg">STORY</span>
            <span className="text-white/50 text-xs text-center">Follow Ash's journey</span>
          </button>

          <button
            onClick={() => navigate({ to: '/gyms' })}
            className="anime-card p-4 flex flex-col items-center gap-2 hover:border-electric-yellow/60 transition-all hover:scale-105 active:scale-95"
          >
            <Shield className="w-8 h-8 text-anime-orange" />
            <span className="font-anime text-white text-lg">GYM BATTLES</span>
            <span className="text-white/50 text-xs text-center">Earn badges</span>
          </button>

          <button
            onClick={() => navigate({ to: '/roster' })}
            className="anime-card p-4 flex flex-col items-center gap-2 hover:border-electric-yellow/60 transition-all hover:scale-105 active:scale-95"
          >
            <Star className="w-8 h-8 text-anime-purple" />
            <span className="font-anime text-white text-lg">ROSTER</span>
            <span className="text-white/50 text-xs text-center">Manage Pokémon</span>
          </button>

          <button
            onClick={() => navigate({ to: '/profile' })}
            className="anime-card p-4 flex flex-col items-center gap-2 hover:border-electric-yellow/60 transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-8 h-8 text-electric-yellow" />
            <span className="font-anime text-white text-lg">PROFILE</span>
            <span className="text-white/50 text-xs text-center">View achievements</span>
          </button>
        </div>

        {/* Recent battles hint */}
        <div className="anime-card p-4 fade-in-up">
          <h3 className="text-electric-yellow font-anime text-lg mb-3">⚡ QUICK BATTLE</h3>
          <div className="grid grid-cols-3 gap-2">
            {OPPONENT_POKEMON.slice(0, 6).map((p, i) => (
              <button
                key={p.id}
                onClick={() => navigate({ to: '/battle', search: { opponentId: String(i), bgType: 'forest' } })}
                className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center gap-1 hover:border-white/30 hover:bg-white/10 transition-all active:scale-95"
              >
                <span className="text-2xl">{p.sprite}</span>
                <span className="text-white/70 text-xs font-bold">{p.name}</span>
                <span className="text-white/40 text-xs">Lv.{p.level}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
