import { motion } from "motion/react";
import type { ElementType } from "../data/ninjaData";

interface WeaponAttackEffectProps {
  weaponType: "sword" | "spear" | "fan" | "hammer";
  animationType: string;
  element: ElementType;
  fromPlayer: boolean; // true = from left (player), false = from right (opponent)
  color: string;
  onComplete: () => void;
}

// ── Sword Slash Effect ─────────────────────────────────────────────────────
function SwordSlash({
  color,
  fromPlayer,
}: { color: string; fromPlayer: boolean }) {
  const _dir = fromPlayer ? 1 : -1;
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.55 }}
    >
      {/* Main slash arc */}
      <motion.div
        className="absolute"
        initial={{
          x: fromPlayer ? "-30%" : "30%",
          scaleX: 0.2,
          rotate: fromPlayer ? -45 : 45,
          opacity: 0,
        }}
        animate={{
          x: fromPlayer ? ["−30%", "40%"] : ["30%", "−40%"],
          scaleX: [0.2, 1.4],
          rotate: fromPlayer ? [-45, -10] : [45, 10],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{ transformOrigin: fromPlayer ? "left center" : "right center" }}
      >
        <svg
          width="300"
          height="120"
          viewBox="0 0 300 120"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={`slash-grad-${fromPlayer}`}
              x1={fromPlayer ? "0%" : "100%"}
              y1="0%"
              x2={fromPlayer ? "100%" : "0%"}
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="50%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {/* Main blade arc */}
          <path
            d={fromPlayer ? "M20,110 Q100,60 280,10" : "M280,110 Q200,60 20,10"}
            stroke={`url(#slash-grad-${fromPlayer})`}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Secondary thinner arc */}
          <path
            d={fromPlayer ? "M20,100 Q110,55 280,20" : "M280,100 Q190,55 20,20"}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Impact sparkles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={`sparkle-${i}`}
              cx={fromPlayer ? 240 + i * 8 : 60 - i * 8}
              cy={20 + i * 6}
              r={3 - i * 0.4}
              fill="#ffffff"
              opacity={0.9 - i * 0.18}
            />
          ))}
        </svg>
      </motion.div>

      {/* Fire/element trail particles */}
      {([0, 1, 2, 3, 4, 5, 6, 7] as const).map((i) => (
        <motion.div
          key={`slash-particle-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          initial={{
            x: fromPlayer ? -100 + i * 20 : 100 - i * 20,
            y: -30 + i * 10,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [
              fromPlayer ? -100 + i * 20 : 100 - i * 20,
              fromPlayer ? 80 + i * 15 : -80 - i * 15,
            ],
            y: [-30 + i * 10, -60 + i * 5],
            opacity: [0, 0.9, 0],
            scale: [0, 1, 0],
          }}
          transition={{ duration: 0.5, delay: i * 0.03 }}
        />
      ))}
    </motion.div>
  );
}

// ── Spear Thrust Effect ────────────────────────────────────────────────────
function SpearThrust({
  color,
  fromPlayer,
}: { color: string; fromPlayer: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.6 }}
    >
      {/* Spear projectile */}
      <motion.div
        className="absolute"
        initial={{
          x: fromPlayer ? -150 : 150,
          opacity: 0,
          scaleX: fromPlayer ? 1 : -1,
        }}
        animate={{
          x: [fromPlayer ? -150 : 150, fromPlayer ? 150 : -150],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 0.5, ease: "easeIn" }}
        style={{ top: "45%" }}
      >
        <svg
          width="200"
          height="30"
          viewBox="0 0 200 30"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="spear-grad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="80%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {/* Shaft */}
          <line
            x1="0"
            y1="15"
            x2="170"
            y2="15"
            stroke={"url(#spear-grad)"}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Tip */}
          <polygon points="170,5 200,15 170,25" fill={color} opacity="0.95" />
          {/* Water trail */}
          {[0, 1, 2, 3].map((i) => (
            <ellipse
              key={`water-trail-${i}`}
              cx={30 + i * 40}
              cy={15}
              rx={6 - i}
              ry={2}
              fill={color}
              opacity={0.3 - i * 0.06}
            />
          ))}
        </svg>
      </motion.div>

      {/* Water ripple impact */}
      <motion.div
        className="absolute rounded-full"
        initial={{
          scale: 0,
          opacity: 1,
          x: fromPlayer ? 100 : -100,
          y: "-50%",
        }}
        animate={{ scale: [0, 3], opacity: [1, 0] }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          width: 60,
          height: 60,
          border: `3px solid ${color}`,
          boxShadow: `0 0 15px ${color}`,
        }}
      />
    </motion.div>
  );
}

// ── Fan Spin Effect ────────────────────────────────────────────────────────
function FanSpin({
  color,
  fromPlayer,
}: { color: string; fromPlayer: boolean }) {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      {/* Spinning fan blade */}
      <motion.div
        className="absolute"
        style={{ x: fromPlayer ? -80 : 80, top: "35%" }}
        animate={{
          x: fromPlayer ? [-80, 80] : [80, -80],
          rotate: fromPlayer ? [0, 720] : [0, -720],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.2, 1.2, 0],
        }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="fan-grad">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </radialGradient>
          </defs>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={`fan-blade-${deg}`}
              cx="40"
              cy="40"
              rx="32"
              ry="8"
              fill={"url(#fan-grad)"}
              opacity="0.8"
              transform={`rotate(${deg}, 40, 40)`}
            />
          ))}
          <circle cx="40" cy="40" r="6" fill="#ffffff" opacity="0.9" />
        </svg>
      </motion.div>

      {/* Wind spiral lines */}
      {([0, 1, 2, 3, 4, 5] as const).map((i) => (
        <motion.div
          key={`wind-spiral-${i}`}
          className="absolute"
          style={{ x: fromPlayer ? -60 + i * 15 : 60 - i * 15 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.5, 0],
            rotate: [0, 360],
          }}
          transition={{ duration: 0.4, delay: i * 0.04 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            role="img"
            aria-hidden="true"
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Hammer Slam Effect ─────────────────────────────────────────────────────
function HammerSlam({
  color,
  fromPlayer,
}: { color: string; fromPlayer: boolean }) {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      {/* Hammer descending */}
      <motion.div
        className="absolute"
        style={{ left: fromPlayer ? "60%" : "30%", x: "-50%" }}
        initial={{ y: -150, opacity: 0, rotate: fromPlayer ? -30 : 30 }}
        animate={{
          y: [-150, 20, -10, 0],
          opacity: [0, 1, 1, 0],
          rotate: fromPlayer ? [-30, 10, 5, 0] : [30, -10, -5, 0],
          scale: [0.7, 1.3, 1.1, 0],
        }}
        transition={{ duration: 0.55, ease: "easeIn" }}
      >
        <svg
          width="60"
          height="100"
          viewBox="0 0 60 100"
          role="img"
          aria-hidden="true"
        >
          <rect
            x="15"
            y="0"
            width="30"
            height="25"
            rx="4"
            fill={color}
            opacity="0.95"
          />
          <rect
            x="22"
            y="5"
            width="16"
            height="20"
            rx="2"
            fill="#ffffff"
            opacity="0.2"
          />
          <line
            x1="30"
            y1="25"
            x2="30"
            y2="95"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </motion.div>

      {/* Ground shockwave */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: "15%",
          left: fromPlayer ? "55%" : "35%",
          transform: "translateX(-50%)",
        }}
        initial={{ scaleX: 0, scaleY: 0.2, opacity: 0.9 }}
        animate={{ scaleX: [0, 4], scaleY: [0.2, 0.5], opacity: [0.9, 0] }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div
          style={{
            width: 80,
            height: 20,
            background: `radial-gradient(ellipse, ${color}88 0%, transparent 70%)`,
            border: `2px solid ${color}`,
            borderRadius: "50%",
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      </motion.div>

      {/* Rock fragments */}
      {([0, 1, 2, 3, 4, 5, 6, 7] as const).map((i) => (
        <motion.div
          key={`rock-frag-${i}`}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            background: color,
            left: fromPlayer ? "55%" : "35%",
            bottom: "20%",
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [-20 + i * 8, -60 + i * 20],
            y: [0, -(40 + i * 15)],
          }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.02 }}
        />
      ))}
    </motion.div>
  );
}

// ── Dragon Summon Effect ───────────────────────────────────────────────────
function DragonSummon({
  color,
  fromPlayer,
}: { color: string; fromPlayer: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.2 }}
    >
      {/* Dragon silhouette */}
      <motion.div
        initial={{
          scale: 0,
          x: fromPlayer ? -200 : 200,
          rotate: fromPlayer ? -20 : 20,
        }}
        animate={{
          scale: [0, 1.5, 1, 0],
          x: [fromPlayer ? -200 : 200, 0],
          rotate: [fromPlayer ? -20 : 20, 0],
        }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="text-center"
      >
        <div
          style={{
            fontSize: 100,
            filter: `drop-shadow(0 0 30px ${color}) drop-shadow(0 0 60px ${color}88)`,
          }}
        >
          🐉
        </div>
        <motion.div
          className="font-black text-2xl tracking-widest mt-2"
          style={{
            color,
            textShadow: `0 0 20px ${color}, 0 0 40px ${color}66`,
            fontFamily: "var(--font-display, Bricolage Grotesque)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0] }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ELEMENTAL DRAGON!
        </motion.div>
      </motion.div>

      {/* Elemental particles radiating */}
      {([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const).map((i) => (
        <motion.div
          key={`dragon-particle-${i}`}
          className="absolute w-3 h-3 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i / 12) * Math.PI * 2) * 120,
            y: Math.sin((i / 12) * Math.PI * 2) * 120,
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.02 }}
        />
      ))}
    </motion.div>
  );
}

// ── Explosion Effect ───────────────────────────────────────────────────────
function ExplosionEffect({
  color,
  fromPlayer,
}: { color: string; fromPlayer: boolean }) {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <motion.div
        className="absolute rounded-full"
        style={{
          x: fromPlayer ? 60 : -60,
          width: 80,
          height: 80,
          background: `radial-gradient(circle, #ffffff 0%, ${color} 40%, transparent 70%)`,
          boxShadow: `0 0 30px ${color}, 0 0 60px ${color}88`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 2.5, 3.5], opacity: [1, 0.8, 0] }}
        transition={{ duration: 0.55 }}
      />
      {([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((i) => (
        <motion.div
          key={`explosion-shard-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{ background: color, x: fromPlayer ? 60 : -60 }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: [
              fromPlayer ? 60 : -60,
              (fromPlayer ? 60 : -60) + Math.cos((i / 10) * Math.PI * 2) * 80,
            ],
            y: [0, Math.sin((i / 10) * Math.PI * 2) * 80],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{ duration: 0.45, delay: 0.05 }}
        />
      ))}
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function WeaponAttackEffect({
  weaponType,
  animationType,
  fromPlayer,
  color,
  onComplete,
}: WeaponAttackEffectProps) {
  const duration = animationType === "dragon" ? 1200 : 600;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      onAnimationComplete={() => setTimeout(onComplete, duration - 100)}
    >
      {animationType === "dragon" ? (
        <DragonSummon color={color} fromPlayer={fromPlayer} />
      ) : animationType === "explosion" ? (
        <ExplosionEffect color={color} fromPlayer={fromPlayer} />
      ) : weaponType === "sword" ? (
        <SwordSlash color={color} fromPlayer={fromPlayer} />
      ) : weaponType === "spear" ? (
        <SpearThrust color={color} fromPlayer={fromPlayer} />
      ) : weaponType === "fan" ? (
        <FanSpin color={color} fromPlayer={fromPlayer} />
      ) : weaponType === "hammer" ? (
        <HammerSlam color={color} fromPlayer={fromPlayer} />
      ) : (
        <ExplosionEffect color={color} fromPlayer={fromPlayer} />
      )}
    </motion.div>
  );
}
