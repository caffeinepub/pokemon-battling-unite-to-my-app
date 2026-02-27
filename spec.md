# Specification

## Summary
**Goal:** Implement full cinematic, Pokémon-style animated move sequences for all 6 element types in the battle screen, along with enhanced move button UI with cooldown feedback.

**Planned changes:**
- In `AttackAnimation.tsx`, implement complete projectile animations for all 6 element types using `requestAnimationFrame`:
  - **Fire**: fireball with trailing ember particles and explosive radial burst on impact
  - **Water**: blue wave beam with expanding ripple rings and splash burst on impact
  - **Earth**: jagged rock-shard with dust cloud trail and ground-crack shockwave on impact
  - **Wind**: spinning crescent-blade gust with swirling air/leaf particles and slashing impact
  - **Lightning**: instant branching zigzag SVG bolt from attacker to target with afterglow fade and electric spark impact
  - **Shadow**: dark purple void orb with shadow tendrils trailing and dark mist explosion on impact
  - All animations travel along the existing arc/miss-offset trajectory and call `onComplete` when finished; durations range 400–800ms (lightning fastest)
- In `Battle.tsx`, extend move execution to a 3-phase sequence before HP deduction:
  1. **Charge phase**: attacking monster sprite glows in its element color (box-shadow pulse) for ~150ms
  2. **Travel phase**: element-specific projectile animation plays in full
  3. **Impact phase**: element-specific particle burst plays and screen shake triggers (heavier shake when player is hit, lighter when opponent is hit)
  - HP bar and battle log update only after the full 3-phase sequence completes, for both player and opponent moves
- Enhance move buttons in `Battle.tsx`:
  - Display a small element-type color indicator on each button
  - Show a cooldown overlay (darkened fill that depletes over the cooldown period) on recently used moves
  - Add a CSS scale-down press animation (scale to 0.92) on click for tactile feedback
  - Maintain a 2×2 grid layout with minimum 48×48px tap targets on screens narrower than 768px

**User-visible outcome:** Every attack in battle plays a full cinematic animation — charge glow, traveling projectile with element-specific visuals, and an impact effect with screen shake — before damage is applied. Move buttons show element color indicators, cooldown overlays, and satisfying press feedback.
