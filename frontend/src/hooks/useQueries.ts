import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, BattleResult, StoryArc, Badge, Pokemon, BattlePokemonPersistent, BattleLog } from '../backend';

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

// ── Pokemon ───────────────────────────────────────────────────────────────

export function useGetPokemon() {
  const { actor, isFetching } = useActor();

  return useQuery<Pokemon[]>({
    queryKey: ['pokemon'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPokemon();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBattlePokemon(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<BattlePokemonPersistent | null>({
    queryKey: ['battlePokemon', name],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBattlePokemonQuery(name);
    },
    enabled: !!actor && !isFetching && !!name,
  });
}

export function useEvolvePokemon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.evolvePokemon();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pokemon'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
}

// ── Badges ────────────────────────────────────────────────────────────────

export function useGetBadges() {
  const { actor, isFetching } = useActor();

  return useQuery<Badge[]>({
    queryKey: ['badges'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBadges();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Story Arc ─────────────────────────────────────────────────────────────

export function useGetStoryArc() {
  const { actor, isFetching } = useActor();

  return useQuery<StoryArc>({
    queryKey: ['storyArc'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStoryArc();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Battle ────────────────────────────────────────────────────────────────

export function useCreateBattleLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ challenger, result }: { challenger: string; result: BattleResult }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBattleLog(challenger, result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battleLog'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
}

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

export function useChallengeGymLeader() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.challengeGymLeader();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
}

export function useChallengeEliteFour() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.challengeEliteFour();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
}

export function useChallengeUltimateChampion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.challengeUltimateChampion();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
}

export function useNotifyBattleResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.notifyBattleResult();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      queryClient.invalidateQueries({ queryKey: ['battleLog'] });
    },
  });
}
