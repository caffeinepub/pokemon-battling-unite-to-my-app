/**
 * WeaponIdleEffect — continuous elemental weapon particle effects
 *
 * Renders per-element weapon particles that run in idle state AND
 * intensify when `attacking` is true. Uses CSS animations + inline
 * SVG so no canvas / requestAnimationFrame needed.
 *
 * Used in:
 *   - NinjaSilhouette (battle + character select)
 *   - Battle screen attack bursts
 */

import { AnimatePresence, motion } from "motion/react";
import type { ElementType } from "../data/ninjaData";

interface WeaponIdleEffectProps {
  element: ElementType;
  /** Overall size of the ninja container (used to scale particles) */
  size: number;
  attacking?: boolean;
  /** Show the full-screen burst overlay on attack */
  burst?: boolean;
  onBurstDone?: () => void;
}

// ── Per-element configs ───────────────────────────────────────────────────

const CONFIGS = {
  fire: {
    bladeGlow: "#ff4400",
    bladeGlow2: "#ff8800",
    particleColor: "#ff5500",
    particleColor2: "#ffaa00",
    burstColor: "#ff3300",
    // Flame teardrop particles drip downward
    particles: [
      { id: "f0", x: "48%", baseY: "55%", delay: "0s", dur: "1.2s", size: 5 },
      { id: "f1", x: "52%", baseY: "60%", delay: "0.3s", dur: "1.0s", size: 4 },
      { id: "f2", x: "45%", baseY: "52%", delay: "0.6s", dur: "1.4s", size: 3 },
      { id: "f3", x: "55%", baseY: "58%", delay: "0.9s", dur: "1.1s", size: 4 },
      {
        id: "f4",
        x: "50%",
        baseY: "65%",
        delay: "0.15s",
        dur: "1.3s",
        size: 3,
      },
      {
        id: "f5",
        x: "43%",
        baseY: "62%",
        delay: "0.45s",
        dur: "0.9s",
        size: 2,
      },
    ],
    bladeClass: "weapon-blade-fire",
    burstLabel: "FIRE BLAST!",
  },
  water: {
    bladeGlow: "#00aaff",
    bladeGlow2: "#00ddff",
    particleColor: "#00bbff",
    particleColor2: "#88eeff",
    burstColor: "#0088ff",
    particles: [
      { id: "w0", x: "46%", baseY: "50%", delay: "0s", dur: "2.0s", size: 4 },
      { id: "w1", x: "54%", baseY: "55%", delay: "0.4s", dur: "1.8s", size: 3 },
      { id: "w2", x: "50%", baseY: "48%", delay: "0.8s", dur: "2.2s", size: 3 },
      { id: "w3", x: "44%", baseY: "58%", delay: "0.2s", dur: "1.6s", size: 4 },
      { id: "w4", x: "56%", baseY: "62%", delay: "1.0s", dur: "1.9s", size: 2 },
      { id: "w5", x: "50%", baseY: "53%", delay: "0.6s", dur: "2.1s", size: 2 },
    ],
    bladeClass: "weapon-blade-water",
    burstLabel: "TIDAL SURGE!",
  },
  air: {
    bladeGlow: "#88ffee",
    bladeGlow2: "#ffffff",
    particleColor: "#aaffee",
    particleColor2: "#ddffff",
    burstColor: "#00ddaa",
    particles: [
      { id: "a0", x: "48%", baseY: "50%", delay: "0s", dur: "0.8s", size: 3 },
      { id: "a1", x: "52%", baseY: "46%", delay: "0.2s", dur: "0.7s", size: 4 },
      { id: "a2", x: "44%", baseY: "54%", delay: "0.4s", dur: "0.9s", size: 2 },
      {
        id: "a3",
        x: "56%",
        baseY: "52%",
        delay: "0.1s",
        dur: "0.65s",
        size: 3,
      },
      {
        id: "a4",
        x: "50%",
        baseY: "58%",
        delay: "0.35s",
        dur: "0.75s",
        size: 2,
      },
      {
        id: "a5",
        x: "46%",
        baseY: "44%",
        delay: "0.55s",
        dur: "0.85s",
        size: 2,
      },
    ],
    bladeClass: "weapon-blade-air",
    burstLabel: "HURRICANE SLASH!",
  },
  earth: {
    bladeGlow: "#c8a000",
    bladeGlow2: "#ffcc44",
    particleColor: "#c8a000",
    particleColor2: "#885500",
    burstColor: "#c8a000",
    particles: [
      { id: "e0", x: "48%", baseY: "68%", delay: "0s", dur: "2.5s", size: 5 },
      { id: "e1", x: "53%", baseY: "70%", delay: "0.5s", dur: "2.2s", size: 4 },
      { id: "e2", x: "43%", baseY: "66%", delay: "1.0s", dur: "2.8s", size: 3 },
      { id: "e3", x: "57%", baseY: "72%", delay: "0.8s", dur: "2.0s", size: 5 },
      { id: "e4", x: "50%", baseY: "74%", delay: "0.3s", dur: "2.4s", size: 3 },
      { id: "e5", x: "46%", baseY: "76%", delay: "1.2s", dur: "2.6s", size: 4 },
    ],
    bladeClass: "weapon-blade-earth",
    burstLabel: "EARTH SHATTER!",
  },
} as const;

