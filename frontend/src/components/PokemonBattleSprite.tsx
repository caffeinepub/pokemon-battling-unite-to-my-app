import React, { useState, useRef, useCallback, useEffect } from 'react';

interface SpriteMonster {
  name: string;
  element?: string;
  sprite?: string;
  color?: string;
}

interface PokemonBattleSpriteProps {
  pokemon?: SpriteMonster;
  isPlayer: boolean;
  isAttacking?: boolean;
  isDodging?: boolean;
}

const elementEmoji: Record<string, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  wind: '💨',
  lightning: '⚡',
  dark: '🌑',
};

export default function PokemonBattleSprite({
  pokemon,
  isPlayer,
  isAttacking = false,
  isDodging = false,
}: PokemonBattleSpriteProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const spriteRef = useRef<HTMLDivElement>(null);

  const sprite = pokemon?.sprite || '';
  const color = pokemon?.color || '#eab308';
  const name = pokemon?.name || 'Unknown';
  const element = pokemon?.element || 'lightning';

  // Reset drag when dodging ends
  useEffect(() => {
    if (!isDodging && !isDragging) {
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isDodging, isDragging]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isPlayer) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
  }, [isPlayer, dragOffset]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const newX = Math.max(-60, Math.min(60, e.clientX - dragStart.current.x));
    const newY = Math.max(-60, Math.min(60, e.clientY - dragStart.current.y));
    setDragOffset({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStart.current = null;
    setDragOffset({ x: 0, y: 0 });
  }, [isDragging]);

  // Touch drag handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isPlayer) return;
    e.preventDefault(); // prevent scroll
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = { x: touch.clientX - dragOffset.x, y: touch.clientY - dragOffset.y };
  }, [isPlayer, dragOffset]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !dragStart.current) return;
    e.preventDefault(); // prevent scroll during drag
    const touch = e.touches[0];
    const newX = Math.max(-60, Math.min(60, touch.clientX - dragStart.current.x));
    const newY = Math.max(-60, Math.min(60, touch.clientY - dragStart.current.y));
    setDragOffset({ x: newX, y: newY });
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStart.current = null;
    setDragOffset({ x: 0, y: 0 });
  }, [isDragging]);

  // Attach global mouse/touch listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  if (!pokemon) return null;

  const translateX = dragOffset.x + (isAttacking ? (isPlayer ? 20 : -20) : 0) + (isDodging ? (isPlayer ? -25 : 25) : 0);
  const translateY = dragOffset.y + (isDodging ? -10 : 0);

  return (
    <div
      ref={spriteRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`relative flex items-center justify-center select-none ${isPlayer ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{
        width: '72px',
        height: '72px',
        minWidth: '64px',
        minHeight: '64px',
        transform: `translate(${translateX}px, ${translateY}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        willChange: 'transform',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Glow aura */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-md"
        style={{ background: color, willChange: 'opacity' }}
      />

      {/* Sprite or emoji fallback */}
      {sprite ? (
        <img
          src={sprite}
          alt={name}
          className="relative z-10 w-14 h-14 object-contain"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, imageRendering: 'pixelated' }}
          draggable={false}
        />
      ) : (
        <div
          className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-3xl"
          style={{ background: `${color}33`, border: `2px solid ${color}66` }}
        >
          {elementEmoji[element] || '🥷'}
        </div>
      )}

      {/* Element badge */}
      <div
        className="absolute -bottom-1 -right-1 z-20 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
        style={{ background: `${color}22`, borderColor: `${color}88` }}
      >
        {elementEmoji[element] || '🥷'}
      </div>

      {/* Drag hint for player */}
      {isPlayer && !isDragging && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground whitespace-nowrap opacity-60">
          drag to dodge
        </div>
      )}
    </div>
  );
}
