import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { MONSTERS, MonsterData, ELEMENT_COLORS, ELEMENT_CLAN_NAMES } from '../data/monsterData';

const ELEMENT_LABELS: Record<string, string> = {
  fire: 'FIRE', water: 'WATER', earth: 'EARTH',
  wind: 'WIND', lightning: 'LIGHTNING', shadow: 'SHADOW',
};

export default function StarterSelection() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [selected, setSelected] = useState<MonsterData | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    sessionStorage.setItem('starterMonster', JSON.stringify(selected));
    sessionStorage.setItem('playerMonsters', JSON.stringify([selected]));
    setTimeout(() => navigate({ to: '/game' }), 800);
  };

  const elementColor = selected ? ELEMENT_COLORS[selected.element] : '#ff4757';

  return (
    <div className="min-h-screen py-8 px-4"
      style={{ background: 'linear-gradient(180deg, #07070f 0%, #0f0f1e 100%)' }}>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-bangers text-4xl md:text-5xl text-white tracking-widest mb-2"
            style={{ textShadow: '0 0 20px rgba(255,71,87,0.5)' }}>
            CHOOSE YOUR NINJA
          </h1>
          <p className="text-white/50 text-sm">Select the elemental ninja that will begin your journey</p>
        </div>

        {/* Monster grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {MONSTERS.map(monster => {
            const color = ELEMENT_COLORS[monster.element];
            const isSelected = selected?.id === monster.id;
            return (
              <button
                key={monster.id}
                onClick={() => setSelected(monster)}
                className={`relative rounded-xl p-4 border-2 transition-all duration-300 text-left group ${
                  isSelected ? 'scale-105' : 'hover:scale-102 hover:border-white/30'
                }`}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`
                    : 'rgba(255,255,255,0.03)',
                  borderColor: isSelected ? color : 'rgba(255,255,255,0.1)',
                  boxShadow: isSelected ? `0 0 20px ${color}40, 0 0 40px ${color}20` : 'none',
                }}
              >
                {/* Element badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: `${color}30`, color, border: `1px solid ${color}50` }}>
                  {ELEMENT_LABELS[monster.element]}
                </div>

                {/* Monster image */}
                <div className="flex justify-center mb-3">
                  <div className="relative w-24 h-24">
                    <img
                      src={monster.imagePath}
                      alt={monster.name}
                      className={`w-full h-full object-contain ${isSelected ? 'ninja-float' : 'ninja-idle'}`}
                      style={{ filter: isSelected ? `drop-shadow(0 0 12px ${color})` : `drop-shadow(0 0 4px ${color}60)` }}
                    />
                    {/* Ninja badge overlay */}
                    <div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs border"
                      style={{
                        background: `${color}30`,
                        borderColor: color,
                        boxShadow: `0 0 6px ${color}60`,
                      }}
                    >
                      🥷
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full border border-current opacity-30 energy-ring"
                        style={{ color }} />
                    )}
                  </div>
                </div>

                {/* Monster info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <h3 className="font-bangers text-lg text-white tracking-wide">{monster.name}</h3>
                  </div>
                  {/* Ninja rank label */}
                  <div className="text-xs font-bold mb-1" style={{ color }}>
                    {monster.ninjaRank}
                  </div>
                  {/* Clan flavor text */}
                  <p className="text-white/40 text-xs mb-3 line-clamp-2">{monster.clanFlavor}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {[
                      { label: 'HP', value: monster.baseHp },
                      { label: 'ATK', value: monster.attack },
                      { label: 'SPD', value: monster.speed },
                    ].map(stat => (
                      <div key={stat.label} className="rounded p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="text-white/40 text-xs">{stat.label}</div>
                        <div className="font-bold text-white">{stat.value}</div>
                        <div className="mt-0.5 h-1 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${(stat.value / 120) * 100}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected monster detail + confirm */}
        {selected && (
          <div className="fade-in-scale rounded-xl border p-5 mb-6"
            style={{
              background: `linear-gradient(135deg, ${elementColor}15 0%, rgba(10,10,20,0.9) 100%)`,
              borderColor: `${elementColor}40`,
              boxShadow: `0 0 30px ${elementColor}20`,
            }}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={selected.imagePath} alt={selected.name}
                  className="w-20 h-20 object-contain ninja-float"
                  style={{ filter: `drop-shadow(0 0 10px ${elementColor})` }} />
                <div
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm border-2"
                  style={{
                    background: `${elementColor}30`,
                    borderColor: elementColor,
                    boxShadow: `0 0 8px ${elementColor}60`,
                  }}
                >
                  🥷
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="font-bangers text-2xl text-white tracking-wider">{selected.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: `${elementColor}30`, color: elementColor }}>
                    {ELEMENT_CLAN_NAMES[selected.element]}
                  </span>
                </div>
                {/* Ninja rank */}
                <div className="text-xs font-bold mb-1" style={{ color: elementColor }}>
                  {selected.ninjaRank}
                </div>
                <p className="text-white/60 text-sm mb-2">{selected.description}</p>
                <div className="text-xs text-white/40">
                  Advances to: <span className="font-bold" style={{ color: elementColor }}>{selected.evolvedForm.name}</span>
                  {' '}({selected.evolvedForm.ninjaRank}) with a <span className="font-bold" style={{ color: elementColor }}>{selected.crystalNeeded}</span>
                </div>
              </div>
            </div>

            {/* Moves preview */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selected.moves.map(move => (
                <div key={move.name} className="rounded-lg p-2 border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white/80 text-xs font-semibold">{move.name}</span>
                    <span className="text-xs font-bold" style={{ color: elementColor }}>PWR {move.power}</span>
                  </div>
                  <p className="text-white/40 text-xs">{move.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm button */}
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={!selected || confirmed}
            className="px-12 py-4 rounded-xl font-bangers text-2xl tracking-widest text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: selected ? `linear-gradient(135deg, ${elementColor}80 0%, ${elementColor} 100%)` : 'rgba(255,255,255,0.1)',
              boxShadow: selected ? `0 0 20px ${elementColor}40` : 'none',
            }}
          >
            {confirmed ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                BONDING...
              </span>
            ) : selected ? (
              `🥷 CHOOSE THIS NINJA`
            ) : (
              'SELECT A NINJA'
            )}
          </button>
          {!selected && (
            <p className="text-white/30 text-sm mt-2">Tap a ninja card to select them</p>
          )}
        </div>
      </div>
    </div>
  );
}
