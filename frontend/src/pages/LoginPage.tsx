import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

// Detect mobile once
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

// Reduced particle count on mobile
const PARTICLE_COUNT = isMobile ? 8 : 20;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, isInitializing } = useInternetIdentity();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/game' });
    }
  }, [identity, navigate]);

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Animated background particles — reduced on mobile */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-spark"
            style={{
              width: `${4 + (i % 4) * 3}px`,
              height: `${4 + (i % 4) * 3}px`,
              background: ['#ef4444', '#3b82f6', '#eab308', '#7c3aed', '#06b6d4'][i % 5],
              left: `${(i * 37 + 10) % 90}%`,
              top: `${(i * 53 + 5) % 85}%`,
              animationDelay: `${(i * 0.4) % 3}s`,
              animationDuration: `${3 + (i % 3)}s`,
              // Simpler animation on mobile
              willChange: isMobile ? 'auto' : 'transform',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Logo */}
        <div className="relative">
          <img
            src="/assets/generated/app-logo.dim_600x200.png"
            alt="Ninja Quest"
            className="w-64 md:w-80 object-contain"
          />
        </div>

        {/* Subtitle */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mt-1">Master the elemental arts</p>
        </div>

        {/* Login Button */}
        <button
          onClick={() => login()}
          disabled={isLoggingIn || isInitializing}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg tracking-wider shadow-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60 min-h-[56px] touch-manipulation"
        >
          {isLoggingIn ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            '⚡ BEGIN YOUR JOURNEY'
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Secure login via Internet Identity
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-muted-foreground/60">
        Built with <span className="text-red-400">♥</span> using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'ninja-quest')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/70 hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
