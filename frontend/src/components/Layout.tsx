import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, Swords, Building2, Users, User, ScrollText, Menu, X, ShoppingBag } from 'lucide-react';

const navItems = [
  { path: '/game', label: 'Home', icon: Home },
  { path: '/battle', label: 'Battle', icon: Swords },
  { path: '/gyms', label: 'Dojos', icon: Building2 },
  { path: '/roster', label: 'Roster', icon: Users },
  { path: '/shop', label: '💎 Shop', icon: ShoppingBag },
  { path: '/lore', label: 'Lore', icon: ScrollText },
  { path: '/profile', label: 'Profile', icon: User },
];

const mobileBottomNav = [
  { path: '/game', label: 'Home', icon: Home },
  { path: '/battle', label: 'Battle', icon: Swords },
  { path: '/gyms', label: 'Dojos', icon: Building2 },
  { path: '/roster', label: 'Roster', icon: Users },
  { path: '/shop', label: 'Shop', icon: ShoppingBag },
  { path: '/profile', label: 'Profile', icon: User },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Header */}
      <header className="hidden md:flex sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4">
          <Link to="/game" className="flex items-center gap-2 mr-6">
            <span className="text-xl font-bold text-primary tracking-wider">⚡ NINJA QUEST</span>
          </Link>
          <nav className="flex items-center gap-1 flex-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="flex h-12 items-center justify-between px-4">
          <Link to="/game" className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary tracking-wider">⚡ NINJA QUEST</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border/40 bg-background/98 backdrop-blur">
            <nav className="flex flex-col py-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content — add bottom padding on mobile for bottom nav */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/98 backdrop-blur-md">
        <div className="flex items-stretch h-16">
          {mobileBottomNav.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[48px] transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all ${active ? 'bg-primary/20' : ''}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] font-medium leading-none ${active ? 'text-primary' : ''}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer — hidden on mobile to save space */}
      <footer className="hidden md:block border-t border-border/40 bg-background/80 py-4 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Ninja Quest &nbsp;·&nbsp; Built with{' '}
          <span className="text-red-500">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'ninja-quest')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
