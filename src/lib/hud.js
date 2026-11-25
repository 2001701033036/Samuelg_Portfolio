import { useSyncExternalStore } from "react";
import { sections } from "../data/content";

// Tiny store for the fixed HUD (status label, step label, active section).
let state = {
  section: sections[0].id,
  status: sections[0].status,
  step: sections[0].step,
};
const listeners = new Set();

export function setHud(patch) {
  const changed = Object.keys(patch).some(
    (key) => patch[key] !== undefined && patch[key] !== state[key]
  );
  if (!changed) return;
  const next = { ...state };
  Object.keys(patch).forEach((key) => {
    if (patch[key] !== undefined) next[key] = patch[key];
  });
  state = next;
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const useHud = () => useSyncExternalStore(subscribe, () => state);
