import type { PlannerState } from "../types/room";

const STORAGE_KEY = "room-planner-3d-state";

export function savePlannerStateToLocal(state: PlannerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadPlannerStateFromLocal(): PlannerState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PlannerState;
  } catch {
    return null;
  }
}

export function clearPlannerStateFromLocal() {
  localStorage.removeItem(STORAGE_KEY);
}
