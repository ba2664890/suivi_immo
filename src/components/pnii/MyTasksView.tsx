'use client';

import {
  Phase, Task, getMember, MEMBERS,
  PRIORITY_STYLES, STATUS_STYLES, PHASE_COLORS,
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
      <div className="flex flex-col items-center justify-center py-24 text-center px-4 mesh-bg">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-5 shadow-lg">
          <i className="ti ti-lock text-3xl text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-700 mb-2">Aucune phase déverrouillée</h2>
        <p className="text-sm text-gray-400">Le projet démarre le 18 Mai 2026. Revenez bientôt !</p>
      </div>
    );
  }

  const activeMember = getMember(activeMemberId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/20">
          <i className="ti ti-list-check text-lg text-white" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900">Mes tâches</h2>
        {activeMember && (
          <span className={`text-[10px] px-2.5 py-1 rounded-full ${activeMember.color} text-white font-bold shadow-sm`}>
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
          <div key={phase.id} className={`rounded-2xl border ${pc.border} ${pc.bg} overflow-hidden shadow-sm`}>
            {/* Phase header */}
            <div className={`px-4 py-3 border-b ${pc.border} flex items-center gap-2.5 bg-gradient-to-r ${pc.bg} to-white/50`}>
              <div className={`w-8 h-8 rounded-lg ${pc.bgSolid} flex items-center justify-center text-white font-bold text-[9px] shadow-sm`}>
                {phase.shortName}
              </div>
              <h3 className={`font-bold text-sm ${pc.text}`}>
                {phase.name}
              </h3>
              <span className="text-[10px] text-gray-400 font-medium ml-auto">{phase.dates}</span>
            </div>

            <div className="p-4 space-y-4">
              {/* My assigned tasks */}
              {myTasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest flex items-center gap-1.5">
                    <i className="ti ti-user-check text-xs" />
                    Mes tâches assignées
                  </p>
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
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <i className="ti ti-plus-circle text-xs" />
                    Tâches disponibles
                  </p>
                  {availableTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 bg-white rounded-xl border border-gray-200/80 p-3.5 card-hover"
                    >
                      <PriorityBadge priority={task.priority} />
                      <span className="text-sm text-gray-800 flex-1 font-medium">{task.title}</span>
                      <button
                        onClick={() => onToggleAssign(task.id, activeMemberId)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-[11px] font-bold rounded-xl shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/30 transition-all"
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
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <i className="ti ti-ban text-xs" />
                    Tâches complètes (3 personnes maximum)
                  </p>
                  {fullTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 bg-gray-50/70 rounded-xl border border-gray-200/50 p-3 opacity-70"
                    >
                      <PriorityBadge priority={task.priority} />
                      <span className="text-sm text-gray-400 flex-1 font-medium italic line-through decoration-gray-300">{task.title}</span>
                      <div className="flex items-center gap-1.5">
                        {task.assignedTo.map(id => {
                          const assignee = getMember(id);
                          return assignee ? (
                            <div key={id} className="flex items-center gap-1 bg-white border border-gray-200/60 pl-1 pr-2 py-0.5 rounded-full shadow-sm" title={assignee.name}>
                              <div className={`w-4 h-4 rounded-full ${assignee.color} flex items-center justify-center text-white font-bold text-[7px]`}>
                                {assignee.initial}
                              </div>
                              <span className="text-[9px] font-bold text-gray-500">{assignee.name.split(' ')[0]}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-lg shadow-sm">Complet</span>
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

function TaskCardMy({
  task, onUnassign, onCycleStatus,
}: {
  task: Task; memberId: string; onUnassign: () => void; onCycleStatus: () => void;
}) {
  const ss = STATUS_STYLES[task.status];

  return (
    <div className="bg-white rounded-xl border border-violet-200/60 p-3.5 shadow-sm shadow-violet-500/5">
      <div className="flex items-start gap-2.5 mb-2">
        <PriorityBadge priority={task.priority} />
        <span className="text-sm font-semibold text-gray-900 flex-1 leading-snug">{task.title}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-violet-50 to-pink-50 text-violet-700 border border-violet-200/60">
          <i className="ti ti-check text-xs" />
          Ma tâche ✓
        </span>
        <button
          onClick={onCycleStatus}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${ss.bg} ${ss.text} border border-transparent hover:border-gray-300 transition-all cursor-pointer`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
          {task.status}
        </button>
        <button
          onClick={onUnassign}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all"
        >
          <i className="ti ti-x text-xs" />
          Se désassigner
        </button>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const ps = PRIORITY_STYLES[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${ps.bg} ${ps.text} border ${ps.border}`}>
      {priority}
    </span>
  );
}
