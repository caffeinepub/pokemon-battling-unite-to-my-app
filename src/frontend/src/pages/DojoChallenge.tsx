import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Lock, Swords } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import NinjaSilhouette from "../components/NinjaSilhouette";
import type { ElementType } from "../data/ninjaData";
import {
  DOJO_MASTERS,
  NINJAS,
  loadProgress,
  saveProgress,
} from "../data/ninjaData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const ELEMENT_BG: Record<ElementType, string> = {
  fire: "radial-gradient(ellipse at 50% 80%, oklch(0.22 0.06 30 / 0.7) 0%, oklch(0.08 0.015 270) 70%)",
  water:
    "radial-gradient(ellipse at 50% 80%, oklch(0.18 0.06 220 / 0.7) 0%, oklch(0.08 0.015 270) 70%)",
  air: "radial-gradient(ellipse at 50% 80%, oklch(0.20 0.05 160 / 0.7) 0%, oklch(0.08 0.015 270) 70%)",
  earth:
    "radial-gradient(ellipse at 50% 80%, oklch(0.20 0.05 65 / 0.7) 0%, oklch(0.08 0.015 270) 70%)",
};

interface BattleResult {
  won: boolean;
  dojoId: string;
  element: ElementType;
}

export default function DojoChallenge() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [selectedDojo, setSelectedDojo] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isBattling, setIsBattling] = useState(false);

  if (!identity) {
    void navigate({ to: "/" });
    return null;
  }

  const completedDojos = new Set<string>();
  for (const dojo of DOJO_MASTERS) {
    const progress = loadProgress(dojo.element);
    if (progress.dojoSeals.includes(dojo.id)) {
      completedDojos.add(dojo.id);
    }
  }

  const handleChallenge = (dojoId: string, element: ElementType) => {
    setIsBattling(true);
    setSelectedDojo(dojoId);

    // Simulated battle — outcome based on player strength vs dojo difficulty
    setTimeout(() => {
      const progress = loadProgress(element);
      const ninjaData = NINJAS[element];
      const powerScore = progress.atk + progress.def + progress.spd;
      const difficultyMap: Record<string, number> = {
        "★★★": 200,
        "★★★★": 280,
        "★★★★★": 380,
      };
      const dojo = DOJO_MASTERS.find((d) => d.id === dojoId);
      if (!dojo) return;

      const required = difficultyMap[dojo.difficulty] ?? 200;
      const baseChance = Math.min(
        0.9,
        Math.max(0.25, (powerScore / required) * 0.7),
      );
      const won = Math.random() < baseChance;

      if (won) {
        // Award the seal
        const updatedSeals = [...new Set([...progress.dojoSeals, dojoId])];
        saveProgress(element, { ...progress, dojoSeals: updatedSeals });
        toast.success(`${dojo.reward} earned! Dojo Sealed!`, {
          duration: 3000,
        });
      } else {
        const deficit = Math.round(required - powerScore);
        toast.error(
          `Defeated! Train ${deficit} more power to conquer this dojo.`,
          { duration: 4000 },
        );
      }

      setIsBattling(false);
      setBattleResult({ won, dojoId, element });
      void ninjaData;
    }, 2000);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, oklch(0.12 0.025 270 / 0.8) 0%, oklch(0.08 0.015 270) 70%)",
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="jp-accent text-muted-foreground mb-1">道場挑戦</div>
          <h1
            className="text-3xl md:text-4xl font-display font-black"
            style={{ color: "oklch(0.70 0.21 38)" }}
          >
            DOJO CHALLENGES
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-2">
            Defeat each Dojo Master to earn their elemental seal
          </p>
        </motion.div>

        {/* Dojo cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOJO_MASTERS.map((dojo, i) => {
            const ninja = NINJAS[dojo.element];
            const isCompleted = completedDojos.has(dojo.id);
            const isActive = selectedDojo === dojo.id;
            const progress = loadProgress(dojo.element);

            return (
              <motion.div
                key={dojo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden relative"
                style={{
                  background: isActive
                    ? ELEMENT_BG[dojo.element]
                    : `${ninja.color}0a`,
                  border: `1px solid ${isActive ? ninja.color : `${ninja.color}30`}`,
                }}
              >
                {/* Completed overlay */}
                {isCompleted && (
                  <div className="absolute top-3 right-3 z-10">
                    <CheckCircle
                      size={22}
                      style={{ color: "oklch(0.75 0.18 160)" }}
                    />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Dojo master ninja */}
                    <div className="shrink-0 relative">
                      <div
                        className="absolute inset-0 rounded-full opacity-40"
                        style={{
                          background: `radial-gradient(circle, ${ninja.color} 0%, transparent 70%)`,
                        }}
                      />
                      <NinjaSilhouette
                        element={dojo.element}
                        size={72}
                        facing="right"
                        animate={isActive}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-lg font-display font-black"
                          style={{ color: ninja.color }}
                        >
                          {dojo.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-body">
                          {dojo.difficulty}
                        </span>
                      </div>
                      <div className="text-xs font-body text-muted-foreground mb-2">
                        {dojo.title}
                      </div>
                      <p className="text-xs font-body text-muted-foreground leading-relaxed mb-3">
                        {dojo.description}
                      </p>

                      {/* Reward */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-body"
                          style={{
                            background: isCompleted
                              ? "oklch(0.75 0.18 160 / 0.2)"
                              : `${ninja.color}20`,
                            color: isCompleted
                              ? "oklch(0.75 0.18 160)"
                              : ninja.color,
                            border: `1px solid ${isCompleted ? "oklch(0.75 0.18 160 / 0.4)" : `${ninja.color}40`}`,
                          }}
                        >
                          {isCompleted ? "✓ " : ""}
                          {dojo.reward}
                        </span>
                      </div>

                      {/* Your power vs required */}
                      <div className="text-[10px] text-muted-foreground font-body mb-3">
                        Your power: {progress.atk + progress.def + progress.spd}{" "}
                        pts
                      </div>

                      {/* Challenge button */}
                      {isCompleted ? (
                        <div
                          className="text-xs font-body"
                          style={{ color: "oklch(0.75 0.18 160)" }}
                        >
                          ✦ Dojo Mastered
                        </div>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleChallenge(dojo.id, dojo.element)}
                          disabled={isBattling}
                          className="gap-1.5 font-display font-bold h-8 text-xs"
                          style={{
                            background: `${ninja.color}cc`,
                            border: "none",
                            color: "oklch(0.06 0.01 270)",
                          }}
                        >
                          {isBattling && isActive ? (
                            <span className="flex items-center gap-1">
                              <div
                                className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                                style={{
                                  borderColor: `${ninja.color}44`,
                                  borderTopColor: ninja.color,
                                }}
                              />
                              Battling…
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Swords size={12} /> Challenge
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Battle result notification */}
        <AnimatePresence>
          {battleResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-center"
              style={{
                background: battleResult.won
                  ? "oklch(0.20 0.06 160 / 0.95)"
                  : "oklch(0.15 0.04 25 / 0.95)",
                border: `1px solid ${battleResult.won ? "oklch(0.75 0.18 160)" : "oklch(0.55 0.22 25)"}`,
              }}
            >
              <div
                className="font-display font-black text-lg"
                style={{
                  color: battleResult.won ? "oklch(0.75 0.18 160)" : "#ef4444",
                }}
              >
                {battleResult.won
                  ? "✦ VICTORY! Seal Earned!"
                  : "✗ Defeated — Train More!"}
              </div>
              <button
                type="button"
                className="text-xs text-muted-foreground mt-1 hover:text-foreground"
                onClick={() => setBattleResult(null)}
              >
                dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Locked content preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 rounded-xl"
          style={{
            background: "oklch(0.11 0.018 270)",
            border: "1px solid oklch(0.22 0.025 270)",
          }}
        >
          <div className="flex items-center gap-3">
            <Lock
              size={18}
              className="text-muted-foreground shrink-0"
              style={{ color: "oklch(0.78 0.17 85)" }}
            />
            <div>
              <div
                className="font-display font-bold text-sm"
                style={{ color: "oklch(0.78 0.17 85)" }}
              >
                Grand Tournament
              </div>
              <div className="text-xs text-muted-foreground font-body">
                Earn all 4 Dojo Seals to unlock the Grand Tournament and face
                the Dragon Master
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {DOJO_MASTERS.map((dojo) => {
              const done = completedDojos.has(dojo.id);
              const n = NINJAS[dojo.element];
              return (
                <div
                  key={dojo.id}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-black"
                  style={{
                    background: done ? `${n.color}33` : "oklch(0.15 0.02 270)",
                    border: `2px solid ${done ? n.color : "oklch(0.25 0.03 270)"}`,
                    color: done ? n.color : "oklch(0.40 0.04 270)",
                  }}
                >
                  {n.kanjiLabel}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
