extends SceneTree
## Godot 4 image generator — twin of src/game/godotBake.ts
## FastNoiseLite FBM + domain warp composites Imagine plates into live PBR maps.
## Usage: godot --headless --path godot/vesper -s res://scripts/baker.gd

const OUT := "res://../../public/textures/godot"

func _init() -> void:
	print("[VESPER] Godot baker online — FastNoiseLite FBM")
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(OUT))
	_bake_kind("stone", 3)
	_bake_kind("wood", 23)
	_bake_kind("plaster", 41)
	_bake_kind("water", 7)
	print("[VESPER] wrote plates to ", OUT)
	quit()

func _bake_kind(kind: String, seed: int) -> void:
	var noise := FastNoiseLite.new()
	noise.noise_type = FastNoiseLite.TYPE_VALUE
	noise.fractal_type = FastNoiseLite.FRACTAL_FBM
	noise.fractal_octaves = 5
	noise.frequency = 0.018
	noise.seed = seed
	noise.domain_warp_enabled = true
	noise.domain_warp_amplitude = 22.0
	var img := Image.create(256, 256, false, Image.FORMAT_RGBA8)
	for y in 256:
		for x in 256:
			var n := noise.get_noise_2d(x, y) * 0.5 + 0.5
			var crevice := maxf(0.0, 0.46 - n) * 2.1
			var dirt := 1.0 - 0.2 * crevice
			var c := Color(0.42 * dirt * (0.92 + n * 0.16), 0.38 * dirt * (0.94 + n * 0.12), 0.32 * dirt, 1.0)
			if kind == "water":
				c = Color(0.12 + n * 0.08, 0.2 + n * 0.1, 0.24 + n * 0.12, 0.8)
			img.set_pixel(x, y, c)
	var path := "%s/%s_godot.png" % [OUT, kind]
	img.save_png(path)
	print("  baked ", path)
