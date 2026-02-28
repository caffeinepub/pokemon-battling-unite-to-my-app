export type ElementType =
  | "fire"
  | "water"
  | "earth"
  | "wind"
  | "lightning"
  | "shadow";

export interface MonsterMove {
  name: string;
  power: number;
  accuracy: number;
  element: ElementType;
  description: string;
}

export interface EvolvedForm {
  name: string;
  element: ElementType;
  emoji: string;
  baseHp: number;
  attack: number;
  defense: number;
  speed: number;
  imagePath: string;
  moves: MonsterMove[];
  ninjaRank?: string;
}

export interface MonsterData {
  id: string;
  name: string;
  element: ElementType;
  emoji: string;
  baseHp: number;
  attack: number;
  defense: number;
  speed: number;
  imagePath: string;
  description: string;
  crystalNeeded: string;
  evolvedForm: EvolvedForm;
  moves: MonsterMove[];
  ninjaRank: string;
  clanFlavor: string;
}

export const ELEMENTAL_CRYSTALS: Record<ElementType, string> = {
  fire: "Flame Crystal",
  water: "Tide Crystal",
  earth: "Terra Crystal",
  wind: "Gale Crystal",
  lightning: "Thunder Crystal",
  shadow: "Void Crystal",
};

export const ELEMENT_COLORS: Record<ElementType, string> = {
  fire: "#ff4757",
  water: "#00d2ff",
  earth: "#c8a96e",
  wind: "#2ecc71",
  lightning: "#f1c40f",
  shadow: "#9b59b6",
};

export const ELEMENT_BG_CLASSES: Record<ElementType, string> = {
  fire: "from-fire-dark to-fire",
  water: "from-water-dark to-water",
  earth: "from-earth-dark to-earth",
  wind: "from-wind-dark to-wind",
  lightning: "from-lightning-dark to-lightning",
  shadow: "from-shadow-dark to-shadow",
};

export const ELEMENT_CLAN_NAMES: Record<ElementType, string> = {
  fire: "Fire Clan",
  water: "Tide Clan",
  earth: "Stone Clan",
  wind: "Gale Clan",
  lightning: "Storm Clan",
  shadow: "Shadow Clan",
};

