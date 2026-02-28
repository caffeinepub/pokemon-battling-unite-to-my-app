import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import NinjaSilhouette from "../components/NinjaSilhouette";
import WeaponAttackEffect from "../components/WeaponAttackEffect";
import type { ElementType, NinjaMove } from "../data/ninjaData";
import {
  ELEMENT_ORDER,
  NINJAS,
  OPPONENTS,
  getSelectedNinja,
  getXpProgress,
  loadProgress,
  recordVictory,
  saveProgress,
} from "../data/ninjaData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ── Types ─────────────────────────────────────────────────────────────────

interface BattleNinja {
  element: ElementType;
  currentHp: number;
  maxHp: number;
  atk: number;
  def: number;
  spd: number;
  isRaging: boolean;
  isConfused: boolean;
  isBurned: boolean;
  isParalyzed: boolean;
  isMaster: boolean;
  moveCooldowns: Record<string, number>;
  dragonUsed: boolean;
  dodging: boolean;
}

type BattlePhase =
  | "select"
  | "intro"
  | "entering"
  | "battle"
  | "victory"
  | "defeat";
type ClashType = "clash" | "win" | "lose";

interface ActiveEffect {
  weaponType: "sword" | "spear" | "fan" | "hammer";
  animationType: string;
  element: ElementType;
  fromPlayer: boolean;
  color: string;
}

interface FloatingText {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function calcDamage(
  move: NinjaMove,
  atkStat: number,
  defStat: number,
  isRaging: boolean,
  isCrit = false,
): number {
  const atk = isRaging ? atkStat * 1.35 : atkStat;
  const def = Math.max(1, defStat);
  const base = (move.power * atk) / def;
  const roll = 0.85 + Math.random() * 0.3;
  const crit = isCrit ? 1.6 : 1;
  return Math.max(1, Math.round(base * roll * crit * 0.5));
}

// ── MoveButton (circular) ─────────────────────────────────────────────────

interface MoveButtonProps {
  move: NinjaMove;
  color: string;
  disabled: boolean;
  onUse: () => void;
  isOnCooldown: boolean;
}

function MoveButton({
  move,
  color,
  disabled,
  onUse,
  isOnCooldown,
}: MoveButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onUse}
      disabled={disabled || isOnCooldown}
      whileHover={!disabled && !isOnCooldown ? { scale: 1.12 } : {}}
      whileTap={!disabled && !isOnCooldown ? { scale: 0.88 } : {}}
      className="relative flex flex-col items-center justify-center rounded-full select-none"
      style={{
        width: 64,
        height: 64,
        background:
          isOnCooldown || disabled
            ? "oklch(0.16 0.02 270)"
            : `radial-gradient(circle at 35% 30%, ${color}ee, ${color}66)`,
        border: `2px solid ${move.isUltimate ? "#ffd70088" : isOnCooldown ? "oklch(0.25 0.02 270)" : `${color}88`}`,
        boxShadow:
          !isOnCooldown && !disabled
            ? `0 0 16px ${color}55, inset 0 1px 0 ${color}44`
            : "none",
        cursor: isOnCooldown || disabled ? "not-allowed" : "pointer",
        opacity: isOnCooldown || disabled ? 0.5 : 1,
        transition: "all 0.15s ease",
      }}
      aria-label={move.name}
      title={`${move.name} — Power: ${move.power}`}
    >
      {move.isUltimate && !isOnCooldown && (
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: "#ffd700", fontSize: 8, fontWeight: 900 }}
        >
          ★
        </div>
      )}
      <span
        className="font-display font-black text-center leading-tight px-0.5"
        style={{
          fontSize: "6.5px",
          maxWidth: 58,
          wordBreak: "break-word",
          color: isOnCooldown ? "oklch(0.45 0.02 270)" : "#fff",
          lineHeight: 1.15,
        }}
      >
        {move.name.toUpperCase()}
      </span>
      {!isOnCooldown && (
        <span
          style={{ fontSize: "8px", marginTop: 1, opacity: 0.7, color: "#fff" }}
        >
          {move.power}
        </span>
      )}
      {isOnCooldown && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid oklch(0.35 0.04 270)",
            animation: "dangerPulse 0.8s ease-in-out infinite",
          }}
        />
      )}
    </motion.button>
  );
}

// ── HP Bar ────────────────────────────────────────────────────────────────

