import React, { useRef, useCallback, useEffect } from 'react';
import { LocalPokemon } from '../data/pokemonData';

interface PokemonBattleSpriteProps {
  pokemon: LocalPokemon;
  side: 'player' | 'opponent';
  animState: 'idle' | 'attack' | 'hit' | 'faint' | 'dodge';
  position?: { x: number; y: number };
  isDraggable?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  dragBounds?: { minX: number; maxX: number; minY: number; maxY: number };
}

export default function PokemonBattleSprite({
  pokemon,
  side,
  animState,
  position,
  isDraggable = false,
  onPositionChange,
  dragBounds = { minX: -120, maxX: 120, minY: -100, maxY: 60 },
}: PokemonBattleSpriteProps) {
  const isPlayer = side === 'player';
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef(position ?? { x: 0, y: 0 });

  // Keep currentPosRef in sync with controlled position prop
  useEffect(() => {
    if (position) {
      currentPosRef.current = position;
    }
  }, [position]);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    if (!isDraggable || animState === 'faint') return;
    isDraggingRef.current = true;
    startPointerRef.current = { x: clientX, y: clientY };
    startPosRef.current = { ...currentPosRef.current };
  }, [isDraggable, animState]);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current || !isDraggable) return;
    const dx = clientX - startPointerRef.current.x;
    const dy = clientY - startPointerRef.current.y;
    const newX = clamp(startPosRef.current.x + dx, dragBounds.minX, dragBounds.maxX);
    const newY = clamp(startPosRef.current.y + dy, dragBounds.minY, dragBounds.maxY);
    const newPos = { x: newX, y: newY };
    currentPosRef.current = newPos;
    onPositionChange?.(newPos);
  }, [isDraggable, dragBounds, onPositionChange]);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Mouse events
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
    handlePointerDown(e.clientX, e.clientY);
  }, [isDraggable, handlePointerDown]);

  // Touch events
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
    const touch = e.touches[0];
    handlePointerDown(touch.clientX, touch.clientY);
  }, [isDraggable, handlePointerDown]);

  // Global move/up listeners attached when dragging starts
  useEffect(() => {
    if (!isDraggable) return;

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => handlePointerUp();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDraggable, handlePointerMove, handlePointerUp]);

  const getAnimClass = () => {
    switch (animState) {
      case 'idle': return isDraggable ? '' : 'pokemon-idle';
      case 'attack': return 'shake';
      case 'hit': return 'shake';
      case 'faint': return 'opacity-30 grayscale transition-all duration-500';
      case 'dodge': return 'transition-transform duration-200';
      default: return isDraggable ? '' : 'pokemon-idle';
    }
  };

  const isImageSprite = pokemon.sprite.startsWith('/');

  const currentPos = position ?? { x: 0, y: 0 };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center ${getAnimClass()} ${isDraggable ? 'select-none' : ''}`}
      style={{
        transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
        cursor: isDraggable ? (isDraggingRef.current ? 'grabbing' : 'grab') : 'default',
        transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
        touchAction: isDraggable ? 'none' : 'auto',
        zIndex: isDraggable ? 10 : 1,
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Drag hint ring for player */}
      {isDraggable && animState !== 'faint' && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: '2px dashed rgba(255,215,0,0.4)',
            borderRadius: '50%',
            width: '140px',
            height: '140px',
            top: '-4px',
            left: '-4px',
            animation: 'pulseElectric 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Shadow */}
      <div
        className="absolute bottom-0 w-16 h-3 rounded-full opacity-30 blur-sm"
        style={{ background: '#000' }}
      />

      {/* Pokemon sprite */}
      <div
        className="relative"
        style={{
          transform: isPlayer ? 'scaleX(-1)' : 'scaleX(1)',
          filter: animState === 'hit' ? 'brightness(2) saturate(0)' : 'none',
        }}
      >
        {isImageSprite ? (
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-32 h-32 object-contain drop-shadow-2xl"
            style={{ imageRendering: 'pixelated', pointerEvents: 'none' }}
            draggable={false}
          />
        ) : (
          <div
            className="w-32 h-32 flex items-center justify-center text-7xl drop-shadow-2xl"
            style={{
              filter: `drop-shadow(0 0 8px ${pokemon.color})`,
              pointerEvents: 'none',
            }}
          >
            {pokemon.sprite}
          </div>
        )}
      </div>

      {/* Name tag */}
      <div
        className="mt-1 px-2 py-0.5 rounded text-xs font-bold text-white"
        style={{ background: pokemon.color + 'CC', pointerEvents: 'none' }}
      >
        {pokemon.name}
      </div>
    </div>
  );
}