export const MONSTERS: MonsterData[] = [
  {
    id: "emberfang",
    name: "Emberfang",
    element: "fire",
    emoji: "🥷",
    baseHp: 90,
    attack: 85,
    defense: 60,
    speed: 75,
    imagePath: "/assets/generated/monster-emberfang.dim_200x200.png",
    description:
      "A fierce Fire Clan genin clad in crimson-black armor, wielding twin flame-forged kunai. Trained in the ancient art of Inferno Ninjutsu.",
    clanFlavor:
      "A crimson-masked warrior of the Fire Clan, master of blazing kunai and flame jutsu.",
    ninjaRank: "Genin — Fire Clan",
    crystalNeeded: "Flame Crystal",
    evolvedForm: {
      name: "Infernotiger",
      element: "fire",
      emoji: "🐯",
      baseHp: 130,
      attack: 125,
      defense: 85,
      speed: 105,
      imagePath: "/assets/generated/monster-emberfang.dim_200x200.png",
      ninjaRank: "Jonin — Fire Clan",
      moves: [
        {
          name: "Inferno Katana Slash",
          power: 95,
          accuracy: 90,
          element: "fire",
          description:
            "A devastating katana slash wreathed in infernal flames, leaving a trail of fire.",
        },
        {
          name: "Tiger Flame Jutsu",
          power: 110,
          accuracy: 85,
          element: "fire",
          description:
            "Channels the spirit of the fire tiger, unleashing a massive flame technique.",
        },
        {
          name: "Magma Shuriken Barrage",
          power: 80,
          accuracy: 95,
          element: "fire",
          description:
            "Hurls a volley of molten shuriken that erupt on impact.",
        },
        {
          name: "Phoenix Vanish Strike",
          power: 120,
          accuracy: 75,
          element: "fire",
          description:
            "Vanishes in a burst of phoenix fire and reappears for a legendary finishing blow.",
        },
      ],
    },
    moves: [
      {
        name: "Flame Kunai Throw",
        power: 60,
        accuracy: 95,
        element: "fire",
        description: "Hurls a fire-imbued kunai with blazing precision.",
      },
      {
        name: "Ember Fang Slash",
        power: 75,
        accuracy: 90,
        element: "fire",
        description:
          "Slashes with a blade that burns like hot coals, scorching the target.",
      },
      {
        name: "Fire Spin Jutsu",
        power: 65,
        accuracy: 92,
        element: "fire",
        description:
          "Executes a spinning ninjutsu technique that leaves a ring of flames.",
      },
      {
        name: "Blaze Rush Vanish",
        power: 80,
        accuracy: 85,
        element: "fire",
        description:
          "Vanishes in a blaze and reappears behind the enemy for a surprise strike.",
      },
    ],
  },
  {
    id: "tidalstrike",
    name: "Tidalstrike",
    element: "water",
    emoji: "🥷",
    baseHp: 85,
    attack: 70,
    defense: 80,
    speed: 85,
    imagePath: "/assets/generated/monster-tidalstrike.dim_200x200.png",
    description:
      "A swift Tide Clan genin draped in teal-blue wrappings, wielding a water-forged katana. Strikes with the silent force of ocean waves.",
    clanFlavor:
      "A teal-masked shinobi of the Tide Clan, flowing through battle like water itself.",
    ninjaRank: "Genin — Tide Clan",
    crystalNeeded: "Tide Crystal",
    evolvedForm: {
      name: "Tsunamikage",
      element: "water",
      emoji: "🌀",
      baseHp: 120,
      attack: 100,
      defense: 115,
      speed: 120,
      imagePath: "/assets/generated/monster-tidalstrike.dim_200x200.png",
      ninjaRank: "Shadow Master — Tide Clan",
      moves: [
        {
          name: "Tsunami Katana Wave",
          power: 100,
          accuracy: 90,
          element: "water",
          description:
            "Channels a massive tidal wave through a single katana slash.",
        },
        {
          name: "Shadow Current Jutsu",
          power: 90,
          accuracy: 95,
          element: "water",
          description:
            "Moves like an invisible current, striking from behind with water chakra.",
        },
        {
          name: "Whirlpool Shuriken Vortex",
          power: 85,
          accuracy: 88,
          element: "water",
          description:
            "Spins shuriken in a vortex of water that traps and damages foes.",
        },
        {
          name: "Ocean Fury Vanish",
          power: 115,
          accuracy: 80,
          element: "water",
          description:
            "Vanishes into the ocean mist and reappears with the full fury of the sea.",
        },
      ],
    },
    moves: [
      {
        name: "Tidal Katana Slash",
        power: 55,
        accuracy: 97,
        element: "water",
        description: "A precise katana slash with water-blade sharpness.",
      },
      {
        name: "Wave Crash Jutsu",
        power: 70,
        accuracy: 90,
        element: "water",
        description:
          "Executes a water jutsu that crashes into the opponent like a breaking wave.",
      },
      {
        name: "Aqua Needle Throw",
        power: 50,
        accuracy: 99,
        element: "water",
        description: "Throws needle-sharp water kunai at high pressure.",
      },
      {
        name: "Mist Veil Vanish",
        power: 65,
        accuracy: 88,
        element: "water",
        description:
          "Cloaks in ninja mist before delivering a surprise strike from the shadows.",
      },
    ],
  },
  {
    id: "stonefist",
    name: "Stonefist",
    element: "earth",
    emoji: "🥷",
    baseHp: 110,
    attack: 80,
    defense: 100,
    speed: 45,
    imagePath: "/assets/generated/monster-stonefist.dim_200x200.png",
    description:
      "A mighty Stone Clan genin encased in granite-grey armor, wielding iron-forged gauntlets. An immovable force trained in Earth Fortress Ninjutsu.",
    clanFlavor:
      "A stone-masked warrior of the Stone Clan, unyielding as the mountain itself.",
    ninjaRank: "Genin — Stone Clan",
    crystalNeeded: "Terra Crystal",
    evolvedForm: {
      name: "Terragolem",
      element: "earth",
      emoji: "⛰️",
      baseHp: 160,
      attack: 115,
      defense: 145,
      speed: 65,
      imagePath: "/assets/generated/monster-stonefist.dim_200x200.png",
      ninjaRank: "Jonin — Stone Clan",
      moves: [
        {
          name: "Mountain Crusher Jutsu",
          power: 110,
          accuracy: 85,
          element: "earth",
          description:
            "Brings the weight of a mountain down through a devastating earth jutsu.",
        },
        {
          name: "Terra Quake Stomp",
          power: 100,
          accuracy: 90,
          element: "earth",
          description:
            "Stomps with earth chakra to shake the ground and damage all nearby enemies.",
        },
        {
          name: "Boulder Shuriken Slam",
          power: 95,
          accuracy: 88,
          element: "earth",
          description:
            "Hurls a massive boulder-shuriken with devastating force.",
        },
        {
          name: "Golem Fortress Stance",
          power: 80,
          accuracy: 95,
          element: "earth",
          description:
            "Assumes an impenetrable fortress stance while striking back with earth energy.",
        },
      ],
    },
    moves: [
      {
        name: "Rock Fist Jutsu",
        power: 65,
        accuracy: 92,
        element: "earth",
        description: "Strikes with a fist imbued with solid stone chakra.",
      },
      {
        name: "Earth Tremor Stomp",
        power: 70,
        accuracy: 88,
        element: "earth",
        description:
          "Stomps the ground with earth ninjutsu to create a shockwave.",
      },
      {
        name: "Stone Shield Bash",
        power: 60,
        accuracy: 95,
        element: "earth",
        description:
          "Uses a stone-forged shield to bash the opponent with earth force.",
      },
      {
        name: "Gravel Shuriken Storm",
        power: 55,
        accuracy: 97,
        element: "earth",
        description: "Launches a storm of sharp gravel shuriken fragments.",
      },
    ],
  },
  {
    id: "galestep",
    name: "Galestep",
    element: "wind",
    emoji: "🥷",
    baseHp: 75,
    attack: 75,
    defense: 55,
    speed: 110,
    imagePath: "/assets/generated/monster-galestep.dim_200x200.png",
    description:
      "The fastest Gale Clan genin, clad in jade-green wrappings that flutter like wind. Moves so swiftly it appears as a blur of green lightning.",
    clanFlavor:
      "A jade-masked shinobi of the Gale Clan, striking before the wind can carry the sound.",
    ninjaRank: "Genin — Gale Clan",
    crystalNeeded: "Gale Crystal",
    evolvedForm: {
      name: "Cycloneblade",
      element: "wind",
      emoji: "🌪️",
      baseHp: 105,
      attack: 110,
      defense: 80,
      speed: 155,
      imagePath: "/assets/generated/monster-galestep.dim_200x200.png",
      ninjaRank: "Elite Jonin — Gale Clan",
      moves: [
        {
          name: "Cyclone Katana Slash",
          power: 105,
          accuracy: 92,
          element: "wind",
          description:
            "Spins into a cyclone and slashes everything in range with a wind-forged katana.",
        },
        {
          name: "Gale Force Jutsu",
          power: 95,
          accuracy: 95,
          element: "wind",
          description:
            "Unleashes a hurricane-speed wind jutsu that strikes with devastating force.",
        },
        {
          name: "Tornado Blade Vanish",
          power: 100,
          accuracy: 88,
          element: "wind",
          description:
            "Vanishes into a tornado and reappears with a blade of pure cutting wind.",
        },
        {
          name: "Sky Rend Technique",
          power: 120,
          accuracy: 80,
          element: "wind",
          description:
            "Tears through the sky itself with a legendary wind ninjutsu technique.",
        },
      ],
    },
    moves: [
      {
        name: "Wind Blade Slash",
        power: 55,
        accuracy: 97,
        element: "wind",
        description: "A razor-sharp slash of compressed wind chakra.",
      },
      {
        name: "Gale Step Kick",
        power: 65,
        accuracy: 95,
        element: "wind",
        description:
          "Delivers a kick at gale-force speed, leaving a wind trail.",
      },
      {
        name: "Whirlwind Shuriken",
        power: 70,
        accuracy: 90,
        element: "wind",
        description:
          "Throws shuriken wrapped in a whirlwind that strikes from all directions.",
      },
      {
        name: "Air Blade Jutsu",
        power: 60,
        accuracy: 98,
        element: "wind",
        description: "Compresses air chakra into a blade-like projectile.",
      },
    ],
  },
  {
    id: "voltclaw",
    name: "Voltclaw",
    element: "lightning",
    emoji: "🥷",
    baseHp: 80,
    attack: 95,
    defense: 65,
    speed: 95,
    imagePath: "/assets/generated/monster-voltclaw.dim_200x200.png",
    description:
      "A crackling Storm Clan genin in yellow-black armor, wielding electrified claws that discharge deadly lightning. Master of Thunder Claw Ninjutsu.",
    clanFlavor:
      "A storm-masked warrior of the Storm Clan, channeling lightning through every strike.",
    ninjaRank: "Genin — Storm Clan",
    crystalNeeded: "Thunder Crystal",
    evolvedForm: {
      name: "Thunderstrike",
      element: "lightning",
      emoji: "🌩️",
      baseHp: 115,
      attack: 140,
      defense: 90,
      speed: 135,
      imagePath: "/assets/generated/monster-voltclaw.dim_200x200.png",
      ninjaRank: "Jonin — Storm Clan",
      moves: [
        {
          name: "Thunder Claw Jutsu",
          power: 110,
          accuracy: 90,
          element: "lightning",
          description:
            "Rakes with electrified claws that discharge massive lightning bolts.",
        },
        {
          name: "Storm Surge Technique",
          power: 100,
          accuracy: 92,
          element: "lightning",
          description: "Calls down a storm surge of electrical chakra energy.",
        },
        {
          name: "Volt Shuriken Barrage",
          power: 90,
          accuracy: 95,
          element: "lightning",
          description: "Fires a rapid barrage of electrified shuriken.",
        },
        {
          name: "Thunderclap Vanish",
          power: 130,
          accuracy: 78,
          element: "lightning",
          description:
            "Vanishes in a thunderclap and reappears with a legendary lightning finishing strike.",
        },
      ],
    },
    moves: [
      {
        name: "Volt Claw Slash",
        power: 65,
        accuracy: 95,
        element: "lightning",
        description: "Slashes with electrically charged claw blades.",
      },
      {
        name: "Thunder Kunai Jab",
        power: 60,
        accuracy: 97,
        element: "lightning",
        description:
          "A rapid jab with a thunder-charged kunai that delivers an electric shock.",
      },
      {
        name: "Static Burst Jutsu",
        power: 75,
        accuracy: 88,
        element: "lightning",
        description:
          "Releases a burst of static electricity through a lightning jutsu.",
      },
      {
        name: "Lightning Dash Vanish",
        power: 70,
        accuracy: 92,
        element: "lightning",
        description:
          "Vanishes at lightning speed and reappears for a charged strike.",
      },
    ],
  },
  {
    id: "voidshade",
    name: "Voidshade",
    element: "shadow",
    emoji: "🥷",
    baseHp: 85,
    attack: 90,
    defense: 70,
    speed: 90,
    imagePath: "/assets/generated/monster-voidshade.dim_200x200.png",
    description:
      "A mysterious Shadow Clan genin cloaked in void-black wrappings, wielding a shadow-forged tanto. Strikes from the darkness between dimensions.",
    clanFlavor:
      "A void-masked shinobi of the Shadow Clan, unseen until the moment of the killing blow.",
    ninjaRank: "Genin — Shadow Clan",
    crystalNeeded: "Void Crystal",
    evolvedForm: {
      name: "Abyssalord",
      element: "shadow",
      emoji: "👁️",
      baseHp: 120,
      attack: 130,
      defense: 100,
      speed: 125,
      imagePath: "/assets/generated/monster-voidshade.dim_200x200.png",
      ninjaRank: "Shadow Master — Shadow Clan",
      moves: [
        {
          name: "Void Rend Jutsu",
          power: 115,
          accuracy: 88,
          element: "shadow",
          description:
            "Tears a rift in reality with shadow chakra to strike from the void.",
        },
        {
          name: "Abyss Drain Technique",
          power: 95,
          accuracy: 92,
          element: "shadow",
          description:
            "Drains the life force of the opponent into the shadow abyss.",
        },
        {
          name: "Shadow Clone Strike",
          power: 100,
          accuracy: 90,
          element: "shadow",
          description:
            "Creates shadow clones that all strike simultaneously from every direction.",
        },
        {
          name: "Dark Oblivion Vanish",
          power: 125,
          accuracy: 80,
          element: "shadow",
          description:
            "Vanishes into pure darkness and sends the opponent into a realm of oblivion.",
        },
      ],
    },
    moves: [
      {
        name: "Shadow Tanto Slash",
        power: 65,
        accuracy: 95,
        element: "shadow",
        description: "Strikes from the shadows with a void-forged tanto blade.",
      },
      {
        name: "Void Pulse Jutsu",
        power: 70,
        accuracy: 90,
        element: "shadow",
        description: "Sends a pulse of void chakra energy at the opponent.",
      },
      {
        name: "Dark Shuriken Throw",
        power: 60,
        accuracy: 97,
        element: "shadow",
        description:
          "Throws shadow-imbued shuriken that phase through defenses.",
      },
      {
        name: "Nightmare Vanish Strike",
        power: 75,
        accuracy: 88,
        element: "shadow",
        description:
          "Vanishes into nightmare shadows and reappears for a chilling strike.",
      },
    ],
  },
];

export function getMonsterById(id: string): MonsterData | undefined {
  return MONSTERS.find((m) => m.id === id);
}

export function getMonsterByName(name: string): MonsterData | undefined {
  return MONSTERS.find((m) => m.name.toLowerCase() === name.toLowerCase());
}
