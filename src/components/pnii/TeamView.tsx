'use client';

import {
  Phase, Member, getMember, MEMBERS,
  computeMemberScore, PRIORITY_POINTS, PHASE_COLORS,
} from '@/lib/data';

interface TeamViewProps {
  phases: Phase[];
  activeMemberId: string;
}

export default function TeamView({ phases, activeMemberId }: TeamViewProps) {
  const now = new Date();

  // Compute scores and sort
  const memberScores = MEMBERS.map(member => {
    const score = computeMemberScore(member.id, phases);
    const assignedTasks = phases.flatMap(p => p.tasks).filter(t => t.assignedTo.includes(member.id));
    const done = assignedTasks.filter(t => t.status === 'Terminé').length;
    const inProgress = assignedTasks.filter(t => t.status === 'En cours').length;
    const todo = assignedTasks.filter(t => t.status === 'À faire').length;
    const taskDetails = assignedTasks.map(t => {
      const phase = phases.find(p => p.id === t.phaseId);
      return { ...t, phaseName: phase?.shortName ?? '', phaseId: t.phaseId };
    });

    return { member, score, done, inProgress, todo, total: assignedTasks.length, taskDetails };
  }).sort((a, b) => b.score - a.score);

  const maxScore = Math.max(...memberScores.map(m => m.score), 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <i className="ti ti-users text-xl text-gray-700" />
        <h2 className="text-lg font-bold text-gray-900">Équipe</h2>
      </div>

      {/* Ranking */}
      <div className="space-y-3">
        {memberScores.map((ms, idx) => {
          const isActive = ms.member.id === activeMemberId;
          const rank = idx + 1;
          const barWidth = maxScore > 0 ? (ms.score / maxScore) * 100 : 0;

          return (
            <div
              key={ms.member.id}
              className={`bg-white rounded-xl border p-4 transition-all ${
                isActive
                  ? `ring-2 ${ms.member.borderColor} ring-offset-2 shadow-sm`
                  : 'border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0
                  ${rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    rank === 2 ? 'bg-gray-100 text-gray-600' :
                    rank === 3 ? 'bg-orange-50 text-orange-700' :
                    'bg-gray-50 text-gray-400'}`}
                >
                  {rank}
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full ${ms.member.color} flex items-center justify-center text-white font-bold text-xs`}
                  >
                    {ms.member.initial}
                  </div>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[8px] font-bold px-1 rounded-full">
                      Moi
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{ms.member.name}</p>
                    {isActive && (
                      <span className="text-[9px] font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full px-1.5 py-0.5">
                        Moi
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{ms.member.role}</p>

                  {/* Score bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-700">{ms.score} pts</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ms.member.color} rounded-full transition-all duration-500`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-2 flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-gray-600">
                      <i className="ti ti-list-check text-xs" />
                      {ms.total} tâches
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <i className="ti ti-circle-check text-xs" />
                      {ms.done}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <i className="ti ti-loader text-xs" />
                      {ms.inProgress}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <i className="ti ti-circle-dashed text-xs" />
                      {ms.todo}
                    </span>
                  </div>

                  {/* Task list */}
                  {ms.taskDetails.length > 0 && (
                    <div className="mt-3 space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                      {ms.taskDetails.map(task => {
                        const pc = PHASE_COLORS[task.phaseId];
                        const statusColor =
                          task.status === 'Terminé' ? 'text-green-600 bg-green-50' :
                          task.status === 'En cours' ? 'text-amber-600 bg-amber-50' :
                          'text-gray-500 bg-gray-50';

                        return (
                          <div key={task.id} className="flex items-center gap-2 text-[11px]">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-semibold ${pc.text} ${pc.bg}`}>
                              {task.phaseName}
                            </span>
                            <span className="text-gray-700 truncate flex-1">{task.title}</span>
                            <span className={`px-1.5 py-0.5 rounded font-medium ${statusColor}`}>
                              {task.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scoring legend */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <i className="ti ti-info-circle text-sm" />
          Barème de score
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2">
            <span className="font-bold text-red-700">Critique</span>
            <span className="text-red-600">Terminé = 30 pts · En cours = 15 pts</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2">
            <span className="font-bold text-orange-700">Haute</span>
            <span className="text-orange-600">Terminé = 20 pts · En cours = 10 pts</span>
          </div>
          <div className="flex items-center gap-2 bg-sky-50 rounded-lg px-3 py-2">
            <span className="font-bold text-sky-700">Moyenne</span>
            <span className="text-sky-600">Terminé = 10 pts · En cours = 5 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