// ── Blade glow overlay (SVG) ──────────────────────────────────────────────

function BladeGlow({
  element,
  size,
  attacking,
}: { element: ElementType; size: number; attacking: boolean }) {
  const cfg = CONFIGS[element];
  const s = Math.max(size, 80);
  const opacity = attacking ? 0.9 : 0.45;
  const blur = attacking ? 14 : 7;

  if (element === "fire") {
    return (
      <svg
        width={s}
        height={s * 1.25}
        viewBox={`0 0 ${s} ${s * 1.25}`}
        className={`absolute inset-0 pointer-events-none ${cfg.bladeClass}`}
        style={{ zIndex: 4, opacity, mixBlendMode: "screen" }}
        role="img"
        aria-hidden="true"
      >
        <defs>
          <filter id={`blade-blur-fire-${s}`}>
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
        {/* Dual sword shapes */}
        <line
          x1={s * 0.38}
          y1={s * 0.3}
          x2={s * 0.48}
          y2={s * 0.85}
          stroke={cfg.bladeGlow}
          strokeWidth={attacking ? 6 : 3}
          strokeLinecap="round"
          filter={`url(#blade-blur-fire-${s})`}
        />
        <line
          x1={s * 0.52}
          y1={s * 0.28}
          x2={s * 0.62}
          y2={s * 0.83}
          stroke={cfg.bladeGlow2}
          strokeWidth={attacking ? 5 : 2.5}
          strokeLinecap="round"
          filter={`url(#blade-blur-fire-${s})`}
        />
      </svg>
    );
  }

  if (element === "water") {
    return (
      <svg
        width={s}
        height={s * 1.25}
        viewBox={`0 0 ${s} ${s * 1.25}`}
        className={`absolute inset-0 pointer-events-none ${cfg.bladeClass}`}
        style={{ zIndex: 4, opacity, mixBlendMode: "screen" }}
        role="img"
        aria-hidden="true"
      >
        <defs>
          <filter id={`blade-blur-water-${s}`}>
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
        {/* Spear shaft + tip */}
        <line
          x1={s * 0.5}
          y1={s * 0.15}
          x2={s * 0.5}
          y2={s * 0.95}
          stroke={cfg.bladeGlow}
          strokeWidth={attacking ? 5 : 2.5}
          strokeLinecap="round"
          filter={`url(#blade-blur-water-${s})`}
        />
        <polygon
          points={`${s * 0.5},${s * 0.1} ${s * 0.44},${s * 0.25} ${s * 0.56},${s * 0.25}`}
          fill={cfg.bladeGlow2}
          opacity={0.85}
          filter={`url(#blade-blur-water-${s})`}
        />
      </svg>
    );
  }

  if (element === "air") {
    return (
      <svg
        width={s}
        height={s * 1.25}
        viewBox={`0 0 ${s} ${s * 1.25}`}
        className={`absolute inset-0 pointer-events-none ${cfg.bladeClass}`}
        style={{ zIndex: 4, opacity, mixBlendMode: "screen" }}
        role="img"
        aria-hidden="true"
      >
        <defs>
          <filter id={`blade-blur-air-${s}`}>
            <feGaussianBlur stdDeviation={blur} />
          </filter>
          <radialGradient id={`fan-grad-${s}`}>
            <stop offset="0%" stopColor={cfg.bladeGlow2} stopOpacity="0.9" />
            <stop offset="100%" stopColor={cfg.bladeGlow} stopOpacity="0.4" />
          </radialGradient>
        </defs>
        {/* Two fan shapes */}
        <ellipse
          cx={s * 0.4}
          cy={s * 0.48}
          rx={s * 0.14}
          ry={s * 0.06}
          fill={`url(#fan-grad-${s})`}
          filter={`url(#blade-blur-air-${s})`}
        />
        <ellipse
          cx={s * 0.6}
          cy={s * 0.5}
          rx={s * 0.14}
          ry={s * 0.06}
          fill={`url(#fan-grad-${s})`}
          filter={`url(#blade-blur-air-${s})`}
        />
      </svg>
    );
  }

  // earth — hammer head glow
  return (
    <svg
      width={s}
      height={s * 1.25}
      viewBox={`0 0 ${s} ${s * 1.25}`}
      className={`absolute inset-0 pointer-events-none ${cfg.bladeClass}`}
      style={{ zIndex: 4, opacity, mixBlendMode: "screen" }}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <filter id={`blade-blur-earth-${s}`}>
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      {/* Hammer head rectangle */}
      <rect
        x={s * 0.3}
        y={s * 0.2}
        width={s * 0.4}
        height={s * 0.2}
        rx={4}
        fill={cfg.bladeGlow}
        opacity={0.9}
        filter={`url(#blade-blur-earth-${s})`}
      />
      {/* Crack lines glow */}
      <line
        x1={s * 0.42}
        y1={s * 0.22}
        x2={s * 0.38}
        y2={s * 0.38}
        stroke={cfg.bladeGlow2}
        strokeWidth={2}
        strokeLinecap="round"
        filter={`url(#blade-blur-earth-${s})`}
      />
      <line
        x1={s * 0.55}
        y1={s * 0.24}
        x2={s * 0.6}
        y2={s * 0.4}
        stroke={cfg.bladeGlow2}
        strokeWidth={2}
        strokeLinecap="round"
        filter={`url(#blade-blur-earth-${s})`}
      />
    </svg>
  );
}

