import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useChallengeDojoLeader } from '../hooks/useQueries';

const dojos = [
  {
    id: 'fire',
    name: 'Fire Dojo',
    leader: 'Blaziken Ryu',
    element: 'fire',
    color: '#ef4444',
    emoji: '🔥',
    description: 'Master the flames of destruction',
    difficulty: 'Intermediate',
  },
  {
    id: 'water',
    name: 'Water Dojo',
    leader: 'Mistveil Sora',
    element: 'water',
    color: '#3b82f6',
    emoji: '💧',
    description: 'Flow like the endless ocean',
    difficulty: 'Beginner',
  },
  {
    id: 'earth',
    name: 'Earth Dojo',
    leader: 'Stonefist Golem',
    element: 'earth',
    color: '#a16207',
    emoji: '🪨',
    description: 'Stand firm as the mountain',
    difficulty: 'Intermediate',
  },
  {
    id: 'wind',
    name: 'Wind Dojo',
    leader: 'Galestep Zephyr',
    element: 'wind',
    color: '#06b6d4',
    emoji: '💨',
    description: 'Strike swift as the wind',
    difficulty: 'Advanced',
  },
  {
    id: 'lightning',
    name: 'Lightning Dojo',
    leader: 'Voltclaw Raiden',
    element: 'lightning',
    color: '#eab308',
    emoji: '⚡',
    description: "Channel the storm's fury",
    difficulty: 'Advanced',
  },
  {
    id: 'shadow',
    name: 'Shadow Dojo',
    leader: 'Voidshade Kage',
    element: 'shadow',
    color: '#7c3aed',
    emoji: '🌑',
    description: 'Embrace the void within',
    difficulty: 'Master',
  },
];

const difficultyColor: Record<string, string> = {
  Beginner: '#22c55e',
  Intermediate: '#eab308',
  Advanced: '#ef4444',
  Master: '#7c3aed',
};

export default function GymBattles() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const challengeMutation = useChallengeDojoLeader();
  const [selectedDojo, setSelectedDojo] = useState<(typeof dojos)[0] | null>(null);
  const [challenging, setChallenging] = useState(false);

  const earnedSeals = Number(userProfile?.dojoSeals || 0);

  const handleChallenge = async () => {
    if (!selectedDojo) return;
    setChallenging(true);
    try {
      sessionStorage.setItem(
        'currentDojo',
        JSON.stringify({ dojoType: selectedDojo.element, dojoLeader: selectedDojo.leader })
      );
      await challengeMutation.mutateAsync({
        dojoType: selectedDojo.element,
        dojoLeader: selectedDojo.leader,
      });
      navigate({ to: '/battle' });
    } catch {
      navigate({ to: '/battle' });
    } finally {
      setChallenging(false);
      setSelectedDojo(null);
    }
  };

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-muted-foreground text-center">Please log in to challenge dojos</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-3 py-4 md:px-6 md:py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-wider">
            🏯 ELEMENTAL DOJOS
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Seals earned: <span className="text-primary font-bold">{earnedSeals}</span> /{' '}
            {dojos.length}
          </p>
        </div>

        {/* Dojo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {dojos.map((dojo) => (
            <button
              key={dojo.id}
              onClick={() => setSelectedDojo(dojo)}
              className="flex flex-col gap-3 p-3 md:p-4 bg-card border border-border rounded-2xl hover:border-primary/40 active:scale-95 transition-all text-left touch-manipulation"
              style={{ minHeight: '120px', borderLeft: `4px solid ${dojo.color}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${dojo.color}22` }}
                >
                  {dojo.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-foreground leading-tight">{dojo.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{dojo.leader}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {dojo.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${difficultyColor[dojo.difficulty]}22`,
                      color: difficultyColor[dojo.difficulty],
                    }}
                  >
                    {dojo.difficulty}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Tap to challenge →</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Grand Master unlock */}
        {earnedSeals >= dojos.length && (
          <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-2xl text-center">
            <p className="text-lg font-black text-primary">🏆 GRAND MASTER UNLOCKED!</p>
            <p className="text-xs text-muted-foreground mt-1">
              You have mastered all elemental arts
            </p>
          </div>
        )}
      </div>

      {/* Challenge Modal */}
      {selectedDojo && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-0"
          onClick={() => setSelectedDojo(null)}
        >
          <div
            className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: `${selectedDojo.color}22` }}
              >
                {selectedDojo.emoji}
              </div>
              <div>
                <h3 className="font-black text-lg text-foreground">{selectedDojo.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedDojo.leader}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-5">{selectedDojo.description}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDojo(null)}
                className="flex-1 py-3 border border-border rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-colors min-h-[48px] touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={handleChallenge}
                disabled={challenging}
                className="flex-1 py-3 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 min-h-[48px] touch-manipulation"
                style={{ background: selectedDojo.color }}
              >
                {challenging ? 'Entering...' : `Challenge ${selectedDojo.emoji}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
