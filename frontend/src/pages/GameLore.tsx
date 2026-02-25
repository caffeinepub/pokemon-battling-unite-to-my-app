import React, { useState } from 'react';

const chapters = [
  {
    id: 'ancient',
    title: 'The Ancient World',
    emoji: '🌍',
    color: '#a16207',
    content: `Long before the age of ninja clans, the world was shaped by six primordial forces — Fire, Water, Earth, Wind, Lightning, and Shadow. These forces were not merely elements; they were living spirits that breathed life into the land, sea, and sky.

Ancient scrolls speak of a time when these spirits walked among mortals, teaching the first warriors the sacred arts of elemental mastery. These warriors became the founders of the six great clans, each bound to a single element by blood and oath.

The world flourished under their guidance for a thousand years — until the Shadow Clan broke the ancient covenant.`,
  },
  {
    id: 'clans',
    title: 'The Six Sacred Clans',
    emoji: '🏯',
    color: '#3b82f6',
    content: `Each clan guards a sacred dojo where the elemental arts are taught and preserved:

🔥 The Fire Clan — Masters of destruction and rebirth. Their warriors channel volcanic fury into devastating strikes. Led by the legendary Blaziken Ryu.

💧 The Water Clan — Practitioners of flow and adaptation. They bend rivers and tides to their will. Guided by the serene Mistveil Sora.

🪨 The Earth Clan — Defenders of the land. Their bodies become stone, their strikes unmovable. Stonefist Golem stands eternal watch.

💨 The Wind Clan — Swift as thought, silent as breath. Galestep Zephyr leads them through the clouds.

⚡ The Lightning Clan — Channelers of storm and speed. Voltclaw Raiden strikes before the thunder sounds.

🌑 The Shadow Clan — Once guardians of balance, now consumed by darkness. Voidshade Kage seeks to unmake the world.`,
  },
  {
    id: 'shadow',
    title: 'Rise of the Shadow Clan',
    emoji: '🌑',
    color: '#7c3aed',
    content: `The Shadow Clan was once the most revered of all six clans. Their mastery of darkness allowed them to see truth hidden from others — the lies of kings, the corruption of power, the rot beneath beauty.

But power corrupts. The Shadow Clan's leader, Voidshade Kage, discovered an ancient forbidden technique: the ability to absorb the elemental essence of other clans. One by one, Shadow warriors began attacking the other dojos, stealing their power.

The five remaining clans united in desperation. They could not destroy the Shadow Clan — to do so would unbalance the world. Instead, they sealed Voidshade Kage in the Void Realm, a prison between worlds.

But seals weaken. The Shadow Clan grows stronger. And the five clans need a new champion — someone unbound by clan loyalty, free to fight for all elements at once.`,
  },
  {
    id: 'player',
    title: 'Your Role',
    emoji: '🥷',
    color: '#ef4444',
    content: `You are that champion.

Born outside the clan system, you carry no elemental allegiance — and that is your greatest strength. The five clan leaders have agreed to train you in all elemental arts, something forbidden for any clan member.

Your journey begins at the six dojos. Master each element. Earn the sacred seals. Prove yourself worthy of the title: Grand Ninja.

Only then can you enter the Void Realm and face Voidshade Kage. Only then can the ancient covenant be restored.

The fate of the elemental world rests in your hands. Choose your first ninja. Begin your training. The shadow grows longer with every passing day.`,
  },
];

export default function GameLore() {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const current = chapters.find((c) => c.id === activeChapter) || chapters[0];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Banner */}
      <div className="relative w-full overflow-hidden" style={{ height: '140px' }}>
        <img
          src="/assets/generated/story-lore-banner.dim_1200x300.png"
          alt="Lore Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-black text-primary tracking-widest drop-shadow-lg">
            📜 WORLD LORE
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 py-4 md:px-6 md:py-8">
        {/* Chapter Navigation — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 md:mb-6 scrollbar-hide">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setActiveChapter(chapter.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all touch-manipulation min-h-[40px] ${
                activeChapter === chapter.id
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{chapter.emoji}</span>
              <span className="whitespace-nowrap">{chapter.title}</span>
            </button>
          ))}
        </div>

        {/* Chapter Content */}
        <div
          className="bg-card border rounded-2xl p-4 md:p-6"
          style={{ borderColor: `${current.color}44` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `${current.color}22` }}
            >
              {current.emoji}
            </div>
            <h2 className="text-lg md:text-2xl font-black text-foreground">{current.title}</h2>
          </div>
          <div className="prose prose-sm max-w-none">
            {current.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Chapter Navigation Arrows */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              const idx = chapters.findIndex((c) => c.id === activeChapter);
              if (idx > 0) setActiveChapter(chapters[idx - 1].id);
            }}
            disabled={chapters.findIndex((c) => c.id === activeChapter) === 0}
            className="px-4 py-2 bg-card border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors min-h-[44px] touch-manipulation"
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              const idx = chapters.findIndex((c) => c.id === activeChapter);
              if (idx < chapters.length - 1) setActiveChapter(chapters[idx + 1].id);
            }}
            disabled={chapters.findIndex((c) => c.id === activeChapter) === chapters.length - 1}
            className="px-4 py-2 bg-card border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors min-h-[44px] touch-manipulation"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
