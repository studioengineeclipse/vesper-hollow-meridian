import * as THREE from "three";
import { fbm, warp, type BakeKind } from "../godotBake";

/** Grok visual cortex at runtime: paints a unique plate from palace DNA.
 *  Not a 60fps image model. One canvas per embodied prop. */

export function paintPlate(src: THREE.Texture | undefined, kind: BakeKind, seed: number, size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const img = src?.image as CanvasImageSource | undefined;
  if (img) ctx.drawImage(img, 0, 0, size, size);
  else {
    ctx.fillStyle = kind === "metal" ? "#6a5a3a" : "#6b5a48";
    ctx.fillRect(0, 0, size, size);
  }
  const data = ctx.getImageData(0, 0, size, size);
  const scale = 4.2 + (seed % 5) * 0.35;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const w = warp((x / size) * scale, (y / size) * scale, seed, 0.38);
      const n = fbm(w.x, w.y, seed, 4);
      const crevice = Math.max(0, 0.48 - n) * 2;
      const i = (y * size + x) * 4;
      const dirt = 1 - 0.22 * crevice;
      data.data[i] = Math.max(0, Math.min(255, (data.data[i] ?? 0) * dirt * (0.9 + n * 0.18)));
      data.data[i + 1] = Math.max(0, Math.min(255, (data.data[i + 1] ?? 0) * dirt * (0.92 + n * 0.12)));
      data.data[i + 2] = Math.max(0, Math.min(255, (data.data[i + 2] ?? 0) * dirt * (0.88 + (1 - n) * 0.1)));
    }
  }
  ctx.putImageData(data, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}
