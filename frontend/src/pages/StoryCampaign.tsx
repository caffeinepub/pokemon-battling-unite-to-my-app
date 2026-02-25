import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const storyArcs = [
  {
    id: 'five-dojos',
    title: 'The Five Dojos',
    emoji: '🏯',
    color: '#3b82f6',
    description: 'Journey through the five elemental dojos and earn your seals',
    episodes: Array.from({ length: 10 }, (_, i) => ({
      code: `FD-${String(i + 1).padStart(2, '0')}`,
      title: [
        'The First Step',
        'Trial by Fire',
        'Still Waters',
        'Stone and Bone',
        'Riding the Wind',
        'Storm Caller',
        "Shadow's Edge",
        'The Sealed Gate',
        'Convergence',
        'The Grand Trial',
      ][i],
      element: ['fire', 'fire', 'water', 'earth', 'wind', 'lightning', 'dark', 'dark', 'all', 'all'][i],
    })),
  },
  {
    id: 'shadow-uprising',
    title: 'Shadow Clan Uprising',
    emoji: '🌑',
    color: '#7c3aed',
    description: 'The Shadow Clan stirs — defend the elemental balance',
    episodes: Array.from({ length: 10 }, (_, i) => ({
      code: `SC-${String(i + 1).padStart(2, '0')}`,
      title: [
        'Whispers in the Dark',
        'The First Raid',
        'Stolen Flames',
        'Drowned Secrets',
        'Crumbling Walls',
        'Silent Storm',
        'The Void Spreads',
        'Allies and Enemies',
        'The Shadow Gate',
        'Into the Void',
      ][i],
      element: ['dark', 'dark', 'fire', 'water', 'earth', 'lightning', 'dark', 'all', 'dark', 'dark'][i],
    })),
  },
  {
    id: 'clash-elements',
    title: 'Clash of the Elements',
    emoji: '⚔️',
    color: '#ef4444',
    description: 'The final battle — restore the ancient covenant',
    episodes: Array.from({ length: 10 }, (_, i) => ({
      code: `CE-${String(i + 1).padStart(2, '0')}`,
      title: [
        'The Gathering Storm',
        'Fire Meets Shadow',
        'Tidal Clash',
        'Earthshaker',
        "Eye of the Storm",
        "Lightning's Last Stand",
        'The Void Realm',
        'Kage Unmasked',
        'The Final Seal',
        'Balance Restored',
      ][i],
      element: ['all', 'fire', 'water', 'earth', 'wind', 'lightning', 'dark', 'dark', 'all', 'all'][i],
    })),
  },
];

const elementEmoji: Record<string, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  wind: '💨',
  lightning: '⚡',
  dark: '🌑',
  all: '✨',
};

export default function StoryCampaign() {
  const { identity } = useInternetIdentity();
  const [selectedArc, setSelectedArc] = useState(storyArcs[0].id);
  const arc = storyArcs.find((a) => a.id === selectedArc) || storyArcs[0];

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-muted-foreground text-center">Please log in to access the story campaign</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-3 py-4 md:px-6 md:py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-wider">📖 STORY CAMPAIGN</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Three arcs · 30 episodes</p>
        </div>

        {/* Arc Selection — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {storyArcs.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedArc(a.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all touch-manipulation min-h-[40px] ${
                selectedArc === a.id
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{a.emoji}</span>
              <span className="whitespace-nowrap">{a.title}</span>
            </button>
          ))}
        </div>

        {/* Arc Info */}
        <div
          className="bg-card border rounded-2xl p-3 md:p-4 mb-4"
          style={{ borderLeft: `4px solid ${arc.color}` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl shrink-0">{arc.emoji}</span>
            <div>
              <h2 className="font-black text-base md:text-lg text-foreground">{arc.title}</h2>
              <p className="text-xs text-muted-foreground">{arc.description}</p>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <div className="space-y-2">
          {arc.episodes.map((ep, i) => (
            <div
              key={ep.code}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-bold text-foreground truncate">{ep.title}</p>
                <p className="text-[10px] text-muted-foreground">{ep.code}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base">{elementEmoji[ep.element] || '✨'}</span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline capitalize">
                  {ep.element}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
