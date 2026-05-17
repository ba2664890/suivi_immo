'use client';

import {
  Phase, Task, Member, getMember, MEMBERS,
  PRIORITY_STYLES, STATUS_STYLES, PHASE_COLORS,
  getStatusNext,
} from '@/lib/data';

interface MyTasksViewProps {
  phases: Phase[];
  activeMemberId: string;
  onToggleAssign: (taskId: string, memberId: string) => void;
  onCycleStatus: (taskId: string) => void;
}

export default function MyTasksView({
  phases, activeMemberId, onToggleAssign, onCycleStatus,
}: MyTasksViewProps) {
  const now = new Date();
  const unlockedPhases = phases.filter(p => now >= p.unlockDate);

  if (unlockedPhases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <i className="ti ti-lock text-5xl text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Aucune phase déverrouillée</h2>
        <p className="text-sm text-gray-500">Le projet démarre le 18 Mai 2026. Revenez bientôt !</p>
      </div>
    );
  }

  const activeMember = getMember(activeMemberId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <i className="ti ti-list-check text-xl text-gray-700" />
        <h2 className="text-lg font-bold text-gray-900">Mes tâches</h2>
        {activeMember && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${activeMember.color} text-white font-semibold`}>
            {activeMember.name}
          </span>
        )}
      </div>

      {unlockedPhases.map(phase => {
        const pc = PHASE_COLORS[phase.id];
        const myTasks = phase.tasks.filter(t => t.assignedTo.includes(activeMemberId));
        const availableTasks = phase.tasks.filter(
          t => !t.assignedTo.includes(activeMemberId) && t.assignedTo.length < 3
        );
        const fullTasks = phase.tasks.filter(
          t => !t.assignedTo.includes(activeMemberId) && t.assignedTo.length >= 3
        );

        return (
          <div key={phase.id} className={`rounded-xl border ${pc.border} ${pc.bg} overflow-hidden`}>
            <div className={`px-4 py-3 border-b ${pc.border} flex items-center gap-2`}>
              <div className={`w-2 h-2 rounded-full ${pc.bgSolid}`} />
              <h3 className={`font-bold text-sm ${pc.text}`}>
                {phase.shortName} — {phase.name}
              </h3>
              <span className="text-xs text-gray-500">({phase.dates})</span>
            </div>

            <div className="p-4 space-y-3">
              {/* My assigned tasks */}
              {myTasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mes tâches assignées</p>
                  {myTasks.map(task => (
                    <TaskCardMy
                      key={task.id}
                      task={task}
                      memberId={activeMemberId}
                      onUnassign={() => onToggleAssign(task.id, activeMemberId)}
                      onCycleStatus={() => onCycleStatus(task.id)}
                    />
                  ))}
                </div>
              )}

              {/* Available tasks */}
              {availableTasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tâches disponibles</p>
                  {availableTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3"
                    >
                      <PriorityBadge priority={task.priority} />
                      <span className="text-sm text-gray-800 flex-1">{task.title}</span>
                      <button
                        onClick={() => onToggleAssign(task.id, activeMemberId)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-200 transition-colors"
                      >
                        <i className="ti ti-plus text-sm" />
                        Je prends
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Full tasks */}
              {fullTasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Complet</p>
                  {fullTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-100 p-3 opacity-60"
                    >
                      <PriorityBadge priority={task.priority} />
                      <span className="text-sm text-gray-500 flex-1">{task.title}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Complet</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Sub-components ----

function TaskCardMy({
  task, memberId, onUnassign, onCycleStatus,
}: {
  task: Task; memberId: string; onUnassign: () => void; onCycleStatus: () => void;
}) {
  const ss = STATUS_STYLES[task.status];
  const ps = PRIORITY_STYLES[task.priority];

  return (
    <div className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <PriorityBadge priority={task.priority} />
          <span className="text-sm font-medium text-gray-900">{task.title}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-50 text-violet-700">
            <i className="ti ti-check text-xs" />
            Ma tâche ✓
          </span>
          <button
            onClick={onCycleStatus}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${ss.bg} ${ss.text} border border-transparent hover:border-gray-300 transition-colors cursor-pointer`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
            {task.status}
          </button>
          <button
            onClick={onUnassign}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <i className="ti ti-x text-xs" />
            Se désassigner
          </button>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const ps = PRIORITY_STYLES[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${ps.bg} ${ps.text} border ${ps.border}`}>
      {priority}
    </span>
  );
}
