# Specification

## Summary
**Goal:** Overhaul all game visuals with a blended mixed aesthetic combining dark/edgy anime (Naruto/Demon Slayer/Bleach), pixel-art retro sprite animation, and painted/ink-brush (sumi-e) styles across all existing game screens.

**Planned changes:**
- Update `NinjaBattleSprite.tsx` and `AnimatedPokemon.tsx` to apply `image-rendering: pixelated` / `crisp-edges` to all 6 monster sprite containers, with step-based CSS `@keyframes` idle animations and anime-style motion-trail attack animations, plus element-specific aura glow colors (fire, water, earth, wind, lightning, shadow).
- Update `Battle.tsx` to render 6 distinct multi-layer anime-style battle backgrounds (fire dojo, water temple, bamboo forest, storm peak, shadow realm, earth canyon) using CSS gradients, layered pseudo-elements, and SVG overlays, each with element-matched atmospheric particle effects (embers, mist, leaves, lightning flashes, shadow wisps, dust motes) and speed-line overlays triggered on attack animations.
- Update `AttackAnimation.tsx` to include anime-style impact frames: radial burst lines, afterimage trails, and shockwave rings with bold ink outlines.
- Add brushstroke/ink-style decorative SVG borders, dividers, and `clip-path` accents to UI panels in `GameLore.tsx`, `StoryCampaign.tsx`, `GymBattles.tsx`, and `GameHome.tsx`; replace plain `<hr>` separators with horizontal brushstroke SVG dividers; apply Bangers font with ink-texture text-shadow to chapter/arc title headers.
- Update `LoginPage.tsx` animated background to use brushstroke-style particle streaks or ink-wash gradients instead of plain circular particles.
- Update `GameHome.tsx` navigation cards with dark anime aesthetic: dark backgrounds, glowing elemental accent borders, brushstroke section separators, and Bangers font headers.
- Use pixel-art sprite sheet images for all 6 monsters in idle animations; use new anime-style battle background images per element type.
- Ensure all new animations respect existing `@media (max-width: 767px)` reduced-animation rules and render correctly from 320px to 1440px wide.

**User-visible outcome:** All game screens display a cohesive mixed aesthetic of dark anime, pixel-art sprite animation, and sumi-e ink-brush styling — with animated elemental battle arenas, pixel-art monster sprites, brushstroke UI borders, and atmospheric particle effects throughout.
