import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  Download,
  HelpCircle,
  LogOut,
  Share2,
  Swords,
  Trophy,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
import NinjaSilhouette from "../components/NinjaSilhouette";
import type { ElementType } from "../data/ninjaData";
import {
  ELEMENT_ORDER,
  NINJAS,
  getSelectedNinja,
  loadProgress,
  setSelectedNinja,
} from "../data/ninjaData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetTotalPlayers,
} from "../hooks/useQueries";

const QUICK_NAV = [
  {
    to: "/battle" as const,
    label: "Battle",
    icon: Swords,
    desc: "Challenge warriors",
    color: "oklch(0.62 0.23 30)",
  },
  {
    to: "/dojo" as const,
    label: "Dojo",
    icon: Building2,
    desc: "Earn Dojo Seals",
    color: "oklch(0.65 0.19 220)",
  },
  {
    to: "/story" as const,
    label: "Story",
    icon: BookOpen,
    desc: "The Great Journey",
    color: "oklch(0.78 0.17 85)",
  },
  {
    to: "/profile" as const,
    label: "Profile",
    icon: User,
    desc: "Your stats",
    color: "oklch(0.82 0.13 160)",
  },
  {
    to: "/how-to-play" as const,
    label: "How to Play",
    icon: HelpCircle,
    desc: "Ninja Codex",
    color: "oklch(0.80 0.18 300)",
  },
];

