import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetMonsters, useGetCrystalInventory } from '../hooks/useQueries';
import { MONSTERS, ELEMENT_COLORS, ElementType } from '../data/monsterData';

const elementEmoji: Record<ElementType, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  wind: '💨',
  lightning: '⚡',
  shadow: '🌑',
};

// Map backend crystal keys to display info
const CRYSTAL_DISPLAY: Array<{
  key: string;
  label: string;
  emoji: string;
  color: string;
}> = [
  { key: 'flame', label: 'Flame', emoji: '🔥', color: '#ef4444' },
  { key: 'tide', label: 'Tide', emoji: '💧', color: '#3b82f6' },
  { key: 'gale', label: 'Gale', emoji: '💨', color: '#06b6d4' },
  { key: 'thunder', label: 'Thunder', emoji: '⚡', color: '#eab308' },
  { key: 'terra', label: 'Terra', emoji: '🪨', color: '#78716c' },
  { key: 'void', label: 'Void', emoji: '🌑', color: '#a855f7' },
];

export default function PokemonRoster() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userMonsters } = useGetMonsters();
  const { data: crystalInventory, isLoading: crystalsLoading } = useGetCrystalInventory();
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null);

  void userMonsters;

  const displayMonsters = MONSTERS;

  // Build a map from crystal key -> quantity
  const crystalMap: Record<string, number> = {};
  if (crystalInventory) {
    for (const [key, qty] of crystalInventory) {
      crystalMap[key] = Number(qty);
    }
  }

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-muted-foreground text-center">Please log in to view your roster</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-3 py-4 md:px-6 md:py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-wider">
            🥷 YOUR NINJA SQUAD
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {userProfile?.clanName || 'Unknown Clan'} · {displayMonsters.length} ninjas
          </p>
        </div>

        {/* Crystal Inventory */}
        <div className="bg-card border border-border rounded-2xl p-3 md:p-4 mb-4 md:mb-6">
          <h2 className="text-sm font-bold text-foreground mb-3">💎 Crystal Inventory</h2>
          {crystalsLoading ? (
            <div className="flex gap-2 flex-wrap">
              {CRYSTAL_DISPLAY.map((c) => (
                <div key={c.key} className="w-24 h-8 bg-primary/10 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {CRYSTAL_DISPLAY.map((crystal) => {
                const qty = crystalMap[crystal.key] ?? 0;
                const hasAny = qty > 0;
                return (
                  <div
                    key={crystal.key}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all"
                    style={{
                      background: hasAny ? `${crystal.color}15` : 'transparent',
                      borderColor: hasAny ? `${crystal.color}50` : 'rgba(255,255,255,0.08)',
                      color: hasAny ? crystal.color : undefined,
                      boxShadow: hasAny ? `0 0 8px ${crystal.color}30` : 'none',
                    }}
                  >
                    <span>{crystal.emoji}</span>
                    <span className="hidden sm:inline text-muted-foreground" style={hasAny ? { color: crystal.color } : {}}>
                      {crystal.label}
                    </span>
                    <span
                      className="font-black"
                      style={{ color: hasAny ? crystal.color : undefined }}
                    >
                      ×{qty}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-[10px] text-muted-foreground mt-2">
            Visit the{' '}
            <a href="/shop" className="text-primary hover:underline font-medium">
              Crystal Shop
            </a>{' '}
            to purchase crystals for evolution.
          </p>
        </div>

        {/* Monster Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {displayMonsters.map((monster) => {
            const element = monster.element;
            const color = ELEMENT_COLORS[element];
            const isSelected = selectedMonster === monster.id;

            return (
              <button
                key={monster.id}
                onClick={() => setSelectedMonster(isSelected ? null : monster.id)}
                className={`relative flex flex-col items-center gap-2 p-3 md:p-4 bg-card border rounded-2xl transition-all active:scale-95 touch-manipulation text-left ${
                  isSelected
                    ? 'border-primary/60 bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
                style={{ minHeight: '140px' }}
              >
                {/* 🥷 Badge */}
                <div className="absolute top-2 right-2 text-xs">🥷</div>

                {/* Monster Image */}
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl relative"
                  style={{ background: `${color}22`, border: `2px solid ${color}44` }}
                >
                  {elementEmoji[element]}
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
                    style={{ background: `${color}33`, borderColor: `${color}88` }}
                  >
                    {elementEmoji[element]}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center w-full">
                  <p className="font-bold text-xs md:text-sm text-foreground leading-tight truncate">
                    {monster.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">{element}</p>
                  {monster.ninjaRank && (
                    <p className="text-[10px] text-primary/80 font-medium">{monster.ninjaRank}</p>
                  )}
                </div>

                {/* Stats (expanded) */}
                {isSelected && (
                  <div className="w-full mt-1 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">ATK</span>
                      <span className="text-foreground font-bold">{monster.attack}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">DEF</span>
                      <span className="text-foreground font-bold">{monster.defense}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">SPD</span>
                      <span className="text-foreground font-bold">{monster.speed}</span>
                    </div>
                    <button
                      className="w-full mt-2 py-2 text-[10px] font-bold bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors min-h-[36px] touch-manipulation"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🥷 ADVANCE NINJA RANK
                    </button>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Ninja Codex */}
        <div className="mt-6 bg-card border border-border rounded-2xl p-3 md:p-4">
          <h2 className="text-sm font-bold text-foreground mb-2">📜 NINJA CODEX</h2>
          <p className="text-xs text-muted-foreground">
            Master all six elemental arts to unlock the Grand Ninja title. Each clan holds ancient
            secrets passed down through generations.
          </p>
        </div>
      </div>
    </div>
  );
}
