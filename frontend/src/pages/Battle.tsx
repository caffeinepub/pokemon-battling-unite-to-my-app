import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PIKACHU, OPPONENT_POKEMON, LocalPokemon, LocalMove } from '../data/pokemonData';
import PokemonBattleSprite from '../components/PokemonBattleSprite';
import HealthBar from '../components/HealthBar';
import AttackAnimation from '../components/AttackAnimation';
import StrategyInput from '../components/StrategyInput';
import { useCreateBattleLog, useNotifyBattleResult } from '../hooks/useQueries';
import { BattleResult } from '../backend';
import { ArrowLeft, ChevronUp, ChevronDown, Move } from 'lucide-react';

type AnimState = 'idle' | 'attack' | 'hit' | 'faint' | 'dodge';

interface ActiveAttack {
  id: number;
  move: LocalMove;
  direction: 'left' | 'right';
}

export default function Battle() {
  const navigate = useNavigate();

  // Read search params from URL manually to avoid strict route typing issues
  const searchParams = new URLSearchParams(window.location.search);
  const opponentIdParam = searchParams.get('opponentId');
  const bgTypeParam = searchParams.get('bgType') || 'forest';

  const opponentIndex = opponentIdParam
    ? parseInt(opponentIdParam) % OPPONENT_POKEMON.length
    : Math.floor(Math.random() * OPPONENT_POKEMON.length);

  const bgMap: Record<string, string> = {
    stadium: '/assets/generated/battle-bg-stadium.dim_1200x600.png',
    gym: '/assets/generated/battle-bg-gym.dim_1200x600.png',
    forest: '/assets/generated/battle-bg-forest.dim_1200x600.png',
  };

  const [playerPokemon] = useState<LocalPokemon>(() => {
    try {
      const stored = sessionStorage.getItem('starterPokemon');
      if (stored) return JSON.parse(stored) as LocalPokemon;
    } catch {
      // fallback
    }
    return PIKACHU;
  });

  const [opponentPokemon] = useState<LocalPokemon>(() => ({
    ...OPPONENT_POKEMON[opponentIndex],
    hp: OPPONENT_POKEMON[opponentIndex].maxHp,
  }));

  const [playerHp, setPlayerHp] = useState(playerPokemon.maxHp);
  const [opponentHp, setOpponentHp] = useState(opponentPokemon.maxHp);
  const [playerAnim, setPlayerAnim] = useState<AnimState>('idle');
  const [opponentAnim, setOpponentAnim] = useState<AnimState>('idle');
  const [activeAttacks, setActiveAttacks] = useState<ActiveAttack[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([
    `A wild ${OPPONENT_POKEMON[opponentIndex].name} appeared!`,
    'Go, Pikachu! Drag to dodge incoming attacks!',
  ]);
  const [battleOver, setBattleOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [tempBoosts, setTempBoosts] = useState({ attack: 0, defense: 0, speed: 0 });
  const [showStrategy, setShowStrategy] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showDodgeHint, setShowDodgeHint] = useState(true);

  const attackIdRef = useRef(0);
  const opponentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const battleOverRef = useRef(false);
  const playerPosRef = useRef(playerPos);
  const tempBoostsRef = useRef(tempBoosts);

  const createBattleLogMutation = useCreateBattleLog();
  const notifyBattleResult = useNotifyBattleResult();

  // Keep refs in sync
  useEffect(() => { battleOverRef.current = battleOver; }, [battleOver]);
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);
  useEffect(() => { tempBoostsRef.current = tempBoosts; }, [tempBoosts]);

  // Hide dodge hint after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowDodgeHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const addLog = useCallback((msg: string) => {
    setBattleLog((prev) => [msg, ...prev].slice(0, 10));
  }, []);

  // Handle player position change from drag
  const handlePlayerPositionChange = useCallback((pos: { x: number; y: number }) => {
    setPlayerPos(pos);
    playerPosRef.current = pos;
  }, []);

  // executeMove — renamed from useMove to avoid react-hooks/rules-of-hooks false positive
  const executeMove = useCallback((move: LocalMove) => {
    if (battleOverRef.current) return;

    const id = ++attackIdRef.current;
    setPlayerAnim('attack');
    addLog(`${playerPokemon.name} used ${move.name}!`);

    if (move.effect === 'boostAttack' && move.effectValue) {
      setTempBoosts((prev) => ({ ...prev, attack: prev.attack + (move.effectValue ?? 0) }));
      addLog(`${playerPokemon.name}'s attack rose by ${move.effectValue}!`);
    }
    if (move.effect === 'boostDefense' && move.effectValue) {
      setTempBoosts((prev) => ({ ...prev, defense: prev.defense + (move.effectValue ?? 0) }));
      addLog(`${playerPokemon.name}'s defense rose by ${move.effectValue}!`);
    }
    if (move.effect === 'boostSpeed' && move.effectValue) {
      setTempBoosts((prev) => ({ ...prev, speed: prev.speed + (move.effectValue ?? 0) }));
      addLog(`${playerPokemon.name}'s speed rose by ${move.effectValue}!`);
    }

    setActiveAttacks((prev) => [...prev, { id, move, direction: 'right' }]);

    setTimeout(() => {
      if (battleOverRef.current) return;
      setPlayerAnim('idle');
      const atk = playerPokemon.attack + tempBoostsRef.current.attack;
      const dmg = Math.max(1, Math.floor((move.power * atk) / 100) - Math.floor(opponentPokemon.defense * 0.15));
      setOpponentHp((prev) => {
        const next = Math.max(0, prev - dmg);
        if (next === 0) {
          battleOverRef.current = true;
          setBattleOver(true);
          setWinner('player');
          setOpponentAnim('faint');
        } else {
          setOpponentAnim('hit');
          setTimeout(() => setOpponentAnim('idle'), 500);
        }
        return next;
      });
      addLog(`${opponentPokemon.name} took ${dmg} damage!`);
    }, 700);
  }, [playerPokemon, opponentPokemon, addLog]);

  // Opponent AI
  useEffect(() => {
    const scheduleOpponentAttack = () => {
      const delay = 2500 + Math.random() * 2000;
      opponentTimerRef.current = setTimeout(() => {
        if (battleOverRef.current) return;

        const move = opponentPokemon.moves[Math.floor(Math.random() * opponentPokemon.moves.length)];
        const id = ++attackIdRef.current;

        setOpponentAnim('attack');
        addLog(`${opponentPokemon.name} used ${move.name}!`);
        setActiveAttacks((prev) => [...prev, { id, move, direction: 'left' }]);

        setTimeout(() => {
          if (battleOverRef.current) return;
          setOpponentAnim('idle');
          // Damage is handled by AttackAnimation's onComplete callback
          // which passes whether the attack was dodged
          if (!battleOverRef.current) scheduleOpponentAttack();
        }, 1200);
      }, delay);
    };

    scheduleOpponentAttack();
    return () => {
      if (opponentTimerRef.current) clearTimeout(opponentTimerRef.current);
    };
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save battle result
  useEffect(() => {
    if (battleOver && winner) {
      const result = winner === 'player' ? BattleResult.challengerWin : BattleResult.trainerWin;
      createBattleLogMutation.mutate({ challenger: opponentPokemon.name, result });
      notifyBattleResult.mutate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleOver, winner]);

  const handleStrategy = useCallback((strategy: string, keywords: string[]) => {
    if (keywords.includes('iron tail') || keywords.includes('counter')) {
      const ironTail = playerPokemon.moves.find((m) => m.name === 'Iron Tail');
      if (ironTail) executeMove(ironTail);
    }
    if (keywords.includes('electro ball') || keywords.includes('attack')) {
      const electroBall = playerPokemon.moves.find((m) => m.name === 'Electro Ball');
      if (electroBall) executeMove(electroBall);
    }
  }, [executeMove, playerPokemon.moves]);

  // Handle attack completion — apply damage if not dodged
  const handleAttackComplete = useCallback((attackId: number, move: LocalMove, direction: 'left' | 'right', dodged?: boolean) => {
    setActiveAttacks((prev) => prev.filter((a) => a.id !== attackId));

    // Only apply damage for opponent attacks (direction: 'left') that weren't dodged
    if (direction === 'left' && !battleOverRef.current) {
      if (!dodged) {
        const def = playerPokemon.defense + tempBoostsRef.current.defense;
        const dmg = Math.max(1, Math.floor(move.power * 0.4) - Math.floor(def * 0.2));
        setPlayerHp((prev) => {
          const next = Math.max(0, prev - dmg);
          if (next === 0) {
            battleOverRef.current = true;
            setBattleOver(true);
            setWinner('opponent');
            setPlayerAnim('faint');
          } else {
            setPlayerAnim('hit');
            setTimeout(() => setPlayerAnim('idle'), 500);
          }
          return next;
        });
        addLog(`${playerPokemon.name} took damage!`);
      } else {
        addLog(`${playerPokemon.name} dodged the attack!`);
        setPlayerAnim('dodge');
        setTimeout(() => setPlayerAnim('idle'), 400);
      }
    }
  }, [playerPokemon, addLog]);

  const bgImage = bgMap[bgTypeParam] || bgMap.forest;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#0D1B2A' }}>
      {/* Battle background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/game' })}
        className="absolute top-4 left-4 z-30 bg-black/60 text-white p-2 rounded-xl border border-white/20 hover:bg-black/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Dodge hint */}
      {showDodgeHint && !battleOver && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/80 border border-yellow-400/50 text-yellow-300 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
          <Move className="w-3 h-3" />
          Drag your Pokémon to dodge attacks!
        </div>
      )}

      {/* Battle arena */}
      <div className="relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Health bars */}
        <div className="flex justify-between items-start p-4 gap-3">
          <HealthBar
            current={opponentHp}
            max={opponentPokemon.maxHp}
            name={opponentPokemon.name}
            level={opponentPokemon.level}
            side="opponent"
          />
          <HealthBar
            current={playerHp}
            max={playerPokemon.maxHp}
            name={playerPokemon.name}
            level={playerPokemon.level}
            side="player"
          />
        </div>

        {/* Pokemon battle area */}
        <div className="flex-1 relative flex items-center justify-between px-6 md:px-12 min-h-[200px]">
          {/* Attack animations */}
          {activeAttacks.map((atk) => (
            <AttackAnimation
              key={atk.id}
              moveName={atk.move.name}
              moveType={atk.move.type}
              moveColor={atk.move.color}
              moveEmoji={atk.move.emoji}
              direction={atk.direction}
              playerPosition={atk.direction === 'left' ? playerPosRef.current : undefined}
              onComplete={(dodged) => handleAttackComplete(atk.id, atk.move, atk.direction, dodged)}
            />
          ))}

          {/* Opponent Pokemon */}
          <div className="slide-in-right">
            <PokemonBattleSprite
              pokemon={opponentPokemon}
              side="opponent"
              animState={opponentAnim}
            />
          </div>

          {/* VS indicator */}
          <div className="text-white/30 font-anime text-2xl">VS</div>

          {/* Player Pokemon — draggable to dodge */}
          <div className="slide-in-left">
            <PokemonBattleSprite
              pokemon={playerPokemon}
              side="player"
              animState={playerAnim}
              position={playerPos}
              isDraggable={!battleOver}
              onPositionChange={handlePlayerPositionChange}
            />
          </div>
        </div>

        {/* Stat boosts display */}
        {(tempBoosts.attack > 0 || tempBoosts.defense > 0 || tempBoosts.speed > 0) && (
          <div className="flex justify-end px-4 gap-2 mb-1">
            {tempBoosts.attack > 0 && (
              <span className="text-xs bg-red-500/30 border border-red-500/50 text-red-300 px-2 py-0.5 rounded-full font-bold">
                ATK +{tempBoosts.attack}
              </span>
            )}
            {tempBoosts.defense > 0 && (
              <span className="text-xs bg-blue-500/30 border border-blue-500/50 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                DEF +{tempBoosts.defense}
              </span>
            )}
            {tempBoosts.speed > 0 && (
              <span className="text-xs bg-green-500/30 border border-green-500/50 text-green-300 px-2 py-0.5 rounded-full font-bold">
                SPD +{tempBoosts.speed}
              </span>
            )}
          </div>
        )}

        {/* Battle over overlay */}
        {battleOver && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70">
            <div className="text-center fade-in-up">
              {winner === 'player' ? (
                <>
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-electric-yellow font-anime text-4xl mb-2">VICTORY!</p>
                  <p className="text-white text-lg mb-6">Ash wins the battle!</p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">💔</div>
                  <p className="text-red-400 font-anime text-4xl mb-2">DEFEATED!</p>
                  <p className="text-white text-lg mb-6">Don't give up, Ash!</p>
                </>
              )}
              <button
                onClick={() => navigate({ to: '/game' })}
                className="bg-electric-yellow text-dark-navy font-anime text-xl px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors anime-btn"
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Bottom UI */}
        <div className="p-3 space-y-2">
          {/* Battle log toggle */}
          <button
            onClick={() => setShowLog((v) => !v)}
            className="w-full flex items-center justify-between bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white/70 text-sm"
          >
            <span className="font-bold">
              {battleLog[0] || 'Battle started!'}
            </span>
            {showLog ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {showLog && (
            <div className="bg-black/70 border border-white/10 rounded-xl p-3 max-h-28 overflow-y-auto space-y-1">
              {battleLog.map((log, i) => (
                <p key={i} className="text-white/70 text-xs">
                  {i === 0 ? '▶ ' : '  '}{log}
                </p>
              ))}
            </div>
          )}

          {/* Move buttons */}
          {!battleOver && (
            <div className="grid grid-cols-2 gap-2">
              {playerPokemon.moves.map((move) => (
                <button
                  key={move.name}
                  onClick={() => executeMove(move)}
                  className="relative flex items-center gap-2 px-3 py-3 rounded-xl border-2 font-bold text-white transition-all hover:scale-105 active:scale-95 text-sm"
                  style={{
                    background: move.color + '22',
                    borderColor: move.color + '88',
                    boxShadow: `0 0 8px ${move.color}33`,
                  }}
                >
                  <span className="text-xl">{move.emoji}</span>
                  <div className="text-left">
                    <div className="font-anime text-sm leading-tight">{move.name}</div>
                    <div className="text-white/50 text-xs">PWR {move.power}</div>
                  </div>
                  {move.effect && (
                    <div
                      className="absolute top-1 right-1 text-xs px-1 rounded font-bold"
                      style={{ background: move.color + '44', color: move.color }}
                    >
                      {move.effect === 'boostAttack' ? '↑ATK' :
                       move.effect === 'boostDefense' ? '↑DEF' :
                       move.effect === 'boostSpeed' ? '↑SPD' :
                       move.effect === 'paralyze' ? 'PAR' : 'CNF'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Dodge hint bar (replaces dodge button) */}
          {!battleOver && (
            <div className="w-full flex items-center justify-center gap-2 bg-black/30 border border-yellow-400/20 rounded-xl px-3 py-2">
              <Move className="w-4 h-4 text-yellow-400/70" />
              <span className="text-yellow-400/70 text-xs font-bold">
                Drag your Pokémon to dodge incoming attacks
              </span>
            </div>
          )}

          {/* Strategy input toggle */}
          {!battleOver && (
            <button
              onClick={() => setShowStrategy((v) => !v)}
              className="w-full text-electric-yellow/70 text-xs font-bold py-1 hover:text-electric-yellow transition-colors"
            >
              {showStrategy ? '▲ Hide Strategy' : '▼ Type Strategy'}
            </button>
          )}

          {showStrategy && !battleOver && (
            <StrategyInput onStrategy={handleStrategy} disabled={battleOver} />
          )}
        </div>
      </div>
    </div>
  );
}
