import { useEffect } from "react";
import type { ElementType } from "../data/ninjaData";

interface AnimatedMoveEffectProps {
  animationType: "projectile" | "explosion" | "area" | "self" | "dragon";
  element: ElementType;
  fromLeft: boolean; // true = traveling left→right, false = traveling right→left
  color: string;
  onComplete: () => void;
}

// Elemental color configs
const ELEMENT_VISUALS: Record<
  ElementType,
  { gradient: string; glow: string; particle: string }
> = {
  fire: {
    gradient:
      "radial-gradient(ellipse, #ff8800 0%, #ff4400 40%, #ff000066 100%)",
    glow: "#ff4400",
    particle: "🔥",
  },
  water: {
    gradient:
      "radial-gradient(ellipse, #66ddff 0%, #0088ff 40%, #003399aa 100%)",
    glow: "#0088ff",
    particle: "💧",
  },
  air: {
    gradient:
      "radial-gradient(ellipse, #ffffff 0%, #88ffcc 40%, #00cc7744 100%)",
    glow: "#88ffcc",
    particle: "🌪",
  },
  earth: {
    gradient:
      "radial-gradient(ellipse, #e8c87a 0%, #c8a96e 40%, #7a5a2066 100%)",
    glow: "#c8a96e",
    particle: "⛰",
  },
};

