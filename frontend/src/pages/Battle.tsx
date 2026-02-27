import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import AttackAnimation from '../components/AttackAnimation';
import NinjaBattleSprite, { NinjaBattleSpriteHandle } from '../components/NinjaBattleSprite';
import PokemonBattleSprite from '../components/PokemonBattleSprite';
import HealthBar from '../components/HealthBar';
import StrategyInput from '../components/StrategyInput';
import { MONSTERS, MonsterData } from '../data/monsterData';

// ── Types ──────────────────────────────────────────────────────────────────

interface BattleMonster {
  data: MonsterData;
  currentHp: number;
  maxHp: number;
}

interface AnimationState {
  active: boolean;
  element: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  missed: boolean;
}

interface MoveCooldown {
  [moveIndex: number]: number; // timestamp when cooldown expires
}

// ── Element colors for move buttons ───────────────────────────────────────

const ELEMENT_BUTTON_COLORS: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  fire:      { bg: 'rgba(255,106,0,0.18)',   border: '#ff6a00', glow: 'rgba(255,106,0,0.5)',   text: '#ffaa44' },
  water:     { bg: 'rgba(0,180,255,0.18)',   border: '#00b4ff', glow: 'rgba(0,180,255,0.5)',   text: '#88ddff' },
  earth:     { bg: 'rgba(139,94,60,0.18)',   border: '#8b5e3c', glow: 'rgba(139,94,60,0.5)',   text: '#c8a96e' },
  wind:      { bg: 'rgba(168,230,207,0.18)', border: '#a8e6cf', glow: 'rgba(168,230,207,0.5)', text: '#56c596' },
  lightning: { bg: 'rgba(255,230,0,0.18)',   border: '#ffe600', glow: 'rgba(255,230,0,0.5)',   text: '#ffe600' },
  shadow:    { bg: 'rgba(124,58,237,0.18)',  border: '#7c3aed', glow: 'rgba(124,58,237,0.5)',  text: '#c084fc' },
};

const ELEMENT_EMOJIS: Record<string, string> = {
  fire: '🔥', water: '💧', earth: '🪨', wind: '🌪️', lightning: '⚡', shadow: '🌑',
};

const MOVE_COOLDOWN_MS = 2500;

// ── Battle backgrounds ─────────────────────────────────────────────────────

