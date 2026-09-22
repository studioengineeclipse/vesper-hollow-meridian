extends RefCounted
class_name ImagineBridge
## Fuse Grok Imagine albedo plates with Godot-generated live maps.
## Imagine writes JPEG plates into ../../public/textures.
## The live game ports baker.gd as src/game/godotBake.ts.

const PLATE_DIR := "res://../../public/textures"

static func plate_path(name: String) -> String:
	return "%s/%s.jpg" % [PLATE_DIR, name]
