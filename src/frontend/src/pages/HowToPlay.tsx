import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Section {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  elementColor: string;
  elementGlow: string;
  content: React.ReactNode;
}

// ── Inline decorative components ──────────────────────────────────────────
function ScrollDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(to right, ${color}60, transparent)`,
        }}
      />
      <div
        className="w-1.5 h-1.5 rotate-45"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(to left, ${color}60, transparent)`,
        }}
      />
    </div>
  );
}

function StatPill({
  label,
  value,
  color,
}: { label: string; value: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-display font-bold"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      {label}
      <span
        className="text-[10px] font-body font-normal opacity-80"
        style={{ color: "oklch(0.8 0.01 260)" }}
      >
        {value}
      </span>
    </span>
  );
}

function NinjaCard({
  symbol,
  name,
  weapon,
  trait,
  personality,
  color,
  tip,
}: {
  symbol: string;
  name: string;
  weapon: string;
  trait: string;
  personality: string;
  color: string;
  tip: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex gap-3"
      style={{
        background: `${color}10`,
        border: `1px solid ${color}30`,
      }}
    >
      <div
        className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
        style={{
          background: `${color}20`,
          boxShadow: `0 0 12px ${color}40`,
        }}
      >
        {symbol}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-display font-black text-base" style={{ color }}>
            {name}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-body"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}30`,
            }}
          >
            {personality}
          </span>
        </div>
        <div className="text-xs text-muted-foreground font-body mb-1.5">
          ⚔ {weapon}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded font-body font-medium"
            style={{
              background: "oklch(0.18 0.02 270)",
              color: "oklch(0.7 0.01 260)",
            }}
          >
            {trait}
          </span>
        </div>
        <div
          className="text-[11px] italic font-body"
          style={{ color: "oklch(0.65 0.02 260)" }}
        >
          💡 {tip}
        </div>
      </div>
    </div>
  );
}

function MoveExample({
  command,
  result,
  color,
}: { command: string; result: string; color: string }) {
  return (
    <div className="rounded-lg overflow-hidden mb-2">
      <div
        className="px-3 py-2 text-xs font-mono"
        style={{
          background: "oklch(0.07 0.01 270)",
          borderLeft: `3px solid ${color}`,
          color: "oklch(0.75 0.02 260)",
        }}
      >
        <span style={{ color }} className="font-bold">
          &gt;{" "}
        </span>
        {command}
      </div>
      <div
        className="px-3 py-1.5 text-[11px] font-body"
        style={{
          background: `${color}0a`,
          color: "oklch(0.6 0.02 260)",
        }}
      >
        ↳ {result}
      </div>
    </div>
  );
}

function StepItem({
  number,
  text,
  color,
}: { number: number; text: string; color: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-black mt-0.5"
        style={{
          background: `${color}25`,
          color,
          border: `1px solid ${color}40`,
        }}
      >
        {number}
      </span>
      <span className="text-sm font-body text-muted-foreground leading-relaxed">
        {text}
      </span>
    </li>
  );
}

