// ── Elemental Ninja Game Data ─────────────────────────────────────────────

export type ElementType = "fire" | "water" | "air" | "earth";

export interface NinjaMove {
  id: string;
  name: string;
  power: number;
  effect?:
    | "burn"
    | "flood"
    | "hurricane"
    | "quake"
    | "confuse"
    | "rage"
    | "dragon"
    | "freeze"
    | "paralyze";
  isUltimate?: boolean;
  cooldown: number; // ms
  description: string;
  animationType:
    | "slash"
    | "thrust"
    | "spin"
    | "slam"
    | "projectile"
    | "explosion"
    | "area"
    | "self"
    | "dragon";
  weaponType: "sword" | "spear" | "fan" | "hammer";
}

export interface NinjaStats {
  id: ElementType;
  name: string;
  title: string;
  personality: string;
  rivalIntro: string;
  color: string;
  colorDark: string;
  colorLight: string;
  glowClass: string;
  arenaClass: string;
  hue: number; // oklch hue
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpd: number;
  moves: NinjaMove[];
  symbol: string;
  kanjiLabel: string;
  element: string;
  weapon: string;
  imagePath: string;
  megaStats: { atk: number; def: number; spd: number; hp: number };
  gigamaxMove: NinjaMove;
  stoneType: string;
}

