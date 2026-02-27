import React, { useState, useRef } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

export default function ShareButton() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (status !== 'idle') return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setStatus('copied');
        setTimeout(() => setStatus('idle'), 2500);
      } catch {
        setStatus('fallback');
      }
    } else {
      // Fallback: show the URL in a selectable input
      setStatus('fallback');
    }
  };

  const handleFallbackCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <button
        onClick={handleShare}
        aria-label="Share this game — copy link to clipboard"
        className="
          group relative w-full flex items-center justify-center gap-2
          min-h-[52px] px-6 py-3
          bg-gradient-to-r from-fire-500/20 via-lightning-500/20 to-wind-500/20
          border border-primary/40 rounded-2xl
          font-black tracking-widest uppercase text-sm
          text-primary
          hover:from-fire-500/30 hover:via-lightning-500/30 hover:to-wind-500/30
          hover:border-primary/70 hover:shadow-[0_0_18px_rgba(var(--primary-rgb),0.35)]
          active:scale-95 transition-all duration-200
          touch-manipulation
          overflow-hidden
        "
        style={{ fontFamily: "'Bangers', 'Impact', cursive", letterSpacing: '0.12em' }}
      >
        {/* Animated shimmer */}
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {status === 'copied' ? (
          <>
            <Check size={18} className="text-green-400 shrink-0" />
            <span className="text-green-400">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 size={18} className="shrink-0" />
            <span>Share This Game</span>
          </>
        )}
      </button>

      {/* Fallback: selectable URL input */}
      {status === 'fallback' && (
        <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            ref={inputRef}
            readOnly
            value={currentUrl}
            aria-label="Game URL — tap to select and copy"
            className="
              flex-1 min-w-0 px-3 py-2 rounded-xl
              bg-card border border-border
              text-xs text-muted-foreground
              focus:outline-none focus:border-primary/60
              select-all
            "
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={handleFallbackCopy}
            aria-label="Copy URL"
            className="
              shrink-0 flex items-center justify-center
              w-10 h-10 rounded-xl
              bg-primary/20 border border-primary/40
              text-primary hover:bg-primary/30
              active:scale-95 transition-all touch-manipulation
            "
          >
            <Copy size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
