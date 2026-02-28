import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NinjaTechnique {
    name: string;
    effect?: TechniqueEffect;
    power: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
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
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Blob = Uint8Array;
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
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CrystalInventory {
    flame: bigint;
    terra: bigint;
    thunder: bigint;
    gale: bigint;
    tide: bigint;
    void: bigint;
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
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
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
    crystalInventory: CrystalInventory;
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
    addCrystal(crystalType: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getCrystalInventory(): Promise<Array<[string, bigint]>>;
    getDojoSeals(): Promise<Array<string>>;
    getLog(): Promise<Array<string>>;
    getMonsterDXData(monster: string): Promise<Monster | null>;
    getMonsters(): Promise<Array<Monster>>;
    getOpponent(type: string): Promise<string>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTotalPlayers(): Promise<bigint>;
    getUltimateMonsters(): Promise<Array<MonsterUltimate>>;
    getUserProfile(user: Principal): Promise<UserProfile>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    recordPlayerLogin(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