// ── Section data ───────────────────────────────────────────────────────────
function buildSections(): Section[] {
  return [
    {
      id: "choose-ninja",
      icon: "🥷",
      title: "Choose Your Ninja",
      subtitle: "Four warriors, four elements",
      elementColor: "oklch(0.70 0.21 38)",
      elementGlow: "oklch(0.62 0.23 30)",
      content: (
        <div className="space-y-3">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            Each ninja commands a different element and fights with a signature
            weapon. Choose the style that matches how you want to play.
          </p>
          <ScrollDivider color="oklch(0.62 0.23 30)" />
          <div className="space-y-3">
            <NinjaCard
              symbol="🔥"
              name="Kai"
              weapon="Dual Flaming Swords"
              trait="High ATK · Medium SPD"
              personality="Fierce"
              color="#ff4400"
              tip="Best for players who love aggressive, all-out offense"
            />
            <NinjaCard
              symbol="💧"
              name="Nya"
              weapon="Water Spear"
              trait="High DEF · High HP"
              personality="Chill"
              color="#0088ff"
              tip="Best for defensive players who outlast their opponents"
            />
            <NinjaCard
              symbol="🌪"
              name="Zane"
              weapon="Twin Wind Fans"
              trait="Max SPD · Evasive"
              personality="Swift"
              color="#00ddaa"
              tip="Best for players who dodge everything and strike fast"
            />
            <NinjaCard
              symbol="🪨"
              name="Cole"
              weapon="Earth Hammer"
              trait="Max Power · Heavy Hits"
              personality="Steadfast"
              color="#c8a000"
              tip="Best for players who want to end fights with one brutal strike"
            />
          </div>
        </div>
      ),
    },
    {
      id: "battle-basics",
      icon: "⚔",
      title: "Battle Basics",
      subtitle: "How fights work",
      elementColor: "oklch(0.65 0.19 220)",
      elementGlow: "oklch(0.65 0.19 220)",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            Battles are real-time — no turns, no waiting. Both ninjas attack
            freely and the fight ends when one reaches 0 HP.
          </p>
          <div
            className="rounded-xl p-4"
            style={{
              background: "oklch(0.065 0.01 270)",
              border: "1px solid oklch(0.22 0.025 270)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{
                    background: "oklch(0.62 0.23 30 / 0.2)",
                    border: "1.5px solid oklch(0.62 0.23 30 / 0.5)",
                  }}
                >
                  🥷
                </div>
                <span
                  className="text-[10px] font-display font-bold"
                  style={{ color: "oklch(0.62 0.23 30)" }}
                >
                  YOU
                </span>
              </div>
              <div
                className="text-2xl font-display font-black"
                style={{ color: "oklch(0.78 0.17 85)" }}
              >
                VS
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{
                    background: "oklch(0.55 0.22 25 / 0.2)",
                    border: "1.5px solid oklch(0.55 0.22 25 / 0.5)",
                  }}
                >
                  👹
                </div>
                <span
                  className="text-[10px] font-display font-bold"
                  style={{ color: "oklch(0.55 0.22 25)" }}
                >
                  OPPONENT
                </span>
              </div>
            </div>
            <div
              className="text-[11px] font-body text-center"
              style={{ color: "oklch(0.5 0.02 260)" }}
            >
              Your ninja on the left · Enemy on the right
            </div>
          </div>
          <ScrollDivider color="oklch(0.65 0.19 220)" />
          <ul className="space-y-3">
            <StepItem
              number={1}
              text="Four circular move buttons appear at the bottom. Tap any to attack."
              color="oklch(0.65 0.19 220)"
            />
            <StepItem
              number={2}
              text="Each move has a cooldown — the circle refills before you can use it again."
              color="oklch(0.65 0.19 220)"
            />
            <StepItem
              number={3}
              text="When two moves clash at the same time, the stronger one wins. Equal power? They cancel out!"
              color="oklch(0.65 0.19 220)"
            />
            <StepItem
              number={4}
              text="First ninja to reach 0 HP loses. Watch both health bars at the top."
              color="oklch(0.65 0.19 220)"
            />
          </ul>
          <div
            className="rounded-lg p-3 flex items-start gap-2 mt-2"
            style={{
              background: "oklch(0.78 0.17 85 / 0.08)",
              border: "1px solid oklch(0.78 0.17 85 / 0.25)",
            }}
          >
            <span className="text-base flex-shrink-0">💡</span>
            <p
              className="text-xs font-body"
              style={{ color: "oklch(0.78 0.17 85)" }}
            >
              <strong>Tip:</strong> Save your Ultimate move (gold button) for
              the right moment — high power, long cooldown.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "strategy",
      icon: "📜",
      title: "Type Your Strategy",
      subtitle: "Command your ninja with words",
      elementColor: "oklch(0.82 0.13 160)",
      elementGlow: "oklch(0.82 0.13 160)",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            During battle, there's a text box at the bottom. Type a strategy and
            your ninja will react with matching animations and behavior.
          </p>
          <ScrollDivider color="oklch(0.82 0.13 160)" />
          <div className="space-y-1">
            <p
              className="text-[11px] font-body font-semibold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.82 0.13 160)" }}
            >
              Try these commands:
            </p>
            <MoveExample
              command="circle around it to confuse"
              result="Your ninja dashes in a loop — opponent becomes confused and may hit themselves!"
              color="oklch(0.82 0.13 160)"
            />
            <MoveExample
              command="dodge left"
              result="Your ninja dashes sideways to evade incoming attacks"
              color="oklch(0.82 0.13 160)"
            />
            <MoveExample
              command="attack aggressively"
              result="Your ninja rushes forward with a rapid strike combo"
              color="oklch(0.82 0.13 160)"
            />
            <MoveExample
              command="counter attack"
              result="Your ninja readies a counter — timing a hit right after blocking"
              color="oklch(0.82 0.13 160)"
            />
            <MoveExample
              command="defend"
              result="Your ninja raises weapons in a defensive stance, reducing incoming damage"
              color="oklch(0.82 0.13 160)"
            />
            <MoveExample
              command="inferno shuriken"
              result="Kai only: secret combo unlocked — charged multi-hit fire sequence!"
              color="oklch(0.82 0.13 160)"
            />
          </div>
          <div
            className="rounded-lg p-3 flex items-start gap-2"
            style={{
              background: "oklch(0.82 0.13 160 / 0.08)",
              border: "1px solid oklch(0.82 0.13 160 / 0.3)",
            }}
          >
            <span className="text-base flex-shrink-0">🧠</span>
            <p
              className="text-xs font-body"
              style={{ color: "oklch(0.82 0.13 160)" }}
            >
              The enemy AI also adapts — if you type "defend", it may become
              more aggressive. If you type "attack", it may counter with
              evasion. Think ahead!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "weapons",
      icon: "⚔",
      title: "Elemental Weapons",
      subtitle: "Each weapon fights differently",
      elementColor: "oklch(0.62 0.23 30)",
      elementGlow: "oklch(0.62 0.23 30)",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            Each ninja's weapon has unique attack animations that play out
            visually during battle — you'll see every strike unfold.
          </p>
          <ScrollDivider color="oklch(0.62 0.23 30)" />
          <div className="space-y-3">
            {[
              {
                symbol: "🗡",
                name: "Dual Swords (Kai)",
                color: "#ff4400",
                desc: "Blazing arc slashes sweep across the field. Fire particles trail every swing.",
              },
              {
                symbol: "🔱",
                name: "Water Spear (Nya)",
                color: "#0088ff",
                desc: "Precise spear thrusts shoot forward with water ripple impacts on hit.",
              },
              {
                symbol: "🌀",
                name: "Wind Fans (Zane)",
                color: "#00ddaa",
                desc: "Spinning fan blades fly across the arena trailing wind spiral rings.",
              },
              {
                symbol: "🔨",
                name: "Earth Hammer (Cole)",
                color: "#c8a000",
                desc: "Hammer crashes down from above — ground shockwave cracks outward on impact.",
              },
            ].map(({ symbol, name, color, desc }) => (
              <div
                key={name}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: `${color}0d`,
                  border: `1px solid ${color}25`,
                }}
              >
                <span
                  className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ background: `${color}20` }}
                >
                  {symbol}
                </span>
                <div>
                  <div
                    className="font-display font-bold text-sm mb-0.5"
                    style={{ color }}
                  >
                    {name}
                  </div>
                  <div className="text-xs font-body text-muted-foreground leading-relaxed">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "level-up",
      icon: "⬆",
      title: "Level Up",
      subtitle: "Every victory makes you stronger",
      elementColor: "oklch(0.78 0.17 85)",
      elementGlow: "oklch(0.78 0.17 85)",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            Your ninjas grow permanently stronger with every battle you win.
            Stats improve automatically — no grinding required.
          </p>
          <ScrollDivider color="oklch(0.78 0.17 85)" />
          <div
            className="rounded-xl p-4"
            style={{
              background: "oklch(0.78 0.17 85 / 0.08)",
              border: "1px solid oklch(0.78 0.17 85 / 0.25)",
            }}
          >
            <p
              className="text-[11px] font-body font-semibold uppercase tracking-widest mb-3"
              style={{ color: "oklch(0.78 0.17 85)" }}
            >
              Stat growth per win
            </p>
            <div className="flex flex-wrap gap-2">
              <StatPill label="HP" value="+8" color="oklch(0.65 0.2 15)" />
              <StatPill label="ATK" value="+4" color="oklch(0.62 0.23 30)" />
              <StatPill label="DEF" value="+3" color="oklch(0.65 0.19 220)" />
              <StatPill label="SPD" value="+2" color="oklch(0.82 0.13 160)" />
              <StatPill label="XP" value="+100" color="oklch(0.78 0.17 85)" />
            </div>
          </div>
          <ul className="space-y-3">
            <StepItem
              number={1}
              text="XP bar fills after each win. Fill it to reach the next level."
              color="oklch(0.78 0.17 85)"
            />
            <StepItem
              number={2}
              text="Level 10 unlocks Mega Evolution. Level 20 unlocks Gigantamax."
              color="oklch(0.78 0.17 85)"
            />
            <StepItem
              number={3}
              text="Stats carry across all battles — your progress is permanent."
              color="oklch(0.78 0.17 85)"
            />
          </ul>
        </div>
      ),
    },
    {
      id: "mega-gigamax",
      icon: "✨",
      title: "Mega Evolution & Gigantamax",
      subtitle: "Unlock your ultimate form",
      elementColor: "oklch(0.80 0.18 300)",
      elementGlow: "oklch(0.80 0.18 300)",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            The two most powerful transformations in the game. Unlocked by
            leveling up — they change everything about how your ninja looks and
            fights.
          </p>
          <ScrollDivider color="oklch(0.80 0.18 300)" />
          <div className="space-y-3">
            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.80 0.18 300 / 0.08)",
                border: "1px solid oklch(0.80 0.18 300 / 0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💎</span>
                <span
                  className="font-display font-black text-base"
                  style={{ color: "oklch(0.80 0.18 300)" }}
                >
                  Mega Evolution
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-body"
                  style={{
                    background: "oklch(0.80 0.18 300 / 0.15)",
                    color: "oklch(0.80 0.18 300)",
                    border: "1px solid oklch(0.80 0.18 300 / 0.3)",
                  }}
                >
                  Level 10
                </span>
              </div>
              <ul className="space-y-1.5 text-xs font-body text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span style={{ color: "oklch(0.80 0.18 300)" }}>◆</span>
                  Ninja glows gold with orbiting energy particles
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: "oklch(0.80 0.18 300)" }}>◆</span>
                  All stats double for the battle
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: "oklch(0.80 0.18 300)" }}>◆</span>
                  Once per battle only — choose your moment wisely
                </li>
              </ul>
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.78 0.17 85 / 0.1)",
                border: "1px solid oklch(0.78 0.17 85 / 0.4)",
                boxShadow: "0 0 20px oklch(0.78 0.17 85 / 0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚡</span>
                <span
                  className="font-display font-black text-base"
                  style={{ color: "oklch(0.78 0.17 85)" }}
                >
                  Gigantamax
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-body"
                  style={{
                    background: "oklch(0.78 0.17 85 / 0.15)",
                    color: "oklch(0.78 0.17 85)",
                    border: "1px solid oklch(0.78 0.17 85 / 0.3)",
                  }}
                >
                  Level 20
                </span>
              </div>
              <ul className="space-y-1.5 text-xs font-body text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span style={{ color: "oklch(0.78 0.17 85)" }}>◆</span>
                  Ninja grows massive with full elemental aura rings
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: "oklch(0.78 0.17 85)" }}>◆</span>
                  Unlocks an exclusive G-MAX move — screen-shaking power
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: "oklch(0.78 0.17 85)" }}>◆</span>
                  Lasts 3 turns before reverting to normal form
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dragon",
      icon: "🐉",
      title: "Summon Your Dragon",
      subtitle: "Call on your elemental dragon",
      elementColor: "oklch(0.62 0.23 30)",
      elementGlow: "oklch(0.62 0.23 30)",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            Every ninja can call upon their elemental dragon once per battle for
            a devastating attack. The dragon is formed from pure elemental
            energy.
          </p>
          <ScrollDivider color="oklch(0.62 0.23 30)" />
          <div className="space-y-2.5">
            {[
              {
                name: "Fire Dragon",
                ninja: "Kai",
                color: "#ff4400",
                symbol: "🔥",
                desc: "A dragon built entirely from living flame. Burns the battlefield.",
              },
              {
                name: "Water Dragon",
                ninja: "Nya",
                color: "#0088ff",
                symbol: "💧",
                desc: "A dragon flowing with ocean waves. Floods and overwhelms the arena.",
              },
              {
                name: "Wind Dragon",
                ninja: "Zane",
                color: "#00ddaa",
                symbol: "🌪",
                desc: "A ghostly dragon of spiraling wind. Cuts through all defenses.",
              },
              {
                name: "Earth Dragon",
                ninja: "Cole",
                color: "#c8a000",
                symbol: "🪨",
                desc: "A colossal dragon of boulders. Shatters the ground on impact.",
              },
            ].map(({ name, ninja, color, symbol, desc }) => (
              <div
                key={name}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: `${color}0d`,
                  border: `1px solid ${color}25`,
                }}
              >
                <span
                  className="text-2xl flex-shrink-0"
                  style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                >
                  {symbol}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-display font-bold text-sm"
                      style={{ color }}
                    >
                      {name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-body">
                      ({ninja})
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-body mt-0.5">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="rounded-lg p-3 flex items-start gap-2"
            style={{
              background: "oklch(0.62 0.23 30 / 0.08)",
              border: "1px solid oklch(0.62 0.23 30 / 0.3)",
            }}
          >
            <span className="text-base flex-shrink-0">⚠</span>
            <p
              className="text-xs font-body"
              style={{ color: "oklch(0.62 0.23 30)" }}
            >
              Dragon moves are Ultimate attacks — one per battle. The animation
              fills the entire screen. Save it for when you need it most.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "dojo",
      icon: "🏯",
      title: "Dojo Challenges",
      subtitle: "Earn your Dojo Seals",
      elementColor: "oklch(0.65 0.19 220)",
      elementGlow: "oklch(0.65 0.19 220)",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            Four Dojos stand across the realm, each mastered by an elemental
            champion. Defeat everyone inside to earn a permanent Dojo Seal.
          </p>
          <ScrollDivider color="oklch(0.65 0.19 220)" />
          <div className="space-y-2.5">
            {[
              {
                name: "Fire Dojo",
                color: "#ff4400",
                symbol: "🔥",
                desc: "3 fire warriors + the Fire Dojo Master",
              },
              {
                name: "Water Dojo",
                color: "#0088ff",
                symbol: "💧",
                desc: "3 water warriors + the Water Dojo Master",
              },
              {
                name: "Air Dojo",
                color: "#00ddaa",
                symbol: "🌪",
                desc: "3 air warriors + the Air Dojo Master",
              },
              {
                name: "Earth Dojo",
                color: "#c8a000",
                symbol: "🪨",
                desc: "3 earth warriors + the Earth Dojo Master",
              },
            ].map(({ name, color, symbol, desc }) => (
              <div
                key={name}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: `${color}0d`,
                  border: `1px solid ${color}25`,
                }}
              >
                <span className="text-xl flex-shrink-0">{symbol}</span>
                <div>
                  <div
                    className="font-display font-bold text-sm"
                    style={{ color }}
                  >
                    {name}
                  </div>
                  <div className="text-xs text-muted-foreground font-body mt-0.5">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ul className="space-y-3 mt-2">
            <StepItem
              number={1}
              text="Each Dojo has 4 fights total — 3 challengers and then the master."
              color="oklch(0.65 0.19 220)"
            />
            <StepItem
              number={2}
              text="Win all 4 to earn that Dojo's Seal, displayed on your profile."
              color="oklch(0.65 0.19 220)"
            />
            <StepItem
              number={3}
              text="Dojo masters are strong — train in regular battles first!"
              color="oklch(0.65 0.19 220)"
            />
          </ul>
        </div>
      ),
    },
    {
      id: "beginner-tips",
      icon: "🌟",
      title: "Beginner Tips",
      subtitle: "Start your journey right",
      elementColor: "oklch(0.78 0.17 85)",
      elementGlow: "oklch(0.78 0.17 85)",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            Whether you're just starting or looking for an edge — these tips
            will help you become an Elemental Master faster.
          </p>
          <ScrollDivider color="oklch(0.78 0.17 85)" />
          <div className="space-y-2.5">
            {[
              {
                icon: "🔥",
                tip: "Start with Kai if you want to go on the offensive. His high ATK makes battles quick.",
                color: "#ff4400",
              },
              {
                icon: "💧",
                tip: "Start with Nya if you keep losing. Her high HP lets you learn the ropes without dying fast.",
                color: "#0088ff",
              },
              {
                icon: "🌪",
                tip: "Start with Zane if you like outmaneuvering opponents. Type 'dodge' often!",
                color: "#00ddaa",
              },
              {
                icon: "🪨",
                tip: "Start with Cole if you want raw power. Earthquake alone can flip a losing fight.",
                color: "#c8a000",
              },
              {
                icon: "💡",
                tip: "Don't use your Ultimate immediately — wait until the enemy's HP is low for a guaranteed finish.",
                color: "oklch(0.78 0.17 85)",
              },
              {
                icon: "🐉",
                tip: "Dragon summons are devastating but take a second to wind up. Use them when you have space.",
                color: "oklch(0.70 0.21 38)",
              },
              {
                icon: "🏯",
                tip: "Do regular battles before Dojo Challenges. Even 5 wins will meaningfully improve your stats.",
                color: "oklch(0.65 0.19 220)",
              },
              {
                icon: "🧠",
                tip: "Type strategies between button presses. The combo of typed commands + move buttons is what wins close fights.",
                color: "oklch(0.82 0.13 160)",
              },
            ].map(({ icon, tip, color }) => (
              <div
                key={tip.slice(0, 20)}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: `${color}0c`,
                  border: `1px solid ${color}22`,
                }}
              >
                <span
                  className="text-base flex-shrink-0 mt-0.5"
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                >
                  {icon}
                </span>
                <p className="text-xs font-body text-muted-foreground leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function HowToPlay() {
  const navigate = useNavigate();
  const sections = buildSections();
  const [activeId, setActiveId] = useState<string>(sections[0].id);

  const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 40% 0%, oklch(0.12 0.025 270 / 0.9) 0%, oklch(0.07 0.01 270) 60%)",
      }}
    >
      {/* Parchment texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(0deg, oklch(0.78 0.17 85) 0px, oklch(0.78 0.17 85) 1px, transparent 1px, transparent 40px)",
            "repeating-linear-gradient(90deg, oklch(0.78 0.17 85) 0px, oklch(0.78 0.17 85) 1px, transparent 1px, transparent 40px)",
          ].join(", "),
        }}
      />

      {/* Decorative corner runes */}
      <div
        className="absolute top-4 left-4 text-3xl opacity-[0.06] pointer-events-none select-none"
        aria-hidden="true"
      >
        火水風土
      </div>
      <div
        className="absolute bottom-20 right-4 text-3xl opacity-[0.06] pointer-events-none select-none"
        aria-hidden="true"
      >
        忍
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <button
              type="button"
              onClick={() => void navigate({ to: "/game" })}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-body flex items-center gap-1.5"
            >
              ← Back
            </button>
          </div>
          <div className="flex items-center gap-3 mb-1">
            {/* Scroll icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.17 85 / 0.25), oklch(0.70 0.21 38 / 0.15))",
                border: "1.5px solid oklch(0.78 0.17 85 / 0.4)",
                boxShadow: "0 0 16px oklch(0.78 0.17 85 / 0.2)",
              }}
            >
              <span className="text-xl">📖</span>
            </div>
            <div>
              <h1
                className="text-2xl font-display font-black tracking-tight leading-none"
                style={{
                  color: "oklch(0.78 0.17 85)",
                  textShadow: "0 0 20px oklch(0.78 0.17 85 / 0.4)",
                }}
              >
                Ninja Codex
              </h1>
              <p className="text-xs font-body text-muted-foreground mt-0.5">
                The scrolls of elemental mastery
              </p>
            </div>
          </div>

          {/* Gold rule */}
          <div
            className="h-px w-full mt-4"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(0.78 0.17 85 / 0.6), transparent)",
            }}
          />
        </motion.div>

        {/* Two-column layout on md+ */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* ── Left: Section Nav ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="md:w-56 flex-shrink-0"
          >
            {/* Scroll-style nav container */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.09 0.015 270)",
                border: "1px solid oklch(0.22 0.025 270)",
              }}
            >
              {/* Nav header */}
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "oklch(0.22 0.025 270)" }}
              >
                <p className="text-[10px] font-body text-muted-foreground uppercase tracking-widest">
                  Chapters
                </p>
              </div>
              <nav className="py-2">
                {sections.map((section, idx) => {
                  const isActive = section.id === activeId;
                  return (
                    <motion.button
                      key={section.id}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.04 }}
                      onClick={() => setActiveId(section.id)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all"
                      style={{
                        background: isActive
                          ? `${section.elementColor}18`
                          : "transparent",
                        borderRight: isActive
                          ? `2px solid ${section.elementColor}`
                          : "2px solid transparent",
                      }}
                    >
                      <span
                        className="text-base flex-shrink-0"
                        style={{
                          filter: isActive
                            ? `drop-shadow(0 0 6px ${section.elementColor})`
                            : "none",
                          opacity: isActive ? 1 : 0.5,
                        }}
                      >
                        {section.icon}
                      </span>
                      <div className="min-w-0">
                        <div
                          className="text-xs font-display font-bold leading-tight truncate"
                          style={{
                            color: isActive
                              ? section.elementColor
                              : "oklch(0.55 0.02 260)",
                          }}
                        >
                          {section.title}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Start Playing button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <Button
                className="w-full font-display font-black"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.62 0.23 30), oklch(0.70 0.21 38))",
                  color: "oklch(0.08 0.015 270)",
                  boxShadow: "0 0 20px oklch(0.62 0.23 30 / 0.4)",
                  border: "none",
                }}
                onClick={() => void navigate({ to: "/battle" })}
              >
                ⚔ Start Playing
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Right: Section Content ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Section header — styled as scroll header */}
                <div
                  className="rounded-2xl overflow-hidden mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${activeSection.elementColor}18 0%, oklch(0.09 0.015 270) 60%)`,
                    border: `1px solid ${activeSection.elementColor}35`,
                  }}
                >
                  {/* Top banner */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(to right, ${activeSection.elementColor}80, ${activeSection.elementColor}20)`,
                    }}
                  />
                  <div className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-4xl"
                        style={{
                          filter: `drop-shadow(0 0 12px ${activeSection.elementColor})`,
                        }}
                      >
                        {activeSection.icon}
                      </span>
                      <div>
                        <h2
                          className="text-xl font-display font-black leading-tight"
                          style={{
                            color: activeSection.elementColor,
                            textShadow: `0 0 16px ${activeSection.elementColor}50`,
                          }}
                        >
                          {activeSection.title}
                        </h2>
                        <p className="text-xs font-body text-muted-foreground mt-0.5">
                          {activeSection.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section body — scroll/parchment card */}
                <div
                  className="rounded-2xl"
                  style={{
                    background: "oklch(0.09 0.015 270)",
                    border: "1px solid oklch(0.20 0.022 270)",
                    boxShadow:
                      "0 4px 24px oklch(0 0 0 / 0.3), inset 0 1px 0 oklch(0.22 0.025 270 / 0.5)",
                  }}
                >
                  <ScrollArea className="max-h-[55vh] md:max-h-[62vh]">
                    <div className="px-6 py-5">{activeSection.content}</div>
                  </ScrollArea>
                </div>

                {/* Section pagination indicator */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 disabled:opacity-30"
                    disabled={sections[0].id === activeSection.id}
                    onClick={() => {
                      const idx = sections.findIndex(
                        (s) => s.id === activeSection.id,
                      );
                      if (idx > 0) setActiveId(sections[idx - 1].id);
                    }}
                  >
                    ← Prev
                  </button>
                  <div className="flex gap-1.5">
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{
                          background:
                            s.id === activeId
                              ? activeSection.elementColor
                              : "oklch(0.25 0.02 270)",
                          boxShadow:
                            s.id === activeId
                              ? `0 0 6px ${activeSection.elementColor}`
                              : "none",
                          transform:
                            s.id === activeId ? "scale(1.4)" : "scale(1)",
                        }}
                        aria-label={`Go to ${s.title}`}
                        onClick={() => setActiveId(s.id)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 disabled:opacity-30"
                    disabled={
                      sections[sections.length - 1].id === activeSection.id
                    }
                    onClick={() => {
                      const idx = sections.findIndex(
                        (s) => s.id === activeSection.id,
                      );
                      if (idx < sections.length - 1)
                        setActiveId(sections[idx + 1].id);
                    }}
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
