import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

const OAK_DIALOGUE = [
  "Hello there! Welcome to the world of Pokémon!",
  "My name is Oak! People call me the Pokémon Professor!",
  "This world is inhabited by creatures called Pokémon!",
  "For some people, Pokémon are pets. Others use them for fights.",
  "Myself... I study Pokémon as a profession.",
  "First, what is your name?",
  "...Ah yes! Your name is ASH!",
  "Right! So your name is Ash!",
  "Your very own Pokémon legend is about to unfold!",
  "A world of dreams and adventures with Pokémon awaits! Let's go!",
];

export default function ProfessorOakIntro() {
  const navigate = useNavigate();
  const [dialogIndex, setDialogIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const currentLine = OAK_DIALOGUE[dialogIndex];

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < currentLine.length) {
        setDisplayedText(currentLine.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [dialogIndex, currentLine]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(currentLine);
      setIsTyping(false);
      return;
    }
    if (dialogIndex < OAK_DIALOGUE.length - 1) {
      setDialogIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBegin = () => {
    navigate({ to: '/starter-selection' });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2744 50%, #0D1B2A 100%)',
      }}
    >
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="mb-8 fade-in-up">
        <img
          src="/assets/generated/app-logo.dim_600x200.png"
          alt="Ash's Pokemon Journey"
          className="w-80 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Professor Oak */}
      <div className="relative mb-6 slide-in-left">
        <div className="absolute inset-0 rounded-full blur-3xl opacity-20 bg-green-400" />
        <img
          src="/assets/generated/professor-oak.dim_300x400.png"
          alt="Professor Oak"
          className="relative w-48 h-64 object-contain drop-shadow-2xl pokemon-idle"
        />
      </div>

      {/* Dialogue box */}
      {!isComplete ? (
        <div
          className="max-w-lg w-full mx-4 bg-black/80 border-2 border-white/30 rounded-2xl p-6 cursor-pointer dialog-slide-in"
          onClick={handleNext}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-bold text-sm">PROF. OAK</span>
          </div>
          <p className="text-white text-lg leading-relaxed min-h-[60px]">
            {displayedText}
            {isTyping && (
              <span
                className="inline-block w-0.5 h-5 bg-white ml-0.5 align-middle"
                style={{ animation: 'typewriterCursor 0.7s ease-in-out infinite' }}
              />
            )}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-white/40 text-xs">
              {dialogIndex + 1} / {OAK_DIALOGUE.length}
            </span>
            {!isTyping && (
              <span className="text-white/60 text-sm animate-bounce">
                {dialogIndex < OAK_DIALOGUE.length - 1 ? '▼ Click to continue' : '▼ Click to finish'}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-lg w-full mx-4 text-center fade-in-up">
          <div className="bg-black/80 border-2 border-electric-yellow rounded-2xl p-8 mb-6">
            <p className="text-electric-yellow font-anime text-3xl mb-2 tracking-wide">
              TRAINER: ASH
            </p>
            <p className="text-white text-lg">Your adventure begins now!</p>
          </div>
          <button
            onClick={handleBegin}
            className="bg-electric-yellow text-dark-navy font-anime text-2xl px-12 py-4 rounded-2xl hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-electric anime-btn"
          >
            ⚡ BEGIN JOURNEY!
          </button>
        </div>
      )}
    </div>
  );
}