export default function GameHome() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: totalPlayers } = useGetTotalPlayers();

  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstallEvent(null);
      setIsInstalled(true);
      toast.success("App installed!");
    }
  };

  const selectedNinja = getSelectedNinja();

  useEffect(() => {
    if (!identity) {
      void navigate({ to: "/" });
    }
  }, [identity, navigate]);

  const handleSelectNinja = (el: ElementType) => {
    setSelectedNinja(el);
    toast.success(`${NINJAS[el].name} selected!`, { duration: 1500 });
  };

  const handleShare = () => {
    const url = window.location.origin;
    const text = `I'm training to become an Elemental Master! Join me on Elemental Ninja 🥷⚡ ${url}`;
    if (navigator.share) {
      void navigator.share({ title: "Elemental Ninja", text, url });
    } else {
      void navigator.clipboard.writeText(text).then(() => {
        toast.success("Share link copied!");
      });
    }
  };

  const ninjaEl: ElementType = selectedNinja ?? "fire";
  const progress = loadProgress(ninjaEl);
  const ninja = NINJAS[ninjaEl];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, oklch(0.14 0.03 270 / 0.8) 0%, oklch(0.08 0.015 270) 60%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: [
            "linear-gradient(oklch(0.78 0.17 85) 1px, transparent 1px)",
            "linear-gradient(90deg, oklch(0.78 0.17 85) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-xs font-body text-muted-foreground tracking-widest uppercase">
              Welcome back
            </span>
            <h1
              className="text-2xl font-display font-black"
              style={{ color: "oklch(0.70 0.21 38)" }}
            >
              {profile?.ninjaName || "Unnamed Ninja"}
            </h1>
            <span className="text-xs font-body text-muted-foreground">
              {profile?.clanName || "No Clan"}
            </span>
          </motion.div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 border-border/50"
            >
              <Share2 size={14} />
              Share
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                clear();
                void navigate({ to: "/" });
              }}
              className="gap-1.5 text-muted-foreground"
            >
              <LogOut size={14} />
              Exit
            </Button>
          </div>
        </div>

        {/* Install the App button */}
        {!isInstalled && (installEvent || isIOS) && !showIOSGuide && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-5"
          >
            <button
              type="button"
              onClick={() => void handleInstall()}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-display font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "oklch(0.11 0.018 270)",
                border: "1.5px solid oklch(0.62 0.23 30 / 0.7)",
                color: "oklch(0.62 0.23 30)",
                boxShadow:
                  "0 0 16px oklch(0.62 0.23 30 / 0.25), inset 0 1px 0 oklch(0.62 0.23 30 / 0.1)",
              }}
            >
              <Download size={16} />
              Install the App — Play Full Screen
            </button>
          </motion.div>
        )}

        {/* iOS install guide */}
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 rounded-xl"
            style={{
              background: "oklch(0.11 0.018 270)",
              border: "1px solid oklch(0.62 0.23 30 / 0.5)",
            }}
          >
            <p
              className="font-display font-bold text-sm mb-2"
              style={{ color: "oklch(0.62 0.23 30)" }}
            >
              Install on iPhone / iPad:
            </p>
            <ol className="text-xs space-y-1 list-decimal list-inside text-muted-foreground">
              <li>
                Tap the <span className="font-bold text-orange-400">Share</span>{" "}
                button in Safari
              </li>
              <li>
                Tap{" "}
                <span className="font-bold text-orange-400">
                  "Add to Home Screen"
                </span>
              </li>
              <li>
                Tap <span className="font-bold text-orange-400">Add</span> —
                done!
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}

        {/* Active ninja display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl mb-6 overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${ninja.colorDark}33 0%, oklch(0.11 0.018 270) 60%)`,
            border: `1px solid ${ninja.color}30`,
          }}
        >
          <div className="flex items-center gap-6 p-6">
            {/* Ninja display */}
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 rounded-full opacity-30 aura-breath"
                style={{
                  background: `radial-gradient(circle, ${ninja.color} 0%, transparent 70%)`,
                }}
              />
              <NinjaSilhouette
                element={ninjaEl}
                size={100}
                isMaster={progress.isEliteMaster}
                animate={true}
                showWeaponEffect={true}
              />
            </div>

            {/* Ninja info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-2xl font-display font-black"
                  style={{ color: ninja.color }}
                >
                  {ninja.name}
                </span>
                {progress.isEliteMaster && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-body font-bold"
                    style={{
                      background: "oklch(0.78 0.17 85 / 0.2)",
                      color: "oklch(0.78 0.17 85)",
                      border: "1px solid oklch(0.78 0.17 85 / 0.4)",
                    }}
                  >
                    ✦ MASTER
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground font-body mb-3">
                {ninja.title} · {ninja.personality}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    label: "HP",
                    value: progress.hp,
                    max: 200,
                    color: "#ef4444",
                  },
                  {
                    label: "ATK",
                    value: progress.atk,
                    max: 150,
                    color: ninja.color,
                  },
                  {
                    label: "DEF",
                    value: progress.def,
                    max: 150,
                    color: "#60a5fa",
                  },
                  {
                    label: "SPD",
                    value: progress.spd,
                    max: 150,
                    color: "#a3e635",
                  },
                ].map(({ label, value, max, color }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground font-body">
                      {label}
                    </span>
                    <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (value / max) * 100)}%`,
                          background: color,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-display font-bold"
                      style={{ color }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Victory count */}
            <div className="text-center shrink-0 hidden sm:block">
              <div
                className="text-3xl font-display font-black"
                style={{ color: "oklch(0.78 0.17 85)" }}
              >
                {progress.victories}
              </div>
              <div className="text-xs text-muted-foreground font-body flex items-center gap-1">
                <Trophy size={10} />
                Victories
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8"
        >
          {QUICK_NAV.map(({ to, label, icon: Icon, desc, color }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <Link to={to}>
                <div
                  className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon size={22} style={{ color }} className="mb-2" />
                  <div
                    className="font-display font-bold text-sm"
                    style={{ color }}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-muted-foreground font-body mt-0.5">
                    {desc}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Choose your ninja */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.78 0.17 85 / 0.3), transparent)",
              }}
            />
            <span className="text-xs font-body text-muted-foreground tracking-widest uppercase">
              Choose Warrior
            </span>
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left, oklch(0.78 0.17 85 / 0.3), transparent)",
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {ELEMENT_ORDER.map((el) => {
              const n = NINJAS[el];
              const p = loadProgress(el);
              const isSelected = ninjaEl === el;
              return (
                <button
                  type="button"
                  key={el}
                  onClick={() => handleSelectNinja(el)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-[1.05] active:scale-[0.97] cursor-pointer"
                  style={{
                    background: isSelected
                      ? `${n.color}22`
                      : "oklch(0.11 0.018 270)",
                    border: `1px solid ${isSelected ? n.color : "oklch(0.22 0.025 270)"}`,
                    outline: "none",
                  }}
                >
                  <NinjaSilhouette
                    element={el}
                    size={56}
                    animate={isSelected}
                    isMaster={p.isEliteMaster}
                    showWeaponEffect={isSelected}
                  />
                  <div className="text-center">
                    <div
                      className="text-[11px] font-display font-bold"
                      style={{ color: isSelected ? n.color : "inherit" }}
                    >
                      {n.name}
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      {p.victories} wins
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Player counter */}
        {totalPlayers != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs text-muted-foreground font-body"
          >
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "oklch(0.62 0.23 30)",
                  boxShadow: "0 0 6px oklch(0.62 0.23 30)",
                }}
              />
              {totalPlayers.toString()} warriors have entered the realm
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
