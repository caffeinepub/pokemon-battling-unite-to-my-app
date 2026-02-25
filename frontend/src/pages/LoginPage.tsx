import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Zap, Star } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity, isLoggingIn } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Redirect authenticated users
  useEffect(() => {
    if (!isAuthenticated || profileLoading || !isFetched) return;
    if (profile === null) {
      navigate({ to: '/intro' });
    } else {
      navigate({ to: '/game' });
    }
  }, [isAuthenticated, profile, profileLoading, isFetched, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1A1A2E 50%, #16213E 100%)',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 14 + 6}px`,
              animationDelay: `${Math.random() * 3}s`,
              color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#00A1E4' : '#ffffff',
              opacity: Math.random() * 0.6 + 0.2,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Electric border decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-electric-yellow to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-electric-yellow to-transparent opacity-60" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Logo */}
        <div className="mb-8 fade-in-up">
          <img
            src="/assets/generated/app-logo.dim_600x200.png"
            alt="Ash's Pokemon Journey"
            className="w-72 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Pikachu */}
        <div className="mb-6 pokemon-bounce">
          <img
            src="/assets/generated/pikachu-starter.dim_256x256.png"
            alt="Pikachu"
            className="w-40 h-40 object-contain drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 20px #FFD700)' }}
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8 fade-in-up">
          <h1 className="font-anime text-4xl text-electric-yellow tracking-widest mb-2 text-shadow-glow">
            ASH'S JOURNEY
          </h1>
          <p className="text-white/70 text-lg">
            Become a Pokémon Master!
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-electric-yellow fill-electric-yellow" />
            ))}
          </div>
        </div>

        {/* Login card */}
        <div className="w-full bg-black/60 border-2 border-electric-yellow/30 rounded-2xl p-8 backdrop-blur-sm fade-in-up">
          <div className="text-center mb-6">
            <p className="text-white/80 text-base leading-relaxed">
              Begin your Pokémon adventure as{' '}
              <span className="text-electric-yellow font-bold">Ash Ketchum</span>!
              Battle gym leaders, collect badges, and become the World Champion!
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoggingIn || (isAuthenticated && profileLoading)}
            className="w-full bg-electric-yellow text-dark-navy font-anime text-2xl py-4 rounded-xl hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-electric anime-btn flex items-center justify-center gap-3"
          >
            {isLoggingIn || (isAuthenticated && profileLoading) ? (
              <>
                <div className="w-5 h-5 border-2 border-dark-navy border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                <span>START ADVENTURE!</span>
              </>
            )}
          </button>

          <p className="text-white/30 text-xs text-center mt-4">
            Secure login powered by Internet Identity
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mt-6 w-full fade-in-up">
          {[
            { emoji: '⚡', label: 'Real-time Battles' },
            { emoji: '🏅', label: 'Gym Badges' },
            { emoji: '✨', label: 'Evolution' },
          ].map((f) => (
            <div
              key={f.label}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
            >
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="text-white/60 text-xs font-bold">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center">
        <p className="text-white/20 text-xs">
          Built with <span className="text-red-400">❤️</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'ashs-pokemon-journey')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric-yellow/60 hover:text-electric-yellow transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
