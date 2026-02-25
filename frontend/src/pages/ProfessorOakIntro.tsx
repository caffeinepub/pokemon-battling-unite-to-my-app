import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';

const DIALOGUE_LINES = [
  "Welcome, young one. I am Sensei Ryoku, guardian of the Five Elemental Dojos.",
  "For centuries, our world has been shaped by five great forces: Fire, Water, Earth, Wind, and Lightning.",
  "But a sixth power stirs in the shadows — the Shadow Clan grows stronger each day.",
  "Elemental ninja monsters roam our lands, each bonded to one of these primal forces.",
  "A true ninja apprentice must earn the trust of these creatures and master the elements.",
  "Six legendary monsters await a worthy partner. Each holds the power of an element within them.",
  "Your journey begins now. Choose your first elemental companion wisely.",
  "The path of the ninja is long and treacherous — but glory awaits those who persevere.",
  "Now tell me, young apprentice... what is your ninja name?",
];

export default function ProfessorOakIntro() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [ninjaName, setNinjaName] = useState('');
  const [clanName, setClanName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [phase, setPhase] = useState<'dialogue' | 'name-input' | 'done'>('dialogue');

  useEffect(() => {
    if (!identity) { navigate({ to: '/' }); return; }
    if (userProfile) { navigate({ to: '/game' }); return; }
  }, [identity, userProfile, navigate]);

  useEffect(() => {
    if (phase !== 'dialogue') return;
    const line = DIALOGUE_LINES[currentLine];
    let i = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (i < line.length) {
        setDisplayedText(line.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [currentLine, phase]);

  const handleNext = useCallback(() => {
    if (isTyping) {
      setDisplayedText(DIALOGUE_LINES[currentLine]);
      setIsTyping(false);
      return;
    }
    if (currentLine < DIALOGUE_LINES.length - 1) {
      setCurrentLine(prev => prev + 1);
    } else {
      setPhase('name-input');
      setShowNameInput(true);
    }
  }, [isTyping, currentLine]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (phase === 'dialogue') handleNext();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, phase]);

  const handleSaveProfile = async () => {
    if (!ninjaName.trim()) return;
    setIsSaving(true);
    try {
      await saveProfile.mutateAsync({
        ninjaName: ninjaName.trim(),
        clanName: clanName.trim() || 'Wandering Clan',
        avatarUrl: undefined,
        victories: BigInt(0),
        dojoSeals: BigInt(0),
      });
      navigate({ to: '/starter-selection' });
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const clans = ['Flame Clan', 'Tide Clan', 'Stone Clan', 'Gale Clan', 'Thunder Clan', 'Shadow Clan', 'Wandering Clan'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-end pb-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f1e0f 50%, #1a1a2e 100%)' }}>

      {/* Background scenery */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20"
          style={{ background: 'linear-gradient(0deg, #2ecc71 0%, transparent 100%)' }} />
        {/* Stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, animationDelay: `${Math.random() * 3}s` }} />
        ))}
      </div>

      {/* Sensei Ryoku */}
      <div className="absolute bottom-48 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 md:bottom-32">
        <div className="relative ninja-appear">
          <img
            src="/assets/generated/sensei-ryoku.dim_300x400.png"
            alt="Sensei Ryoku"
            className="h-64 md:h-80 object-contain"
            style={{ filter: 'drop-shadow(0 0 20px rgba(46,204,113,0.4))' }}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full opacity-30"
            style={{ background: 'radial-gradient(ellipse, #2ecc71 0%, transparent 70%)', filter: 'blur(4px)' }} />
        </div>
      </div>

      {/* Dialogue box */}
      {phase === 'dialogue' && (
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
          <div className="rounded-xl border border-white/20 p-5 cursor-pointer select-none"
            style={{ background: 'rgba(10,10,20,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={handleNext}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧙</span>
              <span className="font-bangers text-lg text-wind tracking-wider">Sensei Ryoku</span>
              <span className="ml-auto text-xs text-white/30">{currentLine + 1}/{DIALOGUE_LINES.length}</span>
            </div>
            <p className={`text-white/90 text-base leading-relaxed min-h-[3rem] ${isTyping ? 'cursor-blink' : ''}`}>
              {displayedText}
            </p>
            {!isTyping && (
              <div className="mt-3 flex items-center justify-end gap-2 text-white/40 text-xs">
                <span>Click or press Space to continue</span>
                <span className="animate-bounce">▼</span>
              </div>
            )}
          </div>
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {DIALOGUE_LINES.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentLine ? 'bg-wind scale-125' : i < currentLine ? 'bg-wind/50' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>
      )}

      {/* Name input */}
      {phase === 'name-input' && showNameInput && (
        <div className="relative z-10 w-full max-w-md mx-auto px-4 fade-in-scale">
          <div className="rounded-xl border border-wind/30 p-6"
            style={{ background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(12px)' }}>
            <h2 className="font-bangers text-2xl text-wind tracking-wider mb-1">Choose Your Identity</h2>
            <p className="text-white/50 text-sm mb-5">Your ninja name will be known throughout the land.</p>

            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-semibold block mb-1.5">Ninja Name *</label>
                <input
                  type="text"
                  value={ninjaName}
                  onChange={e => setNinjaName(e.target.value)}
                  placeholder="e.g. Kaze, Ryuu, Hikari..."
                  maxLength={20}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-wind/60 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-white/70 text-sm font-semibold block mb-1.5">Clan (optional)</label>
                <div className="grid grid-cols-2 gap-2">
                  {clans.map(clan => (
                    <button
                      key={clan}
                      onClick={() => setClanName(clan)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                        clanName === clan
                          ? 'border-wind/60 bg-wind/20 text-wind'
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white/80'
                      }`}
                    >
                      {clan}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={!ninjaName.trim() || isSaving}
                className="w-full py-3 rounded-lg font-bangers text-xl tracking-widest text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #145c33 0%, #2ecc71 100%)', boxShadow: '0 0 15px rgba(46,204,113,0.3)' }}
              >
                {isSaving ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> ENTERING DOJO...</>
                ) : (
                  <>🥷 BEGIN JOURNEY</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
