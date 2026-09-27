extends SceneTree
## B1μ twin. Decides an assembly, does not render the game.
## godot --headless --path godot/vesper -s res://scripts/b1u_director.gd

func _init() -> void:
	var zone := "courtyard"
	var assembly := "candelabrum"
	var intent := {
		"authority": "B1μ",
		"visual": "Grok atelier (not a chat model)",
		"geometry": "Procedura mates",
		"runtime": "Godot generates the plate; the playable world embodies it",
		"zone": zone,
		"assembly": assembly,
		"phase": "between_scenes",
	}
	var dir := "res://../../public/gre"
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(dir))
	var f := FileAccess.open(ProjectSettings.globalize_path(dir + "/intent.json"), FileAccess.WRITE)
	f.store_string(JSON.stringify(intent, "  "))
	f.close()
	print("[VESPER] B1μ intent written ", dir)
	quit()
