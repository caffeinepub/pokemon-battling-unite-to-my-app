import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

const achievements = [
  { id: 'first-battle', label: 'First Battle', emoji: '⚔️', desc: 'Complete your first battle' },
  { id: 'first-seal', label: 'First Seal', emoji: '🏯', desc: 'Earn your first dojo seal' },
  { id: 'all-seals', label: 'Grand Master', emoji: '🏆', desc: 'Earn all 6 dojo seals' },
  { id: 'lore-reader', label: 'Lore Keeper', emoji: '📜', desc: 'Read all lore chapters' },
];

export default function TrainerProfile() {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-muted-foreground text-center">Please log in to view your profile</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const victories = Number(userProfile?.victories || 0);
  const dojoSeals = Number(userProfile?.dojoSeals || 0);

  return (
    <div className="min-h-screen bg-background px-3 py-4 md:px-6 md:py-8 overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl md:text-4xl shrink-0">
              🥷
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-black text-foreground truncate">
                {userProfile?.ninjaName || 'Ninja Warrior'}
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                {userProfile?.clanName || 'Unknown Clan'}
              </p>
              <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
                {identity.getPrincipal().toString().slice(0, 20)}...
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 md:mb-6">
          <div className="bg-card border border-border rounded-2xl p-3 md:p-4 text-center">
            <p className="text-3xl md:text-4xl font-black text-primary">{victories}</p>
            <p className="text-xs text-muted-foreground mt-1">Victories</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 md:p-4 text-center">
            <p className="text-3xl md:text-4xl font-black text-primary">{dojoSeals}</p>
            <p className="text-xs text-muted-foreground mt-1">Dojo Seals</p>
          </div>
        </div>

        {/* Dojo Seals Display */}
        <div className="bg-card border border-border rounded-2xl p-3 md:p-4 mb-4 md:mb-6">
          <h2 className="text-sm font-bold text-foreground mb-3">🏯 Dojo Seals</h2>
          <div className="grid grid-cols-3 gap-2">
            {(['fire', 'water', 'earth', 'wind', 'lightning', 'dark'] as const).map((element, i) => {
              const earned = i < dojoSeals;
              const emojiMap: Record<string, string> = {
                fire: '🔥',
                water: '💧',
                earth: '🪨',
                wind: '💨',
                lightning: '⚡',
                dark: '🌑',
              };
              return (
                <div
                  key={element}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    earned
                      ? 'border-primary/40 bg-primary/10'
                      : 'border-border bg-background opacity-40'
                  }`}
                >
                  <span className="text-xl">{emojiMap[element]}</span>
                  <span className="text-[10px] font-medium capitalize text-muted-foreground">
                    {element}
                  </span>
                  {earned && <span className="text-[8px] text-primary font-bold">EARNED</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-border rounded-2xl p-3 md:p-4 mb-4 md:mb-6">
          <h2 className="text-sm font-bold text-foreground mb-3">🏆 Achievements</h2>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-center gap-2 p-2 bg-background border border-border rounded-xl opacity-50"
              >
                <span className="text-xl shrink-0">{ach.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{ach.label}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight line-clamp-2">
                    {ach.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 border border-border rounded-2xl text-sm font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors min-h-[48px] touch-manipulation"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