export const NINJAS: Record<ElementType, NinjaStats> = {
  fire: {
    id: "fire",
    name: "Kai",
    title: "Fire Master",
    personality: "Fierce & Determined",
    rivalIntro: "My fire burns hotter than your will to fight!",
    color: "#ff4400",
    colorDark: "#7a1a00",
    colorLight: "#ff8866",
    glowClass: "fire-glow",
    arenaClass: "arena-fire",
    hue: 30,
    baseHp: 120,
    baseAtk: 95,
    baseDef: 60,
    baseSpd: 75,
    symbol: "🔥",
    kanjiLabel: "火",
    element: "Fire",
    weapon: "Dual Flaming Swords",
    imagePath: "/assets/generated/ninja-fire.dim_400x500.png",
    stoneType: "Fire Stone",
    megaStats: { hp: 156, atk: 124, def: 78, spd: 98 },
    gigamaxMove: {
      id: "gmax-inferno",
      name: "G-MAX INFERNO SLASH",
      power: 200,
      effect: "rage",
      isUltimate: true,
      cooldown: 0,
      description:
        "Gigantamax: Dual swords cross in a reality-scorching X-slash",
      animationType: "slash",
      weaponType: "sword",
    },
    moves: [
      {
        id: "fire-dash",
        name: "Fire Dash",
        power: 80,
        effect: "burn",
        cooldown: 2500,
        description:
          "Blazing sword slash dash that burns everything in its path",
        animationType: "slash",
        weaponType: "sword",
      },
      {
        id: "flame-tornado",
        name: "Flame Tornado",
        power: 70,
        effect: "burn",
        cooldown: 3000,
        description: "Spinning dual-sword tornado of fire",
        animationType: "spin",
        weaponType: "sword",
      },
      {
        id: "scorching-inferno",
        name: "Scorching Inferno",
        power: 60,
        effect: "burn",
        cooldown: 2000,
        description: "Rapid fire sword combo engulfing the opponent",
        animationType: "explosion",
        weaponType: "sword",
      },
      {
        id: "dragon-fire-strike",
        name: "Dragon Fire Strike",
        power: 150,
        effect: "rage",
        isUltimate: true,
        cooldown: 8000,
        description: "Ultimate: Swords ignite dragon-shaped fire slash",
        animationType: "dragon",
        weaponType: "sword",
      },
    ],
  },

  water: {
    id: "water",
    name: "Nya",
    title: "Water Master",
    personality: "Calm & Strategic",
    rivalIntro: "Water finds a way through every obstacle. So will I.",
    color: "#0088ff",
    colorDark: "#003d7a",
    colorLight: "#66bbff",
    glowClass: "water-glow",
    arenaClass: "arena-water",
    hue: 220,
    baseHp: 130,
    baseAtk: 75,
    baseDef: 80,
    baseSpd: 70,
    symbol: "💧",
    kanjiLabel: "水",
    element: "Water",
    weapon: "Water Spear",
    imagePath: "/assets/generated/ninja-water.dim_400x500.png",
    stoneType: "Water Stone",
    megaStats: { hp: 169, atk: 98, def: 104, spd: 91 },
    gigamaxMove: {
      id: "gmax-tsunami",
      name: "G-MAX TIDAL SURGE",
      power: 200,
      effect: "flood",
      isUltimate: true,
      cooldown: 0,
      description:
        "Gigantamax: An unstoppable spear thrust launches a planet-swallowing tsunami",
      animationType: "thrust",
      weaponType: "spear",
    },
    moves: [
      {
        id: "tidal-surge",
        name: "Tidal Surge",
        power: 85,
        effect: "flood",
        cooldown: 3000,
        description: "Spear thrust launches a massive tidal wave",
        animationType: "thrust",
        weaponType: "spear",
      },
      {
        id: "whirlpool-spin",
        name: "Whirlpool Spin",
        power: 65,
        effect: "confuse",
        cooldown: 2500,
        description: "Spinning spear creates a disorienting whirlpool",
        animationType: "spin",
        weaponType: "spear",
      },
      {
        id: "ocean-crash",
        name: "Ocean Crash",
        power: 55,
        cooldown: 1800,
        description: "Water spear slices like a crashing wave",
        animationType: "thrust",
        weaponType: "spear",
      },
      {
        id: "dragon-tide-wave",
        name: "Dragon Tide Wave",
        power: 130,
        effect: "dragon",
        isUltimate: true,
        cooldown: 8000,
        description: "Summon a water dragon that floods the entire battlefield",
        animationType: "dragon",
        weaponType: "spear",
      },
    ],
  },

  air: {
    id: "air",
    name: "Zane",
    title: "Air Master",
    personality: "Swift & Focused",
    rivalIntro: "You cannot strike what you cannot see.",
    color: "#c0c8ff",
    colorDark: "#3a4080",
    colorLight: "#e0e8ff",
    glowClass: "air-glow",
    arenaClass: "arena-air",
    hue: 240,
    baseHp: 100,
    baseAtk: 80,
    baseDef: 55,
    baseSpd: 110,
    symbol: "🌪",
    kanjiLabel: "風",
    element: "Air",
    weapon: "Twin Wind Fans",
    imagePath: "/assets/generated/ninja-air.dim_400x500.png",
    stoneType: "Air Stone",
    megaStats: { hp: 130, atk: 104, def: 72, spd: 143 },
    gigamaxMove: {
      id: "gmax-hurricane",
      name: "G-MAX HURRICANE SLASH",
      power: 200,
      effect: "hurricane",
      isUltimate: true,
      cooldown: 0,
      description:
        "Gigantamax: Twin fans create a planet-sized hurricane of blades",
      animationType: "spin",
      weaponType: "fan",
    },
    moves: [
      {
        id: "air-spin",
        name: "Air Spin",
        power: 75,
        effect: "hurricane",
        cooldown: 2500,
        description:
          "Fan blades spin and release a devastating hurricane burst",
        animationType: "spin",
        weaponType: "fan",
      },
      {
        id: "hurricane-slash",
        name: "Hurricane Slash",
        power: 60,
        effect: "confuse",
        cooldown: 2000,
        description: "Razor-sharp fan slash that confuses with wind pressure",
        animationType: "slash",
        weaponType: "fan",
      },
      {
        id: "phantom-strike",
        name: "Phantom Strike",
        power: 50,
        cooldown: 1500,
        description: "Hypersonic fan strike so fast it leaves afterimages",
        animationType: "self",
        weaponType: "fan",
      },
      {
        id: "dragon-wind-blast",
        name: "Dragon Wind Blast",
        power: 125,
        effect: "dragon",
        isUltimate: true,
        cooldown: 8000,
        description: "Summon a wind dragon that tears through the sky",
        animationType: "dragon",
        weaponType: "fan",
      },
    ],
  },

  earth: {
    id: "earth",
    name: "Cole",
    title: "Earth Master",
    personality: "Stoic & Unstoppable",
    rivalIntro: "The earth does not move. Neither do I.",
    color: "#c8a96e",
    colorDark: "#5c4a2a",
    colorLight: "#e8d4a8",
    glowClass: "earth-glow",
    arenaClass: "arena-earth",
    hue: 65,
    baseHp: 150,
    baseAtk: 90,
    baseDef: 100,
    baseSpd: 45,
    symbol: "⛰",
    kanjiLabel: "土",
    element: "Earth",
    weapon: "War Hammer",
    imagePath: "/assets/generated/ninja-earth.dim_400x500.png",
    stoneType: "Earth Stone",
    megaStats: { hp: 195, atk: 117, def: 130, spd: 59 },
    gigamaxMove: {
      id: "gmax-quake",
      name: "G-MAX EARTH SLAM",
      power: 200,
      effect: "quake",
      isUltimate: true,
      cooldown: 0,
      description:
        "Gigantamax: The war hammer splits the planet with a god-like tremor",
      animationType: "slam",
      weaponType: "hammer",
    },
    moves: [
      {
        id: "earthquake",
        name: "Earthquake",
        power: 90,
        effect: "quake",
        cooldown: 3500,
        description: "War hammer slam causes the ground to tremble and crack",
        animationType: "slam",
        weaponType: "hammer",
      },
      {
        id: "rock-avalanche",
        name: "Rock Avalanche",
        power: 70,
        cooldown: 2500,
        description: "Hammer swing launches a torrent of boulders",
        animationType: "projectile",
        weaponType: "hammer",
      },
      {
        id: "stone-crusher",
        name: "Stone Crusher",
        power: 55,
        cooldown: 2000,
        description: "Overhead hammer slam with earth-shattering force",
        animationType: "slam",
        weaponType: "hammer",
      },
      {
        id: "dragon-earth-slam",
        name: "Dragon Earth Slam",
        power: 135,
        effect: "dragon",
        isUltimate: true,
        cooldown: 8000,
        description: "Summon an ancient rock dragon from the deep earth",
        animationType: "dragon",
        weaponType: "hammer",
      },
    ],
  },
};