export default function AnimatedMoveEffect({
  animationType,
  element,
  fromLeft,
  color,
  onComplete,
}: AnimatedMoveEffectProps) {
  const visuals = ELEMENT_VISUALS[element];

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 700);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (animationType === "projectile") {
    return (
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 30 }}
      >
        {/* Main energy orb */}
        <div
          className={fromLeft ? "move-projectile" : "move-projectile-left"}
          style={{
            position: "absolute",
            top: "42%",
            left: fromLeft ? "15%" : "75%",
            width: 40,
            height: 28,
            borderRadius: "50%",
            background: visuals.gradient,
            boxShadow: `0 0 20px ${visuals.glow}, 0 0 40px ${visuals.glow}88`,
            zIndex: 31,
          }}
        />
        {/* Trail orbs */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={fromLeft ? "move-projectile" : "move-projectile-left"}
            style={{
              position: "absolute",
              top: `${40 + (i - 2) * 4}%`,
              left: fromLeft ? `${10 - i * 2}%` : `${80 + i * 2}%`,
              width: 22 - i * 4,
              height: 16 - i * 3,
              borderRadius: "50%",
              background: visuals.gradient,
              boxShadow: `0 0 12px ${visuals.glow}`,
              opacity: 0.6 - i * 0.15,
              animationDelay: `${i * 30}ms`,
              zIndex: 30,
            }}
          />
        ))}
        {/* Energy streaks */}
        <div
          className={fromLeft ? "move-projectile" : "move-projectile-left"}
          style={{
            position: "absolute",
            top: "43%",
            left: fromLeft ? "5%" : "60%",
            width: 80,
            height: 4,
            background: `linear-gradient(${fromLeft ? "90deg" : "270deg"}, transparent, ${visuals.glow}, transparent)`,
            borderRadius: 4,
            animationDelay: "20ms",
            zIndex: 29,
          }}
        />
      </div>
    );
  }

  if (animationType === "explosion") {
    return (
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{ zIndex: 30 }}
      >
        {/* Main explosion rings */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="move-explosion absolute"
            style={{
              width: 60 + i * 20,
              height: 60 + i * 20,
              borderRadius: "50%",
              border: `${4 - i}px solid ${color}`,
              boxShadow: `0 0 ${20 + i * 10}px ${visuals.glow}`,
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
        {/* Central flash */}
        <div
          className="move-explosion absolute"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: visuals.gradient,
            boxShadow: `0 0 40px ${visuals.glow}, 0 0 80px ${visuals.glow}66`,
          }}
        />
        {/* Spark particles */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const idx = angle / 45;
          return (
            <div
              key={angle}
              className="move-explosion absolute"
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: visuals.glow,
                boxShadow: `0 0 8px ${visuals.glow}`,
                transform: `translate(${Math.cos(rad) * 60}px, ${Math.sin(rad) * 60}px)`,
                animationDelay: `${50 + idx * 20}ms`,
              }}
            />
          );
        })}
      </div>
    );
  }

  if (animationType === "area") {
    return (
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 30 }}
      >
        {/* Ground wave */}
        <div
          className="move-area-wave absolute bottom-[20%] left-0 right-0"
          style={{
            height: 60,
            background: `linear-gradient(to top, ${visuals.glow}88, transparent)`,
            boxShadow: `0 -8px 30px ${visuals.glow}66`,
          }}
        />
        {/* Secondary wave */}
        <div
          className="move-area-wave absolute bottom-[15%] left-0 right-0"
          style={{
            height: 40,
            background: `linear-gradient(to top, ${visuals.glow}aa, transparent)`,
            animationDelay: "80ms",
          }}
        />
        {/* Top wave */}
        <div
          className="move-area-wave absolute top-[20%] left-0 right-0"
          style={{
            height: 30,
            background: `linear-gradient(to bottom, ${visuals.glow}55, transparent)`,
            animationDelay: "150ms",
          }}
        />
        {/* Center flash */}
        <div
          className="move-explosion absolute inset-0 m-auto"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${visuals.glow}44 0%, transparent 70%)`,
          }}
        />
      </div>
    );
  }

  if (animationType === "dragon") {
    // Flip SVG horizontally when attacking from right side
    const dragonFlip = !fromLeft ? { transform: "scaleX(-1)" } : {};

    // ── Fire Dragon: body and wings made of living flames ──────────────────
    if (element === "fire") {
      return (
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center dragon-summon"
          style={{ zIndex: 35 }}
        >
          <svg
            viewBox="0 0 400 250"
            role="img"
            aria-label="Fire dragon attack"
            style={{
              width: "85%",
              height: "auto",
              filter:
                "drop-shadow(0 0 18px #ff4400) drop-shadow(0 0 40px #ff880088)",
              ...dragonFlip,
            }}
          >
            <title>Fire Dragon</title>
            <defs>
              {/* Main fire body gradient */}
              <linearGradient
                id="fire-body-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ff8800" stopOpacity="0" />
                <stop offset="20%" stopColor="#ff6600" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#ff4400" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff2200" stopOpacity="0.95" />
              </linearGradient>
              {/* Wing gradient */}
              <radialGradient id="fire-wing-grad" cx="50%" cy="100%">
                <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ff4400" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
              </radialGradient>
              {/* Breath gradient */}
              <linearGradient
                id="fire-breath-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ffcc00" stopOpacity="1" />
                <stop offset="40%" stopColor="#ff6600" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Dragon body — sweeping serpentine form */}
            <path
              d="M40,155 C70,100 130,75 170,85 C210,95 230,120 260,105 C290,90 320,75 355,80"
              stroke="url(#fire-body-grad)"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            {/* Body inner glow line */}
            <path
              d="M40,155 C70,100 130,75 170,85 C210,95 230,120 260,105 C290,90 320,75 355,80"
              stroke="#ffcc00"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Flame shapes along body — flickering wavy tips */}
            <path
              d="M90,110 C95,85 105,70 100,55 C115,70 120,88 110,108Z"
              fill="#ff8800"
              opacity="0.85"
            />
            <path
              d="M130,95 C135,68 148,52 142,35 C158,52 162,72 150,92Z"
              fill="#ff4400"
              opacity="0.8"
            />
            <path
              d="M170,85 C175,58 188,42 182,24 C198,42 202,65 190,83Z"
              fill="#ff6600"
              opacity="0.9"
            />
            <path
              d="M215,92 C220,65 233,50 227,33 C243,50 246,72 234,90Z"
              fill="#ff4400"
              opacity="0.75"
            />
            <path
              d="M255,105 C260,78 272,63 267,46 C282,63 285,85 273,103Z"
              fill="#ff8800"
              opacity="0.8"
            />
            {/* Small flame wisps */}
            <path
              d="M100,118 C103,105 110,98 107,89 C114,98 116,108 112,117Z"
              fill="#ffcc00"
              opacity="0.7"
            />
            <path
              d="M150,100 C153,87 160,80 157,71 C164,80 166,90 162,99Z"
              fill="#ffcc00"
              opacity="0.65"
            />
            <path
              d="M200,97 C203,84 210,77 207,68 C214,77 216,87 212,96Z"
              fill="#ffcc00"
              opacity="0.7"
            />

            {/* Flame wings */}
            <path
              d="M170,85 C145,30 185,5 220,28 C205,18 182,42 185,70 C180,78 175,83 170,85Z"
              fill="url(#fire-wing-grad)"
              opacity="0.85"
            />
            <path
              d="M220,95 C195,38 232,12 268,36 C252,25 228,50 232,78 C227,87 222,93 220,95Z"
              fill="url(#fire-wing-grad)"
              opacity="0.75"
            />
            {/* Wing flame detail */}
            <path
              d="M185,35 C192,20 202,12 198,4 C208,14 210,26 203,35Z"
              fill="#ffcc00"
              opacity="0.8"
            />
            <path
              d="M240,40 C247,24 257,16 253,8 C263,18 265,30 258,40Z"
              fill="#ff8800"
              opacity="0.75"
            />

            {/* Dragon head */}
            <ellipse
              cx="355"
              cy="80"
              rx="28"
              ry="20"
              fill="#ff4400"
              opacity="0.95"
            />
            {/* Snout */}
            <path
              d="M370,72 C385,65 395,72 390,80 C385,68 373,72 370,72Z"
              fill="#ff6600"
              opacity="0.9"
            />
            {/* Eye glow */}
            <circle cx="360" cy="75" r="5" fill="#ffcc00" opacity="1" />
            <circle cx="360" cy="75" r="3" fill="#ffffff" opacity="0.9" />
            {/* Horns */}
            <path
              d="M350,65 C345,50 348,38 355,42 C352,48 353,58 355,65Z"
              fill="#ff2200"
              opacity="0.9"
            />
            <path
              d="M365,62 C362,47 366,36 372,40 C368,46 366,56 366,62Z"
              fill="#ff2200"
              opacity="0.85"
            />
            {/* Teeth */}
            <path d="M375,78 L378,88 L381,78Z" fill="#ffcc00" opacity="0.9" />
            <path d="M382,76 L385,86 L388,76Z" fill="#ffcc00" opacity="0.85" />

            {/* Fire breath — erupting flames from head */}
            <path
              d="M385,78 C400,65 420,58 440,62 C420,70 400,78 395,85 C415,72 435,72 445,78 C425,82 402,86 390,90Z"
              fill="url(#fire-breath-grad)"
              opacity="0.9"
            />
            <path
              d="M400,70 C415,55 435,50 448,54 C428,62 408,68 400,70Z"
              fill="#ffcc00"
              opacity="0.7"
            />
            <path
              d="M400,84 C415,75 435,72 450,76 C430,84 412,88 400,84Z"
              fill="#ff8800"
              opacity="0.65"
            />

            {/* Tail */}
            <path
              d="M40,155 C20,175 10,195 22,212 C34,222 52,210 48,195"
              stroke="#ff4400"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M22,212 C18,225 25,232 32,228 C26,228 24,220 28,214Z"
              fill="#ff6600"
              opacity="0.8"
            />

            {/* Animated ember particles */}
            <circle cx="120" cy="60" r="4" fill="#ffcc00" opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.9;0.2;0.9"
                dur="0.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="60;45;60"
                dur="0.4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="175" cy="45" r="3" fill="#ff8800" opacity="0.85">
              <animate
                attributeName="opacity"
                values="0.85;0.1;0.85"
                dur="0.3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="45;28;45"
                dur="0.3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="230" cy="50" r="5" fill="#ffcc00" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.8;0.15;0.8"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="50;32;50"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="280" cy="65" r="3" fill="#ff4400" opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.9;0.2;0.9"
                dur="0.35s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="65;50;65"
                dur="0.35s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="155" cy="30" r="4" fill="#ff8800" opacity="0.75">
              <animate
                attributeName="opacity"
                values="0.75;0.1;0.75"
                dur="0.45s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values="155;162;155"
                dur="0.45s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      );
    }

    // ── Water Dragon: serpentine body of flowing water with wave fins ──────
    if (element === "water") {
      return (
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center dragon-summon"
          style={{ zIndex: 35 }}
        >
          <svg
            viewBox="0 0 400 250"
            role="img"
            aria-label="Water dragon attack"
            style={{
              width: "85%",
              height: "auto",
              filter:
                "drop-shadow(0 0 18px #0088ff) drop-shadow(0 0 40px #00ffcc66)",
              ...dragonFlip,
            }}
          >
            <title>Water Dragon</title>
            <defs>
              <linearGradient
                id="water-body-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#003399" stopOpacity="0" />
                <stop offset="20%" stopColor="#0066cc" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#0088ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#66ddff" stopOpacity="0.95" />
              </linearGradient>
              <radialGradient id="water-fin-grad" cx="50%" cy="100%">
                <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0088ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#003399" stopOpacity="0" />
              </radialGradient>
              <linearGradient
                id="water-breath-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#66ddff" stopOpacity="1" />
                <stop offset="40%" stopColor="#0088ff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#00ffcc" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Dragon body — flowing serpentine wave */}
            <path
              d="M40,135 C65,90 115,75 155,90 C195,105 215,130 250,115 C285,100 315,80 355,88"
              stroke="url(#water-body-grad)"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            {/* Inner water current line */}
            <path
              d="M40,135 C65,90 115,75 155,90 C195,105 215,130 250,115 C285,100 315,80 355,88"
              stroke="#66ddff"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* Wave-shaped fins along body */}
            <path
              d="M100,82 C105,60 118,50 115,32 C125,45 128,65 122,82Z"
              fill="url(#water-fin-grad)"
              opacity="0.85"
            />
            <path
              d="M155,90 C160,65 175,52 170,32 C182,48 185,70 178,90Z"
              fill="url(#water-fin-grad)"
              opacity="0.8"
            />
            <path
              d="M215,115 C220,88 235,74 230,54 C242,72 245,95 237,115Z"
              fill="url(#water-fin-grad)"
              opacity="0.75"
            />
            {/* Sinusoidal wave fins beneath body */}
            <path
              d="M80,142 C90,155 105,160 115,148 C125,136 140,130 150,142 C160,155 175,162 185,150Z"
              stroke="#66ddff"
              strokeWidth="3"
              fill="#0088ff"
              fillOpacity="0.3"
              opacity="0.8"
            />
            <path
              d="M195,128 C205,140 220,145 230,133 C240,121 255,115 265,127Z"
              stroke="#00ffcc"
              strokeWidth="3"
              fill="#0088ff"
              fillOpacity="0.3"
              opacity="0.7"
            />

            {/* Dragon wings — translucent water membrane */}
            <path
              d="M155,90 C130,38 168,12 205,38 C190,26 165,52 168,78 C163,85 158,89 155,90Z"
              fill="url(#water-fin-grad)"
              opacity="0.75"
            />
            <path
              d="M215,108 C188,52 228,25 265,52 C248,40 222,66 226,95 C221,104 217,108 215,108Z"
              fill="url(#water-fin-grad)"
              opacity="0.65"
            />

            {/* Dragon head */}
            <ellipse
              cx="355"
              cy="88"
              rx="28"
              ry="20"
              fill="#0066cc"
              opacity="0.95"
            />
            {/* Snout */}
            <path
              d="M368,80 C382,72 392,80 388,88 C382,76 370,80 368,80Z"
              fill="#0088ff"
              opacity="0.9"
            />
            {/* Eye — glowing teal */}
            <circle cx="358" cy="83" r="5" fill="#00ffcc" opacity="1" />
            <circle cx="358" cy="83" r="3" fill="#ffffff" opacity="0.9" />
            {/* Fin-horns */}
            <path
              d="M347,72 C342,56 346,44 353,48 C350,54 350,64 352,72Z"
              fill="#66ddff"
              opacity="0.9"
            />
            <path
              d="M362,68 C359,52 364,41 370,46 C366,52 364,62 364,68Z"
              fill="#0088ff"
              opacity="0.85"
            />

            {/* Water breath — fan of spray arcs */}
            <path
              d="M382,84 C398,70 418,65 438,68 C418,78 398,86 392,92 C410,75 432,74 445,80 C425,86 404,90 390,94Z"
              fill="url(#water-breath-grad)"
              opacity="0.85"
            />
            <path
              d="M395,74 C412,58 434,52 450,56 C430,66 408,72 395,74Z"
              fill="#66ddff"
              opacity="0.6"
            />
            <path
              d="M395,90 C412,80 432,78 448,82 C428,90 408,94 395,90Z"
              fill="#00ffcc"
              opacity="0.55"
            />

            {/* Tail — fluid wave form */}
            <path
              d="M40,135 C20,158 12,180 24,198 C36,210 54,198 50,182"
              stroke="#0088ff"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M24,198 C20,212 28,218 36,214 C30,214 28,206 32,200Z"
              fill="#66ddff"
              opacity="0.7"
            />

            {/* Water droplet shapes scattered */}
            <ellipse
              cx="118"
              cy="48"
              rx="5"
              ry="8"
              fill="#66ddff"
              opacity="0.8"
              transform="rotate(-15,118,48)"
            />
            <ellipse
              cx="178"
              cy="35"
              rx="4"
              ry="7"
              fill="#00ffcc"
              opacity="0.75"
              transform="rotate(10,178,35)"
            />
            <ellipse
              cx="235"
              cy="48"
              rx="6"
              ry="9"
              fill="#0088ff"
              opacity="0.7"
              transform="rotate(-20,235,48)"
            />

            {/* Animated ripple rings */}
            <circle
              cx="200"
              cy="130"
              r="20"
              stroke="#66ddff"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="10;35;10"
                dur="0.6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;0;0.7"
                dur="0.6s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="200"
              cy="130"
              r="10"
              stroke="#0088ff"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            >
              <animate
                attributeName="r"
                values="5;25;5"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="140"
              cy="110"
              r="8"
              stroke="#00ffcc"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            >
              <animate
                attributeName="r"
                values="4;18;4"
                dur="0.45s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="0.45s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      );
    }

    // ── Air Dragon: ghostly swirling wind spirals, barely visible ──────────
    if (element === "air") {
      return (
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center dragon-summon"
          style={{ zIndex: 35 }}
        >
          <svg
            viewBox="0 0 400 250"
            role="img"
            aria-label="Air dragon attack"
            style={{
              width: "85%",
              height: "auto",
              filter:
                "drop-shadow(0 0 16px #88ffcc) drop-shadow(0 0 32px #ffffff44)",
              opacity: 0.85,
              ...dragonFlip,
            }}
          >
            <title>Air Dragon</title>
            <defs>
              <linearGradient
                id="air-body-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#88ffcc" stopOpacity="0" />
                <stop offset="30%" stopColor="#ccffee" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#88ffcc" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#44ffaa" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Dragon body — dashed stroke to imply wind form */}
            <path
              d="M40,140 C70,95 125,78 162,92 C200,106 222,128 258,112 C295,96 322,78 358,86"
              stroke="url(#air-body-grad)"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="18 8"
              opacity="0.65"
            />
            {/* Secondary wind current */}
            <path
              d="M45,148 C75,105 130,88 167,102 C205,116 227,138 263,122 C298,106 328,86 362,94"
              stroke="#ccffee"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="10 12"
              opacity="0.45"
            />

            {/* Tornado/vortex spiral at center */}
            <path
              d="M190,95 C210,85 228,88 230,100 C232,112 218,120 202,116 C186,112 178,100 182,88 C186,76 200,70 214,74 C228,78 238,92 236,108"
              stroke="#88ffcc"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M194,98 C208,90 222,94 224,104 C226,114 215,120 203,117"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* Spiral wind fins */}
            <path
              d="M120,85 C125,65 138,55 145,62 C140,70 130,78 128,85Z"
              stroke="#88ffcc"
              strokeWidth="2"
              fill="#ccffee"
              fillOpacity="0.3"
              opacity="0.7"
            />
            <path
              d="M162,92 C167,68 182,55 190,62 C184,72 172,82 170,92Z"
              stroke="#44ffaa"
              strokeWidth="2"
              fill="#ccffee"
              fillOpacity="0.25"
              opacity="0.65"
            />
            <path
              d="M222,110 C227,86 242,72 250,80 C244,90 232,100 230,110Z"
              stroke="#88ffcc"
              strokeWidth="2"
              fill="#ccffee"
              fillOpacity="0.25"
              opacity="0.6"
            />
            <path
              d="M262,105 C266,78 280,62 290,70 C282,82 270,95 268,105Z"
              stroke="#44ffaa"
              strokeWidth="2"
              fill="#ccffee"
              fillOpacity="0.2"
              opacity="0.55"
            />

            {/* Wind concentric spirals — wing-like */}
            <path
              d="M162,92 C140,45 172,18 205,42 C192,30 170,56 172,82Z"
              stroke="#88ffcc"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 4"
              opacity="0.6"
            />
            <path
              d="M155,98 C130,48 164,20 200,46 C186,33 162,60 164,88Z"
              stroke="#ccffee"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 6"
              opacity="0.45"
            />
            <path
              d="M222,110 C198,58 232,28 270,56 C254,42 230,70 232,100Z"
              stroke="#44ffaa"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 4"
              opacity="0.55"
            />

            {/* Dragon head — ghost-like */}
            <ellipse
              cx="358"
              cy="86"
              rx="26"
              ry="18"
              stroke="#88ffcc"
              strokeWidth="2"
              fill="#ccffee"
              fillOpacity="0.3"
              opacity="0.7"
            />
            <path
              d="M368,78 C380,70 390,78 386,86 C380,74 370,78 368,78Z"
              stroke="#44ffaa"
              strokeWidth="1.5"
              fill="#ccffee"
              fillOpacity="0.2"
              opacity="0.65"
            />
            {/* Eye — bright mint spark */}
            <circle cx="356" cy="81" r="5" fill="#ffffff" opacity="0.8" />
            <circle cx="356" cy="81" r="2.5" fill="#88ffcc" opacity="1" />
            {/* Horn wisps */}
            <path
              d="M346,72 C342,56 348,44 354,50"
              stroke="#88ffcc"
              strokeWidth="2"
              fill="none"
              strokeDasharray="3 3"
              opacity="0.7"
            />
            <path
              d="M360,68 C358,52 364,41 370,48"
              stroke="#ccffee"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3 3"
              opacity="0.65"
            />

            {/* Wind breath — radiating streaks */}
            <line
              x1="382"
              y1="82"
              x2="430"
              y2="68"
              stroke="#88ffcc"
              strokeWidth="3"
              strokeDasharray="8 4"
              opacity="0.7"
            />
            <line
              x1="382"
              y1="87"
              x2="440"
              y2="82"
              stroke="#ccffee"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              opacity="0.6"
            />
            <line
              x1="382"
              y1="92"
              x2="432"
              y2="100"
              stroke="#44ffaa"
              strokeWidth="2"
              strokeDasharray="7 4"
              opacity="0.55"
            />
            <line
              x1="382"
              y1="76"
              x2="425"
              y2="58"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="5 5"
              opacity="0.5"
            />
            <line
              x1="382"
              y1="96"
              x2="428"
              y2="112"
              stroke="#88ffcc"
              strokeWidth="2"
              strokeDasharray="5 5"
              opacity="0.5"
            />

            {/* Wind starburst streaks radiating outward */}
            {[0, 30, 60, 90, 120, 150, 210, 240, 270, 300, 330].map(
              (angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx2 = 200 + Math.cos(rad) * 95;
                const cy2 = 115 + Math.sin(rad) * 65;
                return (
                  <line
                    key={angle}
                    x1={200 + Math.cos(rad) * 25}
                    y1={115 + Math.sin(rad) * 18}
                    x2={cx2}
                    y2={cy2}
                    stroke="#88ffcc"
                    strokeWidth={1.5}
                    strokeDasharray="4 6"
                    opacity={0.3 + (i % 3) * 0.1}
                  />
                );
              },
            )}

            {/* Tail — trailing wind spiral */}
            <path
              d="M40,140 C20,162 12,185 24,202 C36,214 52,202 48,186"
              stroke="#88ffcc"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="14 7"
              opacity="0.6"
            />
          </svg>
        </div>
      );
    }

    // ── Earth Dragon: massive rocky body of boulders and stone polygons ────
    if (element === "earth") {
      return (
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center dragon-summon"
          style={{ zIndex: 35 }}
        >
          <svg
            viewBox="0 0 400 250"
            role="img"
            aria-label="Earth dragon attack"
            style={{
              width: "85%",
              height: "auto",
              filter:
                "drop-shadow(0 0 16px #c8a96e) drop-shadow(0 0 36px #8b691488)",
              ...dragonFlip,
            }}
          >
            <title>Earth Dragon</title>
            <defs>
              <linearGradient
                id="earth-body-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#5c4a2a" stopOpacity="0" />
                <stop offset="20%" stopColor="#8b6914" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#c8a96e" stopOpacity="1" />
                <stop offset="100%" stopColor="#e8d4a8" stopOpacity="0.95" />
              </linearGradient>
              <radialGradient id="earth-rock-grad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#e8d4a8" stopOpacity="1" />
                <stop offset="60%" stopColor="#c8a96e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#5c4a2a" stopOpacity="0.7" />
              </radialGradient>
            </defs>

            {/* Dragon body — thick stone-like form */}
            <path
              d="M38,152 C68,108 125,88 165,100 C205,112 225,136 262,118 C298,100 325,82 358,90"
              stroke="url(#earth-body-grad)"
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
            />
            {/* Rock crack lines along body */}
            <path
              d="M80,120 L88,138 L78,145"
              stroke="#5c4a2a"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M135,102 L142,118 L132,124"
              stroke="#5c4a2a"
              strokeWidth="2"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M195,112 L202,128 L192,134"
              stroke="#8b6914"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M248,115 L255,130 L245,136"
              stroke="#5c4a2a"
              strokeWidth="1.5"
              fill="none"
              opacity="0.65"
            />

            {/* Rocky boulder scales along back */}
            {/* Scale row 1 */}
            <polygon
              points="88,98 100,82 112,98 100,104"
              fill="url(#earth-rock-grad)"
              opacity="0.9"
            />
            <polygon
              points="118,90 132,74 144,90 132,97"
              fill="#c8a96e"
              opacity="0.85"
            />
            <polygon
              points="150,88 164,70 178,88 164,96"
              fill="url(#earth-rock-grad)"
              opacity="0.9"
            />
            <polygon
              points="188,96 202,78 218,96 202,104"
              fill="#c8a96e"
              opacity="0.85"
            />
            <polygon
              points="228,106 242,88 258,106 242,114"
              fill="url(#earth-rock-grad)"
              opacity="0.8"
            />
            <polygon
              points="268,102 282,84 298,102 282,110"
              fill="#c8a96e"
              opacity="0.8"
            />
            {/* Scale row 2 (smaller) */}
            <polygon
              points="103,95 112,84 121,95 112,100"
              fill="#8b6914"
              opacity="0.75"
            />
            <polygon
              points="160,84 170,72 180,84 170,90"
              fill="#8b6914"
              opacity="0.7"
            />
            <polygon
              points="220,98 230,86 240,98 230,104"
              fill="#8b6914"
              opacity="0.7"
            />

            {/* Boulder polygon wings */}
            <path
              d="M165,100 C148,55 182,28 218,52 C204,40 178,65 180,92Z"
              fill="#c8a96e"
              opacity="0.85"
            />
            {/* Wing rock detail */}
            <polygon
              points="170,68 180,52 192,68 180,76"
              fill="#e8d4a8"
              opacity="0.8"
            />
            <polygon
              points="185,55 195,40 205,55 195,62"
              fill="#c8a96e"
              opacity="0.75"
            />
            <path
              d="M225,112 C206,62 242,35 278,60 C262,48 235,74 238,105Z"
              fill="#8b6914"
              opacity="0.8"
            />
            <polygon
              points="235,75 245,58 258,75 245,83"
              fill="#c8a96e"
              opacity="0.75"
            />

            {/* Dragon head — angular stone skull */}
            <polygon
              points="330,72 358,62 382,78 375,100 345,102 328,88"
              fill="#c8a96e"
              opacity="0.95"
            />
            {/* Rock plates on head */}
            <polygon
              points="340,70 355,58 368,70 355,76"
              fill="#e8d4a8"
              opacity="0.85"
            />
            <polygon
              points="358,65 370,55 380,68 368,74"
              fill="#c8a96e"
              opacity="0.8"
            />
            {/* Snout */}
            <polygon
              points="368,78 382,70 392,82 384,94 368,92"
              fill="#8b6914"
              opacity="0.9"
            />
            {/* Eye — amber glow */}
            <circle cx="348" cy="80" r="6" fill="#ffcc44" opacity="1" />
            <circle cx="348" cy="80" r="3" fill="#ffffff" opacity="0.9" />
            {/* Stone teeth */}
            <polygon
              points="372,90 376,102 380,90"
              fill="#e8d4a8"
              opacity="0.9"
            />
            <polygon
              points="380,88 384,100 388,88"
              fill="#e8d4a8"
              opacity="0.85"
            />
            <polygon
              points="388,86 392,98 396,86"
              fill="#c8a96e"
              opacity="0.8"
            />
            {/* Horn boulders */}
            <polygon
              points="338,65 342,48 350,58 344,68"
              fill="#8b6914"
              opacity="0.9"
            />
            <polygon
              points="352,60 358,44 364,58 358,66"
              fill="#c8a96e"
              opacity="0.85"
            />

            {/* Dirt/rubble breath particles */}
            <polygon
              points="400,76 412,68 418,80 408,88"
              fill="#c8a96e"
              opacity="0.8"
            />
            <polygon
              points="412,72 424,62 430,76 420,82"
              fill="#8b6914"
              opacity="0.7"
            />
            <polygon
              points="408,86 420,80 425,92 412,96"
              fill="#e8d4a8"
              opacity="0.75"
            />
            <polygon
              points="418,68 428,58 436,70 424,78"
              fill="#c8a96e"
              opacity="0.65"
            />

            {/* Ground cracks radiating from base */}
            <path
              d="M100,178 L80,192 L72,210"
              stroke="#8b6914"
              strokeWidth="3"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M100,178 L115,195 L118,218"
              stroke="#5c4a2a"
              strokeWidth="2.5"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M100,178 L135,185 L148,200"
              stroke="#8b6914"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M165,185 L150,202 L145,220"
              stroke="#8b6914"
              strokeWidth="2.5"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M165,185 L180,198 L185,215"
              stroke="#5c4a2a"
              strokeWidth="2"
              fill="none"
              opacity="0.65"
            />
            <path
              d="M225,175 L210,190 L204,208"
              stroke="#8b6914"
              strokeWidth="2.5"
              fill="none"
              opacity="0.65"
            />
            <path
              d="M225,175 L240,185 L248,200"
              stroke="#5c4a2a"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />

            {/* Falling rubble particles */}
            <polygon
              points="112,60 118,50 126,60 118,66"
              fill="#c8a96e"
              opacity="0.85"
            />
            <polygon
              points="170,42 175,32 182,42 175,48"
              fill="#e8d4a8"
              opacity="0.8"
            />
            <polygon
              points="230,55 236,44 244,55 236,61"
              fill="#8b6914"
              opacity="0.75"
            />
            <polygon
              points="285,68 291,56 300,68 291,75"
              fill="#c8a96e"
              opacity="0.7"
            />
            {/* Small pebbles */}
            <circle cx="140" cy="52" r="4" fill="#c8a96e" opacity="0.8" />
            <circle cx="200" cy="40" r="3" fill="#8b6914" opacity="0.75" />
            <circle cx="258" cy="55" r="4" fill="#e8d4a8" opacity="0.7" />
            <circle cx="310" cy="70" r="3" fill="#c8a96e" opacity="0.65" />

            {/* Tail — heavy boulder-tipped tail */}
            <path
              d="M38,152 C18,172 10,195 24,212 C38,222 56,210 52,195"
              stroke="#c8a96e"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
            <polygon
              points="36,205 24,212 30,224 44,218 48,208"
              fill="#c8a96e"
              opacity="0.85"
            />
          </svg>
        </div>
      );
    }

    // Fallback for unknown elements — generic dragon
    return (
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center dragon-summon"
        style={{ zIndex: 35 }}
      >
        <svg
          viewBox="0 0 400 250"
          role="img"
          aria-label="Elemental dragon attack"
          style={{
            width: "85%",
            height: "auto",
            filter: `drop-shadow(0 0 20px ${visuals.glow}) drop-shadow(0 0 40px ${visuals.glow}88)`,
            ...dragonFlip,
          }}
        >
          <title>Elemental Dragon</title>
          <defs>
            <radialGradient id={"dragon-grad-fallback"} cx="50%" cy="50%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="60%" stopColor={visuals.glow} stopOpacity="0.7" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M40,130 C70,88 130,68 165,78 C200,88 220,110 255,95 C290,80 320,65 358,72"
            stroke={color}
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
          <ellipse
            cx="358"
            cy="72"
            rx="26"
            ry="18"
            fill={color}
            opacity="0.9"
          />
          <polygon points="372,62 385,52 378,72" fill={color} opacity="0.95" />
          <circle cx="362" cy="66" r="4" fill="#ffffff" opacity="0.9" />
          <path
            d="M165,78 C145,32 182,8 218,34 C202,22 178,48 180,74Z"
            fill={"url(#dragon-grad-fallback)"}
            opacity="0.7"
          />
          <path
            d="M220,92 C198,44 238,18 274,46 C258,32 232,60 235,90Z"
            fill={"url(#dragon-grad-fallback)"}
            opacity="0.6"
          />
          <path
            d="M40,130 C22,152 14,175 28,192 C40,204 58,192 54,176"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
        <div
          className="move-explosion absolute"
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${visuals.glow}22 0%, transparent 70%)`,
          }}
        />
      </div>
    );
  }

  // self / default
  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
      style={{ zIndex: 30 }}
    >
      {/* Self-buff burst effect */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="move-explosion absolute"
          style={{
            width: 40 + i * 30,
            height: 40 + i * 30,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            boxShadow: `0 0 15px ${visuals.glow}`,
            right: "25%",
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
      {/* Inner glow */}
      <div
        style={{
          position: "absolute",
          right: "28%",
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: visuals.gradient,
          boxShadow: `0 0 30px ${visuals.glow}`,
          animation: "explosion 0.6s ease-out forwards",
        }}
      />
    </div>
  );
}
