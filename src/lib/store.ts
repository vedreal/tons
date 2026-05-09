// Tiny global store using React + localStorage
import { useEffect, useState, useSyncExternalStore } from "react";

type State = {
  tons: number;
  energy: number;
  maxEnergy: number;
  taps: number;
  refCode: string;
  friends: number;
  completedTasks: string[];
};

const KEY = "ton-season-state-v1";
const initial: State = {
  tons: 1280,
  energy: 1000,
  maxEnergy: 1000,
  taps: 0,
  refCode: "TONS" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  friends: 3,
  completedTasks: [],
};

let state: State = (() => {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch { return initial; }
})();

const listeners = new Set<() => void>();
function emit() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  subscribe: (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); },
  addTons(n: number) { state = { ...state, tons: state.tons + n, taps: state.taps + 1 }; emit(); },
  spendEnergy(n: number) { state = { ...state, energy: Math.max(0, state.energy - n) }; emit(); },
  regen(n: number) { state = { ...state, energy: Math.min(state.maxEnergy, state.energy + n) }; emit(); },
  completeTask(id: string, reward: number) {
    if (state.completedTasks.includes(id)) return;
    state = { ...state, completedTasks: [...state.completedTasks, id], tons: state.tons + reward };
    emit();
  },
};

export function useStore() {
  const snap = useSyncExternalStore(store.subscribe, store.get, store.get);
  // energy regen
  useEffect(() => {
    const t = setInterval(() => store.regen(2), 1000);
    return () => clearInterval(t);
  }, []);
  return snap;
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