export const ELEMENT_ORDER: ElementType[] = ["fire", "water", "air", "earth"];

// ── Opponent definitions ──────────────────────────────────────────────────

export interface OpponentNinja {
  id: string;
  name: string;
  element: ElementType;
  title: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  difficulty: "easy" | "medium" | "hard" | "boss";
  rivalIntro?: string;
}

export const OPPONENTS: OpponentNinja[] = [
  {
    id: "opp-fire-1",
    name: "Ash",
    element: "fire",
    title: "Flame Disciple",
    hp: 80,
    atk: 60,
    def: 40,
    spd: 55,
    difficulty: "easy",
    rivalIntro:
      "I've trained at the Fire Dojo for years. You don't stand a chance!",
  },
  {
    id: "opp-water-1",
    name: "Marina",
    element: "water",
    title: "Tide Wanderer",
    hp: 90,
    atk: 50,
    def: 60,
    spd: 50,
    difficulty: "easy",
    rivalIntro: "My technique flows like the river — endless and relentless.",
  },
  {
    id: "opp-air-1",
    name: "Skylar",
    element: "air",
    title: "Wind Acolyte",
    hp: 70,
    atk: 55,
    def: 40,
    spd: 80,
    difficulty: "easy",
    rivalIntro: "Speed is everything. And I am faster than thought.",
  },
  {
    id: "opp-earth-1",
    name: "Boulder",
    element: "earth",
    title: "Earth Disciple",
    hp: 100,
    atk: 60,
    def: 70,
    spd: 30,
    difficulty: "easy",
    rivalIntro: "I am like the mountain. Immovable. Unbreakable.",
  },
  {
    id: "opp-fire-2",
    name: "Blaze",
    element: "fire",
    title: "Fire Elite",
    hp: 100,
    atk: 80,
    def: 55,
    spd: 70,
    difficulty: "medium",
    rivalIntro:
      "I've defeated every Fire disciple in the realm. Prepare yourself!",
  },
  {
    id: "opp-water-2",
    name: "Tempest",
    element: "water",
    title: "Water Elite",
    hp: 110,
    atk: 65,
    def: 75,
    spd: 65,
    difficulty: "medium",
    rivalIntro: "The ocean has no mercy. Neither do I.",
  },
  {
    id: "opp-air-2",
    name: "Storm",
    element: "air",
    title: "Air Elite",
    hp: 90,
    atk: 70,
    def: 50,
    spd: 100,
    difficulty: "medium",
    rivalIntro: "You'll feel the wind... right before it destroys you.",
  },
  {
    id: "opp-earth-2",
    name: "Titan",
    element: "earth",
    title: "Earth Elite",
    hp: 130,
    atk: 80,
    def: 95,
    spd: 40,
    difficulty: "medium",
    rivalIntro: "Your attacks bounce off me like pebbles from a cliff face.",
  },
  {
    id: "boss-dragon",
    name: "Garmadon",
    element: "fire",
    title: "Dragon Sovereign",
    hp: 200,
    atk: 110,
    def: 90,
    spd: 85,
    difficulty: "boss",
    rivalIntro:
      "I have absorbed the power of all four elements. You are nothing before me!",
  },
];

// ── Dojo Masters ──────────────────────────────────────────────────────────

export interface DojoMaster {
  id: string;
  element: ElementType;
  name: string;
  title: string;
  description: string;
  teamSize: number;
  reward: string;
  difficulty: string;
}