function HpBar({
  ninja,
  label,
  align = "left",
}: { ninja: BattleNinja; label: string; align?: "left" | "right" }) {
  if (!ninja) return null;
  const pct = Math.max(0, (ninja.currentHp / ninja.maxHp) * 100);
  const isDanger = pct < 25;
  const color = NINJAS[ninja.element]?.color ?? "#fff";
  return (
    <div
      className={`flex flex-col gap-1 min-w-0 ${align === "right" ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex items-center gap-2 w-full ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        <span
          className="text-xs font-display font-bold truncate"
          style={{ color }}
        >
          {label}
        </span>
        <span
          className={`text-[10px] font-body ml-auto ${isDanger ? "danger-pulse text-red-400" : "text-muted-foreground"}`}
        >
          {ninja.currentHp}/{ninja.maxHp}
        </span>
      </div>
      <div className="h-3 bg-muted/40 rounded-full overflow-hidden w-full">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isDanger ? "danger-pulse" : ""}`}
          style={{ width: `${pct}%`, background: isDanger ? "#ef4444" : color }}
        />
      </div>
      {/* Status effects */}
      <div className="flex gap-1 flex-wrap">
        {ninja.isConfused && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full font-body"
            style={{ background: "#ffd70033", color: "#ffd700" }}
          >
            😵 Confused
          </span>
        )}
        {ninja.isRaging && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full font-body"
            style={{ background: "#ff440033", color: "#ff4400" }}
          >
            🔥 RAGE
          </span>
        )}
        {ninja.isBurned && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full font-body"
            style={{ background: "#ff660033", color: "#ff6600" }}
          >
            🔥 Burn
          </span>
        )}
        {ninja.isParalyzed && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full font-body"
            style={{ background: "#aaff0033", color: "#aaff00" }}
          >
            ⚡ Para
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function NinjaBattle() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const [phase, setPhase] = useState<BattlePhase>("select");
  const [playerEl, setPlayerEl] = useState<ElementType>(
    getSelectedNinja() ?? "fire",
  );
  const [opponentIndex, setOpponentIndex] = useState(0);

  const [player, setPlayer] = useState<BattleNinja | null>(null);
  const [opponent, setOpponent] = useState<BattleNinja | null>(null);

  const [shaking, setShaking] = useState(false);
  const [playerAnim, setPlayerAnim] = useState("");
  const [opponentAnim, setOpponentAnim] = useState("");
  const [battleLog, setBattleLog] = useState<
    Array<{ id: string; msg: string }>
  >([]);
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [showClash, setShowClash] = useState(false);
  const [clashType, setClashType] = useState<ClashType>("clash");
  const [clashText, setClashText] = useState("CLASH!");
  const [statGain, setStatGain] = useState<{
    atk: number;
    def: number;
    spd: number;
  } | null>(null);
  const [strategyText, setStrategyText] = useState("");
  const [narratorText, setNarratorText] = useState("");
  const [activeEffect, setActiveEffect] = useState<ActiveEffect | null>(null);
  const [rewardText, setRewardText] = useState<string>("");

  // Mega & Gigamax
  const [isMega, setIsMega] = useState(false);
  const [megaTimeLeft, setMegaTimeLeft] = useState(0);
  const [isGigamax, setIsGigamax] = useState(false);
  const [gigamaxAttacksLeft, setGigamaxAttacksLeft] = useState(0);
  const [showMegaBurst, setShowMegaBurst] = useState(false);

  // Weapon effect state
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [opponentAttacking, setOpponentAttacking] = useState(false);
  const [playerWeaponBurst, setPlayerWeaponBurst] = useState(false);

  // Cooldown tracking for UI
  const [_cooldownTick, setCooldownTick] = useState(0);

  const logRef = useRef<HTMLDivElement>(null);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef<BattleNinja | null>(null);
  const opponentRef = useRef<BattleNinja | null>(null);
  const phaseRef = useRef<BattlePhase>("select");
  const isGigamaxRef = useRef(false);

  useEffect(() => {
    if (!identity) void navigate({ to: "/" });
  }, [identity, navigate]);

  // Sync refs
  useEffect(() => {
    playerRef.current = player;
  }, [player]);
  useEffect(() => {
    opponentRef.current = opponent;
  }, [opponent]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    isGigamaxRef.current = isGigamax;
  }, [isGigamax]);

  // Cooldown UI ticker
  useEffect(() => {
    if (phase !== "battle") return;
    const id = setInterval(() => setCooldownTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [phase]);

  // ── Helpers ───────────────────────────────────────────────────────────

  const addLog = useCallback((msg: string) => {
    setBattleLog((prev) => [
      ...prev.slice(-12),
      { id: `${Date.now()}-${Math.random()}`, msg },
    ]);
    setTimeout(() => {
      if (logRef.current)
        logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 50);
  }, []);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  }, []);

  const addFloat = useCallback(
    (text: string, color: string, xPct: number, yPct: number) => {
      const id = `${Date.now()}-${Math.random()}`;
      setFloatingTexts((prev) => [
        ...prev,
        { id, text, color, x: xPct, y: yPct },
      ]);
      setTimeout(
        () => setFloatingTexts((prev) => prev.filter((f) => f.id !== id)),
        1400,
      );
    },
    [],
  );

  const triggerCombo = useCallback(() => {
    setComboCount((prev) => {
      const next = prev + 1;
      if (next >= 2) {
        setShowCombo(true);
        if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
        comboTimerRef.current = setTimeout(() => setShowCombo(false), 1600);
      }
      return next;
    });
  }, []);

  const showClashEffect = useCallback((type: ClashType, txt: string) => {
    setClashText(txt);
    setClashType(type);
    setShowClash(true);
    setTimeout(() => setShowClash(false), 1200);
  }, []);

  const showNarrator = useCallback((text: string) => {
    setNarratorText(text);
    setTimeout(() => setNarratorText(""), 2500);
  }, []);

  // ── Init battle ───────────────────────────────────────────────────────

  const initBattle = useCallback((el: ElementType, oppIdx: number) => {
    const progress = loadProgress(el);
    const ninjaData = NINJAS[el];
    const oppData = OPPONENTS[oppIdx % OPPONENTS.length];
    const oppNinjaData = NINJAS[oppData.element];

    setPlayer({
      element: el,
      currentHp: progress.hp,
      maxHp: progress.hp,
      atk: progress.atk,
      def: progress.def,
      spd: progress.spd,
      isRaging: false,
      isConfused: false,
      isBurned: false,
      isParalyzed: false,
      isMaster: progress.isEliteMaster,
      moveCooldowns: Object.fromEntries(ninjaData.moves.map((m) => [m.id, 0])),
      dragonUsed: false,
      dodging: false,
    });

    setOpponent({
      element: oppData.element,
      currentHp: oppData.hp,
      maxHp: oppData.hp,
      atk: oppData.atk,
      def: oppData.def,
      spd: oppData.spd,
      isRaging: false,
      isConfused: false,
      isBurned: false,
      isParalyzed: false,
      isMaster: false,
      moveCooldowns: Object.fromEntries(
        oppNinjaData.moves.map((m) => [m.id, 0]),
      ),
      dragonUsed: false,
      dodging: false,
    });

    setBattleLog([
      { id: "start", msg: `⚔ ${ninjaData.name} vs ${oppData.name}!` },
    ]);
    setComboCount(0);
    setStatGain(null);
    setIsMega(false);
    setMegaTimeLeft(0);
    setIsGigamax(false);
    setGigamaxAttacksLeft(0);
    setActiveEffect(null);
    setRewardText("");
    setNarratorText("");

    // Show intro screen with rival dialogue then VS entry
    setPhase("intro");
    setTimeout(() => setPhase("entering"), 2200);
    setTimeout(() => setPhase("battle"), 3400);
  }, []);

  // ── Burn/paralysis DoT ────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "battle") return;
    const id = setInterval(() => {
      setPlayer((p) => {
        if (!p) return p;
        let hp = p.currentHp;
        if (p.isBurned) {
          hp = clamp(hp - Math.round(p.maxHp * 0.04), 0, p.maxHp);
          if (hp <= 0) setPhase("defeat");
        }
        return { ...p, currentHp: hp };
      });
      setOpponent((o) => {
        if (!o) return o;
        let hp = o.currentHp;
        if (o.isBurned) hp = clamp(hp - Math.round(o.maxHp * 0.04), 0, o.maxHp);
        if (hp <= 0) {
          const pl = playerRef.current;
          if (pl) {
            setPhase("victory");
            recordVictory(pl.element);
            setStatGain({ atk: 2, def: 1, spd: 1 });
          }
        }
        return { ...o, currentHp: hp };
      });
    }, 2000);
    return () => clearInterval(id);
  }, [phase]);

  // ── Rage trigger ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!player || phase !== "battle") return;
    if (player.element !== "fire") return;
    const hpPct = player.currentHp / player.maxHp;
    if (hpPct < 0.3 && !player.isRaging) {
      setPlayer((p) => (p ? { ...p, isRaging: true } : p));
      addLog(`🔥 ${NINJAS.fire.name} enters RAGE MODE! Power surges!`);
      showNarrator(`${NINJAS.fire.name} is consumed by an unstoppable fury!`);
      triggerShake();
    }
  }, [player, phase, addLog, triggerShake, showNarrator]);

  // ── AI turn ───────────────────────────────────────────────────────────

  const doAiTurn = useCallback(() => {
    if (phaseRef.current !== "battle") return;

    const opp = opponentRef.current;
    const pl = playerRef.current;
    if (!opp || !pl) return;

    const oppNinja = NINJAS[opp.element];
    const now = Date.now();

    // Paralysis skip chance
    if (opp.isParalyzed && Math.random() < 0.35) {
      addLog(`${NINJAS[opp.element].name} is paralyzed and can't move!`);
      aiTimerRef.current = setTimeout(doAiTurn, 1600);
      return;
    }

    const available = oppNinja.moves.filter(
      (m) => now >= (opp.moveCooldowns[m.id] ?? 0),
    );
    if (available.length === 0) {
      aiTimerRef.current = setTimeout(doAiTurn, 800);
      return;
    }

    // AI picks best available move, with some randomness for variety
    const sorted = [...available].sort((a, b) => b.power - a.power);
    const move =
      Math.random() < 0.7
        ? sorted[0]
        : sorted[Math.floor(Math.random() * sorted.length)];

    setOpponent((o) => {
      if (!o) return o;
      return {
        ...o,
        moveCooldowns: { ...o.moveCooldowns, [move.id]: now + move.cooldown },
      };
    });

    // Show opponent attack animation
    setActiveEffect({
      weaponType: move.weaponType,
      animationType: move.animationType,
      element: opp.element,
      fromPlayer: false,
      color: NINJAS[opp.element].color,
    });
    setOpponentAttacking(true);
    setTimeout(() => {
      setActiveEffect(null);
      setOpponentAttacking(false);
    }, 700);

    if (pl.dodging) {
      addLog(
        `${oppNinja.name} used ${move.name}! ${NINJAS[pl.element].name} DODGED!`,
      );
      setOpponentAnim("attack-lunge-left");
      setTimeout(() => setOpponentAnim(""), 450);
    } else {
      const dmg = calcDamage(move, opp.atk, pl.def, opp.isRaging);
      addLog(`${oppNinja.name} used ${move.name}! ${dmg} damage!`);
      triggerShake();
      setPlayerAnim("hit-recoil-right");
      setTimeout(() => setPlayerAnim(""), 500);
      setOpponentAnim("attack-lunge-left");
      setTimeout(() => setOpponentAnim(""), 450);
      addFloat(`-${dmg}`, "#ef4444", 28, 48);

      setPlayer((p) => {
        if (!p) return p;
        const newHp = clamp(p.currentHp - dmg, 0, p.maxHp);
        if (newHp <= 0) setPhase("defeat");
        const isBurned = move.effect === "burn" ? true : p.isBurned;
        const isConfused = move.effect === "confuse" ? true : p.isConfused;
        return { ...p, currentHp: newHp, isBurned, isConfused };
      });

      if (move.effect === "burn")
        addLog(`🔥 Burn applied to ${NINJAS[pl.element].name}!`);
      if (move.effect === "confuse")
        addLog(`😵 ${NINJAS[pl.element].name} is confused!`);
    }

    const delay = Math.max(1400, 3200 - opp.spd * 12);
    aiTimerRef.current = setTimeout(doAiTurn, delay);
  }, [addLog, addFloat, triggerShake]);

  useEffect(() => {
    if (phase === "battle") {
      aiTimerRef.current = setTimeout(doAiTurn, 2200);
    }
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [phase, doAiTurn]);

  // ── Player uses a move ────────────────────────────────────────────────

  const fireMove = useCallback(
    (moveId: string) => {
      const pl = playerRef.current;
      const opp = opponentRef.current;
      if (!pl || !opp || phaseRef.current !== "battle") return;

      const now = Date.now();
      const ninjaData = NINJAS[pl.element];
      const allMoves = [...ninjaData.moves, ninjaData.gigamaxMove];
      const move = allMoves.find((m) => m.id === moveId);
      if (!move) return;

      const cd = pl.moveCooldowns[moveId] ?? 0;
      if (now < cd) {
        addLog(`${move.name} is on cooldown!`);
        return;
      }

      // Paralysis check
      if (pl.isParalyzed && Math.random() < 0.35) {
        addLog(`⚡ ${ninjaData.name} is paralyzed and can't move!`);
        return;
      }

      // Show weapon attack animation
      setActiveEffect({
        weaponType: move.weaponType,
        animationType: move.animationType,
        element: pl.element,
        fromPlayer: true,
        color: ninjaData.color,
      });

      // Intensify weapon idle effect during attack
      setPlayerAttacking(true);
      if (move.isUltimate) {
        setPlayerWeaponBurst(true);
      }
      setTimeout(
        () => {
          setPlayerAttacking(false);
          setPlayerWeaponBurst(false);
        },
        move.isUltimate ? 700 : 500,
      );

      setPlayer((p) => {
        if (!p) return p;
        return {
          ...p,
          moveCooldowns: { ...p.moveCooldowns, [moveId]: now + move.cooldown },
        };
      });

      // Confused self-hit
      if (pl.isConfused && Math.random() < 0.33) {
        const selfDmg = Math.round(move.power * 0.3);
        setPlayer((p) => {
          if (!p) return p;
          const newHp = clamp(p.currentHp - selfDmg, 0, p.maxHp);
          if (newHp <= 0) setPhase("defeat");
          return { ...p, currentHp: newHp, isConfused: Math.random() > 0.5 };
        });
        addLog(
          `😵 Confusion! ${ninjaData.name} hurt themselves (-${selfDmg})!`,
        );
        return;
      }

      if (opp.dodging) {
        addLog(
          `${ninjaData.name} used ${move.name}! ${NINJAS[opp.element].name} DODGED!`,
        );
        setPlayerAnim("attack-lunge");
        setTimeout(() => setPlayerAnim(""), 450);
        return;
      }

      // Clash check (10% chance)
      const oppNinja = NINJAS[opp.element];
      const availOppMoves = oppNinja.moves.filter(
        (m) => now >= (opp.moveCooldowns[m.id] ?? 0),
      );
      if (Math.random() < 0.1 && availOppMoves.length > 0) {
        const oppMove =
          availOppMoves[Math.floor(Math.random() * availOppMoves.length)];
        if (Math.abs(move.power - oppMove.power) <= 10) {
          showClashEffect("clash", "CLASH!");
          addLog(`⚡ CLASH! ${move.name} vs ${oppMove.name} — Both canceled!`);
          showNarrator(
            "The moves cancel each other out in a blinding collision!",
          );
          return;
        }
        if (move.power < oppMove.power) {
          showClashEffect("lose", "OVERPOWERED!");
          const clashDmg = calcDamage(oppMove, opp.atk, pl.def, opp.isRaging);
          setPlayer((p) => {
            if (!p) return p;
            const newHp = clamp(p.currentHp - clashDmg, 0, p.maxHp);
            if (newHp <= 0) setPhase("defeat");
            return { ...p, currentHp: newHp };
          });
          addLog(`${oppMove.name} OVERPOWERS! -${clashDmg}!`);
          return;
        }
        showClashEffect("win", "CLASH WIN!");
      }

      // Normal damage
      const isCrit = Math.random() < 0.12;
      const gigamaxMult = isGigamaxRef.current ? 2 : 1;
      const dmg = Math.round(
        calcDamage(move, pl.atk, opp.def, pl.isRaging, isCrit) * gigamaxMult,
      );

      if (isGigamaxRef.current) {
        setGigamaxAttacksLeft((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            setIsGigamax(false);
            addLog("⚡ Gigantamax ends!");
          }
          return next;
        });
      }

      setOpponent((o) => {
        if (!o) return o;
        const newHp = clamp(o.currentHp - dmg, 0, o.maxHp);
        if (newHp <= 0) {
          setPhase("victory");
          const np = recordVictory(pl.element);
          setStatGain({ atk: 2, def: 1, spd: 1 });
          setTimeout(() => setStatGain(null), 3500);
          addLog(`🏆 VICTORY! ${ninjaData.name} wins!`);
          if (np.victories % 5 === 0) {
            setTimeout(() => {
              setRewardText("💎 Mega Stone Earned!");
              setTimeout(() => setRewardText(""), 3500);
            }, 1000);
          } else if (np.evolutionStones.length > 0) {
            const stone = np.evolutionStones[np.evolutionStones.length - 1];
            if (stone) {
              setTimeout(() => {
                setRewardText(`✦ ${stone} Earned!`);
                setTimeout(() => setRewardText(""), 3500);
              }, 1000);
            }
          }
        }
        const isBurned = move.effect === "burn" ? true : o.isBurned;
        const isConfused =
          move.effect === "confuse" || move.effect === "hurricane"
            ? true
            : o.isConfused;
        const isParalyzed = move.effect === "paralyze" ? true : o.isParalyzed;
        return { ...o, currentHp: newHp, isBurned, isConfused, isParalyzed };
      });

      setPlayerAnim("attack-lunge");
      setTimeout(() => setPlayerAnim(""), 450);
      setOpponentAnim("hit-recoil-left");
      setTimeout(() => setOpponentAnim(""), 500);

      const critTxt = isCrit ? " CRITICAL!" : "";
      addLog(`${ninjaData.name} used ${move.name}! ${dmg} damage!${critTxt}`);
      addFloat(`-${dmg}${critTxt}`, NINJAS[opp.element].color, 65, 32);
      triggerCombo();

      if (move.effect === "quake") {
        triggerShake();
        showNarrator("The ground shatters beneath the impact!");
      }
      if (move.effect === "burn")
        addLog(`🔥 ${NINJAS[opp.element].name} is burned!`);
      if (move.effect === "confuse" || move.effect === "hurricane")
        addLog(`😵 ${NINJAS[opp.element].name} is confused!`);

      // Narrator on kills / big hits
      if (isCrit)
        showNarrator(
          `CRITICAL HIT! ${ninjaData.name} reads the strategy perfectly!`,
        );
      if (move.isUltimate)
        showNarrator(`ULTIMATE MOVE! ${move.name} obliterates the opponent!`);
    },
    [
      addLog,
      addFloat,
      triggerShake,
      triggerCombo,
      showClashEffect,
      showNarrator,
    ],
  );

  // ── Dragon summon ─────────────────────────────────────────────────────

  const summonDragon = useCallback(() => {
    const pl = playerRef.current;
    const opp = opponentRef.current;
    if (!pl || !opp || phaseRef.current !== "battle") return;
    if (pl.dragonUsed) {
      addLog("Dragon already summoned this battle!");
      return;
    }

    const ninjaData = NINJAS[pl.element];
    const dragonMove = ninjaData.moves.find(
      (m) => m.animationType === "dragon",
    );
    if (!dragonMove) return;

    setPlayer((p) => (p ? { ...p, dragonUsed: true } : p));
    setActiveEffect({
      weaponType: ninjaData.moves[0].weaponType,
      animationType: "dragon",
      element: pl.element,
      fromPlayer: true,
      color: ninjaData.color,
    });

    const dmg = calcDamage(dragonMove, pl.atk, opp.def, pl.isRaging);
    triggerShake();
    addLog(
      `🐉 ${ninjaData.name} summons the ${ninjaData.element} Dragon! ${dmg} MASSIVE damage!`,
    );
    addFloat(`🐉 -${dmg}`, "#ffd700", 55, 22);
    showNarrator(
      `${ninjaData.name} calls upon the ${ninjaData.element} Dragon — an ancient force of nature!`,
    );

    setOpponent((o) => {
      if (!o) return o;
      const newHp = clamp(o.currentHp - dmg, 0, o.maxHp);
      if (newHp <= 0) {
        setPhase("victory");
        const np = recordVictory(pl.element);
        setStatGain({ atk: 2, def: 1, spd: 1 });
        setTimeout(() => setStatGain(null), 3500);
        if (np.victories % 5 === 0) {
          setTimeout(() => {
            setRewardText("💎 Mega Stone Earned!");
            setTimeout(() => setRewardText(""), 3500);
          }, 1000);
        }
      }
      return { ...o, currentHp: newHp };
    });
  }, [addLog, addFloat, triggerShake, showNarrator]);

  // ── Dodge ─────────────────────────────────────────────────────────────

  const dodge = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      const pl = playerRef.current;
      if (!pl || phaseRef.current !== "battle") return;
      const animMap: Record<string, string> = {
        right: "dodge-right",
        left: "dodge-left",
        up: "dodge-up",
        down: "dodge-up",
      };
      setPlayerAnim(animMap[dir] ?? "dodge-right");
      setTimeout(() => setPlayerAnim(""), 450);
      setPlayer((p) => (p ? { ...p, dodging: true } : p));
      setTimeout(
        () => setPlayer((p) => (p ? { ...p, dodging: false } : p)),
        500,
      );
      addLog(`${NINJAS[pl.element].name} dashes ${dir}! (invincible 0.5s)`);
      showNarrator(`${NINJAS[pl.element].name} executes a precise dodge!`);
    },
    [addLog, showNarrator],
  );

  // ── Mega Evolution ────────────────────────────────────────────────────

  const activateMega = useCallback(() => {
    const pl = playerRef.current;
    if (!pl || phaseRef.current !== "battle") return;
    const progress = loadProgress(pl.element);
    if (progress.megaStones < 1) return;
    progress.megaStones = Math.max(0, progress.megaStones - 1);
    saveProgress(pl.element, progress);
    const megaStats = NINJAS[pl.element].megaStats;
    setIsMega(true);
    setShowMegaBurst(true);
    setTimeout(() => setShowMegaBurst(false), 700);
    setPlayer((p) =>
      p
        ? { ...p, atk: megaStats.atk, def: megaStats.def, spd: megaStats.spd }
        : p,
    );
    setMegaTimeLeft(10);
    addLog(`✨ ${NINJAS[pl.element].name} MEGA EVOLVES! All stats surge!`);
    addFloat("MEGA!", "#ffd700", 62, 38);
    triggerShake();
    showNarrator(
      `${NINJAS[pl.element].name} is transforming — MEGA EVOLUTION!`,
    );
    if (megaTimerRef.current) clearInterval(megaTimerRef.current);
    megaTimerRef.current = setInterval(() => {
      setMegaTimeLeft((prev) => {
        if (prev <= 1) {
          if (megaTimerRef.current) clearInterval(megaTimerRef.current);
          setIsMega(false);
          const rp = loadProgress(pl.element);
          setPlayer((p) =>
            p ? { ...p, atk: rp.atk, def: rp.def, spd: rp.spd } : p,
          );
          addLog("Mega Evolution ends.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [addLog, addFloat, triggerShake, showNarrator]);

  // ── Gigantamax ────────────────────────────────────────────────────────

  const activateGigamax = useCallback(() => {
    const pl = playerRef.current;
    if (!pl || phaseRef.current !== "battle") return;
    const progress = loadProgress(pl.element);
    if (!progress.gigamaxUnlocked) return;
    setIsGigamax(true);
    setGigamaxAttacksLeft(3);
    triggerShake();
    addLog(
      `⚡ ${NINJAS[pl.element].name} GIGANTAMAXES! 3 G-MAX attacks available!`,
    );
    addFloat("G-MAX!", NINJAS[pl.element].color, 52, 28);
    showNarrator(
      `${NINJAS[pl.element].name} grows to an impossible size — GIGANTAMAX!`,
    );
  }, [addLog, addFloat, triggerShake, showNarrator]);

  // ── Strategy input ────────────────────────────────────────────────────

  const handleStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    const pl = playerRef.current;
    if (!pl || !strategyText.trim() || phaseRef.current !== "battle") return;
    const text = strategyText.trim().toLowerCase();
    const ninjaData = NINJAS[pl.element];

    if (text.includes("circle") || text.includes("confuse")) {
      setPlayerAnim("attack-lunge");
      setTimeout(() => setPlayerAnim(""), 500);
      setOpponent((o) => (o ? { ...o, isConfused: true } : o));
      addLog(
        `⚡ Strategy: ${ninjaData.name} circles the opponent! They're confused!`,
      );
      showNarrator(
        `${ninjaData.name} reads the strategy — circles at blinding speed, causing confusion!`,
      );
    } else if (text.includes("dodge left")) {
      dodge("left");
    } else if (text.includes("dodge right")) {
      dodge("right");
    } else if (text.includes("dodge")) {
      dodge("up");
    } else if (text.includes("counter")) {
      setPlayerAnim("dodge-up");
      setTimeout(() => {
        setPlayerAnim("attack-lunge");
        const now = Date.now();
        const firstMove = ninjaData.moves.find(
          (m) => now >= (pl.moveCooldowns[m.id] ?? 0),
        );
        if (firstMove) fireMove(firstMove.id);
      }, 300);
      setTimeout(() => setPlayerAnim(""), 750);
      showNarrator(
        `${ninjaData.name} reads the attack, steps aside, and counters!`,
      );
    } else if (
      text.includes("attack") ||
      text.includes("strike") ||
      text.includes("slash") ||
      text.includes("slash")
    ) {
      const now = Date.now();
      const firstMove = ninjaData.moves.find(
        (m) => now >= (pl.moveCooldowns[m.id] ?? 0),
      );
      if (firstMove) fireMove(firstMove.id);
      else addLog("All moves on cooldown!");
      showNarrator(`${ninjaData.name} launches an aggressive offensive!`);
    } else if (
      text.includes("slam") ||
      text.includes("thrust") ||
      text.includes("spin") ||
      text.includes("swing")
    ) {
      // Weapon-specific heavy attack
      const now = Date.now();
      const heavyMove = [...ninjaData.moves]
        .sort((a, b) => b.power - a.power)
        .find((m) => now >= (pl.moveCooldowns[m.id] ?? 0));
      if (heavyMove) fireMove(heavyMove.id);
      else addLog("Weapon move on cooldown!");
    } else {
      const matchedMove = ninjaData.moves.find(
        (m) =>
          text.includes(m.name.toLowerCase()) ||
          text.includes(m.id.replace(/-/g, " ")),
      );
      if (matchedMove) {
        fireMove(matchedMove.id);
        showNarrator(
          `${ninjaData.name} receives the command and executes ${matchedMove.name}!`,
        );
      } else {
        addLog(
          `Strategy: "${strategyText.trim()}" — ${ninjaData.name} adapts tactics…`,
        );
        showNarrator(
          `${ninjaData.name} reads your strategy and shifts to a new position!`,
        );
      }
    }
    setStrategyText("");
  };

  // ── Select screen ─────────────────────────────────────────────────────

  if (phase === "select") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.14 0.03 270 / 0.8) 0%, oklch(0.08 0.015 270) 70%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="jp-accent text-muted-foreground mb-1">選手選択</div>
          <h1
            className="text-3xl md:text-4xl font-display font-black"
            style={{ color: "oklch(0.70 0.21 38)" }}
          >
            CHOOSE YOUR WARRIOR
          </h1>
        </motion.div>

        {/* Character selection with images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full mb-8">
          {ELEMENT_ORDER.map((el, i) => {
            const n = NINJAS[el];
            const p = loadProgress(el);
            const isSelected = playerEl === el;
            return (
              <motion.button
                type="button"
                key={el}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setPlayerEl(el)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all"
                style={{
                  background: isSelected
                    ? `${n.color}20`
                    : "oklch(0.11 0.018 270)",
                  border: `2px solid ${isSelected ? n.color : "oklch(0.22 0.025 270)"}`,
                  boxShadow: isSelected ? `0 0 24px ${n.color}44` : "none",
                }}
              >
                <div className="relative">
                  <NinjaSilhouette
                    element={el}
                    size={90}
                    animate={isSelected}
                    isMaster={p.isEliteMaster}
                    showWeaponEffect={true}
                    isAttacking={false}
                  />
                </div>
                <div className="text-center">
                  <div
                    className="font-display font-black text-sm"
                    style={{ color: n.color }}
                  >
                    {n.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-body">
                    {n.title}
                  </div>
                  <div className="text-[9px] text-muted-foreground font-body mt-0.5">
                    {n.weapon}
                  </div>
                  <div
                    className="text-[10px] mt-1 font-body"
                    style={{ color: "oklch(0.55 0.025 270)" }}
                  >
                    HP {p.hp} · ATK {p.atk} · SPD {p.spd}
                  </div>
                  {p.isEliteMaster && (
                    <div
                      className="text-[10px] font-display font-bold mt-1"
                      style={{ color: "oklch(0.78 0.17 85)" }}
                    >
                      ✦ MASTER
                    </div>
                  )}
                </div>
                {/* Move preview */}
                {isSelected && (
                  <div className="w-full mt-1 space-y-0.5">
                    {n.moves.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-[9px] font-body"
                      >
                        <span style={{ color: n.color }}>{m.name}</span>
                        <span style={{ color: "oklch(0.55 0.025 270)" }}>
                          PWR {m.power}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Opponent select */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-3xl mb-6"
        >
          <div className="text-xs font-body text-muted-foreground text-center mb-3 tracking-wider uppercase">
            Select Opponent
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {OPPONENTS.map((opp, i) => {
              const n = NINJAS[opp.element];
              const diffColorMap: Record<string, string> = {
                easy: "#22c55e",
                medium: "#f59e0b",
                hard: "#ef4444",
                boss: "#a855f7",
              };
              const diffColor = diffColorMap[opp.difficulty] ?? "#888";
              return (
                <button
                  type="button"
                  key={opp.id}
                  onClick={() => setOpponentIndex(i)}
                  className="p-2 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                  style={{
                    background:
                      opponentIndex === i
                        ? `${n.color}22`
                        : "oklch(0.11 0.018 270)",
                    border: `1px solid ${opponentIndex === i ? n.color : "oklch(0.22 0.025 270)"}`,
                  }}
                >
                  <NinjaSilhouette
                    element={opp.element}
                    size={44}
                    animate={false}
                    facing="left"
                  />
                  <div
                    className="text-[9px] font-display font-bold text-center"
                    style={{ color: n.color }}
                  >
                    {opp.name}
                  </div>
                  <span
                    className="text-[8px] px-1 py-0.5 rounded-full font-body"
                    style={{ background: `${diffColor}22`, color: diffColor }}
                  >
                    {opp.difficulty.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <Button
          type="button"
          onClick={() => initBattle(playerEl, opponentIndex)}
          size="lg"
          className="font-display font-black text-base px-10 h-14"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.23 30), oklch(0.70 0.21 38))",
            border: "none",
            boxShadow: "0 0 25px oklch(0.62 0.23 30 / 0.5)",
            color: "oklch(0.97 0.01 85)",
          }}
        >
          ⚔ START BATTLE
        </Button>
      </div>
    );
  }

  // ── Intro screen (rival dialogue) ─────────────────────────────────────

  if (phase === "intro") {
    const oppData = OPPONENTS[opponentIndex % OPPONENTS.length];
    const oppNinja = NINJAS[oppData.element];
    return (
      <div
        className={`min-h-screen flex flex-col relative overflow-hidden ${oppNinja.arenaClass}`}
        style={{ minHeight: "100svh" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: [
              "linear-gradient(oklch(0.78 0.17 85) 1px, transparent 1px)",
              "linear-gradient(90deg, oklch(0.78 0.17 85) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-6">
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <NinjaSilhouette
              element={oppData.element}
              size={160}
              facing="left"
              animate={true}
              showWeaponEffect={true}
            />
            <div
              className="font-display font-black text-2xl mt-3"
              style={{ color: oppNinja.color }}
            >
              {oppData.name}
            </div>
            <div className="text-sm text-muted-foreground font-body">
              {oppData.title}
            </div>
          </motion.div>

          {oppData.rivalIntro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-sm w-full p-5 rounded-2xl relative"
              style={{
                background: "oklch(0.1 0.02 270 / 0.95)",
                border: `2px solid ${oppNinja.color}66`,
                boxShadow: `0 0 20px ${oppNinja.color}33`,
              }}
            >
              {/* Speech bubble arrow */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderBottom: `14px solid ${oppNinja.color}66`,
                }}
              />
              <p
                className="font-body text-sm text-center leading-relaxed"
                style={{ color: "oklch(0.88 0.01 270)" }}
              >
                "{oppData.rivalIntro}"
              </p>
              <div
                className="text-center mt-2 text-xs font-display font-bold"
                style={{ color: oppNinja.color }}
              >
                — {oppData.name}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ── Entering phase ────────────────────────────────────────────────────

  if (phase === "entering" && player && opponent) {
    const playerNinjaE = NINJAS[player.element];
    const oppNinjaE = NINJAS[opponent.element];
    const oppDataE = OPPONENTS[opponentIndex % OPPONENTS.length];
    return (
      <div
        className={`min-h-screen flex flex-col relative overflow-hidden ${playerNinjaE.arenaClass}`}
        style={{ minHeight: "100svh" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: [
              "linear-gradient(oklch(0.78 0.17 85) 1px, transparent 1px)",
              "linear-gradient(90deg, oklch(0.78 0.17 85) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "40px 40px",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
          style={{ background: "oklch(0.04 0.01 270 / 0.75)" }}
        >
          <div className="flex items-center justify-center gap-8 w-full px-4">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-2">{playerNinjaE.symbol}</div>
              <div
                className="text-xl font-display font-black"
                style={{ color: playerNinjaE.color }}
              >
                {playerNinjaE.name}
              </div>
            </motion.div>
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-6xl font-display font-black vs-appear"
              style={{
                color: "oklch(0.78 0.17 85)",
                textShadow: "0 0 30px oklch(0.78 0.17 85)",
              }}
            >
              VS
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-2">{oppNinjaE.symbol}</div>
              <div
                className="text-xl font-display font-black"
                style={{ color: oppNinjaE.color }}
              >
                {oppDataE.name}
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className="relative z-10 flex-1 flex items-center justify-between px-4 md:px-12 pt-16">
          <NinjaSilhouette
            element={opponent.element}
            size={100}
            facing="left"
            animate={false}
            entering={true}
          />
          <NinjaSilhouette
            element={player.element}
            size={100}
            animate={false}
            entering={true}
          />
        </div>
      </div>
    );
  }

  // ── Victory ───────────────────────────────────────────────────────────

  if (phase === "victory" && player) {
    const newProg = loadProgress(player.element);
    const xpInfo = getXpProgress(newProg);
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.20 0.06 85 / 0.7) 0%, oklch(0.08 0.015 270) 70%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 text-center w-full max-w-sm"
        >
          <div className="victory-pose">
            <NinjaSilhouette
              element={player.element}
              size={140}
              isMaster={newProg.isEliteMaster}
            />
          </div>
          <div>
            <div className="jp-accent text-muted-foreground mb-1">勝利</div>
            <h2
              className="text-4xl font-display font-black"
              style={{ color: "oklch(0.78 0.17 85)" }}
            >
              VICTORY!
            </h2>
            <p className="text-muted-foreground font-body mt-1 text-sm">
              {NINJAS[player.element].name} defeated{" "}
              {OPPONENTS[opponentIndex % OPPONENTS.length].name}
            </p>
          </div>

          {statGain && (
            <div className="flex gap-6">
              {[
                {
                  label: "ATK",
                  val: statGain.atk,
                  color: NINJAS[player.element].color,
                },
                { label: "DEF", val: statGain.def, color: "#60a5fa" },
                { label: "SPD", val: statGain.spd, color: "#a3e635" },
              ].map(({ label, val, color }) => (
                <div key={label} className="text-center stat-gain">
                  <div
                    className="text-2xl font-display font-black"
                    style={{ color }}
                  >
                    +{val}
                  </div>
                  <div className="text-xs text-muted-foreground font-body">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* XP bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
              <span>Level {newProg.level}</span>
              <span>
                {xpInfo.current}/{xpInfo.needed} XP
              </span>
            </div>
            <div className="h-3 bg-muted/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpInfo.pct}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                  background: NINJAS[player.element].color,
                  boxShadow: `0 0 8px ${NINJAS[player.element].color}`,
                }}
              />
            </div>
          </div>

          {rewardText && (
            <div
              className="font-display font-black text-lg px-5 py-3 rounded-2xl stone-reward"
              style={{
                color: "#ffd700",
                textShadow: "0 0 16px #ffd700",
                background: "oklch(0.08 0.015 270 / 0.9)",
                border: "2px solid #ffd70088",
                boxShadow: "0 0 24px #ffd70055",
              }}
            >
              {rewardText}
            </div>
          )}

          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              type="button"
              onClick={() =>
                player &&
                initBattle(
                  player.element,
                  (opponentIndex + 1) % OPPONENTS.length,
                )
              }
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.23 30), oklch(0.70 0.21 38))",
                border: "none",
                color: "oklch(0.97 0.01 85)",
              }}
            >
              Next Battle
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPhase("select")}
            >
              Change Ninja
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Defeat ────────────────────────────────────────────────────────────

  if (phase === "defeat" && player) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.14 0.04 25 / 0.7) 0%, oklch(0.08 0.015 270) 70%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="defeat-slump opacity-50">
            <NinjaSilhouette element={player.element} size={100} />
          </div>
          <div>
            <div className="jp-accent text-muted-foreground mb-1">敗北</div>
            <h2 className="text-4xl font-display font-black text-red-500">
              DEFEATED
            </h2>
            <p className="text-muted-foreground font-body mt-1 text-sm">
              Train harder and return stronger
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() =>
                player && initBattle(player.element, opponentIndex)
              }
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.23 30), oklch(0.70 0.21 38))",
                border: "none",
                color: "oklch(0.97 0.01 85)",
              }}
            >
              Rematch
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPhase("select")}
            >
              Back
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Battle Arena ──────────────────────────────────────────────────────

  if (!player || !opponent) return null;

  const playerNinja = NINJAS[player.element];
  const opponentNinja = NINJAS[opponent.element];
  const now = Date.now();
  const oppData = OPPONENTS[opponentIndex % OPPONENTS.length];
  const currentProgress = loadProgress(player.element);

  return (
    <div
      className={[
        "min-h-screen flex flex-col relative overflow-hidden select-none",
        playerNinja.arenaClass,
        shaking ? "screen-shake" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ minHeight: "100svh" }}
    >
      {/* Atmospheric grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: [
            "linear-gradient(oklch(0.78 0.17 85) 1px, transparent 1px)",
            "linear-gradient(90deg, oklch(0.78 0.17 85) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating damage/effect texts */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="absolute z-50 pointer-events-none font-display font-black text-xl float-damage"
          style={{
            left: `${ft.x}%`,
            top: `${ft.y}%`,
            color: ft.color,
            textShadow: `0 0 12px ${ft.color}, 0 0 24px ${ft.color}88`,
          }}
        >
          {ft.text}
        </div>
      ))}

      {/* Clash overlay */}
      <AnimatePresence>
        {showClash && (
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1.15, rotate: 4 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div
              className="text-3xl font-display font-black px-5 py-2.5 rounded-2xl"
              style={{
                color:
                  clashType === "win"
                    ? "#ffd700"
                    : clashType === "lose"
                      ? "#ef4444"
                      : "#ff8800",
                textShadow: "0 0 24px currentColor",
                background: "oklch(0.06 0.01 270 / 0.9)",
                border: "2px solid currentColor",
                boxShadow: "0 0 30px currentColor, 0 0 60px currentColor44",
              }}
            >
              {clashText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combo counter */}
      <AnimatePresence>
        {showCombo && comboCount >= 2 && (
          <motion.div
            initial={{ scale: 0, x: "-50%" }}
            animate={{ scale: 1, x: "-50%" }}
            exit={{ scale: 0, opacity: 0, x: "-50%" }}
            className="absolute z-40 left-1/2 top-1/4 combo-appear pointer-events-none"
          >
            <div
              className="text-4xl font-display font-black"
              style={{
                color: "oklch(0.78 0.17 85)",
                textShadow:
                  "0 0 20px oklch(0.78 0.17 85), 0 0 40px oklch(0.78 0.17 85 / 0.6)",
              }}
            >
              {comboCount}× COMBO!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narrator callout */}
      <AnimatePresence>
        {narratorText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-40 left-1/2 -translate-x-1/2 pointer-events-none w-[92%] max-w-lg"
            style={{ bottom: "calc(140px + env(safe-area-inset-bottom, 0px))" }}
          >
            <div
              className="text-center text-xs font-body px-4 py-2 rounded-xl narrator-text"
              style={{
                background: "oklch(0.07 0.02 270 / 0.95)",
                border: "1px solid oklch(0.78 0.17 85 / 0.35)",
                color: "oklch(0.9 0.01 270)",
                fontStyle: "italic",
                boxShadow: "0 4px 20px oklch(0.04 0.01 270 / 0.8)",
              }}
            >
              {narratorText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weapon / move attack effects */}
      {activeEffect && (
        <WeaponAttackEffect
          weaponType={activeEffect.weaponType}
          animationType={activeEffect.animationType}
          element={activeEffect.element}
          fromPlayer={activeEffect.fromPlayer}
          color={activeEffect.color}
          onComplete={() => setActiveEffect(null)}
        />
      )}

      {/* Mega burst flash — orange/red radial burst */}
      <AnimatePresence>
        {showMegaBurst && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 65% 50%, #ff440055 0%, #ff880033 30%, transparent 65%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* MEGA transformation text burst */}
      <AnimatePresence>
        {showMegaBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute z-50 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div
              className="font-display font-black text-4xl text-center"
              style={{
                color: "#ff6600",
                textShadow: "0 0 30px #ff4400, 0 0 60px #ff220088",
              }}
            >
              MEGA EVOLVE!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mega timer bar */}
      {isMega && megaTimeLeft > 0 && (
        <div className="absolute top-[52px] left-0 right-0 z-20 px-3">
          <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(megaTimeLeft / 10) * 100}%`,
                background: "linear-gradient(90deg, #ff4400, #ff8800, #ffd700)",
                boxShadow: "0 0 10px #ff6600",
              }}
            />
          </div>
          <div
            className="text-center text-[10px] font-display font-bold mt-0.5"
            style={{ color: "#ff6600" }}
          >
            🔥 MEGA {megaTimeLeft}s
          </div>
        </div>
      )}

      {/* Gigamax badge */}
      {isGigamax && (
        <div
          className="absolute top-[52px] right-3 z-20 px-2 py-1 rounded-lg font-display font-black text-xs"
          style={{
            background: "#0088ff22",
            border: "1px solid #0088ff",
            color: "#00aaff",
            boxShadow: "0 0 16px #0088ff66",
            animation: "gigamax-blue-aura 1s ease-in-out infinite",
          }}
        >
          ⚡ G-MAX ×{gigamaxAttacksLeft}
        </div>
      )}

      {/* Reward notification */}
      <AnimatePresence>
        {rewardText && (
          <motion.div
            initial={{ scale: 0, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            className="absolute z-50 left-1/2 top-1/3 -translate-x-1/2 pointer-events-none"
          >
            <div
              className="font-display font-black text-xl px-5 py-3 rounded-2xl text-center stone-reward"
              style={{
                color: "#ffd700",
                textShadow: "0 0 20px #ffd700",
                background: "oklch(0.07 0.015 270 / 0.95)",
                border: "2px solid #ffd70088",
                boxShadow: "0 0 30px #ffd70055",
              }}
            >
              {rewardText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HP bars ────────────────────────────────────────────────────── */}
      <div className="relative z-10 px-3 pt-3 pb-1">
        <div className="grid grid-cols-2 gap-3">
          <HpBar ninja={player} label={playerNinja.name} />
          <HpBar ninja={opponent} label={oppData.name} align="right" />
        </div>
      </div>

      {/* ── Battle arena: ninjas facing each other ───────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-4 md:px-12 py-2 min-h-0">
        {/* Opponent — LEFT, mirrored (facing player) */}
        <div
          className={["flex flex-col items-center gap-1", opponentAnim]
            .filter(Boolean)
            .join(" ")}
        >
          <NinjaSilhouette
            element={opponent.element}
            size={150}
            facing="left"
            animate={true}
            showWeaponEffect={true}
            isAttacking={opponentAttacking}
          />
          <div className="text-center">
            <div
              className="text-[11px] font-display font-bold"
              style={{ color: opponentNinja.color }}
            >
              {oppData.name}
            </div>
            <div className="text-[9px] text-muted-foreground font-body">
              {opponentNinja.weapon}
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center gap-0.5 px-1">
          <div
            className="font-display font-black text-base opacity-30"
            style={{ color: "oklch(0.78 0.17 85)" }}
          >
            VS
          </div>
        </div>

        {/* Player — RIGHT */}
        <div
          className={["flex flex-col items-center gap-1", playerAnim]
            .filter(Boolean)
            .join(" ")}
        >
          <NinjaSilhouette
            element={player.element}
            size={150}
            facing="right"
            animate={true}
            isRaging={player.isRaging}
            isMaster={player.isMaster}
            isMega={isMega}
            isGigamax={isGigamax}
            showWeaponEffect={true}
            isAttacking={playerAttacking}
            showBurst={playerWeaponBurst}
            onBurstDone={() => setPlayerWeaponBurst(false)}
          />
          <div className="text-center">
            <div
              className="text-[11px] font-display font-bold"
              style={{ color: playerNinja.color }}
            >
              {playerNinja.name}
              {isMega && <span style={{ color: "#ff6600" }}> MEGA</span>}
              {isGigamax && <span style={{ color: "#00aaff" }}> G-MAX</span>}
            </div>
            <div className="text-[9px] text-muted-foreground font-body">
              {playerNinja.weapon}
            </div>
          </div>
        </div>
      </div>

      {/* ── Battle log ──────────────────────────────────────────────────── */}
      <div
        ref={logRef}
        className="relative z-10 mx-3 mb-2 h-14 overflow-y-auto rounded-xl px-3 py-2"
        style={{
          background: "oklch(0.07 0.015 270 / 0.85)",
          border: "1px solid oklch(0.18 0.02 270)",
        }}
      >
        {battleLog.map(({ id, msg }) => (
          <div
            key={id}
            className="text-[10px] font-body text-muted-foreground leading-snug py-0.5"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* ── Strategy text input (center) ────────────────────────────────── */}
      <form
        onSubmit={handleStrategy}
        className="relative z-10 flex gap-2 px-3 mb-2"
      >
        <input
          type="text"
          value={strategyText}
          onChange={(e) => setStrategyText(e.target.value)}
          placeholder='Type strategy: "circle", "dodge", "counter", "strike"…'
          className="flex-1 text-xs py-2 px-3 rounded-xl font-body outline-none"
          style={{
            background: "oklch(0.10 0.018 270)",
            border: `1px solid ${playerNinja.color}44`,
            color: "oklch(0.88 0.01 270)",
            height: 36,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const syntheticEvent = {
                preventDefault: () => {},
              } as React.FormEvent;
              handleStrategy(syntheticEvent);
            }
          }}
        />
        <button
          type="submit"
          className="shrink-0 font-display font-bold text-xs h-9 px-3 rounded-xl"
          style={{
            background: playerNinja.color,
            border: "none",
            color: "oklch(0.06 0.01 270)",
          }}
        >
          GO
        </button>
      </form>

      {/* ── Bottom controls: D-Pad LEFT + Move Buttons RIGHT ────────────── */}
      <div className="relative z-10 flex items-end justify-between px-3 pb-4 gap-2">
        {/* D-PAD — Left side for dodging */}
        <div className="flex flex-col items-center gap-0.5">
          {/* Up button */}
          <button
            type="button"
            disabled={phase !== "battle"}
            onPointerDown={() => dodge("up")}
            className="flex items-center justify-center rounded-full font-display font-black text-sm active:scale-90"
            style={{
              width: 44,
              height: 44,
              background: "oklch(0.13 0.03 270)",
              border: `1.5px solid ${playerNinja.color}55`,
              color: playerNinja.color,
              boxShadow: `0 0 8px ${playerNinja.color}33`,
              touchAction: "none",
            }}
          >
            ↑
          </button>
          {/* Left / Dragon / Right row */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={phase !== "battle"}
              onPointerDown={() => dodge("left")}
              className="flex items-center justify-center rounded-full font-display font-black text-sm active:scale-90"
              style={{
                width: 44,
                height: 44,
                background: "oklch(0.13 0.03 270)",
                border: `1.5px solid ${playerNinja.color}55`,
                color: playerNinja.color,
                boxShadow: `0 0 8px ${playerNinja.color}33`,
                touchAction: "none",
              }}
            >
              ←
            </button>
            {/* Center D-pad button — Dragon */}
            <button
              type="button"
              disabled={player.dragonUsed || phase !== "battle"}
              onPointerDown={summonDragon}
              className="flex items-center justify-center rounded-full text-base font-bold active:scale-85"
              style={{
                width: 44,
                height: 44,
                background: player.dragonUsed
                  ? "oklch(0.12 0.02 270)"
                  : "radial-gradient(circle at 35% 35%, #c8a96ecc, #5c4a2a)",
                border: `2px solid ${player.dragonUsed ? "oklch(0.2 0.02 270)" : "#c8a96e88"}`,
                color: player.dragonUsed ? "oklch(0.3 0.02 270)" : "#ffd700",
                boxShadow: player.dragonUsed ? "none" : "0 0 12px #c8a96e44",
                fontSize: 18,
                touchAction: "none",
              }}
              title={player.dragonUsed ? "Dragon used" : "Summon Dragon"}
            >
              🐉
            </button>
            <button
              type="button"
              disabled={phase !== "battle"}
              onPointerDown={() => dodge("right")}
              className="flex items-center justify-center rounded-full font-display font-black text-sm active:scale-90"
              style={{
                width: 44,
                height: 44,
                background: "oklch(0.13 0.03 270)",
                border: `1.5px solid ${playerNinja.color}55`,
                color: playerNinja.color,
                boxShadow: `0 0 8px ${playerNinja.color}33`,
                touchAction: "none",
              }}
            >
              →
            </button>
          </div>
          {/* Down button */}
          <button
            type="button"
            disabled={phase !== "battle"}
            onPointerDown={() => dodge("down")}
            className="flex items-center justify-center rounded-full font-display font-black text-sm active:scale-90"
            style={{
              width: 44,
              height: 44,
              background: "oklch(0.13 0.03 270)",
              border: `1.5px solid ${playerNinja.color}55`,
              color: playerNinja.color,
              boxShadow: `0 0 8px ${playerNinja.color}33`,
              touchAction: "none",
            }}
          >
            ↓
          </button>
        </div>

        {/* CENTER — Mega / Gigamax toggles */}
        <div className="flex flex-col items-center gap-1.5 pb-1">
          {/* Mega Evolution button */}
          {currentProgress.megaStones > 0 && !isMega && (
            <motion.button
              type="button"
              disabled={phase !== "battle"}
              onClick={activateMega}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-display font-black"
              style={{
                background: "oklch(0.13 0.06 35)",
                border: "1.5px solid #ff6600aa",
                color: "#ff8800",
                boxShadow: "0 0 12px #ff440044",
              }}
            >
              🔥 MEGA ×{currentProgress.megaStones}
            </motion.button>
          )}

          {/* Gigantamax button */}
          {currentProgress.gigamaxUnlocked && !isGigamax && (
            <motion.button
              type="button"
              disabled={phase !== "battle"}
              onClick={activateGigamax}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-display font-black"
              style={{
                background: "oklch(0.10 0.04 220)",
                border: "1.5px solid #0088ffaa",
                color: "#00aaff",
                boxShadow: "0 0 12px #0066ff44",
              }}
            >
              <Zap size={10} />
              G-MAX
            </motion.button>
          )}

          {/* Active mega/gigamax indicator */}
          {isMega && (
            <div
              className="text-[10px] font-display font-black px-2 py-1 rounded-full"
              style={{
                color: "#ff6600",
                background: "oklch(0.12 0.05 30)",
                border: "1px solid #ff440066",
              }}
            >
              🔥 MEGA {megaTimeLeft}s
            </div>
          )}
          {isGigamax && (
            <div
              className="text-[10px] font-display font-black px-2 py-1 rounded-full"
              style={{
                color: "#00aaff",
                background: "oklch(0.10 0.04 220)",
                border: "1px solid #0088ff66",
              }}
            >
              ⚡ G-MAX ×{gigamaxAttacksLeft}
            </div>
          )}
        </div>

        {/* MOVE BUTTONS — Right side, circular */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex gap-1.5 flex-wrap justify-end">
            {playerNinja.moves.map((move) => {
              const cd = player.moveCooldowns[move.id] ?? 0;
              const isOnCooldown = now < cd;
              return (
                <MoveButton
                  key={move.id}
                  move={move}
                  color={playerNinja.color}
                  disabled={phase !== "battle"}
                  onUse={() => fireMove(move.id)}
                  isOnCooldown={isOnCooldown}
                />
              );
            })}
          </div>
          {/* Gigamax special move */}
          {isGigamax && (
            <div className="flex justify-end mt-0.5">
              <MoveButton
                move={playerNinja.gigamaxMove}
                color="#00aaff"
                disabled={phase !== "battle"}
                onUse={() => fireMove(playerNinja.gigamaxMove.id)}
                isOnCooldown={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
