import React, { useEffect, useState } from 'react';

interface AttackAnimationProps {
  moveName: string;
  moveType: string;
  moveColor: string;
  moveEmoji: string;
  direction: 'left' | 'right';
  onComplete?: () => void;
}

export default function AttackAnimation({
  moveName,
  moveType,
  moveColor,
  moveEmoji,
  direction,
  onComplete,
}: AttackAnimationProps) {
  const [phase, setPhase] = useState<'launch' | 'impact' | 'done'>('launch');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('impact'), 500);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

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

      {phase === 'impact' && (
        <div
          className="absolute top-1/2 -translate-y-1/2 text-5xl"
          style={{
            left: direction === 'right' ? '70%' : '10%',
            animation: 'impactExplosion 0.4s ease-out forwards',
            color: moveColor,
            textShadow: `0 0 20px ${moveColor}`,
          }}
        >
          💥
        </div>
      )}

      {/* Screen flash on impact */}
      {phase === 'impact' && (
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
