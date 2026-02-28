import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  HelpCircle,
  Home,
  Menu,
  Swords,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import InstallPrompt from "./InstallPrompt";

const NAV_ITEMS = [
  { path: "/game", label: "Home", icon: Home },
  { path: "/battle", label: "Battle", icon: Swords },
  { path: "/dojo", label: "Dojo", icon: Building2 },
  { path: "/story", label: "Story", icon: BookOpen },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/how-to-play", label: "Codex", icon: HelpCircle },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = location.pathname === "/";
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — hidden on login */}
      {!isLoginPage && (
        <>
          {/* Desktop Header */}
          <header className="hidden md:flex sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
            <div className="container flex h-14 max-w-screen-2xl items-center px-6 gap-4">
              <Link
                to="/game"
                className="flex items-center gap-2 mr-6 shrink-0"
              >
                <span
                  className="text-lg font-display font-black tracking-tight"
                  style={{ color: "oklch(0.70 0.21 38)" }}
                >
                  ⚡ ELEMENTAL NINJA
                </span>
              </Link>
              <nav className="flex items-center gap-1 flex-1">
                {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={[
                      "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all",
                      isActive(path)
                        ? "text-primary bg-primary/15"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    ].join(" ")}
                  >
                    <Icon size={14} />
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
                <span
                  className="text-base font-display font-black tracking-tight"
                  style={{ color: "oklch(0.70 0.21 38)" }}
                >
                  ⚡ ELEMENTAL NINJA
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {mobileOpen && (
              <nav className="border-t border-border/40 bg-background/98 flex flex-col py-2">
                {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                      isActive(path)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                    ].join(" ")}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                ))}
              </nav>
            )}
          </header>
        </>
      )}

      {/* Main */}
      <main
        className={["flex-1", !isLoginPage ? "pb-16 md:pb-0" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      {!isLoginPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/98 backdrop-blur-md">
          <div className="flex items-stretch h-16">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={[
                    "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "p-1 rounded-lg transition-all",
                      active ? "bg-primary/20" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                  </div>
                  <span className="text-[9px] font-medium leading-none">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Footer */}
      {!isLoginPage && (
        <footer className="hidden md:block border-t border-border/30 bg-background/80 py-3 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Elemental Ninja &nbsp;·&nbsp; Built
            with <span style={{ color: "#ef4444" }}>♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      )}
    </div>
  );
}
