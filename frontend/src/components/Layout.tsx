import React from 'react';
import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Zap, Map, Sword, User, Package, Home } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const navItems = [
    { path: '/game', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { path: '/story', icon: <Map className="w-5 h-5" />, label: 'Story' },
    { path: '/gyms', icon: <Sword className="w-5 h-5" />, label: 'Gyms' },
    { path: '/roster', icon: <Package className="w-5 h-5" />, label: 'Roster' },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  const isGameRoute = ['/battle', '/intro', '/starter-selection'].some((r) =>
    location.pathname.startsWith(r)
  );

  return (
    <div className="min-h-screen bg-dark-navy flex flex-col">
      {/* Header */}
      {!isGameRoute && (
        <header className="bg-black/80 border-b border-electric-yellow/20 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/game' })}
              className="flex items-center gap-2"
            >
              <img
                src="/assets/generated/app-logo.dim_600x200.png"
                alt="Ash's Pokemon Journey"
                className="h-10 object-contain"
              />
            </button>

            <div className="flex items-center gap-2">
              {identity && (
                <button
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white text-sm font-bold px-3 py-1 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom navigation (game screens) */}
      {!isGameRoute && identity && (
        <nav className="bg-black/90 border-t border-electric-yellow/20 sticky bottom-0 z-40">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-around py-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate({ to: item.path as '/' })}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'text-electric-yellow bg-electric-yellow/10'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Footer */}
      {!isGameRoute && (
        <footer className="bg-black/60 border-t border-white/5 py-3 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Ash's Pokemon Journey — Built with{' '}
            <span className="text-red-400">❤️</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'ashs-pokemon-journey')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-yellow hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      )}
    </div>
  );
}
