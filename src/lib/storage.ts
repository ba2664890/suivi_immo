// ============================================================
// PNII Sénégal — localStorage Persistence
// ============================================================

import { TaskStatus } from './data';

const STORAGE_KEY = 'pnii-senegal-data';

export interface StoredTask {
  id: string;
  assignedTo: string[];
  status: TaskStatus;
}

export interface AppState {
  activeMemberId: string | null;
  tasks: Record<string, StoredTask>; // taskId -> StoredTask
  lastSaved: string;
}

export function loadState(): AppState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    state.lastSaved = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear state:', e);
  }
}
