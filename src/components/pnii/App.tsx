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

  // Load tasks from database on mount and poll every 5 seconds for real-time collaborative updates
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
                const dbAssigned = dbTask.assignedTo;
                const dbStatus = dbTask.status;
                
                // Compare assignment arrays
                const isAssignedEqual = 
                  task.assignedTo.length === dbAssigned.length &&
                  task.assignedTo.every((val, index) => val === dbAssigned[index]);
                const isStatusEqual = task.status === dbStatus;

                // Only update local state if there's a difference to avoid screen flickering
                if (!isAssignedEqual || !isStatusEqual) {
                  return {
                    ...task,
                    assignedTo: dbAssigned,
                    status: dbStatus
                  };
                }
              }
              return task;
            })
          })));
        }
      } catch (err) {
        console.error('Failed to load tasks from SQLite database:', err);
      }
    }
    
    // Initial fetch
    loadDbTasks();

    // Poll database every 5 seconds in background
    const interval = setInterval(loadDbTasks, 5000);

    return () => clearInterval(interval);
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

    // Find the phase containing this task
    const parentPhase = phases.find(p => p.tasks.some(t => t.id === taskId));
    if (!parentPhase) return;

    // Find if the member is already assigned to another task IN THIS PHASE
    const alreadyAssignedTaskInPhase = parentPhase.tasks.find(
      t => t.id !== taskId && t.assignedTo.includes(mid)
    );

    if (alreadyAssignedTaskInPhase) {
      const memberName = getMember(mid)?.name ?? "Ce membre";
      toast({
        title: "Profil occupé dans cette phase",
        description: `${memberName} est déjà assigné à une tâche dans la phase "${parentPhase.name}" : "${alreadyAssignedTaskInPhase.title}". Veuillez d'abord vous désassigner de cette tâche.`,
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
          // Remove member from task assignees
          nextAssignedTo = task.assignedTo.filter(id => id !== mid);
        } else {
          // If the task has already reached the maximum of 3 participants
          if (task.assignedTo.length >= 3) {
            toast({
              title: "Tâche complète",
              description: `Cette tâche a atteint sa limite maximale de 3 participants.`,
              variant: "destructive",
            });
            return task;
          }
          nextAssignedTo = [...task.assignedTo, mid];
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
