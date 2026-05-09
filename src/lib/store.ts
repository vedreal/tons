import { useEffect, useSyncExternalStore } from "react";

type State = {
  tons: number;
  energy: number;
  maxEnergy: number;
  winning: number;
  refCode: string;
  friends: number;
  completedTasks: string[];
};

const KEY = "ton-season-state-v2";
const initial: State = {
  tons: 0,
  energy: 10,
  maxEnergy: 10,
  winning: 0,
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
  addTons(n: number) { state = { ...state, tons: state.tons + n }; emit(); },
  spendGameEnergy() {
    if (state.energy <= 0) return false;
    state = { ...state, energy: state.energy - 1 };
    emit();
    return true;
  },
  addWinning() { state = { ...state, winning: state.winning + 1 }; emit(); },
  completeTask(id: string, reward: number) {
    if (state.completedTasks.includes(id)) return;
    state = { ...state, completedTasks: [...state.completedTasks, id], tons: state.tons + reward };
    emit();
  },
};

export function useStore() {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

export { useEffect };
