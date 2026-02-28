import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Share2, Star, Swords, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import NinjaSilhouette from "../components/NinjaSilhouette";
import type { ElementType } from "../data/ninjaData";
import {
  DOJO_MASTERS,
  ELEMENT_ORDER,
  NINJAS,
  getSelectedNinja,
  loadProgress,
} from "../data/ninjaData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetTotalPlayers,
} from "../hooks/useQueries";

export default function NinjaProfile() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const { data: totalPlayers } = useGetTotalPlayers();

  if (!identity) {
    void navigate({ to: "/" });
    return null;
  }

  const selectedEl: ElementType = getSelectedNinja() ?? "fire";
  const progress = loadProgress(selectedEl);
  const ninja = NINJAS[selectedEl];

  const handleShare = () => {
    const url = window.location.origin;
    const text = `I've won ${progress.victories} battles as the ${ninja.name} in Elemental Ninja! 🥷⚡ ${url}`;
    if (navigator.share) {
      void navigator.share({ title: "Elemental Ninja", text, url });
    } else {
      void navigator.clipboard.writeText(text).then(() => {
        toast.success("Profile link copied!");
      });
    }
  };

  const STAT_ITEMS = [
    {
      label: "Victories",
      value: progress.victories,
      icon: <Trophy size={14} />,
      color: "oklch(0.78 0.17 85)",
    },
    {
      label: "ATK",
      value: progress.atk,
      icon: <Swords size={14} />,
      color: ninja.color,
    },
    {
      label: "DEF",
      value: progress.def,
      icon: <Star size={14} />,
      color: "#60a5fa",
    },
    {
      label: "SPD",
      value: progress.spd,
      icon: <Star size={14} />,
      color: "#a3e635",
    },
    {
      label: "HP",
      value: progress.hp,
      icon: <Star size={14} />,
      color: "#ef4444",
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, oklch(0.14 0.03 270 / 0.8) 0%, oklch(0.08 0.015 270) 60%)",
      }}
    >
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="jp-accent text-muted-foreground">
              忍者プロフィール
            </div>
            <h1
              className="text-2xl font-display font-black"
              style={{ color: "oklch(0.70 0.21 38)" }}
            >
              NINJA PROFILE
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5"
          >
            <Share2 size={14} /> Share
          </Button>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-6"
          style={{
            background: `linear-gradient(135deg, ${ninja.colorDark}33 0%, oklch(0.11 0.018 270) 60%)`,
            border: `1px solid ${ninja.color}30`,
          }}
        >
          <div className="flex items-center gap-5">
            {/* Ninja */}
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 rounded-full opacity-40 aura-breath"
                style={{
                  background: `radial-gradient(circle, ${ninja.color} 0%, transparent 70%)`,
                }}
              />
              <NinjaSilhouette
                element={selectedEl}
                size={110}
                isMaster={progress.isEliteMaster}
                animate={true}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-2xl font-display font-black"
                  style={{ color: ninja.color }}
                >
                  {profile?.ninjaName || "Unnamed Ninja"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground font-body mb-1">
                {profile?.clanName || "No Clan"}
              </div>
              <div className="text-xs font-body" style={{ color: ninja.color }}>
                {ninja.title} · {ninja.personality}
              </div>

              {progress.isEliteMaster && (
                <div
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-body font-bold text-xs gold-glow"
                  style={{
                    background: "oklch(0.78 0.17 85 / 0.15)",
                    color: "oklch(0.78 0.17 85)",
                    border: "1px solid oklch(0.78 0.17 85 / 0.4)",
                  }}
                >
                  ✦ ELEMENTAL MASTER
                </div>
              )}

              {!progress.isEliteMaster && (
                <div className="mt-2 text-[10px] text-muted-foreground font-body">
                  {10 - Math.min(progress.victories, 10)} more victories to
                  become Elemental Master
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-5 gap-2 mb-6"
        >
          {STAT_ITEMS.map(({ label, value, icon, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl"
              style={{
                background: "oklch(0.11 0.018 270)",
                border: "1px solid oklch(0.22 0.025 270)",
              }}
            >
              <div style={{ color }}>{icon}</div>
              <div
                className="text-xl font-display font-black"
                style={{ color }}
              >
                {value}
              </div>
              <div className="text-[10px] text-muted-foreground font-body">
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* All ninjas overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "oklch(0.11 0.018 270)",
            border: "1px solid oklch(0.22 0.025 270)",
          }}
        >
          <div className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-4">
            All Warriors
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ELEMENT_ORDER.map((el) => {
              const n = NINJAS[el];
              const p = loadProgress(el);
              const isActive = el === selectedEl;
              return (
                <div
                  key={el}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl"
                  style={{
                    background: isActive ? `${n.color}18` : "transparent",
                    border: `1px solid ${isActive ? `${n.color}40` : "oklch(0.22 0.025 270)"}`,
                  }}
                >
                  <NinjaSilhouette
                    element={el}
                    size={50}
                    isMaster={p.isEliteMaster}
                    animate={isActive}
                  />
                  <div className="text-center">
                    <div
                      className="text-[11px] font-display font-bold"
                      style={{ color: n.color }}
                    >
                      {n.name}
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      {p.victories} wins
                    </div>
                    {p.isEliteMaster && (
                      <div
                        className="text-[9px]"
                        style={{ color: "oklch(0.78 0.17 85)" }}
                      >
                        ✦ Master
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Dojo seals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "oklch(0.11 0.018 270)",
            border: "1px solid oklch(0.22 0.025 270)",
          }}
        >
          <div className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-4">
            Dojo Seals
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DOJO_MASTERS.map((dojo) => {
              const n = NINJAS[dojo.element];
              const p = loadProgress(dojo.element);
              const hasSealed = p.dojoSeals.includes(dojo.id);
              return (
                <div
                  key={dojo.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl"
                  style={{
                    background: hasSealed ? `${n.color}15` : "transparent",
                    border: `1px solid ${hasSealed ? `${n.color}40` : "oklch(0.20 0.025 270)"}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-display font-black"
                    style={{
                      background: hasSealed
                        ? `${n.color}30`
                        : "oklch(0.15 0.02 270)",
                      color: hasSealed ? n.color : "oklch(0.35 0.04 270)",
                    }}
                  >
                    {n.kanjiLabel}
                  </div>
                  <div className="text-center">
                    <div
                      className="text-[10px] font-body"
                      style={{
                        color: hasSealed ? n.color : "oklch(0.40 0.04 270)",
                      }}
                    >
                      {dojo.reward}
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      {hasSealed ? "✓ Earned" : "Locked"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Player count */}
        {totalPlayers != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground font-body"
          >
            You are 1 of {totalPlayers.toString()} warriors in the realm
          </motion.div>
        )}
      </div>
    </div>
  );
}
