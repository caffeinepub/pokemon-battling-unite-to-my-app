import React, { useRef, useState, useCallback, useEffect } from 'react';

interface PokemonBattleSpriteProps {
  monsterImage: string;
  monsterName: string;
  element: string;
  onDodgeChange?: (offset: { x: number; y: number }) => void;
  isDanger?: boolean;
  isHit?: boolean;
}

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#ff6a00',
  water: '#1e90ff',
  earth: '#8b5e3c',
  wind: '#64ffda',
  lightning: '#ffe620',
  shadow: '#9b30ff',
};

const ELEMENT_EMOJIS: Record<string, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  wind: '🌪️',
  lightning: '⚡',
  shadow: '🌑',
};

export default function PokemonBattleSprite({
  monsterImage,
  monsterName,
  element,
  onDodgeChange,
  isDanger = false,
  isHit = false,
}: PokemonBattleSpriteProps) {
  const elementKey = element.toLowerCase();
  const elementColor = ELEMENT_COLORS[elementKey] || '#ff6a00';
  const elementEmoji = ELEMENT_EMOJIS[elementKey] || '⚡';

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDodging, setIsDodging] = useState(false);

  const DODGE_THRESHOLD = 20;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setDragOffset({ x: dx, y: dy });
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dodging = dist > DODGE_THRESHOLD;
    setIsDodging(dodging);
    if (onDodgeChange) onDodgeChange({ x: dx, y: dy });
  }, [onDodgeChange]);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setDragOffset({ x: 0, y: 0 });
    setIsDodging(false);
    if (onDodgeChange) onDodgeChange({ x: 0, y: 0 });
  }, [onDodgeChange]);

  // Reset drag on hit
  useEffect(() => {
    if (isHit) {
      isDraggingRef.current = false;
      setDragOffset({ x: 0, y: 0 });
      setIsDodging(false);
    }
  }, [isHit]);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Element badge */}
      <div
        className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-black/30"
        style={{ backgroundColor: elementColor }}
      >
        {elementEmoji}
      </div>

      {/* Dodge indicator */}
      {isDodging && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-20"
          style={{
            backgroundColor: elementColor,
            color: '#000',
            fontFamily: 'Bangers, cursive',
            fontSize: '0.85rem',
            boxShadow: `0 0 8px ${elementColor}`,
          }}
        >
          DODGE!
        </div>
      )}

      {/* Draggable sprite */}
      <div
        ref={containerRef}
        className={`relative cursor-grab active:cursor-grabbing touch-none ${isDanger ? 'danger-sprite' : ''} ${isHit ? 'hit-recoil-right' : ''}`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transition: isDraggingRef.current ? 'none' : 'transform 0.3s ease-out',
          willChange: 'transform',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          src={monsterImage}
          alt={monsterName}
          className="w-28 h-28 object-contain"
          style={{
            imageRendering: 'pixelated',
            filter: `drop-shadow(0 0 8px ${elementColor}88)`,
          }}
          draggable={false}
        />
      </div>

      {/* Name label */}
      <div
        className="mt-1 text-xs font-bold tracking-wider uppercase"
        style={{ color: elementColor, fontFamily: 'Bangers, cursive', letterSpacing: '0.1em' }}
      >
        {monsterName}
      </div>

      {/* Drag hint */}
      <div className="text-xs text-muted-foreground mt-0.5 opacity-60">
        drag to dodge
      </div>
    </div>
  );
}