const BATTLE_BGS: Record<string, string> = {
  fire:      '/assets/generated/battle-bg-fire.dim_1280x720.png',
  water:     '/assets/generated/battle-bg-water.dim_1280x720.png',
  earth:     '/assets/generated/battle-bg-earth.dim_1280x720.png',
  wind:      '/assets/generated/battle-bg-wind.dim_1280x720.png',
  lightning: '/assets/generated/battle-bg-storm.dim_1280x720.png',
  shadow:    '/assets/generated/battle-bg-shadow.dim_1280x720.png',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function pickOpponent(playerMonster: MonsterData): MonsterData {
  const others = MONSTERS.filter((m) => m.id !== playerMonster.id);
  return others[Math.floor(Math.random() * others.length)];
}

function calcDamage(attacker: MonsterData, defender: MonsterData, movePower: number): number {
  const base = ((attacker.attack / defender.defense) * movePower * 0.4) + Math.random() * 8;
  return Math.max(5, Math.round(base));
}

// ── Component ──────────────────────────────────────────────────────────────

const Battle: React.FC = () => {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  // Monster state
  const [playerMonster, setPlayerMonster] = useState<BattleMonster | null>(null);
  const [opponentMonster, setOpponentMonster] = useState<BattleMonster | null>(null);

  // Battle flow
  const [battlePhase, setBattlePhase] = useState<'select' | 'battle' | 'result'>('select');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);

  // Animation state
  const [attackAnim, setAttackAnim] = useState<AnimationState | null>(null);

  // Sprite animation states
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [opponentAttacking, setOpponentAttacking] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [opponentHit, setOpponentHit] = useState(false);
  const [playerCharging, setPlayerCharging] = useState(false);
  const [opponentCharging, setOpponentCharging] = useState(false);

  // Screen shake
  const [shakeClass, setShakeClass] = useState('');

  // Combo
  const [showCombo, setShowCombo] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const comboRef = useRef(0);

  // Post-battle
  const [victoryAnim, setVictoryAnim] = useState(false);
  const [defeatAnim, setDefeatAnim] = useState(false);

  // Move cooldowns
  const [moveCooldowns, setMoveCooldowns] = useState<MoveCooldown>({});
  const [, setTick] = useState(0); // force re-render for cooldown UI

  // Strategy input state (controlled)
  const [strategyValue, setStrategyValue] = useState('');

  // Refs for battle field positions
  const battleFieldRef = useRef<HTMLDivElement>(null);
  const playerSpriteRef = useRef<HTMLDivElement>(null);
  const opponentSpriteRef = useRef<HTMLDivElement>(null);
  const opponentNinjaRef = useRef<NinjaBattleSpriteHandle>(null);

  // Cooldown tick
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  // ── Init battle ──────────────────────────────────────────────────────────

  const startBattle = useCallback((selected: MonsterData) => {
    const opponent = pickOpponent(selected);
    setPlayerMonster({ data: selected, currentHp: selected.baseHp, maxHp: selected.baseHp });
    setOpponentMonster({ data: opponent, currentHp: opponent.baseHp, maxHp: opponent.baseHp });
    setBattlePhase('battle');
    setBattleLog([`⚔️ Battle begins! ${selected.name} vs ${opponent.name}!`]);
    setIsPlayerTurn(true);
    setIsAnimating(false);
    setWinner(null);
    setMoveCooldowns({});
    comboRef.current = 0;
    setComboCount(0);
    setStrategyValue('');
  }, []);

  // ── Get screen-space coords ──────────────────────────────────────────────

  const getSpriteCenterCoords = useCallback((spriteEl: HTMLDivElement | null) => {
    if (!spriteEl || !battleFieldRef.current) return { x: 0, y: 0 };
    const fieldRect = battleFieldRef.current.getBoundingClientRect();
    const spriteRect = spriteEl.getBoundingClientRect();
    return {
      x: spriteRect.left - fieldRect.left + spriteRect.width / 2,
      y: spriteRect.top - fieldRect.top + spriteRect.height / 2,
    };
  }, []);

  // ── Execute move (3-phase) ───────────────────────────────────────────────

  const executeMove = useCallback(
    async (
      attacker: BattleMonster,
      defender: BattleMonster,
      moveIndex: number,
      isPlayer: boolean
    ) => {
      if (isAnimating) return;
      setIsAnimating(true);

      const move = attacker.data.moves[moveIndex];
      const element = attacker.data.element;

      // ── Phase 1: Charge glow (180ms) ──────────────────────────────────
      if (isPlayer) {
        setPlayerCharging(true);
      } else {
        setOpponentCharging(true);
        opponentNinjaRef.current?.triggerCharge();
      }
      await new Promise((r) => setTimeout(r, 180));
      setPlayerCharging(false);
      setOpponentCharging(false);

      // Set attacking sprite
      if (isPlayer) setPlayerAttacking(true);
      else setOpponentAttacking(true);

      // ── Phase 2: Projectile animation ─────────────────────────────────
      const fromEl = isPlayer ? playerSpriteRef.current : opponentSpriteRef.current;
      const toEl = isPlayer ? opponentSpriteRef.current : playerSpriteRef.current;
      const from = getSpriteCenterCoords(fromEl);
      const to = getSpriteCenterCoords(toEl);

      // Accuracy check
      const hitChance = 0.88;
      const missed = Math.random() > hitChance;

      await new Promise<void>((resolve) => {
        setAttackAnim({
          active: true,
          element,
          fromX: from.x,
          fromY: from.y,
          toX: to.x,
          toY: to.y,
          missed,
        });
        (window as any).__battleAnimResolve = resolve;
      });

      setAttackAnim(null);
      if (isPlayer) setPlayerAttacking(false);
      else setOpponentAttacking(false);

      // ── Phase 3: Impact + screen shake ────────────────────────────────
      if (!missed) {
        if (isPlayer) {
          setOpponentHit(true);
          setShakeClass('screen-shake-light');
          setTimeout(() => setOpponentHit(false), 400);
        } else {
          setPlayerHit(true);
          setShakeClass('screen-shake-heavy');
          setTimeout(() => setPlayerHit(false), 400);
        }
        setTimeout(() => setShakeClass(''), isPlayer ? 250 : 350);
      }

      // ── Damage & log ──────────────────────────────────────────────────
      if (missed) {
        setBattleLog((prev) => [
          `💨 ${attacker.data.name} used ${move.name} — but it missed!`,
          ...prev.slice(0, 6),
        ]);
        setIsAnimating(false);
        setIsPlayerTurn(!isPlayer);
        return;
      }

      const damage = calcDamage(attacker.data, defender.data, move.power);

      // Combo tracking
      if (isPlayer) {
        comboRef.current += 1;
        if (comboRef.current >= 2) {
          setComboCount(comboRef.current);
          setShowCombo(true);
          setTimeout(() => setShowCombo(false), 1200);
        }
      } else {
        comboRef.current = 0;
      }

      // Update HP
      const newHp = Math.max(0, defender.currentHp - damage);
      if (isPlayer) {
        setOpponentMonster((prev) => (prev ? { ...prev, currentHp: newHp } : prev));
      } else {
        setPlayerMonster((prev) => (prev ? { ...prev, currentHp: newHp } : prev));
      }

      setBattleLog((prev) => [
        `${isPlayer ? '🗡️' : '👹'} ${attacker.data.name} used ${move.name}! ${damage} damage!`,
        ...prev.slice(0, 6),
      ]);

      // Check win/loss
      if (newHp <= 0) {
        const w = isPlayer ? 'player' : 'opponent';
        setWinner(w);
        setBattlePhase('result');
        if (w === 'player') {
          setVictoryAnim(true);
          setBattleLog((prev) => [`🏆 ${playerMonster?.data.name} wins!`, ...prev.slice(0, 6)]);
          if (userProfile) {
            saveProfile.mutate({
              ...userProfile,
              victories: BigInt(Number(userProfile.victories) + 1),
            });
          }
        } else {
          setDefeatAnim(true);
          setBattleLog((prev) => [`💀 ${opponentMonster?.data.name} wins...`, ...prev.slice(0, 6)]);
        }
        setIsAnimating(false);
        return;
      }

      setIsAnimating(false);
      setIsPlayerTurn(!isPlayer);

      // Opponent auto-move
      if (isPlayer && newHp > 0) {
        setTimeout(() => {
          if (opponentMonster && playerMonster) {
            const oppMoveIdx = Math.floor(Math.random() * opponentMonster.data.moves.length);
            executeMove(opponentMonster, { ...playerMonster }, oppMoveIdx, false);
          }
        }, 900);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAnimating, getSpriteCenterCoords, userProfile, playerMonster, opponentMonster]
  );

  // ── Handle player move ───────────────────────────────────────────────────

  const handlePlayerMove = useCallback(
    (moveIndex: number) => {
      if (!playerMonster || !opponentMonster || isAnimating || !isPlayerTurn) return;
      const now = Date.now();
      if (moveCooldowns[moveIndex] && moveCooldowns[moveIndex] > now) return;

      setMoveCooldowns((prev) => ({ ...prev, [moveIndex]: now + MOVE_COOLDOWN_MS }));
      executeMove(playerMonster, opponentMonster, moveIndex, true);
    },
    [playerMonster, opponentMonster, isAnimating, isPlayerTurn, moveCooldowns, executeMove]
  );

  // ── Animation complete callback ──────────────────────────────────────────

  const handleAnimComplete = useCallback(() => {
    const resolve = (window as any).__battleAnimResolve;
    if (resolve) {
      (window as any).__battleAnimResolve = null;
      resolve();
    }
  }, []);

  // ── Strategy input ───────────────────────────────────────────────────────

  const handleStrategySubmit = useCallback(
    (text: string) => {
      if (!playerMonster || !opponentMonster || isAnimating || !isPlayerTurn) return;
      const lower = text.toLowerCase();
      const moves = playerMonster.data.moves;
      let moveIdx = 0;
      for (let i = 0; i < moves.length; i++) {
        if (lower.includes(moves[i].name.toLowerCase())) {
          moveIdx = i;
          break;
        }
      }
      handlePlayerMove(moveIdx);
    },
    [playerMonster, opponentMonster, isAnimating, isPlayerTurn, handlePlayerMove]
  );

  // ── Render: Monster Select ───────────────────────────────────────────────

  if (battlePhase === 'select') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-black text-primary mb-2 tracking-widest uppercase">
          ⚔️ Choose Your Ninja
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">Select your warrior for battle</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full">
          {MONSTERS.map((m) => {
            const ec = ELEMENT_BUTTON_COLORS[m.element] || ELEMENT_BUTTON_COLORS.fire;
            return (
              <button
                key={m.id}
                onClick={() => startBattle(m)}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 active:scale-95 hover:scale-105"
                style={{
                  background: ec.bg,
                  border: `2px solid ${ec.border}`,
                  boxShadow: `0 0 16px ${ec.glow}`,
                }}
              >
                <img src={m.imagePath} alt={m.name} className="w-20 h-20 object-contain" />
                <span className="font-bold text-sm" style={{ color: ec.text }}>{m.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{m.element}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-8 text-muted-foreground hover:text-foreground text-sm underline"
        >
          ← Back to Hub
        </button>
      </div>
    );
  }

  if (!playerMonster || !opponentMonster) return null;

  const playerElement = playerMonster.data.element;
  const opponentElement = opponentMonster.data.element;
  const battleBg = BATTLE_BGS[playerElement] || BATTLE_BGS.fire;

  // ── Render: Battle ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Battle Field */}
      <div
        ref={battleFieldRef}
        className={`relative w-full overflow-hidden ${shakeClass}`}
        style={{ height: '55vw', maxHeight: 420, minHeight: 260 }}
      >
        {/* Background */}
        <img
          src={battleBg}
          alt="battle background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Attack animation canvas */}
        {attackAnim && attackAnim.active && (
          <AttackAnimation
            element={attackAnim.element}
            fromX={attackAnim.fromX}
            fromY={attackAnim.fromY}
            toX={attackAnim.toX}
            toY={attackAnim.toY}
            missed={attackAnim.missed}
            onComplete={handleAnimComplete}
          />
        )}

        {/* COMBO overlay */}
        {showCombo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <div className="combo-appear text-5xl font-black text-yellow-300 drop-shadow-[0_0_20px_rgba(255,200,0,0.9)]">
              {comboCount}x COMBO!
            </div>
          </div>
        )}

        {/* Opponent HP bar */}
        <div className="absolute top-3 left-3 right-1/2 pr-2 z-10">
          <HealthBar
            name={opponentMonster.data.name}
            current={opponentMonster.currentHp}
            max={opponentMonster.maxHp}
            element={opponentElement}
            isDanger={opponentMonster.currentHp / opponentMonster.maxHp < 0.25}
          />
        </div>

        {/* Player HP bar */}
        <div className="absolute top-3 left-1/2 right-3 pl-2 z-10">
          <HealthBar
            name={playerMonster.data.name}
            current={playerMonster.currentHp}
            max={playerMonster.maxHp}
            element={playerElement}
            isDanger={playerMonster.currentHp / playerMonster.maxHp < 0.25}
          />
        </div>

        {/* Opponent sprite (top-left area) */}
        <div
          ref={opponentSpriteRef}
          className="absolute"
          style={{ left: '12%', top: '30%', transform: 'translateY(-50%)' }}
        >
          <NinjaBattleSprite
            ref={opponentNinjaRef}
            imagePath={opponentMonster.data.imagePath}
            element={opponentElement}
            isAttacking={opponentAttacking}
            isHit={opponentHit}
            isCharging={opponentCharging}
            flipX={true}
            size="lg"
            showDangerGlow={opponentMonster.currentHp / opponentMonster.maxHp < 0.25}
          />
        </div>

        {/* Player sprite (bottom-right area) */}
        <div
          ref={playerSpriteRef}
          className="absolute"
          style={{ right: '12%', bottom: '15%' }}
        >
          <PokemonBattleSprite
            monsterImage={playerMonster.data.imagePath}
            monsterName={playerMonster.data.name}
            element={playerElement}
            isDanger={playerMonster.currentHp / playerMonster.maxHp < 0.25}
            isHit={playerHit}
          />
        </div>

        {/* Victory / Defeat overlays */}
        {battlePhase === 'result' && winner === 'player' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
            <div className={`text-center ${victoryAnim ? 'victory-bounce' : ''}`}>
              <div className="text-6xl mb-2">🏆</div>
              <div className="text-3xl font-black text-yellow-300 drop-shadow-[0_0_20px_gold]">VICTORY!</div>
            </div>
          </div>
        )}
        {battlePhase === 'result' && winner === 'opponent' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
            <div className={`text-center ${defeatAnim ? 'defeat-slump' : ''}`}>
              <div className="text-6xl mb-2">💀</div>
              <div className="text-3xl font-black text-red-400">DEFEATED</div>
            </div>
          </div>
        )}
      </div>

      {/* Battle Log */}
      <div className="bg-card/80 border-b border-border px-4 py-2 min-h-[56px]">
        <div className="text-sm text-foreground/90 font-medium">
          {battleLog[0] || '⚔️ Choose your move!'}
        </div>
        {battleLog[1] && (
          <div className="text-xs text-muted-foreground mt-0.5">{battleLog[1]}</div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 bg-background p-3 flex flex-col gap-3">
        {battlePhase === 'battle' && (
          <>
            {/* Move Buttons — 2×2 grid */}
            <div className="grid grid-cols-2 gap-2">
              {playerMonster.data.moves.map((move, idx) => {
                const ec = ELEMENT_BUTTON_COLORS[playerElement] || ELEMENT_BUTTON_COLORS.fire;
                const now = Date.now();
                const cooldownExpiry = moveCooldowns[idx] || 0;
                const onCooldown = cooldownExpiry > now;
                const cooldownRemaining = onCooldown ? cooldownExpiry - now : 0;
                const cooldownFraction = onCooldown ? cooldownRemaining / MOVE_COOLDOWN_MS : 0;
                const disabled = isAnimating || !isPlayerTurn || onCooldown;

                return (
                  <button
                    key={idx}
                    onClick={() => handlePlayerMove(idx)}
                    disabled={disabled}
                    className="relative overflow-hidden rounded-xl min-h-[52px] min-w-[48px] flex flex-col items-start justify-center px-3 py-2 transition-all duration-150 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: ec.bg,
                      border: `2px solid ${disabled ? 'rgba(255,255,255,0.1)' : ec.border}`,
                      boxShadow: disabled ? 'none' : `0 0 10px ${ec.glow}`,
                    }}
                  >
                    {/* Cooldown overlay — depletes left-to-right */}
                    {onCooldown && (
                      <div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          background: `linear-gradient(to right, rgba(0,0,0,0.55) ${cooldownFraction * 100}%, transparent ${cooldownFraction * 100}%)`,
                          transition: 'background 0.1s linear',
                        }}
                      />
                    )}
                    {/* Element icon + move name */}
                    <div className="flex items-center gap-1.5 w-full">
                      <span className="text-base leading-none">{ELEMENT_EMOJIS[playerElement]}</span>
                      <span
                        className="font-bold text-sm truncate"
                        style={{ color: ec.text }}
                      >
                        {move.name}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      PWR {move.power}
                      {onCooldown && (
                        <span className="ml-1 text-yellow-400">
                          {(cooldownRemaining / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Strategy Input — controlled with local state */}
            <StrategyInput
              value={strategyValue}
              onChange={setStrategyValue}
              onSubmit={handleStrategySubmit}
              disabled={isAnimating || !isPlayerTurn}
            />

            {/* Turn indicator */}
            <div className="text-center text-xs text-muted-foreground">
              {isAnimating
                ? '⚡ Animating...'
                : isPlayerTurn
                ? '🗡️ Your turn — choose a move!'
                : '👹 Opponent is thinking...'}
            </div>
          </>
        )}

        {battlePhase === 'result' && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-lg font-bold text-foreground">
              {winner === 'player' ? '🏆 You won the battle!' : '💀 You were defeated...'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setBattlePhase('select');
                  setVictoryAnim(false);
                  setDefeatAnim(false);
                  setWinner(null);
                }}
                className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
              >
                Battle Again
              </button>
              <button
                onClick={() => navigate({ to: '/' })}
                className="px-6 py-2 rounded-full bg-secondary text-secondary-foreground font-bold hover:opacity-90 transition-opacity"
              >
                Back to Hub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Battle;
