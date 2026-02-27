import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

interface NinjaBattleSpriteProps {
  imagePath: string;
  element: string;
  isAttacking?: boolean;
  isDodging?: boolean;
  isHit?: boolean;
  isCharging?: boolean;
  flipX?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDangerGlow?: boolean;
}

export interface NinjaBattleSpriteHandle {
  triggerCharge: () => void;
}

const ELEMENT_GLOW: Record<string, string> = {
  fire:      '0 0 30px 12px rgba(255,106,0,0.85)',
  water:     '0 0 30px 12px rgba(0,180,255,0.85)',
  earth:     '0 0 30px 12px rgba(139,94,60,0.85)',
  wind:      '0 0 30px 12px rgba(168,230,207,0.85)',
  lightning: '0 0 30px 12px rgba(255,230,0,0.85)',
  shadow:    '0 0 30px 12px rgba(124,58,237,0.85)',
};

const ELEMENT_BADGE: Record<string, string> = {
  fire:      '🔥',
  water:     '💧',
  earth:     '🪨',
  wind:      '🌪️',
  lightning: '⚡',
  shadow:    '🌑',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'w-20 h-20',
  md: 'w-28 h-28',
  lg: 'w-36 h-36',
};

const NinjaBattleSprite = forwardRef<NinjaBattleSpriteHandle, NinjaBattleSpriteProps>(
  (
    {
      imagePath,
      element,
      isAttacking = false,
      isDodging = false,
      isHit = false,
      isCharging = false,
      flipX = false,
      size = 'lg',
      showDangerGlow = false,
    },
    ref
  ) => {
    const [internalCharging, setInternalCharging] = useState(false);

    useImperativeHandle(ref, () => ({
      triggerCharge: () => {
        setInternalCharging(true);
        setTimeout(() => setInternalCharging(false), 200);
      },
    }));

    const charging = isCharging || internalCharging;

    let animClass = '';
    if (isHit) animClass = 'hit-recoil-left';
    else if (isAttacking) animClass = 'ninja-attack-lunge';
    else if (isDodging) animClass = 'ninja-dodge';

    const glowStyle: React.CSSProperties = {};
    if (charging) {
      glowStyle.boxShadow = ELEMENT_GLOW[element] || ELEMENT_GLOW.fire;
      glowStyle.filter = 'brightness(1.6) saturate(1.4)';
      glowStyle.transition = 'box-shadow 0.05s, filter 0.05s';
    } else if (showDangerGlow) {
      glowStyle.boxShadow = '0 0 20px 8px rgba(255,50,50,0.7)';
      glowStyle.filter = 'brightness(1.1)';
    }

    return (
      <div className={`relative inline-block ${SIZE_CLASSES[size]}`}>
        <div
          className={`w-full h-full rounded-xl overflow-hidden ${animClass}`}
          style={{
            transform: flipX ? 'scaleX(-1)' : undefined,
            ...glowStyle,
          }}
        >
          <img
            src={imagePath}
            alt={element}
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
        {/* Element badge */}
        <div className="absolute -bottom-1 -right-1 text-lg leading-none select-none">
          {ELEMENT_BADGE[element] || '✨'}
        </div>
      </div>
    );
  }
);

NinjaBattleSprite.displayName = 'NinjaBattleSprite';

export default NinjaBattleSprite;
