import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetMonsters, useAwardBattleXP } from '../hooks/useQueries';
import { MONSTERS, ELEMENT_COLORS, ElementType } from '../data/monsterData';
import PokemonBattleSprite from '../components/PokemonBattleSprite';
import NinjaBattleSprite from '../components/NinjaBattleSprite';
import HealthBar from '../components/HealthBar';
import AttackAnimation from '../components/AttackAnimation';
import StrategyInput from '../components/StrategyInput';

interface BattleMonsterState {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  element: ElementType;
  sprite: string;
  moves: Array<{ name: string; power: number; effect?: string; element: ElementType }>;
  rank?: string;
}

const elementEmoji: Record<ElementType, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  wind: '💨',
  lightning: '⚡',
  shadow: '🌑',
};

function buildBattleMonster(monster: (typeof MONSTERS)[0]): BattleMonsterState {
  const element = monster.element;
  const baseHp = monster.baseHp;
  return {
    id: monster.id,
    name: monster.name,
    hp: baseHp,
    maxHp: baseHp,
    attack: monster.attack,
    defense: monster.defense,
    speed: monster.speed,
    element,
    sprite: monster.imagePath,
    moves: (monster.moves || []).slice(0, 4).map((m) => ({
      name: m.name,
      power: m.power || 40,
      element: m.element,
    })),
    rank: monster.ninjaRank,
  };
}

type BattlePhase = 'select' | 'battle' | 'result';
type AnimState = { show: boolean; move: string; fromPlayer: boolean; element: ElementType };

