import * as THREE from "three";

/** Godot 4 FastNoiseLite twin (value + FBM + domain warp). Generates images live. */

function fade(t: number) {
  return t * t * (3 - 2 * t);
}

function hash2(ix: number, iy: number, seed: number) {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function valueNoise(x: number, y: number, seed: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const u = fade(x - x0);
  const v = fade(y - y0);
  const a = hash2(x0, y0, seed);
  const b = hash2(x0 + 1, y0, seed);
  const c = hash2(x0, y0 + 1, seed);
  const d = hash2(x0 + 1, y0 + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x: number, y: number, seed: number, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + i * 101);
    norm += amp;
    amp *= 0.5;
    freq *= 2.02;
  }
  return sum / (norm || 1);
}

export function warp(x: number, y: number, seed: number, amp = 0.42) {
  const wx = fbm(x + 5.2, y + 1.3, seed, 3);
  const wy = fbm(x + 9.1, y + 4.7, seed + 17, 3);
  return { x: x + (wx - 0.5) * amp * 2, y: y + (wy - 0.5) * amp * 2 };
}
