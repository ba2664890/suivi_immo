'use client';

import { useState, useCallback, useEffect, useSyncExternalStore } from 'react';
import { PHASES, Phase, ViewType, getStatusNext, getMember, Member } from '@/lib/data';
import { AppState, loadState, saveState, StoredTask } from '@/lib/storage';
import MemberSelector from '@/components/pnii/MemberSelector';
import Header from '@/components/pnii/Header';
import Navbar from '@/components/pnii/Navbar';
import MyTasksView from '@/components/pnii/MyTasksView';
import OverviewView from '@/components/pnii/OverviewView';
import PhasesView from '@/components/pnii/PhasesView';
import TeamView from '@/components/pnii/TeamView';

function mergeStoredData(phases: Phase[], stored: AppState | null): Phase[] {
  if (!stored) return phases;
  return phases.map(phase => ({
    ...phase,
    tasks: phase.tasks.map(task => {
      const st = stored.tasks[task.id];
      if (st) {
        return { ...task, assignedTo: st.assignedTo, status: st.status };
      }
      return task;
    }),
  }));
}

function extractTasksFromPhases(phases: Phase[]): Record<string, StoredTask> {
  const tasks: Record<string, StoredTask> = {};
  for (const phase of phases) {
    for (const task of phase.tasks) {
      tasks[task.id] = { id: task.id, assignedTo: task.assignedTo, status: task.status };
    }
  }
  return tasks;
}

// Custom hook: read from localStorage using useSyncExternalStore
const STORAGE_KEY = 'pnii-senegal-data';
let storageListeners: (() => void)[] = [];

function subscribeToStorage(callback: () => void) {
  storageListeners.push(callback);
  return () => {
    storageListeners = storageListeners.filter(l => l !== callback);
  };
}

function getStorageSnapshot(): AppState | null {
  return loadState();
}

function getServerStorageSnapshot(): null {
  return null;
}

function notifyStorageChange() {
  storageListeners.forEach(l => l());
}

export default function Home() {
  const stored = useSyncExternalStore(subscribeToStorage, getStorageSnapshot, getServerStorageSnapshot);

  // All mutable state managed via useState, initialized from stored data
  const [activeMemberId, setActiveMemberId] = useState<string | null>(() => stored?.activeMemberId ?? null);
  const [showMemberSelector, setShowMemberSelector] = useState(() => !stored?.activeMemberId);
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [phases, setPhases] = useState<Phase>(() => stored ? mergeStoredData(PHASES, stored) : PHASES);

  // Persist whenever phases or member changes
  const persist = useCallback((mid: string | null, p: Phase[]) => {
    const state: AppState = {
      activeMemberId: mid,
      tasks: extractTasksFromPhases(p),
      lastSaved: new Date().toISOString(),
    };
    saveState(state);
    notifyStorageChange();
  }, []);

  useEffect(() => {
    persist(activeMemberId, phases);
  }, [activeMemberId, phases, persist]);

  const handleSelectMember = (mid: string) => {
    setActiveMemberId(mid);
    setShowMemberSelector(false);
    setActiveView('overview');
  };

  const handleChangeMember = () => {
    setShowMemberSelector(true);
  };

  const handleToggleAssign = (taskId: string, mid: string) => {
    setPhases(prev => prev.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(task => {
        if (task.id !== taskId) return task;
        const isAssigned = task.assignedTo.includes(mid);
        if (isAssigned) {
          return { ...task, assignedTo: task.assignedTo.filter(id => id !== mid) };
        }
        if (task.assignedTo.length >= 3) return task;
        return { ...task, assignedTo: [...task.assignedTo, mid] };
      }),
    })));
  };

  const handleCycleStatus = (taskId: string) => {
    setPhases(prev => prev.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(task => {
        if (task.id !== taskId) return task;
        return { ...task, status: getStatusNext(task.status) };
      }),
    })));
  };

  // Member selection screen
  if (showMemberSelector || !activeMemberId) {
    return <MemberSelector onSelect={handleSelectMember} />;
  }

  const activeMember = getMember(activeMemberId);
  if (!activeMember) {
    return <MemberSelector onSelect={handleSelectMember} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header activeMember={activeMember} onChangeMember={handleChangeMember} />

      <main className="flex-1 pb-20">
        {activeView === 'my-tasks' && (
          <MyTasksView
            phases={phases}
            activeMemberId={activeMemberId}
            onToggleAssign={handleToggleAssign}
            onCycleStatus={handleCycleStatus}
          />
        )}
        {activeView === 'overview' && (
          <OverviewView phases={phases} />
        )}
        {activeView === 'phases' && (
          <PhasesView
            phases={phases}
            activeMemberId={activeMemberId}
            onToggleAssign={handleToggleAssign}
            onCycleStatus={handleCycleStatus}
          />
        )}
        {activeView === 'team' && (
          <TeamView phases={phases} activeMemberId={activeMemberId} />
        )}
      </main>

      <Navbar activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
