import type { ElementType } from "../data/ninjaData";
import { NINJAS } from "../data/ninjaData";
import WeaponIdleEffect from "./WeaponIdleEffect";

interface NinjaSilhouetteProps {
  element: ElementType;
  size?: number;
  isRaging?: boolean;
  isMaster?: boolean;
  facing?: "right" | "left";
  className?: string;
  animate?: boolean;
  entering?: boolean;
  isMega?: boolean;
  isGigamax?: boolean;
  /** Show weapon effects (idle particles + blade glow) */
  showWeaponEffect?: boolean;
  /** Intensify weapon effect — set during an active attack */
  isAttacking?: boolean;
  /** Show the full-screen burst */
  showBurst?: boolean;
  onBurstDone?: () => void;
  /** CSS animation class to apply for battle animations (lunge, recoil, dodge) */
  animClass?: string;
}

// Uses generated anime ninja images as the primary display
export default function NinjaSilhouette({
  element,
  size = 120,
  isRaging = false,
  isMaster = false,
  facing = "right",
  className = "",
  animate = true,
  entering = false,
  isMega = false,
  isGigamax = false,
  showWeaponEffect = false,
  isAttacking = false,
  showBurst = false,
  onBurstDone,
  animClass = "",
}: NinjaSilhouetteProps) {
  const ninja = NINJAS[element];

  // Base color for effects — override with transformation colors
  const effectColor = isRaging ? "#ff2200" : isMaster ? "#ffd700" : ninja.color;

  const flipClass = facing === "left" ? "scale-x-[-1]" : "";
  const enteringClass = entering
    ? facing === "left"
      ? "ninja-entering-left"
      : "ninja-entering-right"
    : "";

  // Larger ninjas (battle) get the full float; smaller ones (select) get the breath
  const baseAnimClass = animate
    ? size >= 100
      ? "ninja-float"
      : "ninja-breath"
    : "";

  // CRITICAL: Mega/Gigantamax do NOT change the size — only aura
  const displaySize = size;

  // Build the CSS filter for the image
  const filterStyle = isMega
    ? "brightness(1.2) saturate(1.3)"
    : isGigamax
      ? "brightness(1.3) saturate(1.1) hue-rotate(200deg)"
      : isRaging
        ? "drop-shadow(0 0 12px #ff2200) brightness(1.3) saturate(1.5)"
        : isMaster
          ? "drop-shadow(0 0 10px #ffd700) brightness(1.15)"
          : `drop-shadow(0 0 8px ${ninja.color}66)`;

  return (
    <div
      className={[
        "relative inline-block",
        flipClass,
        baseAnimClass,
        enteringClass,
        animClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: displaySize, height: displaySize * 1.25 }}
    >
      {/* Background aura glow */}
      <div
        className={`absolute inset-0 rounded-full pointer-events-none ${
          isRaging ? "rage-glow" : isMaster ? "gold-glow" : ninja.glowClass
        }`}
        style={{
          background: `radial-gradient(ellipse at 50% 65%, ${effectColor}2a 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* MEGA EVOLUTION — Orange/Red fire aura (NOT bigger, aura only) */}
      {isMega && !isGigamax && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-8px",
            borderRadius: "50%",
            animation: "mega-fire-aura 1.2s ease-in-out infinite",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}

      {/* MEGA orbiting particles */}
      {isMega && !isGigamax && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 3 }}
        >
          {[0, 120, 240].map((deg) => (
            <div
              key={deg}
              className="absolute"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ff6600",
                boxShadow: "0 0 10px #ff4400, 0 0 20px #ff220088",
                top: "50%",
                left: "50%",
                animation: "megaOrbit 1.5s linear infinite",
                animationDelay: `${(deg / 360) * 1.5}s`,
                transform: `rotate(${deg}deg) translateX(${displaySize * 0.55}px)`,
              }}
            />
          ))}
          {/* Flame wisps */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={`flame-${deg}`}
              className="absolute"
              style={{
                width: 6,
                height: 14,
                borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
                background:
                  "linear-gradient(to top, #ff4400, #ff8800, transparent)",
                top: "50%",
                left: "50%",
                opacity: 0.7,
                animation: `megaOrbit ${0.8 + (deg / 360) * 0.4}s linear infinite`,
                animationDelay: `${(deg / 360) * 0.8}s`,
                transform: `rotate(${deg}deg) translateX(${displaySize * 0.5}px)`,
              }}
            />
          ))}
        </div>
      )}

      {/* GIGANTAMAX — Blue fire aura (NOT bigger, blue aura only) */}
      {isGigamax && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-8px",
            borderRadius: "50%",
            animation: "gigamax-blue-aura 1s ease-in-out infinite",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}

      {/* GIGANTAMAX blue flame particles */}
      {isGigamax && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 3 }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div
              key={`gmax-${deg}`}
              className="absolute"
              style={{
                width: 6,
                height: 18,
                borderRadius: "50% 50% 50% 50% / 20% 20% 80% 80%",
                background:
                  "linear-gradient(to top, #0066ff, #00aaff, transparent)",
                top: "50%",
                left: "50%",
                opacity: 0.8,
                animation: `megaOrbit ${0.6 + (deg / 360) * 0.6}s linear infinite`,
                animationDelay: `${(deg / 360) * 0.6}s`,
                transform: `rotate(${deg}deg) translateX(${displaySize * 0.52}px)`,
              }}
            />
          ))}
          {/* Blue concentric rings */}
          <div
            className="absolute"
            style={{
              inset: "-15%",
              borderRadius: "50%",
              border: "2px solid #0088ff",
              boxShadow: "0 0 20px #0088ff, 0 0 40px #0066ff88",
              animation: "gigamaxRing 1s ease-in-out infinite",
            }}
          />
          <div
            className="absolute"
            style={{
              inset: "-30%",
              borderRadius: "50%",
              border: "1px solid #0066ff66",
              animation: "gigamaxRing 1s ease-in-out infinite 0.3s",
            }}
          />
        </div>
      )}

      {/* Rage particles overlay */}
      {isRaging && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 2 }}
        >
          {([0, 1, 2, 3, 4] as const).map((i) => (
            <div
              key={`rage-particle-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: "#ff4400",
                boxShadow: "0 0 6px #ff4400",
                top: `${20 + i * 12}%`,
                left: `${10 + i * 15}%`,
                animation: `dangerPulse ${0.3 + i * 0.08}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Generated anime ninja image */}
      <img
        src={ninja.imagePath}
        alt={`${ninja.name} - ${ninja.title}`}
        style={{
          width: displaySize,
          height: displaySize * 1.25,
          objectFit: "contain",
          objectPosition: "center bottom",
          position: "relative",
          zIndex: 1,
          filter: filterStyle,
          imageRendering: "crisp-edges",
        }}
        loading="eager"
      />

      {/* Kanji badge overlay */}
      <div
        className="absolute top-0 left-0 text-sm font-bold"
        style={{
          color: effectColor,
          opacity: 0.5,
          textShadow: `0 0 6px ${effectColor}`,
          fontFamily: "serif",
          fontSize: Math.max(10, displaySize * 0.14),
          lineHeight: 1,
          zIndex: 4,
        }}
      >
        {ninja.kanjiLabel}
      </div>

      {/* Master crown badge */}
      {isMaster && (
        <div
          className="absolute top-0 right-0"
          style={{
            zIndex: 4,
            fontSize: Math.max(10, displaySize * 0.15),
          }}
        >
          ✦
        </div>
      )}

      {/* Weapon idle effect — blade glow + particles */}
      {showWeaponEffect && (
        <WeaponIdleEffect
          element={element}
          size={displaySize}
          attacking={isAttacking}
          burst={showBurst}
          onBurstDone={onBurstDone}
        />
      )}
    </div>
  );
}
