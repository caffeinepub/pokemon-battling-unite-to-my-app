# Specification

## Summary
**Goal:** Replace the dodge button in the battle screen with a drag-to-reposition mechanic, where the player moves their Pokémon sprite to dodge incoming attacks.

**Planned changes:**
- Remove the dedicated "Dodge" button (and any associated keybind) from the battle UI.
- Make the player's Pokémon sprite draggable (mouse drag on desktop, touch drag on mobile) within the player's side of the battle field.
- Implement real-time positional overlap detection between incoming attack projectiles and the Pokémon sprite's current position to determine hit or miss.
- If the player repositions their Pokémon out of the projectile's path, the attack misses and deals no damage; otherwise it connects normally.

**User-visible outcome:** Players dodge opponent attacks by physically dragging their Pokémon sprite away from the incoming projectile instead of pressing a button. The Pokémon follows the drag in real time on both desktop and mobile.
