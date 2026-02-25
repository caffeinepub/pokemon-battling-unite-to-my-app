import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Blob = Uint8Array;
export interface NinjaTechnique {
    name: string;
    effect?: TechniqueEffect;
    power: bigint;
}
export type ElementalMastery = {
    __kind__: "ice";
    ice: string;
} | {
    __kind__: "magnetizer";
    magnetizer: string;
} | {
    __kind__: "magmarizer";
    magmarizer: string;
} | {
    __kind__: "dark";
    dark: string;
} | {
    __kind__: "dawn";
    dawn: string;
} | {
    __kind__: "dusk";
    dusk: string;
} | {
    __kind__: "fire";
    fire: string;
} | {
    __kind__: "wind";
    wind: string;
} | {
    __kind__: "metalCoat";
    metalCoat: string;
} | {
    __kind__: "upgrade";
    upgrade: string;
} | {
    __kind__: "earth";
    earth: string;
} | {
    __kind__: "kingRock";
    kingRock: string;
} | {
    __kind__: "skyScale";
    skyScale: string;
} | {
    __kind__: "protector";
    protector: string;
} | {
    __kind__: "hydration";
    hydration: string;
} | {
    __kind__: "moonStone";
    moonStone: string;
} | {
    __kind__: "water";
    water: string;
} | {
    __kind__: "prismScale";
    prismScale: string;
} | {
    __kind__: "lightning";
    lightning: string;
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
export interface MonsterUltimate {
    shenanigans: bigint;
    speed: bigint;
    stage: string;
    monsterId: bigint;
    defense: bigint;
    monsterName: string;
    agility: bigint;
    attack: bigint;
    reactions: bigint;
    images: Array<MonsterImage>;
}
export interface Monster {
    battleTechniques: Array<NinjaTechnique>;
    level: bigint;
    baseSpeed: bigint;
    monsterName: string;
    baseAttack: bigint;
    masteryElement?: ElementalMastery;
    baseDefense: bigint;
    images: Array<MonsterImage>;
}
export interface MonsterImage {
    isAnimated: boolean;
    imagePath: string;
    imageUrl: string;
    isRawImage: boolean;
    image: Blob;
}
export interface UserProfile {
    victories: bigint;
    ninjaName: string;
    avatarUrl?: string;
    dojoSeals: bigint;
    clanName: string;
}
export enum TechniqueEffect {
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
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getDojoSeals(): Promise<Array<string>>;
    getLog(): Promise<Array<string>>;
    getMonsterDXData(monster: string): Promise<Monster | null>;
    getMonsters(): Promise<Array<Monster>>;
    getOpponent(type: string): Promise<string>;
    getUltimateMonsters(): Promise<Array<MonsterUltimate>>;
    getUserProfile(user: Principal): Promise<UserProfile>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
