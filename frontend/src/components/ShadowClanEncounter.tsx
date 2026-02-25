import React, { useState, useEffect } from 'react';

interface ShadowClanEncounterProps {
  onDismiss: () => void;
  onBattle: () => void;
}

const SHADOW_CLAN = [
  { name: 'Kuro', role: 'Shadow Leader', emoji: '🔥', color: '#ff4757' },
  { name: 'Shira', role: 'Shadow Strategist', emoji: '🌑', color: '#9b59b6' },
  { name: 'Zuki', role: 'Shadow Trickster', emoji: '💧', color: '#00d2ff' },
];

const MOTTO_LINES = [
  "Kuro: \"Prepare yourself, young ninja!\"",
  "Shira: \"The shadows will consume your light...\"",
  "Zuki: \"Ehehe... we're gonna steal your crystals!\"",
  "All: \"SHADOW CLAN — WE STRIKE FROM THE DARK!\"",
];

export default function ShadowClanEncounter({ onDismiss, onBattle }: ShadowClanEncounterProps) {
  const [mottoLine, setMottoLine] = useState(0);
  const [vanishing, setVanishing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMottoLine(prev => {
        if (prev < MOTTO_LINES.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setVanishing(true);
    setTimeout(onDismiss, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <div className={`w-full max-w-md rounded-xl border border-shadow/40 overflow-hidden ${vanishing ? 'smoke-vanish' : 'fade-in-scale'}`}
        style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f0f1e 100%)' }}>

        {/* Header */}
        <div className="p-4 border-b border-shadow/30 text-center"
          style={{ background: 'linear-gradient(135deg, #3d1f4d 0%, #1a0a2e 100%)' }}>
          <div className="flex justify-center gap-2 mb-2">
            {SHADOW_CLAN.map(m => (
              <div key={m.name} className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
                style={{ borderColor: m.color, background: `${m.color}20` }}>
                {m.emoji}
              </div>
            ))}
          </div>
          <h2 className="font-bangers text-2xl text-shadow tracking-widest"
            style={{ textShadow: '0 0 15px #9b59b6' }}>
            SHADOW CLAN APPEARS!
          </h2>
        </div>

        {/* Characters */}
        <div className="p-4 grid grid-cols-3 gap-2 border-b border-white/10">
          {SHADOW_CLAN.map(member => (
            <div key={member.name} className="text-center p-2 rounded-lg border border-white/10"
              style={{ background: `${member.color}10` }}>
              <div className="text-2xl mb-1">{member.emoji}</div>
              <div className="font-bangers text-sm tracking-wide" style={{ color: member.color }}>{member.name}</div>
              <div className="text-white/40 text-xs">{member.role}</div>
            </div>
          ))}
        </div>

        {/* Motto */}
        <div className="p-4 min-h-[80px] flex items-center">
          <p className="text-white/80 text-sm italic text-center w-full">
            {MOTTO_LINES[mottoLine]}
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 flex gap-3">
          <button
            onClick={onBattle}
            className="flex-1 py-3 rounded-lg font-bangers text-lg tracking-widest text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #8b1a24 0%, #ff4757 100%)', boxShadow: '0 0 15px rgba(255,71,87,0.3)' }}
          >
            ⚔️ BATTLE!
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 rounded-lg font-bangers text-lg tracking-widest text-white/60 border border-white/20 hover:border-white/40 transition-all"
          >
            🌫️ FLEE
          </button>
        </div>
      </div>
    </div>
  );
}
