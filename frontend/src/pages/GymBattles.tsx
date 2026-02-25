import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GYM_LEADERS } from '../data/pokemonData';
import { useGetBadges, useChallengeGymLeader } from '../hooks/useQueries';
import BadgeDisplay from '../components/BadgeDisplay';
import { ArrowLeft, Skull, ChevronRight } from 'lucide-react';

export default function GymBattles() {
  const navigate = useNavigate();
  const { data: badges = [] } = useGetBadges();
  const challengeGym = useChallengeGymLeader();
  const [selectedGym, setSelectedGym] = useState<(typeof GYM_LEADERS)[0] | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);

  const handleChallenge = async (gym: (typeof GYM_LEADERS)[0]) => {
    setSelectedGym(gym);
    setShowChallenge(true);
  };

  const handleBattle = async () => {
    if (!selectedGym) return;
    try {
      await challengeGym.mutateAsync();
    } catch {
      // Continue regardless
    }
    setShowChallenge(false);
    navigate({
      to: '/battle',
      search: {
        opponentId: String((selectedGym.id - 1) % 15),
        bgType: 'gym',
      },
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #1A1A2E 100%)' }}
    >
      {/* Challenge modal */}
      {showChallenge && selectedGym && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="max-w-sm w-full mx-4 bg-gradient-to-b from-gray-900 to-black border-2 border-electric-yellow rounded-2xl overflow-hidden">
            <div
              className="px-4 py-3 text-center"
              style={{ background: selectedGym.badgeColor + '44' }}
            >
              <h2 className="text-white font-anime text-2xl">{selectedGym.gym}</h2>
            </div>
            <div className="p-6 text-center">
              <div className="text-5xl mb-3">🏟️</div>
              <h3 className="text-electric-yellow font-anime text-xl mb-1">{selectedGym.name}</h3>
              <p className="text-white/60 text-sm mb-2">{selectedGym.description}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span
                  className="text-xs px-3 py-1 rounded-full font-bold text-white"
                  style={{ background: selectedGym.badgeColor + '88' }}
                >
                  {selectedGym.type} Type
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: selectedGym.difficulty }).map((_, i) => (
                    <Skull key={i} className="w-3 h-3 text-red-400" />
                  ))}
                </div>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Defeat {selectedGym.name} to earn the{' '}
                <span className="font-bold" style={{ color: selectedGym.badgeColor }}>
                  {selectedGym.badge}
                </span>
                !
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleBattle}
                  disabled={challengeGym.isPending}
                  className="flex-1 bg-electric-yellow text-dark-navy font-anime text-lg py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-60 anime-btn"
                >
                  {challengeGym.isPending ? '...' : '⚔️ CHALLENGE!'}
                </button>
                <button
                  onClick={() => setShowChallenge(false)}
                  className="flex-1 bg-white/10 text-white font-anime text-lg py-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  BACK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate({ to: '/game' })}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-anime text-3xl text-electric-yellow tracking-wide">GYM BATTLES</h1>
        </div>

        {/* Badge display */}
        <div className="mb-6">
          <BadgeDisplay />
        </div>

        {/* Gym leaders */}
        <h2 className="text-white/60 font-bold text-sm mb-3 uppercase tracking-wider">
          Gym Leaders
        </h2>
        <div className="space-y-3">
          {GYM_LEADERS.map((gym, idx) => {
            const isEarned = badges.length > idx;
            const isLocked = idx > 0 && badges.length < idx;

            return (
              <button
                key={gym.id}
                onClick={() => !isLocked && handleChallenge(gym)}
                disabled={isLocked}
                className={`w-full anime-card p-4 flex items-center gap-4 text-left transition-all ${
                  isLocked
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:border-white/40 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {/* Badge icon */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 border-2"
                  style={{
                    background: isEarned ? gym.badgeColor + '33' : '#ffffff11',
                    borderColor: isEarned ? gym.badgeColor : '#ffffff22',
                  }}
                >
                  {isEarned ? '🏅' : isLocked ? '🔒' : '⭕'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-white font-anime text-lg">{gym.name}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                      style={{ background: gym.badgeColor + '66' }}
                    >
                      {gym.type}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs">{gym.gym}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/40 text-xs">Difficulty:</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: gym.difficulty }).map((_, i) => (
                        <Skull key={i} className="w-3 h-3 text-red-400" />
                      ))}
                    </div>
                    {isEarned && (
                      <span className="text-green-400 text-xs font-bold ml-2">✓ BADGE EARNED</span>
                    )}
                  </div>
                </div>

                {!isLocked && (
                  <ChevronRight className="w-5 h-5 text-white/30 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Elite Four teaser */}
        {badges.length >= 8 && (
          <div className="mt-6 anime-card p-5 border-electric-yellow/50 bg-electric-yellow/5">
            <h3 className="text-electric-yellow font-anime text-xl mb-2">⚡ ELITE FOUR AWAITS!</h3>
            <p className="text-white/70 text-sm mb-4">
              You've earned all 8 badges! Challenge the Elite Four and become Champion!
            </p>
            <button
              onClick={() => navigate({ to: '/battle', search: { opponentId: '13', bgType: 'stadium' } })}
              className="w-full bg-electric-yellow text-dark-navy font-anime text-xl py-3 rounded-xl hover:bg-yellow-400 transition-colors anime-btn"
            >
              🏆 CHALLENGE ELITE FOUR!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
