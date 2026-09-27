/** B1μ director — intent, authority, memory. Does not render. */

export type Zone = "courtyard" | "chart" | "library" | "instruments" | "crypt";
export type AssemblyId = "candelabrum" | "reliquary" | "chartstand" | "maskplinth";
export type Phase = "playing" | "between_scenes";

export type Intent = {
  id: string;
  zone: Zone;
  assembly: AssemblyId;
  phase: Phase;
  reason: string;
  seed: number;
};

export type Receipt = {
  id: string;
  assembly: AssemblyId;
  zone: Zone;
  phase: Phase;
  ok: boolean;
  note: string;
  x: number;
  y: number;
  z: number;
};

const ORDER: AssemblyId[] = ["candelabrum", "reliquary", "chartstand", "maskplinth"];

export function zoneOf(x: number, z: number): Zone {
  if (z > 18 && Math.abs(x) < 6) return "crypt";
  if (z < -16 && Math.abs(x) < 6) return "chart";
  if (x < -16 && Math.abs(z) < 6) return "library";
  if (x > 16 && Math.abs(z) < 6) return "instruments";
  return "courtyard";
}

function assemblyFor(zone: Zone, n: number): AssemblyId {
  if (zone === "crypt") return "maskplinth";
  if (zone === "chart") return "chartstand";
  if (zone === "library") return "reliquary";
  if (zone === "instruments") return "candelabrum";
  return ORDER[n % ORDER.length] ?? "candelabrum";
}

export class B1uDirector {
  receipts: Receipt[] = [];
  private cool = 0;
  private serial = 0;
  enabled = true;
  readonly cap = 8;

  tick(dt: number) {
    this.cool = Math.max(0, this.cool - dt);
  }

  propose(x: number, z: number, moving: boolean): Intent | null {
    if (!this.enabled || this.cool > 0 || this.receipts.length >= this.cap) return null;
    if (!moving && this.receipts.length > 0) return null;
    return this.make(x, z, "playing");
  }

  between(x: number, z: number): Intent {
    return this.make(x, z, "between_scenes");
  }

  accept(r: Receipt) {
    this.receipts.push(r);
    this.cool = r.phase === "between_scenes" ? 1.2 : 6.5;
  }

  reset() {
    this.receipts = [];
    this.cool = 0;
  }

  status() {
    const last = this.receipts[this.receipts.length - 1];
    if (!this.enabled) return "forge dark";
    if (!last) return "B1μ listening";
    return `B1μ ${last.assembly} · ${this.receipts.length}`;
  }

  private make(x: number, z: number, phase: Phase): Intent {
    const zone = zoneOf(x, z);
    this.serial += 1;
    const assembly = assemblyFor(zone, this.serial);
    return {
      id: `gre-${this.serial}`,
      zone,
      assembly,
      phase,
      reason: phase === "between_scenes" ? "reconstruct the room before entry" : `dress ${zone} from play`,
      seed: (Math.imul(this.serial, 1103515245) ^ Math.floor(x * 10 + z * 17)) >>> 0,
    };
  }
}
