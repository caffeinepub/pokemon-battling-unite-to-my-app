import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';

interface StrategyInputProps {
  onStrategy: (strategy: string, keywords: string[]) => void;
  disabled?: boolean;
}

const STRATEGY_KEYWORDS: Record<string, { response: string; animation: string }> = {
  'quick attack': { response: "Pikachu dashes at lightning speed, confusing the opponent!", animation: 'speed' },
  'circle': { response: "Pikachu circles the opponent, creating an opening!", animation: 'dodge' },
  'iron tail': { response: "Pikachu's tail glows silver — ready to counter!", animation: 'counter' },
  'counter': { response: "Perfect counter strategy! Pikachu waits for the right moment!", animation: 'counter' },
  'dodge': { response: "Pikachu sidesteps the incoming attack!", animation: 'dodge' },
  'electro ball': { response: "Pikachu charges up a massive electric orb!", animation: 'charge' },
  'electro web': { response: "Pikachu launches an electric web to trap the opponent!", animation: 'trap' },
  'freeze': { response: "Watch out for Ice Beam! Use Iron Tail to counter!", animation: 'counter' },
  'confuse': { response: "Use Quick Attack to confuse the opponent with speed!", animation: 'speed' },
  'attack': { response: "Go for it! Unleash your strongest move!", animation: 'attack' },
  'defend': { response: "Hold your ground! Use Iron Tail to boost defense!", animation: 'defend' },
};

export default function StrategyInput({ onStrategy, disabled }: StrategyInputProps) {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;

    const lower = text.toLowerCase();
    const foundKeywords: string[] = [];
    let strategyResponse = "Ash thinks carefully about the strategy...";

    for (const [keyword, data] of Object.entries(STRATEGY_KEYWORDS)) {
      if (lower.includes(keyword)) {
        foundKeywords.push(keyword);
        strategyResponse = data.response;
        break;
      }
    }

    setResponse(strategyResponse);
    onStrategy(text, foundKeywords);
    setText('');

    setTimeout(() => {
      setResponse('');
    }, 3000);
  };

  return (
    <div className="bg-black/80 border border-electric-yellow/30 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-electric-yellow" />
        <span className="text-electric-yellow font-anime text-sm tracking-wide">STRATEGY</span>
      </div>

      {response && (
        <div className="mb-2 p-2 bg-electric-yellow/10 border border-electric-yellow/30 rounded-lg text-electric-yellow text-xs font-bold dialog-slide-in">
          🎯 {response}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your strategy... (e.g. 'use quick attack to circle')"
          disabled={disabled}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-electric-yellow/60"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="bg-electric-yellow text-dark-navy px-3 py-2 rounded-lg font-bold text-xs hover:bg-yellow-400 disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