export const DOJO_MASTERS: DojoMaster[] = [
  {
    id: "fire-dojo",
    element: "fire",
    name: "Sensei Rekka",
    title: "Fire Dojo Master",
    description:
      "A legendary fire ninja whose anger burns like the sun. His dual swords move faster than the eye can track.",
    teamSize: 3,
    reward: "Flame Seal",
    difficulty: "★★★",
  },
  {
    id: "water-dojo",
    element: "water",
    name: "Sensei Ryuu",
    title: "Water Dojo Master",
    description:
      "Calm as a still lake, fierce as the ocean storm. Her spear flows between attacks with impossible grace.",
    teamSize: 3,
    reward: "Tide Seal",
    difficulty: "★★★",
  },
  {
    id: "air-dojo",
    element: "air",
    name: "Sensei Arashi",
    title: "Air Dojo Master",
    description:
      "Impossible to pin down — fan blades strike from everywhere at once. You can't dodge what you can't see.",
    teamSize: 3,
    reward: "Gale Seal",
    difficulty: "★★★★",
  },
  {
    id: "earth-dojo",
    element: "earth",
    name: "Sensei Daichi",
    title: "Earth Dojo Master",
    description:
      "As immovable as a mountain. His war hammer shakes the entire dojo floor with every swing.",
    teamSize: 3,
    reward: "Terra Seal",
    difficulty: "★★★★★",
  },
];

// ── Story Chapters ────────────────────────────────────────────────────────

export interface StoryChapter {
  id: string;
  number: number;
  element: ElementType;
  title: string;
  subtitle: string;
  description: string;
  scenes: string[];
  bossName: string;
  episodeCode?: string;
  watchLink?: string;
  isFinal?: boolean;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "ch-1",
    number: 1,
    element: "fire",
    title: "The Ember Trial",
    subtitle: "Chapter 1 · Fire Realm",
    episodeCode: "MJ01",
    description:
      "Four young ninjas emerge from the monastery of the four winds. Kai's dual swords ignite as the first trial begins in the volcanic fire realm.",
    scenes: [
      "The monastery bell rings at dawn. Kai wraps flame bandages around his sword hilts.",
      '"Kai," Sensei says, "your fire is strong. But strength without control is just destruction."',
      "The Fire Realm blazes ahead — a land of eternal eruption where only the fierce survive.",
      "First battle begins. The dual swords cross. The world holds its breath.",
    ],
    bossName: "Fire Guardian Kaen",
  },
  {
    id: "ch-2",
    number: 2,
    element: "water",
    title: "The Deep Current",
    subtitle: "Chapter 2 · Water Realm",
    episodeCode: "MJ08",
    description:
      "Nya's water spear cuts through the ocean depths as a shadow organization called the Void Clan steals the Water Crystal.",
    scenes: [
      "Rain hammers the coastline. Nya moves silently beneath the waves, spear ready.",
      '"The Void Clan was here," she says, studying a broken tide seal. "They took the crystal."',
      "The ocean floor battles are unlike anything above the surface. Every counter must flow.",
      "Her spear finds the gap. The tide turns.",
    ],
    bossName: "Void Admiral Kaimu",
  },
  {
    id: "ch-3",
    number: 3,
    element: "air",
    title: "The Storm Summit",
    subtitle: "Chapter 3 · Sky Realm",
    episodeCode: "MJ17",
    description:
      "Above the clouds, Zane's twin wind fans cut through the eternal storm. The Air Crystal sits at the peak — guarded by the fastest ninjas ever born.",
    scenes: [
      "Lightning strikes the summit. Zane is already moving, fans spinning.",
      '"You are fast," the guardian admits. "But can you strike what is already gone?"',
      "At this altitude, hesitation means falling. Every dodge must be pure instinct.",
      "The storm responds — and so does he.",
    ],
    bossName: "Storm Sovereign Arashi",
  },
  {
    id: "ch-4",
    number: 4,
    element: "earth",
    title: "Hammer of the Deep",
    subtitle: "Chapter 4 · Earth Realm",
    episodeCode: "MJ25",
    description:
      "Cole descends into the mountain depths. His war hammer shakes the earth with every strike as the ancient Earth Crystal calls to him.",
    scenes: [
      "The cavern trembles. Cole's hammer cracks the stone floor with a single step.",
      '"You think strength alone wins," the earth master says. "Let me show you what real strength is."',
      "Deep underground, there is no retreating. Only forward — through the rock.",
      "The hammer falls. The mountain answers.",
    ],
    bossName: "Earth Colossus Kaizan",
  },
  {
    id: "ch-5",
    number: 5,
    element: "fire",
    title: "Dragon's Reckoning",
    subtitle: "Final Chapter · The World Championship",
    episodeCode: "MJ42",
    description:
      "Garmadon — the Dragon Sovereign — surfaces with all four stolen crystals. Kai, Nya, Zane, and Cole stand together for their greatest battle.",
    scenes: [
      "The ground splits open. Garmadon emerges wreathed in black dragon flame.",
      '"You collected the seals," Garmadon says, amused. "Now watch me destroy everything you built."',
      "All four elemental ninjas stand together for the first time, weapons raised.",
      '"Together we are one element," Kai says, swords blazing. "The element that cannot be named."',
    ],
    bossName: "Garmadon, Dragon Sovereign",
    isFinal: true,
  },
];

