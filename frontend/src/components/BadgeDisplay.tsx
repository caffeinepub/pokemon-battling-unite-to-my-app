import React from 'react';
import { GYM_LEADERS } from '../data/pokemonData';
import { useGetBadges } from '../hooks/useQueries';

export default function BadgeDisplay() {
  const { data: badges = [] } = useGetBadges();

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
      <h3 className="text-electric-yellow font-anime text-xl mb-3 tracking-wide">GYM BADGES</h3>
      <div className="grid grid-cols-4 gap-3">
        {GYM_LEADERS.map((gym) => {
          const earned = badges.length > gym.id - 1;
          return (
            <div
              key={gym.id}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                earned
                  ? 'border-yellow-400/50 bg-yellow-400/10'
                  : 'border-white/10 bg-white/5 opacity-40 grayscale'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${
                  earned ? 'border-yellow-400' : 'border-gray-600'
                }`}
                style={{ background: earned ? gym.badgeColor + '33' : '#333' }}
              >
                {earned ? '🏅' : '⭕'}
              </div>
              <span className="text-white/70 text-xs text-center leading-tight">{gym.badge}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-white/50 text-xs text-center">
        {badges.length} / {GYM_LEADERS.length} badges earned
      </div>
    </div>
  );
}