export default function Battle() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userMonsters } = useGetMonsters();
  const awardXP = useAwardBattleXP();

  // Suppress unused variable warnings
  void userProfile;
  void userMonsters;

  const [phase, setPhase] = useState<BattlePhase>('select');
  const [playerMonster, setPlayerMonster] = useState<BattleMonsterState | null>(null);
  const [opponentMonster, setOpponentMonster] = useState<BattleMonsterState | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [animState, setAnimState] = useState<AnimState>({
    show: false,
    move: '',
    fromPlayer: true,
    element: 'lightning',
  });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [strategy, setStrategy] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [dojoInfo, setDojoInfo] = useState<{ dojoType: string; dojoLeader: string } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentDojo');
    if (stored) {
      try {
        setDojoInfo(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  const selectMonster = useCallback(
    (monster: (typeof MONSTERS)[0]) => {
      const player = buildBattleMonster(monster);
      const opponents = MONSTERS.filter((m) => m.id !== monster.id);
      const opp = opponents[Math.floor(Math.random() * opponents.length)];
      const opponent = buildBattleMonster(opp);
      setPlayerMonster(player);
      setOpponentMonster(opponent);
      setBattleLog([
        `🥷 ${dojoInfo ? `[${dojoInfo.dojoType} Dojo] ` : ''}Battle begins!`,
        `${player.name} vs ${opponent.name}`,
      ]);
      setPhase('battle');
      setIsPlayerTurn(true);
      setResult(null);
    },
    [dojoInfo]
  );

  const addLog = useCallback((msg: string) => {
    setBattleLog((prev) => [...prev.slice(-20), msg]);
  }, []);

  const endBattle = useCallback(
    (playerWon: boolean) => {
      setResult(playerWon ? 'win' : 'lose');
      setPhase('result');
      addLog(playerWon ? '🏆 Victory! You win!' : '💀 Defeated... Try again!');
      if (playerMonster) {
        awardXP.mutate({ monsterId: playerMonster.id, isWin: playerWon });
      }
    },
    [addLog, playerMonster, awardXP]
  );

  const executeMove = useCallback(
    async (
      move: { name: string; power: number; element: ElementType },
      fromPlayer: boolean
    ) => {
      if (isAnimating) return;
      setIsAnimating(true);

      const attacker = fromPlayer ? playerMonster : opponentMonster;
      const defender = fromPlayer ? opponentMonster : playerMonster;
      if (!attacker || !defender) {
        setIsAnimating(false);
        return;
      }

      const verbOptions = ['unleashes', 'executes', 'strikes with', 'channels'];
      const verb = verbOptions[Math.floor(Math.random() * verbOptions.length)];
      addLog(`${elementEmoji[attacker.element]} ${attacker.name} ${verb} ${move.name}!`);

      setAnimState({ show: true, move: move.name, fromPlayer, element: move.element });
      await new Promise((r) => setTimeout(r, 600));
      setAnimState((s) => ({ ...s, show: false }));

      const damage = Math.max(
        1,
        Math.floor(
          ((attacker.attack * move.power) / 100) *
            (1 - defender.defense / 200) *
            (0.85 + Math.random() * 0.3)
        )
      );

      if (fromPlayer) {
        setOpponentMonster((prev) => {
          if (!prev) return prev;
          const newHp = Math.max(0, prev.hp - damage);
          if (newHp === 0) {
            setTimeout(() => endBattle(true), 400);
          }
          return { ...prev, hp: newHp };
        });
      } else {
        setPlayerMonster((prev) => {
          if (!prev) return prev;
          const newHp = Math.max(0, prev.hp - damage);
          if (newHp === 0) {
            setTimeout(() => endBattle(false), 400);
          }
          return { ...prev, hp: newHp };
        });
      }

      addLog(`💥 ${damage} damage dealt!`);

      setIsAnimating(false);
      if (fromPlayer) {
        setIsPlayerTurn(false);
        setTimeout(() => opponentTurn(), 1200);
      } else {
        setIsPlayerTurn(true);
      }
    },
    [isAnimating, playerMonster, opponentMonster, addLog, endBattle] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const opponentTurn = useCallback(() => {
    if (!opponentMonster || !playerMonster) return;
    const moves = opponentMonster.moves;
    if (!moves.length) return;
    const move = moves[Math.floor(Math.random() * moves.length)];
    executeMove(move, false);
  }, [opponentMonster, playerMonster, executeMove]);

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to battle</p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Monster Selection Phase
  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-background px-3 py-4 md:px-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-2 tracking-wider">
            🥷 CHOOSE YOUR NINJA
          </h1>
          {dojoInfo && (
            <p className="text-center text-muted-foreground text-sm mb-4">
              Challenging:{' '}
              <span className="text-primary font-semibold">{dojoInfo.dojoType} Dojo</span> —{' '}
              {dojoInfo.dojoLeader}
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {MONSTERS.map((monster) => {
              const color = ELEMENT_COLORS[monster.element];
              return (
                <button
                  key={monster.id}
                  onClick={() => selectMonster(monster)}
                  className="group relative bg-card border border-border rounded-xl p-3 md:p-4 hover:border-primary/60 hover:bg-primary/5 transition-all active:scale-95 touch-manipulation"
                  style={{ minHeight: '120px' }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl"
                      style={{ background: `${color}22` }}
                    >
                      {elementEmoji[monster.element]}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xs md:text-sm text-foreground leading-tight">
                        {monster.name}
                      </p>
                      <p className="text-[10px] md:text-xs text-muted-foreground capitalize">
                        {monster.element}
                      </p>
                      {monster.ninjaRank && (
                        <p className="text-[10px] text-primary/80 font-medium mt-0.5">
                          {monster.ninjaRank}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Result Phase
  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-4">{result === 'win' ? '🏆' : '💀'}</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary">
            {result === 'win' ? 'VICTORY!' : 'DEFEATED'}
          </h2>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            {result === 'win' ? 'Your ninja prevails!' : 'Train harder and return!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setPhase('select')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm md:text-base min-h-[48px] touch-manipulation"
            >
              Battle Again
            </button>
            <button
              onClick={() => navigate({ to: '/game' })}
              className="px-6 py-3 bg-card border border-border text-foreground rounded-xl font-bold text-sm md:text-base min-h-[48px] touch-manipulation"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Battle Phase
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Battle Arena */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '280px', maxHeight: '45vh' }}>
        <img
          src="/assets/generated/battle-bg-gym.dim_1200x600.png"
          alt="Battle Arena"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div
          className="relative z-10 flex flex-col h-full px-3 py-3 md:px-6 md:py-4"
          style={{ minHeight: '280px' }}
        >
          {/* Opponent Section */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 max-w-[55%]">
              {opponentMonster && (
                <HealthBar
                  name={opponentMonster.name}
                  current={opponentMonster.hp}
                  max={opponentMonster.maxHp}
                  element={opponentMonster.element}
                  isEnemy
                />
              )}
            </div>
            {/* Opponent Sprite */}
            <div className="shrink-0" style={{ minWidth: '64px', minHeight: '64px' }}>
              {opponentMonster && (
                <NinjaBattleSprite
                  pokemon={{
                    name: opponentMonster.name,
                    element: opponentMonster.element,
                    sprite: opponentMonster.sprite,
                    color: ELEMENT_COLORS[opponentMonster.element],
                  }}
                  isPlayer={false}
                  isAttacking={animState.show && !animState.fromPlayer}
                  isDodging={false}
                />
              )}
            </div>
          </div>

          {/* Player Section */}
          <div className="flex items-end justify-between mt-auto">
            {/* Player Sprite */}
            <div className="shrink-0" style={{ minWidth: '64px', minHeight: '64px' }}>
              {playerMonster && (
                <PokemonBattleSprite
                  pokemon={{
                    name: playerMonster.name,
                    element: playerMonster.element,
                    sprite: playerMonster.sprite,
                    color: ELEMENT_COLORS[playerMonster.element],
                  }}
                  isPlayer={true}
                  isAttacking={animState.show && animState.fromPlayer}
                  isDodging={!isPlayerTurn && animState.show && !animState.fromPlayer}
                />
              )}
            </div>
            <div className="flex-1 max-w-[55%] flex justify-end">
              {playerMonster && (
                <HealthBar
                  name={playerMonster.name}
                  current={playerMonster.hp}
                  max={playerMonster.maxHp}
                  element={playerMonster.element}
                />
              )}
            </div>
          </div>
        </div>

        {/* Attack Animation Overlay */}
        {animState.show && (
          <AttackAnimation
            element={animState.element}
            fromPlayer={animState.fromPlayer}
          />
        )}
      </div>

      {/* Battle Controls */}
      <div className="px-3 py-3 md:px-6 md:py-4 max-w-2xl mx-auto">
        {/* Battle Log */}
        <div
          ref={logRef}
          className="bg-card/80 border border-border rounded-xl p-3 mb-3 h-20 md:h-24 overflow-y-auto"
        >
          {battleLog.map((log, i) => (
            <p key={i} className="text-xs text-foreground/80 leading-relaxed">
              {log}
            </p>
          ))}
        </div>

        {/* Move Buttons — 2-column grid on mobile, 4-column on desktop */}
        {isPlayerTurn && !isAnimating && playerMonster && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3">
            {playerMonster.moves.map((move, i) => {
              const moveColor = ELEMENT_COLORS[move.element];
              return (
                <button
                  key={i}
                  onClick={() => executeMove(move, true)}
                  disabled={isAnimating}
                  className="relative flex flex-col items-center justify-center rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/50 active:scale-95 transition-all touch-manipulation disabled:opacity-50"
                  style={{
                    minHeight: '56px',
                    padding: '10px 8px',
                    borderLeft: `3px solid ${moveColor}`,
                  }}
                >
                  <span className="text-xs font-bold text-foreground text-center leading-tight">
                    {move.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">PWR {move.power}</span>
                </button>
              );
            })}
          </div>
        )}

        {!isPlayerTurn && (
          <div className="flex items-center justify-center h-14 mb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Opponent is thinking...
            </div>
          </div>
        )}

        {/* Strategy Input */}
        <StrategyInput
          value={strategy}
          onChange={setStrategy}
          onSubmit={(s) => addLog(`📜 Strategy: ${s}`)}
          disabled={isAnimating || !isPlayerTurn}
        />

        {/* Flee Button */}
        <button
          onClick={() => setPhase('select')}
          className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-foreground border border-border/40 rounded-lg transition-colors min-h-[40px] touch-manipulation"
        >
          🏃 Flee Battle
        </button>
      </div>
    </div>
  );
}
