import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    trainerName: string;
    avatarUrl?: string;
}
export interface PokemonMove {
    name: string;
    effect?: MoveEffect;
    power: bigint;
}
export interface BattleStatus {
    isPoisoned: boolean;
    isFatigued: boolean;
    isBerserk: boolean;
    isShielded: boolean;
    isCursed: boolean;
    isParalyzed: boolean;
    isConfused: boolean;
    isLocked: boolean;
    isAmped: boolean;
}
export type PokemonEvolutionStone = {
    __kind__: "iceStone";
    iceStone: string;
} | {
    __kind__: "thunderStone";
    thunderStone: string;
} | {
    __kind__: "duskStone";
    duskStone: string;
} | {
    __kind__: "magnetizer";
    magnetizer: string;
} | {
    __kind__: "hydrationStone";
    hydrationStone: string;
} | {
    __kind__: "leafStone";
    leafStone: string;
} | {
    __kind__: "magmarizer";
    magmarizer: string;
} | {
    __kind__: "electricStone";
    electricStone: string;
} | {
    __kind__: "waterStone";
    waterStone: string;
} | {
    __kind__: "metalCoat";
    metalCoat: string;
} | {
    __kind__: "upgrade";
    upgrade: string;
} | {
    __kind__: "fireSTONE";
    fireSTONE: string;
} | {
    __kind__: "darkStone";
    darkStone: string;
} | {
    __kind__: "kingRock";
    kingRock: string;
} | {
    __kind__: "dawnStone";
    dawnStone: string;
} | {
    __kind__: "fireStone";
    fireStone: string;
} | {
    __kind__: "skyScale";
    skyScale: string;
} | {
    __kind__: "protector";
    protector: string;
} | {
    __kind__: "moonStone";
    moonStone: string;
} | {
    __kind__: "grassStone";
    grassStone: string;
} | {
    __kind__: "prismScale";
    prismScale: string;
} | {
    __kind__: "ovalStone";
    ovalStone: string;
} | {
    __kind__: "shineStone";
    shineStone: string;
} | {
    __kind__: "seaScale";
    seaScale: string;
};
export interface BattleStats {
    status: BattleStatus;
    powerUps: Array<MoveInstance>;
    attacks: Array<MoveInstance>;
    health: bigint;
}
export interface Pokemon {
    moves: Array<PokemonMove>;
    name: string;
    level: bigint;
    baseSpeed: bigint;
    baseAttack: bigint;
    evolutionStone?: PokemonEvolutionStone;
    baseDefense: bigint;
    images: Array<PokemonImage>;
}
export interface StoryEpisode {
    gymBattles: Array<PokemonTeamBattle>;
    victoryBattle?: string;
    wildPokemon: Array<Pokemon>;
    storyOutro?: string;
    locations: Array<string>;
    battles: Array<BattleLog>;
    trainerBattles: Array<PokemonTeamBattle>;
    storyIntro?: string;
}
export interface PokemonUltimate {
    id: bigint;
    shenanigans: bigint;
    name: string;
    speed: bigint;
    stage: string;
    defense: bigint;
    agility: bigint;
    attack: bigint;
    reactions: bigint;
    images: Array<PokemonImage>;
}
export type Blob = Uint8Array;
export interface BattleLog {
    battleResult: BattleResult;
    message: string;
    challenger: string;
}
export type Badge = string;
export interface AttackStrengths {
    bug: bigint;
    ice: bigint;
    psychic: bigint;
    ground: bigint;
    normal: bigint;
    fighting: bigint;
    dark: bigint;
    fire: bigint;
    flying: bigint;
    rock: bigint;
    steel: bigint;
    ghost: bigint;
    grass: bigint;
    water: bigint;
    electric: bigint;
    dragon: bigint;
    poison: bigint;
    fairy: bigint;
}
export interface BattlePokemonPersistent {
    moves: Array<PokemonMove>;
    name: string;
    level: bigint;
    stats: BattleStats;
    baseSpeed: bigint;
    baseAttack: bigint;
    baseDefense: bigint;
    images: Array<PokemonImage>;
}
export interface StoryArc {
    episodes: Array<StoryEpisode>;
    name: string;
    currentEpisode?: StoryEpisode;
}
export interface PokemonImage {
    isAnimated: boolean;
    imagePath: string;
    imageUrl: string;
    isRawImage: boolean;
    image: Blob;
}
export interface PokemonTeamBattle {
    team: Array<Pokemon>;
    trainer: string;
}
export interface MoveInstance {
    boostSpeed: boolean;
    name: string;
    boostDefense: boolean;
    boostAttack: boolean;
    attackStrength: AttackStrengths;
}
export enum BattleResult {
    pending = "pending",
    trainerWin = "trainerWin",
    invalid = "invalid",
    draw = "draw",
    error = "error",
    ongoing = "ongoing",
    challengerWin = "challengerWin"
}
export enum MoveEffect {
    boostSpeed = "boostSpeed",
    paralyzeOpponent = "paralyzeOpponent",
    confuseOpponent = "confuseOpponent",
    boostDefense = "boostDefense",
    boostAttack = "boostAttack"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    challengeEliteFour(): Promise<string>;
    challengeGymLeader(): Promise<string>;
    challengeUltimateChampion(): Promise<string>;
    createBattleLog(challenger: string, result: BattleResult): Promise<BattleLog>;
    evolvePokemon(): Promise<void>;
    getBadges(): Promise<Array<Badge>>;
    getBattlePokemonQuery(pokemon: string): Promise<BattlePokemonPersistent | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLog(): Promise<Array<string>>;
    getOpponent(type: string): Promise<string>;
    getPersistent(): Promise<BattlePokemonPersistent>;
    getPokemon(): Promise<Array<Pokemon>>;
    getPokemonDXData(pokemon: string): Promise<Pokemon | null>;
    getPokemonData(): Promise<void>;
    getStoryArc(): Promise<StoryArc>;
    getStrategyResponse(): Promise<string>;
    getTrainerPokemon(pokemonId: bigint): Promise<BattlePokemonPersistent | null>;
    getUltimatePokemon(): Promise<Array<PokemonUltimate>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasStatus(status: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    notifyBattleResult(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDialogs(): Promise<void>;
    updateMoves(): Promise<void>;
    updateMusic(): Promise<void>;
    updateOpponent(): Promise<void>;
    updatePokemon(pokemon: string): Promise<boolean>;
    updateStats(): Promise<Array<string>>;
    updateTrainerParty(): Promise<void>;
}
