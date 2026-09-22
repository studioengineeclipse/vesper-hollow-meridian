# VESPER — The Hollow Meridian

First-person drowned baroque observatory.

**Imagine writes albedo plates. Godot generates live wear, wetness, and water normals. The game rasterizes them at 60fps.**

```
Imagine plates  +  Godot FastNoiseLite  =  PBR on marble, walnut, limestone, water
```

## Fusion (what is actually possible)

Godot cannot be the browser rasterizer in this workspace. Godot **can** generate images. That is the connection:

| Layer | Where | Role |
|---|---|---|
| Albedo | Grok Imagine → `public/textures/*.jpg` | Photographed stone, wood, metal, dusk sky |
| Image generator | Godot 4 `godot/vesper/scripts/baker.gd` and twin `src/game/godotBake.ts` | FastNoiseLite FBM + domain warp |
| Live water | `GodotLive.tick` every 50ms | Scrolling normal maps |
| Rasterizer | Three.js WebGL | First-person courtyard, palace wings, crypt |

Press **G** in-game to pause/resume the live baker. HUD shows `godot live`.

## Godot baker (optional local)

Open `godot/vesper` in Godot 4.3+ or:

```bash
godot --headless --path godot/vesper -s res://scripts/baker.gd
```
