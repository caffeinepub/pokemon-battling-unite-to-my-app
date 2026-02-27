import React, { useMemo, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetTotalPlayers, useRecordPlayerLogin } from '../hooks/useQueries';
import { Swords, BookOpen, Building2, Users, User, ScrollText, ShoppingBag } from 'lucide-react';
import ShareButton from '../components/ShareButton';

// Detect mobile once at module level
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
const PARTICLE_COUNT = isMobile ? 6 : 15;

const navCards = [
  {
    path: '/battle',
    label: 'Battle',
    description: 'Challenge opponents',
    icon: Swords,
    color: '#ef4444',
    emoji: '⚔️',
  },
  {
    path: '/story',
    label: 'Story',
    description: 'Follow the campaign',
    icon: BookOpen,
    color: '#eab308',
    emoji: '📖',
  },
  {
    path: '/gyms',
    label: 'Dojos',
    description: 'Earn elemental seals',
    icon: Building2,
    color: '#3b82f6',
    emoji: '🏯',
  },
  {
    path: '/roster',
    label: 'Roster',
    description: 'Manage your squad',
    icon: Users,
    color: '#06b6d4',
    emoji: '🥷',
  },
  {
    path: '/shop',
    label: 'Crystal Shop',
    description: 'Buy elemental crystals',
    icon: ShoppingBag,
    color: '#a855f7',
    emoji: '💎',
  },
  {
    path: '/lore',
    label: 'Game Lore',
    description: 'Discover the world',
    icon: ScrollText,
    color: '#7c3aed',
    emoji: '📜',
  },
  {
    path: '/profile',
    label: 'Profile',
    description: 'Your ninja record',
    icon: User,
    color: '#a16207',
    emoji: '👤',
  },
];

export default function GameHome() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: totalPlayers, isLoading: playersLoading } = useGetTotalPlayers();
  const recordLogin = useRecordPlayerLogin();
  const loginRecordedRef = useRef(false);

  // Record player login once per session
  useEffect(() => {
    if (identity && !loginRecordedRef.current) {
      const sessionKey = `loginRecorded_${identity.getPrincipal().toString()}`;
      if (!sessionStorage.getItem(sessionKey)) {
        loginRecordedRef.current = true;
        recordLogin.mutate(undefined, {
          onSuccess: () => {
            sessionStorage.setItem(sessionKey, '1');
          },
          onError: () => {
            loginRecordedRef.current = false;
          },
        });
      } else {
        loginRecordedRef.current = true;
      }
    }
  }, [identity]); // eslint-disable-line react-hooks/exhaustive-deps

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        size: 4 + (i % 4) * 3,
        color: ['#ef4444', '#3b82f6', '#eab308', '#7c3aed', '#06b6d4'][i % 5],
        left: `${(i * 37 + 10) % 90}%`,
        top: `${(i * 53 + 5) % 85}%`,
        delay: `${(i * 0.4) % 3}s`,
        duration: `${3 + (i % 3)}s`,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background particles — reduced on mobile */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full opacity-10 animate-float-spark"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
              willChange: isMobile ? 'auto' : 'transform',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-3 py-4 md:px-6 md:py-8">
        {/* Profile Header */}
        <div className="flex items-center gap-3 mb-4 p-3 md:p-4 bg-card/80 border border-border rounded-2xl backdrop-blur-sm">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl shrink-0">
            🥷
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-black text-base md:text-lg text-foreground truncate">
              {userProfile?.ninjaName || 'Ninja Warrior'}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {userProfile?.clanName || 'Unknown Clan'} · {Number(userProfile?.victories || 0)} victories
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">Seals</p>
            <p className="text-lg font-bold text-primary">{Number(userProfile?.dojoSeals || 0)}</p>
          </div>
        </div>

        {/* Total Ninjas Joined Counter */}
        <div className="mb-4 p-3 md:p-4 bg-card/80 border border-primary/30 rounded-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Glow accent */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, oklch(0.55 0.22 280 / 0.15) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">🌍</span>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                  Total Ninjas Joined
                </p>
                <p className="text-[10px] text-muted-foreground/60">Unique warriors across all clans</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              {playersLoading ? (
                <div className="w-16 h-8 bg-primary/10 rounded-lg animate-pulse" />
              ) : (
                <p
                  className="text-2xl md:text-3xl font-black text-primary tracking-wider"
                  style={{ fontFamily: "'Bangers', cursive", letterSpacing: '0.05em' }}
                >
                  {Number(totalPlayers ?? 0).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Share This Game Button */}
        <div className="mb-5">
          <ShareButton />
        </div>

        {/* Navigation Cards — 2 columns on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {navCards.map(({ path, label, description, icon: Icon, color, emoji }) => (
            <button
              key={path}
              onClick={() => navigate({ to: path })}
              className="group flex flex-col items-start gap-2 p-3 md:p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all text-left touch-manipulation"
              style={{ minHeight: '90px' }}
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0"
                style={{ background: `${color}22` }}
              >
                {emoji}
              </div>
              <div className="min-w-0 w-full">
                <p className="font-bold text-sm text-foreground leading-tight">{label}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                  {description}
                </p>
              </div>
              {/* Icon used to avoid unused import warning */}
              <Icon className="hidden" size={0} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
