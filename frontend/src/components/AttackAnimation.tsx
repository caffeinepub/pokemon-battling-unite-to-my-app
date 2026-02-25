import React, { useEffect, useState } from 'react';

interface AttackAnimationProps {
  moveName: string;
  moveType: string;
  moveColor: string;
  moveEmoji: string;
  direction: 'left' | 'right';
  playerPosition?: { x: number; y: number };
  onComplete?: (dodged?: boolean) => void;
}

// Dodge threshold: if player has moved more than this many px from center, attack misses
const DODGE_THRESHOLD = 45;

export default function AttackAnimation({
  moveName,
  moveType,
  moveColor,
  moveEmoji,
  direction,
  playerPosition,
  onComplete,
}: AttackAnimationProps) {
  const [phase, setPhase] = useState<'launch' | 'impact' | 'done'>('launch');
  const [dodged, setDodged] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      // Check dodge at impact moment
      if (direction === 'left' && playerPosition) {
        const dist = Math.sqrt(
          playerPosition.x * playerPosition.x + playerPosition.y * playerPosition.y
        );
        if (dist >= DODGE_THRESHOLD) {
          setDodged(true);
        }
      }
      setPhase('impact');
    }, 500);

    const t2 = setTimeout(() => {
      setPhase('done');
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify parent when done, passing dodge result
  useEffect(() => {
    if (phase === 'done') {
      onComplete?.(dodged);
    }
  }, [phase, dodged, onComplete]);

  if (phase === 'done') return null;

  // For dodged attacks, show the projectile flying past
  const impactLeft = direction === 'right'
    ? '70%'
    : dodged
      ? `calc(${playerPosition ? 20 + playerPosition.x * 0.1 : 20}% + 60px)` // flies past
      : '10%';

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {phase === 'launch' && (
        <div
          className="absolute top-1/2 -translate-y-1/2 text-4xl font-bold"
          style={{
            left: direction === 'right' ? '20%' : 'auto',
            right: direction === 'left' ? '20%' : 'auto',
            animation: `attackFly 0.5s ease-in forwards`,
            '--fly-distance': direction === 'right' ? '300px' : '-300px',
            color: moveColor,
            textShadow: `0 0 10px ${moveColor}, 0 0 20px ${moveColor}`,
          } as React.CSSProperties}
        >
          {moveEmoji}
        </div>
      )}

      {phase === 'impact' && !dodged && (
        <div
          className="absolute top-1/2 -translate-y-1/2 text-5xl"
          style={{
            left: impactLeft,
            animation: 'impactExplosion 0.4s ease-out forwards',
            color: moveColor,
            textShadow: `0 0 20px ${moveColor}`,
          }}
        >
          💥
        </div>
      )}

      {/* Dodge miss effect */}
      {phase === 'impact' && dodged && (
        <div
          className="absolute top-1/2 -translate-y-1/2 text-3xl"
          style={{
            left: '15%',
            animation: 'impactExplosion 0.4s ease-out forwards',
            opacity: 0.5,
          }}
        >
          💨
        </div>
      )}

      {/* Screen flash on impact (only if not dodged) */}
      {phase === 'impact' && !dodged && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: moveColor,
            animation: 'screenFlash 0.3s ease-out forwards',
          }}
        />
      )}
    </div>
  );
}