// ── Idle particles ────────────────────────────────────────────────────────

function IdleParticles({
  element,
  size,
  attacking,
}: { element: ElementType; size: number; attacking: boolean }) {
  const cfg = CONFIGS[element];
  const scale = size / 100;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {cfg.particles.map((p) => {
        const ps = Math.round(p.size * scale * (attacking ? 1.8 : 1));
        return (
          <div
            key={p.id}
            className={`absolute rounded-full weapon-particle weapon-particle-${element}`}
            style={{
              width: ps,
              height: ps,
              left: p.x,
              top: p.baseY,
              background:
                element === "earth"
                  ? `radial-gradient(circle, ${cfg.particleColor2} 0%, ${cfg.particleColor} 100%)`
                  : cfg.particleColor,
              boxShadow: `0 0 ${ps * 2}px ${cfg.particleColor}`,
              animationDuration: attacking
                ? `${Number.parseFloat(p.dur) * 0.5}s`
                : p.dur,
              animationDelay: p.delay,
              opacity: attacking ? 1 : 0.75,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Full-screen burst overlay ─────────────────────────────────────────────

function BurstOverlay({
  element,
  onDone,
}: { element: ElementType; onDone: () => void }) {
  const cfg = CONFIGS[element];

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.8, 0] }}
      transition={{ duration: 0.7, times: [0, 0.15, 0.6, 1] }}
      onAnimationComplete={onDone}
    >
      {/* Radial color flash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${cfg.burstColor}55 0%, ${cfg.burstColor}22 40%, transparent 70%)`,
        }}
      />

      {/* Burst label */}
      <motion.div
        className="font-display font-black text-4xl md:text-6xl tracking-widest relative z-10 text-center"
        initial={{ scale: 0.4, rotate: -8 }}
        animate={{ scale: [0.4, 1.3, 1.1], rotate: [-8, 4, 0] }}
        transition={{ duration: 0.5, times: [0, 0.5, 1] }}
        style={{
          color: cfg.burstColor,
          textShadow: `0 0 30px ${cfg.burstColor}, 0 0 60px ${cfg.burstColor}88`,
          WebkitTextStroke: "1px rgba(255,255,255,0.2)",
        }}
      >
        {cfg.burstLabel}
      </motion.div>

      {/* Burst shards */}
      {([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const).map((i) => (
        <motion.div
          key={`burst-shard-${i}`}
          className="absolute rounded-full"
          style={{
            width: 10 + (i % 3) * 6,
            height: 10 + (i % 3) * 6,
            background: i % 2 === 0 ? cfg.burstColor : cfg.particleColor2,
            boxShadow: `0 0 12px ${cfg.burstColor}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i / 12) * Math.PI * 2) * (120 + i * 20),
            y: Math.sin((i / 12) * Math.PI * 2) * (100 + i * 15),
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{ duration: 0.6, delay: 0.05 }}
        />
      ))}
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────

export default function WeaponIdleEffect({
  element,
  size,
  attacking = false,
  burst = false,
  onBurstDone,
}: WeaponIdleEffectProps) {
  return (
    <>
      {/* Blade glow overlay */}
      <BladeGlow element={element} size={size} attacking={attacking} />

      {/* Idle / attack-intensified particles */}
      <IdleParticles element={element} size={size} attacking={attacking} />

      {/* Full-screen burst on attack */}
      <AnimatePresence>
        {burst && (
          <BurstOverlay element={element} onDone={() => onBurstDone?.()} />
        )}
      </AnimatePresence>
    </>
  );
}
