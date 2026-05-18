'use client';

import { useState, useCallback, useEffect } from 'react';
import { PHASES, Phase, ViewType, getMember } from '@/lib/data';
import { AppState, loadState, saveState, StoredTask } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
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

export default function App() {
  // Since this component is loaded with ssr: false, localStorage is always available
  const [activeMemberId, setActiveMemberId] = useState<string | null>(() => {
    const stored = loadState();
    return stored?.activeMemberId ?? null;
  });
  const [showMemberSelector, setShowMemberSelector] = useState(() => {
    const stored = loadState();
    return !stored?.activeMemberId;
  });
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [phases, setPhases] = useState<Phase[]>(() => {
    const stored = loadState();
    return stored ? mergeStoredData(PHASES, stored) : PHASES;
  });

  // Load tasks from database on mount to ensure all users have the same shared state
  useEffect(() => {
    async function loadDbTasks() {
      try {
        const res = await fetch('/api/tasks');
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        
        if (data.tasks) {
          setPhases(prev => prev.map(phase => ({
            ...phase,
            tasks: phase.tasks.map(task => {
              const dbTask = data.tasks[task.id];
              if (dbTask) {
                return {
                  ...task,
                  assignedTo: dbTask.assignedTo,
                  status: dbTask.status
                };
              }
              return task;
            })
          })));
        }
      } catch (err) {
        console.error('Failed to load tasks from SQLite database:', err);
      }
    }
    loadDbTasks();
  }, []);

  // Persist local settings (like active member selection)
  const persist = useCallback((mid: string | null, p: Phase[]) => {
    const state: AppState = {
      activeMemberId: mid,
      tasks: extractTasksFromPhases(p),
      lastSaved: new Date().toISOString(),
    };
    saveState(state);
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
    // Find the task in current state
    const targetTask = phases.flatMap(p => p.tasks).find(t => t.id === taskId);
    const isCurrentlyAssigned = targetTask?.assignedTo.includes(mid);

    // RESTRICTION: A member cannot unassign another member!
    if (isCurrentlyAssigned && mid !== activeMemberId) {
      const memberName = getMember(mid)?.name ?? "Ce membre";
      toast({
        title: "Action interdite",
        description: `Seul ${memberName} peut retirer sa candidature pour cette tâche. Vous ne pouvez pas désassigner un autre membre.`,
        variant: "destructive",
      });
      return;
    }

    // Find if the member is already assigned to some task in the project
    const alreadyAssignedTask = phases
      .flatMap(p => p.tasks)
      .find(t => t.assignedTo.includes(mid));

    // Is the member already assigned to THIS task?
    const isAssignedToThis = alreadyAssignedTask?.id === taskId;

    if (alreadyAssignedTask && !isAssignedToThis) {
      const memberName = getMember(mid)?.name ?? "Ce membre";
      toast({
        title: "Profil déjà occupé",
        description: `${memberName} est déjà assigné à la tâche : "${alreadyAssignedTask.title}". Veuillez d'abord le désassigner de sa tâche.`,
        variant: "destructive",
      });
      return;
    }

    setPhases(prev => prev.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(task => {
        if (task.id !== taskId) return task;
        const isAssigned = task.assignedTo.includes(mid);
        let nextAssignedTo: string[] = [];
        
        if (isAssigned) {
          nextAssignedTo = [];
        } else {
          // If the task is already chosen by someone else
          if (task.assignedTo.length >= 1) {
            const currentAssignee = getMember(task.assignedTo[0]);
            toast({
              title: "Tâche déjà occupée",
              description: `Cette tâche a déjà été choisie par ${currentAssignee?.name ?? "quelqu'un d'autre"}.`,
              variant: "destructive",
            });
            return task;
          }
          nextAssignedTo = [mid];
        }

        // Sync asynchronously with SQLite database
        fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: task.id,
            assignedTo: nextAssignedTo,
            status: task.status
          })
        }).catch(err => console.error('Failed to sync assignment to DB:', err));

        return { ...task, assignedTo: nextAssignedTo };
      }),
    })));
  };

  const handleCycleStatus = (taskId: string) => {
    setPhases(prev => prev.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(task => {
        if (task.id !== taskId) return task;
        const next = task.status === 'À faire' ? 'En cours' : task.status === 'En cours' ? 'Terminé' : 'À faire';
        
        // Sync asynchronously with SQLite database
        fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: task.id,
            assignedTo: task.assignedTo,
            status: next
          })
        }).catch(err => console.error('Failed to sync status to DB:', err));

        return { ...task, status: next };
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
    <div className="min-h-screen flex flex-col mesh-bg">
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