// ── LocalStorage helpers ──────────────────────────────────────────────────

export interface NinjaProgress {
  victories: number;
  atk: number;
  def: number;
  spd: number;
  hp: number;
  level: number;
  xp: number;
  dojoSeals: string[];
  completedChapters: string[];
  selectedNinja: ElementType | null;
  isEliteMaster: boolean;
  dragonUsed: boolean;
  megaStones: number;
  evolutionStones: string[];
  gigamaxUnlocked: boolean;
}

const PROGRESS_KEY = "elemental-ninja-progress";

export function loadProgress(element: ElementType): NinjaProgress {
  try {
    const raw = localStorage.getItem(`${PROGRESS_KEY}-${element}`);
    if (raw) {
      const parsed = JSON.parse(raw) as NinjaProgress;
      return {
        ...parsed,
        megaStones: parsed.megaStones ?? 0,
        evolutionStones: parsed.evolutionStones ?? [],
        gigamaxUnlocked: parsed.gigamaxUnlocked ?? false,
        level: parsed.level ?? 1,
        xp: parsed.xp ?? 0,
      };
    }
  } catch {
    /* ignore */
  }
  const base = NINJAS[element];
  return {
    victories: 0,
    atk: base.baseAtk,
    def: base.baseDef,
    spd: base.baseSpd,
    hp: base.baseHp,
    level: 1,
    xp: 0,
    dojoSeals: [],
    completedChapters: [],
    selectedNinja: element,
    isEliteMaster: false,
    dragonUsed: false,
    megaStones: 0,
    evolutionStones: [],
    gigamaxUnlocked: false,
  };
}

export function saveProgress(
  element: ElementType,
  progress: NinjaProgress,
): void {
  try {
    localStorage.setItem(
      `${PROGRESS_KEY}-${element}`,
      JSON.stringify(progress),
    );
  } catch {
    /* ignore */
  }
}

const XP_PER_LEVEL = (level: number) => Math.floor(100 * level ** 1.4);

export function recordVictory(element: ElementType): NinjaProgress {
  const progress = loadProgress(element);
  progress.victories += 1;
  progress.atk += 2;
  progress.def += 1;
  progress.spd += 1;
  progress.hp += 3;

  // XP gain
  const xpGained = 50 + progress.victories * 2;
  progress.xp += xpGained;
  while (progress.xp >= XP_PER_LEVEL(progress.level)) {
    progress.xp -= XP_PER_LEVEL(progress.level);
    progress.level += 1;
  }

  // Elite master at level 10
  if (progress.level >= 10) {
    progress.isEliteMaster = true;
  }
  // Award evolution stone (1-in-5 chance)
  if (Math.random() < 0.2) {
    const stoneType = NINJAS[element].stoneType;
    if (!progress.evolutionStones.includes(stoneType)) {
      progress.evolutionStones.push(stoneType);
    }
  }
  // Award mega stone every 5 victories
  if (progress.victories % 5 === 0) {
    progress.megaStones += 1;
  }
  // Unlock gigamax at 10 victories
  if (progress.victories >= 10) {
    progress.gigamaxUnlocked = true;
  }
  saveProgress(element, progress);
  return progress;
}

export function getXpProgress(progress: NinjaProgress): {
  current: number;
  needed: number;
  pct: number;
} {
  const needed = XP_PER_LEVEL(progress.level);
  const pct = Math.min(100, (progress.xp / needed) * 100);
  return { current: progress.xp, needed, pct };
}

export function getSelectedNinja(): ElementType | null {
  try {
    return localStorage.getItem("selected-ninja") as ElementType | null;
  } catch {
    return null;
  }
}

export function setSelectedNinja(element: ElementType): void {
  try {
    localStorage.setItem("selected-ninja", element);
  } catch {
    /* ignore */
  }
}
