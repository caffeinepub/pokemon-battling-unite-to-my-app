# Specification

## Summary
**Goal:** Build a full anime-style Pokémon RPG web game following Ash's journey, featuring a real-time battle system, story campaign, gym battles, Team Rocket encounters, evolution items, and persistent server-side game state.

**Planned changes:**

### Intro & Onboarding
- Professor Oak anime-style introduction screen (white lab coat, gray hair) that greets the player and transitions to starter selection
- Trainer name permanently set to "Ash"
- Animated starter Pokémon selection screen with idle animations (bounce/sway/glow); Pikachu featured as a selectable starter

### Pokémon & Battle Data
- Pikachu defined as strongest Pokémon: ATK=100, DEF=45, SPD=40
- Pikachu's four moves: Electro Web (+45 electric ATK), Electro Ball (+45 ATK), Iron Tail (+25 DEF), Quick Attack (+30 SPD)
- Opponent pool of at least 30 distinct Pokémon with unique move sets; no consecutive repeat opponents
- At least 8 gym leaders with unique, diverse Pokémon teams

### Real-Time Battle System
- No turn-based mechanics; all moves usable at any time
- Player can reposition/dodge incoming moves by tapping or swiping
- Move collision detection: stronger move wins, equal-power moves cancel each other out
- Cinematic attack animations with particle effects, motion blur, and dynamic camera angles
- Strategy text input field during battle; recognized keywords adjust AI behavior or trigger combo animations; strategies saved per battle

### Story & Campaign
- Three story arcs: Johto Journeys, Master Journeys, Ultimate Journeys
- Campaign map screen with multiple episodic battles per arc
- Dramatic cinematic finale sequence for each arc's champion battle
- Story progression saved server-side per player

### Gym Battles
- 8+ gym leaders referencing anime gym episode list, each with a unique battle style
- Badge awarded on gym leader defeat, saved to player profile
- Badge collection displayed on trainer profile/card screen

### Team Rocket Encounters
- Random Team Rocket encounter events during overworld/story navigation
- Classic intro dialogue with Jessie, James, and Meowth character portraits
- "Blasting off" animation and sound effect on defeat
- Team Rocket's Pokémon (Arbok, Weezing, etc.) unique to their encounters

### Evolution Items
- 5+ evolution stone types (Water, Fire, Grass, Electric, Moon Stone) in backend item registry
- Players collect stones during gameplay and optionally apply them to eligible Pokémon
- Player must confirm before evolving; evolution triggers cinematic animation
- Evolved Pokémon have improved stats stored in backend

### Persistence (Backend)
- Player profile: trainer name, Pokémon roster, badges, story arc progress, inventory, battle history (last 20 battles)
- Multiple independent player profiles supported
- All state persists across page reloads

### Visual Theme
- Bold anime-inspired color palette (saturated yellows, reds, electric blues)
- Illustrated battle scene backgrounds (outdoor stadium, gym interior, forest clearing)
- Bold, energetic typography throughout
- All screens visually consistent with Pokémon anime aesthetic

**User-visible outcome:** Players can experience a full anime-style Pokémon RPG as Ash — choosing Pikachu as their starter, battling in real-time with dodge mechanics and strategy input, progressing through three story arcs, defeating gym leaders for badges, encountering Team Rocket, evolving Pokémon with stones, and having all progress saved across sessions.
