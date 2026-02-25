import React, { useState } from 'react';

interface StrategyInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

const ninjaKeywords = ['shuriken', 'vanish', 'katana', 'jutsu', 'shadow clone', 'kunai', 'clan'];

export default function StrategyInput({ value, onChange, onSubmit, disabled }: StrategyInputProps) {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      onChange('');
    }
  };

  const detectedKeywords = ninjaKeywords.filter((kw) => value.toLowerCase().includes(kw));

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="block text-[10px] md:text-xs font-bold text-primary/80 mb-1 tracking-widest uppercase">
        🥷 Ninja Strategy
      </label>
      <div className={`flex gap-2 rounded-xl border transition-colors ${focused ? 'border-primary/60' : 'border-border'} bg-card`}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder="Enter your ninja battle strategy…"
          className="flex-1 bg-transparent px-3 py-3 text-xs md:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none disabled:opacity-50 min-h-[44px]"
          style={{ fontSize: '16px' }} // prevent iOS zoom on focus
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-r-xl text-xs font-bold disabled:opacity-40 transition-colors hover:bg-primary/90 min-h-[44px] min-w-[48px] touch-manipulation"
        >
          GO
        </button>
      </div>
      {detectedKeywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {detectedKeywords.map((kw) => (
            <span key={kw} className="text-[9px] px-1.5 py-0.5 bg-primary/20 text-primary rounded-full font-medium">
              {kw}
            </span>
          ))}
        </div>
      )}
    </form>
  );
}
