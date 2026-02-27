import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ShoppingItem, StripeConfiguration } from '../backend';

// ── User Profile ──────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Monsters ──────────────────────────────────────────────────────────────

export function useGetMonsters() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['monsters'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMonsters();
    },
    enabled: !!actor && !isFetching,
  });
}

// Evolution is handled locally (no backend method available)
export function useEvolvePokemon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Evolution is managed client-side via sessionStorage
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monsters'] });
    },
  });
}

// ── Dojo Seals ────────────────────────────────────────────────────────────

export function useGetBadges() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['dojoSeals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDojoSeals();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Battle Log ────────────────────────────────────────────────────────────

export function useGetBattleLog() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['battleLog'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLog();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Dojo Challenges ───────────────────────────────────────────────────────

// Dojo challenge is handled locally (no backend method available)
export function useChallengeDojoLeader() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params?: { dojoType?: string; dojoLeader?: string }) => {
      // Dojo challenge tracking is managed client-side via sessionStorage
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dojoSeals'] });
    },
  });
}

export function useChallengeDojoMasters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dojoSeals'] });
    },
  });
}

export function useChallengeUltimateChampion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dojoSeals'] });
    },
  });
}

// ── XP & Leveling (client-side) ───────────────────────────────────────────

export interface MonsterXPData {
  monsterId: string;
  level: number;
  xp: number;
}

export interface AwardXPResult {
  newLevel: number;
  newXp: number;
  leveledUp: boolean;
  xpGained: number;
}

export function calculateXPForNextLevel(currentLevel: number): number {
  // XP needed grows with level: base 100 * level^1.5
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
}

export function useAwardBattleXP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      monsterId,
      isWin,
    }: {
      monsterId: string;
      isWin: boolean;
    }): Promise<AwardXPResult> => {
      // Load current XP data from sessionStorage
      const stored = sessionStorage.getItem('monsterXPData');
      const xpMap: Record<string, MonsterXPData> = stored ? JSON.parse(stored) : {};

      const current = xpMap[monsterId] ?? { monsterId, level: 1, xp: 0 };
      const xpGained = isWin ? 50 : 15;
      let newXp = current.xp + xpGained;
      let newLevel = current.level;
      let leveledUp = false;

      // Check for level-up(s)
      let threshold = calculateXPForNextLevel(newLevel);
      while (newXp >= threshold && newLevel < 50) {
        newXp -= threshold;
        newLevel += 1;
        leveledUp = true;
        threshold = calculateXPForNextLevel(newLevel);
      }

      xpMap[monsterId] = { monsterId, level: newLevel, xp: newXp };
      sessionStorage.setItem('monsterXPData', JSON.stringify(xpMap));

      return { newLevel, newXp, leveledUp, xpGained };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monsterXP'] });
    },
  });
}

export function useGetMonsterXP(monsterId: string): MonsterXPData {
  const stored = sessionStorage.getItem('monsterXPData');
  const xpMap: Record<string, MonsterXPData> = stored ? JSON.parse(stored) : {};
  return xpMap[monsterId] ?? { monsterId, level: 1, xp: 0 };
}

// ── Player Counter ────────────────────────────────────────────────────────

export function useGetTotalPlayers() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalPlayers'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalPlayers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000, // 1 minute
  });
}

export function useRecordPlayerLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordPlayerLogin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['totalPlayers'] });
    },
  });
}

// ── Crystal Inventory ─────────────────────────────────────────────────────

export function useGetCrystalInventory() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['crystalInventory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCrystalInventory();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Stripe ────────────────────────────────────────────────────────────────

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}
