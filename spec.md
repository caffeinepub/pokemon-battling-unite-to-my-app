# Elemental Ninja

## Current State
A fully functional Elemental Ninja battle game with:
- 4 elemental ninjas: Kai (Fire), Nya (Water), Zane (Air), Cole (Earth)
- Real-time battle system with cooldown-based moves, no turn limits
- Dodge mechanic, clash system, status effects (burn, confuse, paralyze, rage)
- Strategy text input that triggers visible ninja animations
- Mega Evolution (stat boost, fire glow) and Gigantamax (blue fire aura, 3 G-MAX attacks)
- Elemental Dragon summon per ninja
- XP/leveling system (every battle makes ninjas stronger)
- Dojo challenge system with 4 dojo masters
- Story mode with 5 chapters
- Login page with player counter
- CSS/SVG-drawn ninja silhouettes with elemental weapon idle effects
- Mobile-responsive with bottom nav, touch controls, joystick

## Requested Changes (Diff)

### Add
- Better animated ninja silhouettes: anime-style, unique face per ninja, elemental weapon (Kai=dual fire swords, Nya=water spear, Zane=twin wind fans, Cole=war hammer), headband colors match element
- Full move animations visible during battle: slash arcs, fire bursts, water waves, wind spirals, earth tremors with particle effects
- More intense battle feel: screen shake on heavy hits, flash effects, dramatic move impact visuals
- Splash/login screen: cinematic layout, all 4 ninjas displayed moving, lightning/elemental sparks
- Mega Evolution: ninja glows with their color (not bigger), aura particles surround them
- Gigantamax: ninja glows with BLUE fire aura (not bigger), intense blue energy pulses
- Elemental dragon summons built from their element (fire dragon = pure flames, water = flowing waves, air = wind spirals, earth = boulders)
- Share button on home screen for easy link sharing
- Install App prompt button on home screen
- How to Play guide with beginner instructions

### Modify
- NinjaSilhouette: improve visual quality, more anime-styled body, unique faces, element-specific idle animations
- Battle screen: make move buttons circular, joystick for dodge control, more real-time and fluid feel
- Login page: remove any Pikachu/Ash references (already removed), keep clean ninja theme
- Strategy text input: improve keyword detection, show visible reactions when command sent
- Mega/Gigamax: apply intensity aura effects only (no scaling up), fire ninja gets fire aura, gigamax gets blue fire

### Remove
- Any lingering Pokemon/Pikachu/Ash references

## Implementation Plan
1. Improve NinjaSilhouette component with better anime-style SVG art, element-specific weapon animations, unique faces
2. Add AnimatedMoveEffect component with full-screen element move overlays (fire dash burst, water wave, earthquake rumble, air tornado)
3. Enhance Battle.tsx with more cinematic attack/dodge animations, improved move button circles, better clash effects
4. Update LoginPage to show animated ninja lineup with elemental particle effects
5. Ensure Mega/Gigamax only apply aura glows (no resize), fire=orange glow, gigamax=blue fire
6. Validate all builds and type-check
