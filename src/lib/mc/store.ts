import { create } from "zustand";
import type { AlternativeId, DecisionRecord, PriorityProfile } from "./types";
import { runSimulation } from "./simulate";
import { GOLDEN_DISRUPTION } from "./seed";

type McState = {
  profile: PriorityProfile;
  durationDays: number;
  decisions: DecisionRecord[];
  hydrated: boolean;
  setProfile: (p: PriorityProfile) => void;
  setDuration: (d: number) => void;
  hydrate: () => void;
  recordDecision: (
    chosen: AlternativeId,
    owner: string,
    rationaleFa: string,
    status: DecisionRecord["status"],
  ) => void;
};

const KEY = "mc-pars-v1";

export const useMcStore = create<McState>((set, get) => ({
  profile: "strategic_customer",
  durationDays: 20,
  decisions: [],
  hydrated: false,
  setProfile: (p) => set({ profile: p }),
  setDuration: (d) => set({ durationDays: d }),
  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<McState>;
        set({
          profile: parsed.profile ?? "strategic_customer",
          durationDays: parsed.durationDays ?? 20,
          decisions: parsed.decisions ?? [],
          hydrated: true,
        });
        return;
      }
    } catch {
      /* ignore */
    }
    set({ hydrated: true });
  },
  recordDecision: (chosen, owner, rationaleFa, status) => {
    const rec: DecisionRecord = {
      id: `DEC-${Date.now()}`,
      simulationId: `SIM-${Date.now()}`,
      chosen,
      status,
      owner,
      rationaleFa,
      overrides: [],
      createdAt: new Date().toISOString(),
    };
    const decisions = [rec, ...get().decisions].slice(0, 40);
    set({ decisions });
    persist(get());
  },
}));

function persist(s: McState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    KEY,
    JSON.stringify({
      profile: s.profile,
      durationDays: s.durationDays,
      decisions: s.decisions,
    }),
  );
}

useMcStore.subscribe((s) => {
  if (!s.hydrated) return;
  persist(s);
});

export function useSimulation() {
  const profile = useMcStore((s) => s.profile);
  const durationDays = useMcStore((s) => s.durationDays);
  return runSimulation({ ...GOLDEN_DISRUPTION, durationDays }, profile);
}
