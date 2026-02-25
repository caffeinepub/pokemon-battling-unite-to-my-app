import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TeamRocketEncounterProps {
  onBattle: () => void;
  onFlee: () => void;
}

const ROCKET_LINES = [
  "Prepare for trouble!",
  "Make it double!",
  "To protect the world from devastation!",
  "To unite all peoples within our nation!",
  "To denounce the evils of truth and love!",
  "To extend our reach to the stars above!",
  "Jessie!",
  "James!",
  "Team Rocket blasts off at the speed of light!",
  "Surrender now or prepare to fight!",
  "Meowth, that's right!",
];

export default function TeamRocketEncounter({ onBattle, onFlee }: TeamRocketEncounterProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isBlastingOff, setIsBlastingOff] = useState(false);

  useEffect(() => {
    if (lineIndex < ROCKET_LINES.length) {
      const timer = setTimeout(() => {
        setLineIndex((prev) => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setShowButtons(true);
    }
  }, [lineIndex]);

  const handleDefeat = () => {
    setIsBlastingOff(true);
    setTimeout(onFlee, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative max-w-md w-full mx-4 bg-gradient-to-b from-gray-900 to-black border-2 border-red-500 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-4 py-3 flex items-center gap-3">
          <span className="text-white font-anime text-2xl tracking-widest">TEAM ROCKET</span>
          <span className="text-white text-xl">🚀</span>
        </div>

        {/* Team Rocket image */}
        <div className={`relative flex justify-center py-4 ${isBlastingOff ? 'blast-off' : ''}`}>
          <img
            src="/assets/generated/team-rocket.dim_400x300.png"
            alt="Team Rocket"
            className="w-64 h-48 object-contain"
          />
          {isBlastingOff && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl star-twinkle">⭐</div>
            </div>
          )}
        </div>

        {/* Dialogue */}
        <div className="px-4 pb-2 min-h-[80px]">
          <div className="bg-black/50 border border-red-500/30 rounded-xl p-3">
            {ROCKET_LINES.slice(0, lineIndex).map((line, i) => (
              <p
                key={i}
                className="text-white font-bold text-sm dialog-slide-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Buttons */}
        {showButtons && !isBlastingOff && (
          <div className="px-4 pb-4 flex gap-3 fade-in-up">
            <button
              onClick={onBattle}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-anime text-lg py-3 rounded-xl transition-colors anime-btn"
            >
              ⚔️ BATTLE!
            </button>
            <button
              onClick={handleDefeat}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-anime text-lg py-3 rounded-xl transition-colors anime-btn"
            >
              💨 FLEE
            </button>
          </div>
        )}

        {isBlastingOff && (
          <div className="px-4 pb-4 text-center fade-in-up">
            <p className="text-yellow-400 font-anime text-xl">
              Team Rocket is blasting off again! ⭐
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
